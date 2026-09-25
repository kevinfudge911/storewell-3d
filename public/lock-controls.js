/* Shared lock presentation. Persistence stays with the caller. */
(()=>{
  const statuses=Object.freeze({green:['Rented','#64ef9d'],red:['Late','#ff7994'],flashred:['Lock It','#ff526f'],flashgreen:['Lock Off','#43f68a'],blue:['Reserved','#6bbdff'],yellow:['Rented · No Lock','#ffdc77'],purple:['Ready to Rent','#c6a3ff'],white:['Empty','#edf8ff'],black:['Not rentable','#a8b7c6']});
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // One shared symbol set keeps large boards light on phone memory.
  const defs=document.createElementNS('http://www.w3.org/2000/svg','svg');
  defs.setAttribute('width','0');defs.setAttribute('height','0');defs.setAttribute('aria-hidden','true');defs.style.position='absolute';
  defs.innerHTML=`<defs><g id="sw-round-disc"><circle class="disc-halo" cx="60" cy="60" r="56"/><circle class="disc-body" cx="60" cy="60" r="49"/><path class="disc-highlight" d="M18 49A44 44 0 0 1 97 34"/><path class="disc-key" d="M60 86v7m-2-8a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"/><path class="disc-ticks" d="M60 1v4m0 110v4M1 60h4m110 0h4"/></g><path id="sw-disc-open" class="disc-shackle" d="M44 34v-7c0-19 32-19 32-4"/><path id="sw-disc-closed" class="disc-shackle" d="M44 35v-8c0-19 32-19 32 0v8"/></defs>`;
  document.body.append(defs);
  const color=state=>statuses[state]?.[1]||'#a8b7c6';
  const stateName=state=>statuses[state]?.[0]||state||'Not recorded';
  const shackle=state=>['flashgreen','yellow','white'].includes(state)?'open':'closed';
  function disc(label,state){
    if(!document.getElementById('sw-round-disc'))document.body.append(defs);
    return `<span class="lock-disc" data-lock-status="${escape(state)}" style="--status:${color(state)}" aria-hidden="true"><svg viewBox="0 0 120 120"><use href="#sw-round-disc"/><use href="#sw-disc-${shackle(state)}"/></svg><strong>${escape(label)}</strong></span>`;
  }
  const mapGlyph=(label,state)=>`<circle class="map-lock-hit" cx="60" cy="60" r="60"/><g class="map-lock-art"><use href="#sw-round-disc"/><use href="#sw-disc-${shackle(state)}"/></g><text class="map-lock-label" x="60" y="69" text-anchor="middle" style="font-size:${Math.min(33,92/(String(label).length*.6))}px">${escape(label)}</text>`;
  function mapDisc(label,state,{x,y,diameter}){
    return `<g class="lock-map-disc" data-lock-status="${escape(state)}" style="--status:${color(state)}" transform="translate(${x-diameter/2} ${y-diameter/2}) scale(${diameter/120})">${mapGlyph(label,state)}</g>`;
  }
  function paintMapPin(pin,label,state){
    pin.dataset.lockStatus=state;pin.style.setProperty('--status',color(state));
    pin.setAttribute('aria-label',`Unit ${label} · ${stateName(state)}`);
    const glyph=pin.querySelector('.lock-map-disc');if(!glyph)return;
    glyph.dataset.lockStatus=state;glyph.style.setProperty('--status',color(state));glyph.innerHTML=mapGlyph(label,state);
  }
  const legend=()=>`<div class="lock-color-key" role="group" aria-label="Lock color key">${Object.entries(statuses).map(([key,[label]])=>`<span>${disc('',key)}<span>${escape(label)}</span></span>`).join('')}</div>`;
  const statusButtons=(selected,attr='data-status')=>Object.entries(statuses).map(([key,[label]])=>`<button type="button" ${attr}="${key}" aria-label="${escape(label)}" aria-pressed="${key===selected}" style="--status:${color(key)}">${disc(label,key)}<b class="choice-check" aria-hidden="true">${key===selected?'✓':''}</b></button>`).join('');
  const filterLabel=state=>statuses[state]?`${disc('',state)}<span>${escape(stateName(state))}</span>`:`<span>${state==='action'?'Action required':'All statuses'}</span>`;
  const statusFilter=(state,id)=>`<div class="filter-field"><button type="button" id="${escape(id)}" data-status-filter aria-label="Filter locks by status" aria-expanded="false">${filterLabel(state)}<span aria-hidden="true">⌄</span></button></div>`;
  function bindStatusFilter(root,{id,get,set}){
    const trigger=root.querySelector('#'+id);let menu;
    function close(focus=false){menu?.remove();menu=null;trigger.setAttribute('aria-expanded','false');trigger.removeAttribute('aria-controls');if(focus)trigger.focus({preventScroll:true});}
    trigger.addEventListener('click',e=>{
      e.stopPropagation();if(menu){close(true);return;}
      menu=document.createElement('section');menu.className='lock-filter-menu';menu.id=id+'-choices';menu.setAttribute('role','group');menu.setAttribute('aria-label','Filter locks');
      menu.innerHTML=`<header><strong>Filter locks</strong><button type="button" data-filter-close aria-label="Close status filter">×</button></header><div class="filter-modes">${[['all','All statuses'],['action','Action required']].map(([key,label])=>`<button type="button" data-filter-status="${key}" aria-pressed="${get()===key}">${label}</button>`).join('')}</div><div class="lock-status-choices">${statusButtons(get(),'data-filter-status')}</div>`;
      trigger.closest('.lock-toolbar').after(menu);trigger.setAttribute('aria-expanded','true');trigger.setAttribute('aria-controls',menu.id);
      menu.querySelector('[aria-pressed=true]')?.focus({preventScroll:true});
      menu.addEventListener('click',event=>{event.stopPropagation();const b=event.target.closest('button');if(!b)return;if(b.hasAttribute('data-filter-close')){close(true);return;}if(b.dataset.filterStatus){const value=b.dataset.filterStatus;close(true);trigger.innerHTML=filterLabel(value)+'<span aria-hidden="true">⌄</span>';set(value);}});
      menu.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close(true);}});
    });
  }
  function transition(label,from,to){
    const before=statuses[from]?disc(label,from):`<span class="unrecorded-lock">${escape(stateName(from))}</span>`;
    const after=statuses[to]?disc(label,to):`<span class="unrecorded-lock">${escape(stateName(to))}</span>`;
    return `<div class="lock-transition" role="img" aria-label="Unit ${escape(label)}: ${escape(stateName(from))} to ${escape(stateName(to))}">${before}<span class="lock-transition-arrow" aria-hidden="true">→</span>${after}</div>`;
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
    function reveal(){
      const menu=active?.menu;if(!menu)return;
      // In a short landscape viewport, bring the actual status buttons above the footer.
      const target=root.clientHeight&&menu.offsetHeight>root.clientHeight?menu.querySelector('.lock-status-choices'):menu;
      target?.scrollIntoView?.({block:'nearest'});
    }
    window.addEventListener('resize',()=>requestAnimationFrame(()=>{reflow();reveal();}));
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
      menu.innerHTML=`<header><strong tabindex="-1">${escape(unit.label)} <span>· Change status</span></strong><button type="button" data-choice-close aria-label="Close status choices">×</button></header><div class="lock-status-choices">${statusButtons(unit.status)}</div>${actions.length?`<div class="lock-choice-links">${actions.map((a,i)=>`<button type="button" data-choice-action="${i}" data-action="${escape(a.id)}">${escape(a.label)}</button>`).join('')}</div>`:''}<p class="save-result" role="status" aria-live="polite"></p>`;
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
      reveal();
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
  window.StoreWellLockUI=Object.freeze({statuses,disc,mapDisc,paintMapPin,legend,statusFilter,bindStatusFilter,transition,choices,pinchZoom,zoomButtons,zoomBoard});
})();
