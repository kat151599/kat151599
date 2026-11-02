(function () {
  'use strict';
  // SH-PORT03: independent browser-only simulation of ServiceHub.
  // Never connects to native ServiceHub, Docker, Windows, WebSocket, or any remote node.
  const KEY = 'servicehub-portfolio-demo-v3';
  const KINDS = {process:'Процесс',docker:'Docker',docker_compose:'Docker Compose',monitor_only:'Наблюдение',remote:'Удалённый'};
  const LABELS = {running:'Работает',stopped:'Остановлен',degraded:'Проблема'};
  const VIEWS = {overview:'Обзор',services:'Сервисы',logs:'Логи',statistics:'Статистика',settings:'Настройки'};
  const MAX_SERVICES = 80;
  const MAX_EVENTS = 160;
  const $ = (id) => document.getElementById(id);
  const seedServices = [
    ['s01','Demo API Gateway','process','running',true,'Тестовый веб-шлюз'],
    ['s02','Content Queue Worker','process','running',true,'Вымышленный обработчик очереди'],
    ['s03','Archive Indexer','process','stopped',false,'Индексатор тестового архива'],
    ['s04','Report Generator','process','running',false,'Формирование демонстрационных отчётов'],
    ['s05','Local Sync Agent','process','degraded',true,'Симулированная задержка синхронизации'],
    ['s06','Public Status Page','monitor_only','running',false,'Тестовый HTTP-сайт · без запросов'],
    ['s07','External Endpoint','monitor_only','stopped',false,'Тестовый TCP-адрес · без запросов'],
    ['s08','Backup Demo Stack','docker_compose','running',true,'Вымышленный Compose-проект'],
    ['s09','Remote Demo App','remote','running',false,'Подключённый тестовый узел'],
    ['s10','Remote Log Worker','remote','stopped',false,'Вымышленный удалённый воркер'],
    ['s11','Remote Database','remote','degraded',false,'Тестовый удалённый сервис']
  ];
  let state = null;
  let view = 'overview';
  let selectedFilter = 'all';
  function safe(text) {
    return String(text == null ? '' : text).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});
  }
  function fresh() {
    return {version:3, sequence:100,
      services:seedServices.map(function(s){return {id:s[0],name:s[1],kind:s[2],status:s[3],autostart:s[4],notes:s[5],uptime:s[3]==='stopped'?0:550+s[0].charCodeAt(2)*3};}),
      events:[
        {id:1,ts:'08:14:02',type:'info',name:'ServiceHub',message:'Демонстрационный сеанс запущен'},
        {id:2,ts:'08:14:15',type:'success',name:'Demo API Gateway',message:'Сервис работает · simulated'},
        {id:3,ts:'08:15:22',type:'warning',name:'Local Sync Agent',message:'Симуляция задержки heartbeat'},
        {id:4,ts:'08:17:08',type:'info',name:'Backup Demo Stack',message:'Тестовый Docker Compose готов'},
        {id:5,ts:'08:18:31',type:'warning',name:'Remote Database',message:'Снижение доступности · simulated'}
      ],
      remote:{connected:true,name:'DEMO-NODE-01'},
      preferences:{notifications:true,compact:false},
      createdAt:Date.now()
    };
  }
  function validate(obj) {
    if(!obj || obj.version!==3 || !Array.isArray(obj.services) || obj.services.length>MAX_SERVICES ||
       !Array.isArray(obj.events) || obj.events.length>MAX_EVENTS || !obj.remote || !obj.preferences) return false;
    return obj.services.every(function(x){
      return x && typeof x.id==='string' && x.id.length<80 && typeof x.name==='string' && x.name.length<=64 &&
       Object.hasOwn(KINDS,x.kind) && Object.hasOwn(LABELS,x.status) &&
       typeof x.notes==='string' && x.notes.length<=140 && typeof x.autostart==='boolean';
    });
  }
  try {const loaded=JSON.parse(localStorage.getItem(KEY));state=validate(loaded)?loaded:fresh();} catch(_){state=fresh();}
  function save() {try {localStorage.setItem(KEY,JSON.stringify(state));}catch(_){toast('Хранилище браузера недоступно: изменения сохраняются до обновления страницы.');}}
  function clock(){return new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit',second:'2-digit'});}
  function event(name,message,type){
    state.events.unshift({id:++state.sequence,ts:clock(),type:type||'info',name:name,message:message});
    state.events=state.events.slice(0,MAX_EVENTS);
  }
  function toast(message) {
    const node=document.createElement('div');node.className='toast';node.textContent=message;
    $('toasts').appendChild(node);setTimeout(function(){node.remove();},3100);
  }
  function status(s){return '<span class="status '+safe(s)+'">'+safe(LABELS[s]||'Неизвестно')+'</span>';}
  function kind(s){return safe(KINDS[s]||'Неизвестно');}
  function byId(id){return state.services.find(function(s){return s.id===id;});}
  function icon(s){return s.kind==='docker_compose'?'⬡':s.kind==='docker'?'▣':s.kind==='monitor_only'?'◉':s.kind==='remote'?'⌁':'▣';}
  function canControl(s){return s.kind!=='monitor_only' && (s.kind!=='remote'||state.remote.connected);}
  function counts(){
    return {all:state.services.length, running:state.services.filter(function(x){return x.status==='running';}).length,
      stopped:state.services.filter(function(x){return x.status==='stopped';}).length,
      degraded:state.services.filter(function(x){return x.status==='degraded';}).length};
  }
  function metrics(s){
    if(s.status==='stopped')return {cpu:0,ram:0};
    const v=s.id.split('').reduce(function(n,c){return n+c.charCodeAt(0);},0);
    return {cpu:Math.min(94,8+(v%39)),ram:Math.min(93,14+(v*7%45))};
  }
  function heading(title,subtitle,actions){
    return '<div class="section-title"><div><h2>'+safe(title)+'</h2><p>'+safe(subtitle)+'</p></div>'+
      (actions||'')+'</div>';
  }
  function bAction(action,id,label,extra,disabled){
    return '<button type="button" class="button tiny '+(extra||'')+'" data-action="'+safe(action)+'" data-id="'+safe(id)+
     '"'+(disabled?' disabled':'')+'>'+safe(label)+'</button>';
  }
  function controls(s){
    if(!canControl(s))return '<span class="muted">Только наблюдение'+(s.kind==='remote'?' · узел отключён':'')+'</span>';
    return bAction('start',s.id,'▶ Запуск','',s.status==='running')+
      bAction('stop',s.id,'■ Стоп','',s.status==='stopped')+
      bAction('restart',s.id,'↻','',s.status==='stopped');
  }
  function card(s){
    const m=metrics(s);
    return '<article class="service-card" data-service="'+safe(s.id)+'"><div class="card-head">'+
      '<span class="card-icon">'+icon(s)+'</span><div class="card-main"><div class="card-title">'+safe(s.name)+'</div>'+
      '<div class="card-kind">'+kind(s)+'</div></div></div>'+
      '<div class="service-meta">'+status(s.status)+'<span class="kind-pill">'+(s.autostart?'● Автозапуск':'○ Вручную')+'</span></div>'+
      '<p class="service-note">'+safe(s.notes)+'</p>'+
      '<div class="card-metrics"><span>CPU <strong>'+m.cpu+'%</strong></span><span>RAM <strong>'+m.ram+'%</strong></span><span>Uptime <strong>'+
      (s.status==='stopped'?'—':Math.floor((s.uptime||0)/60)+'м')+'</strong></span></div>'+
      '<div class="card-actions">'+controls(s)+'</div></article>';
  }
  function empty(title,desc){
    return '<div class="empty-state"><span class="empty-icon">▦</span><h3>'+safe(title)+'</h3><p>'+safe(desc)+'</p>'+
      '<button type="button" class="button primary" data-action="add">+ Добавить тестовый сервис</button></div>';
  }
  function summary() {
    const c=counts();
    const cards=[
      ['Сервисы',c.all,'Всего зарегистрировано','▤'],
      ['Работают',c.running,'Смоделированный статус','◉'],
      ['Остановлены',c.stopped,'Без фактических процессов','Ⅱ'],
      ['Требуют внимания',c.degraded,'Тестовая диагностика','!']
    ];
    return '<div class="summary-grid">'+cards.map(function(a){return '<article class="stat-card"><div class="stat-top"><span>'+a[0]+
      '</span><span class="stat-symbol">'+a[3]+'</span></div><div class="stat-number">'+a[1]+
      '</div><div class="stat-detail">'+a[2]+'</div></article>';}).join('')+'</div>';
  }
  function eventsHTML(items){
    return '<div class="events">'+items.map(function(e){
      return '<div class="event"><span class="event-marker '+(e.type==='warning'?'warning':e.type==='error'?'error':'')+'">'+
        (e.type==='warning'?'!':e.type==='success'?'✓':'·')+'</span><div class="event-body"><strong>'+safe(e.name)+
        '</strong><small>'+safe(e.ts)+'</small><p>'+safe(e.message)+'</p></div></div>';
    }).join('')+'</div>';
  }
  function overview(){
    return summary()+'<div class="content-two"><section class="panel">'+
      heading('Обзор сервисов','Управление тестовыми приложениями · без команд ОС',
       '<button type="button" class="button primary" data-action="add">+ Добавить сервис</button>')+
      (state.services.length?'<div class="service-grid">'+state.services.map(card).join('')+'</div>':
       empty('Нет зарегистрированных сервисов','Пустая база — нормальное состояние ServiceHub. Начните с нового тестового приложения.'))+
      '</section><aside class="panel">'+heading('Лента событий','Последние операции симуляции')+
      (state.events.length?eventsHTML(state.events.slice(0,7)):empty('Журнал пуст','Появится после операций с тестовыми сервисами.'))+
      '</aside></div>';
  }
  function services() {
    const actions='<div class="flex"><button type="button" class="button light" data-action="reset">↻ Демо</button>'+
      '<button type="button" class="button primary" data-action="add">+ Добавить сервис</button></div>';
    return '<section class="panel">'+heading('Сервисы','Источник запуска выбирается в настольном ServiceHub; здесь управление полностью моделируется.',actions)+
      '<div class="control-row"><input id="service-search" class="search-input" type="search" autocomplete="off" placeholder="Найти тестовый сервис…" aria-label="Поиск сервисов">'+
      '<select id="kind-filter" class="select" aria-label="Тип сервиса"><option value="all">Все типы</option>'+
      Object.keys(KINDS).map(function(k){return '<option value="'+k+'">'+kind(k)+'</option>';}).join('')+'</select></div>'+
      (state.services.length?'<div class="table-scroll"><table class="table"><thead><tr><th>Сервис</th><th>Тип</th><th>Состояние</th><th>Автозапуск</th><th>Управление</th></tr></thead><tbody>'+
      state.services.map(function(s){return '<tr data-kind="'+safe(s.kind)+'" data-search="'+safe(s.name.toLowerCase())+'"><td><strong>'+safe(s.name)+'</strong><small>'+safe(s.notes)+'</small></td>'+
       '<td>'+kind(s.kind)+'</td><td>'+status(s.status)+'</td><td>'+(s.autostart?'● Да':'○ Нет')+'</td>'+
       '<td><div class="row-actions">'+controls(s)+bAction('edit',s.id,'Изменить')+bAction('delete',s.id,'Удалить','danger')+
       '</div></td></tr>';}).join('')+'</tbody></table></div>':
       empty('База сервисов пуста','Создайте первый тестовый сервис или восстановите демонстрационные данные.'))+
       '</section>';
  }
  function logs(){
    return '<section class="panel logs-panel">'+heading('Журнал событий','Записи только из тестовых операций; никаких системных логов.')+
      '<div class="control-row"><select class="select" id="event-filter" aria-label="Фильтр событий">'+
      '<option value="all">Все события</option><option value="success">Успех</option><option value="info">Информация</option>'+
      '<option value="warning">Предупреждения</option><option value="error">Ошибки</option></select>'+
      '<button type="button" class="button light" data-action="clear-events">Очистить журнал</button></div>'+
      '<div id="event-items">'+eventRows('all')+'</div></section>';
  }
  function eventRows(type){
    const items=state.events.filter(function(e){return type==='all'||e.type===type;});
    return items.length?eventsHTML(items):empty('Событий пока нет','Выберите другой фильтр или выполните действие над сервисом.');
  }
  function bars(values,style){
    return '<div class="bars">'+values.map(function(v){
      return '<div class="bar '+(style||'')+' h'+v+'"><span>'+v+'%</span></div>';
    }).join('')+'</div><div class="chart-foot"><span>Ранее</span><span>Последние 12 интервалов · симуляция</span><span>Сейчас</span></div>';
  }
  function statistics() {
    const c=counts();
    const v=[16,21,25,20,28,38,31,26,34,23,35,24],m=[30,34,33,38,35,37,40,41,36,38,39,37];
    return summary()+'<div class="hint-panel">Показатели ниже — фиксированные иллюстративные значения. Данные сервера и метрики настоящих приложений не запрашиваются.</div>'+
      '<div class="chart-grid"><section class="panel chart-card"><h3>Загрузка CPU · тестовые измерения</h3>'+bars(v,'')+'</section>'+
      '<section class="panel chart-card"><h3>Использование RAM · тестовые измерения</h3>'+bars(m,'green')+'</section>'+
      '<section class="panel chart-card"><h3>Распределение по статусам</h3>'+
      '<div class="flex stats-status-line">'+status('running')+' '+c.running+' · '+status('stopped')+' '+c.stopped+' · '+status('degraded')+' '+c.degraded+'</div>'+
      '<p class="muted">Количество сервисов отражает текущее состояние тестовой базы.</p></section>'+
      '<section class="panel chart-card"><h3>История действий</h3><div class="stat-number">'+state.events.length+'</div>'+
      '<p class="muted">Тестовых событий в локальном журнале · лимит '+MAX_EVENTS+'</p></section></div>';
  }
  function settings(){
    return '<div class="hint-panel">Настройки демонстрации относятся только к этому браузеру. Настоящая конфигурация ServiceHub и Remote API не затрагиваются.</div>'+
      '<div class="settings-grid"><section class="panel settings-card"><h3>Локальные параметры</h3>'+
      '<label class="settings-option"><input type="checkbox" id="notify-setting" '+(state.preferences.notifications?'checked':'')+'> Уведомления о тестовых операциях</label>'+
      '<label class="settings-option"><input type="checkbox" id="compact-setting" '+(state.preferences.compact?'checked':'')+'> Компактный режим карточек</label>'+
      '<p>Данные сохраняются в localStorage этого браузера. Настоящий автозапуск и планировщик Windows не используются.</p>'+
      '<div class="flex"><button type="button" class="button light" data-action="empty">Очистить тестовую базу</button>'+
      '<button type="button" class="button primary" data-action="reset">↻ Восстановить демо</button></div></section>'+
      '<section class="panel settings-card"><h3>Remote Nodes · simulation</h3>'+
      '<p>В исходном настольном ServiceHub есть Remote Nodes v1 с защищённым API. Здесь нет подключения к сети и возможности ввести токен.</p>'+
      '<div class="node-list"><div class="node"><div><strong>'+safe(state.remote.name)+'</strong><small>Вымышленный тестовый узел</small></div>'+
      '<div class="flex">'+status(state.remote.connected?'running':'stopped')+
      '<button type="button" class="button tiny" data-action="toggle-remote">'+(state.remote.connected?'Отключить':'Подключить')+'</button></div></div></div>'+
      '<p>Переключатель меняет доступность команд для трёх вымышленных remote-сервисов.</p></section>'+
      '<section class="panel settings-card"><h3>Информация о версии</h3>'+
      '<p>ServiceHub Desktop: Python + PySide6. Витрина воспроизводит основные сценарии для демонстрации без прямого исполнения нативного кода.</p>'+
      '<p><strong>Source snapshot:</strong> 08d856c · 2026-11-02</p>'+
      '<p><strong>Web Demo:</strong> SH-PORT03 · isolated simulation</p></section>'+
      '<section class="panel settings-card"><h3>Границы безопасности</h3>'+
      '<p>Никаких реальных API, WebSocket, SQLite сервера, Docker, операций с файлами, запусков процессов и внешних HTTP-запросов.</p>'+
      '<p>Откройте «Пустая база», чтобы проверить независимый старт приложения без сервисов и ProjectPulse.</p></section></div>';
  }
  function render(){
    const content={overview,services,logs,statistics,settings}[view]();
    $('workspace').innerHTML=content;
    $('view-title').textContent=VIEWS[view];
    document.querySelectorAll('.nav-button').forEach(function(b){
      b.classList.toggle('active',b.dataset.view===view);
      b.setAttribute('aria-current',b.dataset.view===view?'page':'false');
    });
    const n=state.services.length;
    $('footer-count').textContent=n+' '+(n===1?'сервис':(n>=2&&n<=4?'сервиса':'сервисов'));
    $('demo-clock').textContent=clock();
    $('side-cpu').textContent=state.services.length?'24%':'0%';
    $('side-ram').textContent=state.services.length?'37%':'0%';
    document.body.classList.toggle('no-services',state.services.length===0);
    document.body.classList.toggle('compact',!!state.preferences.compact);
  }
  function navigate(next) {
    if(!Object.hasOwn(VIEWS,next))return;
    view=next;render();
    $('workspace').focus({preventScroll:true});
  }
  function action(name,id){
    const s=byId(id);
    if(['start','stop','restart'].includes(name)){
      if(!s)return;
      if(!canControl(s)){toast('Этот тестовый сервис доступен только для наблюдения.');return;}
      if(name==='start'&&s.status==='running')return;
      if(name==='stop'&&s.status==='stopped')return;
      if(name==='restart'&&s.status==='stopped')return;
      const operation={start:'Запуск',stop:'Остановка',restart:'Перезапуск'}[name];
      s.status=name==='stop'?'stopped':'running';s.uptime=name==='stop'?0:1;
      event(s.name,operation+' выполнен · simulated','success');save();render();
      if(state.preferences.notifications)toast(s.name+': '+operation.toLowerCase()+' (симуляция)');
      return;
    }
    if(name==='add'){openForm();return;}
    if(name==='edit'&&s){openForm(s);return;}
    if(name==='delete'&&s){
      if(!window.confirm('Удалить тестовый сервис «'+s.name+'»?'))return;
      state.services=state.services.filter(function(x){return x.id!==s.id;});
      event(s.name,'Тестовый сервис удалён','warning');save();render();toast('Удалено только из тестовой базы.');return;
    }
    if(name==='clear-events'){state.events=[];save();render();toast('Тестовый журнал очищен.');return;}
    if(name==='toggle-remote'){
      state.remote.connected=!state.remote.connected;
      event(state.remote.name,state.remote.connected?'Тестовый узел подключён':'Тестовый узел отключён','info');
      save();render();return;
    }
    if(name==='empty'||name==='reset'){
      if(!window.confirm(name==='empty'?'Очистить все тестовые сервисы и события?':'Восстановить исходные демонстрационные данные?'))return;
      state=name==='empty'?{version:3,sequence:0,services:[],events:[],remote:{connected:true,name:'DEMO-NODE-01'},preferences:{notifications:true,compact:false},createdAt:Date.now()}:fresh();
      selectedFilter='all';save();render();
      toast(name==='empty'?'Тестовая база пуста.':'Демонстрационные данные восстановлены.');return;
    }
  }
  function openForm(s){
    $('dialog-title').textContent=s?'Изменить тестовый сервис':'Добавить тестовый сервис';
    $('form-submit').textContent=s?'Сохранить изменения':'Добавить сервис';
    $('form-id').value=s?s.id:'';
    $('form-name').value=s?s.name:'';
    $('form-kind').value=s?s.kind:'process';
    $('form-state').value=s?s.status:'stopped';
    $('form-notes').value=s?s.notes:'';
    $('form-autostart').checked=s?s.autostart:false;
    $('modal-backdrop').classList.remove('hidden');
    $('form-name').focus();
  }
  function closeForm(){$('modal-backdrop').classList.add('hidden');}
  $('service-form').addEventListener('submit',function(e){
    e.preventDefault();
    const id=$('form-id').value;
    const name=$('form-name').value.trim(),notes=$('form-notes').value.trim();
    const k=$('form-kind').value,st=$('form-state').value;
    if(!name||name.length>64||notes.length>140||!Object.hasOwn(KINDS,k)||!Object.hasOwn(LABELS,st)){
      toast('Проверьте название и поля сервиса.');return;
    }
    const old=id?byId(id):null;
    if(id&&!old){toast('Запись больше не существует.');closeForm();return;}
    if(!old&&state.services.length>=MAX_SERVICES){toast('Демо ограничено '+MAX_SERVICES+' сервисами.');return;}
    const service=old||{id:'demo-'+(++state.sequence),uptime:0};
    service.name=name;service.kind=k;service.status=st;service.notes=notes||'Тестовый сервис';
    service.autostart=$('form-autostart').checked;
    if(st==='stopped')service.uptime=0;else if(!service.uptime)service.uptime=1;
    if(!old)state.services.push(service);
    event(name,old?'Изменены параметры тестового сервиса':'Добавлен тестовый сервис','info');
    closeForm();save();render();toast(old?'Изменения сохранены.':'Сервис добавлен.');
  });
  $('modal-close').addEventListener('click',closeForm);
  $('form-cancel').addEventListener('click',closeForm);
  $('modal-backdrop').addEventListener('click',function(e){if(e.target===$('modal-backdrop'))closeForm();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeForm();});
  document.querySelectorAll('.nav-button').forEach(function(b){
    b.addEventListener('click',function(){navigate(b.dataset.view);});
  });
  document.addEventListener('click',function(e){
    const btn=e.target.closest('button[data-action]');if(!btn)return;
    action(btn.dataset.action,btn.dataset.id||'');
  });
  $('demo-reset').addEventListener('click',function(){action('reset','');});
  $('demo-empty').addEventListener('click',function(){action('empty','');});
  document.addEventListener('input',function(e){
    if(e.target.id!=='service-search')return;
    const val=e.target.value.toLowerCase().trim();
    document.querySelectorAll('tr[data-kind]').forEach(function(row){
      row.hidden=!(row.getAttribute('data-search').includes(val)&&(selectedFilter==='all'||row.dataset.kind===selectedFilter));
    });
  });
  document.addEventListener('change',function(e){
    if(e.target.id==='kind-filter'){
      selectedFilter=e.target.value;
      const input=$('service-search');if(!input)return;
      const val=input.value.toLowerCase().trim();
      document.querySelectorAll('tr[data-kind]').forEach(function(row){
        row.hidden=!(row.getAttribute('data-search').includes(val)&&(selectedFilter==='all'||row.dataset.kind===selectedFilter));
      });
    }else if(e.target.id==='event-filter'){
      $('event-items').innerHTML=eventRows(e.target.value);
    }else if(e.target.id==='notify-setting'){
      state.preferences.notifications=e.target.checked;save();
    }else if(e.target.id==='compact-setting'){
      state.preferences.compact=e.target.checked;save();render();
    }
  });
  setInterval(function(){$('demo-clock').textContent=clock();},10000);
  render();save();
  Object.defineProperty(window,'__servicehubDemoStatus',{configurable:false,get:function(){return {isolated:true,version:3,services:state.services.length,events:state.events.length,view:view,remoteConnected:state.remote.connected};}});
})();
