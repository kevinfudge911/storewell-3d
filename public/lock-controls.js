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
    return Object.freeze({open,close,get isOpen(){return !!active;}});
  }
  window.StoreWellLockUI=Object.freeze({statuses,disc,choices});
})();
