/* Walkable command bridge. CSS3D keeps the same geometry available without a GPU. */
(() => {
  'use strict';
  window.__swCreateBridge = function ({deck, screen, units, status, escape, showUnit, showDialog, content, login, gear, alerts, report, exit}) {
    const T = window.THREE;
    if (!T?.CSS3DRenderer) throw new Error('3D room renderer unavailable');
    const scene = new T.Scene(); scene.scale.setScalar(100);
    const camera = new T.PerspectiveCamera(55, 1, .1, 160); camera.rotation.order = 'YXZ';
    const cssCamera = camera.clone(), renderer = new T.CSS3DRenderer();
    deck.querySelector('.room-ui').append(renderer.domElement);
    deck.classList.add('walkable-bridge');
    const faces = [], obstacles = [], keys = new Set();
    let view = 'room', active = false, raf = 0, lastTime = 0, drag, yaw = 0, pitch = .07, unsubscribe, authUnsubscribe, history = [], historyState = 'Connecting to saved lock history…', watched = false;
    const normal = new T.Vector3(), toCamera = new T.Vector3();
    const phone = () => innerWidth <= 700;
    const plane = (name,w,h,x,y,z,ry=0,rx=0,html='') => {
      const el = document.createElement('div'); el.className = 'bridge-surface '+name;
      el.style.width = w*50+'px'; el.style.height = h*50+'px'; el.innerHTML = html;
      const obj = new T.CSS3DObject(el); obj.scale.setScalar(.02); obj.position.set(x,y,z); obj.rotation.set(rx,ry,0,'YXZ');
      scene.add(obj); faces.push(obj); return obj;
    };
    const box = (name,x,y,z,w,h,d) => {
      plane(name,w,h,x,y,z+d/2);
      plane(name,w,h,x,y,z-d/2,Math.PI);
      plane(name,d,h,x-w/2,y,z,-Math.PI/2);
      plane(name,d,h,x+w/2,y,z,Math.PI/2);
      plane(name,w,d,x,y+h/2,z,0,-Math.PI/2);
    };
    plane('bridge-floor',44,48,0,0,0,0,-Math.PI/2);
    plane('bridge-ceiling',44,48,0,12,0,0,Math.PI/2);
    // Separate bulkheads, ceiling ribs, and windows create depth in every direction.
    for (const side of [-1,1]) {
      for (let z=-18;z<=18;z+=12) {
        plane('bridge-bulkhead',12,12,side*22,6,z,-side*Math.PI/2);
        box('bridge-rib',side*21.65,6,z-5.8,.65,12,.6);
      }
      plane('bridge-window window-'+(side<0?'port':'starboard'),8.8,9.8,side*16.8,6.5,-23.7);
    }
    plane('bridge-bulkhead',44,12,0,6,24,Math.PI);
    plane('bridge-bulkhead',44,12,0,6,-24);
    for (const z of [-20,-8,4,16]) box('bridge-overhead',0,11.6,z,43,.7,.6);
    plane('bridge-front-frame',23.8,11.25,0,6.35,-23.72);
    const board = new T.CSS3DObject(screen); board.scale.setScalar(.02); board.position.set(0,6.65,-23.5); scene.add(board); faces.push(board);
    const station = (cls,title,sub,w,h,x,y,z,ry,html) => plane('bridge-station '+cls,w,h,x,y,z,ry,0,
      `<header><span>${sub}</span><h2>${title}</h2></header>${html}`);
    const logWall = station('bridge-log-wall','LOCK ACTIVITY','PORT · OPERATIONS',14,7.8,-21.15,6,2,Math.PI/2,
      '<div class="bridge-log-state" role="status"></div><div class="bridge-log-rows"></div><footer><button data-station="history">Open full lock history</button><button data-station="refresh">Refresh history</button></footer>').element;
    const rosterWall = station('bridge-roster-wall','UNIT STATUS','STARBOARD · SECURITY',14,7.8,21.15,6,2,-Math.PI/2,
      '<div class="bridge-roster"></div><footer>Live unit status · Select a unit to inspect</footer>').element;
    station('bridge-comms','COMMUNICATIONS','AFT · CREW STATION',11,6,-10,5.3,23.7,Math.PI,
      '<div class="bridge-station-actions"><button data-station="alerts">Push notifications</button><button data-station="report">Save &amp; email report</button><button data-station="gear">Team &amp; ship systems</button></div>');
    station('bridge-exit','STORAGE PROPERTY','RETURN TO FACILITY',7,8,7,5,23.65,Math.PI,
      '<div class="bridge-airlock"><span>STOREWELL</span><button data-station="exit">Exit command center</button></div>');
    const instrument = '<div class="instrument-radar"></div><div class="instrument-lines"><i></i><i></i><i></i><i></i><i></i></div><div class="instrument-lights">● ● ● <b>● ●</b></div>';
    function consoleDesk(x,z,w,d) {
      box('bridge-console-base',x,.9,z,w,1.8,d);
      plane('bridge-console-top',w,d,x,1.94,z,0,-1.32,instrument);
      obstacles.push({x,z,w:w+1,d:d+1});
    }
    consoleDesk(-4.7,-10,7.5,3.8); consoleDesk(4.7,-10,7.5,3.8);
    for (const side of [-1,1]) { consoleDesk(side*16,-11,5.5,8); consoleDesk(side*16,10,5.5,6); }
    // The chair is furniture you can circle, with a clear route on both sides.
    box('bridge-chair',0,.75,1,2.3,1.5,2.5);
    box('bridge-chair chair-back',0,2.25,2.05,2.4,3,.55);
    for (const x of [-1.45,1.45]) box('bridge-chair chair-arm',x,1.35,1,.55,1.6,2.9);
    obstacles.push({x:0,z:1,w:4.2,d:4});
    // A low dais and floor lights mark the command station without blocking movement.
    plane('bridge-dais',12,11,0,.012,-1,0,-Math.PI/2);
    const controls = document.createElement('div'); controls.className='bridge-walk-controls'; controls.hidden=true;
    controls.setAttribute('aria-label','Walk around the bridge');
    controls.innerHTML='<button data-move="turnleft" aria-label="Turn left">↶</button><button data-move="forward" aria-label="Walk forward">↑</button><button data-move="turnright" aria-label="Turn right">↷</button><button data-move="left" aria-label="Walk left">←</button><button data-move="back" aria-label="Walk backward">↓</button><button data-move="right" aria-label="Walk right">→</button>';
    deck.append(controls);
    function stop() { keys.clear(); drag=null; controls.querySelectorAll('button').forEach(b=>b.classList.remove('held')); }
    function blocked() { return !active || deck.inert || !document.getElementById('sw-deck-dialog').hidden || !!document.querySelector('#sw-cmd-panel,#sw-help-modal,#sw-wardrobe,#sw-pref-panel,#sw-save-report-modal'); }
    function canStand(x,z) { return Math.abs(x)<20.5 && z>-21.5 && z<21.8 && !obstacles.some(o=>Math.abs(x-o.x)<o.w/2&&Math.abs(z-o.z)<o.d/2); }
    function move(dx,dz) { const x=camera.position.x+dx,z=camera.position.z+dz; if(canStand(x,camera.position.z))camera.position.x=x; if(canStand(camera.position.x,z))camera.position.z=z; }
    function resize() {
      const aspect=innerWidth/innerHeight;
      // Hold the horizontal field of view on portrait phones so the front screen is never cropped.
      camera.aspect=aspect; camera.fov=2*Math.atan(Math.tan(74*Math.PI/360)/aspect)*180/Math.PI; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight);
      const focus=phone()&&view==='desk'; deck.classList.toggle('screen-focused',focus);
      if(focus) {scene.remove(board); deck.querySelector('.mobile-dock').append(screen); screen.style.display='';}
      else if(!board.parent)scene.add(board);
      render();
    }
    function setView(next) {
      stop(); if(next==='center')next='room';
      if(next==='history') { camera.position.set(-10,3.3,2); yaw=Math.PI/2; pitch=.15; view='walk'; openHistory(); }
      else {
        view=next;
        if(next==='room') {camera.position.set(0,5.2,10);yaw=0;pitch=.035;}
        if(next==='desk') {camera.position.set(0,4.7,-5);yaw=0;pitch=.105;}
        if(next==='walk' && !canStand(camera.position.x,camera.position.z))camera.position.set(0,3.2,10);
      }
      deck.dataset.bridgeView=view; deck.classList.toggle('exploring',view==='walk'||view==='look');
      controls.hidden=!(view==='walk'||view==='look');
      const help=deck.querySelector('.view-help'); help.hidden=view==='desk'; help.textContent=view==='room'?'Command bridge · Main screen to focus · Walk around to explore':'WASD to walk · Drag to look · Arrows to turn';
      deck.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
      resize();
    }
    function render() {
      camera.rotation.set(pitch,yaw,0,'YXZ'); cssCamera.copy(camera); cssCamera.position.multiplyScalar(100);
      for(const face of faces) {
        normal.set(0,0,1).applyQuaternion(face.quaternion); toCamera.copy(camera.position).sub(face.position);
        face.visible=normal.dot(toCamera)>.015;
      }
      renderer.render(scene,cssCamera);
      deck.dataset.bridgeX=camera.position.x.toFixed(2);deck.dataset.bridgeZ=camera.position.z.toFixed(2);deck.dataset.bridgeYaw=yaw.toFixed(3);
    }
    function frame(now) {
      if(!active){raf=0;return;} raf=requestAnimationFrame(frame);
      const dt=Math.min(.05,(now-lastTime)/1000||0);lastTime=now;
      if(document.hidden||blocked()){stop();return;}
      if(view==='walk'||view==='look') {
        const speed=5*dt;
        yaw+=((keys.has('turnleft')?1:0)-(keys.has('turnright')?1:0))*1.25*dt;
        pitch=Math.max(-.7,Math.min(.7,pitch+((keys.has('up')?1:0)-(keys.has('down')?1:0))*dt));
        let forward=(keys.has('forward')?1:0)-(keys.has('back')?1:0),side=(keys.has('right')?1:0)-(keys.has('left')?1:0);
        const length=Math.hypot(forward,side)||1;forward/=length;side/=length;
        move((-Math.sin(yaw)*forward+Math.cos(yaw)*side)*speed,(-Math.cos(yaw)*forward-Math.sin(yaw)*side)*speed);
      }
      render();
    }
    const keyMap={w:'forward',s:'back',a:'left',d:'right',q:'turnleft',e:'turnright',ArrowLeft:'turnleft',ArrowRight:'turnright',ArrowUp:'up',ArrowDown:'down'};
    document.addEventListener('keydown',e=>{
      if(blocked()||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||e.target.isContentEditable)return;
      if(e.key==='Escape'){setView('room');return;}
      const key=keyMap[e.key]||keyMap[e.key.toLowerCase()];if(!key)return;
      if(view!=='walk'&&view!=='look')setView('walk');keys.add(key);e.preventDefault();
    });
    document.addEventListener('keyup',e=>keys.delete(keyMap[e.key]||keyMap[e.key.toLowerCase()]));
    controls.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-move]');if(!b||blocked())return;e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.move);b.classList.add('held');});
    const release=e=>{const b=e.target.closest('[data-move]');if(b){keys.delete(b.dataset.move);b.classList.remove('held');}};
    controls.addEventListener('pointerup',release);controls.addEventListener('pointercancel',stop);controls.addEventListener('lostpointercapture',release);
    deck.addEventListener('pointerdown',e=>{if(blocked()||e.target.closest('button,input,select,.command-screen,.bridge-station,.bridge-nav')||view==='desk')return; if(view==='room')setView('look');drag={id:e.pointerId,x:e.clientX,y:e.clientY};deck.setPointerCapture(e.pointerId);});
    deck.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;yaw-=(e.clientX-drag.x)*.004;pitch=Math.max(-.7,Math.min(.7,pitch-(e.clientY-drag.y)*.003));drag={id:e.pointerId,x:e.clientX,y:e.clientY};});
    deck.addEventListener('pointerup',()=>drag=null);deck.addEventListener('pointercancel',stop);
    window.addEventListener('blur',stop);document.addEventListener('visibilitychange',stop);window.addEventListener('resize',resize);
    function rowsHtml(rows) {return rows.map(r=>`<div class="bridge-history-entry"><strong>${escape(r.label||r.unit||'Unit')}</strong><span>${escape(r.from||'—')} → <b>${escape(r.to||r.status||'—')}</b></span><small>${escape(r.who||r.staff||'Staff')} · ${escape(new Date(Number(r.t)||0).toLocaleString())}</small></div>`).join('');}
    function drawHistory() {
      logWall.querySelector('.bridge-log-state').textContent=historyState;
      logWall.querySelector('.bridge-log-rows').innerHTML=rowsHtml(history.slice(0,20));
      const slot=content.querySelector('[data-full-lock-history]'); if(slot){slot.innerHTML=rowsHtml(history);content.querySelector('[data-lock-history-state]').textContent=historyState;}
    }
    function openHistory() {
      stop();showDialog('Lock activity history','<p class="muted" data-lock-history-state></p><div class="full-lock-history" data-full-lock-history></div><div class="dialog-actions"><button class="action-button" data-history-login>Refresh history</button></div>');
      drawHistory();content.querySelector('[data-history-login]').onclick=()=>watchHistory(true);
    }
    function watchHistory(retry=false) {
      const signed=window.__swCheckLogin?.() && window._swAuth?.currentUser;
      if(!signed){if(watched){unsubscribe?.();unsubscribe=null;watched=false;}history=[];historyState='Connecting to saved lock history…';drawHistory();return;}
      if(watched&&!retry)return;
      if(!window._swOnValue||!window._swRef)return;
      unsubscribe?.();watched=true;historyState='Loading saved lock history…';drawHistory();
      unsubscribe=window._swOnValue(window._swRef(window._swDB,'lockLog'),snapshot=>{
        history=Object.values(snapshot.val()||{}).filter(r=>r&&(!r.type||r.type==='lock')&&(r.label||r.unit)).sort((a,b)=>(Number(b.t)||0)-(Number(a.t)||0));
        historyState=history.length?`${history.length} saved changes · newest first`:'No saved lock changes yet';drawHistory();
      },()=>{watched=false;historyState='Lock history could not connect. Refresh to retry.';drawHistory();});
    }
    let rosterSignature='';
    function refresh() {
      if(!active)return;watchHistory();
      const list=units(),signature=list.map(u=>u.id+u.status).join('|');
      if(signature!==rosterSignature){rosterSignature=signature;rosterWall.querySelector('.bridge-roster').innerHTML=list.map(u=>`<button data-room-unit="${escape(u.id)}" style="--unit-color:${status[u.status]?.[1]||'#adc1d2'}" aria-label="Unit ${escape(u.label)} · ${escape(status[u.status]?.[0]||'Unknown')}">${escape(u.label)}</button>`).join('');}
    }
    deck.addEventListener('click',e=>{
      const id=e.target.closest('[data-room-unit]')?.dataset.roomUnit;if(id){stop();const u=units().find(u=>u.id===id);if(u)showUnit(u);return;}
      const action=e.target.closest('[data-station]')?.dataset.station;if(!action)return;stop();
      ({history:openHistory,refresh:()=>watchHistory(true),gear,alerts,report,exit}[action])?.();
    });
    return {
      open(){active=true;lastTime=0;setView('room');refresh();if(!raf)raf=requestAnimationFrame(frame);},
      close(){active=false;stop();unsubscribe?.();unsubscribe=null;watched=false;history=[];drawHistory();},
      setView,refresh,stop,resize
    };
  };
})();
