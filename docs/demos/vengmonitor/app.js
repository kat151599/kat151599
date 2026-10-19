'use strict';
/* Independent teaching simulator: no production source, backend, or network calls. */
(() => {
 const $=id=>document.getElementById(id);
 const set=(id,value)=>{$(id).textContent=value};
 const t=()=>new Date().toLocaleTimeString('uk-UA');
 const base=[{name:'Приміщення 1',temp:24.2,fan:64},{name:'Приміщення 2',temp:24.6,fan:65},{name:'Приміщення 3',temp:25.1,fan:68}];
 const state={mode:'normal',limit:29,link:true,seconds:0,timer:null,events:[],active:new Map(),sent:new Set(),seq:0,series:[]};
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
   const bad=i===1&&(state.active.has('vent')||state.active.has('heat'));
   return '<div class="room '+(bad?'danger':'')+'"><div><strong>'+r.name+'</strong><small><span class="badge '+(bad?'red':'')+'">'+(bad?'Тривога':'Норма')+'</span></small></div><div class="numbers"><b>'+r.temp.toFixed(1)+' °C</b><small>Вентиляція '+r.fan+'%</small></div></div>';
  }).join('');
  $('monitorRows').innerHTML=rs.map((r,i)=>'<tr><td>'+r.name+'</td><td>'+r.temp.toFixed(1)+' °C</td><td>'+r.fan+'%</td><td>'+(i===1&&(state.active.has('vent')||state.active.has('heat'))?'Тривога':'Норма')+'</td></tr>').join('');
  $('latestEvents').innerHTML=state.events.length?state.events.slice(0,5).map(e=>'<div class="event"><strong class="'+e.type+'">'+e.type.toUpperCase()+' · '+escape(e.message)+'</strong><small>'+e.time+' · '+e.source+' · '+e.delivered+'</small></div>').join(''):'<p>Поки немає аварійних подій. Натисни одну з кнопок сценаріїв.</p>';
  $('logRows').innerHTML=state.events.length?state.events.map(e=>'<tr><td>'+e.time+'</td><td>'+e.source+'</td><td>'+escape(e.message)+'</td><td>'+e.type+'</td><td>'+e.delivered+'</td></tr>').join(''):'<tr><td colspan="5">Немає подій</td></tr>';
  chart();
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
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view)));
 document.querySelectorAll('[data-to]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.to)));
 document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>scenario(b.dataset.scenario)));
 $('reset').addEventListener('click',()=>{scenario('normal');state.events=[];state.sent.clear();state.seq=0;state.series=[];for(let i=0;i<9;i++)state.series.push(base.map((r,j)=>r.temp+Math.sin(i/2+j)*.25));history();render();view('overview')});
 $('threshold').addEventListener('change',e=>{const n=Number(e.target.value);if(!Number.isFinite(n)||n<24||n>40){e.target.value=state.limit;return}state.limit=n;evaluate();history();render()});
 for(let i=0;i<9;i++)state.series.push(base.map((r,j)=>r.temp+Math.sin(i/2+j)*.25));
 history();render();
})();