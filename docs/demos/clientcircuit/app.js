(()=>{
"use strict";
const translations={
uk:{
subtitle:"CRM · симулятор роботи із заявками",demoFlag:"ДЕМО / вигадані дані / офлайн",reset:"Скинути демо",sandbox:"Навчальний стенд. Немає облікових записів, справжніх дзвінків чи доступу до CRM.",workspace:"Звернення та клієнти",activities:"Історія взаємодій",pipeline:"Етапи обробки",offline:"Усі дії лише у вашому браузері",heading:"Шлях звернення до клієнта",intro:"Створіть заявку, опрацюйте контакт і збережіть контекст під час переходу до CRM.",newLead:"+ Створити демозаявку",statAll:"Звернень",statAllNote:"Вигадані записи",statQualified:"Кваліфіковано",statQualifiedNote:"Очікують конвертації",statConverted:"Клієнтів",statConvertedNote:"Історія не губиться",statRetries:"Повторних подій",statRetriesNote:"Без дублювання заявок",flowOne:"Надходження",flowTwo:"Контакт",flowThree:"Кваліфікація",flowFour:"Клієнт + історія",listHeading:"Черга звернень",listHint:"Оберіть картку для роботи",searchPlaceholder:"Пошук за ім’ям або організацією",statusFilter:"Статус",allStatuses:"Усі статуси",statusNew:"Нове",statusContacted:"Контакт",statusQualified:"Кваліфіковано",statusConverted:"Клієнт",recordLabel:"КАРТКА / ДІЇ",fieldSource:"Джерело",fieldMethod:"Спосіб надходження",fieldId:"Ідентифікатор події",fieldProject:"CRM-картка",assignee:"Відповідальний",unassigned:"Не призначено",managerMarta:"Марта — менеджерка",managerDanylo:"Данило — менеджер",logCall:"+ Зареєструвати дзвінок",retry:"↻ Повторити подію",nextStep:"Наступний етап →",noteTitle:"Нотатка до історії",notePlaceholder:"Коротко про результат контакту",addNote:"Додати",history:"Єдина історія",disclaimer:"Усі імена, організації, показники та взаємодії вигадані. Це окремий симулятор — не копія CRM, без мережевих запитів, реального Call Center та виробничих алгоритмів.",stageDone:"Клієнт створений ✓",noResults:"Нічого не знайдено.",projectNone:"Ще немає",projectCreated:"Картку створено",eventCreated:"Заявка зареєстрована",eventAssigned:"Змінено відповідального",eventCall:"Додано журнал дзвінка",eventContact:"Контакт встановлено",eventQualified:"Контакт кваліфіковано",eventConverted:"Створено клієнтську картку: історію перенесено",eventNote:"Додано нотатку",eventRetry:"Повтор не створив другу заявку",toastNew:"Нову вигадану заявку додано",toastRetry:"Повторний запит розпізнано. Дубліката немає.",toastCall:"Дзвінок додано до історії",toastChanged:"Етап оновлено",toastReset:"Демонстрацію скинуто",toastNote:"Нотатку додано",sourceWebsite:"Форма сайту",sourceReferral:"Рекомендація",sourceCampaign:"Реклама",methodWebsite:"website_form",methodManual:"manual",methodCsv:"csv_import",emptyTimeline:"Подій поки немає.",sourceSystem:"Демонстраційне джерело"
},
en:{
subtitle:"CRM · lead journey simulator",demoFlag:"DEMO / fictional data / offline",reset:"Reset demo",sandbox:"Educational sandbox. No accounts, real calls, or CRM access.",workspace:"Leads and clients",activities:"Interaction history",pipeline:"Processing stages",offline:"All actions run only in your browser",heading:"From lead to client",intro:"Create an inquiry, process the contact, and preserve its history through CRM conversion.",newLead:"+ Create demo inquiry",statAll:"Inquiries",statAllNote:"Fictional records",statQualified:"Qualified",statQualifiedNote:"Awaiting conversion",statConverted:"Clients",statConvertedNote:"History stays intact",statRetries:"Duplicate events",statRetriesNote:"No duplicate records",flowOne:"Ingest",flowTwo:"Contact",flowThree:"Qualification",flowFour:"Client + history",listHeading:"Lead queue",listHint:"Select a record to explore",searchPlaceholder:"Search person or organization",statusFilter:"Status",allStatuses:"All statuses",statusNew:"New",statusContacted:"Contacted",statusQualified:"Qualified",statusConverted:"Client",recordLabel:"RECORD / ACTIONS",fieldSource:"Source",fieldMethod:"Ingest method",fieldId:"Event identity",fieldProject:"CRM record",assignee:"Owner",unassigned:"Unassigned",managerMarta:"Marta — manager",managerDanylo:"Danylo — manager",logCall:"+ Log a call",retry:"↻ Retry event",nextStep:"Next stage →",noteTitle:"Timeline note",notePlaceholder:"Short description of the conversation",addNote:"Add note",history:"Unified timeline",disclaimer:"Every name, organization, metric and interaction is fictional. This standalone teaching model does not copy the CRM or contact real Call Center services, APIs or production algorithms.",stageDone:"Client created ✓",noResults:"No matching records.",projectNone:"Not yet created",projectCreated:"Record created",eventCreated:"Inquiry registered",eventAssigned:"Owner changed",eventCall:"Call entry logged",eventContact:"Contact established",eventQualified:"Lead qualified",eventConverted:"Client record created; timeline preserved",eventNote:"Note added",eventRetry:"Duplicate delivery produced no new lead",toastNew:"Fictional inquiry created",toastRetry:"Safe retry: no second record created",toastCall:"Call added to timeline",toastChanged:"Stage updated",toastReset:"Demo reset",toastNote:"Note added",sourceWebsite:"Website form",sourceReferral:"Referral",sourceCampaign:"Campaign",methodWebsite:"website_form",methodManual:"manual",methodCsv:"csv_import",emptyTimeline:"No events yet.",sourceSystem:"Demo source"
}};
const langSelect=document.getElementById("language");
let lang=new URLSearchParams(location.search).get("lang")==="en"?"en":"uk";langSelect.value=lang;document.documentElement.lang=lang;
const seed=()=>[
{id:101,name:"Лада Марченко",nameEn:"Lada Marchenko",org:"Норд Лаб",orgEn:"Nord Lab",status:"new",source:"sourceWebsite",method:"methodWebsite",external:"fiction-101",assigned:"unassigned",project:null,events:[{key:"eventCreated",detail:"web · demo-101",time:"09:12"}]},
{id:102,name:"Остап Кравець",nameEn:"Ostap Kravets",org:"Фаро Студіо",orgEn:"Faro Studio",status:"contacted",source:"sourceReferral",method:"methodManual",external:"fiction-102",assigned:"Marta",project:null,events:[{key:"eventCreated",detail:"referral",time:"08:45"},{key:"eventCall",detail:"outbound / mock",time:"09:04"},{key:"eventContact",detail:"",time:"09:06"}]},
{id:103,name:"Марія Данилюк",nameEn:"Mariia Danyliuk",org:"Кварц Груп",orgEn:"Quartz Group",status:"qualified",source:"sourceCampaign",method:"methodCsv",external:"fiction-103",assigned:"Danylo",project:null,events:[{key:"eventCreated",detail:"CSV / mock",time:"08:05"},{key:"eventCall",detail:"inbound / mock",time:"08:50"},{key:"eventQualified",detail:"",time:"09:00"}]},
{id:104,name:"Ірина Світлична",nameEn:"Iryna Svitlychna",org:"Лайт Сервіс",orgEn:"Light Service",status:"converted",source:"sourceWebsite",method:"methodWebsite",external:"fiction-104",assigned:"Marta",project:"CC-DEMO-104",events:[{key:"eventCreated",detail:"web / mock",time:"08:01"},{key:"eventCall",detail:"outbound / mock",time:"08:08"},{key:"eventContact",detail:"",time:"08:09"},{key:"eventQualified",detail:"",time:"08:20"},{key:"eventConverted",detail:"CC-DEMO-104",time:"08:23"}]}
];
let leads=seed(),selectedId=101,duplicates=0,sequence=105;
const $=id=>document.getElementById(id);
const phrase=key=>(translations[lang]||translations.uk)[key]||key;
const tr=(key)=>phrase(key);
function setCopy(){document.documentElement.lang=lang;document.querySelectorAll("[data-i18n]").forEach(n=>n.textContent=tr(n.dataset.i18n));document.querySelectorAll("[data-placeholder]").forEach(n=>n.placeholder=tr(n.dataset.placeholder));}
function el(tag,cls,txt){const node=document.createElement(tag);if(cls)node.className=cls;if(txt!==undefined)node.textContent=txt;return node;}
function person(l){return lang==="en"?l.nameEn:l.name;}
function company(l){return lang==="en"?l.orgEn:l.org;}
function stamp(){return new Intl.DateTimeFormat(lang==="en"?"en-GB":"uk-UA",{hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date());}
function record(l,key,detail=""){l.events.push({key,detail,time:stamp()});}
function active(){return leads.find(l=>l.id===selectedId)||leads[0];}
let toastTimer;
function toast(txt){const n=$("toast");n.textContent=txt;n.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>n.classList.remove("show"),2700);}
function render(){
$("stat-total").textContent=leads.length;
$("stat-qualified").textContent=leads.filter(x=>x.status==="qualified").length;
$("stat-converted").textContent=leads.filter(x=>x.status==="converted").length;
$("stat-duplicates").textContent=duplicates;
const search=$("search").value.trim().toLocaleLowerCase();
const filter=$("filter").value;
const shown=leads.filter(l=>(filter==="all"||l.status===filter)&&[l.name,l.nameEn,l.org,l.orgEn].join(" ").toLocaleLowerCase().includes(search));
$("visible-count").textContent=shown.length;
const list=$("lead-list");list.replaceChildren();
if(!shown.length){list.append(el("p","empty",tr("noResults")));}
shown.forEach(l=>{const b=el("button","lead"+(l.id===selectedId?" selected":""));b.type="button";b.setAttribute("aria-pressed",String(l.id===selectedId));const body=el("span");body.append(el("span","client-name",person(l)),el("span","client-organization",company(l)));const status=el("span","badge",tr("status"+l.status[0].toUpperCase()+l.status.slice(1)));status.dataset.status=l.status;b.append(body,status);b.addEventListener("click",()=>{selectedId=l.id;render();});list.append(b);});
const l=active();if(!l)return;
$("client-title").textContent=person(l);
$("client-subtitle").textContent=company(l);
const status=$("client-status");status.textContent=tr("status"+l.status[0].toUpperCase()+l.status.slice(1));status.dataset.status=l.status;
$("field-source").textContent=tr(l.source);
$("field-method").textContent=tr(l.method);
$("field-id").textContent=l.external;
$("field-project").textContent=l.project||tr("projectNone");
$("assignee").value=l.assigned;
$("advance").disabled=l.status==="converted";$("advance").textContent=l.status==="converted"?tr("stageDone"):tr("nextStep");
const events=$("timeline");events.replaceChildren();
$("history-count").textContent=l.events.length;
l.events.slice().reverse().forEach(e=>{const li=el("li");li.append(el("strong","",tr(e.key)),el("p","",e.detail||tr("sourceSystem")),el("time","",e.time));events.append(li);});
}
$("ingest").addEventListener("click",()=>{const id=sequence++;const l={id,name:"Демо Контакт "+id,nameEn:"Demo Contact "+id,org:"Тестова організація "+id,orgEn:"Sample Company "+id,status:"new",source:"sourceWebsite",method:"methodWebsite",external:"fiction-"+id,assigned:"unassigned",project:null,events:[]};record(l,"eventCreated","website_form · simulation");leads.unshift(l);selectedId=id;$("filter").value="all";$("search").value="";render();toast(tr("toastNew"));});
$("reset").addEventListener("click",()=>{leads=seed();selectedId=101;duplicates=0;sequence=105;$("search").value="";$("filter").value="all";$("note").value="";render();toast(tr("toastReset"));});
$("search").addEventListener("input",render);$("filter").addEventListener("change",render);
$("assignee").addEventListener("change",()=>{const l=active();l.assigned=$("assignee").value;record(l,"eventAssigned",l.assigned==="unassigned"?tr("unassigned"):tr("manager"+l.assigned));render();});
$("call").addEventListener("click",()=>{record(active(),"eventCall","outbound / simulated");render();toast(tr("toastCall"));});
$("retry").addEventListener("click",()=>{duplicates++;render();toast(tr("toastRetry"));});
$("advance").addEventListener("click",()=>{const l=active();const next={new:["contacted","eventContact"],contacted:["qualified","eventQualified"],qualified:["converted","eventConverted"]}[l.status];if(!next)return;l.status=next[0];if(l.status==="converted")l.project="CC-DEMO-"+l.id;record(l,next[1],l.project||"");render();toast(tr("toastChanged"));});
$("note-form").addEventListener("submit",event=>{event.preventDefault();const note=$("note").value.trim();if(!note)return;record(active(),"eventNote",note.slice(0,160));$("note").value="";render();toast(tr("toastNote"));});
langSelect.addEventListener("change",()=>{lang=langSelect.value==="en"?"en":"uk";setCopy();render();});
setCopy();render();
})();