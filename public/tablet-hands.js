/* Decorative first-person hands. This module never activates controls or writes unit data. */
(()=>{
  'use strict';
  let instance=0;
  const interactive='button,a[href],summary,[role="button"],input[type="checkbox"],input[type="radio"],input[type="range"]';
  const armour={soldier:null,robot:'#e9a44e',xbot:'#e88878',cesium:'#dce6ed',police:'#53657d',limo:'#555964',fire:'#c3a476'};
  const hex=value=>typeof value==='string'&&/^#[\da-f]{6}$/i.test(value)?value:null;
  window.StoreWellTabletHands={mount(root,options={}){
    const preference=options.preferenceKey||'sw_tablet_hands';
    const device=root.querySelector('.tablet-device');
    if(!device)return null;
    const colourId='sw-hand-colour-'+(++instance),layer=document.createElement('div');
    layer.className='tablet-hands';layer.hidden=true;layer.inert=true;layer.setAttribute('aria-hidden','true');
    layer.innerHTML=`<svg class="tablet-hand-defs" width="0" height="0" aria-hidden="true"><defs><filter id="${colourId}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"/></filter></defs></svg><div class="tablet-hand-grip"><img src="/img/hands/soldier-grip.webp" alt="" draggable="false" decoding="async" width="1254" height="1254"></div><div class="tablet-hand-tap"><img src="/img/hands/soldier-tap.webp" alt="" draggable="false" decoding="async" width="1254" height="1254"></div><i class="tablet-touch-ring"></i>`;
    root.append(layer);
    const grip=layer.querySelector('.tablet-hand-grip'),tap=layer.querySelector('.tablet-hand-tap'),ring=layer.querySelector('.tablet-touch-ring'),matrix=layer.querySelector('feColorMatrix');
    layer.style.setProperty('--hand-colour',`url(#${colourId})`);
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    let enabled=true,opened=false,motion=[],timer=0,resizeFrame=0,lastPalette='',pointer=null,gestureUntil=0,activePointers=new Set();
    try{enabled=localStorage.getItem(preference)!=='off';}catch{}
    function stop(){clearTimeout(timer);motion.forEach(a=>a.cancel());motion=[];tap.style.opacity='0';ring.style.opacity='0';layer.classList.remove('is-touching');}
    function appearance(){
      let char={};try{char=window._swGetChar?.()||{};}catch{}
      const model=char.model||'soldier';
      const tint=(char.rpm||model==='none')?hex(char.shirt)||hex(window._swSets?.[char.uniform]?.shirt):hex(armour[model]);
      layer.dataset.character=char.rpm?'custom':model;
      const key=tint||'soldier';if(key===lastPalette)return;lastPalette=key;
      if(!tint){matrix.setAttribute('values','1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0');return;}
      // The tan plates take the selected uniform's palette; black fabric and shading remain.
      const rgb=[1,3,5].map(start=>Math.max(.28,parseInt(tint.slice(start,start+2),16)/255)/.66);
      matrix.setAttribute('values',rgb.flatMap(c=>[.2126*c,.7152*c,.0722*c,0,0]).concat([0,0,0,1,0]).join(' '));
    }
    function layout(){
      if(!opened||!enabled)return;
      const r=root.getBoundingClientRect(),d=device.getBoundingClientRect();
      const size=Math.max(142,Math.min(260,r.width*.21,r.height*.34));
      // Only the thumb crosses the bezel; the glove stays outside the reading area.
      const x=d.left-r.left+10,y=d.bottom-r.top-Math.max(130,d.height*.29);
      grip.style.width=size+'px';grip.style.left=(x-size*.835)+'px';grip.style.top=(y-size*.18)+'px';
      tap.style.width=Math.max(152,Math.min(280,r.width*.29,r.height*.42))+'px';
    }
    function scheduleLayout(){cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{stop();layout();});}
    function sync(){root.classList.toggle('tablet-hands-on',enabled);layer.hidden=!opened||!enabled;appearance();layout();}
    function targetOf(event){
      const target=event.target?.closest?.(interactive);
      return target&&root.contains(target)&&!target.matches(':disabled,[aria-disabled="true"]')&&!target.closest('[inert],.tablet-hands')?target:null;
    }
    function point(event,target){
      const r=root.getBoundingClientRect(),b=target.getBoundingClientRect();
      const coordinates=event.detail!==0&&Number.isFinite(event.clientX)&&Number.isFinite(event.clientY);
      return {x:(coordinates?event.clientX:b.left+b.width/2)-r.left,y:(coordinates?event.clientY:b.top+b.height/2)-r.top};
    }
    function pose(p){
      const width=parseFloat(tap.style.width)||180;
      // Contact point measured on the supplied sprite, independent of button dimensions.
      tap.style.left=(p.x-width*.155)+'px';tap.style.top=(p.y-width*.104)+'px';
      ring.style.left=p.x+'px';ring.style.top=p.y+'px';
    }
    function animate(el,frames,options){
      if(typeof el.animate!=='function')return false;
      const animation=el.animate(frames,options);motion.push(animation);return true;
    }
    function touch(event,target){
      if(!opened||!enabled||root.hidden||Date.now()<gestureUntil)return;
      stop();appearance();pose(point(event,target));layer.classList.add('is-touching');
      const quiet=reduced.matches;
      ring.style.opacity='1';
      if(!quiet)animate(ring,[{opacity:0,transform:'translate(-50%,-50%) scale(.45)'},{opacity:.95,transform:'translate(-50%,-50%) scale(1)',offset:.32},{opacity:0,transform:'translate(-50%,-50%) scale(1.6)'}],{duration:430,easing:'ease-out',fill:'forwards'});
      if(!quiet){
        tap.style.opacity='1';
        animate(tap,[
          {opacity:0,transform:'translate(36px,64px) rotate(8deg) scale(1.03)'},
          {opacity:1,transform:'translate(0,0) rotate(0) scale(1)',offset:.25},
          {opacity:1,transform:'translate(0,2px) rotate(-1deg) scale(.97)',offset:.4},
          {opacity:.9,transform:'translate(12px,22px) rotate(3deg) scale(1)',offset:.58},
          {opacity:0,transform:'translate(56px,95px) rotate(9deg) scale(1.02)'}
        ],{duration:540,easing:'cubic-bezier(.2,.7,.25,1)',fill:'forwards'});
      }
      timer=setTimeout(stop,quiet?130:550);
    }
    function pointerDown(e){
      if(!opened||!enabled||e.button>0)return;
      activePointers.add(e.pointerId);
      if(activePointers.size>1){pointer=null;gestureUntil=Date.now()+500;stop();return;}
      const target=targetOf(e);pointer={id:e.pointerId,x:e.clientX,y:e.clientY,target,moved:false};
    }
    function pointerMove(e){
      if(!pointer||pointer.id!==e.pointerId)return;
      if(Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>10){pointer.moved=true;gestureUntil=Date.now()+400;stop();}
    }
    function pointerEnd(e){
      activePointers.delete(e.pointerId);
      if(e.type==='pointercancel'||pointer?.moved||activePointers.size){gestureUntil=Date.now()+400;stop();}
      if(pointer?.id===e.pointerId)pointer=null;
    }
    function click(e){const target=targetOf(e);if(target)touch(e,target);}
    function changed(){appearance();}
    function storage(e){if(e.key==='sw_char')appearance();if(e.key===preference){enabled=e.newValue!=='off';stop();sync();}}
    // Capture observes existing actions, including tools that stop propagation. Never prevent or replay events.
    root.addEventListener('click',click,true);
    root.addEventListener('pointerdown',pointerDown,{capture:true,passive:true});
    root.addEventListener('pointermove',pointerMove,{capture:true,passive:true});
    window.addEventListener('pointerup',pointerEnd,{capture:true,passive:true});
    window.addEventListener('pointercancel',pointerEnd,{capture:true,passive:true});
    root.addEventListener('scroll',stop,{capture:true,passive:true});
    window.addEventListener('resize',scheduleLayout);
    device.addEventListener('animationend',scheduleLayout);
    window.addEventListener('sw-character-changed',changed);
    window.addEventListener('storage',storage);
    reduced.addEventListener?.('change',stop);
    const observer=typeof ResizeObserver==='function'?new ResizeObserver(scheduleLayout):null;observer?.observe(device);
    for(const img of layer.querySelectorAll('img'))img.addEventListener('error',()=>{img.parentElement.hidden=true;});
    return {
      get enabled(){return enabled;},
      open(){opened=true;sync();},
      close(){opened=false;pointer=null;activePointers.clear();gestureUntil=0;stop();sync();},
      toggle(){enabled=!enabled;try{localStorage.setItem(preference,enabled?'on':'off');}catch{}stop();sync();return enabled;},
      destroy(){this.close();observer?.disconnect();cancelAnimationFrame(resizeFrame);root.removeEventListener('click',click,true);root.removeEventListener('pointerdown',pointerDown,true);root.removeEventListener('pointermove',pointerMove,true);window.removeEventListener('pointerup',pointerEnd,true);window.removeEventListener('pointercancel',pointerEnd,true);root.removeEventListener('scroll',stop,true);window.removeEventListener('resize',scheduleLayout);device.removeEventListener('animationend',scheduleLayout);window.removeEventListener('sw-character-changed',changed);window.removeEventListener('storage',storage);reduced.removeEventListener?.('change',stop);layer.remove();root.classList.remove('tablet-hands-on');}
    };
  }};
})();
