/**
 * MAS23B — UI for independent, synthetic, nine-section CP generator.
 * Source architecture informed by owner-provided PRIVATE GTT-CP-generator.
 * This file and its seed are NEW public-only code. No private files copied.
 * All contacts, equipment and prices seeded by the standalone fictional model.
 *
 * Old MAS22 calculator remains accessible under an explicitly labelled <details>.
 * This new nine-part form does not claim to generate the final seven-page PDF:
 * that belongs to separate MAS23C and is prominently marked as forthcoming.
 */
import {
  createFictionalScenario,
  calculateFictionalProposal,
  DEMO_DISCLAIMER,
  DEMO_SCHEMA_VERSION,
} from './demo-proposal-model.mjs';

const mount = document.getElementById('full-demo-mount');
if (!mount) throw new Error('MAS23B_FORM_MOUNT_MISSING');
const STORAGE_KEY='portfolio-solar-demo-mas23b-fictional-draft-v1';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'
})[c]);
const fmt=n=>new Intl.NumberFormat('uk-UA',{maximumFractionDigits:2}).format(n);
const fresh=()=>createFictionalScenario();
let scenario=fresh();
let lastValid=null;
// Persistence is explicit: local save and JSON export are both user-controlled.

function isPlainObject(x){return !!x&&typeof x==='object'&&!Array.isArray(x)}
function copyDeep(x){return JSON.parse(JSON.stringify(x))}
function getAt(path){
  const parts=path.split('.');
  let node=scenario.form;
  for(const key of parts){
    if(!Object.prototype.hasOwnProperty.call(node,key))return undefined;
    node=node[key];
  }
  return node;
}
function setAt(path,value){
  const parts=path.split('.');
  const final=parts.pop();
  let node=scenario.form;
  for(const key of parts){
    if(!node||!Object.prototype.hasOwnProperty.call(node,key))throw Error('DEMO_UNKNOWN_FIELD_'+path);
    node=node[key];
  }
  if(!node||!Object.prototype.hasOwnProperty.call(node,final))throw Error('DEMO_UNKNOWN_FIELD_'+path);
  node[final]=value;
}
function deepGuardedRestore(form){
  // Allow a local draft's scalar values and known array shapes ONLY.
  // No catalog, meta, user-provided URLs or arbitrary keys can be imported.
  if(!isPlainObject(form))return false;
  const seed=fresh();
  function sameShape(a,b,depth=0){
    if(depth>8)return false;
    if(Array.isArray(a)){
      if(!Array.isArray(b)||b.length>40)return false;
      if(!a.length)return b.every(x=>isPlainObject(x)&&Object.keys(x).length<=4&&
        Object.values(x).every(v=>['string','number'].includes(typeof v)));
      return b.every(x=>sameShape(a[0],x,depth+1));
    }
    if(isPlainObject(a)){
      return isPlainObject(b)&&Object.keys(b).length===Object.keys(a).length&&
        Object.keys(a).every(k=>Object.prototype.hasOwnProperty.call(b,k)&&sameShape(a[k],b[k],depth+1));
    }
    return typeof a===typeof b&&
      (typeof b!=='string'||b.length<240)&&
      (typeof b!=='number'||Number.isFinite(b));
  }
  if(!sameShape(seed.form,form))return false;
  // Reject unsafe or unsupported values via calculation contract.
  try{calculateFictionalProposal({...seed,form});return true}catch{return false}
}
try{
  const raw=localStorage.getItem(STORAGE_KEY);
  if(raw&&raw.length<40000){
    const parsed=JSON.parse(raw);
    if(parsed?.schema===DEMO_SCHEMA_VERSION&&deepGuardedRestore(parsed.form))
      scenario.form=parsed.form;
  }
}catch{ /* Private mode or disabled storage: continue with fictional defaults. */ }

function options(items,selected){
  return items.map(item=>'<option value="'+esc(item.id)+'"'+
    (item.id===selected?' selected':'')+'>'+esc(item.name)+'</option>').join('');
}
function input(label,path,kind='text',optionsHtml='',attributes=''){
  const v=getAt(path);
  const id='full-'+path.replace(/\./g,'-');
  const attr=' data-full-path="'+esc(path)+'" id="'+esc(id)+'"';
  const control=kind==='select'
    ?'<select'+attr+'>'+optionsHtml+'</select>'
    :'<input'+attr+' type="'+(kind==='date'?'date':kind==='number'?'number':kind==='email'?'email':'text')+'" value="'+esc(v)+'" '+attributes+'>';
  return '<label>'+esc(label)+control+'</label>';
}
function select(label,path,items){return input(label,path,'select',items.map(([v,t])=>'<option value="'+esc(v)+'"'+(String(v)===String(getAt(path))?' selected':'')+'>'+esc(t)+'</option>').join(''))}
function numeric(label,path,step='any',min='0',max='100000000'){
  return input(label,path,'number','','min="'+min+'" max="'+max+'" step="'+step+'" inputmode="decimal"');
}
function card(number,title,body,{wide=false,subtitle=''}={}){
  return '<article class="full-section'+(wide?' full-span':'')+'" data-full-section="'+number+'">'+
    '<header class="full-title"><div><span class="full-num">'+number+'</span><h3>'+esc(title)+'</h3></div>'+
    (subtitle?'<small>'+esc(subtitle)+'</small>':'')+'</header>'+body+'</article>';
}
const code='Суто навчальна оцінка; не враховує реальну інженерію, обмеження мережі, оподаткування, деградацію обладнання чи дисконт.';
function layout(){
  const c=scenario.catalog;
  const f=scenario.form;
  const regions=Object.keys(c.regionYieldKwhPerKw).map(x=>[x,x]);
  const panelOpts=c.panels.map(x=>[x.id,x.name+' · '+x.powerW+' Вт']);
  const models=c.panels.map(x=>'<option value="'+esc(x.id)+'"'+(x.id===f.solar.panelId?' selected':'')+'>'+esc(x.name+' · '+x.powerW+' Вт')+'</option>').join('');
  const cols='class="full-fields"';
  const sections=[
    card('00','Валюта розрахунку',
      '<div '+cols+'>'+select('Валюта результату','currency.output',[['UAH','UAH'],['USD','USD'],['EUR','EUR']])+
      numeric('Умовний курс UAH за 1 одиницю','currency.outputRateUah','.01','.01','1000')+
      '</div><p class="full-span-note">Усі вигадані позиції смети задані у гривнях. Обмінні курси вводяться вручну; жодних банківських запитів.</p>',
      {subtitle:'00 / КУРСИ'}),
    card('01','Постачальник',
      '<div '+cols+'>'+input('Компанія','supplier.company')+
      input('Менеджер','supplier.manager')+input('Телефон','supplier.phone')+
      input('Email','supplier.email','email')+input('Сайт (навчальний)','supplier.website')+'</div>',
      {subtitle:'01 / ДЕМО-КОМПАНІЯ'}),
    card('02','Клієнт',
      '<div '+cols+'>'+input('Назва клієнта','client.name')+
      input('Контактна особа','client.contact')+
      input('Адреса об’єкта','client.address')+
      select('Область','client.region',regions)+'</div>',
      {subtitle:'02 / ВИГАДАНИЙ ОБ’ЄКТ'}),
    card('03','Пропозиція',
      '<div '+cols+'>'+input('Номер КП','proposal.number')+
      input('Дата','proposal.date','date')+
      input('Дійсна до','proposal.validUntil','date')+
      '<label>HTML-шаблон<select disabled aria-label="Шаблон семисторінкового КП"><option>Семисторінковий документ — MAS23C</option></select></label></div>',
      {subtitle:'03 / ВЕРСІЯ ДОКУМЕНТА'}),
    card('04','Енергетичні дані',
      '<div class="full-toggles" aria-label="Режим споживання">'+
      '<button type="button" data-full-mode="annual" aria-pressed="'+(f.energy.mode==='annual')+'">Річне</button>'+
      '<button type="button" data-full-mode="monthly" aria-pressed="'+(f.energy.mode==='monthly')+'">12 місяців</button></div>'+
      '<div class="full-fields" id="full-annual"'+(f.energy.mode!=='annual'?' hidden':'')+'>'+
      numeric('Річне споживання, кВт·год','energy.annualConsumptionKwh','1')+'</div>'+
      '<div class="full-fields full-monthly" id="full-monthly"'+(f.energy.mode!=='monthly'?' hidden':'')+'>'+
      f.energy.monthlyConsumptionKwh.map((v,i)=>
        '<label>Місяць '+String(i+1).padStart(2,'0')+'<input id="full-month-'+i+'" data-full-path="energy.monthlyConsumptionKwh.'+i+
        '" type="number" min="0" max="10000000" step="1" value="'+esc(v)+'"></label>').join('')+'</div>'+
      '<div class="full-fields" style="margin-top:12px">'+
      numeric('Дозволена потужність, кВт','energy.allocatedPowerKw','.1')+
      numeric('Купівля, UAH/кВт·год','energy.buyTariff','.01')+
      numeric('Продаж, UAH/кВт·год','energy.sellTariff','.01')+
      '</div>',{wide:true,subtitle:'04 / СПОЖИВАННЯ ТА ТАРИФИ'}),
    card('05','Сонячна електростанція',
      '<div class="full-fields">'+
      numeric('Бажана потужність, кВт','solar.desiredPowerKw','.1','.01','10000')+
      '<label>Навчальна панель<select data-full-path="solar.panelId" id="full-solar-panelId">'+models+'</select></label>'+
      numeric('Коефіцієнт корисної генерації (PR)','solar.lossFactor','.01','0','1')+
      '</div><p class="full-span-note" id="full-panel-caption" aria-live="polite"></p>',
      {wide:true,subtitle:'05 / АВТОПІДБІР ПАНЕЛЕЙ'}),
    card('06','Додаткове обладнання',
      '<h4>Навчальні накопичувачі</h4><div id="full-battery-rows" class="full-rows"></div>'+
      '<button type="button" class="full-add" data-full-add="battery">+ Додати накопичувач</button>'+
      '<h4 style="margin-top:21px">Інше обладнання</h4><div id="full-extra-rows" class="full-rows"></div>'+
      '<button type="button" class="full-add" data-full-add="equipment">+ Додати обладнання</button>',
      {wide:true,subtitle:'06 / ДИНАМІЧНІ ПОЗИЦІЇ'}),
    card('07','Вартість і роботи',
      '<div '+cols+'>'+
      numeric('Комутація, UAH/кВт','costs.commutationPerKw','1')+
      numeric('Монтаж, UAH/панель','costs.installationPerPanel','1')+
      numeric('Робочий проєкт, UAH','costs.workingProject','1')+
      numeric('Разові витрати, UAH','costs.otherOneTime','1')+
      numeric('Додаткова вартість, UAH','costs.manualAdjustment','1')+
      '</div><h4 style="margin-top:20px">Довільні позиції смети</h4>'+
      '<div id="full-cost-rows" class="full-rows"></div>'+
      '<button type="button" class="full-add" data-full-add="cost">+ Додати витрату</button>',
      {wide:true,subtitle:'07 / ДЕТАЛІЗОВАНА СМЕТА'}),
    card('08','Результат симуляції',
      '<div id="full-metrics" class="full-result-grid" aria-live="polite"></div>'+
      '<div id="full-bom" class="full-bom" aria-label="Деталізований склад витрат"></div>'+
      '<p class="full-span-note">'+esc(code)+'</p>',
      {wide:true,subtitle:'08 / ЖИВІ ПОКАЗНИКИ'}),
  ];
  mount.innerHTML=
    '<div class="full-toolbar"><div><span class="mini-finance-kicker">GTT-STYLE FLOW / 09 РОЗДІЛІВ</span>'+
      '<h2>Повна навчальна модель КП</h2>'+
      '<p>Поля, обладнання та кошторис пов’язані одним розрахунком. Семисторінковий документ буде додано на наступному етапі.</p></div>'+
      '<div class="full-toolbar-actions"><button type="button" class="full-action primary" id="full-save">Зберегти локально</button>'+
      '<button type="button" class="full-action" id="full-export">↓ JSON</button>'+
      '<button type="button" class="full-action" id="full-reset">Скинути модель</button></div></div>'+
    '<p class="full-state" id="full-state" role="status" aria-live="polite">'+esc(DEMO_DISCLAIMER)+'</p>'+
    '<div class="full-layout">'+sections.join('')+'</div>';
  renderRows();
  update();
}

function buildRow({collection,index,item,optionsList,valueKey,quantityKey}){
  const root=document.createElement('div');
  root.className='full-row'+(collection==='cost'?' cost-row':'');
  root.dataset.fullRow=collection+'-'+index;
  let name;
  if(collection==='cost'){
    name=document.createElement('input');
    name.type='text';
    name.setAttribute('aria-label','Назва статті витрат '+(index+1));
    name.maxLength=120;
    name.dataset.fullRowKey='name';
    name.value=item.name;
  } else {
    name=document.createElement('select');
    name.setAttribute('aria-label','Модель обладнання '+(index+1));
    name.dataset.fullRowKey=valueKey;
    for(const v of optionsList){
      const opt=document.createElement('option');
      opt.value=v.id;opt.textContent=v.name;name.appendChild(opt);
    }
    name.value=item[valueKey];
  }
  name.dataset.fullCollection=collection;
  name.dataset.fullRowIndex=String(index);
  const number=document.createElement('input');
  number.type='number';
  number.inputMode='decimal';
  number.setAttribute('aria-label',collection==='cost'?'Вартість у гривнях':'Кількість');
  number.dataset.fullCollection=collection;
  number.dataset.fullRowIndex=String(index);
  number.dataset.fullRowKey=quantityKey;
  number.min=collection==='cost'?'0':'1';
  number.max=collection==='cost'?'100000000':'10000';
  number.step=collection==='cost'?'0.01':'1';
  number.value=String(item[quantityKey]);
  const remove=document.createElement('button');
  remove.type='button';remove.textContent='×';
  remove.setAttribute('aria-label','Видалити рядок '+(index+1));
  remove.dataset.fullRemove=collection;
  remove.dataset.fullRowIndex=String(index);
  root.append(name,number,remove);
  return root;
}
function renderRows(){
  const {form,catalog}=scenario;
  const mapping=[
    ['battery','full-battery-rows',form.battery.selections,catalog.batteries,'modelId','quantity'],
    ['equipment','full-extra-rows',form.additionalEquipment.selections,catalog.additionalEquipment,'itemId','quantity'],
    ['cost','full-cost-rows',form.costs.customItems,[],'name','amount'],
  ];
  for(const [kind,id,rows,opts,key,number] of mapping){
    const box=$(id);box.replaceChildren();
    if(!rows.length){const p=document.createElement('p');p.className='full-span-note';p.textContent='Немає доданих позицій.';box.appendChild(p);}
    rows.forEach((item,index)=>box.appendChild(buildRow({
      collection:kind,index,item,optionsList:opts,valueKey:key,quantityKey:number,
    })));
  }
}
function rowList(kind){
  return kind==='battery'?scenario.form.battery.selections:
    kind==='equipment'?scenario.form.additionalEquipment.selections:
    kind==='cost'?scenario.form.costs.customItems:null;
}
function readNumber(control){
  const value=control.value.trim();
  if(value==='')throw new Error('Заповніть числове поле');
  const parsed=Number(value);
  if(!Number.isFinite(parsed))throw new Error('Невірне числове значення');
  return parsed;
}
function update(){
  const state=$('full-state'),metrics=$('full-metrics'),bom=$('full-bom');
  try{
    const data=calculateFictionalProposal(scenario);
    lastValid=data;
    state.classList.remove('error');
    state.textContent=DEMO_DISCLAIMER;
    const summary=[
      ['Фактична потужність',data.formatted.actualSolarPower],
      ['Генерація на рік',data.formatted.annualGeneration],
      ['Корисна генерація',data.formatted.usefulGeneration],
      ['Накопичувачі',data.formatted.batteryCapacity],
      ['Вартість проєкту',data.formatted.projectCost],
      ['Умовна економія за рік',data.formatted.netSavings],
      ['Окупність',data.formatted.payback],
      ['Кількість панелей',fmt(data.calculations.panelCount)+' шт.'],
      ['Надлишок генерації',fmt(data.calculations.surplusKwh)+' кВт·год'],
    ];
    metrics.replaceChildren();
    for(const [title,value] of summary){
      const row=document.createElement('div');row.className='full-metric';
      const label=document.createElement('small'),v=document.createElement('strong');
      label.textContent=title;v.textContent=value;row.append(label,v);metrics.appendChild(row);
    }
    $('full-panel-caption').textContent=
      'Автоматично: '+data.calculations.panelCount+' модулів × '+
      data.equipment.panel.powerW+' Вт = '+data.formatted.actualSolarPower+
      (data.calculations.exceedsAllocatedPower
        ? '. Увага: бажана потужність перевищує дозволену.':'');
    const table=document.createElement('table');
    const head=document.createElement('thead'),hr=document.createElement('tr');
    for(const title of ['Стаття','Кількість','Вартість, UAH']){
      const th=document.createElement('th');th.textContent=title;hr.appendChild(th);
    }
    head.appendChild(hr);table.appendChild(head);
    const body=document.createElement('tbody');
    for(const item of data.calculations.costItems){
      const tr=document.createElement('tr');
      for(const text of [item.label,fmt(item.quantity)+' '+item.unit,fmt(item.amountUah)]){
        const td=document.createElement('td');td.textContent=text;tr.appendChild(td);
      }
      body.appendChild(tr);
    }
    table.appendChild(body);
    const foot=document.createElement('tfoot'),fr=document.createElement('tr');
    const total=document.createElement('td');total.colSpan=2;total.textContent='Разом';
    const amount=document.createElement('td');amount.textContent=fmt(data.calculations.projectCostUah)+' UAH';
    fr.append(total,amount);foot.appendChild(fr);table.appendChild(foot);
    bom.replaceChildren(table);
  }catch(error){
    lastValid=null;
    state.classList.add('error');
    state.textContent='Перевірте параметри: '+String(error.message).slice(0,180);
    metrics.replaceChildren();bom.replaceChildren();
    $('full-panel-caption').textContent='Після виправлення параметрів розрахунок оновиться.';
  }
}
function failInvalid(message){
  lastValid=null;
  $('full-state').classList.add('error');
  $('full-state').textContent=message.slice(0,220);
  $('full-metrics').replaceChildren();
  $('full-bom').replaceChildren();
  $('full-panel-caption').textContent='Перевірте введені дані.';
}
function handlePathChange(element){
  const path=element.dataset.fullPath;
  if(!path)return;
  try{
    const was=getAt(path);
    const value=typeof was==='number'?readNumber(element):element.value;
    setAt(path,value);
    // A new output unit gets a user-visible fictional default conversion rate.
    if(path==='currency.output'){
      const defaultRates={UAH:1,USD:40,EUR:45};
      scenario.form.currency.outputRateUah=defaultRates[value]??1;
      $('full-currency-outputRateUah').value=String(scenario.form.currency.outputRateUah);
    }
    update();
  }catch(error){
    failInvalid('Перевірте поле: '+String(error.message));
  }
}
mount.addEventListener('input',event=>{
  const target=event.target;
  if(!(target instanceof HTMLElement))return;
  if(target.dataset.fullPath)handlePathChange(target);
  else if(target.dataset.fullCollection)handleRowChange(target);
});
mount.addEventListener('change',event=>{
  const target=event.target;
  if(!(target instanceof HTMLElement))return;
  if(target.dataset.fullPath)handlePathChange(target);
  else if(target.dataset.fullCollection)handleRowChange(target);
});
function handleRowChange(target){
  const list=rowList(target.dataset.fullCollection);
  const ix=Number(target.dataset.fullRowIndex);
  const key=target.dataset.fullRowKey;
  if(!list||!Number.isSafeInteger(ix)||!list[ix]||
    !Object.prototype.hasOwnProperty.call(list[ix],key))return;
  try{
    const old=list[ix][key];
    const value=typeof old==='number'?readNumber(target):target.value;
    list[ix][key]=value;
    update();
  }catch(error){
    failInvalid('Перевірте рядок: '+String(error.message));
  }
}
mount.addEventListener('click',event=>{
  const b=event.target.closest('button');
  if(!b)return;
  if(b.dataset.fullMode){
    scenario.form.energy.mode=b.dataset.fullMode;
    for(const mode of ['annual','monthly'])
      mount.querySelector('[data-full-mode="'+mode+'"]').setAttribute(
        'aria-pressed',String(mode===scenario.form.energy.mode));
    $('full-annual').hidden=scenario.form.energy.mode!=='annual';
    $('full-monthly').hidden=scenario.form.energy.mode!=='monthly';
    update();return;
  }
  if(b.dataset.fullAdd){
    const kind=b.dataset.fullAdd,list=rowList(kind);
    if(!list||list.length>=30)return;
    list.push(kind==='battery'?
      {modelId:scenario.catalog.batteries[0].id,quantity:1}:
      kind==='equipment'?
        {itemId:scenario.catalog.additionalEquipment[0].id,quantity:1}:
        {name:'Навчальна позиція',amount:1000});
    renderRows();update();return;
  }
  if(b.dataset.fullRemove){
    const list=rowList(b.dataset.fullRemove);
    if(list){
      const index=Number(b.dataset.fullRowIndex);
      if(Number.isSafeInteger(index)&&index>=0&&index<list.length)
        list.splice(index,1);
      renderRows();update();
    }
    return;
  }
  if(b.id==='full-save'){
    if(!lastValid){$('full-state').textContent='Спершу виправте параметри.';return}
    try{
      const doc={schema:DEMO_SCHEMA_VERSION,form:copyDeep(scenario.form)};
      const asText=JSON.stringify(doc);
      if(asText.length>40000)throw Error('DEMO_DRAFT_TOO_LARGE');
      localStorage.setItem(STORAGE_KEY,asText);
      $('full-state').classList.remove('error');
      $('full-state').textContent='Чернетку навчальної моделі збережено тільки у цьому браузері. '+DEMO_DISCLAIMER;
    }catch{
      $('full-state').classList.add('error');
      $('full-state').textContent='Сховище браузера недоступне. Можна експортувати JSON.';
    }
    return;
  }
  if(b.id==='full-export'){
    if(!lastValid){$('full-state').textContent='Спершу виправте параметри.';return}
    const data=JSON.stringify({schema:DEMO_SCHEMA_VERSION,fictional:true,form:scenario.form},null,2);
    const blob=new Blob([data],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=url;
    link.download='Solar-Demo-Nine-Sections.json';
    document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),2000);
    return;
  }
  if(b.id==='full-reset'){
    scenario=fresh();
    try{localStorage.removeItem(STORAGE_KEY)}catch{}
    layout();return;
  }
});
// New model and legacy calculator share a page. Keep the legacy reset click
// focused on legacy local drafts; the new form has its own explicit Reset.
const legacy = document.getElementById('legacyCalculator');
const oldActions = document.querySelector('.top .actions');
// Do not present the old one-page preview as the new, seven-page generator.
// Keep the *working* original preview, draft and HTML download under the
// explicitly labelled previous-version disclosure until MAS23C exists.
if(legacy && oldActions){
  oldActions.classList.add('full-legacy-actions');
  legacy.insertBefore(oldActions, legacy.querySelector('.form-grid'));
}
layout();
// An immutable, read-only runtime marker for robust browser acceptance.
mount.dataset.fullReady='mas23b-1';
mount.dataset.fullModel=DEMO_SCHEMA_VERSION;
