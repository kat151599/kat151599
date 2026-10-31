'use strict';
/* CFO02 interactive source wheel. Four REAL source choices, no API calls.
 * The existing ContentFlow editor owns the create/edit/queue/publish operations.
 * Tooplate Orbital 2167 is the design inspiration, not a runtime dependency.
 */
(()=>{
 const stage=document.getElementById('orbitStage'),showcase=document.getElementById('orbitalShowcase');
 const ring=document.getElementById('orbitRing'),counter=document.getElementById('orbitCounter');
 const glass=document.getElementById('orbitGlass');
 if(!stage||!showcase||!ring||!counter||!glass)return;
 const panels=[...ring.querySelectorAll('[data-orbit]')],size=panels.length;
 if(size!==4)return;
 let selected=0,dragStartX=null,dragStartY=null,dragMoved=false,draggedAnchor=null,suppressDraggedAnchor=null;
 const normalized=i=>(i%size+size)%size;
 function draw(){
  const spread=Math.max(138,Math.min(stage.clientWidth*.265,280));
  const isMobile=window.matchMedia('(max-width: 620px)').matches;
  const offset=isMobile?Math.min(spread,125):spread;
  const origin=isMobile?'50%':'58%';
  ring.style.setProperty('--orbit-origin',origin);
  stage.style.setProperty('--orbit-origin',origin);
  panels.forEach((panel,index)=>{
   const diff=normalized(index-selected),front=diff===0,right=diff===1,left=diff===size-1,back=diff===2;
   const x=front?0:right?offset:left?-offset:0;
   const y=front?0:back?58:24;
   const scale=front?1:back?.58:.79;
   panel.style.setProperty('--orbit-x',x+'px');
   panel.style.setProperty('--orbit-y',y+'px');
   panel.style.setProperty('--orbit-scale',String(scale));
   panel.style.setProperty('--orbit-tilt',(right?-13:left?13:0)+'deg');
   panel.style.setProperty('--orbit-alpha',String(front?1:back?.27:.86));
   panel.style.zIndex=String(front?5:back?1:3);
   panel.dataset.front=String(front);
   panel.setAttribute('aria-label',panel.querySelector('strong').textContent+(front?' — обране джерело':' — перейти до створення'));
   // Backmost source remains reachable with next/previous, but not accidentally clicked through another card.
   panel.style.pointerEvents=back?'none':'auto';
   if(back)panel.setAttribute('aria-hidden','true');else panel.removeAttribute('aria-hidden');
   panel.tabIndex=back?-1:0;
  });
  counter.textContent=String(selected+1).padStart(2,'0')+' / '+String(size).padStart(2,'0');
  stage.dataset.activeSource=panels[selected].dataset.source;
 }
 function shift(step){selected=normalized(selected+step);draw()}
 document.getElementById('orbitPrev').addEventListener('click',()=>shift(-1));
 document.getElementById('orbitNext').addEventListener('click',()=>shift(1));
 showcase.classList.add('is-glass');
 glass.addEventListener('click',()=>{
  const on=showcase.classList.toggle('is-glass');
  glass.setAttribute('aria-pressed',String(on));
  glass.textContent=on?'GLASS: ON':'GLASS: OFF';
 });
 function resetDrag(){dragStartX=null;dragStartY=null;dragMoved=false;draggedAnchor=null}
 stage.addEventListener('pointerdown',event=>{
  if(event.button!==0)return;
  dragStartX=event.clientX;dragStartY=event.clientY;dragMoved=false;draggedAnchor=event.target.closest('.orbit-panel');
 });
 window.addEventListener('pointermove',event=>{
  if(dragStartX===null)return;
  if(Math.abs(event.clientX-dragStartX)>12 && Math.abs(event.clientX-dragStartX)>Math.abs(event.clientY-dragStartY))dragMoved=true;
 });
 window.addEventListener('pointerup',event=>{
  if(dragStartX===null)return;
  const delta=event.clientX-dragStartX,wasDrag=dragMoved&&Math.abs(delta)>35;
  const anchorFromDrag=draggedAnchor;
  resetDrag();
  if(wasDrag){
   shift(delta<0?1:-1);
   // Ignore at most the synthetic click caused by dragging THIS exact link.
   // A subsequent deliberate click on any source must never be time-blocked.
   if(anchorFromDrag){
    suppressDraggedAnchor=anchorFromDrag;
    window.setTimeout(()=>{if(suppressDraggedAnchor===anchorFromDrag)suppressDraggedAnchor=null},0);
   }
  }
 });
 window.addEventListener('pointercancel',resetDrag);
 stage.addEventListener('click',event=>{
  const anchor=event.target.closest('.orbit-panel');
  if(anchor && suppressDraggedAnchor===anchor){
   suppressDraggedAnchor=null;
   event.preventDefault();event.stopImmediatePropagation();
  }
 },true);
 stage.addEventListener('wheel',event=>{
  if(Math.abs(event.deltaX)<10&&!event.shiftKey)return;
  event.preventDefault();shift((event.deltaX||event.deltaY)>0?1:-1);
 },{passive:false});
 stage.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
   event.preventDefault();shift(event.key==='ArrowRight'?1:-1)
  }
 });
 function syncRoute(){
  const route=decodeURIComponent(location.hash||'#/').split('?')[0].replace(/^#\/?/,'');
  const dashboard=route===''||route==='dashboard';
  showcase.hidden=!dashboard;
  document.body.classList.toggle('is-dashboard',dashboard);
  if(dashboard)draw();
 }
 window.addEventListener('hashchange',syncRoute);
 window.addEventListener('resize',draw);
 syncRoute();
 draw();
})();
