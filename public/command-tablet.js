/* StoreWell pocket command tablet. Outdoor model and saved records stay authoritative. */
(()=>{
  'use strict';
  const STATUS=window.StoreWellLockUI.statuses;
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
    hand: '<path d="M8 13V5a2 2 0 0 1 4 0v7-4a2 2 0 0 1 4 0v4-2a2 2 0 0 1 4 0v6c0 4-3 6-7 6h-1c-2 0-3-1-4-3l-4-5a2 2 0 0 1 3-3l1 2Z"/>',
    back: '<path d="m10 5-7 7 7 7M3 12h18"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.units}</svg>`;
  const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tablet=document.createElement('section');tablet.id='sw-tablet';tablet.hidden=true;
  tablet.setAttribute('role','dialog');tablet.setAttribute('aria-modal','true');tablet.setAttribute('aria-label','StoreWell command tablet');
  tablet.innerHTML=`<div class="tablet-device"><div class="tablet-case-details" aria-hidden="true" inert><i class="tablet-case-grip left"></i><i class="tablet-case-grip right"></i><i class="tablet-case-corner tl"></i><i class="tablet-case-corner tr"></i><i class="tablet-case-corner bl"></i><i class="tablet-case-corner br"></i><i class="tablet-case-speaker left"></i><i class="tablet-case-speaker right"></i><span class="tablet-case-mark">STOREWELL</span><i class="tablet-case-port"></i></div><div class="tablet-case-keys"><button class="tablet-case-key" data-action="case-sounds" aria-label="Status sounds" aria-pressed="true" title="Toggle status sounds"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3ZM16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg><span>SOUND</span></button><button class="tablet-case-key" data-action="exit" aria-label="Put away using tablet edge button" title="Put tablet away"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v9M7 5a9 9 0 1 0 10 0"/></svg><span>STOW</span></button></div><div class="tablet-hardware" aria-hidden="true"><i></i><span>STOREWELL</span><b>FIELD COMMAND</b></div><div class="tablet-glass">
    <header class="tablet-header"><button class="tablet-brand" data-nav="home" aria-label="StoreWell overview"><span class="tablet-emblem">${icon('units')}</span><span><strong>StoreWell</strong><small>FIELD COMMAND</small></span></button><div class="tablet-session"><span data-staff></span><small data-clock></small></div><button class="put-away" data-action="exit" aria-label="Put tablet away and return outside">${icon('exit')}<span>Outside</span></button></header>
    <div class="tablet-strip"><span class="tablet-connection" role="status">Connecting…</span><span>PROPERTY OPERATIONS</span></div>
    <nav class="tablet-nav" aria-label="Command tablet screens">${[['action','bell','Action required'],['locks','lock','All locks'],['route','route','Route'],['history','clock','Lock History'],['team','team','Team'],['more','gear','Control']].map(([key,sym,label])=>`<button data-nav="${key}" aria-controls="tablet-page" aria-pressed="false">${icon(sym)}<span>${label}</span>${key==='action'?'<b data-action-count aria-label="Locks requiring action">0</b>':''}</button>`).join('')}</nav>
    <main class="tablet-page" id="tablet-page"></main>${window.StoreWellLockUI.legend()}
    <footer class="tablet-bottom"><span>${icon('lock')}<b>STOREWELL</b> FIELD CONTROL</span><div><button id="sw-tablet-notifications" data-action="alerts" title="Subscribe to push notifications or choose alerts for this device">${icon('bell')}Notifications</button><button data-action="reports">${icon('save')}Save & reports</button><button data-action="history">${icon('clock')}Full history</button></div></footer>
    <div class="tablet-toast" role="status" hidden></div></div><div class="tablet-home-bar" aria-hidden="true"></div></div>`;
  document.body.append(tablet);
  const hands=window.StoreWellTabletHands?.mount(tablet);
  const page=tablet.querySelector('main');
  const lockChoices=window.StoreWellLockUI.choices(page);
const boardZoom=window.StoreWellLockUI.zoomBoard(page,{reflow:lockChoices.reflow});
  let parkedTool=null,toolObserver;
  let app,screen='home',live=false,appLoginStarted=false,propertyPlan,selectedPropertyUnit,toastTimer;
  let filter='all',query='',lockView='board',selectedUnit=null,routeCursor=0,historyRecords={},historyState='Connecting to saved history…',unsubscribe,historyDownloadUrl,inventoryDownloadUrl,installPrompt,refreshScreen,priorFocus;
  let lastLockSnapshot='';
  window.__swDeckVisible=false;
  const norm=s=>String(s??'').replace(/[-\s]/g,'').toUpperCase();
  const units=()=>Object.entries(app?._locks||{}).map(([id,r])=>({id,label:r.label,size:app._sizeOf(r.label),status:app._statusOf(r.label),pos:r.pos,face:r.face}));
  const ordered=()=>{const byId=new Map(units().map(u=>[u.id,u]));return (window.__swPropertyRoute?.ordered(app)||[...byId.keys()]).map(id=>byId.get(id)).filter(Boolean);};
  const match=u=>(filter==='all'||filter==='action'&&['flashred','flashgreen'].includes(u.status)||u.status===filter)&&(!query||norm(u.label).includes(norm(query)));
  const status=s=>STATUS[s]?.[0]||s||'Unknown';
  const button=(label,action,sym='units',color='blue')=>`<button class="tablet-button ${color}" data-action="${action}">${icon(sym)}<span>${label}</span></button>`;
  function toast(message){const el=tablet.querySelector('.tablet-toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,6000);}
  function releaseDownloads(){for(const url of [historyDownloadUrl,inventoryDownloadUrl])if(url)setTimeout(()=>URL.revokeObjectURL(url),60000);historyDownloadUrl=inventoryDownloadUrl=null;}
  function title(eyebrow,heading,subtitle=''){return `<header class="page-heading"><div><p>${eyebrow}</p><h1 tabindex="-1">${heading}</h1>${subtitle?`<span>${subtitle}</span>`:''}</div></header>`;}
  function syncCaseSound(){tablet.querySelector('[data-action="case-sounds"]').setAttribute('aria-pressed',String(window._swSoundOn!==false));}
  function nav(key){syncCaseSound();tablet.querySelectorAll('[data-nav]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.nav===key));b.classList.toggle('active',b.dataset.nav===key);});}
  function parkTool(){toolObserver?.disconnect();toolObserver=null;if(parkedTool){document.body.append(parkedTool);parkedTool.style.display='none';parkedTool=null;}}
  function show(key,html){lockChoices.close(false);parkTool();releaseDownloads();refreshScreen=null;screen=key;page.dataset.screen=key;nav(key==='reports'?'more':key);page.innerHTML=html;boardZoom.refresh();page.scrollTop=0;page.querySelector('h1')?.focus({preventScroll:true});}
  async function login(){if(window.__swCheckLogin?.()&&app?.state.editMode)return true;if(!app||!window.__swLoginGate)return false;try{await window.__swLoginGate(app);return !!window.__swCheckLogin?.();}catch(e){toast(e.message||'Staff sign-in could not connect.');return false;}}
  async function openTablet(next='locks'){
    if(!await login())return false;
    priorFocus=document.activeElement;tablet.hidden=false;window.__swDeckVisible=true;document.body.classList.add('storewell-deck-open');
    if(propertyPlan){propertyPlan.inert=true;propertyPlan.setAttribute('aria-hidden','true');}
    const outsideRoot=document.getElementById('dc-root');if(outsideRoot)outsideRoot.inert=true;
    app.keys={};app._kt={};app._tk={};app._talt={};app._dragging=false;
    app.setState({showSearch:false,showInv:false,pickUnit:null,chatOpen:false,helpClosed:true});
    document.getElementById('sw-dashboard')?.remove();document.getElementById('sw-drop-menu')?.remove();
    for(const id of ['sw-sens-panel','sw-sens-ctrl']){const el=document.getElementById(id);if(el)el.style.display='none';}
    navigate(typeof next==='string'?next:'locks');hands?.open();watchHistory();refresh();return true;
  }
  function closeTablet(unit){
    lockChoices.close(false);
    parkTool();hands?.close();tablet.hidden=true;window.__swDeckVisible=false;document.body.classList.remove('storewell-deck-open');releaseDownloads();
    if(propertyPlan){propertyPlan.inert=false;propertyPlan.removeAttribute('aria-hidden');}
    const outsideRoot=document.getElementById('dc-root');if(outsideRoot)outsideRoot.inert=false;
    unsubscribe?.();unsubscribe=null;
    for(const id of ['sw-cmd-panel','sw-save-report-modal','sw-help-modal','sw-wardrobe','sw-rounds-modal','sw-hist-panel','sw-pref-panel','sw-rpm'])document.getElementById(id)?.remove();
    if(app){app.keys={};app._kt={};app._tk={};app._talt={};app.setState({chatOpen:false});if(unit){app.locate(unit.id);app.setState({showSearch:false,pickUnit:null});}if(app._webglAvailable===false)showPropertyPlan(unit);}
    priorFocus?.focus?.({preventScroll:true});window.dispatchEvent(new Event('resize'));
  }
  function navigate(key){({home:home,action:()=>{filter='action';query='';lockView='board';showLocks();},locks:showLocks,route:showRoute,history:showHistory,team:()=>openTool('Your team',()=>window.__swOperationsOpen?.('contacts'),'#sw-cmd-panel'),more:more,reports:reports}[key]||home)();}
  function home(){
    const counts={all:units().length};for(const u of units())counts[u.status]=(counts[u.status]||0)+1;
    const need=(counts.flashred||0)+(counts.flashgreen||0);
    show('home',title('YOUR PROPERTY, AT A GLANCE','Ready for your rounds.',`Welcome, ${escape(window.__swCheckLogin?.()||'staff')}. Everything you need is right here.`)+`
      <div class="overview-layout"><div><div class="action-hero"><div class="hero-icon">${icon('lock')}</div><div><p>ACTION REQUIRED</p><h2><b data-total-action>${need}</b> locks need attention</h2><span>Lock It and Lock Off requests, together.</span></div><button data-action="action">Review locks ${icon('back')}</button></div>
      <div class="metric-grid">${[['all','All units','units'],['green','Rented','check'],['red','Late','lock'],['flashred','Lock It','lock'],['flashgreen','Lock Off','unlock'],['purple','Ready to Rent','star'],['blue','Reserved','clock'],['yellow','Rented · No Lock','unlock'],['white','Empty','units'],['black','Not rentable','tool']].map(([key,label,sym])=>`<button class="metric ${key==='all'?'':'metric-lock'}" data-filter-open="${key}" aria-label="${label} · ${counts[key]||0} units" style="--metric:${STATUS[key]?.[1]||'#75dfff'}">${key==='all'?`<span class="metric-icon">${icon(sym)}</span><b data-count="all">${counts.all}</b><span>All units</span>`:window.StoreWellLockUI.disc(counts[key]||0,key).replace('<strong>',`<strong data-count="${key}">`)}</button>`).join('')}</div></div>
      <aside class="overview-aside"><button class="route-promo" data-action="route"><div class="route-mini" aria-hidden="true"><span>GATE</span><i></i><b>C2</b><i></i><b>C3</b>${icon('route')}</div><p>START AT THE FRONT</p><h2>Your property.<br>Your walking route.</h2><span>Enter the open main gate. Begin at C2 on the building’s right side.</span><strong>Open route ${icon('back')}</strong></button>
      <div class="quick-tools"><h3>Within reach</h3>${button('Complete lock history','history','clock','purple')}${button('Save & reports','reports','save')}${button('Push & email','team','bell','teal')}</div></aside></div>
      <div class="tablet-footnote">${icon('check')} All ${counts.all} units · Shared statuses and complete saved history</div>`);
    refreshScreen=()=>{const c={all:units().length};units().forEach(u=>c[u.status]=(c[u.status]||0)+1);page.querySelectorAll('[data-count]').forEach(el=>{el.textContent=c[el.dataset.count]||0;el.closest('[data-filter-open]')?.setAttribute('aria-label',`${el.dataset.count==='all'?'All units':status(el.dataset.count)} · ${c[el.dataset.count]||0} units`);});page.querySelector('[data-total-action]').textContent=(c.flashred||0)+(c.flashgreen||0);};
  }
  function lockToolbar(){return `<div class="lock-toolbar"><label class="search-field">${icon('search')}<input aria-label="Search unit number" id="tablet-search" type="search" autocomplete="off" placeholder="Find a unit…" value="${escape(query)}"></label>${window.StoreWellLockUI.statusFilter(filter,'tablet-filter')}</div>`;}
  function bindFilters(draw){page.querySelector('#tablet-search').oninput=e=>{query=e.target.value;draw();};window.StoreWellLockUI.bindStatusFilter(page,{id:'tablet-filter',get:()=>filter,set:value=>{filter=value;draw();}});}
  function unitCard(u,index){const location=window.__swPropertyRoute.sectionFor(app,u);return `<button class="unit-card" data-unit="${u.id}" aria-label="Unit ${escape(u.label)} · ${escape(status(u.status))} · Route stop ${index+1}">${window.StoreWellLockUI.disc(u.label,u.status)}<span class="unit-copy"><small>Stop ${index+1}</small><span>${escape(location.name)}</span><small>${escape(u.size)}</small></span>${icon('back')}</button>`;}
  function lockTile(u,index,location){return `<button class="lock-tile" data-unit="${u.id}" data-lock-status="${u.status}" style="--status:${STATUS[u.status]?.[1]||'#a8b7c6'}" aria-label="Unit ${escape(u.label)} · ${escape(status(u.status))} · Route stop ${index+1} · ${escape(location.side)}">${window.StoreWellLockUI.disc(u.label,u.status)}<small class="lock-tile-stop">${String(index+1).padStart(2,'0')}</small></button>`;}
  function lockBoard(rows){
    const route=ordered(),groups=[];
    for(const u of rows){const location=window.__swPropertyRoute.sectionFor(app,u),index=route.findIndex(r=>r.id===u.id);let group=groups.at(-1);if(!group||group.id!==location.id){group={...location,stops:[]};groups.push(group);}group.stops.push({u,index,location});}
    return `<div class="lock-board"><div class="board-caption"><span>${icon('units')}BUILDING LOCKS</span><span>IN WALKING ORDER ${icon('route')}</span></div>${groups.map(g=>`<section class="lock-bank" aria-label="${escape(g.name)}"><header><div><h2>${escape(g.name)}</h2><p>${[...new Set(g.stops.map(s=>s.location.side))].map(escape).join(' → ')}</p></div><span>Stops ${g.stops[0].index+1}${g.stops.length>1?'–'+(g.stops.at(-1).index+1):''}</span></header><div class="lock-tile-grid">${g.stops.map(({u,index,location})=>lockTile(u,index,location)).join('')}</div></section>`).join('')||'<div class="empty-state"><strong>No locks match this view.</strong><p>Try another unit or status.</p><button class="tablet-button" data-action="all-locks">Show all locks</button></div>'}</div>`;
  }
  function showLocks(){page.dataset.lockView=lockView;
    show('locks',title('PROPERTY LOCK CONTROL',filter==='action'?'Action required':'All locks')+`<div class="board-route-start"><span>${icon('route')}</span><div><strong>Open main gate → C2 → C3</strong><small>Enter at the front-right gate. Start on the right side of the front building.</small></div><button data-action="route">Walk route ${icon('back')}</button></div>`+lockToolbar()+`<div class="view-switch"><div role="group" aria-label="Lock layout"><button data-layout="board" aria-pressed="${lockView==='board'}">${icon('lock')}Lock board</button><button data-layout="map" aria-pressed="${lockView==='map'}">${icon('units')}Property map</button><button data-layout="list" aria-pressed="${lockView==='list'}">${icon('route')}Route list</button></div><span data-match-count></span></div>${window.StoreWellLockUI.zoomButtons()}<div id="tablet-locks"></div>`);
    page.querySelectorAll('[data-layout]').forEach(b=>b.onclick=()=>{lockView=b.dataset.layout;showLocks();});
    bindFilters(drawLocks);drawLocks();refreshScreen=refreshLocks;
  }
  function refreshLocks(){
    if(lockView==='map'&&!query)page.querySelectorAll('[data-map-unit]').forEach(b=>{const u=units().find(u=>u.id===b.dataset.mapUnit);if(!u)return;if(b.dataset.lockStatus!==u.status)window.StoreWellLockUI.paintMapPin(b,u.label,u.status);b.classList.toggle('map-muted',!match(u));});
    else if(lastLockSnapshot!==lockSnapshot())drawLocks();
    const el=page.querySelector('[data-match-count]');if(el)el.textContent=units().filter(match).length+' locks';
  }
  const lockSnapshot=()=>JSON.stringify([filter,query,lockView,units().map(u=>[u.id,u.status])]);
  function drawLocks(){
    lockChoices.close(false);
    const slot=page.querySelector('#tablet-locks'),rows=ordered().filter(match);if(!slot)return;
    lastLockSnapshot=lockSnapshot();
    nav(filter==='action'?'action':'locks');
    page.querySelector('.page-heading h1').textContent=filter==='action'?'Action required':'All locks';
    page.querySelector('[data-match-count]').textContent=rows.length+' locks';
    if(lockView==='board'){slot.innerHTML=lockBoard(rows);return;}
    if(lockView==='list'||query){slot.innerHTML=`<p class="route-caption">${icon('route')} Gate → C2 → follow the property lanes</p><div class="unit-list">${rows.map(u=>unitCard(u,ordered().findIndex(r=>r.id===u.id))).join('')||'<p class="empty-state">No locks match. Try another unit or status.</p>'}</div>`;return;}
    slot.innerHTML=`<div class="map-controls"><div><button data-map-zone="front">Front / gate</button><button data-map-zone="middle">Middle</button><button data-map-zone="back">Back rows</button></div><div><button data-zoom="out" aria-label="Zoom map out">−</button><span data-map-scale>100%</span><button data-zoom="in" aria-label="Zoom map in">+</button></div></div><div class="property-map-scroll" tabindex="0" aria-label="Property map. Scroll to move, pinch or use plus and minus to zoom."><div class="property-map-canvas"></div></div><p class="map-note">${icon('route')} Front gate at the bottom · Tap any colored lock · Drag to move / pinch to zoom</p>`;
    const scroller=slot.querySelector('.property-map-scroll'),canvas=slot.querySelector('.property-map-canvas');let zoom=1;
    canvas.innerHTML=mapSvg();
    const setZoom=(value)=>{const old=zoom;zoom=Math.max(.65,Math.min(4.5,value));canvas.style.width=720*zoom+'px';scroller.scrollLeft=(scroller.scrollLeft+scroller.clientWidth/2)*zoom/old-scroller.clientWidth/2;scroller.scrollTop=(scroller.scrollTop+scroller.clientHeight/2)*zoom/old-scroller.clientHeight/2;slot.querySelector('[data-map-scale]').textContent=Math.round(zoom*100)+'%';};
    slot.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>setZoom(zoom*(b.dataset.zoom==='in'?1.25:.8)));
    slot.querySelectorAll('[data-map-zone]').forEach(b=>b.onclick=()=>{scroller.scrollTop={front:scroller.scrollHeight,middle:scroller.scrollHeight*.44,back:0}[b.dataset.mapZone];});
    window.StoreWellLockUI.pinchZoom(scroller,{get:()=>zoom,set:setZoom});
    let pan;
    scroller.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('[data-map-unit]'))return;pan={x:e.clientX,y:e.clientY,left:scroller.scrollLeft,top:scroller.scrollTop};scroller.setPointerCapture(e.pointerId);scroller.style.cursor='grabbing';e.preventDefault();});
    scroller.addEventListener('pointermove',e=>{if(pan){scroller.scrollLeft=pan.left+pan.x-e.clientX;scroller.scrollTop=pan.top+pan.y-e.clientY;}});
    const endPan=()=>{pan=null;scroller.style.cursor='';};scroller.addEventListener('pointerup',endPan);scroller.addEventListener('pointercancel',endPan);
    requestAnimationFrame(()=>{scroller.scrollTop=scroller.scrollHeight;scroller.scrollLeft=(scroller.scrollWidth-scroller.clientWidth)*.58;});refreshLocks();
  }
  function mapSvg(){
    const buildingRects=(app.solids||[]).map(s=>`<rect x="${s.x0}" y="${s.z0}" width="${s.x1-s.x0}" height="${s.z1-s.z0}" rx=".7"/>`).join('');
    const all=units(),pins=all.map(u=>{const horizontal=['N','S'].includes(u.face),axis=horizontal?'x':'z',fixed=horizontal?'z':'x',near=all.filter(v=>v.id!==u.id&&v.face===u.face&&Math.abs(v.pos[fixed]-u.pos[fixed])<.5),gap=Math.min(Infinity,...near.map(v=>Math.abs(v.pos[axis]-u.pos[axis])));return `<g role="button" tabindex="0" data-map-unit="${u.id}" data-lock-status="${u.status}" aria-label="Unit ${escape(u.label)} · ${escape(status(u.status))}">${window.StoreWellLockUI.mapDisc(u.label,u.status,{x:u.pos.x,y:u.pos.z,diameter:Math.min(3.5,gap*.84)})}</g>`;}).join('');
    return `<svg viewBox="-45 -219 108 246" aria-label="StoreWell property lock map" role="group"><defs><pattern id="map-grid" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" fill="none" stroke="#64c9ed" stroke-opacity=".17" stroke-width=".12"/></pattern></defs><rect x="-45" y="-219" width="108" height="246" fill="#082437" fill-opacity=".72"/><rect x="-45" y="-219" width="108" height="246" fill="url(#map-grid)"/><path d="M-40 13V-212H47V-5M20 13H36M-40 13H-10" class="map-fence"/><g class="map-buildings">${buildingRects}</g><text class="map-area-label" x="3" y="-210" text-anchor="middle">BACK OF PROPERTY</text><text class="map-area-label" x="0" y="2" text-anchor="middle">FRONT BUILDING</text><text class="map-area-label" x="45" y="5" text-anchor="middle">OFFICE</text><path d="M15 21V15Q15 10 12 10" class="map-start-path"/><text class="map-gate-label" x="16" y="24" text-anchor="middle">OPEN MAIN GATE</text><text class="map-start-label" x="24" y="10">START · C2</text>${pins}</svg>`;
  }
  function showRoute(){page.dataset.lockView='board';
    show('route',title('WALK THE PROPERTY','Your lock route.','Start at C2, just inside the open front gate on the right side of the front building.')+lockToolbar()+`<div class="route-summary"><span>${icon('route')} Ordered along the property’s walking lanes</span><button data-action="property-map">View property map</button></div><div id="route-stop"></div>${window.StoreWellLockUI.zoomButtons()}<div class="route-steps lock-tile-grid lock-board"></div>`);
    const draw=()=>{lockChoices.close(false);const rows=ordered().filter(match);routeCursor=Math.max(0,Math.min(routeCursor,rows.length-1));const u=rows[routeCursor];page.querySelector('#route-stop').innerHTML=u?`<div class="current-stop"><button class="route-current-lock" data-unit="${u.id}" aria-label="Unit ${escape(u.label)} · ${escape(status(u.status))} · Change status">${window.StoreWellLockUI.disc(u.label,u.status)}</button><div><p>STOP ${routeCursor+1} OF ${rows.length}</p><h2>${escape(window.__swPropertyRoute.sectionFor(app,u).name)}</h2><span>${escape(u.size)}</span></div><div>${button('Open lock controls','route-unit','lock')}${button('Find outside','route-outside','route','teal')}</div></div><div class="route-step-controls"><button data-route-step="-1" ${routeCursor===0?'disabled':''}>${icon('back')}Previous</button><span>${routeCursor+1} / ${rows.length}</span><button data-route-step="1" ${routeCursor===rows.length-1?'disabled':''}>Next lock ${icon('back')}</button></div>`:'<p class="empty-state">No locks match this route.</p>';
      page.querySelector('.route-steps').innerHTML=rows.map((r,i)=>`<button class="route-step lock-tile ${i===routeCursor?'current':''}" data-route-index="${i}" aria-label="Route stop ${i+1} · Unit ${escape(r.label)} · ${escape(status(r.status))}">${window.StoreWellLockUI.disc(r.label,r.status)}<small class="lock-tile-stop">${i+1}</small></button>`).join('');
      page.querySelectorAll('[data-route-step]').forEach(b=>b.onclick=()=>{routeCursor+=Number(b.dataset.routeStep);draw();});page.querySelectorAll('[data-route-index]').forEach(b=>b.onclick=()=>{routeCursor=Number(b.dataset.routeIndex);draw();page.querySelector('#route-stop').scrollIntoView?.({block:'nearest'});});
      if(u){page.querySelector('[data-action="route-unit"]').onclick=e=>{e.stopPropagation();showUnit(u,e.currentTarget);};page.querySelector('[data-action="route-outside"]').onclick=e=>{e.stopPropagation();closeTablet(u);};}
    };bindFilters(()=>{routeCursor=0;draw();});draw();refreshScreen=draw;
  }
  function showUnit(unit,anchor){
    selectedUnit=unit.id;const current=units().find(u=>u.id===unit.id)||unit;
    anchor=anchor||page.querySelector(`[data-unit="${current.id}"],[data-map-unit="${current.id}"],[data-round-unit="${current.id}"]`);
    lockChoices.open({unit:current,anchor,
      onChange:async next=>{if(!await login())throw new Error('Sign in to save this change.');return app.setStatus(current.label,next);},
      onSaved:next=>{if(anchor?.hasAttribute('data-round-unit'))action('rounds').catch(error=>toast(error.message));else refreshScreen?.();page.querySelector(`[data-unit="${current.id}"],[data-map-unit="${current.id}"],[data-round-unit="${current.id}"]`)?.focus({preventScroll:true});toast(`${current.label} · ${status(next)} — saved to inventory and lock history.`);},
      actions:[{id:'unit-history',label:'Lock history',run:()=>showHistory(current.label)},{id:'locate',label:'Find outside',run:()=>closeTablet(current)}]
    });
  }
  function sortedHistory(){return Object.entries(historyRecords).filter(([,r])=>r&&typeof r==='object').map(([id,r])=>({id,...r}));}
  const dateText=r=>Number(r.t)>=86400000?new Date(Number(r.t)).toLocaleString('en-US',{timeZone:'America/Chicago',month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'}):'Unverified date · original timestamp '+String(r.t??'not recorded');
  function historyRows(rows){return rows.map(r=>['email','login'].includes(r.type)?`<article class="history-row"><span class="history-icon">${icon(r.type==='email'?'chat':'team')}</span><div><strong>${escape(r.label||r.type)}</strong><p>${escape(status(r.from))} → ${escape(status(r.to||r.status))}</p><small>${escape(r.who||r.staff||'Staff')} · ${escape(dateText(r))} CT</small></div></article>`:`<article class="history-row history-lock-row" data-history-record="${escape(r.id)}">${window.StoreWellLockUI.transition(r.label||r.unit||'—',r.from,r.to||r.status)}<small>${escape(r.who||r.staff||'Staff')} · ${escape(dateText(r))} CT</small></article>`).join('')||'<p class="empty-state">No saved changes match.</p>';}
  function showHistory(unitQuery=''){
    show('history',title('THE COMPLETE RECORD','Lock history.','Every saved change, from the beginning. Dates shown in Central time.')+`<div class="history-tools"><label><span>Unit or staff</span><input data-history-search type="search" placeholder="Search saved history…" value="${escape(unitQuery)}"></label><div class="history-order" role="group" aria-label="History order"><button data-history-order="newest" aria-pressed="true">Newest first</button><button data-history-order="oldest" aria-pressed="false">From day one</button></div><div class="history-order" role="group" aria-label="Activity"><button data-history-type="locks" aria-pressed="true">Lock changes</button><button data-history-type="all" aria-pressed="false">All activity</button></div></div><div class="history-summary"><span data-history-state role="status"></span><button data-action="refresh-history">${icon('center')}Refresh</button><a data-history-backup>${icon('download')}Full backup</a></div><p data-history-count class="muted"></p><div data-history-list></div>`);
    page.querySelector('[data-history-search]').addEventListener('input',drawHistory);
    for(const attr of ['data-history-order','data-history-type'])page.querySelectorAll('['+attr+']').forEach(b=>b.addEventListener('click',()=>{page.querySelectorAll('['+attr+']').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));drawHistory();}));
    drawHistory();watchHistory();
  }
  function drawHistory(){
    const target=page.querySelector('[data-history-list]');if(!target)return;
    const q=norm(page.querySelector('[data-history-search]').value),all=page.querySelector('[data-history-type=all]').getAttribute('aria-pressed')==='true',oldest=page.querySelector('[data-history-order=oldest]').getAttribute('aria-pressed')==='true';
    const records=sortedHistory(),rows=records.filter(r=>(all||!['email','login'].includes(r.type)&&(r.label||r.unit))&&norm((r.label||r.unit||'')+' '+(r.who||r.staff||'')).includes(q));
    rows.sort((a,b)=>{const da=+a.t>=86400000,db=+b.t>=86400000;return da!==db?da?-1:1:oldest?(+a.t||0)-(+b.t||0):(+b.t||0)-(+a.t||0);});
    target.innerHTML=historyRows(rows);page.querySelector('[data-history-count]').textContent=`${rows.length} matching records · ${records.length} total saved activity records · ${oldest?'Oldest':'Newest'} first`;
    page.querySelector('[data-history-state]').textContent=historyState;
    const a=page.querySelector('[data-history-backup]');if(historyDownloadUrl)URL.revokeObjectURL(historyDownloadUrl);
    if(records.length){historyDownloadUrl=URL.createObjectURL(new Blob([JSON.stringify({exportedAt:new Date().toISOString(),recordCount:records.length,records:historyRecords},null,2)],{type:'application/json'}));a.href=historyDownloadUrl;a.download='storewell-complete-history-'+new Date().toISOString().slice(0,10)+'.json';a.removeAttribute('aria-disabled');}else{a.removeAttribute('href');a.setAttribute('aria-disabled','true');}
  }
  function watchHistory(retry=false){
    if(unsubscribe&&!retry)return;if(!window.__swCheckLogin?.()||!window._swAuth?.currentUser||!window._swOnValue)return;
    unsubscribe?.();historyState='Loading complete history…';drawHistory();
    unsubscribe=window._swOnValue(window._swRef(window._swDB,'lockLog'),snapshot=>{historyRecords=snapshot.val()||{};historyState='Complete saved history connected';drawHistory();},()=>{unsubscribe=null;historyState='History could not connect. Select Refresh to retry.';drawHistory();});
  }
  async function openTool(heading,launch,selector){
    show(heading==='Your team'?'team':'more',title('STAFF TOOLS',heading)+`<div class="tablet-tool-host"><p class="muted">Loading…</p></div>`);
    const host=page.querySelector('.tablet-tool-host');
    try{await launch();const panel=document.querySelector(selector);if(!host.isConnected){if(panel&&selector!=='#sw-sens-panel')panel.remove();return;}if(!panel){host.innerHTML='<p class="empty-state">This tool could not open. Please retry from the menu.</p>';return;}if(selector==='#sw-sens-panel')parkedTool=panel;host.replaceChildren(panel);panel.classList.add('tablet-embedded');panel.querySelectorAll('[data-round-unit]').forEach(b=>{const u=units().find(r=>norm(r.id)===norm(b.dataset.roundUnit));if(u){b.classList.add('round-lock');b.removeAttribute('style');b.setAttribute('aria-label',`Unit ${u.label} · ${status(u.status)} · Change status`);b.innerHTML=window.StoreWellLockUI.disc(u.label,u.status);}});toolObserver=new MutationObserver(()=>{if(host.isConnected&&!host.contains(panel)){toolObserver?.disconnect();more();}});toolObserver.observe(host,{childList:true});if(heading==='Your team'){panel.querySelector('.sw-operations-tabs')?.remove();panel.querySelector('#sw-tab-control > div:first-child')?.remove();}for(const close of panel.querySelectorAll('#sw-panel-close,#sw-operations-close'))close.onclick=()=>more();const reportButton=panel.querySelector('#sw-send-report');if(reportButton)reportButton.onclick=()=>action('staff-report');}catch(e){if(host.isConnected)host.textContent=e.message||'This tool could not connect. Please retry.';}
  }
  function reports(){
    show('reports',title('RECORDS & DELIVERY','Save & reports.','Export your inventory, keep a full history backup, or send the regular staff report.')+`<div class="tool-grid"><a class="tool-card" data-inventory-download>${icon('download')}<h2>Inventory CSV</h2><p>Every unit, size and current status.</p><strong>Download inventory</strong></a><button class="tool-card purple" data-action="history">${icon('clock')}<h2>Complete history</h2><p>Open the original records and download a full backup.</p><strong>View saved history</strong></button><button class="tool-card teal" data-action="staff-report">${icon('save')}<h2>Staff report</h2><p>Review your report and its delivery options.</p><strong>Prepare report</strong></button></div>`);
    const cell=v=>'"'+String(v??'').replace(/"/g,'""')+'"';const csv=['Unit,Size,Status',...ordered().map(u=>[u.label,u.size,status(u.status)].map(cell).join(','))].join('\r\n');inventoryDownloadUrl=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=page.querySelector('[data-inventory-download]');a.href=inventoryDownloadUrl;a.download='storewell-inventory-'+new Date().toISOString().slice(0,10)+'.csv';
  }
  function showChat(){
    show('more',title('STAFF CONVERSATION','Team chat.','Shared with Kevin, Mike and Brad.')+`<div class="chat-toolbar"><span data-chat-state role="status">Loading saved conversation…</span><button class="tablet-button" data-chat-refresh>Refresh</button></div><div class="tablet-chat-messages" aria-live="polite"></div><form class="tablet-chat-compose"><label for="tablet-chat-draft">Message</label><textarea id="tablet-chat-draft" maxlength="2000" rows="3" placeholder="Write to your team…" required></textarea><button class="tablet-button" type="submit">${icon('chat')}Send message</button></form>`);
    const list=page.querySelector('.tablet-chat-messages'),state=page.querySelector('[data-chat-state]'),form=page.querySelector('form'),draft=page.querySelector('textarea');let readAt=0,sending=false,pendingId=null,pendingText='';
    const load=async()=>{readAt=Date.now();try{const messages=await window.__swChatRead();if(!list.isConnected)return;list.innerHTML=messages.map(m=>`<article class="chat-message"><header><strong>${escape(m.name)}</strong><small>${escape(dateText(m))} CT</small></header><p>${escape(m.text)}</p></article>`).join('')||'<p class="empty-state">No saved messages yet.</p>';state.textContent='Saved conversation connected';}catch(e){if(state.isConnected)state.textContent=e.message||'Chat could not connect. Select Refresh to retry.';}};
    page.querySelector('[data-chat-refresh]').onclick=load;
    form.onsubmit=async e=>{e.preventDefault();const text=draft.value.trim();if(!text||sending)return;if(text!==pendingText){pendingText=text;pendingId=crypto.randomUUID();}sending=true;const send=form.querySelector('button');send.disabled=true;state.textContent='Sending…';try{await window.__swChatSend(text,pendingId);if(!form.isConnected)return;draft.value='';pendingText='';pendingId=null;await load();state.textContent='Message saved to the shared conversation.';}catch(error){if(state.isConnected)state.textContent=error.message;}finally{sending=false;send.disabled=false;}};
    load();refreshScreen=()=>{if(!sending&&Date.now()-readAt>10000)load();};
  }
  function more(){
    show('more',title('YOUR COMMAND KIT','Everything within reach.')+`<div class="more-grid">${[['reports','save','Save & reports','Inventory exports and staff reporting'],['alerts','bell','Push notifications','This device and alert preferences'],['team','team','Team & email','Kevin, Mike and Brad'],['rounds','check','Rounds checklist','Your retained property checklist'],['character','team','My character','Saved models and uniforms'],['controls','center','Player controls','Walking, look and turn sensitivity'],['hands','hand','Tablet hands',hands?.enabled?'On · Follows your character':'Off · Tap to show hands'],['chat','chat','Staff chat','Open the original staff conversation'],['sounds','sound','Status sounds',window._swSoundOn===false?'Currently muted':'Currently on'],['install','phone','Install StoreWell','Keep it on your home screen'],['help','route','How to use','Tablet and outside controls'],['fullscreen','desk','Full screen','Use the whole display'],['logout','exit','Switch staff member','Sign out of this session']].map(([a,s,h,p])=>`<button class="more-card" data-action="${a}"><span>${icon(s)}</span><div><strong>${h}</strong><small>${p}</small></div>${icon('back')}</button>`).join('')}</div><figure class="crew-photo"><img src="/img/limo.jpg" alt="The original Iggy’s crew limousine photograph"><figcaption>IGGY’S — THE CREW <span>The original StoreWell command-center photograph</span></figcaption></figure>`);
  }
  async function action(a){
    if(['home','locks','route','history','team','more','reports'].includes(a)){if(a==='locks'||a==='route'){query='';filter='all';routeCursor=0;}return navigate(a);}
    if(a==='exit')return closeTablet();
    if(a==='action')return navigate('action');
    if(a==='all-locks'){filter='all';query='';lockView='board';return showLocks();}
    if(a==='property-map'){filter='all';query='';lockView='map';return showLocks();}
    if(a==='unit-history')return showHistory(selectedUnit);
    if(a==='refresh-history')return watchHistory(true);
    if(a==='staff-report')return openTool('Staff report',()=>window.__swSaveReport?.(),'#sw-save-report-modal');
    if(a==='alerts')return openTool('Push notifications',()=>{if(!window.__swBellTap)throw new Error('Push controls are still loading. Please try Notifications again.');return window.__swBellTap({embedded:true});},'#sw-pref-panel');
    if(a==='rounds')return openTool('Rounds checklist',()=>window.__swRounds?.(),'#sw-rounds-modal');
    if(a==='character')return openTool('My character',()=>window._swShowWardrobe?.(),'#sw-wardrobe');
    if(a==='controls')return openTool('Player controls',()=>window.__swGear?.(),'#sw-sens-panel');
    if(a==='chat')return showChat();
    if(a==='sounds'||a==='case-sounds'){window.__swSoundToggle?.();syncCaseSound();if(a==='sounds')more();else toast(window._swSoundOn===false?'Status sounds muted':'Status sounds on');return;}
    if(a==='hands'){hands?.toggle();more();return;}
    if(a==='logout')return window.__swLogout?.();
    if(a==='fullscreen'){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('Full screen is not available in this browser.');}return;}
    if(a==='install'){if(installPrompt){await installPrompt.prompt();installPrompt=null;return;}show('more',title('TAKE IT WITH YOU','Install StoreWell.')+'<div class="help-cards"><article><h2>Android / Chrome</h2><p>Open the browser menu and choose Install app or Add to Home screen.</p></article><article><h2>iPhone / iPad</h2><p>Choose Share, then Add to Home Screen.</p></article></div>');return;}
    if(a==='help')show('more',title('QUICK GUIDE','A tablet for the whole property.')+'<div class="help-cards"><article><h2>Outside stays outside</h2><p>Use the same walking, vehicle and door controls. Command Center pulls up this tablet. Outside puts it away at the same place.</p></article><article><h2>Locks follow the property</h2><p>Start at C2 beside the open front gate. The map uses the actual door positions. Drag to move, pinch or use + and − to zoom.</p></article><article><h2>One door at a time</h2><p>Tap a lock to choose its status. Saved changes use the same shared inventory and are recorded in history. Find outside marks the actual door.</p></article><article><h2>History stays complete</h2><p>Select Oldest first to read from the beginning. Full backup includes every saved activity record, including emails and sign-ins.</p></article></div>');
  }
  tablet.addEventListener('click',e=>{const navButton=e.target.closest('[data-nav]');if(navButton){if(['route','locks'].includes(navButton.dataset.nav)){filter='all';query='';routeCursor=0;}navigate(navButton.dataset.nav);return;}const f=e.target.closest('[data-filter-open]');if(f){filter=f.dataset.filterOpen;query='';lockView='board';showLocks();return;}const u=e.target.closest('[data-unit],[data-map-unit]');if(u){const unit=units().find(x=>x.id===(u.dataset.unit||u.dataset.mapUnit));if(unit)showUnit(unit,u);return;}const a=e.target.closest('[data-action]')?.dataset.action;if(a)action(a).catch(error=>toast(error.message||'That action could not connect.'));});
  tablet.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();if(lockChoices.isOpen)lockChoices.close();else if(screen==='home')closeTablet();else home();}if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-map-unit]')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
  window.__swOpenUnitMenu=label=>{const u=units().find(u=>u.id===norm(label));if(!u)return false;(async()=>{if(!window.__swDeckVisible&&!await openTablet('locks'))return;showUnit(u);})();return true;};
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;});
  window.addEventListener('appinstalled',()=>{installPrompt=null;toast('StoreWell is installed.');});
  function showPropertyPlan(selected) {
    if(selected) selectedPropertyUnit = selected;
    if(!propertyPlan) {
      propertyPlan = document.createElement('main'); propertyPlan.id = 'sw-property-fallback';
      propertyPlan.innerHTML = `<header><div><p>OUTSIDE · STORAGE PROPERTY</p><h1>StoreWell Storage</h1></div><nav aria-label="Property controls"><button data-property="find">Find a unit</button><button data-property="command">Enter Command Center</button></nav></header><div class="property-caption"><span>3D graphics are unavailable on this device. Showing the property plan.</span><strong class="property-selection" role="status"></strong></div><div class="property-plan"><svg role="group" aria-label="Storage property and unit locations"></svg></div>`;
      document.body.append(propertyPlan);
      propertyPlan.querySelector('[data-property="command"]').onclick = openTablet;
      propertyPlan.querySelector('[data-property="find"]').onclick = () => openTablet('locks');
      const select=e=>{const id=e.target.closest('[data-plan-unit]')?.dataset.planUnit;if(id){const unit=units().find(u=>u.id===id);if(unit)window.__swOpenUnitMenu(unit.id);}};
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
  function refresh(){
    app=window.__swApp;window.__swCommandCenter=openTablet;window.__swPanelOpen=openTablet;window.__swGoCommand=openTablet;
    if(!app?._locks)return;
    if(!appLoginStarted&&window.__swLoginGate){appLoginStarted=true;login();}
    if(!window.__swDeckVisible&&app._webglAvailable===false&&Object.keys(app._locks).length){if(!propertyPlan||propertyPlan.hidden)showPropertyPlan();else updatePropertyPlan();}
    if(tablet.hidden)return;
    tablet.querySelector('[data-staff]').textContent=window.__swCheckLogin?.()||'Staff';
    tablet.querySelector('[data-clock]').textContent=new Date().toLocaleString('en-US',{timeZone:'America/Chicago',weekday:'short',hour:'numeric',minute:'2-digit'})+' CT';
    tablet.querySelector('[data-action-count]').textContent=units().filter(u=>['flashred','flashgreen'].includes(u.status)).length;
    const c=tablet.querySelector('.tablet-connection');c.textContent=live?'Shared inventory connected':'Saved inventory · reconnecting';c.classList.toggle('connected',live);
    if(!lockChoices.isOpen&&!boardZoom.active)refreshScreen?.();watchHistory();
  }
  async function syncHealth(){
    try{const response=await fetch('https://storewell-3d-default-rtdb.firebaseio.com/lockOverrides.json',{signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error();const data=await response.json();if(app){const merged={...(data||{})};for(const [k,v]of Object.entries(app._pendingWrites||{}))if(Date.now()-v.t<10000)merged[k]=v.st;app._overrides=merged;app._repaintFromOverrides?.();}live=true;}catch{live=false;}refresh();
  }
  window.addEventListener('online',syncHealth);window.addEventListener('offline',()=>{live=false;refresh();});
  setInterval(refresh,2000);setInterval(syncHealth,15000);refresh();syncHealth();
})();
