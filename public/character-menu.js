/* StoreWell character choices stay in the ship's menu and work without an external builder. */
(() => {
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const models=[['soldier','Soldier','🪖'],['xbot','Agent','🕵️'],['cesium','Worker','👷'],['robot','Robot','🤖'],['limo','Limo Driver','🎩'],['police','Police','👮'],['fire','Firefighter','🚒'],['none','Custom outfit','👔']];
  window._swShowWardrobe=function(){
    document.getElementById('sw-wardrobe')?.remove();document.getElementById('sw-rpm')?.remove();
    const original=window._swGetChar()||{model:'soldier'},draft={...original},previousFocus=document.activeElement;
    const menu=document.createElement('section');menu.id='sw-wardrobe';menu.className='character-menu';
    menu.setAttribute('role','dialog');menu.setAttribute('aria-modal','true');menu.setAttribute('aria-label','My character');
    menu.innerHTML='<div><header><h2>My character</h2><button type="button" data-character-close aria-label="Close character menu">× Close</button></header><div class="character-body"><label for="sw-character-name">Name on your badge</label><input id="sw-character-name" maxlength="40" placeholder="Your name" value="'+esc(draft.nick||'')+'"><p>Choose your character. Changes are applied when you save.</p><div class="character-choices">'+models.map(([key,label,symbol])=>'<button type="button" data-character-model="'+key+'"><span aria-hidden="true">'+symbol+'</span><span>'+label+'</span></button>').join('')+(original.rpm?'<button type="button" data-character-model="saved">Saved custom character</button>':'')+'</div><div class="character-outfit" hidden><h3>Custom outfit</h3><p>Choose a uniform or your own colors for the outfit character.</p><div class="character-uniforms">'+(window._swSetList||[]).map(([key,label])=>'<button type="button" data-character-uniform="'+key+'">'+esc(label)+'</button>').join('')+'</div><div class="character-colors">'+[['skin','Skin','#FDDBB4'],['hair','Hair','#2c1810'],['shirt','Shirt','#3b82f6'],['pants','Pants','#1e3a8a'],['shoes','Shoes','#3b2a1a'],['hatColor','Hat','#ff6600']].map(([key,label,fallback])=>'<label>'+label+'<input type="color" data-character-color="'+key+'" aria-label="'+label+' color" value="'+esc(draft[key]||fallback)+'"></label>').join('')+'</div><label for="sw-character-hat">Headwear</label><select id="sw-character-hat">'+[['none','None'],['cap','Cap'],['hardhat','Hard hat'],['beanie','Beanie'],['cowboy','Cowboy']].map(([value,label])=>'<option value="'+value+'">'+label+'</option>').join('')+'</select></div><p class="character-selection" role="status"></p></div><footer><button type="button" data-character-cancel>Cancel</button><button type="button" data-character-save>Save character</button></footer></div>';
    function close(){menu.remove();previousFocus?.isConnected&&previousFocus.focus({preventScroll:true});}
    function renderSelection(){
      const selected=draft.rpm?'saved':draft.model||'soldier';
      menu.querySelectorAll('[data-character-model]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.characterModel===selected)));
      menu.querySelector('.character-outfit').hidden=selected!=='none';
      menu.querySelectorAll('[data-character-uniform]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.characterUniform===(draft.uniform||'none'))));
      menu.querySelectorAll('[data-character-color]').forEach(input=>{if(draft[input.dataset.characterColor])input.value=draft[input.dataset.characterColor];});
      menu.querySelector('#sw-character-hat').value=draft.hat||'none';
      const label=selected==='saved'?'Saved custom character':models.find(([key])=>key===selected)?.[1]||'Soldier';
      menu.querySelector('.character-selection').textContent='Selected: '+label;
    }
    menu.querySelector('#sw-character-name').oninput=e=>{draft.nick=e.target.value;};
    menu.querySelector('#sw-character-hat').onchange=e=>{draft.hat=e.target.value;draft.uniform='none';renderSelection();};
    menu.querySelectorAll('[data-character-color]').forEach(input=>input.oninput=()=>{draft[input.dataset.characterColor]=input.value;draft.uniform='none';renderSelection();});
    menu.onclick=e=>{
      if(e.target===menu||e.target.closest('[data-character-close],[data-character-cancel]')){close();return;}
      const model=e.target.closest('[data-character-model]');
      if(model){if(model.dataset.characterModel==='saved'){draft.rpm=original.rpm;draft.model=original.model;}else{draft.model=model.dataset.characterModel;delete draft.rpm;}renderSelection();}
      const uniform=e.target.closest('[data-character-uniform]');
      if(uniform){draft.uniform=uniform.dataset.characterUniform;Object.assign(draft,window._swSets?.[draft.uniform]||{});renderSelection();}
      if(e.target.closest('[data-character-save]')){
        if(window._swSaveChar(draft)===false){menu.querySelector('.character-selection').textContent='Your character could not be saved on this device. Please try again.';return;}
        window._swApplyLook?.();close();
      }
    };
    menu.onkeydown=e=>{
      if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}
      if(e.key==='Tab'){
        const controls=[...menu.querySelectorAll('button,input,select')].filter(el=>el.getClientRects().length&&!el.disabled),first=controls[0],last=controls.at(-1);
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    };
    document.body.append(menu);renderSelection();menu.querySelector('[data-character-close]').focus({preventScroll:true});
  };
  // Retain compatibility with any already-rendered older wardrobe control.
  window._swOpenRPM=window._swShowWardrobe;
})();
