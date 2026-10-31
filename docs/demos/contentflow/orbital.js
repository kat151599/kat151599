'use strict';
/*
 * CFO01 Orbital navigation: independent presentation layer, no API calls or persistence.
 * Inspired by Tooplate Orbital 3D Carousel (https://www.tooplate.com/view/2167-orbital).
 * Underlying ContentFlow demo.js remains byte-for-byte original.
 */
(()=>{
 const stage=document.getElementById('orbitStage'),showcase=document.getElementById('orbitalShowcase');
 const ring=document.getElementById('orbitRing'),counter=document.getElementById('orbitCounter');
 const panels=[...ring.querySelectorAll('[data-orbit]')],size=panels.length;
 const glass=document.getElementById('orbitGlass');
 if(!stage||!showcase||!ring||!counter||size!==6)return;
 let rotation=0,dragging=false,startX=0,startRotation=0,moved=false,lastInput=Date.now(),suppressUntil=0;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const norm=a=>((a%360)+360)%360;
 const nearest=()=>((Math.round(-rotation/60)%size)+size)%size;
 function render(){
  ring.style.setProperty('--rotation',rotation.toFixed(2)+'deg');
  const current=nearest();
  counter.textContent=String(current+1).padStart(2,'0')+' / '+String(size).padStart(2,'0');
  panels.forEach((panel,i)=>{
   const front=i===current;
   panel.dataset.front=front?'true':'false';
   panel.setAttribute('aria-label',panel.querySelector('strong').textContent+(front?' — попереду':''));
  });
 }
 function rotate(dir){rotation-=dir*60;lastInput=Date.now();render()}
 document.getElementById('orbitPrev').addEventListener('click',()=>rotate(-1));
 document.getElementById('orbitNext').addEventListener('click',()=>rotate(1));
 glass.addEventListener('click',()=>{
  const enabled=!showcase.classList.contains('is-glass');
  showcase.classList.toggle('is-glass',enabled);
  glass.setAttribute('aria-pressed',String(enabled));
  glass.textContent=enabled?'GLASS: ON':'GLASS: OFF';
  lastInput=Date.now();
 });
 showcase.classList.add('is-glass');
 stage.addEventListener('pointerdown',event=>{
  if(event.button!==0||!showcase.offsetParent)return;
  dragging=true;startX=event.clientX;startRotation=rotation;moved=false;lastInput=Date.now();
 });
 window.addEventListener('pointermove',event=>{
  if(!dragging)return;
  const delta=event.clientX-startX;
  if(Math.abs(delta)>7)moved=true;
  if(moved){rotation=startRotation+delta*.34;render()}
 });
 window.addEventListener('pointerup',()=>{
  if(!dragging)return;
  dragging=false;
  if(moved){suppressUntil=Date.now()+350;rotation=Math.round(rotation/60)*60;render()}
  lastInput=Date.now();
 });
 stage.addEventListener('click',event=>{
  if(Date.now()<suppressUntil && event.target.closest('a')){
   event.preventDefault();event.stopImmediatePropagation();
  }
 },true);
 stage.addEventListener('wheel',event=>{
  // Only horizontal wheel/trackpad is consumed; vertical wheel remains page scroll.
  if(Math.abs(event.deltaX)<7 && !event.shiftKey)return;
  event.preventDefault();rotation-=((event.deltaX||event.deltaY)>0?12:-12);
  render();lastInput=Date.now();
 },{passive:false});
 stage.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
   event.preventDefault();rotate(event.key==='ArrowRight'?1:-1);
  }
 });
 // The carousel is a dashboard entry point; all actual app routes are unchanged.
 function syncRoute(){
  const route=decodeURIComponent(location.hash||'#/').split('?')[0].replace(/^#\/?/,'');
  const onDashboard=(route===''||route==='dashboard');
  showcase.hidden=!onDashboard;
  document.body.classList.toggle('is-dashboard',onDashboard);
  if(onDashboard)render();
 }
 window.addEventListener('hashchange',syncRoute);
 if(!reduced){
  window.setInterval(()=>{
   if(showcase.hidden||dragging||document.hidden||Date.now()-lastInput<6500)return;
   rotation-=.18;
   render();
  },400);
 }
 syncRoute();render();
})();
