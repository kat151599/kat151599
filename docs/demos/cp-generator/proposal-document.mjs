/**
 * MAS23C: standalone, synthetic-only A4 proposal. No original private GTT
 * code, prices, customer files or photos are published.
 * Pure renderer: input MAS23A's calculated fictional data -> 7 static pages.
 */
const STYLES="\n*{box-sizing:border-box}html,body{margin:0;padding:0}\nbody{font:12px/1.45 Arial,Helvetica,sans-serif;background:#e8f0ef;color:#173d35}\n.proposal-page{width:210mm;height:297mm;margin:14px auto;background:white;padding:15mm;\n  display:flex;flex-direction:column;overflow:hidden;box-shadow:0 12px 38px #133c3228}\n.page-top,.page-bottom{flex:none;display:flex;justify-content:space-between;gap:10px;\n  align-items:center;font-size:8.5px;color:#64837a;letter-spacing:.08em;text-transform:uppercase}\n.page-top{border-bottom:1px solid #d9e6e0;padding-bottom:9px}\n.page-bottom{border-top:1px solid #d9e6e0;padding-top:9px;margin-top:auto}\n.brand{font-weight:900;color:#17775a;font-size:11px}\n.body{flex:1;min-height:0;padding:11mm 0 7mm}\n.eyebrow{display:block;color:#238367;font-size:9px;font-weight:900;letter-spacing:.15em;margin-bottom:11px}\nh1,h2,h3,h4,p{margin:0}\nh1{font-size:43px;line-height:1.11;letter-spacing:-.04em}\nh2{font-size:29px;line-height:1.13;letter-spacing:-.035em;margin-bottom:15px}\nh3{font-size:15px;margin-bottom:11px}\np{color:#55766b;line-height:1.55}\n.lead{font-size:13px;margin-bottom:17px;max-width:150mm}\n.note{border-radius:10px;padding:12px 14px;background:#e5f3eb;font-size:10px;color:#42695b;margin:16px 0}\n.cover{background:linear-gradient(148deg,#0d4b3b,#0b302f 65%,#163c49);color:white}\n.cover .page-top,.cover .page-bottom{color:#bcd8d0;border-color:#ffffff35}\n.cover .brand{color:#fff}.cover .eyebrow{color:#f2c773}\n.cover .body{display:flex;flex-direction:column;justify-content:space-between}\n.cover h1{margin:17px 0 21px;max-width:155mm}\n.cover p{color:#d2e6df}\n.cover-art{height:81mm;border-radius:15px;overflow:hidden;background:linear-gradient(130deg,#166c62,#72baad);\n position:relative;border:1px solid #9bd4c6}\n.cover-art:before{content:\"\";position:absolute;right:30px;top:-20px;width:140px;height:140px;\n border-radius:50%;background:#edbc65;box-shadow:0 0 0 25px #ffffff18}\n.cover-art:after{content:\"\";position:absolute;bottom:-22px;left:9%;width:65%;height:100px;transform:skew(-18deg) rotate(-5deg);\n border:6px solid #b2e5e0;background:repeating-linear-gradient(90deg,#205263 0 49px,#abded8 50px 53px)}\n.cover-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:24px 0}\n.cover-grid small{display:block;color:#afdad0;font-size:9px}.cover-grid strong{font-size:15px;overflow-wrap:anywhere}\n.metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:17px 0}\n.metric{border:1px solid #dcece4;background:#f5faf7;border-radius:11px;padding:14px 11px;min-width:0}\n.metric small{display:block;color:#668579;font-size:9px;margin-bottom:8px}\n.metric strong{display:block;color:#1c5c47;font-size:16px;line-height:1.25;overflow-wrap:anywhere}\n.metric em{display:block;font-style:normal;font-size:9px;color:#7b9588;margin-top:5px}\n.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}\n.panel{border:1px solid #dcebe3;padding:15px;border-radius:12px;background:#fbfdfb;min-width:0}\n.fact{display:flex;justify-content:space-between;align-items:start;gap:10px;padding:7px 0;border-bottom:1px solid #e3eae5}\n.fact:last-child{border:0}.fact span{font-size:10px;color:#6a887c;flex:0 0 43%}\n.fact strong{font-size:10px;color:#1d4c3e;text-align:right;overflow-wrap:anywhere}\n.spacer{height:17px}\ntable{width:100%;border-collapse:collapse;table-layout:fixed}\nth{text-align:left;background:#e4f2e9;color:#1b6c54;font-size:9px;padding:8px}\ntd{border-bottom:1px solid #e3eae5;padding:7px 8px;font-size:9px;vertical-align:top;overflow-wrap:anywhere}\ntr:nth-child(even){background:#fafcfa}\n.table-small th,.table-small td{font-size:8px;padding:5px}\n.num{text-align:right;font-variant-numeric:tabular-nums}\ntfoot td{background:#d9efe3;font-weight:800;color:#15523d;font-size:11px}\n.steps{list-style:none;padding:0;margin:19px 0;counter-reset:step}\n.steps li{padding:13px 0;display:grid;grid-template-columns:39px 1fr;gap:11px;border-bottom:1px solid #e2ede7}\n.steps li:before{counter-increment:step;content:counter(step,decimal-leading-zero);font-weight:900;color:#1c8a66;font-size:20px}\n.steps strong{font-size:13px;color:#19503f}.steps p{font-size:11px;margin-top:5px}\n.case{display:grid;grid-template-columns:62mm 1fr;gap:12px;padding:11px;border-radius:12px;\n border:1px solid #deebe4;background:#fbfdfb;margin-bottom:11px}\n.case-art{height:34mm;overflow:hidden;border-radius:10px;position:relative;\n background:linear-gradient(145deg,#8ecab9,#246d66)}\n.case-art:before{content:\"\";position:absolute;border-radius:50%;width:52px;height:52px;right:18px;top:12px;background:#f1c47a}\n.case-art:after{content:\"\";position:absolute;width:105px;height:49px;left:23px;bottom:5px;\n border:4px solid #9de2dd;background:repeating-linear-gradient(90deg,#234d62 0 32px,#d0ebe4 33px 35px);transform:skew(-11deg)}\n.case small{color:#1f8065;font-size:9px;font-weight:800}\n.case h3{margin:9px 0 7px}.case p{font-size:10.5px}\n.cta{background:linear-gradient(120deg,#145a43,#2a896f);color:white;padding:23px;border-radius:14px;margin:19px 0}\n.cta h2{color:white}.cta p{color:#ddf2e7}\n.small{font-size:9px;color:#6b867c;line-height:1.6}\n@media screen and (max-width:810px){.proposal-page{margin:9px 0;box-shadow:none}body{overflow-x:auto}}\n@media print{@page{size:A4;margin:0}html,body{width:210mm;margin:0;background:white}\n .proposal-page{width:210mm;height:297mm;margin:0;box-shadow:none;page-break-after:always;break-after:page}\n .proposal-page:last-child{page-break-after:auto;break-after:auto}\n *{-webkit-print-color-adjust:exact;print-color-adjust:exact}}\n";
const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({
 '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const fmt=(n,d=0)=>new Intl.NumberFormat('uk-UA',{
 minimumFractionDigits:d,maximumFractionDigits:d}).format(n);
function required(v,name,max=240){
 if(typeof v!=='string'||!v.trim()||v.length>max)
   throw new TypeError('MAS23C_INVALID_TEXT_'+name);
 return escapeHTML(v.trim());
}
function positive(n,name){
 if(typeof n!=='number'||!Number.isFinite(n)||n<0)
   throw new TypeError('MAS23C_BAD_NUMBER_'+name);
 return n;
}
function fact(name,value){
 return '<div class="fact"><span>'+escapeHTML(name)+'</span><strong>'+escapeHTML(value)+'</strong></div>';
}
function metric(name,value,sub=''){
 return '<div class="metric"><small>'+escapeHTML(name)+'</small><strong>'+escapeHTML(value)+
 '</strong><em>'+escapeHTML(sub)+'</em></div>';
}
function page(n,content){
 return '<section class="proposal-page page-'+n+(n===1?' cover':'')+'" data-proposal-page="'+n+'">'+
  '<header class="page-top"><span class="brand">✳ SOLAR / DEMO</span>'+
  '<span>НАВЧАЛЬНА КОМЕРЦІЙНА ПРОПОЗИЦІЯ</span></header>'+
  '<main class="body"><span class="eyebrow">SOLAR DEMO / '+String(n).padStart(2,'0')+
  ' / 07</span>'+content+'</main>'+
  '<footer class="page-bottom"><span>Усі дані та проєкти вигадані · не є офертою</span>'+
  '<span>'+n+' / 07</span></footer></section>';
}
export function renderFictionalProposalDocument(data){
 if(!data||data.meta?.fictional!==true||data.meta?.schemaVersion!=='mas23a-1'||
    !String(data.meta.disclaimer||'').includes('вигадані'))
   throw new TypeError('MAS23C_ONLY_MAS23A_FICTIONAL_DATA');
 const c=data.calculations, f=data.formatted;
 if(!c||!f||!Array.isArray(c.costItems)||c.costItems.length<1||c.costItems.length>18)
   throw new RangeError('MAS23C_MAX_18_ITEMIZED_ROWS_FOR_7_A4_PAGES');
 if(!Array.isArray(data.projects)||data.projects.length>10||
    data.projects.some(p=>p.fictional!==true||p.image!==''||p.url!==''))
   throw new TypeError('MAS23C_ONLY_SYNTHETIC_PROJECTS_NO_IMAGES');
 for(const k of ['projectCostUah','electricitySavingsUah','saleIncomeUah','netAnnualSavingsUah',
   'panelCount','annualGenerationKwh','usefulGenerationKwh','selfConsumedKwh',
   'surplusKwh','annualConsumptionKwh','actualSolarPowerKw'])
   positive(c[k],k);
 const sum=Math.round(c.costItems.reduce((a,row)=>a+positive(row.amountUah,'line'),0)*100)/100;
 if(Math.abs(sum-c.projectCostUah)>.011||
   Math.abs(c.electricitySavingsUah+c.saleIncomeUah-c.netAnnualSavingsUah)>.011)
   throw new Error('MAS23C_COST_OR_BENEFIT_RECONCILIATION_FAILED');
 if(c.paybackYears!==null&&(!Number.isFinite(c.paybackYears)||
   Math.abs(c.paybackYears*c.netAnnualSavingsUah-c.projectCostUah)>.011))
   throw new Error('MAS23C_PAYBACK_RECONCILIATION_FAILED');
 const client=required(data.client.name,'client',120),
   person=required(data.client.contact,'clientContact',120),
   address=required(data.client.address,'address',200),
   region=required(data.client.region,'region',90),
   supplier=required(data.supplier.company,'supplier',120),
   manager=required(data.supplier.manager,'manager',120),
   email=required(data.supplier.email,'email',120),
   number=required(data.proposal.number,'number',70),
   date=required(data.proposal.date,'date',30),
   valid=required(data.proposal.validUntil,'validUntil',30),
   outputCurrency=required(c.outputCurrency,'currency',5);
 const panelName=required(data.equipment.panel.name,'panelName',130);
 const selfPct=c.usefulGenerationKwh?Math.min(100,c.selfConsumedKwh/c.usefulGenerationKwh*100):0;
 const rows=c.costItems.map((x,i)=>{
   positive(x.amountUah,'lineAmount');positive(x.quantity,'lineQuantity');
   return '<tr><td style="width:6%">'+(i+1)+'</td><td style="width:51%">'+
   required(x.label,'lineName',155)+'</td><td class="num" style="width:19%">'+
   fmt(x.quantity,2)+' '+required(x.unit,'unit',20)+'</td>'+
   '<td class="num" style="width:24%">'+fmt(x.amountUah,2)+'</td></tr>';
 }).join('');
 const batteryRows=data.equipment.batteries.map((x,i)=>
   '<tr><td>'+required(x.name,'battery'+i,130)+'</td>'+
   '<td class="num">'+fmt(x.quantity)+'</td>'+
   '<td class="num">'+fmt(x.capacityKwh*x.quantity,2)+' кВт·год</td></tr>').join('');
 const extraRows=data.equipment.additionalEquipment.map((x,i)=>
   '<tr><td>'+required(x.name,'extra'+i,130)+'</td>'+
   '<td class="num">'+fmt(x.quantity)+'</td><td>Навчальна позиція</td></tr>').join('');
 const projects=data.projects.slice(0,3).map((p,i)=>
   '<div class="case"><div class="case-art" aria-hidden="true"></div>'+
   '<div><small>ВИГАДАНИЙ ПРОЄКТ · '+(i+1)+'</small><h3>'+
   required(p.title,'projectTitle',105)+'</h3><p>'+required(p.description,'projectDesc',200)+
   '</p></div></div>').join('');
 const stages=[
  ['Обстеження об’єкта','Збір вихідних даних, уточнення потужності, стану конструкцій та умов підключення.'],
  ['Проєктування','Уточнення конфігурації обладнання, монтажних схем та детального кошторису.'],
  ['Комплектація','Підтвердження специфікації та підготовка обладнання до робіт.'],
  ['Монтаж','Встановлення конструкцій, сонячних модулів, електротехніки та моніторингу.'],
  ['Перевірка і запуск','Тестування, налаштування та передача документації замовнику.']
 ].map(([a,b])=>'<li><div><strong>'+escapeHTML(a)+'</strong><p>'+escapeHTML(b)+'</p></div></li>').join('');
 const content=[
  page(1,
   '<div><h1>Комерційна<br>пропозиція щодо<br>сонячної станції</h1>'+
   '<p class="lead">Професійна структура документа: конфігурація, деталізований бюджет, економіка та етапи реалізації.</p>'+
   '<div class="cover-grid"><div><small>Потужність</small><strong>'+escapeHTML(f.actualSolarPower)+'</strong></div>'+
   '<div><small>Генерація на рік</small><strong>'+escapeHTML(f.annualGeneration)+'</strong></div>'+
   '<div><small>Номер</small><strong>'+number+'</strong></div></div>'+
   '<div class="cover-art" aria-hidden="true"></div></div>'+
   '<div class="cover-grid"><div><small>Клієнт</small><strong>'+client+'</strong></div>'+
   '<div><small>Адреса об’єкта</small><strong>'+address+'</strong></div>'+
   '<div><small>Дата</small><strong>'+date+'</strong></div></div>'),
  page(2,
   '<h2>Проєкт у цифрах</h2><p class="lead">Ключові показники демонстраційної моделі, розраховані з одного набору вихідних даних.</p>'+
   '<div class="metrics">'+metric('Умовна вартість',f.projectCost)+
   metric('Генерація на рік',f.annualGeneration)+
   metric('Проста окупність',f.payback)+'</div>'+
   '<div class="note"><strong>Умовна економіка: '+escapeHTML(f.netSavings)+'</strong>'+
   '<p>Власне споживання плюс розрахункова оцінка надлишку енергії.</p></div>'+
   '<div class="grid2"><div class="panel"><h3>Енергобаланс</h3>'+
   fact('Споживання',f.annualConsumption)+fact('Корисна генерація',f.usefulGeneration)+
   fact('Власне використання',fmt(c.selfConsumedKwh)+' кВт·год')+
   fact('Надлишок',fmt(c.surplusKwh)+' кВт·год')+
   fact('Частка самоспоживання',fmt(selfPct,1)+'%')+'</div>'+
   '<div class="panel"><h3>Фінансовий ефект</h3>'+
   fact('Економія на споживанні',fmt(c.electricitySavingsUah,2)+' UAH')+
   fact('Умовний продаж',fmt(c.saleIncomeUah,2)+' UAH')+
   fact('Разом на рік',fmt(c.netAnnualSavingsUah,2)+' UAH')+
   fact('Купівельний тариф',fmt(data.energy.buyTariff,2)+' UAH/кВт·год')+
   fact('Продажний тариф',fmt(data.energy.sellTariff,2)+' UAH/кВт·год')+
   '</div></div><p class="small" style="margin-top:18px">Оцінка не включає оподаткування, обслуговування, деградацію обладнання або дисконт. Це навчальна симуляція.</p>'),
  page(3,
   '<h2>Конфігурація обладнання</h2><p class="lead">Показова комплектація вигаданої станції з розрахованою кількістю панелей і накопичувачів.</p>'+
   '<div class="metrics">'+metric('Панелі',fmt(c.panelCount)+' шт.')+
   metric('Фактична потужність',f.actualSolarPower)+
   metric('Ємність АКБ',f.batteryCapacity)+'</div>'+
   '<div class="panel"><h3>Сонячні модулі</h3>'+fact('Модель',panelName)+
   fact('Потужність 1 модуля',fmt(data.equipment.panel.powerW)+' Вт')+
   fact('Регіон',region)+fact('Питомий вихід',fmt(c.specificYield)+' кВт·год/кВт')+
   fact('Коефіцієнт PR',fmt(data.solar.lossFactor,2))+
   fact('Дозволена потужність',fmt(c.allocatedPowerKw,1)+' кВт')+'</div>'+
   '<div class="spacer"></div><div class="grid2"><div class="panel"><h3>Накопичувачі</h3>'+
   '<table class="table-small"><thead><tr><th>Модель</th><th>К-сть</th><th>Ємність</th></tr></thead><tbody>'+
   (batteryRows||'<tr><td colspan="3">Не вибрано</td></tr>')+'</tbody></table></div>'+
   '<div class="panel"><h3>Інше обладнання</h3>'+
   '<table class="table-small"><thead><tr><th>Позиція</th><th>К-сть</th><th>Тип</th></tr></thead><tbody>'+
   (extraRows||'<tr><td colspan="3">Не вибрано</td></tr>')+'</tbody></table></div></div>'+
   (c.exceedsAllocatedPower?'<p class="note">Увага: цільова потужність перевищує заявлену дозволену.</p>':'')+
   '<p class="small" style="margin-top:17px">Моделі та ціни не існують у реальному каталозі. Фактичний підбір потребує інженерної перевірки.</p>'),
  page(4,
   '<h2>Детальний кошторис</h2><p class="lead">Усі суми сформовані з тих самих позицій, що й живі показники в генераторі.</p>'+
   '<table class="table-small"><thead><tr><th style="width:6%">№</th>'+
   '<th style="width:51%">Стаття</th><th class="num" style="width:19%">Кількість</th>'+
   '<th class="num" style="width:24%">Вартість, UAH</th></tr></thead><tbody>'+rows+
   '</tbody><tfoot><tr><td colspan="3">УСЬОГО</td><td class="num">'+fmt(c.projectCostUah,2)+
   '</td></tr></tfoot></table>'+
   '<div class="metrics">'+metric('Річна економія',fmt(c.electricitySavingsUah,2)+' UAH')+
   metric('Продаж надлишку',fmt(c.saleIncomeUah,2)+' UAH')+
   metric('Проста окупність',f.payback)+'</div>'+
   '<p class="small">У валюті КП ('+outputCurrency+'): '+escapeHTML(f.projectCost)+
   '. Обмінний курс є умовним. Усі наведені ціни вигадані.</p>'),
  page(5,
   '<h2>Етапи реалізації</h2><p class="lead">Модельний процес підготовки та реалізації СЕС. Реальні строки й договірні умови визначаються окремо.</p>'+
   '<ol class="steps">'+stages+'</ol>'+
   '<div class="note"><strong>Після уточнення вихідних даних</strong><p>Формується остаточна специфікація, календар робіт і комерційна пропозиція.</p></div>'+
   '<p class="small">Етапи є демонстраційною структурою, а не обіцянкою виконання робіт конкретним виконавцем.</p>'),
  page(6,
   '<h2>Приклади рішень</h2><p class="lead">Вигадані приклади показують, де у справжньому КП розміщуються реалізовані об’єкти та фотографії.</p>'+
   '<div style="margin-top:17px">'+projects+'</div>'+
   '<div class="note">Усі ілюстрації побудовані CSS локально. Жодних справжніх фото клієнтів, сторонніх ресурсів чи підтверджень реалізованих проєктів.</div>'),
  page(7,
   '<h2>Наступний крок</h2><p class="lead">Уточнити технічні параметри об’єкта й погодити комплект обладнання, ціну та умови реалізації.</p>'+
   '<div class="cta"><small>ПОСТАЧАЛЬНИК · НАВЧАЛЬНИЙ ПРИКЛАД</small>'+
   '<h2>'+supplier+'</h2><p>'+manager+'<br>'+email+'</p></div>'+
   '<div class="grid2"><div class="panel"><h3>Дані пропозиції</h3>'+
   fact('Номер',number)+fact('Дата',date)+fact('Дійсна до',valid)+
   fact('Клієнт',client)+fact('Контакт',person)+'</div>'+
   '<div class="panel"><h3>Що уточнити</h3>'+
   '<p>Фактичний профіль споживання, стан конструкцій, умови мережі, монтажу, наявність обладнання, строки та ціни.</p></div></div>'+
   '<div class="note">'+required(data.meta.disclaimer,'disclaimer',350)+
   ' Дані не передавалися на сервер.</div>'),
 ];
 if(content.length!==7)throw new Error('MAS23C_INTERNAL_PAGE_COUNT');
 return '<!doctype html><html lang="uk"><head><meta charset="utf-8">'+
 '<meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<meta http-equiv="Content-Security-Policy" content="default-src &#39;none&#39;; style-src &#39;unsafe-inline&#39;; img-src &#39;none&#39;; script-src &#39;none&#39;; connect-src &#39;none&#39;; base-uri &#39;none&#39;; form-action &#39;none&#39;">'+
 '<title>Навчальна комерційна пропозиція — '+number+'</title>'+
 '<style>'+STYLES+'</style></head><body data-document="mas23c-seven-pages">'+
 content.join('')+'</body></html>';
}
