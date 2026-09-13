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
    const joystick={id:null,x:0,y:0};
    const renderedPose={x:NaN,z:NaN,yaw:NaN,pitch:NaN};
    const touches=new Map();
    let pinch=null,zoom=1,suppressTapUntil=0;
    let doorOpen=false,doorReady=false,doorManual=false,doorTimer;
    let view = 'room', active = false, raf = 0, lastTime = 0, drag, yaw = 0, pitch = .04, unsubscribe, history = [], historyState = 'Connecting to saved lock history…', watched = false;
    const limitPitch = value => Math.max(-.25,Math.min(.22,value));
    const normal = new T.Vector3(), toCamera = new T.Vector3();
    const spaceView = index => `<div class="space-scene" aria-hidden="true" style="--space-x:${18+(index%5)*16}%;--space-delay:${-index*7}s"><div class="space-planet"></div><div class="space-stars stars-far"></div><div class="space-stars stars-near"></div></div><div class="window-glass" aria-hidden="true"></div>`;
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
        plane('bridge-bulkhead bridge-observation',12,12,side*22,6,z,-side*Math.PI/2,0,spaceView((z+18)/12+(side>0?4:0)));
        box('bridge-rib',side*21.65,6,z-5.8,.65,12,.6);
      }
      plane('bridge-window window-'+(side<0?'port':'starboard'),8.8,9.8,side*16.8,6.5,-23.7,0,0,spaceView(side<0?2:3));
    }
    plane('bridge-bulkhead bridge-observation',44,12,0,6,24,Math.PI,0,spaceView(7));
    plane('bridge-bulkhead bridge-observation',44,12,0,6,-24,0,0,spaceView(1));
    for (const z of [-20,-8,4,16]) box('bridge-overhead',0,11.6,z,43,.7,.6);
    for(const x of [-12,12])plane('bridge-light-strip',.4,43,x,11.15,0,0,Math.PI/2);
    for(const side of [-1,1])plane('bridge-wall-wash',46,.35,side*21.2,10.8,0,-side*Math.PI/2);
    plane('bridge-wall-wash',42,.4,0,11.4,-23.4);
    plane('bridge-front-frame',23.8,11.25,0,6.35,-23.72);
    const board = new T.CSS3DObject(screen); board.scale.setScalar(.02); board.position.set(0,6.65,-23.5); scene.add(board); faces.push(board);
    const station = (cls,title,sub,w,h,x,y,z,ry,html) => plane('bridge-station '+cls,w,h,x,y,z,ry,0,
      `<header><span>${sub}</span><h2>${title}</h2></header>${html}`);
    const logWall = station('bridge-log-wall','LOCK ACTIVITY','PORT · OPERATIONS',14,7.8,-21.15,6,2,Math.PI/2,
      '<div class="bridge-log-state" role="status"></div><div class="bridge-log-rows"></div><footer><button data-station="history">Open full lock history</button><button data-station="refresh">Refresh history</button></footer>').element;
    const rosterWall = station('bridge-roster-wall','UNIT STATUS','STARBOARD · SECURITY',14,7.8,21.15,6,2,-Math.PI/2,
      '<div class="bridge-roster"></div><footer>Live unit status · Select a unit to inspect</footer>').element;
    station('bridge-comms','COMMUNICATIONS','AFT · CREW STATION',11,8.4,-10,5.3,23.7,Math.PI,
      '<div class="bridge-station-actions"><button data-station="alerts">Push notifications</button><button data-station="report">Save &amp; email report</button><button data-station="gear">Team &amp; ship systems</button></div>');
    const portal=plane('bridge-airlock-portal',9.4,10.6,7,5.3,23.6,Math.PI,0,
      '<header class="airlock-sign"><span>PROPERTY ACCESS</span><strong>EXIT</strong><i></i></header><div class="airlock-cavity"><div class="airlock-corridor"><svg class="corridor-perspective" viewBox="0 0 400 400" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="sw-corridor-wall"><stop stop-color="#40627d"/><stop offset="1" stop-color="#122a42"/></linearGradient></defs><path d="M0 0H400L272 100H128Z" fill="#18334c"/><path d="M0 0 128 100V312L0 400Z M400 0 272 100V312L400 400Z" fill="url(#sw-corridor-wall)" stroke="#4e819e"/><path d="M0 400 128 312H272L400 400Z" fill="#29475e"/><path d="M44 34V370 M88 69V340 M356 34V370 M312 69V340" stroke="#274b65" stroke-width="4"/><path d="M0 40 128 128 M400 40 272 128 M0 385 128 306 M400 385 272 306" stroke="#8aebf0" stroke-width="3"/><path d="M85 0 155 100 M315 0 245 100" stroke="#ffe0a0" stroke-width="4"/><path d="M35 375H365 M78 345H322 M115 320H285 M100 400 165 312 M300 400 235 312" stroke="#688fa8" stroke-width="1.5"/><rect x="128" y="100" width="144" height="212" fill="#071624" stroke="#63c7dc" stroke-width="3"/></svg><div class="corridor-end">STOREWELL<br><small>STORAGE PROPERTY</small></div></div><div class="airlock-leaf leaf-left"><span>SW</span></div><div class="airlock-leaf leaf-right"><span>01</span></div><button class="airlock-trigger" data-station="door" aria-label="Open exit doors"><span class="airlock-prompt">TAP TO OPEN</span></button></div><footer class="airlock-status" role="status">Automatic doors · Approach to open</footer>').element;
    const doorTrigger=portal.querySelector('.airlock-trigger');
    deck.dataset.bridgeDoor='closed';
    for(const x of [1.9,12.1])box('airlock-jamb',x,5.4,23.35,.55,10.8,.65);
    const instrument = '<div class="instrument-radar"></div><div class="instrument-lines"><i></i><i></i><i></i><i></i><i></i></div><div class="instrument-lights">● ● ● <b>● ●</b></div>';
    function consoleDesk(x,z,w,d) {
      box('bridge-console-base',x,.9,z,w,1.8,d);
      plane('bridge-console-top',w,d,x,1.94,z,0,-1.32,instrument);
      obstacles.push({x,z,w:w+1,d:d+1});
    }
    consoleDesk(-7.5,-10,7,3.8); consoleDesk(7.5,-10,7,3.8);
    for (const side of [-1,1]) { consoleDesk(side*17,-12,4.5,7); consoleDesk(side*17,11,4.5,6); }
    // Keep the chair behind the entry position and a six-metre center aisle clear to the display.
    box('bridge-chair',0,.75,14,2.3,1.5,2.5);
    box('bridge-chair chair-back',0,2.25,15.05,2.4,3,.55);
    for (const x of [-1.45,1.45]) box('bridge-chair chair-arm',x,1.35,14,.55,1.6,2.9);
    obstacles.push({x:0,z:14,w:4.2,d:4});
    // A low dais and floor lights mark the command station without blocking movement.
    plane('bridge-dais',11,9,0,.012,14,0,-Math.PI/2);
    plane('bridge-aisle',6,32,0,.025,-5,0,-Math.PI/2);
    const controls=document.createElement('div');controls.className='bridge-joystick';
    controls.innerHTML='<span class="joystick-caption">MOVE / TURN</span><button class="joystick-pad" aria-label="Bridge joystick" aria-describedby="bridge-joystick-help"><span class="joystick-ring"></span><span class="joystick-direction north" aria-hidden="true">↑</span><span class="joystick-direction south" aria-hidden="true">↓</span><span class="joystick-direction west" aria-hidden="true">↶</span><span class="joystick-direction east" aria-hidden="true">↷</span><span class="joystick-stick"><i></i></span></button><span id="bridge-joystick-help">Drag up or down to walk. Drag left or right to turn.</span><button class="level-view" type="button">Level view</button>';
    deck.append(controls);const pad=controls.querySelector('.joystick-pad'),stick=controls.querySelector('.joystick-stick');
    function releaseJoystick(){const id=joystick.id;joystick.id=null;if(id!==null&&pad.hasPointerCapture?.(id))pad.releasePointerCapture(id);joystick.x=joystick.y=0;stick.style.transform='translate(0px,0px)';pad.classList.remove('held');}
    function releaseLook(){const id=drag?.id;if((drag?.travel||0)>8)suppressTapUntil=performance.now()+500;drag=null;if(id!==undefined&&deck.hasPointerCapture?.(id))deck.releasePointerCapture(id);}
    function stop(){keys.clear();const ids=[...touches.keys()];touches.clear();pinch=null;releaseLook();releaseJoystick();for(const id of ids)if(deck.hasPointerCapture?.(id))deck.releasePointerCapture(id);}
    function blocked() { return !active || deck.inert || !document.getElementById('sw-deck-dialog').hidden || !!document.querySelector('#sw-cmd-panel,#sw-help-modal,#sw-wardrobe,#sw-pref-panel,#sw-save-report-modal,#sw-rounds-modal,#sw-login-overlay') || document.getElementById('sw-sens-panel')?.style.display==='block'; }
    function canStand(x,z) { return Math.abs(x)<20.5 && z>-21.5 && (z<21.8||(doorReady&&Math.abs(x-7)<3.5&&z<25.5)) && !obstacles.some(o=>Math.abs(x-o.x)<o.w/2&&Math.abs(z-o.z)<o.d/2); }
    function move(dx,dz) { const x=camera.position.x+dx,z=camera.position.z+dz; if(canStand(x,camera.position.z))camera.position.x=x; if(canStand(camera.position.x,z))camera.position.z=z; }
    function setDoor(open) {
      if(open===doorOpen)return;
      clearTimeout(doorTimer);doorOpen=open;doorReady=false;portal.classList.toggle('is-open',open);
      deck.dataset.bridgeDoor=open?'opening':'closed';doorTrigger.disabled=open;
      doorTrigger.setAttribute('aria-label',open?'Exit doors opening':'Open exit doors');
      portal.querySelector('.airlock-prompt').textContent=open?'OPENING…':'TAP TO OPEN';
      portal.querySelector('.airlock-status').textContent=open?'Opening exit doors…':'Automatic doors · Approach to open';
      if(open)doorTimer=setTimeout(()=>{
        if(!active||!doorOpen)return;doorReady=true;doorTrigger.disabled=false;deck.dataset.bridgeDoor='open';
        doorTrigger.setAttribute('aria-label','Exit to storage property');
        portal.querySelector('.airlock-prompt').textContent='RETURN OUTSIDE';
        portal.querySelector('.airlock-status').textContent='Walk through · or tap to exit';
      },window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?0:760);
    }
    function openExitDoors() {
      if(doorReady){exit();return;}
      if(!doorOpen){setView('door');doorManual=true;setDoor(true);}
    }
    function setZoom(value) {
      zoom=Math.max(.65,Math.min(2.5,value));camera.zoom=zoom;camera.updateProjectionMatrix();render();
    }
    function resize() {
      const width=deck.clientWidth||innerWidth,height=deck.clientHeight||innerHeight;
      // A normal vertical lens keeps the ceiling from filling a portrait phone.
      camera.aspect=width/height; camera.fov=width<=700?78:58;camera.zoom=zoom;camera.updateProjectionMatrix(); renderer.setSize(width,height);
      const focus=view==='desk'; deck.classList.toggle('screen-focused',focus);controls.hidden=focus;
      if(focus) {scene.remove(board); deck.querySelector('.mobile-dock').append(screen); screen.style.display='';}
      else if(!board.parent)scene.add(board);
      render();
    }
    function setView(next,keepInput=false) {
      if(!keepInput)stop(); if(next==='center')next='room';
      if(next==='level'){pitch=0;render();return;}
      if(next==='history') { camera.position.set(-10,5.2,2); yaw=Math.PI/2; pitch=.04; view='walk'; openHistory(); }
      else if(next==='door') {camera.position.set(7,5.2,(deck.clientWidth||innerWidth)<=700?9.5:13.5);yaw=Math.PI;pitch=0;zoom=1;view='walk';}
      else {
        view=next;
        if(next==='room') {camera.position.set(0,5.2,10);yaw=0;pitch=.04;zoom=1;doorManual=false;setDoor(false);}
        if(next==='desk') {camera.position.set(0,4.7,-5);yaw=0;pitch=.105;}
        if(next==='walk' && !canStand(camera.position.x,camera.position.z))camera.position.set(0,5.2,10);
      }
      deck.dataset.bridgeView=view; deck.classList.toggle('exploring',view==='walk'||view==='look');
      controls.hidden=view==='desk';
      const help=deck.querySelector('.view-help'); help.hidden=view==='desk'; help.textContent='Drag to look · Pinch to zoom';
      deck.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view||(b.dataset.view==='room'&&(view==='walk'||view==='look')))));
      resize();
    }
    function render() {
      camera.rotation.set(pitch,yaw,0,'YXZ'); cssCamera.copy(camera); cssCamera.position.multiplyScalar(100);
      for(const face of faces) {
        normal.set(0,0,1).applyQuaternion(face.quaternion); toCamera.copy(camera.position).sub(face.position);
        face.visible=normal.dot(toCamera)>.015;
      }
      renderer.render(scene,cssCamera);
      Object.assign(renderedPose,{x:camera.position.x,z:camera.position.z,yaw,pitch});
      deck.dataset.bridgeX=camera.position.x.toFixed(2);deck.dataset.bridgeZ=camera.position.z.toFixed(2);deck.dataset.bridgeYaw=yaw.toFixed(3);deck.dataset.bridgePitch=pitch.toFixed(3);deck.dataset.bridgeFov=String(camera.fov);deck.dataset.bridgeZoom=zoom.toFixed(2);
    }
    function frame(now) {
      if(!active){raf=0;return;} raf=requestAnimationFrame(frame);
      const dt=Math.min(.05,(now-lastTime)/1000||0);lastTime=now;
      if(document.hidden||blocked()){stop();return;}
      if(view==='walk'||view==='look') {
        const speed=5*dt*Math.max(.4,Math.min(2.5,(window._swWalkSpd||.2)/.2));
        const turn=1.25*Math.max(.4,Math.min(2.5,(window._swTurnSpd||.006)/.006));
        yaw+=((keys.has('turnleft')?1:0)-(keys.has('turnright')?1:0)-joystick.x)*turn*dt;
        let forward=(keys.has('forward')?1:0)-(keys.has('back')?1:0)-joystick.y,side=(keys.has('right')?1:0)-(keys.has('left')?1:0);
        if(Math.abs(forward)+Math.abs(side)>.05&&!drag)pitch+=(.04-pitch)*Math.min(1,dt*6);
        const length=Math.max(1,Math.hypot(forward,side));forward/=length;side/=length;
        move((-Math.sin(yaw)*forward+Math.cos(yaw)*side)*speed,(-Math.cos(yaw)*forward-Math.sin(yaw)*side)*speed);
        if(doorManual&&Math.hypot(camera.position.x-7,camera.position.z-24)>16)doorManual=false;
        setDoor(doorManual||(Math.abs(camera.position.x-7)<5&&camera.position.z>17));
        if(doorReady&&Math.abs(camera.position.x-7)<3.5&&camera.position.z>23.8){exit();return;}
      }
      if(camera.position.x!==renderedPose.x||camera.position.z!==renderedPose.z||yaw!==renderedPose.yaw||pitch!==renderedPose.pitch)render();
    }
    const keyMap={w:'forward',s:'back',a:'left',d:'right',q:'turnleft',e:'turnright',ArrowLeft:'turnleft',ArrowRight:'turnright',ArrowUp:'forward',ArrowDown:'back'};
    document.addEventListener('keydown',e=>{
      if(blocked()||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||e.target.isContentEditable)return;
      if(e.key==='Escape'){setView('room');return;}
      if(view==='desk')return;
      const key=keyMap[e.key]||keyMap[e.key.toLowerCase()];if(!key)return;
      if(view!=='walk'&&view!=='look')setView('walk');keys.add(key);e.preventDefault();
    });
    document.addEventListener('keyup',e=>keys.delete(keyMap[e.key]||keyMap[e.key.toLowerCase()]));
    function joystickMove(e){
      if(joystick.id!==e.pointerId)return;
      const rect=pad.getBoundingClientRect(),radius=rect.width*.32;
      let x=(e.clientX-rect.left-rect.width/2)/radius,y=(e.clientY-rect.top-rect.height/2)/radius;
      const magnitude=Math.hypot(x,y);if(magnitude>1){x/=magnitude;y/=magnitude;}
      const amount=Math.min(1,magnitude),gain=amount>.13?(amount-.13)/(.87*amount):0;
      joystick.x=x*gain;joystick.y=y*gain;
      stick.style.transform=`translate(${x*radius}px,${y*radius}px)`;
    }
    pad.addEventListener('pointerdown',e=>{if(blocked()||joystick.id!==null||e.button>0)return;e.preventDefault();e.stopPropagation();if(view!=='walk')setView('walk',true);joystick.id=e.pointerId;pad.setPointerCapture?.(e.pointerId);pad.classList.add('held');joystickMove(e);});
    pad.addEventListener('pointermove',e=>{if(joystick.id===e.pointerId){e.preventDefault();e.stopPropagation();joystickMove(e);}});
    const release=e=>{if(joystick.id===e.pointerId){releaseJoystick();if(pad.hasPointerCapture?.(e.pointerId))pad.releasePointerCapture(e.pointerId);}};
    pad.addEventListener('pointerup',release);pad.addEventListener('pointercancel',release);pad.addEventListener('lostpointercapture',release);
    controls.querySelector('.level-view').onclick=()=>setView('level');
    // Track the room's two touch points before button handlers; a pinch must never select a tile.
    deck.addEventListener('pointerdown',e=>{
      if(!touches.size&&!pinch)suppressTapUntil=0;
      if(e.pointerType!=='touch'||blocked()||view==='desk'||e.target.closest('.bridge-nav,.bridge-joystick'))return;
      touches.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(touches.size===2){const [a,b]=[...touches.values()];pinch={distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),zoom};drag=null;keys.clear();suppressTapUntil=performance.now()+500;e.preventDefault();for(const id of touches.keys())deck.setPointerCapture?.(id);}
    },true);
    deck.addEventListener('pointermove',e=>{
      if(!touches.has(e.pointerId))return;touches.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(pinch&&touches.size>=2){const [a,b]=[...touches.values()];setZoom(pinch.zoom*Math.hypot(a.x-b.x,a.y-b.y)/pinch.distance);suppressTapUntil=performance.now()+500;e.preventDefault();e.stopPropagation();}
    },true);
    const endTouch=e=>{if(!touches.has(e.pointerId))return;if(pinch)suppressTapUntil=performance.now()+500;if(drag?.id===e.pointerId)releaseLook();touches.delete(e.pointerId);if(touches.size<2)pinch=null;if(deck.hasPointerCapture?.(e.pointerId))deck.releasePointerCapture(e.pointerId);};
    deck.addEventListener('pointerup',endTouch,true);deck.addEventListener('pointercancel',endTouch,true);
    deck.addEventListener('click',e=>{if(performance.now()<suppressTapUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
    deck.addEventListener('wheel',e=>{if(blocked()||view==='desk'||e.target.closest('.bridge-nav,.bridge-joystick')||(!e.ctrlKey&&e.target.closest('.command-screen,.bridge-station')))return;e.preventDefault();setZoom(zoom*Math.exp(-e.deltaY*.004));},{passive:false});
    deck.addEventListener('pointerdown',e=>{if(blocked()||pinch||drag||e.button>0||e.target.closest('button,input,select,.command-screen,.bridge-station,.bridge-nav,.bridge-joystick')||view==='desk')return; if(view==='room')setView('look',true);drag={id:e.pointerId,x:e.clientX,y:e.clientY,travel:0};deck.setPointerCapture?.(e.pointerId);});
    deck.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const sens=Math.max(.001,Math.min(.004,window._swLookSens||.002));const dx=e.clientX-drag.x,dy=e.clientY-drag.y;yaw-=dx*sens*1.4;pitch=limitPitch(pitch-dy*sens*.55);drag={id:e.pointerId,x:e.clientX,y:e.clientY,travel:drag.travel+Math.hypot(dx,dy)};});
    const endLook=e=>{if(drag?.id===e.pointerId)releaseLook();};
    deck.addEventListener('pointerup',endLook);deck.addEventListener('pointercancel',endLook);deck.addEventListener('lostpointercapture',endLook);
    window.addEventListener('blur',stop);document.addEventListener('visibilitychange',stop);window.addEventListener('resize',resize);
    window.visualViewport?.addEventListener('resize',resize);
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
    function localBounds(node,surface) {
      let x=0,y=0,el=node;
      while(el&&el!==surface){x+=el.offsetLeft;y+=el.offsetTop;const parent=el.offsetParent;if(parent){x+=parent.clientLeft;y+=parent.clientTop;}el=parent;}
      if(el!==surface)return null;
      for(let parent=node.parentElement;parent&&parent!==surface.parentElement;parent=parent.parentElement){x-=parent.scrollLeft;y-=parent.scrollTop;}
      return {x,y,w:node.offsetWidth,h:node.offsetHeight};
    }
    // Some mobile browsers paint rotated CSS3D controls but hit-test the empty canvas behind them.
    // Pick the nearest visible room face, then its real button, in the same room geometry.
    function pickRoomButton(clientX,clientY) {
      const rect=deck.getBoundingClientRect();if(!rect.width||!rect.height)return null;
      camera.updateMatrixWorld(true);const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((clientX-rect.left)/rect.width*2-1,1-(clientY-rect.top)/rect.height*2),camera);
      let picked=null,nearest=Infinity;
      for(const face of faces){
        if(!face.visible||!face.parent)continue;const element=face.element,w=element.offsetWidth,h=element.offsetHeight;if(!w||!h)continue;
        const n=new T.Vector3(0,0,1).applyQuaternion(face.quaternion),plane=new T.Plane().setFromNormalAndCoplanarPoint(n,face.position);
        const point=ray.ray.intersectPlane(plane,new T.Vector3());if(!point)continue;
        const distance=point.distanceTo(camera.position);if(distance>=nearest)continue;
        const local=point.clone().sub(face.position).applyQuaternion(face.quaternion.clone().invert()).multiplyScalar(50);
        const x=local.x+w/2,y=h/2-local.y;if(x<0||x>w||y<0||y>h)continue;
        nearest=distance;picked={element,x,y};
      }
      if(!picked)return null;
      for(const button of picked.element.querySelectorAll('button')){
        if(button.disabled||button.hidden)continue;const r=localBounds(button,picked.element);if(!r||picked.x<r.x||picked.x>r.x+r.w||picked.y<r.y||picked.y>r.y+r.h)continue;
        let clipped=false;
        for(let parent=button.parentElement;parent&&parent!==picked.element;parent=parent.parentElement){
          const style=getComputedStyle(parent);if(!/hidden|auto|scroll|clip/.test(style.overflowX+' '+style.overflowY))continue;
          const clip=localBounds(parent,picked.element);if(clip&&(picked.x<clip.x||picked.x>clip.x+clip.w||picked.y<clip.y||picked.y>clip.y+clip.h)){clipped=true;break;}
        }
        if(!clipped)return button;
      }
      return null;
    }
    deck.addEventListener('click',e=>{
      if(!blocked()&&view!=='desk'&&!e.target.closest('button,input,select,.bridge-nav,.bridge-joystick')){const button=pickRoomButton(e.clientX,e.clientY);if(button){e.preventDefault();button.click();return;}}
      const id=e.target.closest('[data-room-unit]')?.dataset.roomUnit;if(id){stop();const u=units().find(u=>u.id===id);if(u)showUnit(u);return;}
      const action=e.target.closest('[data-station]')?.dataset.station;if(!action)return;stop();
      ({history:openHistory,refresh:()=>watchHistory(true),door:openExitDoors,gear,alerts,report,exit}[action])?.();
    });
    return {
      open(){active=true;lastTime=0;setView('room');refresh();if(!raf)raf=requestAnimationFrame(frame);},
      close(){active=false;stop();clearTimeout(doorTimer);doorManual=false;setDoor(false);unsubscribe?.();unsubscribe=null;watched=false;history=[];drawHistory();},
      setView,refresh,stop,resize
    };
  };
})();
