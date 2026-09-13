/* StoreWell bridge: one live command display, a perspective room, original property model. */
(() => {
  'use strict';
  const STATUS = Object.freeze({
    green: ['Rented', '#42f7b6'], red: ['Locked out', '#ff7974'],
    flashred: ['Lock on', '#ff7974'], flashgreen: ['Lock off', '#42f7b6'],
    blue: ['Reserved', '#63ceff'], yellow: ['Rented · no lock', '#ffce6e'],
    purple: ['Ready to rent', '#bd8aff'], white: ['Empty', '#eee9ff'], black: ['Out of service', '#adbdca']
  });
  const paths = {
    units: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h1m6 0h1M8 11h1m6 0h1M8 15h1m6 0h1M10 21v-3h4v3"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
    unlock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8-1m-4 8v3"/>',
    tool: '<path d="m14 6 4 4m-6 2L4 20l-2-2 8-8M15 3a6 6 0 0 0-5 7l4 4a6 6 0 0 0 7-5l-4 1-3-3 1-4Z"/>',
    star: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    route: '<circle cx="13" cy="4" r="2"/><path d="m8 11 4-4 3 5 4 1m-7-6-2 9-4 5m5-8 5 8"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    gear: '<circle cx="12" cy="12" r="4"/><path d="M10 2h4l1 3 3 1 3 3-2 3 1 4-4 2-2 4h-4l-2-3-4-1-2-4 2-3V7l4-2 2-3Z"/>',
    exit: '<path d="M10 3H4v18h6m4-15 6 6-6 6m-6-6h12"/>',
    bell: '<path d="M4 17h16l-2-3V9a6 6 0 0 0-12 0v5l-2 3Zm5 3h6"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/>',
    save: '<path d="M4 3h13l4 4v14H3V3h1Zm3 0v6h10V3M7 21v-8h10v8"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    center: '<circle cx="12" cy="12" r="6"/><path d="M12 2v5m0 10v5M2 12h5m10 0h5"/>',
    desk: '<path d="M3 4h18v12H3zM8 21h8m-4-5v5"/>',
    team: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-17a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5v2"/>',
    chat: '<path d="M3 3h18v14H9l-6 4V3Zm4 5h10M7 12h7"/>',
    sound: '<path d="m3 9 4 0 5-5v16l-5-5H3V9Zm13-2a7 7 0 0 1 0 10m3-13a11 11 0 0 1 0 16"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    back: '<path d="m10 5-7 7 7 7M3 12h18"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.units}</svg>`;
  const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function key(label, color, action, symbol, count) {
    return `<button class="key ${color}" data-action="${action}" aria-label="${label}">${icon(symbol)}<span class="key-copy">${count !== undefined ? `<b data-count="${count}">—</b>` : ''}<small>${label}</small></span></button>`;
  }
  const deck = document.createElement('section');
  deck.id = 'sw-deck';
  deck.hidden = true;
  deck.setAttribute('aria-label', 'StoreWell 3D command center');
  deck.innerHTML = `<div class="fallback-room"></div><div class="room-canvas"></div><div class="room-ui"></div><div class="room-vignette"></div><div class="mobile-dock"></div>
    <div class="view-help" hidden>Drag to look around · Arrow keys to turn · Center to return</div>
    <nav class="bridge-nav" aria-label="Room view">
      <button data-view="desk" aria-pressed="false">${icon('desk')}Main screen</button>
      <button data-view="room" aria-pressed="true">${icon('units')}Bridge</button>
      <button data-view="history">${icon('clock')}Lock log</button>
      <button data-view="exit">${icon('exit')}Outside</button>
    </nav><div class="toast" role="status" hidden></div>`;
  const screen = document.createElement('main');
  screen.className = 'command-screen';
  screen.innerHTML = `<header class="bridge-header"><div class="bridge-brand"><div class="bridge-emblem">${icon('units')}</div><div><h1>STOREWELL COMMAND CENTER</h1><p>Storage division · Command bridge</p></div></div>
      <button class="key" data-action="find">${icon('search')}Find unit</button><button class="key" data-action="gear">${icon('gear')}Gear</button></header>
    <div class="stats-primary">${key('Total units','purple','all','units','all')}${key('Rented','green','green','units','green')}${key('Out of service','steel','black','tool','black')}${key('Locked out','red','red','lock','red')}</div>
    <div class="lock-row"><div class="lock-pair">${key('Lock on','red','flashred','lock','flashred')}<button class="key gold route-key" data-action="route-flashred">${icon('route')}Route</button></div>
      <div class="lock-pair">${key('Lock off','green','flashgreen','unlock','flashgreen')}<button class="key gold route-key" data-action="route-flashgreen">${icon('route')}Route</button></div></div>
    <div class="stats-secondary">${key('Reserved','','blue','star','blue')}${key('No lock','gold','yellow','clock','yellow')}${key('Ready','purple','purple','check','purple')}</div>
    <div class="command-actions"><button class="key red" data-action="exit">${icon('exit')}Exit</button><button class="key gold" data-action="alerts">${icon('bell')}<span class="alerts-label">Alerts</span></button><button class="key steel" data-action="install">${icon('phone')}Install app</button></div>
    <footer class="screen-footer"><div class="mini-radar" aria-hidden="true"></div><div class="telemetry"><span class="connection" role="status">Connecting to unit inventory…</span><span>STORE · TRACK · PROTECT</span></div><button class="key" data-action="report">${icon('save')}Save &amp; report</button></footer>`;
  deck.querySelector('.mobile-dock').append(screen);
  document.body.append(deck);
  const dialog = document.createElement('dialog');
  dialog.id = 'sw-deck-dialog'; dialog.hidden = true;
  dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true'); dialog.setAttribute('aria-labelledby', 'deck-dialog-title');
  dialog.innerHTML = `<div class="dialog-box"><header class="dialog-head"><button class="menu-back" hidden>${icon('back')}Back</button><h2 id="deck-dialog-title" tabindex="-1"></h2><button class="close-dialog" aria-label="Close menu"><span aria-hidden="true">×</span> Close</button></header><div class="dialog-body"></div></div>`;
  document.body.append(dialog);
  const content = dialog.querySelector('.dialog-body');
  let app, bridge, roomStarted = false;
  let propertyPlan, selectedPropertyUnit;
  const sceneryPanels=[];
  let view = 'room', yaw = 0, pitch = 0, targetYaw = 0, targetPitch = 0;
  let appLoginStarted = false;
  let live = false, lastSync = 0, lastFocus, activeFilter = 'all', toastTimer, installPrompt;
  let routeQueue = [], routeCursor = 0;
  let inventoryDownloadUrl, menuBack;
  const menuChoice=(label,setting,symbol,color='#65d7ef')=>`<button class="action-button menu-choice" data-setting="${setting}" style="--menu-color:${color}">${icon(symbol)}<span>${label}</span></button>`;
  function releaseInventoryDownload() {
    if(!inventoryDownloadUrl)return;
    const url=inventoryDownloadUrl;inventoryDownloadUrl=null;
    // Give a just-clicked browser download time to start before releasing its URL.
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  }
  window.__swDeckVisible = false;
  const mobile = () => window.innerWidth <= 700;
  const units = () => Object.entries(app?._locks || {}).map(([id, rec]) => ({ id, label: rec.label, size: app._sizeOf(rec.label), status: app._statusOf(rec.label) })).sort((a,b) => a.label.localeCompare(b.label, undefined, {numeric:true}));
  function toast(text) {
    const el = deck.querySelector('.toast'); el.textContent = text; el.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.hidden = true, 5000);
  }
  function showDialog(title, html, options={}) {
    bridge?.stop(); if(dialog.hidden)lastFocus = document.activeElement;
    releaseInventoryDownload();
    content.onclick = null;
    dialog.querySelector('h2').textContent = title; content.innerHTML = html;
    menuBack=options.back;dialog.querySelector('.menu-back').hidden=!menuBack;
    dialog.dataset.menu=options.kind||'actions';
    const palette=Object.values(STATUS).find(([label])=>title===label||title===label+' route');
    dialog.style.setProperty('--window-accent',palette?.[1]||'#65d7ef');
    dialog.hidden = false; deck.inert = true;
    if(propertyPlan) propertyPlan.inert = true;
    if(typeof dialog.showModal==='function'){if(!dialog.open)dialog.showModal();}else dialog.setAttribute('open','');
    content.scrollTop=0;
    // Opening a unit list should not bring up the phone keyboard or scroll the 3D scene.
    dialog.querySelector('h2').focus({preventScroll:true});
  }
  function closeDialog() {
    releaseInventoryDownload();
    const wasOpen=!dialog.hidden;dialog.hidden=true;
    if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open');
    deck.inert=false;if(propertyPlan)propertyPlan.inert=false;
    menuBack=null;
    if(wasOpen&&lastFocus?.isConnected)lastFocus.focus({preventScroll:true});
  }
  dialog.querySelector('.close-dialog').onclick = closeDialog;
  dialog.querySelector('.menu-back').onclick=()=>menuBack?.();
  dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog();});
  dialog.addEventListener('click', e => { if(e.target === dialog) closeDialog(); });
  dialog.addEventListener('keydown', e => {
    if(e.key === 'Escape') { e.preventDefault();e.stopPropagation();closeDialog(); }
    if(e.key !== 'Tab') return;
    const nodes = [...dialog.querySelectorAll('button,input,select,a[href]')].filter(x => !x.disabled && x.offsetParent !== null);
    const first = nodes[0], last = nodes.at(-1);
    if(e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus({preventScroll:true}); }
    else if(!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus({preventScroll:true}); }
  });
  async function openDeck() {
    if(!await login())return;
    closeDialog();
    deck.hidden = false; window.__swDeckVisible = true;
    document.body.classList.add('storewell-deck-open');
    document.body.classList.remove('storewell-property-plan');
    if(propertyPlan) propertyPlan.hidden = true;
    const playerControls=document.getElementById('sw-sens-panel');if(playerControls)playerControls.style.display='none';
    document.getElementById('sw-dashboard')?.remove();
    if(app) { app.keys = {}; app._kt = {}; app._tk = {}; app._talt = {}; app._dragging = false; app.setState({showSearch:false,showInv:false,pickUnit:null,chatOpen:false,helpClosed:true}); }
    if(!roomStarted) { roomStarted = true; setupRoom(); }
    yaw = pitch = targetYaw = targetPitch = 0;
    setView('room');
    bridge?.open();
  }
  function exitDeck(unit) {
    if(!app?.scene) return toast('The property model is still loading. Please try again in a moment.');
    bridge?.close(); closeDialog(); deck.hidden = true; window.__swDeckVisible = false;
    document.body.classList.remove('storewell-deck-open');
    for(const id of ['sw-cmd-panel','sw-help-modal','sw-wardrobe','sw-rounds-modal','sw-hist-panel','sw-pref-panel']) document.getElementById(id)?.remove();
    app.keys={}; app._kt={}; app._tk={}; app._talt={}; app.setState({chatOpen:false});
    if(unit) { app.locate(unit.id); app.setState({showSearch:false,pickUnit:null}); }
    if(app._webglAvailable===false) showPropertyPlan(unit);
    window.dispatchEvent(new Event('resize'));
  }
  function showPropertyPlan(selected) {
    if(selected) selectedPropertyUnit = selected;
    if(!propertyPlan) {
      propertyPlan = document.createElement('main'); propertyPlan.id = 'sw-property-fallback';
      propertyPlan.innerHTML = `<header><div><p>OUTSIDE · STORAGE PROPERTY</p><h1>StoreWell Storage</h1></div><nav aria-label="Property controls"><button data-property="find">Find a unit</button><button data-property="command">Enter Command Center</button></nav></header><div class="property-caption"><span>3D graphics are unavailable on this device. Showing the property plan.</span><strong class="property-selection" role="status"></strong></div><div class="property-plan"><svg role="group" aria-label="Storage property and unit locations"></svg></div>`;
      document.body.append(propertyPlan);
      propertyPlan.querySelector('[data-property="command"]').onclick = openDeck;
      propertyPlan.querySelector('[data-property="find"]').onclick = () => showInventory();
      const select=e=>{const id=e.target.closest('[data-plan-unit]')?.dataset.planUnit;if(id){const unit=units().find(u=>u.id===id);if(unit)showUnit(unit);}};
      propertyPlan.querySelector('svg').onclick=select;
      propertyPlan.querySelector('svg').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(e);}};
      drawPropertyPlan();
    }
    propertyPlan.hidden = false; document.body.classList.add('storewell-property-plan');
    updatePropertyPlan();
    if(selected) propertyPlan.querySelector(`[data-plan-unit="${selected.id}"]`)?.scrollIntoView?.({block:'center',inline:'center'});
  }
  function drawPropertyPlan() {
    const rows=units().map(u=>({...u,pos:app._locks[u.id].pos}));
    const walls=app._siteWalls||[],points=[...rows.map(u=>u.pos),...walls.flatMap(w=>[{x:w.x1,z:w.z1},{x:w.x2,z:w.z2}])];
    const minX=Math.min(...points.map(p=>p.x))-6,minZ=Math.min(...points.map(p=>p.z))-6;
    const width=Math.max(...points.map(p=>p.x))-minX+6,height=Math.max(...points.map(p=>p.z))-minZ+6;
    const outlines=walls.map(w=>`<path d="M${w.x1} ${w.z1}L${w.x2} ${w.z2}"/>`).join('');
    const pins=rows.map(u=>`<g class="plan-unit" role="button" tabindex="0" data-plan-unit="${escape(u.id)}"><circle cx="${u.pos.x}" cy="${u.pos.z}" r="1.35"/><text x="${u.pos.x}" y="${u.pos.z-1.9}" text-anchor="middle">${escape(u.label)}</text></g>`).join('');
    const svg=propertyPlan.querySelector('svg');svg.setAttribute('viewBox',`${minX} ${minZ} ${width} ${height}`);
    svg.innerHTML=`<rect x="${minX}" y="${minZ}" width="${width}" height="${height}" fill="#e3e5dc"/><g class="property-walls">${outlines}</g>${pins}`;
  }
  function updatePropertyPlan(){
    if(!propertyPlan||propertyPlan.hidden)return;
    for(const unit of units()){
      const pin=propertyPlan.querySelector(`[data-plan-unit="${unit.id}"]`);if(!pin)continue;
      pin.setAttribute('aria-label',`Unit ${unit.label} · ${STATUS[unit.status]?.[0]||'Unknown'}`);
      pin.classList.toggle('selected',unit.id===selectedPropertyUnit?.id);
      pin.querySelector('circle').setAttribute('fill',STATUS[unit.status]?.[1]||'#adbdca');
    }
    propertyPlan.querySelector('.property-selection').textContent=selectedPropertyUnit?`Unit ${selectedPropertyUnit.label} highlighted`:'Select a unit to view its details';
  }
  function showInventory(filter = 'all', route = false, query = '') {
    activeFilter = filter;
    const title = route ? `${STATUS[filter][0]} route` : filter === 'all' ? 'Find a storage unit' : STATUS[filter][0];
    const options = [['all','All units'], ...Object.entries(STATUS).map(([k,v])=>[k,v[0]])];
    showDialog(title, `<div class="inventory-tools"><div><label for="deck-find">Unit number</label><input id="deck-find" type="search" placeholder="Search, for example C12" autocomplete="off" value="${escape(query)}"></div><div><label for="deck-filter">Status</label><select id="deck-filter">${options.map(([k,v])=>`<option value="${k}" ${k===filter?'selected':''}>${v}</option>`).join('')}</select></div></div>${route?'<p class="muted">Choose a unit to open its marked location on the property.</p>':''}<div class="unit-grid"></div><p class="empty-message" hidden></p>`,{kind:'inventory'});
    const search = content.querySelector('input'), select = content.querySelector('select'), grid = content.querySelector('.unit-grid'), empty = content.querySelector('.empty-message');
    function draw() {
      activeFilter = select.value;
      const q = search.value.trim().replace(/[-\s]/g,'').toUpperCase();
      const rows = units().filter(u => (select.value==='all'||u.status===select.value) && u.id.includes(q));
      grid.innerHTML = rows.map(u => `<button class="unit" data-unit="${escape(u.id)}" style="--unit-color:${STATUS[u.status]?.[1] || '#adc1d2'}"><strong>${escape(u.label)}</strong><small>${escape(u.size || 'Size on file')}</small><span>${escape(STATUS[u.status]?.[0] || 'Unknown')}</span></button>`).join('');
      empty.hidden = rows.length > 0; empty.textContent = app ? 'No units match this search.' : 'Loading the property inventory…';
    }
    search.addEventListener('input', draw); select.addEventListener('change', draw);
    grid.onclick = e => { const b=e.target.closest('[data-unit]'); if(!b) return; const u=units().find(u=>u.id===b.dataset.unit); if(u) route ? startRoute(filter,u) : showUnit(u,()=>showInventory(select.value,false,search.value)); };
    draw();
  }
  async function login() {
    if(window.__swCheckLogin?.()&&app?.state.editMode)return true;
    if(!app || !window.__swLoginGate) { toast('Staff sign-in is still loading. Please try again shortly.'); return false; }
    await window.__swLoginGate(app);
    return !!window.__swCheckLogin?.();
  }
  function showUnit(unit, back) {
    const state = STATUS[unit.status] || ['Unknown'];
    showDialog(`Unit ${unit.label}`, `<p class="muted">${escape(unit.size)} · <strong>${state[0]}</strong></p><div class="dialog-actions"><button class="action-button menu-choice" id="deck-locate">${icon('route')}<span>Find on property</span></button><button class="action-button menu-choice" id="deck-edit">${icon('lock')}<span>Change status</span></button></div><div id="deck-edit-options"></div>`,{back});
    content.querySelector('#deck-locate').onclick = () => exitDeck(unit);
    content.querySelector('#deck-edit').onclick = async () => {
      if(!await login()) return;
      const slot = content.querySelector('#deck-edit-options'); if(!slot) return;
      slot.innerHTML = `<p class="muted">Select the new status for unit ${escape(unit.label)}. This updates the shared inventory.</p><div class="status-options">${Object.entries(STATUS).map(([s,[label,color]])=>`<button data-status="${s}" aria-pressed="${s===unit.status}" style="--unit-color:${color}">${label}</button>`).join('')}</div>`;
      slot.onclick = async e => {
        const button=e.target.closest('[data-status]'); if(!button || button.disabled) return;
        const status=button.dataset.status;
        if(status===app._statusOf(unit.label)) return;
        const buttons=[...slot.querySelectorAll('button')]; buttons.forEach(b=>b.disabled=true);
        const originalText=button.textContent;button.textContent='Saving…';
        const result = await app.setStatus(unit.label,status);
        button.textContent=originalText;
        if(result === false) { buttons.forEach(b=>b.disabled=false); return; }
        refresh(); showUnit({...unit,status},back);
      };
    };
  }
  let routeBanner;
  function startRoute(filter, first) {
    routeQueue = units().filter(u=>u.status===filter); routeCursor = Math.max(0,routeQueue.findIndex(u=>u.id===first.id));
    if(!routeBanner) {
      routeBanner=document.createElement('div'); routeBanner.id='sw-route-banner'; routeBanner.style.cssText='position:fixed;bottom:max(16px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);z-index:1200;display:flex;align-items:center;gap:12px;padding:12px;background:#071c2eee;border:1px solid #65bfdc;border-radius:12px;color:#e6f7ff;font:14px Arial;max-width:95%'; document.body.append(routeBanner);
    }
    const current=routeQueue[routeCursor]; if(!current) return;
    routeBanner.innerHTML=`<span>${STATUS[filter][0]} · ${escape(current.label)} · ${routeCursor+1}/${routeQueue.length}</span><button style="padding:10px" data-next>Next</button><button style="padding:10px" data-done>Done</button>`;
    routeBanner.querySelector('[data-next]').onclick=()=>{routeCursor=(routeCursor+1)%routeQueue.length;startRoute(filter,routeQueue[routeCursor]);};
    routeBanner.querySelector('[data-done]').onclick=()=>{routeBanner.remove();routeBanner=null;routeQueue=[];openDeck();};
    exitDeck(current);
  }
  function gear() {
    const name=window.__swCheckLogin?.();
    showDialog('Command menu', `<p class="menu-caption">${name ? 'Signed in as '+escape(name) : 'Staff tools'}</p><div class="dialog-actions">${[
      menuChoice('Activity log','log','clock','#c5a0ff'),menuChoice('Team','contacts','team','#65d7ef'),
      menuChoice('Staff chat','chat','chat','#67e4be'),menuChoice('My character','character','team','#e9bc69'),
      menuChoice('Player controls','controls','center','#65d7ef'),menuChoice('Rounds checklist','rounds','check','#67e4be'),
      menuChoice('Status sounds','sound','sound','#e9bc69'),menuChoice('Turn around outside','reverse','back','#65d7ef'),
      menuChoice('How to navigate','help','route','#c5a0ff'),menuChoice('Full screen','fullscreen','desk','#65d7ef'),
      menuChoice(name?'Switch staff member':'Staff sign in','login','exit','#ffaaa1')
    ].join('')}</div>`);
    content.onclick=async e=>{
      const action=e.target.closest('[data-setting]')?.dataset.setting;
      if(action==='login') { closeDialog(); if(name) window.__swLogout?.(); else await login(); }
      if(action==='contacts'||action==='log') { closeDialog(); if(await login())await window.__swOperationsOpen?.(action); }
      if(action==='chat') { closeDialog(); if(await login())app.setState({chatOpen:true}); }
      if(action==='character') { closeDialog(); window._swShowWardrobe?.(); }
      if(action==='controls'){closeDialog();window.__swGear?.();}
      if(action==='rounds'){closeDialog();if(await login())window.__swRounds?.();}
      if(action==='sound'){window.__swSoundToggle?.();closeDialog();}
      if(action==='reverse'){exitDeck();window.__swReverseWalk?.();}
      if(action==='help') { closeDialog(); window.__swShowHelp?.(); }
      if(action==='fullscreen'){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('Full screen is not available in this browser.');}}
    };
  }
  function report() {
    showDialog('Save & report', `<div class="dialog-actions"><a class="action-button menu-choice" id="deck-download">${icon('download')}<span>Download inventory</span></a><button class="action-button menu-choice" id="deck-staff-report" style="--menu-color:#e9bc69">${icon('save')}<span>Staff report</span></button></div>`);
    const rows=units(),download=content.querySelector('#deck-download');
    if(rows.length){
      const csvCell=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
      const csv=['Unit,Size,Status',...rows.map(u=>[u.label,u.size,STATUS[u.status]?.[0]||u.status].map(csvCell).join(','))].join('\r\n');
      inventoryDownloadUrl=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
      download.href=inventoryDownloadUrl;download.download='storewell-inventory-'+new Date().toISOString().slice(0,10)+'.csv';
    }else{download.textContent='Inventory is still loading';download.setAttribute('aria-disabled','true');}
    content.querySelector('#deck-staff-report').onclick=async()=>{if(await login()){closeDialog();if(window.__swSaveReport)window.__swSaveReport();else toast('The report system is still loading.');}};
  }
  async function alerts() {
    if(!('Notification' in window)) return toast('This browser does not support alerts.');
    if(!await login()) return;
    if(window.__swBellTap){window.__swBellTap();return;}
    if(window.__swTogglePush) { await window.__swTogglePush(); refresh(); return; }
    showDialog('Alerts', '<p class="muted">Use the existing notification bell in the property to enable push alerts for this device.</p><button class="action-button" id="deck-alert-property">Open property</button>');
    content.querySelector('button').onclick=()=>exitDeck();
  }
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;});
  window.addEventListener('appinstalled',()=>{installPrompt=null;toast('StoreWell is installed.');});
  async function install(){
    if(installPrompt){await installPrompt.prompt();installPrompt=null;return;}
    showDialog('Install StoreWell', '<p class="muted">On Android or Chrome, open the browser menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>. On iPhone or iPad, use <strong>Share → Add to Home Screen</strong>.</p><p class="muted">If StoreWell is already installed, open it from your home screen.</p>');
  }
  screen.addEventListener('click', e => {
    const action=e.target.closest('[data-action]')?.dataset.action;if(!action)return;
    content.onclick=null;
    if(action==='find'||action==='all')return showInventory();
    if(STATUS[action])return showInventory(action);
    if(action.startsWith('route-')){const status=action.slice(6);if(app?._webglAvailable && window.__swRouteStatus){exitDeck();window.__swRouteStatus(status);}else showInventory(status,true);return;}
    ({exit:exitDeck,gear,report,alerts,install}[action])?.();
  });
  function refresh() {
    app=window.__swApp;
    window.__swCommandCenter=openDeck; window.__swPanelOpen=openDeck; window.__swGoCommand=openDeck;
    if(!app?._locks) return;
    if(!appLoginStarted && window.__swLoginGate){appLoginStarted=true;login().catch(()=>toast('Sign-in could not connect. Please try again.'));}
    if(window.__swDeckVisible && !window.__swCheckLogin?.())exitDeck();
    if(!window.__swDeckVisible && app._webglAvailable===false && Object.keys(app._locks).length) {
      if(!propertyPlan||propertyPlan.hidden)showPropertyPlan();else updatePropertyPlan();
    }
    const list=units(),counts={all:list.length};for(const u of list)counts[u.status]=(counts[u.status]||0)+1;
    screen.querySelectorAll('[data-count]').forEach(el=>el.textContent=String(counts[el.dataset.count]||0));
    const connection=screen.querySelector('.connection');connection.textContent=live?'Shared inventory connected':'Saved inventory · reconnecting';connection.classList.toggle('live',live);
    screen.querySelector('.alerts-label').textContent=window._swBellOn?'Alerts on':'Alerts';
    bridge?.refresh();
    if(!dialog.hidden && content.querySelector('.unit-grid') && !content.querySelector('.unit')) content.querySelector('input')?.dispatchEvent(new Event('input'));
  }
  async function syncHealth() {
    try {
      const response=await fetch('https://storewell-3d-default-rtdb.firebaseio.com/lockOverrides.json',{signal:AbortSignal.timeout(10000)});
      if(!response.ok)throw new Error('Inventory unavailable');
      const data=await response.json();
      if(app){const merged={...(data||{})};for(const [k,v]of Object.entries(app._pendingWrites||{}))if(Date.now()-v.t<10000)merged[k]=v.st;app._overrides=merged;app._repaintFromOverrides?.();}
      live=true;lastSync=Date.now();
    }catch{live=false;}
    refresh();
  }
  function setupRoom() {
    try { bridge=window.__swCreateBridge({deck,screen,units,status:STATUS,escape,showUnit,showDialog,content,login,gear,alerts,report,exit:exitDeck}); }
    catch(error){ console.warn('Room rendering unavailable',error);deck.classList.add('is-fallback');deck.querySelector('.mobile-dock').append(screen);toast('The room could not load. The main controls remain available.'); }
  }
  function setView(next) { if(next==='exit')exitDeck();else bridge?.setView(next); }
  deck.querySelector('.bridge-nav').onclick=e=>{const next=e.target.closest('[data-view]')?.dataset.view;if(next)setView(next);};
  window.addEventListener('online',syncHealth);
  window.addEventListener('offline',()=>{live=false;refresh();});
  setInterval(refresh,1000);setInterval(syncHealth,15000);
  refresh();syncHealth();
})();
