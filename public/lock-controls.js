/* Shared lock presentation. Persistence stays with the caller. */
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
  function choices(root){
    let active=null;
    function reflow(){
      if(!active)return;
      const {anchor,menu}=active,grid=anchor?.closest('.lock-tile-grid');
      if(!grid)return;
      const tiles=[...grid.querySelectorAll(':scope > .lock-tile')],index=tiles.indexOf(anchor);
      const columns=getComputedStyle(grid).gridTemplateColumns.split(/\s+/).length;
      const last=tiles[Math.min(tiles.length-1,Math.floor(index/columns)*columns+columns-1)];
      if(last&&last.nextElementSibling!==menu){
        const focused=menu.contains(document.activeElement)?document.activeElement:null;
        last.after(menu);focused?.focus({preventScroll:true});
      }
    }
    window.addEventListener('resize',()=>requestAnimationFrame(reflow));
    function close(restoreFocus=true){
      if(!active)return;
      const {menu,anchor}=active;active=null;menu.remove();
      anchor?.setAttribute('aria-expanded','false');anchor?.removeAttribute('aria-controls');
      if(restoreFocus&&anchor?.isConnected)anchor.focus({preventScroll:true});
    }
    function open({unit,anchor,onChange,onSaved,actions=[]}){
      if(active?.busy)return;
      if(active?.unit.id===unit.id){close();return;}
      close(false);
      const menu=document.createElement('section');menu.className='lock-status-menu';menu.id='sw-lock-status-choices';
      menu.setAttribute('role','group');menu.setAttribute('aria-label',`Unit ${unit.label} status choices`);
      menu.innerHTML=`<header><strong tabindex="-1">${escape(unit.label)} <span>· Change status</span></strong><button type="button" data-choice-close aria-label="Close status choices">×</button></header><div class="lock-status-choices">${Object.entries(statuses).map(([key,[label,color]])=>`<button type="button" data-status="${key}" aria-pressed="${key===unit.status}" style="--status:${color}"><i aria-hidden="true"></i><span class="status-choice-label">${escape(label)}</span><b aria-hidden="true">${key===unit.status?'✓':''}</b></button>`).join('')}</div>${actions.length?`<div class="lock-choice-links">${actions.map((a,i)=>`<button type="button" data-choice-action="${i}" data-action="${escape(a.id)}">${escape(a.label)}</button>`).join('')}</div>`:''}<p class="save-result" role="status" aria-live="polite"></p>`;
      const grid=anchor?.closest('.lock-tile-grid'),card=anchor?.closest('.unit-card');
      const map=anchor?.closest('.property-map-scroll,.preview-map');
      const route=anchor?.closest('.current-stop,.preview-route-header');
      if(grid){
        // Expand after the tapped row, so its locks remain together.
        const rowTop=anchor.getBoundingClientRect().top;
        let rowEnd=anchor;
        for(let next=anchor.nextElementSibling;next&&Math.abs(next.getBoundingClientRect().top-rowTop)<3;next=next.nextElementSibling)rowEnd=next;
        rowEnd.after(menu);
      }else if(card)card.after(menu);
      else if(map)map.before(menu);
      else if(route)route.after(menu);
      else if(root.firstElementChild)root.firstElementChild.after(menu);
      else root.append(menu);
      const state={menu,anchor,unit,busy:false};active=state;
      anchor?.setAttribute('aria-expanded','true');anchor?.setAttribute('aria-controls',menu.id);
      menu.querySelector('header strong').focus({preventScroll:true});
      menu.scrollIntoView?.({block:'nearest'});
      menu.addEventListener('click',async e=>{
        e.stopPropagation();const b=e.target.closest('button');if(!b||b.disabled||state.busy)return;
        if(b.hasAttribute('data-choice-close')){close();return;}
        if(b.dataset.choiceAction!==undefined){close(false);actions[Number(b.dataset.choiceAction)].run();return;}
        const next=b.dataset.status;if(!next)return;
        if(next===unit.status){close();return;}
        state.busy=true;menu.setAttribute('aria-busy','true');
        const buttons=[...menu.querySelectorAll('button')],feedback=menu.querySelector('.save-result');
        buttons.forEach(b=>b.disabled=true);feedback.textContent='Saving…';
        try{
          const saved=await onChange(next);
          if(saved===false)throw new Error('The change did not save. The previous status is still in place.');
          if(active===state){close(false);onSaved?.(next);}
        }catch(error){
          if(active===state){feedback.textContent=error.message||'Could not save. Please try again.';state.busy=false;menu.removeAttribute('aria-busy');buttons.forEach(b=>b.disabled=false);}
        }
      });
    }
    return Object.freeze({open,close,reflow,get isOpen(){return !!active;}});
  }
  // Keep one-finger scrolling native. Own only two-finger resize gestures.
  function pinchZoom(element,{get,set,selector,onStart=()=>{},onEnd=()=>{}}){
    let pinch=null,ignoreUntil=0;
    const accepts=e=>!selector||e.target.closest(selector);
    const distance=e=>Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
    function start(e){
      if(e.touches.length!==2||!accepts(e))return;
      const d=distance(e);if(d<8)return;
      e.preventDefault();pinch={distance:d,zoom:get()};ignoreUntil=Infinity;onStart();
    }
    function move(e){
      if(!pinch)return;
      e.preventDefault();
      if(e.touches.length===2)set(pinch.zoom*distance(e)/pinch.distance);
    }
    function end(e){
      if(!pinch)return;
      if(e.touches?.length){e.preventDefault();return;}
      pinch=null;ignoreUntil=Date.now()+400;onEnd();
    }
    function click(e){if(e.detail!==0&&Date.now()<ignoreUntil&&accepts(e)){e.preventDefault();e.stopImmediatePropagation();}}
    function wheel(e){if(!e.ctrlKey||!accepts(e))return;e.preventDefault();onStart();set(get()*Math.exp(-e.deltaY*.008));onEnd();}
    element.addEventListener('touchstart',start,{passive:false});
    element.addEventListener('touchmove',move,{passive:false});
    element.addEventListener('touchend',end,{passive:false});
    element.addEventListener('touchcancel',()=>end({touches:[]}));
    element.addEventListener('click',click,true);
    element.addEventListener('wheel',wheel,{passive:false});
    return Object.freeze({get active(){return !!pinch;}});
  }
  const zoomButtons=()=>'<div class="lock-zoom-controls" role="group" aria-label="Lock size"><span>Pinch to resize</span><button type="button" data-lock-zoom="out" aria-label="Make locks smaller">−</button><button type="button" data-lock-zoom="reset" aria-label="Reset lock size">100%</button><button type="button" data-lock-zoom="in" aria-label="Make locks larger">+</button></div>';
  function zoomBoard(root,{reflow=()=>{}}={}){
    let zoom=1;
    function refresh(){
      root.querySelectorAll('[data-lock-zoom=reset]').forEach(b=>b.textContent=Math.round(zoom*100)+'%');
      root.querySelectorAll('[data-lock-zoom=out]').forEach(b=>b.disabled=zoom<=.65);
      root.querySelectorAll('[data-lock-zoom=in]').forEach(b=>b.disabled=zoom>=2);
    }
    function set(value){
      zoom=Math.max(.65,Math.min(2,value));
      root.style.setProperty('--lock-zoom',zoom);
      root.dataset.lockScale=String(Math.round(zoom*100));
      refresh();reflow();
    }
    const gesture=pinchZoom(root,{get:()=>zoom,set,selector:'.lock-board'});
    root.addEventListener('click',e=>{
      const b=e.target.closest('[data-lock-zoom]');if(!b||b.disabled)return;
      e.stopPropagation();set(b.dataset.lockZoom==='reset'?1:zoom*(b.dataset.lockZoom==='in'?1.2:1/1.2));
    });
    return Object.freeze({refresh,get active(){return gesture.active;}});
  }
  window.StoreWellLockUI=Object.freeze({statuses,disc,choices,pinchZoom,zoomButtons,zoomBoard});
})();
