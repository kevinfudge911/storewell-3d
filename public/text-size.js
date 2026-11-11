/* Automatic presentation only. No text-size controls or saved-size overrides.
   Wide low-density touch pages retain readable text without asking staff to tune it. */
(()=>{
  function apply(){
    const tablet=document.getElementById('sw-tablet');if(!tablet)return;
    const wideTouch=navigator.maxTouchPoints>0&&(window.devicePixelRatio||1)<1.6&&window.innerWidth>=700;
    const scale=wideTouch?(window.innerHeight>window.innerWidth?2:1.5):1;
    tablet.style.setProperty('--ui',String(scale));
    tablet.dataset.compact=String(window.innerWidth/scale<700);
  }
  window.addEventListener('resize',apply);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();
