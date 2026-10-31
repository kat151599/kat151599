'use strict';
/* Independent teaching simulator: no production source, backend, or network calls. */
(() => {
 const $=id=>document.getElementById(id);
 const set=(id,value)=>{$(id).textContent=value};
 const t=()=>new Date().toLocaleTimeString('uk-UA');
 const base=[{name:'Приміщення 1',temp:24.2,fan:64},{name:'Приміщення 2',temp:24.6,fan:65},{name:'Приміщення 3',temp:25.1,fan:68}];
 const state={mode:'normal',limit:29,link:true,seconds:0,timer:null,events:[],active:new Map(),sent:new Set(),seq:0,series:[],selectedRoom:null};
 const rooms=()=>base.map((r,i)=>({...r,temp:i===1&&state.mode==='heat'?Math.max(32,state.limit+2):r.temp,fan:i===1&&state.mode==='vent'?0:r.fan}));
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function addEvent(key,type,message,source){
  const event={id:++state.seq,time:t(),type,message,source,delivered:source==='SERV'&&state.link?'Імітовано':source==='Mirror'?'Локально':'Очікує'};
  if(event.delivered==='Імітовано')state.sent.add(event.id);
  state.events.unshift(event);if(state.events.length>80)state.events.pop();
 }
 function alarm(key,on,message,source='SERV'){
  if(on&&!state.active.has(key)){state.active.set(key,{message,source});addEvent(key,'raised',message,source)}
  else if(!on&&state.active.has(key)){const prev=state.active.get(key);state.active.delete(key);addEvent(key,'cleared',prev.message,prev.source)}
 }
 function deliver(){
  if(!state.link)return;
  for(const e of state.events){if(e.source==='SERV'&&!state.sent.has(e.id)){e.delivered='Імітовано';state.sent.add(e.id)}}
 }
 function evaluate(){
  const room=rooms()[1];
  alarm('vent',room.fan===0,'Приміщення 2: вентиляція 0%');
  alarm('heat',room.temp>state.limit,'Приміщення 2: перевищення температури '+state.limit+' °C');
 }
 function stopTimer(){if(state.timer){clearInterval(state.timer);state.timer=null}}
 function history(){
  state.series.push(rooms().map(r=>r.temp));
  if(state.series.length>12)state.series.shift();
 }
 function scenario(mode){
  if(!['vent','heat','disconnect','normal'].includes(mode))return;
  stopTimer();
  if(state.mode==='disconnect'&&mode!=='disconnect'){
   state.link=true;alarm('connection',false,'');deliver();
  }
  state.mode=mode;
  if(mode==='disconnect'){
   state.link=false;state.seconds=5;
   set('scenarioMessage','Зв’язок Mirror втрачено. Після 5 с виникне умовна тривога (прискорена модель 300 с). Локальний SERV працює.');
   state.timer=setInterval(()=>{
    state.seconds--;
    if(state.seconds<=0){stopTimer();alarm('connection',true,'Mirror: тривала втрата зв’язку із SERV','Mirror');render();}
    else set('scenarioMessage','Mirror очікує heartbeat: '+state.seconds+' с до умовної тривоги. SERV працює локально.');
   },1000);
  }else if(mode==='normal'){state.link=true;alarm('connection',false,'');deliver();set('scenarioMessage','Норму відновлено: попередні активні тривоги завершені подіями cleared.')}
  else set('scenarioMessage',mode==='vent'?'SERV виявив 0% вентиляції, записав raised і передав подію Mirror.':'SERV зафіксував перевищення умовного порогу та створив raised.');
  evaluate();history();render();
 }
 // VENP02: frontend-only inspection of an individual room using the existing simulator state.
 // VISUAL status only. Existing alarm engine remains the single source of alarm truth.
 // Amber: temperature deviates by >=5°C from this room's normal baseline without an active alarm.
 // Red: existing simulator has an actual active room alarm (highest priority).
 function roomSeverity(temp,nominal,alarmActive){return alarmActive?'danger':Math.abs(temp-nominal)>=5?'warn':'normal'}
 function roomStatusText(severity){return severity==='danger'?'Тривога':severity==='warn'?'Попередження':'Норма'}
 function renderRoomInspector(){
  const panel=$('roomInspector'),index=state.selectedRoom;
  if(index===null||index<0||index>=base.length){panel.hidden=true;panel.innerHTML='';return}
  const r=rooms()[index],severity=roomSeverity(r.temp,base[index].temp,index===1&&(state.active.has('vent')||state.active.has('heat')));
  const danger=severity==='danger',warning=severity==='warn';
  const samples=state.series.map(row=>row[index]).filter(Number.isFinite);
  const bottom=Math.floor(Math.min(r.temp,state.limit,...samples))-2;
  const top=Math.ceil(Math.max(r.temp,state.limit,...samples))+2;
  const x=i=>45+i*570/Math.max(1,samples.length-1);
  const y=v=>165-(v-bottom)*132/Math.max(1,top-bottom);
  const points=samples.map((v,i)=>x(i).toFixed(1)+','+y(v).toFixed(1)).join(' ');
  const thresholdY=y(state.limit).toFixed(1);
  const svg='<svg class="room-inspector-graph" viewBox="0 0 670 200" role="img" aria-label="Графік температури '+escape(r.name)+' за '+samples.length+' кроків симуляції">'
   +'<line x1="40" x2="625" y1="165" y2="165" stroke="#3f6570"/>'
   +'<line x1="40" x2="625" y1="'+thresholdY+'" y2="'+thresholdY+'" stroke="#efa96e" stroke-dasharray="6 5"/>'
   +'<text x="45" y="'+(Number(thresholdY)-5)+'">Поріг '+state.limit+' °C</text>'
   +'<polyline points="'+points+'" fill="none" stroke="#8bdfd2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
   +'<text x="44" y="187">Попередні кроки</text><text x="567" y="187">Зараз →</text></svg>';
  const history=state.events.filter(e=>e.message.startsWith(r.name+':')).slice(0,8);
  const list=history.length?'<ol class="room-inspector-history">'+history.map(e=>
   '<li><span class="'+(e.type==='raised'?'raised':'cleared')+'">'+escape(e.type.toUpperCase())+'</span>'
   +'<strong>'+escape(e.message)+'</strong><span class="time">'+escape(e.time)+' · '+escape(e.source)+' · '+escape(e.delivered)+'</span></li>'
  ).join('')+'</ol>':'<p class="room-inspector-empty">Для цього приміщення ще немає подій. Запусти сценарій, щоб перевірити реакцію системи.</p>';
  panel.hidden=false;
  panel.innerHTML='<div class="room-inspector-header"><div><span class="eyebrow">РОЗГОРНУТИЙ ЕКРАН / '+String(index+1).padStart(2,'0')+'</span>'
   +'<h2>'+escape(r.name)+'</h2><p>Демонстраційні показники, історія та події лише цього приміщення.</p></div>'
   +'<button type="button" class="room-inspector-close" data-close-room>Закрити ✕</button></div>'
   +'<div class="room-inspector-measures">'
   +'<div class="room-inspector-measure"><small>Температура</small><strong>'+r.temp.toFixed(1)+' °C</strong></div>'
   +'<div class="room-inspector-measure '+(danger?'critical':warning?'warning':'')+'"><small>Вентиляція</small><strong>'+r.fan+'%</strong></div>'
   +'<div class="room-inspector-measure '+(danger?'critical':warning?'warning':'')+'"><small>Статус</small><strong>'+roomStatusText(severity)+'</strong></div></div>'
   +'<div class="room-inspector-grid">'
   +'<section class="room-inspector-panel"><h3>Температура · історія</h3><p>Синтетичні вимірювання за останні '+samples.length+' кроків. Пунктир — поріг.</p>'+svg+'</section>'
   +'<section class="room-inspector-panel"><h3>Події приміщення</h3><p>Історія raised / cleared, від нових до старих. Загальні події Mirror показані в журналі.</p>'+list+'</section></div>';
 }
 function render(){
  set('alarmCount',String(state.active.size));$('alarmsTile').classList.toggle('alert',state.active.size>0);
  set('mirrorShort',state.link?'На зв’язку':'Нема зв’язку');$('mirrorTile').classList.toggle('warn',!state.link);
  $('mirrorBox').classList.toggle('lost',!state.link);
  set('mirrorState',state.link?'З’єднання активне':'З’єднання втрачено');
  set('mirrorDetail',state.link?'Mirror отримує готові події SERV':'SERV продовжує локальний моніторинг');
  const e=state.events.find(x=>x.delivered==='Імітовано');
  set('lastNotice',e?e.type+': '+e.message:'—');
  document.querySelectorAll('[data-scenario]').forEach(b=>b.classList.toggle('selected',b.dataset.scenario===state.mode));
  const rs=rooms();
  $('rooms').innerHTML=rs.map((r,i)=>{
   const severity=roomSeverity(r.temp,base[i].temp,i===1&&(state.active.has('vent')||state.active.has('heat')));
   const badgeClass=severity==='danger'?'red':severity==='warn'?'orange':'';
   return '<div class="room '+severity+'" aria-current="'+(state.selectedRoom===i?'true':'false')+'"><div><strong>'+r.name+'</strong><small><span class="badge '+badgeClass+'">'+roomStatusText(severity)+'</span></small></div><div class="numbers"><b>'+r.temp.toFixed(1)+' °C</b><small>Вентиляція '+r.fan+'%</small></div><button type="button" class="room-open" data-room="'+i+'" aria-controls="roomInspector" aria-expanded="'+(state.selectedRoom===i?'true':'false')+'">'+(state.selectedRoom===i?'Згорнути деталі ↑':'Деталі приміщення ↗')+'</button></div>';
  }).join('');
  $('monitorRows').innerHTML=rs.map((r,i)=>'<tr><td>'+r.name+'</td><td>'+r.temp.toFixed(1)+' °C</td><td>'+r.fan+'%</td><td>'+roomStatusText(roomSeverity(r.temp,base[i].temp,i===1&&(state.active.has('vent')||state.active.has('heat'))))+'</td></tr>').join('');
  $('latestEvents').innerHTML=state.events.length?state.events.slice(0,5).map(e=>'<div class="event"><strong class="'+e.type+'">'+e.type.toUpperCase()+' · '+escape(e.message)+'</strong><small>'+e.time+' · '+e.source+' · '+e.delivered+'</small></div>').join(''):'<p>Поки немає аварійних подій. Натисни одну з кнопок сценаріїв.</p>';
  $('logRows').innerHTML=state.events.length?state.events.map(e=>'<tr><td>'+e.time+'</td><td>'+e.source+'</td><td>'+escape(e.message)+'</td><td>'+e.type+'</td><td>'+e.delivered+'</td></tr>').join(''):'<tr><td colspan="5">Немає подій</td></tr>';
  chart();
  renderRoomInspector();
 }
 function chart(){
  const h=state.series,w=700,H=265,min=18,max=Math.max(36,Math.ceil(state.limit)+5),colors=['#33a66f','#398cdd','#df9133'],x=i=>45+(w-65)*i/Math.max(1,h.length-1),y=t=>H-38-(t-min)/(max-min)*(H-60);
  let svg='<svg viewBox="0 0 '+w+' '+H+'" role="img" aria-label="Синтетичний графік температур трьох приміщень">';
  for(let n=20;n<max;n+=4)svg+='<line x1="44" x2="682" y1="'+y(n)+'" y2="'+y(n)+'" stroke="#dbe5ec"/><text x="6" y="'+(y(n)+4)+'" fill="#668296" font-size="12">'+n+'°</text>';
  colors.forEach((color,j)=>{svg+='<polyline fill="none" stroke="'+color+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="'+h.map((step,i)=>x(i)+','+y(step[j])).join(' ')+'"/>'});
  $('chart').innerHTML=svg+'</svg>';
 }
 function view(name){
  const titles={overview:['Огляд','Стан локального моніторингу та віддаленого вузла'],monitoring:['Моніторинг','Вигадана історія вимірювань'],log:['Журнал подій','Переходи raised / cleared'],settings:['Налаштування','Навчальні параметри симуляції']};
  if(!titles[name])return;
  document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id==='view-'+name));
  document.querySelectorAll('[data-view]').forEach(b=>{if(b.dataset.view===name)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  set('title',titles[name][0]);set('subtitle',titles[name][1]);
 }
 // Individual tile expansion. Delegation survives the core simulator's redraw of #rooms.
 $('rooms').addEventListener('click',event=>{
  const button=event.target.closest('[data-room]');if(!button)return;
  const index=Number(button.dataset.room);if(!Number.isInteger(index)||index<0||index>=base.length)return;
  state.selectedRoom=state.selectedRoom===index?null:index;
  render();
  if(state.selectedRoom!==null)$('roomInspector').scrollIntoView({block:'nearest',behavior:'auto'});
 });
 $('roomInspector').addEventListener('click',event=>{
  if(!event.target.closest('[data-close-room]'))return;
  const previous=state.selectedRoom;state.selectedRoom=null;render();
  const restored=$('rooms').querySelector('[data-room="'+previous+'"]');
  if(restored)restored.focus({preventScroll:true});
 });
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view)));
 document.querySelectorAll('[data-to]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.to)));
 document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>scenario(b.dataset.scenario)));
 $('reset').addEventListener('click',()=>{scenario('normal');state.events=[];state.sent.clear();state.seq=0;state.series=[];for(let i=0;i<9;i++)state.series.push(base.map((r,j)=>r.temp+Math.sin(i/2+j)*.25));history();render();view('overview')});
 $('threshold').addEventListener('change',e=>{const n=Number(e.target.value);if(!Number.isFinite(n)||n<24||n>40){e.target.value=state.limit;return}state.limit=n;evaluate();history();render()});
 for(let i=0;i<9;i++)state.series.push(base.map((r,j)=>r.temp+Math.sin(i/2+j)*.25));
 history();render();
})();