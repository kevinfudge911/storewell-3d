/* Print size for the command tablet. Kevin, November 10, 2026: the words must be
   as easy to read as the lock numbers. One saved setting per device; A- / A+ in
   the tablet change it. Presentation only: no inventory, history or sign-in. */
(()=>{
  const KEY='sw_text_size',STEPS=[1,1.15,1.3,1.5,1.75,2,2.3,2.6];
  function automatic(){
    const touch=navigator.maxTouchPoints>0,dpr=window.devicePixelRatio||1,w=window.innerWidth,h=window.innerHeight;
    // A touch screen reporting wide, low-density pixels is a phone drawing a
    // desktop-width page, so ordinary print is physically tiny.
    if(touch&&dpr<1.6&&w>=700)return h>w?2:1.5;
    return h>w?1.15:1;
  }
  function saved(){try{const v=Number(localStorage.getItem(KEY));return STEPS.includes(v)?v:null;}catch{return null;}}
  let size=saved()??automatic();
  function apply(){
    const tablet=document.getElementById('sw-tablet');if(!tablet)return;
    tablet.style.setProperty('--ui',String(size));
    const glass=tablet.querySelector('.tablet-glass'),width=(glass?.clientWidth||tablet.clientWidth||window.innerWidth)/size;
    tablet.dataset.print=width<640?'big':'wide';
    const strip=tablet.querySelector('.tablet-strip');
    if(strip&&!strip.querySelector('.print-size')){
      const box=document.createElement('span');box.className='print-size';box.setAttribute('role','group');box.setAttribute('aria-label','Print size');
      box.innerHTML='<button type="button" data-print-size="-1" aria-label="Smaller print">A−</button><button type="button" data-print-size="1" aria-label="Bigger print">A+</button>';
      box.addEventListener('click',e=>{
        const b=e.target.closest('[data-print-size]');if(!b)return;e.stopPropagation();
        const at=STEPS.reduce((best,v,i)=>Math.abs(v-size)<Math.abs(STEPS[best]-size)?i:best,0);
        size=STEPS[Math.max(0,Math.min(STEPS.length-1,at+Number(b.dataset.printSize)))];
        try{localStorage.setItem(KEY,String(size));}catch{}
        apply();
      });
      strip.append(box);
    }
  }
  let queued=false;const later=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});};
  new MutationObserver(later).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('resize',later);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();
