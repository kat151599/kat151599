'use strict'
// ClientCircuit/Vikunja read-only portfolio showcase. No mutations, auth token,
// service worker, external resource, or browser persistence is used.
const el = id => document.getElementById(id)
const titleMap = {overview:'Обзор',projects:'Проекты',tasks:'Задачи',users:'Пользователи',teams:'Команды'}
let demo = null
let searchTerm = ''
let activeView = 'overview'

function node(tag, text, cls) {
  const result = document.createElement(tag)
  if (text !== undefined && text !== null) result.textContent = String(text)
  if (cls) result.className = cls
  return result
}
function wrap(tag,cls,...children) {
  const n=node(tag,null,cls)
  for(const c of children){if(c) n.append(c)}
  return n
}
function findPerson(id) {return demo.people.find(x => x.id===id)?.name ?? '—'}
function findTeam(id) {return demo.teams.find(x => x.id===id)?.name ?? '—'}
function findProject(id) {return demo.projects.find(x => x.id===id)?.name ?? '—'}
function countTasks(id) {return demo.tasks.filter(t => t.project_id===id).length}
function percent(id) {const tasks=demo.tasks.filter(t=>t.project_id===id);return tasks.length?Math.round(tasks.filter(x=>x.state==='done').length/tasks.length*100):0}
function stateLabel(value){return ({done:'Завершена',in_progress:'В работе',todo:'Запланирована'})[value]??value}
function priorityLabel(value){return ({high:'Высокий',normal:'Обычный',low:'Низкий'})[value]??value}
function matches(...parts){return !searchTerm || parts.some(x=>String(x??'').toLocaleLowerCase('ru').includes(searchTerm))}
function sectionHeading(title, subtitle) {
  return wrap('div','section-heading',wrap('div',null,node('h1',title),node('p',subtitle)),node('span','DEMO · Только просмотр','tag'))
}
function badge(text,cls='') {return node('span',text,'badge '+cls)}
function table(headers,rows) {
  const t=node('table'),head=node('thead'),body=node('tbody'),hr=node('tr')
  headers.forEach(h=>hr.append(node('th',h)));head.append(hr);t.append(head)
  rows.forEach(cells=>{
    const row=node('tr')
    cells.forEach(cell=>{const td=node('td'); if(cell instanceof Node) td.append(cell); else td.textContent=String(cell??'');row.append(td)})
    body.append(row)
  })
  t.append(body)
  return wrap('div','table-scroll',t)
}
function empty(title='Ничего не найдено') {return wrap('div','empty',node('strong',title),node('p','Попробуйте изменить поисковый запрос. Данные демонстрационные.'))}
function progress(value) {
  const bar=wrap('div','progress',node('span',null,'progress-fill'))
  bar.firstElementChild.style.width=Math.max(0,Math.min(100,Number(value)))+'%'
  return bar
}
function statCard(label,value,caption,icon) {
  return wrap('div','stat-card',wrap('div','stat-top',node('span',label),node('span',icon,'stat-icon')),
    node('div',value,'stat-num'),node('small',caption))
}
function button(text,action) {
  const b=node('button',text,'text-button')
  b.type='button';b.addEventListener('click',action);return b
}
function renderOverview(root) {
  root.append(sectionHeading('Обзор пространства','Ключевые показатели вымышленной организации'))
  root.append(wrap('div','stats',
    statCard('Проекты',demo.projects.length,'В разных командах','▦'),
    statCard('Задачи',demo.tasks.length,'Во всех проектах','☷'),
    statCard('Пользователи',demo.people.length,'Учебные учётные записи','♙'),
    statCard('Команды',demo.teams.length,'Тестовые рабочие группы','◈')))
  const p=wrap('section','card');p.append(wrap('div','card-heading',node('h2','Активные проекты'),button('Все проекты →',()=>location.hash='#projects')))
  const grid=wrap('div','project-list')
  demo.projects.forEach(project=>grid.append(projectCard(project)))
  p.append(grid);root.append(p)
  const recent=wrap('section','card');recent.append(wrap('div','card-heading',node('h2','Ближайшие задачи'),button('Все задачи →',()=>location.hash='#tasks')))
  const tasks=[...demo.tasks].filter(x=>x.state!=='done').sort((a,b)=>a.due_date.localeCompare(b.due_date)).slice(0,5)
  recent.append(table(['Задача','Проект','Ответственный','Срок'],tasks.map(t=>[
    button(t.title,()=>openTask(t)),findProject(t.project_id),findPerson(t.assignee_id),t.due_date
  ])));root.append(recent)
}
function projectCard(p) {
  const card=wrap('article','project-card')
  const dot=node('span','','project-dot');dot.style.backgroundColor=p.color
  card.append(wrap('div','project-title',dot,node('strong',p.name)))
  card.append(node('p',p.description))
  card.append(wrap('div','project-meta',node('span',findTeam(p.team_id)),node('span',countTasks(p.id)+' задач')))
  card.append(progress(percent(p.id)))
  card.append(wrap('div','project-bottom',node('span',percent(p.id)+'% выполнено'),button('Подробнее →',()=>openProject(p))))
  return card
}
function filtered(items,...keys){return items.filter(item=>matches(...keys.map(k=>item[k])))}
function searchBox() {
  const input=node('input');input.placeholder='Поиск по разделу…';input.type='search';input.value=searchTerm
  input.setAttribute('aria-label','Поиск по разделу')
  input.addEventListener('input',()=>{searchTerm=input.value.toLocaleLowerCase('ru').trim();renderContent(true)})
  return wrap('div','search',input)
}
function renderProjects(root) {
  root.append(sectionHeading('Проекты','Группировка по командам, владельцам и задачам'))
  root.append(searchBox())
  const projects=demo.projects.filter(p=>matches(p.name,p.description,findTeam(p.team_id),findPerson(p.owner_id)))
  if(!projects.length){root.append(empty());return}
  const grid=wrap('div','project-grid');projects.forEach(p=>grid.append(projectCard(p)));root.append(grid)
}
function renderTasks(root) {
  root.append(sectionHeading('Задачи','Состояния, приоритеты, сроки и исполнители'))
  root.append(searchBox())
  const tasks=demo.tasks.filter(t=>matches(t.title,t.description,findProject(t.project_id),findPerson(t.assignee_id),t.state))
  if(!tasks.length){root.append(empty());return}
  root.append(wrap('section','card',table(['ID','Задача','Проект','Состояние','Приоритет','Исполнитель','Срок'],tasks.map(t=>[
    '#'+t.id,button(t.title,()=>openTask(t)),findProject(t.project_id),
    badge(stateLabel(t.state),t.state),badge(priorityLabel(t.priority),t.priority),
    findPerson(t.assignee_id),t.due_date
  ]))))
}
function renderUsers(root) {
  root.append(sectionHeading('Пользователи','Вымышленные учётные записи и распределение ролей'))
  root.append(searchBox())
  const people=demo.people.filter(p=>matches(p.name,p.handle,p.role,findTeam(p.team_id)))
  if(!people.length){root.append(empty());return}
  root.append(wrap('section','card',table(['Пользователь','Псевдоним','Роль','Команда','Статус'],people.map(p=>[
    button(p.name,()=>openUser(p)),p.handle,p.role,findTeam(p.team_id),
    badge(p.status==='active'?'Активен':'Приглашён',p.status==='active'?'done':'todo')
  ]))))
}
function renderTeams(root) {
  root.append(sectionHeading('Команды','Роли, участники и учебная структура'))
  root.append(searchBox())
  const teams=demo.teams.filter(t=>matches(t.name,t.description))
  if(!teams.length){root.append(empty());return}
  const grid=wrap('div','project-grid')
  teams.forEach(t=>{
    const users=demo.people.filter(p=>p.team_id===t.id)
    const projects=demo.projects.filter(p=>p.team_id===t.id)
    grid.append(wrap('article','project-card',
      node('h2',t.name),node('p',t.description),
      node('p',users.length+' участника · '+projects.length+' проекта','dim'),
      button('Посмотреть участников →',()=>openTeam(t))))
  })
  root.append(grid)
}
function detail(title,entries,description='') {
  const body=el('details-body');body.replaceChildren()
  body.append(node('p','DEMO · только чтение','eyebrow'),node('h2',title))
  if(description)body.append(node('p',description,'detail-description'))
  const list=wrap('dl','details-list')
  entries.forEach(([k,v])=>list.append(node('dt',k),node('dd',String(v??'—'))))
  body.append(list)
  el('details').showModal()
}
function openTask(t){detail(t.title,[['ID','#'+t.id],['Проект',findProject(t.project_id)],['Исполнитель',findPerson(t.assignee_id)],['Статус',stateLabel(t.state)],['Приоритет',priorityLabel(t.priority)],['Срок',t.due_date]],t.description)}
function openProject(p){detail(p.name,[['Команда',findTeam(p.team_id)],['Владелец',findPerson(p.owner_id)],['Задач',countTasks(p.id)],['Выполнено',percent(p.id)+'%']],p.description)}
function openUser(p){detail(p.name,[['Псевдоним',p.handle],['Роль',p.role],['Команда',findTeam(p.team_id)],['Статус',p.status]])}
function openTeam(t){detail(t.name,[['Участники',demo.people.filter(p=>p.team_id===t.id).map(p=>p.name).join(', ')],['Проекты',demo.projects.filter(p=>p.team_id===t.id).map(p=>p.name).join(', ')]],t.description)}
function renderContent(keepFocus=false) {
  const view=(location.hash.slice(1)||'overview').split('?')[0]
  activeView=Object.hasOwn(titleMap,view)?view:'overview'
  el('breadcrumb').textContent=titleMap[activeView]
  document.querySelectorAll('#nav a').forEach(a=>{
    const selected=a.dataset.view===activeView
    a.classList.toggle('selected',selected)
    if(selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')
  })
  const active=document.activeElement
  const caret=keepFocus && active instanceof HTMLInputElement?active.selectionStart:null
  const root=el('content');root.replaceChildren()
  ;({overview:renderOverview,projects:renderProjects,tasks:renderTasks,users:renderUsers,teams:renderTeams})[activeView](root)
  if(caret!==null){
    const next=root.querySelector('input[type=search]')
    if(next){next.focus();next.setSelectionRange(caret,caret)}
  }
}
window.addEventListener('hashchange',()=>{searchTerm='';renderContent()})
async function start() {
  try{
    const response=await fetch('./snapshot.json',{credentials:'omit',cache:'no-store',headers:{Accept:'application/json'}})
    if(!response.ok)throw new Error('HTTP '+response.status)
    const json=await response.json()
    if(json.demo!==true||json.version!==1||!Array.isArray(json.people)||!Array.isArray(json.tasks)||
       !Array.isArray(json.projects)||!Array.isArray(json.teams))throw new Error('Неправильный формат учебных данных')
    demo=json
    el('loading').hidden=true
    el('content').hidden=false
    renderContent()
  }catch(err){
    el('loading').hidden=true
    const e=el('error');e.hidden=false;e.textContent='Не удалось открыть безопасную демонстрацию: '+(err.message||'ошибка загрузки')
  }
}
start()
