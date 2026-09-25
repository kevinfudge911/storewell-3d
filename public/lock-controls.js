/* Shared presentation only. Status writes stay in command-tablet.js. */
(()=>{
  const statuses=Object.freeze({green:['Rented','#64ef9d'],red:['Late','#ff7994'],flashred:['Lock It','#ff526f'],flashgreen:['Lock Off','#43f68a'],blue:['Reserved','#6bbdff'],yellow:['Rented · No Lock','#ffdc77'],purple:['Ready to Rent','#c6a3ff'],white:['Empty','#edf8ff'],black:['Not rentable','#a8b7c6']});
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // One shared symbol set keeps large boards light on phone memory.
  const defs=document.createElementNS('http://www.w3.org/2000/svg','svg');
  defs.setAttribute('width','0');defs.setAttribute('height','0');defs.setAttribute('aria-hidden','true');defs.style.position='absolute';
  defs.innerHTML=`<defs><g id="sw-round-disc"><circle class="disc-halo" cx="60" cy="60" r="56"/><circle class="disc-body" cx="60" cy="60" r="49"/><path class="disc-highlight" d="M18 49A44 44 0 0 1 97 34"/><path class="disc-key" d="M60 86v7m-2-8a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"/><path class="disc-ticks" d="M60 1v4m0 110v4M1 60h4m110 0h4"/></g><path id="sw-disc-open" class="disc-shackle" d="M44 34v-7c0-19 32-19 32-4"/><path id="sw-disc-closed" class="disc-shackle" d="M44 35v-8c0-19 32-19 32 0v8"/></defs>`;
  document.body.append(defs);
  function disc(label,state){
    if(!document.getElementById('sw-round-disc'))document.body.append(defs);
    const open=['flashgreen','yellow','white'].includes(state);
    return `<span class="lock-disc"><svg viewBox="0 0 120 120" aria-hidden="true"><use href="#sw-round-disc"/><use href="#sw-disc-${open?'open':'closed'}"/></svg><strong>${escape(label)}</strong></span>`;
  }
  window.StoreWellLockUI=Object.freeze({statuses,disc});
})();
