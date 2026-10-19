(()=>{const data={
uk:{
routine:["Замість ручних дій — зрозумілий процес.","Розрахунки, шаблони, чернетки та робота з документами.",[["Генератор КП","proposal-builder"],["ContentFlow","contentflow"]]],
integrations:["Системи мають обмінюватися даними, а не покладатися на ручне копіювання.","API, передавання інформації, діагностика помилок і перевірка інтеграцій.",[["ContentFlow","contentflow"],["AI Development Workbench","development-workbench"]]],
monitoring:["Побачити проблему вчасно — вже частина її вирішення.","Історія станів, аварійні події й сповіщення без втручання в керування.",[["Моніторинг вентиляції","industrial-monitoring"]]],
ai:["AI має приносити практичну користь.","Підключення LLM, контроль результатів і людина в циклі перевірки.",[["ContentFlow","contentflow"],["AI Development Workbench","development-workbench"]]]},
en:{
routine:["Less manual work, more controlled outcomes.","Calculations, templates, drafts and document workflows.",[["Proposal Builder","proposal-builder"],["ContentFlow","contentflow"]]],
integrations:["Systems should exchange data without repeated copy-paste.","APIs, data transfer, failure diagnostics and integration validation.",[["ContentFlow","contentflow"],["AI Development Workbench","development-workbench"]]],
monitoring:["Seeing a problem early is part of solving it.","Status history, alarm events and read-only alerts.",[["Ventilation Monitoring","industrial-monitoring"]]],
ai:["AI should bring real value to an actual workflow.","Connecting LLMs, human verification and reliable delivery.",[["ContentFlow","contentflow"],["AI Development Workbench","development-workbench"]]]}};
const group=Array.from(document.querySelectorAll(".solve-button")),title=document.getElementById("solution-title"),desc=document.getElementById("solution-desc"),links=document.getElementById("solution-links");if(!group.length||!title||!desc||!links)return;
const lang=document.documentElement.lang==="en"?"en":"uk";
group.forEach(button=>button.addEventListener("click",()=>{const picked=button.dataset.key,record=data[lang][picked];if(!record)return;group.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));title.textContent=record[0];desc.textContent=record[1];links.replaceChildren();for(const [label,slug] of record[2]){const a=document.createElement("a");a.href="projects/"+slug+".html";a.textContent=label+" ↗";links.append(a)}}));
})();