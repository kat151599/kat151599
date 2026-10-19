'use strict';
/* Solar Demo v2. Independent educational implementation; no production logic or network API. */
(()=>{
const KEY='portfolio-solar-demo-v2';
const IDS=['currency','rate','currencyOut','supplier','manager','client','contact','region','panel','panelCount','consumption','factor','battery','batteryCount','buy','sell','labor','other','date','theme','validDays','prefix'];
const numbers={rate:[.01,100000],panelCount:[1,10000],consumption:[0,100000000],factor:[.5,1],batteryCount:[0,100],buy:[0,1000],sell:[0,1000],labor:[0,10000000],other:[0,10000000],validDays:[1,365]};
const panels={basic:{watts:500,price:145,label:'Demo 500 W'},plus:{watts:600,price:180,label:'Demo Plus 600 W'}};
const batteries={none:{kwh:0,price:0,label:'Без накопичувача'},small:{kwh:25,price:7200,label:'Demo Storage 25 кВт·год'},large:{kwh:50,price:13400,label:'Demo Storage 50 кВт·год'}};
const zones={central:1050,west:950,south:1150},currencies={UAH:1,USD:42,EUR:46};
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(n,d=0)=>new Intl.NumberFormat('uk-UA',{maximumFractionDigits:d,minimumFractionDigits:d}).format(n);
const cash=(n,c='UAH')=>fmt(n)+' '+c;
const date=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
let drafts=[],lastHtml='';
function get(){const x={};for(const k of IDS)x[k]=$(k).value;return x}
function validate(x){
 if(!x.client.trim()||!x.supplier.trim())return 'Потрібні назви клієнта і постачальника.';
 if(!panels[x.panel]||!batteries[x.battery]||!zones[x.region]||!currencies[x.currency]||!currencies[x.currencyOut]||!['mint','navy'].includes(x.theme))return 'Невідомі параметри демонстрації.';
 for(const [k,limits] of Object.entries(numbers)){const n=Number(x[k]);if(!Number.isFinite(n)||n<limits[0]||n>limits[1])return 'Невірне числове значення: '+k;}
 if(!Number.isInteger(Number(x.panelCount))||!Number.isInteger(Number(x.batteryCount)))return 'Кількість обладнання має бути цілим числом.';
 if(['client','supplier','contact','manager'].some(k=>x[k].length>100)||x.prefix.length>12)return 'Занадто довге текстове поле.';
 if(!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||!Number.isFinite(new Date(x.date+'T00:00:00').getTime()))return 'Неправильна дата.';
 return '';
}
function calc(x){
 // All constants and operations are fictional learning examples, not engineering estimates.
 const b=batteries[x.battery],count=Number(x.panelCount),batteryCount=x.battery==='none'?0:Number(x.batteryCount);
 const power=panels[x.panel].watts*count/1000;
 const generation=power*zones[x.region]*Number(x.factor);
 const onsite=Math.min(generation,Number(x.consumption)),exported=Math.max(0,generation-onsite);
 const totalUah=(count*panels[x.panel].price+batteryCount*b.price+Number(x.labor)+Number(x.other))*Number(x.rate);
 const benefit=onsite*Number(x.buy)+exported*Number(x.sell);
 return {power,generation,storage:batteryCount*b.kwh,total:totalUah/currencies[x.currencyOut],totalUah,benefit,payback:benefit>0?totalUah/benefit:null};
}
function msg(s,wrong=false){$('message').textContent=s;$('message').classList.toggle('error',wrong)}
function render(){
 const x=get(),err=validate(x),ids=['power','generation','storage','cost','benefit','payback'];
 if(err){for(const id of ids)$(id).textContent='—';return}
 const n=calc(x);
 $('power').textContent=fmt(n.power,1)+' кВт';$('generation').textContent=fmt(n.generation)+' кВт·год';
 $('storage').textContent=fmt(n.storage)+' кВт·год';$('cost').textContent=cash(n.total,x.currencyOut);
 $('benefit').textContent=cash(n.benefit);$('payback').textContent=n.payback===null?'Немає':fmt(n.payback,1)+' років';
}
function tab(k){
 const pages={proposal:['Комерційна пропозиція','Оберіть параметри та сформуйте навчальну комерційну пропозицію.'],settings:['Налаштування','Вигадана номенклатура та параметри.'],designs:['HTML-дизайни','Незалежні демонстраційні шаблони.'],codes:['Коди полів','Навчальна схема без виробничих ідентифікаторів.'],history:['Збережені пропозиції','Чернетки залишаються в браузері.']};
 if(!pages[k])return;
 for(const v of document.querySelectorAll('.view'))v.classList.toggle('active',v.id==='view-'+k);
 for(const b of document.querySelectorAll('[data-tab]')){if(b.dataset.tab===k)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')}
 $('pageTitle').textContent=pages[k][0];$('pageSubtitle').textContent=pages[k][1];
 if(k==='history')history();
}
function restore(x){for(const k of IDS)$(k).value=x[k];render()}
function validImport(x){
 if(!x||typeof x!=='object'||Array.isArray(x))return false;
 if(IDS.some(k=>typeof x[k]!=='string'||x[k].length>120))return false;
 return validate(x)==='';
}
function load(){
 try{const o=JSON.parse(localStorage.getItem(KEY)||'null');if(o&&o.schema==='solar-demo-v2'&&Array.isArray(o.drafts)){drafts=o.drafts.slice(0,25).filter(i=>i&&typeof i.id==='string'&&validImport(i.fields))}}catch(_){drafts=[]}
}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({schema:'solar-demo-v2',drafts}));return true}catch(_){msg('Локальне сховище браузера недоступне.',true);return false}}
function download(name,source,type){const url=URL.createObjectURL(new Blob([source],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
function exportDraft(i){download('Solar-Demo-'+i.id+'.json',JSON.stringify({schema:'solar-demo-v2',fields:i.fields},null,2),'application/json;charset=utf-8')}
function saveDraft(){
 const fields=get(),err=validate(fields);if(err){msg(err,true);tab('proposal');return}
 const i={id:String(Date.now())+'-'+Math.floor(Math.random()*10000),created:new Date().toISOString(),fields};
 drafts.unshift(i);drafts=drafts.slice(0,25);persist();exportDraft(i);history();msg('Чернетку збережено локально та завантажено JSON.');
}
function history(){
 const list=$('historyList');list.replaceChildren();
 if(!drafts.length){const p=document.createElement('p');p.textContent='Чернеток поки немає. Створи пропозицію та збережи її.';list.appendChild(p);return}
 for(const i of drafts){
  const row=document.createElement('div');row.className='history-item';
  const name=document.createElement('div'),title=document.createElement('strong'),sub=document.createElement('small');
  title.textContent=i.fields.client;sub.textContent=i.created.slice(0,19).replace('T',' ');name.append(title,sub);
  const buttons=document.createElement('div');
  function button(label,fn){const b=document.createElement('button');b.type='button';b.className='btn secondary';b.textContent=label;b.addEventListener('click',fn);buttons.appendChild(b)}
  button('Відкрити',()=>{restore(i.fields);tab('proposal');msg('Чернетку відкрито.')});
  button('Копіювати',()=>{restore(i.fields);saveDraft()});
  button('↓ JSON',()=>exportDraft(i));
  button('Видалити',()=>{drafts=drafts.filter(x=>x.id!==i.id);persist();history()});
  row.append(name,buttons);list.appendChild(row);
 }
}
function makeHtml(x,n){
 const dark=x.theme==='navy',color=dark?'#143249':'#22664d',pale=dark?'#e2edf6':'#e5f6e9';
 const row=(k,v)=>'<tr><td>'+esc(k)+'</td><th>'+esc(v)+'</th></tr>';
 const values=[
  row('Потужність',fmt(n.power,1)+' кВт'),row('Умовна генерація',fmt(n.generation)+' кВт·год'),
  row('Ємність накопичувачів',fmt(n.storage)+' кВт·год'),row('Демонстраційна вартість',cash(n.total,x.currencyOut)),
  row('Умовна економія',cash(n.benefit)),row('Умовна окупність',n.payback===null?'Не визначено':fmt(n.payback,1)+' років')
 ].join('');
 return '<!doctype html><html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Solar Demo</title><style>'+
 'body{margin:0;background:#f5f8f6;color:#173a2b;font:16px/1.6 system-ui,sans-serif}.page{max-width:900px;margin:20px auto;background:white;padding:45px;box-shadow:0 10px 35px #0002}.head{padding:25px;border-radius:9px;background:'+color+';color:white}.head h1{margin:0}.note{padding:16px;margin:22px 0;background:'+pale+';border-radius:9px;font-size:13px}table{width:100%;border-collapse:collapse}td,th{padding:12px;border-bottom:1px solid #dce7df;text-align:left}td{color:#526a5c}footer{border-top:1px solid #ddd;margin-top:35px;padding-top:16px;font-size:12px;color:#5c7062}@media print{body{background:white}.page{margin:0;box-shadow:none}}'+
 '</style></head><body><main class="page"><div class="head"><h1>Навчальна комерційна пропозиція</h1><small>DEMO · '+esc(x.prefix.toUpperCase())+' · '+esc(x.date)+'</small></div>'+
 '<p><b>Клієнт:</b> '+esc(x.client)+'</p><p><b>Контакт:</b> '+esc(x.contact)+'</p><p><b>Постачальник:</b> '+esc(x.supplier)+'</p>'+
 '<div class="note"><b>Умовна симуляція.</b> Це не реальний технічний розрахунок, прайс або комерційна оферта.</div>'+
 '<h2>Результати</h2><table>'+values+'</table><footer>Згенеровано локально у браузері. Реальні дані не потрібні.</footer></main></body></html>';
}
function preview(){
 const x=get(),err=validate(x);if(err){msg(err,true);tab('proposal');return}
 lastHtml=makeHtml(x,calc(x));$('frame').srcdoc=lastHtml;$('modal').hidden=false;msg('HTML згенеровано локально.');
}
function close(){$('modal').hidden=true;$('frame').srcdoc=''}
function init(){
 $('date').value=date();load();
 const box=$('catalog');
 for(const item of [...Object.values(panels),...Object.values(batteries).filter(x=>x.kwh>0)]){
  const div=document.createElement('article'),strong=document.createElement('strong'),small=document.createElement('small');
  strong.textContent=item.label;small.textContent='Вигадана позиція · умовна ціна '+cash(item.price,'USD');div.append(strong,small);box.appendChild(div);
 }
 for(const b of document.querySelectorAll('[data-tab]'))b.addEventListener('click',()=>tab(b.dataset.tab));
 for(const b of document.querySelectorAll('[data-pick]'))b.addEventListener('click',()=>{$('theme').value=b.dataset.pick;tab('proposal');render()});
 for(const k of IDS){$(k).addEventListener('input',render);$(k).addEventListener('change',()=>{
  if(k==='currency')$('rate').value=String(currencies[$('currency').value]);
  if(k==='battery')$('batteryCount').value=$('battery').value==='none'?'0':'1';
  render();
 })}
 $('save').addEventListener('click',saveDraft);$('preview').addEventListener('click',preview);$('close').addEventListener('click',close);
 $('modal').addEventListener('click',e=>{if(e.target===$('modal'))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('modal').hidden)close()});
 $('download').addEventListener('click',()=>{if(lastHtml)download('Solar-Demo-Preview.html',lastHtml,'text/html;charset=utf-8')});
 $('import').addEventListener('click',()=>$('importFile').click());
 $('importFile').addEventListener('change',e=>{
  const file=e.target.files&&e.target.files[0];if(!file)return;
  if(file.size>50000){msg('Файл перевищує обмеження 50 КБ.',true);return}
  const r=new FileReader();r.onload=()=>{try{
   const v=JSON.parse(String(r.result));if(v.schema!=='solar-demo-v2'||!validImport(v.fields))throw Error('Невідповідний формат.');
   restore(v.fields);drafts.unshift({id:String(Date.now())+'-I',created:new Date().toISOString(),fields:get()});drafts=drafts.slice(0,25);persist();history();tab('proposal');msg('Чернетку імпортовано та додано до локальної історії.');
  }catch(err){msg('Помилка імпорту: '+String(err.message),true)}};r.onerror=()=>msg('Помилка читання файлу.',true);r.readAsText(file);e.target.value='';
 });
 $('reset').addEventListener('click',()=>{
  if(!window.confirm('Очистити всі локальні чернетки Solar Demo?'))return;
  drafts=[];try{localStorage.removeItem(KEY)}catch(_){}
  location.reload();
 });
 render();history();
}
init();
})();