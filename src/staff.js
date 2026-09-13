
import{initializeApp}from"firebase/app";
import{getDatabase,ref,set,update,push,remove,get,onValue,onDisconnect}from"firebase/database";
import{getAuth,signInAnonymously}from"firebase/auth";
import{createDatabaseSession}from"./database-session.js";
const _app=initializeApp({apiKey:"AIzaSyBdYyhNaNJs-Xv8Fe4bOuAoXWNOb_1D_94",authDomain:"storewell-3d.firebaseapp.com",databaseURL:"https://storewell-3d-default-rtdb.firebaseio.com",projectId:"storewell-3d",storageBucket:"storewell-3d.firebasestorage.app",messagingSenderId:"1093355976155",appId:"1:1093355976155:web:33b21794eaf968d006e3fe"});
const _db=getDatabase(_app),_auth=getAuth(_app);
const _session=createDatabaseSession({auth:_auth,signInAnonymously,db:_db,ref,push,update});
window.__swEnsureFirebase=_session.ensureAuth;window.__swCommitLockChange=_session.saveChange;
_session.ensureAuth().catch(e=>console.warn('Database connection not ready',e.code));
window.addEventListener('online',()=>_session.ensureAuth().catch(()=>{}));
window._swDB=_db; window._swAuth=_auth;
// Expose Firebase DB fns so code in the (non-module) React/babel scripts can use realtime sync too.
window._swRef=ref; window._swOnValue=onValue; window._swUpdate=update; window._swSet=set; window._swPush=push; window._swRemove=remove; window._swGet=get; window._swOnDisconnect=onDisconnect;
window.__swMobileLook=(function(){
  // Always init slider values from localStorage so they work regardless of device detection
  try{ const sv=localStorage.getItem('sw_look_sens'); if(sv!=null) window._swLookSens=parseFloat(sv);
       const wv=localStorage.getItem('sw_walk_spd'); if(wv!=null){ let _w=parseFloat(wv); if(_w>0) window._swWalkSpd=_w; }
       const tv=localStorage.getItem('sw_turn_spd'); if(tv!=null) window._swTurnSpd=parseFloat(tv); }catch(e){}
  const isMob=/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)||navigator.maxTouchPoints>0;
  if(!isMob) return;
  // On mobile: joystick L/R = strafe (not turn). Turn comes from right-side drag only.
  // strafe mode OFF — joystick L/R turns the character (natural mobile game feel)
  // Directly bind touch to joystick circle — backup if onPointerDown template binding fails
  const bindJoy=setInterval(()=>{
    const joyCircle=document.querySelector('#sw-joy-wrap > div:last-child');
    const app=window.__swApp; if(!joyCircle||!app) return;
    if(joyCircle._swTouchBound) return;
    joyCircle._swTouchBound=true; clearInterval(bindJoy);
    joyCircle.addEventListener('touchstart',e=>{ e.preventDefault(); app._joyStart(e); },{passive:false});
  },300);
  let lookId=null, lx=0, ly=0;
  document.addEventListener('touchstart',e=>{
    if(window.__swDeckVisible)return;
    for(const t of e.changedTouches){
      // Only track touches on the RIGHT half of screen, not on the joystick
      const joy=document.getElementById('sw-joy-wrap');
      const jr=joy?joy.getBoundingClientRect():null;
      const onJoy=jr&&t.clientX>=jr.left-20&&t.clientX<=jr.right+20&&t.clientY>=jr.top-20&&t.clientY<=jr.bottom+20;
      const onPanel=t.clientX<window.innerWidth*0.42;
      if(!onJoy&&!onPanel&&lookId===null){ lookId=t.identifier; lx=t.clientX; ly=t.clientY; }
    }
  },{passive:true});
  document.addEventListener('touchmove',e=>{
    if(window.__swDeckVisible){lookId=null;return;}
    if(e.touches&&e.touches.length>=2){ lookId=null; return; } // two fingers = let the browser pinch-zoom
    for(const t of e.changedTouches){
      if(t.identifier!==lookId) continue;
      const dx=t.clientX-lx, dy=t.clientY-ly;
      lx=t.clientX; ly=t.clientY;
      const app=window.__swApp;
      if(!app||!app.cur) continue;
      const _s=(window._swLookSens!=null?window._swLookSens:0.002);
      app.cur.h -= dx*_s;
      app.lookPitch=Math.max(-0.8,Math.min(0.5,app.lookPitch+dy*_s));
    }
  },{passive:true});
  document.addEventListener('touchend',e=>{
    for(const t of e.changedTouches){ if(t.identifier===lookId) lookId=null; }
  },{passive:true});
})();
window.__swClearLog=async function(){ try{ await remove(ref(_db,'lockLog')); console.log('Log cleared'); }catch(e){ console.warn('clear failed',e); } };
const SC={Kevin:'#2a6fdb',Mike:'#1f9d4d',Brad:'#9b3fcf'};
function _uidColor(u){let h=0;for(let c of u)h=c.charCodeAt(0)+((h<<5)-h);return((Math.abs(h)>>16&0xff)|0x44)<<16|((Math.abs(h)>>8&0xff)|0x44)<<8|(Math.abs(h)&0xff)|0x44;}
function _myName(){try{return localStorage.getItem('sw_staff_name')||'';}catch(e){return '';}}
async function _sendSMS(phone,msg,tbKey){
  try{
    if(!tbKey){
      const r=await fetch('https://storewell-3d-default-rtdb.firebaseio.com/staffConfig/_tbKey.json');
      tbKey=await r.json();
    }
    if(!tbKey){console.warn('No tbKey for SMS');return;}
    const _body=JSON.stringify({phone:String(phone).replace(/\D/g,''),message:String(msg).slice(0,160),key:tbKey});
    const _post=async()=>{ const _r=await fetch('/sms',{method:'POST',headers:{'Content-Type':'application/json'},body:_body}); return await _r.json().catch(()=>({})); };
    let _d=await _post();
    if(!_d||!_d.success){ await new Promise(r=>setTimeout(r,2500)); _d=await _post(); }
    if(!_d||!_d.success){console.warn('SMS not sent after retry',_d);} else {console.log('SMS sent, quota',_d.quotaRemaining);}
    return _d;
  }catch(e){console.error('SMS',e);}
}
try{ window.__swSMS=_sendSMS; }catch(e){}
async function _sendEmail(to,toName,from,msg,key){
  if(!to)throw new Error('Email recipient is missing');
  const response=await fetch('/email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({to,toName,subject:'StoreWell · '+(from||'Staff'),body:msg})});
  const data=await response.json();if(!response.ok||!data.success)throw new Error(data.error||'Email was not accepted');
  if(window._swAuth?.currentUser&&window._swPush)window._swPush(window._swRef(window._swDB,'lockLog'),{type:'email',label:'Email',from:from||'Staff',to:toName||to,who:from||'Staff',msg:String(msg||'').slice(0,80),t:Date.now()}).catch(()=>{});
  return data;
}

function _toast(name,changes,ts){
  const d=document.createElement('div');
  d.style.cssText='position:fixed;bottom:80px;right:14px;z-index:99999;background:#1f2a33;color:#fff;border-radius:12px;padding:12px 14px;max-width:260px;font-family:Segoe UI,Arial;box-shadow:0 6px 24px rgba(0,0,0,.4)';
  const col=SC[name]||'#888',dt=new Date(ts).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
  d.innerHTML='<div style="font-weight:800;font-size:13px;margin-bottom:6px"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:'+col+';margin-right:5px"></span>'+name+' · '+dt+'</div>'
    +changes.map(c=>'<div style="font-size:11px;color:#c8d6e0;margin:2px 0">• Unit '+c.label+': '+c.from+' → '+c.to+'</div>').join('')
    +'<button onclick="this.parentElement.remove()" style="margin-top:8px;width:100%;border:none;background:rgba(255,255,255,.12);color:#fff;border-radius:6px;padding:4px;cursor:pointer;font-size:11px">Dismiss</button>';
  document.body.appendChild(d);setTimeout(()=>{try{d.remove();}catch(e){}},30000);
}
let _lastT=Date.now();
onValue(ref(_db,'staffReports'),snap=>{
  const r=snap.val()||{},me=_myName();let mx=_lastT;
  Object.values(r).filter(x=>x.ts>_lastT&&x.name!==me).sort((a,b)=>a.ts-b.ts).forEach(x=>{mx=Math.max(mx,x.ts);_toast(x.name,x.changes||[],x.ts);});
  _lastT=Math.max(mx,...Object.values(r).map(x=>x.ts||0));
});
window.__swAdminLoad=async function(){
  const _sr1=await fetch('https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json');const cfg=await _sr1.json()||{};const app=window.__swApp;if(!app)return;
  const contacts=['Kevin','Mike','Brad'].map(n=>({name:n,color:SC[n],initial:n[0],email:'',phone:'',carrier:'',pref:'email',...(cfg[n]||{})}));
  app.setState({adminContacts:contacts,ejsKey:cfg._ejsKey||''});
  // Also directly set input values since template engine may not update existing inputs
  setTimeout(()=>{
    contacts.forEach(c=>{
      document.querySelectorAll(`[data-name="${c.name}"]`).forEach(el=>{
        const f=el.dataset.field;
        if(f&&c[f]!==undefined){el.value=c[f];}
      });
    });
    const ejsEl=document.querySelector('[data-field="ejsKey"]');
    if(ejsEl)ejsEl.value=cfg._ejsKey||'';
  },300);
};



// Build the best route from the front gate through every unit in a status, then show it overhead
window.__swRouteStatus=function(status){
  const app=window.__swApp; if(!app) return;
  const n=app.buildStatusTour(status);
  const bd=document.getElementById('sw-actionboard'); if(bd) bd.remove();
  if(!n){ alert('No units in that status right now.'); return; }
  app._inCommandRoom=false; if(app.setMode) app.setMode('orbit'); // show the whole route from above
  var t=document.createElement('div'); t.id='sw-route-toast'; t.style.cssText='position:fixed;top:64px;left:50%;transform:translateX(-50%);z-index:100060;background:#0d1f35;color:#fff;border:1px solid #ff8a00;border-radius:12px;padding:12px 16px;font:700 13px Segoe UI,Arial;box-shadow:0 8px 30px rgba(0,0,0,.5);max-width:92vw;text-align:center;';
  t.innerHTML='🚶 Best route set through '+n+' unit'+(n>1?'s':'')+', starting at the command office.<br>Follow the orange line — stops are numbered 1→'+n+'.<div style="margin-top:8px;"><button onclick="window.__swWalkRoute&&window.__swWalkRoute();this.closest(\'div\').remove()" style="border:none;background:#2dff85;color:#06301a;font-weight:900;padding:8px 16px;border-radius:8px;cursor:pointer;">🚶 Walk it</button> <button onclick="this.closest(\'div\').remove()" style="border:none;background:#ff8a00;color:#fff;font-weight:800;padding:8px 14px;border-radius:8px;cursor:pointer;">Map</button> <button onclick="window.__swApp._clearTour&&window.__swApp._clearTour();this.closest(\'div\').remove()" style="border:1px solid #ff8a00;background:transparent;color:#ff8a00;font-weight:800;padding:8px 12px;border-radius:8px;cursor:pointer;">Clear</button></div>';
  document.body.appendChild(t);
};
// Jump to the command office (route start) on foot, keeping the drawn route
window.__swWalkRoute=function(){ const a=window.__swApp; if(!a) return; a._inCommandRoom=false; if(a.setMode)a.setMode('walk'); const s=a._freeSpotNear(a._officeSpot()); if(a.walker){ a.walker.g.position.set(s.x,0,s.z); a.walker.h=Math.PI; if(a._net&&a._net._pos)a._net._pos(); } };
window.__swReadLockHistory=async function(){
  if(!window.__swCheckLogin?.()||!window._swAuth?.currentUser)throw new Error('Staff sign in is required');
  const snapshot=await window._swGet(window._swRef(window._swDB,'lockLog'));
  return Object.values(snapshot.val()||{}).sort((a,b)=>(Number(b.t)||0)-(Number(a.t)||0));
};
// Full scrollable Lock History (opened by tapping the history wall board)
window.__swHistoryPanel=function(){
  const old=document.getElementById('sw-hist-panel'); if(old){ old.remove(); return; }
  const app=window.__swApp;
  const wrap=document.createElement('div'); wrap.id='sw-hist-panel';
  wrap.style.cssText='position:fixed;top:3vh;left:50%;transform:translateX(-50%);width:min(520px,96vw);height:94vh;background:#0a1120;border-radius:20px;z-index:9100;display:flex;flex-direction:column;box-shadow:0 16px 60px rgba(0,0,0,.55);overflow:hidden;font-family:Segoe UI,Arial;';
  wrap.innerHTML='<div style="background:linear-gradient(135deg,#1e3a8a,#0ea5e9);padding:14px 16px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;"><div style="color:#fff;font-weight:900;font-size:16px;">🖥 Lock History — All Activity</div><button onclick="document.getElementById(\'sw-hist-panel\').remove()" style="border:none;background:rgba(255,255,255,.25);color:#fff;width:36px;height:36px;border-radius:9px;font-size:18px;cursor:pointer;">×</button></div><div id="sw-hist-list" style="flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px;">'+'<div style="color:#7f9bc0;text-align:center;padding:24px;">Loading…</div></div>';
  document.body.appendChild(wrap);
  const COL={green:'#37d67a',red:'#ff5a5a',blue:'#4aa3ff',white:'#c9d3df',black:'#9aa6b2',yellow:'#ffd23f',flashred:'#ff3b3b',flashgreen:'#3dff8a',purple:'#c07bff'};
  function render(list){ const el=document.getElementById('sw-hist-list'); if(!el) return;
    if(!list||!list.length){ el.innerHTML='<div style="color:#7f9bc0;text-align:center;padding:24px;">No activity logged yet.</div>'; return; }
    el.innerHTML=list.map(function(r){ const d=new Date(r.t); const ds=d.toLocaleDateString([],{month:'short',day:'numeric'})+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); const tc=COL[r.to]||'#fff';
      return '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:11px 12px;border-radius:12px;background:#12203a;margin-bottom:7px;"><div style="min-width:0;"><div style="color:#e6eefb;font-weight:800;font-size:14px;">Unit '+(r.label||'?')+'</div><div style="color:#9fb3d4;font-size:12px;margin-top:2px;">'+(r.from||'?')+' → <b style="color:'+tc+';">'+String(r.to||'').toUpperCase()+'</b></div><div style="color:#7f95ba;font-size:11px;margin-top:2px;">by '+(r.who||'Staff')+'</div></div><div style="color:#8aa0c4;font-size:12px;text-align:right;white-space:nowrap;">'+ds+'</div></div>';
    }).join('');
  }
  if(app&&app._histLog&&app._histLog.length) render(app._histLog);
  window.__swReadLockHistory().then(list=>{if(app)app._histLog=list;render(list);}).catch(()=>{const el=document.getElementById('sw-hist-list');if(el)el.textContent='History could not connect. Sign in and reopen to retry.';});
};
window.__swOperationsOpen=async function(initialTab='overview'){
  const app=window.__swApp;
  if(!app)return;
  if(!window.__swCheckLogin?.()||!app.state.editMode){
    await window.__swLoginGate?.(app);
    if(!window.__swCheckLogin?.()||!app.state.editMode)return;
  }
  const tab=['overview','inventory','log','contacts'].includes(initialTab)?initialTab:'overview';
  const existing=document.getElementById('sw-cmd-panel');
  if(existing){existing.querySelector(`[data-tab="${tab}"]`)?.click();return;}

  // Fetch contacts from Firebase
  let cfg={};
  try{
    const _sr5r=await fetch('https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json');
    cfg=(_sr5r.ok?(await _sr5r.json()):{})||{};
  }catch(e){}

  // Inject styles once
  if(!document.getElementById('sw-cmd-style')){
    const s=document.createElement('style');
    s.id='sw-cmd-style';
    s.textContent=`
      #sw-cmd-panel *{box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif;}
      #sw-cmd-panel ::-webkit-scrollbar{width:4px;}
      #sw-cmd-panel ::-webkit-scrollbar-track{background:transparent;}
      #sw-cmd-panel ::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:4px;}
      .sw-tab-btn{border:none;cursor:pointer;padding:8px 16px;font-size:12px;font-weight:700;letter-spacing:.4px;border-radius:8px;transition:all .2s;background:transparent;color:#4a6380;}
      .sw-tab-btn.active{background:#fff;color:#FF6B6B;box-shadow:0 -2px 0 #FF6B6B inset;font-weight:800;}
      .sw-tab-btn:hover:not(.active){color:#333;background:#f0f0f0;}
      .sw-stat-card{background:#0d1f35;border:1px solid #1e3a5f;border-radius:12px;padding:16px;text-align:center;}
      .sw-stat-val{font-size:28px;font-weight:800;line-height:1;}
      .sw-stat-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#4a6380;margin-top:4px;}
      .sw-input{width:100%;box-sizing:border-box;background:#f4f7fb;border:1.5px solid #dbe4ef;border-radius:8px;padding:9px 12px;font-size:13px;color:#1f2a37;outline:none;transition:border .2s;}
      .sw-input:focus{border-color:#2a6fdb;background:#fff;}
      .sw-select{width:100%;box-sizing:border-box;background:#f4f7fb;border:1.5px solid #dbe4ef;border-radius:8px;padding:9px 12px;font-size:13px;color:#1f2a37;outline:none;}
      .sw-btn-primary{border:none;cursor:pointer;background:linear-gradient(135deg,#00b4ff,#0066cc);color:#fff;font:700 13px 'Segoe UI';padding:10px 20px;border-radius:9px;box-shadow:0 2px 12px rgba(0,180,255,.3);transition:opacity .2s;}
      .sw-btn-primary:hover{opacity:.85;}
      .sw-btn-ghost{border:1px solid #1e3a5f;cursor:pointer;background:transparent;color:#8ab4d4;font:600 12px 'Segoe UI';padding:7px 14px;border-radius:8px;transition:all .2s;}
      .sw-btn-ghost:hover{border-color:#00b4ff44;color:#00b4ff;}
      .sw-row-item{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:10px;background:#f4f7fb;border:1.5px solid #e3eaf3;margin-bottom:7px;box-shadow:0 1px 3px rgba(20,40,80,.05);}
      .sw-badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:800;letter-spacing:.3px;}
      @keyframes sw-slidein{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
      @keyframes sw-flash-red{0%{background:#ff0000;box-shadow:0 0 0 6px #ff000066,0 0 40px #ff0000,0 0 80px #ff000099;}50%{background:#ff6666;box-shadow:0 0 0 2px #ff000033,0 0 10px #ff0000;}100%{background:#ff0000;box-shadow:0 0 0 6px #ff000066,0 0 40px #ff0000,0 0 80px #ff000099;}}
      @keyframes sw-flash-green{0%{background:#00ff44;box-shadow:0 0 0 6px #00ff4466,0 0 40px #00ff44,0 0 80px #00ff4499;}50%{background:#66ffaa;box-shadow:0 0 0 2px #00ff4433,0 0 10px #00ff44;}100%{background:#00ff44;box-shadow:0 0 0 6px #00ff4466,0 0 40px #00ff44,0 0 80px #00ff4499;}}
    `;
    document.head.appendChild(s);
  }

  // Build panel HTML — the one big Command Center board (centered, pinned footer)
  const panel=document.createElement('div');
  panel.id='sw-cmd-panel';
  panel.style.cssText='position:fixed;top:3vh;left:50%;transform:translateX(-50%);width:min(480px,95vw);height:94vh;max-height:94vh;background:#ffffff;border-radius:20px;z-index:9000;display:flex;flex-direction:column;box-shadow:0 16px 60px rgba(0,0,0,.45);overflow:hidden;';

  const contacts=['Kevin','Mike','Brad'].map(n=>({
    name:n,
    email:(cfg[n]&&cfg[n].email)||'',
    phone:(cfg[n]&&cfg[n].phone)||'',
    pref:(cfg[n]&&cfg[n].pref)||'email',
    color:n==='Kevin'?'#2a6fdb':n==='Mike'?'#1f9d4d':'#9b3fcf'
  }));

  function prefOpts(val){
    return ['email','text','both','none'].map(v=>`<option value="${v}"${v===val?' selected':''}>${{email:'Email only',text:'Push notifications',both:'Email + push',none:'No notifications'}[v]}</option>`).join('');
  }

  function buildInvRows(){
    if(!app||!app._locks) return '<div style="color:#999;font-size:12px;padding:16px;text-align:center;">No data</div>';
    const statusColor={blue:'#00aaff',red:'#ff1111',green:'#00ff44',white:'#ffffff',black:'#aaaaaa',yellow:'#ffee00',flashred:'#ff0000',flashgreen:'#00ff44',purple:'#9b30d1'};
    const cells=[];
    Object.keys(app._locks).sort().forEach(k=>{
      const rec=app._locks[k];
      const st=app._statusOf?app._statusOf(rec.label):'green';
      const col=statusColor[st]||'#1f9d4d';
      const flash=st==='flashred'?'animation:sw-flash-red .5s infinite;':st==='flashgreen'?'animation:sw-flash-green .5s infinite;':'';
      const cid='swc-'+rec.label.replace(/[^a-z0-9]/gi,'');
      cells.push(`<div onclick="window.__swCycleNext('${rec.label}')" oncontextmenu="event.preventDefault();window.__swApp&&window.__swApp.locate&&window.__swApp.locate('${rec.label}'.replace(/[-\\s]/g,'').toUpperCase());window.__swApp&&window.__swApp.setState&&window.__swApp.setState({showSearch:false});" title="Left-click: change status | Right-click: find on map" style="cursor:pointer;padding:4px 2px;user-select:none;transition:transform .15s;" onmouseover="this.style.transform='scale(1.12)'" onmouseout="this.style.transform='scale(1)'"><div id="${cid}" style="width:46px;height:46px;border-radius:50%;background:${col};box-shadow:0 4px 12px ${col}99;${flash}display:flex;align-items:center;justify-content:center;"><span style="color:#000;font-size:11px;font-weight:900;font-family:'Arial Black',Impact,sans-serif;text-align:center;line-height:1.1;padding:2px;overflow:hidden;word-break:break-all;">${rec.label}</span></div></div>`);
    });
    return '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;">'+cells.join('')+'</div>';
  }

  function buildLogRows(entries){
    if(!entries||!entries.length) return '<div style="color:#4a6380;font-size:13px;padding:20px;text-align:center;">No activity yet</div>';
    return entries.map(r=>{
      const d=new Date(r.t);
      const dateStr=d.toLocaleDateString([],{month:'short',day:'numeric'});
      const timeStr=d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
      return `<div class="sw-row-item">
        <div style="flex:1;">
          <div style="color:#1f2a37;font-size:13px;font-weight:800;">${r.label}</div>
          <div style="color:#5b6b7d;font-size:11px;margin-top:2px;">${r.from} → <b style="color:#2a6fdb;">${r.to}</b></div>
          <div style="color:#8493a4;font-size:10px;margin-top:2px;">by ${r.who||'Staff'}</div>
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="color:#5b6b7d;font-size:11px;">${timeStr}</div>
          <div style="color:#8493a4;font-size:10px;">${dateStr}</div>
        </div>
      </div>`;
    }).join('');
  }
  // Load full Firebase log async and render into the log tab
  async function loadFirebaseLog(){
    try{
      const entries=await window.__swReadLockHistory();
      const logEl=document.getElementById('sw-log-list');
      const ovEl=document.getElementById('sw-ov-log');
      if(logEl) logEl.innerHTML=buildLogRows(entries);
      if(ovEl) ovEl.innerHTML=buildLogRows(entries.slice(0,5));
    }catch(e){ for(const id of ['sw-log-list','sw-ov-log']){const el=document.getElementById(id);if(el)el.textContent='History could not connect. Sign in and reopen to retry.';} }
  }

  function buildStats(){
    if(!app||!app._locks) return '';
    const c={};
    Object.keys(app._locks).forEach(k=>{ const st=app._statusOf?app._statusOf(app._locks[k].label):'green'; c[st]=(c[st]||0)+1; });
    const total=Object.keys(app._locks).length;
    const tile=(val,lbl,col,bg,stk)=>`<div onclick="window.__swRouteStatus&&window.__swRouteStatus('${stk}')" style="background:${bg};border-radius:14px;padding:12px 6px;text-align:center;cursor:pointer;box-shadow:0 1px 3px rgba(20,40,80,.06);"><div style="font-size:30px;font-weight:900;color:${col};line-height:1;">${val}</div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:${col};opacity:.85;margin-top:4px;">${lbl}</div></div>`;
    return `<div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:14px;padding:14px;text-align:center;margin-bottom:10px;box-shadow:0 3px 12px rgba(102,126,234,.3);"><div style="font-size:42px;font-weight:900;color:#fff;line-height:1;">${total}</div><div style="font-size:11px;font-weight:800;color:rgba(255,255,255,.8);text-transform:uppercase;letter-spacing:.6px;margin-top:2px;">Total Units</div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
        ${tile(c.flashred||0,'Lock It','#e11d1d','#fde3e3','flashred')}
        ${tile(c.flashgreen||0,'Lock Off','#0e9f45','#e3fbe9','flashgreen')}
        ${tile(c.red||0,'Locked Out','#cc2b2b','#fdeaea','red')}
        ${tile(c.blue||0,'Reserved','#2a6fdb','#eaf0fd','blue')}
        ${tile(c.yellow||0,'No Lock','#15803d','#fefce8','yellow')}
        ${tile(c.purple||0,'Ready','#8b3fd1','#f3eafd','purple')}
        ${tile(c.green||0,'Rented','#1f9d4d','#e9f9ef','green')}
        ${tile(c.white||0,'Available','#475569','#eef1f4','white')}
        ${tile(c.black||0,'Out of Svc','#475569','#eef1f4','black')}
      </div>
      <div style="text-align:center;color:#8a94a0;font-size:10px;margin-top:8px;">Tap a tile to plan the walking route through those units</div>`;
  }

  panel.innerHTML=`
    <div id="sw-panel-drag" style="background:linear-gradient(135deg,#FF6B6B,#FFD93D,#6BCB77,#4D96FF);padding:12px 14px;display:flex;align-items:center;justify-content:space-between;cursor:grab;user-select:none;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">🏪</span>
        <div>
          <div style="color:#fff;font-weight:900;font-size:14px;letter-spacing:.3px;text-shadow:0 1px 4px rgba(0,0,0,.3);">Command Center</div>
          <div style="color:rgba(255,255,255,.85);font-size:10px;font-weight:700;">${app&&app.state?app.state.staffName||'Staff':'Staff'} · Online</div>
        </div>
      </div>
      <button id="sw-panel-close" style="border:none;cursor:pointer;background:rgba(255,255,255,.35);color:#fff;border-radius:8px;width:26px;height:26px;font-size:15px;line-height:1;font-weight:800;">×</button>
    </div>

    <div class="sw-operations-tabs" style="display:flex;background:#f8f9fa;border-bottom:2px solid #eee;">
      <button class="sw-tab-btn active" data-tab="overview" style="flex:1;padding:9px 4px;font-size:10px;color:#666;border:none;background:transparent;cursor:pointer;font-weight:700;">📊 Stats</button>
      <button class="sw-tab-btn" data-tab="inventory" style="flex:1;padding:9px 4px;font-size:10px;color:#666;border:none;background:transparent;cursor:pointer;font-weight:700;">🔒 Units</button>
      <button class="sw-tab-btn" data-tab="log" style="flex:1;padding:9px 4px;font-size:10px;color:#666;border:none;background:transparent;cursor:pointer;font-weight:700;">📋 Log</button>
      <button class="sw-tab-btn" data-tab="contacts" style="flex:1;padding:9px 4px;font-size:10px;color:#666;border:none;background:transparent;cursor:pointer;font-weight:700;">👥 Team</button>
    </div>

    <div id="sw-panel-body" style="flex:1;overflow-y:auto;padding:12px;background:#fff;">

      <div id="sw-tab-overview">
        ${buildStats()}
        <div style="color:#4a6380;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;margin:14px 0 8px;">Recent Activity</div>
        <div id="sw-ov-log">${'<div style="color:#4a6380;font-size:12px;text-align:center;padding:8px;">Loading...</div>'}</div>
      </div>

      <div id="sw-tab-inventory" style="display:none;">
        <input id="sw-inv-search" type="text" placeholder="🔍 Search unit..." style="width:100%;box-sizing:border-box;background:#f4f7fb;border:1.5px solid #dbe4ef;border-radius:10px;padding:10px 12px;font-size:13px;color:#1f2a37;outline:none;margin-bottom:10px;"/>
        <div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap;">
          ${[{f:'all',col:'#667eea',lbl:'All'},{f:'green',col:'#1f9d4d',lbl:'Rented'},{f:'red',col:'#cc2b2b',lbl:'Late'},{f:'flashred',col:'#ff4400',lbl:'Lock It'},{f:'flashgreen',col:'#00cc44',lbl:'Remove'},{f:'blue',col:'#2a6fdb',lbl:'Resv'},{f:'yellow',col:'#22c55e',lbl:'No Lock'},{f:'purple',col:'#9b30d1',lbl:'Ready'},{f:'black',col:'#555',lbl:'N/A'}].map(({f,col,lbl})=>`<button class="sw-inv-filter" data-filter="${f}" style="border:2px solid ${f==='all'?col+'88':'#eee'};cursor:pointer;background:${f==='all'?col+'22':'#f8f9fa'};color:#333;font:700 9px Segoe UI;padding:3px 7px;border-radius:12px;display:flex;align-items:center;gap:4px;"><div style="width:8px;height:8px;border-radius:50%;background:${col};flex-shrink:0;"></div>${lbl}</button>`).join('')}
        </div>
        <div id="sw-inv-list">${buildInvRows()}</div>
      </div>

      <div id="sw-tab-log" style="display:none;">
        <div id="sw-log-list"><div style="color:#4a6380;font-size:12px;text-align:center;padding:8px;">Loading...</div></div>
      </div>

      <div id="sw-tab-contacts" style="display:none;">
        <div style="display:flex;flex-direction:column;gap:10px;" id="sw-contact-cards">
          ${contacts.map(c=>`<div style="background:#fff;border:1.5px solid #e3eaf3;border-radius:12px;padding:14px;box-shadow:0 2px 8px rgba(20,40,80,.06);">
            <div style="display:flex;align-items:center;gap:9px;margin-bottom:12px;">
              <div style="width:36px;height:36px;border-radius:50%;background:${c.color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:15px;box-shadow:0 3px 8px ${c.color}66;">${c.name[0]}</div>
              <div style="color:#1f2a37;font-weight:800;font-size:14px;">${c.name}</div>
            </div>
            <div style="display:grid;gap:7px;">
              <div><div style="color:#7a8aa0;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Email</div><input class="sw-input" data-name="${c.name}" data-field="email" value="${c.email}" placeholder="email@example.com"/></div>
              <div><div style="color:#7a8aa0;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Phone</div><input class="sw-input" data-name="${c.name}" data-field="phone" value="${c.phone}" placeholder="10-digit"/></div>
              <div><div style="color:#7a8aa0;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Notify Via</div><select class="sw-select" data-name="${c.name}" data-field="pref">${prefOpts(c.pref)}</select></div>
            </div>
          </div>`).join('')}
        </div>
        <button id="sw-save-contacts" style="margin-top:10px;width:100%;border:none;cursor:pointer;background:linear-gradient(135deg,#3C3B6E,#2a2a5a);color:#fff;font:700 12px Segoe UI;padding:9px;border-radius:8px;">💾 Save Contacts</button>
        <div id="sw-contacts-saved" style="display:none;color:#00d68f;font-size:11px;text-align:center;margin-top:6px;">✅ Saved!</div>
      </div>
    </div>

    <div class="sw-operations-footer" style="flex-shrink:0;border-top:1px solid #eef1f5;background:#fff;padding:10px 12px;display:flex;gap:8px;box-shadow:0 -3px 12px rgba(0,0,0,.06);">
      <button id="sw-send-report" style="flex:1;border:none;cursor:pointer;background:linear-gradient(135deg,#FF6B6B,#ee0979);color:#fff;font:800 14px Segoe UI;padding:13px;border-radius:11px;box-shadow:0 3px 10px rgba(238,9,121,.3);">📤 Save &amp; Report</button>
      <button id="sw-operations-close" style="border:2px solid #eee;cursor:pointer;background:#f8f9fa;color:#666;font:700 13px Segoe UI;padding:13px 16px;border-radius:11px;">Close menu</button>
    </div>
  `;

  document.body.appendChild(panel);
  loadFirebaseLog();
  // Make panel draggable from header
  (function(){
    const hdr=document.getElementById('sw-panel-drag');
    if(!hdr) return;
    let ox=0,oy=0,mx=0,my=0;
    hdr.addEventListener('pointerdown',e=>{
      if(e.target.id==='sw-panel-close'||document.body.classList.contains('storewell-deck-open')) return;
      e.preventDefault();
      hdr.setPointerCapture(e.pointerId);
      hdr.style.cursor='grabbing';
      const rect=panel.getBoundingClientRect();
      panel.style.left=rect.left+'px'; panel.style.top=rect.top+'px';
      panel.style.right='auto'; panel.style.bottom='auto';
      ox=e.clientX-rect.left; oy=e.clientY-rect.top;
    });
    hdr.addEventListener('pointermove',e=>{
      if(!hdr.hasPointerCapture(e.pointerId)) return;
      const x=Math.max(0,Math.min(window.innerWidth-panel.offsetWidth, e.clientX-ox));
      const y=Math.max(0,Math.min(window.innerHeight-panel.offsetHeight, e.clientY-oy));
      panel.style.left=x+'px'; panel.style.top=y+'px';
    });
    hdr.addEventListener('pointerup',e=>{
      hdr.style.cursor='grab';
      try{localStorage.setItem('sw_cmd_pos',JSON.stringify({left:panel.style.left,top:panel.style.top,right:'auto'}));}catch(e){}
    });
  })();

  // ── Tab switching ──
  panel.querySelectorAll('.sw-tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      panel.querySelectorAll('.sw-tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const tab=btn.dataset.tab;
      ['overview','inventory','log','contacts'].forEach(t=>{
        document.getElementById('sw-tab-'+t).style.display=t===tab?'block':'none';
      });
      if(tab==='log') loadFirebaseLog();
    });
  });

  // ── Close ──
  document.getElementById('sw-panel-close').onclick=()=>panel.remove();
  // Inventory search
  const invSearch=document.getElementById('sw-inv-search');
  if(invSearch){
    invSearch.addEventListener('input',()=>{
      const q=invSearch.value.trim().toLowerCase();
      const list=document.getElementById('sw-inv-list');
      if(!app||!app._locks||!list) return;
      const stColors={blue:'#00b4ff',red:'#ff4444',green:'#00d68f',white:'#94a3b8',black:'#475569',yellow:'#f59e0b',flashred:'#ff6666',flashgreen:'#66ff99',purple:'#a855f7'};
      const stLabels={blue:'Reserved',red:'Locked Out',green:'Rented',white:'Available',black:'Out of Service',yellow:'Rented · No Lock',flashred:'Need to Lock',flashgreen:'Lock Off',purple:'Ready to Rent'};
      const rows=[];
      Object.keys(app._locks).sort().forEach(k=>{
        const rec=app._locks[k];
        if(q&&!rec.label.toLowerCase().includes(q)) return;
        const st=app._statusOf?app._statusOf(rec.label):'green';
        const col=stColors[st]||'#00d68f';
        const lbl=stLabels[st]||'Rented';
        const cid2='swc-'+rec.label.replace(/[^a-z0-9]/gi,'');
        const flash2=st==='flashred'?'animation:sw-flash-red .5s infinite;':st==='flashgreen'?'animation:sw-flash-green .5s infinite;':'';
        rows.push(`<div onclick="window.__swCycleNext('${rec.label}')" oncontextmenu="event.preventDefault();window.__swApp&&window.__swApp.locate&&window.__swApp.locate('${rec.label}'.replace(/[-\\s]/g,'').toUpperCase());window.__swApp&&window.__swApp.setState&&window.__swApp.setState({showSearch:false});" title="Left-click: change status | Right-click: find on map" style="cursor:pointer;padding:4px 2px;user-select:none;transition:transform .15s;" onmouseover="this.style.transform='scale(1.12)'" onmouseout="this.style.transform='scale(1)'"><div id="${cid2}" style="width:46px;height:46px;border-radius:50%;background:${col};box-shadow:0 4px 12px ${col}99;${flash2}display:flex;align-items:center;justify-content:center;"><span style="color:#000;font-size:11px;font-weight:900;font-family:'Arial Black',Impact,sans-serif;text-align:center;line-height:1.1;padding:2px;overflow:hidden;word-break:break-all;">${rec.label}</span></div></div>`);
      });
      list.innerHTML=rows.join('')||'<div style="color:#4a6380;font-size:13px;padding:20px;text-align:center;">No units found</div>';
    });
  }

  // ── Inventory filter ──
  const sc2={blue:'#00aaff',red:'#ff1111',green:'#00ff44',white:'#ffffff',black:'#aaaaaa',yellow:'#ffee00',flashred:'#ff0000',flashgreen:'#00ff44',purple:'#9b30d1'};
  function buildFilteredCircles(f){
    if(!app||!app._locks) return '';
    const cells=[];
    Object.keys(app._locks).sort().forEach(k=>{
      const rec=app._locks[k];
      const st=app._statusOf?app._statusOf(rec.label):'green';
      if(f!=='all'&&st!==f) return;
      const col=sc2[st]||'#00ff44';
      const flash=st==='flashred'?'animation:sw-flash-red .5s infinite;':st==='flashgreen'?'animation:sw-flash-green .5s infinite;':'';
      const cid='swc-'+rec.label.replace(/[^a-z0-9]/gi,'');
      cells.push(`<div onclick="window.__swCycleNext('${rec.label}')" oncontextmenu="event.preventDefault();window.__swApp&&window.__swApp.locate&&window.__swApp.locate('${rec.label}'.replace(/[-\s]/g,'').toUpperCase());" style="cursor:pointer;padding:4px 2px;user-select:none;" onmouseover="this.style.transform='scale(1.12)'" onmouseout="this.style.transform='scale(1)'"><div id="${cid}" style="width:46px;height:46px;border-radius:50%;background:${col};box-shadow:0 4px 12px ${col}99;${flash}display:flex;align-items:center;justify-content:center;"><span style="color:#000;font-size:11px;font-weight:900;font-family:'Arial Black',Impact,sans-serif;text-align:center;line-height:1.1;padding:2px;overflow:hidden;word-break:break-all;">${rec.label}</span></div></div>`);
    });
    return cells.length?'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;">'+cells.join('')+'</div>':'<div style="color:#4a6380;font-size:13px;padding:20px;text-align:center;">No units with this status</div>';
  }
  panel.querySelectorAll('.sw-inv-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      panel.querySelectorAll('.sw-inv-filter').forEach(b=>{ b.style.borderColor=''; b.style.color=''; });
      btn.style.borderColor='#00b4ff44'; btn.style.color='#00b4ff';
      const f=btn.dataset.filter;
      const list=document.getElementById('sw-inv-list');
      if(list) list.innerHTML=buildFilteredCircles(f);
    });
  });

  // ── Send report ──
  function doSendReport(sentEl){
    const log=(app&&app.state&&app.state.sessionLog)||[];
    if(!log.length){ sentEl.style.display='block'; sentEl.textContent='No changes to report.'; setTimeout(()=>sentEl.style.display='none',2000); return; }
    if(window.__swStaffReport) window.__swStaffReport(app.state.staffName||'Staff',log);
    if(app&&app.setState) app.setState({reportSent:'✅ Sent!',sessionLog:[]});
    sentEl.style.display='block'; sentEl.textContent='✅ Sent to team!';
    setTimeout(()=>sentEl.style.display='none',2500);
  }
  document.getElementById('sw-send-report').onclick=()=>{ panel.remove(); if(window.__swSaveReport) window.__swSaveReport(); };

  // Closing an operations window must preserve the current staff session and room.
  // Explicit sign-out remains available through Switch staff member.
  document.getElementById('sw-operations-close').onclick=()=>panel.remove();

  // ── Save contacts ──
  document.getElementById('sw-save-contacts').onclick=async()=>{
    const updated={};
    panel.querySelectorAll('[data-name][data-field]').forEach(el=>{
      const n=el.dataset.name,f=el.dataset.field;
      if(!updated[n])updated[n]={};
      updated[n][f]=el.value;
    });
    await window.__swAdminSave(Object.entries(updated).map(([name,v])=>({name,...v})),'');
    const saved=document.getElementById('sw-contacts-saved');
    saved.style.display='block';
    setTimeout(()=>saved.style.display='none',2000);
  };
  panel.querySelector(`[data-tab="${tab}"]`)?.click();
};

window.__swAdminOpen=async function(){
  const _sr3=await fetch('https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json');const cfg=await _sr3.json()||{};
  const contacts=['Kevin','Mike','Brad'].map(n=>({name:n,color:SC[n],email:'',phone:'',carrier:'',pref:'email',...(cfg[n]||{})}));
  const modal=document.getElementById('sw-admin-modal');
  if(!modal)return;
  const prefOpts=(val)=>['email','text','both','none'].map(v=>`<option value="${v}"${v===val?' selected':''}>${{email:'Email only',text:'Push notifications',both:'Email + push',none:'No notifications'}[v]}</option>`).join('');
  modal.innerHTML=`<div style="background:#f4f6f9;border-radius:18px;width:340px;max-height:92vh;overflow-y:auto;font-family:'Segoe UI',Arial;box-shadow:0 12px 40px rgba(0,0,0,.35);">
    <div style="background:#1f2a33;border-radius:18px 18px 0 0;padding:16px 18px;display:flex;justify-content:space-between;align-items:center;">
      <div style="color:#fff;font-weight:800;font-size:16px;">👥 Staff Contacts</div>
      <button onclick="document.getElementById('sw-admin-modal').style.display='none'" style="border:none;background:rgba(255,255,255,.15);color:#fff;cursor:pointer;border-radius:8px;width:28px;height:28px;font-size:18px;line-height:1;">×</button>
    </div>
    <div style="padding:14px 16px;">
      ${contacts.map(c=>`<div style="background:#fff;border-radius:12px;padding:14px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <div style="width:40px;height:40px;border-radius:50%;background:${c.color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:17px;">${c.name[0]}</div>
          <div style="font-weight:800;font-size:15px;color:#1f2a33;">${c.name}</div>
        </div>
        <div style="display:grid;gap:8px;">
          <div><div style="font-size:10px;font-weight:700;color:#8a9baa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Email</div>
          <input data-field="email" data-name="${c.name}" value="${c.email||''}" placeholder="email@example.com" style="width:100%;box-sizing:border-box;border:1.5px solid #e4e8ec;border-radius:8px;padding:8px 10px;font-size:13px;background:#f9fafc;"/></div>
          <div><div style="font-size:10px;font-weight:700;color:#8a9baa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Phone</div>
          <input data-field="phone" data-name="${c.name}" value="${c.phone||''}" placeholder="10-digit number" style="width:100%;box-sizing:border-box;border:1.5px solid #e4e8ec;border-radius:8px;padding:8px 10px;font-size:13px;background:#f9fafc;"/></div>
          <div><div style="font-size:10px;font-weight:700;color:#8a9baa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Notify via</div>
          <select data-field="pref" data-name="${c.name}" style="width:100%;box-sizing:border-box;border:1.5px solid #e4e8ec;border-radius:8px;padding:8px 10px;font-size:13px;background:#f9fafc;">${prefOpts(c.pref)}</select></div>
        </div>
      </div>`).join('')}
      <button id="sw-admin-save-btn" style="width:100%;border:none;cursor:pointer;background:#2a6fdb;color:#fff;font:700 14px 'Segoe UI';padding:12px;border-radius:10px;">💾 Save Changes</button>
      <div id="sw-admin-saved" style="display:none;text-align:center;font-size:13px;color:#1f9d4d;margin-top:10px;font-weight:700;">✅ Saved!</div>
    </div>
  </div>`;
  modal.style.display='flex';
  document.getElementById('sw-admin-save-btn').onclick=async()=>{
    const rows=document.querySelectorAll('[data-name]');
    const updated={};
    rows.forEach(el=>{const n=el.dataset.name,f=el.dataset.field;if(!updated[n])updated[n]={};updated[n][f]=el.value;});
    await window.__swAdminSave(Object.entries(updated).map(([name,v])=>({name,...v})),'');
    document.getElementById('sw-admin-saved').style.display='block';
    setTimeout(()=>{ const s=document.getElementById('sw-admin-saved'); if(s)s.style.display='none'; },2000);
  };
};

// ── Staff Login Gate ──────────────────────────────────────────

window.__swGoCommand=function(){ try{ if(window._swBuildOfficeCC)window._swBuildOfficeCC(); }catch(e){} };
// ---- (kept, unused) Bright 2D Command Center dashboard ----
window.__swCC_close=function(){ var o=document.getElementById('sw-cc-dash'); if(o) o.style.display='none'; document.body.classList.remove('sw-cc-open'); };
window.__swCC_route=function(st){ window.__swCC_close(); if(window.__swRouteStatus) window.__swRouteStatus(st); };
window.__swCC_save=function(){ if(window.__swSaveReport) window.__swSaveReport(); };
window.__swReverseWalk=function(){
  var app=window.__swApp;
  if(!app) return;
  // Flip walker heading 180 degrees
  if(app.walker && typeof app.walker.h==='number'){ app.walker.h=(app.walker.h+Math.PI)%(Math.PI*2); }
  // Also flip drive/fly heading if in those modes
  if(app.driver && typeof app.driver.h==='number'){ app.driver.h=(app.driver.h+Math.PI)%(Math.PI*2); }
  if(app.flyer  && typeof app.flyer.h==='number'){  app.flyer.h =(app.flyer.h +Math.PI)%(Math.PI*2); }
};
window.__swRounds=function(){
  var existing=document.getElementById('sw-rounds-modal');
  if(existing) existing.remove();
  // Overlay
  var ov=document.createElement('div');
  ov.id='sw-rounds-modal';
  ov.style.cssText='position:fixed;inset:0;z-index:11000;background:rgba(10,18,30,.72);display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);';
  ov.onclick=function(e){ if(e.target===ov) ov.remove(); };
  // Inner card
  var card=document.createElement('div');
  card.style.cssText='background:#F5F4F1;color:#191816;border-radius:16px;width:min(660px,96vw);max-height:90vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,.55);font-family:"Segoe UI",Arial,sans-serif;';
  card.innerHTML='<div style="padding:14px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #191816;">'
    +'<div><div style="font-weight:900;font-size:18px;letter-spacing:-.01em;text-transform:uppercase;">📋 Rounds Checklist</div>'
    +'<div style="font-size:11px;color:#6b6760;text-transform:uppercase;letter-spacing:.06em;margin-top:2px;" id="sw-rounds-ts">Loading…</div></div>'
    +'<div style="display:flex;gap:8px;align-items:center;">'
    +'<button onclick="window.print()" style="padding:5px 13px;border:1.5px solid #191816;background:transparent;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;font-family:inherit;">🖨 Print</button>'
    +'<button onclick="document.getElementById(\'sw-rounds-modal\').remove();" style="width:30px;height:30px;border-radius:50%;border:1.5px solid #ccc;background:transparent;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;">×</button>'
    +'</div></div>'
    +'<div id="sw-rounds-body" style="padding:16px;">Loading lock data…</div>';
  ov.appendChild(card);
  document.body.appendChild(ov);
  // Fetch live data
  fetch('https://storewell-3d-default-rtdb.firebaseio.com/lockOverrides.json')
    .then(function(r){if(!r.ok)throw new Error('Lock data unavailable');return r.json();})
    .then(function(data){
      if(!ov.isConnected)return;
      data=data||{};
      var lockIt=[],lockOff=[],late=[],blue=[],purple=[];
      var property=window.__swApp, knownLocks=property?._locks||{};
      // Round stops must be real property units, using the same labels as the board.
      Object.keys(knownLocks).forEach(function(k){
        var label=knownLocks[k].label;
        var st=Object.prototype.hasOwnProperty.call(data,k)?data[k]:property._statusOf(label);
        if(st==='flashred') lockIt.push(label);
        else if(st==='flashgreen') lockOff.push(label);
        else if(st==='red') late.push(label);
        else if(st==='blue') blue.push(label);
        else if(st==='purple') purple.push(label);
      });
      [lockIt,lockOff,late,blue,purple].forEach(function(rows){rows.sort(function(a,b){return a.localeCompare(b,undefined,{numeric:true});});});
      var now=new Date();
      var ts=now.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})+' · '+now.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
      ov.querySelector('#sw-rounds-ts').textContent='Updated · '+ts;
      function chips(arr,bg,clr,brd){
        if(!arr.length) return '<span style="color:#aaa;font-size:13px;font-style:italic;">None</span>';
        return arr.map(function(k){
          return '<span style="font-family:monospace;font-size:15px;font-weight:600;padding:6px 10px;border-radius:3px;background:'+bg+';color:'+clr+';border:1.5px solid '+brd+';letter-spacing:.02em;display:inline-block;">'+k+'</span>';
        }).join('');
      }
      function section(colorBar,label,desc,count,chipsHtml,note){
        return '<div style="margin-bottom:16px;">'
          +'<div style="background:'+colorBar+';color:#fff;border-radius:6px 6px 0 0;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;-webkit-print-color-adjust:exact;print-color-adjust:exact;">'
          +'<div><div style="font-size:13px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;">'+label+'</div>'
          +'<div style="font-size:11px;opacity:.85;">'+desc+'</div></div>'
          +'<div style="font-size:26px;font-weight:700;font-family:monospace;opacity:.9;">'+count+'</div></div>'
          +'<div style="border:1.5px solid #E0DCD6;border-top:none;border-radius:0 0 6px 6px;padding:12px;display:flex;flex-wrap:wrap;gap:7px;background:#fff;min-height:52px;">'+chipsHtml+'</div>'
          +(note?'<div style="font-size:11px;color:#888;font-style:italic;padding:5px 12px;border:1.5px solid #E0DCD6;border-top:none;">'+note+'</div>':'')
          +'</div>';
      }
      var html='<div style="display:flex;gap:16px;flex-wrap:wrap;">'
        +'<div style="flex:1;min-width:220px;">'+section('#B91C1C','⚡ Lock It','Put a lock on these units',lockIt.length,chips(lockIt,'#FDF2F2','#B91C1C','#F4BFBF'))+'</div>'
        +'<div style="flex:1;min-width:220px;">'+section('#0E7032','✅ Lock Off','Remove lock from these units',lockOff.length,chips(lockOff,'#EDF6F0','#0E7032','#A7D9BA'))+'</div>'
        +'</div>';
      if(late.length||blue.length||purple.length){
        html+='<div style="margin-top:16px;border-top:1.5px solid #E0DCD6;padding-top:14px;">'
          +'<div style="font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:#6b6760;margin-bottom:8px;">Also out there</div>'
          +'<div style="display:flex;flex-wrap:wrap;gap:7px;">'
          +chips(late,'#FFFBEB','#92400E','#FCD34D')
          +chips(blue,'#EFF6FF','#1E40AF','#BFDBFE')
          +chips(purple,'#F5F0FF','#6B21A8','#D8B4FE')
          +'</div>'
          +'<div style="margin-top:6px;font-size:11px;color:#aaa;font-style:italic;">'
          +(late.length?'<span style="color:#92400E;">■</span> Late &nbsp;':'')
          +(blue.length?'<span style="color:#1E40AF;">■</span> Reserved &nbsp;':'')
          +(purple.length?'<span style="color:#6B21A8;">■</span> Ready to Rent':'')
          +'</div></div>';
      }
      ov.querySelector('#sw-rounds-body').innerHTML=html;
    })
    .catch(function(){ if(ov.isConnected)ov.querySelector('#sw-rounds-body').innerHTML='<p style="color:#ffaaa1;">Could not load lock data. Check your connection.</p>'; });
};
window.__swDashboard=function(){
  var a=window.__swApp; if(!a) return;
  var lk=a._locks||{}, c={}, total=0;
  Object.keys(lk).forEach(function(k){ var s=a._statusOf?a._statusOf(lk[k].label):'green'; c[s]=(c[s]||0)+1; total++; });
  var g=function(k){return c[k]||0;};
  var ov=document.getElementById('sw-cc-dash');
  if(!ov){ ov=document.createElement('div'); ov.id='sw-cc-dash'; document.body.appendChild(ov); }
  ov.style.cssText='position:fixed;inset:0;z-index:99990;overflow:auto;padding:14px;box-sizing:border-box;background:radial-gradient(circle at 50% -10%,#1e4585,#081426 75%);-webkit-tap-highlight-color:transparent;display:block;';
  document.body.classList.add('sw-cc-open');
  function statCard(emoji,iconbg,num,label,numcol,bg,brd){ return '<div style="background:'+bg+';border:1.5px solid '+brd+';border-radius:16px;padding:11px 13px;display:flex;align-items:center;gap:11px;box-shadow:0 2px 6px rgba(20,40,80,.08);">'
    +'<div style="width:50px;height:50px;flex:0 0 auto;border-radius:50%;background:'+iconbg+';display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:inset 0 2px 3px rgba(255,255,255,.5),0 3px 6px rgba(0,0,0,.22);">'+emoji+'</div>'
    +'<div style="line-height:1.05;"><div style="font:900 28px \'Segoe UI\',Arial;color:'+numcol+';">'+num+'</div><div style="font:800 11px \'Segoe UI\',Arial;letter-spacing:.4px;text-transform:uppercase;color:'+numcol+';opacity:.85;margin-top:2px;">'+label+'</div></div></div>'; }
  function lockCard(emoji,iconbg,num,label,numcol,bg,brd,status){ return '<div style="background:'+bg+';border:1.5px solid '+brd+';border-radius:16px;padding:10px 12px;display:flex;align-items:center;gap:12px;box-shadow:0 2px 6px rgba(20,40,80,.08);">'
    +'<div style="width:50px;height:50px;flex:0 0 auto;border-radius:50%;background:'+iconbg+';display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:inset 0 2px 3px rgba(255,255,255,.5),0 3px 6px rgba(0,0,0,.22);">'+emoji+'</div>'
    +'<div style="flex:1 1 auto;line-height:1.05;"><div style="font:900 28px \'Segoe UI\',Arial;color:'+numcol+';">'+num+'</div><div style="font:800 11px \'Segoe UI\',Arial;letter-spacing:.4px;text-transform:uppercase;color:'+numcol+';opacity:.85;margin-top:2px;">'+label+'</div></div>'
    +'<button onclick="window.__swCC_route(\''+status+'\')" style="flex:0 0 auto;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:1px;background:linear-gradient(180deg,#ffa64d,#f47a1e);color:#fff;border-radius:14px;padding:9px 18px;font:900 12px \'Segoe UI\',Arial;letter-spacing:.4px;text-transform:uppercase;box-shadow:0 4px 0 #c85e10,0 6px 10px rgba(0,0,0,.25),inset 0 2px 2px rgba(255,255,255,.4);text-shadow:0 1px 2px rgba(0,0,0,.3);"><span style="font-size:18px;">🚶</span>ROUTE</button></div>'; }
  function gbtn(onclick,grad,shadow,emoji,lbl,id){ return '<button '+(id?'id="'+id+'" ':'')+'onclick="'+onclick+'" class="sw-gbtn" style="background:'+grad+';box-shadow:'+shadow+';"><span style="font-size:27px;line-height:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,.35));">'+emoji+'</span><span class="sw-glbl">'+lbl+'</span></button>'; }
  var SH='0 5px 0 #14509e,0 8px 14px rgba(0,0,0,.32),inset 0 2px 3px rgba(255,255,255,.55)';
  var doors=''; for(var d=0; d<6; d++){ doors+='<div style="width:30px;height:'+(38+ (d%3)*14)+'px;background:#fff;border-radius:4px 4px 0 0;"></div>'; }
  ov.innerHTML='<div style="max-width:1120px;margin:0 auto;background:linear-gradient(180deg,#1e4585,#0e2650);border-radius:22px;padding:9px;box-shadow:0 20px 60px rgba(0,0,0,.5);border:1px solid rgba(120,160,220,.4);">'
    +'<div style="background:#eef3f8;border-radius:16px;padding:13px;">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:linear-gradient(180deg,#2b5aa8,#123a7a);border-radius:14px;padding:11px 15px;box-shadow:inset 0 2px 4px rgba(255,255,255,.22),0 3px 8px rgba(0,0,0,.3);flex-wrap:wrap;">'
        +'<div style="display:flex;align-items:center;gap:11px;"><div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(180deg,#3a9bf0,#1560c8);display:flex;align-items:center;justify-content:center;font-size:23px;box-shadow:inset 0 2px 3px rgba(255,255,255,.5),0 3px 6px rgba(0,0,0,.3);">⚡</div>'
        +'<div style="font:900 21px \'Segoe UI\',Arial;color:#fff;letter-spacing:.5px;text-shadow:0 2px 4px rgba(0,0,0,.4);">STOREWELL COMMAND CENTER</div></div>'
        +'<div style="font:800 12px \'Segoe UI\',Arial;color:#cfe0ff;letter-spacing:.3px;">👆 TAP ROUTE ON A LOCK CARD · SAVE BELOW</div></div>'
      +'<div style="display:flex;gap:9px;align-items:stretch;flex-wrap:wrap;margin-top:11px;">'
        +gbtn("window.__swCC_close();var a=window.__swApp;a&&a._goHome&&a._goHome();","linear-gradient(180deg,#57b0f7,#1f6fd6)",SH,"🏠","HOME")
        +gbtn("window.__swCC_close();var a=window.__swApp;a&&a.setMode&&a.setMode('walk');","linear-gradient(180deg,#f7be4e,#e58f1c)","0 5px 0 #b96e0f,0 8px 14px rgba(0,0,0,.32),inset 0 2px 3px rgba(255,255,255,.55)","🚶","WALK")
        +gbtn("window.__swCC_close();var a=window.__swApp;a&&a.setMode&&a.setMode('orbit');","linear-gradient(180deg,#b45ee0,#8a2fc0)","0 5px 0 #661f95,0 8px 14px rgba(0,0,0,.32),inset 0 2px 3px rgba(255,255,255,.55)","🗺️","OVERVIEW")
        +gbtn("window.__swCC_close();var a=window.__swApp;a&&a.setState&&a.setState({showSearch:true});","linear-gradient(180deg,#63d15f,#2fa02f)","0 5px 0 #1f7a22,0 8px 14px rgba(0,0,0,.32),inset 0 2px 3px rgba(255,255,255,.55)","🔍","FIND UNIT")
        +gbtn("if(window.__swTestNotif)window.__swTestNotif();","linear-gradient(180deg,#38c7a0,#1a9478)","0 5px 0 #0f6e58,0 8px 14px rgba(0,0,0,.32),inset 0 2px 3px rgba(255,255,255,.55)","📡","TEST NOTIF","sw-cc-testnotif")
        +gbtn("if(window.__swRounds)window.__swRounds();","linear-gradient(180deg,#e05757,#b91c1c)","0 5px 0 #7f1212,0 8px 14px rgba(0,0,0,.32),inset 0 2px 3px rgba(255,255,255,.55)","📋","ROUNDS")
        +gbtn("if(window.__swSoundToggle)window.__swSoundToggle();","linear-gradient(180deg,#63d15f,#2fa02f)","0 5px 0 #1f7a22,0 8px 14px rgba(0,0,0,.32),inset 0 2px 3px rgba(255,255,255,.55)","🔊","SOUND ON","sw-cc-sound")
      +'</div>'
      +'<div style="position:relative;overflow:hidden;margin-top:12px;background:linear-gradient(180deg,#7b5fe0,#5a2fc0);border-radius:16px;padding:20px;text-align:center;box-shadow:inset 0 2px 6px rgba(255,255,255,.22),0 4px 12px rgba(0,0,0,.25);">'
        +'<div style="position:absolute;right:14px;bottom:0;display:flex;gap:7px;align-items:flex-end;opacity:.16;">'+doors+'</div>'
        +'<div style="position:relative;font:900 50px \'Segoe UI\',Arial;color:#fff;line-height:1;text-shadow:0 3px 6px rgba(0,0,0,.3);">'+total+'</div>'
        +'<div style="position:relative;font:800 14px \'Segoe UI\',Arial;color:#e8ddff;letter-spacing:1px;margin-top:4px;">TOTAL UNITS</div></div>'
      +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px;">'
        +statCard('⭐','linear-gradient(180deg,#5aa0ea,#2f74c8)',g('blue'),'Reserved','#1f6fd6','#e8effc','#c5d8f5')
        +statCard('🔓','linear-gradient(180deg,#5fce5a,#2fa02f)',g('yellow'),'No Lock','#15803d','#fefce8','#fde68a')
        +statCard('✅','linear-gradient(180deg,#b45ee0,#8a2fc0)',g('purple'),'Ready','#8a2fc0','#f2e6fb','#e0c8f2')
        +statCard('🏬','linear-gradient(180deg,#5fce5a,#2fa02f)',g('green'),'Rented','#128a3f','#e4f6ea','#bfe6cc')
        +statCard('✖️','linear-gradient(180deg,#9aa6b2,#6b7280)',g('black'),'Out of Svc','#64748b','#eef1f4','#d7dee6')
      +'</div>'
      +'<div style="margin-top:15px;font:900 13px \'Segoe UI\',Arial;color:#0e2650;letter-spacing:.5px;">🔀 ROUTES — TAP TO BUILD THE BEST PATH</div>'
      +'<div style="display:flex;flex-direction:column;gap:9px;margin-top:8px;">'
        +lockCard('🔒','linear-gradient(180deg,#ef4d4d,#cc2020)',g('flashred'),'Lock It','#e11d1d','#fde6e6','#f6c9c9','flashred')
        +lockCard('🔓','linear-gradient(180deg,#5fce5a,#2fa02f)',g('flashgreen'),'Lock Off','#128a3f','#e4f6ea','#bfe6cc','flashgreen')
        +lockCard('🔒','linear-gradient(180deg,#ef4d4d,#cc2020)',g('red'),'Locked Out','#e11d1d','#fde6e6','#f6c9c9','red')
      +'</div>'
      +'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:14px;">'
      +gbtn("window.__swReverseWalk()","linear-gradient(180deg,#f97b3c,#d4511a)","0 5px 0 #a33610,0 8px 14px rgba(0,0,0,.32),inset 0 2px 3px rgba(255,255,255,.55)","🔃","REVERSE")
      +gbtn("window.__swCC_close();if(window.__swGear)window.__swGear();","linear-gradient(180deg,#6aa6e6,#2f74c8)","0 5px 0 #1f5596,0 8px 14px rgba(0,0,0,.32),inset 0 2px 3px rgba(255,255,255,.55)","⚙️","GEAR")
      +gbtn("window.__swCC_close();if(window._swShowWardrobe)window._swShowWardrobe();","linear-gradient(180deg,#b45ee0,#7a2db0)","0 5px 0 #5f2295,0 8px 14px rgba(0,0,0,.32),inset 0 2px 3px rgba(255,255,255,.55)","👔","CHARACTER")
      +gbtn("if(window.__swBellTap)window.__swBellTap();","linear-gradient(180deg,#f2a33c,#d9791a)","0 5px 0 #a85712,0 8px 14px rgba(0,0,0,.32),inset 0 2px 3px rgba(255,255,255,.55)","🔔","ALERTS","sw-cc-bell")
      +'</div>'
      +'<button onclick="window.__swCC_save()" style="width:100%;margin-top:10px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;background:linear-gradient(180deg,#3a9bf0,#1560c8);color:#fff;font:900 18px \'Segoe UI\',Arial;letter-spacing:.5px;text-transform:uppercase;border-radius:16px;padding:15px;box-shadow:0 6px 0 #0f4aa0,0 10px 18px rgba(0,0,0,.3),inset 0 2px 4px rgba(255,255,255,.5);text-shadow:0 1px 3px rgba(0,0,0,.35);"><span style="font-size:21px;">💾</span> SAVE &amp; REPORT</button>'
    +'</div></div>';
  try{ if(window.__swBellRefresh) window.__swBellRefresh(); }catch(e){}
  try{ if(window.__swSoundRefresh) window.__swSoundRefresh(); }catch(e){}
};
window.__swCommandCenter=async function(){
  const app=window.__swApp;
  // Command Center requires login
  if(app&&app.state&&app.state.editMode){
    if(window.__swGoCommand) window.__swGoCommand();
    return;
  }
  if(window.__swLoginGate){
    const sc=app;
    await window.__swLoginGate(sc);
    // After login, go into the command room (controls open on demand via the 📋 button)
    setTimeout(()=>{ if(window.__swGoCommand) window.__swGoCommand(); }, 150);
  }
};




window.__swShowHelp=function(){
  if(document.getElementById('sw-help-modal')) return;
  const isMobile=/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  // Inject style once
  if(!document.getElementById('sw-help-style')){
    const s=document.createElement('style');
    s.id='sw-help-style';
    s.textContent=`
      #sw-help-modal{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9500;display:flex;align-items:center;justify-content:center;padding:16px;}
      @keyframes sw-popin{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}
      .sw-help-box{background:#0f1923;border:1px solid #1e3a5f;border-radius:20px;width:100%;max-width:480px;overflow:hidden;animation:sw-popin .2s ease;box-shadow:0 24px 64px rgba(0,0,0,.8);font-family:'Segoe UI',Arial;}
      .sw-help-header{background:linear-gradient(135deg,#0d2d4a,#0a1e30);padding:24px 24px 20px;text-align:center;border-bottom:1px solid #1e3a5f;}
      .sw-control-row{display:flex;align-items:center;gap:14px;padding:11px 0;border-bottom:1px solid #0d1f35;}
      .sw-control-row:last-child{border-bottom:none;}
      .sw-key{background:#1a3050;border:1px solid #2a4a6a;color:#7dd3fc;font:700 11px monospace;padding:4px 9px;border-radius:6px;white-space:nowrap;flex-shrink:0;}
      .sw-ctrl-desc{color:#94a3b8;font-size:13px;}
    `;
    document.head.appendChild(s);
  }

  const desktopControls=[
    {key:'↑ / W',desc:'Move forward'},
    {key:'↓ / S',desc:'Move backward'},
    {key:'← / →',desc:'Turn left / right'},
    {key:'Mouse drag',desc:'Look around'},
    {key:'E',desc:'Enter car, bird, or UFO when nearby'},
    {key:'Click lock',desc:'View or change lock status (staff)'},
    {key:'Click door',desc:'Open / close a door'},
    {key:'🏠 Home',desc:'Return to front gate'},
    {key:'🔭 Orbit',desc:'Switch to overhead view'},
  ];
  const mobileControls=[
    {key:'Joystick',desc:'Move around'},
    {key:'Drag screen',desc:'Look around'},
    {key:'Tap car/bird/UFO',desc:'Ride that vehicle'},
    {key:'Tap a lock',desc:'View or change status (staff)'},
    {key:'Tap a door',desc:'Open / close'},
    {key:'🏠 Home',desc:'Return to front gate'},
  ];
  const controls=isMobile?mobileControls:desktopControls;

  const modal=document.createElement('div');
  modal.id='sw-help-modal';
  modal.innerHTML=`<div class="sw-help-box">
    <div class="sw-help-header">
      <div style="font-size:32px;margin-bottom:8px;">🏪</div>
      <div style="color:#e2e8f0;font-size:20px;font-weight:800;margin-bottom:4px;">Welcome to StoreWell</div>
      <div style="color:#4a7fa0;font-size:13px;">Your 3D storage facility</div>
    </div>
    <div style="padding:20px 24px;">
      <div style="color:#7dd3fc;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">${isMobile?'📱 Mobile':'⌨️ Desktop'} Controls</div>
      <div>
        ${controls.map(c=>`<div class="sw-control-row"><span class="sw-key">${c.key}</span><span class="sw-ctrl-desc">${c.desc}</span></div>`).join('')}
      </div>
      <div style="margin-top:16px;background:#0d1f35;border:1px solid #1e3a5f;border-radius:12px;padding:12px 14px;">
        <div style="color:#f59e0b;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">🔒 Lock Colors</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:10px;"><div style="width:12px;height:12px;border-radius:50%;background:#1f9d4d;flex-shrink:0;"></div><span style="color:#94a3b8;font-size:12px;"><b style="color:#e2e8f0;">Green</b> — Rented, good standing</span></div>
          <div style="display:flex;align-items:center;gap:10px;"><div style="width:12px;height:12px;border-radius:50%;background:#cc2b2b;flex-shrink:0;"></div><span style="color:#94a3b8;font-size:12px;"><b style="color:#e2e8f0;">Red</b> — Locked out, late on payments</span></div>
          <div style="display:flex;align-items:center;gap:10px;"><div style="width:12px;height:12px;border-radius:50%;background:#cc2b2b;border:2px dashed #ff6666;flex-shrink:0;animation:pulse 1s infinite;"></div><span style="color:#94a3b8;font-size:12px;"><b style="color:#ff6666;">Flashing Red</b> — Action needed: lock this unit</span></div>
          <div style="display:flex;align-items:center;gap:10px;"><div style="width:12px;height:12px;border-radius:50%;background:#1f9d4d;border:2px dashed #66ff99;flex-shrink:0;animation:pulse 1s infinite;"></div><span style="color:#94a3b8;font-size:12px;"><b style="color:#66ff99;">Flashing Green</b> — Action needed: remove lock</span></div>
          <div style="display:flex;align-items:center;gap:10px;"><div style="width:12px;height:12px;border-radius:50%;background:#2a6fdb;flex-shrink:0;"></div><span style="color:#94a3b8;font-size:12px;"><b style="color:#e2e8f0;">Blue</b> — Reserved</span></div>
          <div style="display:flex;align-items:center;gap:10px;"><div style="width:12px;height:12px;border-radius:50%;background:#181818;border:1px solid #444;flex-shrink:0;"></div><span style="color:#94a3b8;font-size:12px;"><b style="color:#e2e8f0;">Black</b> — Temporary out of service</span></div>
        </div>
      </div>
      <button id="sw-help-close" style="margin-top:18px;width:100%;border:none;cursor:pointer;background:linear-gradient(135deg,#00b4ff,#0066cc);color:#fff;font:700 15px 'Segoe UI';padding:13px;border-radius:12px;box-shadow:0 4px 16px rgba(0,140,255,.35);">Let's Go! 🚀</button>
      <div style="text-align:center;margin-top:10px;color:#2a4a6a;font-size:11px;">Tap <b style="color:#4a7fa0;">ℹ️ How to Navigate</b> anytime to review</div>
    </div>
  </div>`;
  document.body.appendChild(modal);
  document.getElementById('sw-help-close').onclick=()=>{
    modal.remove();
    try{ localStorage.setItem('sw_help_seen','1'); }catch(e){}
  };
  modal.addEventListener('click',e=>{ if(e.target===modal){ modal.remove(); try{localStorage.setItem('sw_help_seen','1');}catch(e){} } });
};

// Auto-show disabled — help popup removed from auto-display



window.__swSaveReport=function(){
  const app=window.__swApp;if(!window.__swCheckLogin?.())return;
  const log=[...(app?.state.sessionLog||[])],checked={},accepted=app._reportAccepted||(app._reportAccepted=new Set());
  const signature=JSON.stringify(log.map(r=>[r.t,r.label,r.from,r.to]));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  document.getElementById('sw-save-report-modal')?.remove();
  const overlay=document.createElement('section');overlay.id='sw-save-report-modal';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-label','Save and send report');
  overlay.style.cssText='position:fixed;inset:0;z-index:9999;background:#010910d9;display:grid;place-items:center;padding:16px;font:14px Arial;color:#d7ecf9;color-scheme:dark;';
  overlay.innerHTML='<div style="width:100%;max-width:500px;max-height:90dvh;overflow:auto;background:linear-gradient(145deg,#153248,#071522);border:1px solid #5195b0;border-radius:16px;padding:22px;"><header style="display:flex;gap:12px;align-items:center;"><h2 style="flex:1;font-size:21px;">Save &amp; send report</h2><button id="sw-sr-close" aria-label="Close report">×</button></header><p>'+log.length+' changes this session</p><div>'+log.map(r=>'<p style="padding:9px 0;border-bottom:1px solid #335061"><b>'+esc(r.label)+'</b> · '+esc(r.from)+' → '+esc(r.to)+'</p>').join('')+'</div><p id="sw-sr-loading">Loading team recipients…</p><div id="sw-sr-contacts"></div><p id="sw-sr-status" role="status" style="line-height:1.6;color:#ffd48a"></p><footer style="display:flex;gap:10px;margin-top:20px;"><button id="sw-sr-send" disabled>Send report</button><button id="sw-sr-save">Save only</button></footer></div>';
  document.body.append(overlay);overlay.querySelectorAll('button').forEach(b=>b.style.cssText='padding:12px 16px;background:#155b80;border:1px solid #6298b2;color:white;border-radius:7px;font:700 14px Arial;cursor:pointer;');
  const status=overlay.querySelector('#sw-sr-status'),send=overlay.querySelector('#sw-sr-send');
  const finish=()=>{app.setState({sessionLog:(app.state.sessionLog||[]).filter(r=>!log.includes(r))});};
  overlay.querySelector('#sw-sr-close').onclick=()=>overlay.remove();overlay.querySelector('#sw-sr-save').onclick=()=>{finish();overlay.remove();};
  let staff=[];
  fetch('https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json',{signal:AbortSignal.timeout(12000)}).then(r=>{if(!r.ok)throw new Error('Team contacts could not load');return r.json();}).then(cfg=>{
    staff=['Kevin','Mike','Brad'].map(name=>({name,...(cfg?.[name]||{}),pref:cfg?.[name]?.pref||'email'}));
    overlay.querySelector('#sw-sr-loading').textContent='Choose recipients. Phone alerts use push notifications.';
    const target=overlay.querySelector('#sw-sr-contacts');
    for(const c of staff){checked[c.name]=c.pref!=='none';const row=document.createElement('label');row.style.cssText='display:flex;align-items:center;gap:12px;padding:10px 0';const box=document.createElement('input');box.type='checkbox';box.checked=checked[c.name];box.disabled=c.pref==='none';box.onchange=()=>checked[c.name]=box.checked;row.append(box,document.createTextNode(c.name+' · '+({email:'Email',text:'Push notifications',push:'Push notifications',both:'Email + push',none:'Disabled in team settings'}[c.pref]||'Email')));target.append(row);}
    send.disabled=!log.length;
  }).catch(e=>{overlay.querySelector('#sw-sr-loading').textContent=e.message+'. Close and reopen to retry.';});
  send.onclick=async()=>{
    const targets=staff.filter(c=>checked[c.name]);if(!targets.length){status.textContent='Select a recipient, or choose Save only.';return;}
    send.disabled=true;send.textContent='Sending…';overlay.querySelector('#sw-sr-save').disabled=true;
    const ts=new Date().toLocaleString(),who=app.state.staffName||'Staff';
    const body='StoreWell report · '+ts+' · '+who+'\n\n'+log.map(r=>r.label+': '+r.from+' → '+r.to).join('\n');
    const failures=[],successes=[];
    for(const c of targets){
      const channels=c.pref==='both'?['email','push']:['text','push'].includes(c.pref)?['push']:['email'];
      for(const channel of channels){
        const id=signature+'|'+c.name+'|'+channel;
        if(accepted.has(id)){successes.push(c.name+' '+channel);continue;}
        try{
          if(channel==='email'){
            if(!c.email)throw new Error('no email address in team settings');
            await _sendEmail(c.email,c.name,who,body);
          }else{
            if(!window.__swNotifyReport)throw new Error('push service is still loading');
            const result=await window.__swNotifyReport(body.slice(0,1600),[c.name]);
            if(!result.sent)throw new Error('no device has report alerts enabled');
          }
          accepted.add(id);successes.push(c.name+' '+channel);
        }catch(e){failures.push(c.name+' '+channel+': '+e.message);}
      }
    }
    if(failures.length){status.textContent=(successes.length?'Accepted: '+successes.join(', ')+'. ':'')+'Still pending: '+failures.join('; ')+'. Your report is kept. Retry sends only pending recipients.';send.disabled=false;send.textContent='Retry pending';overlay.querySelector('#sw-sr-save').disabled=false;}
    else{finish();status.textContent='Accepted by the delivery services: '+successes.join(', ')+'.';send.textContent='Report sent';}
  };
};

// Joystick repositioning — re-binds every time sc-if recreates the element
(function(){
  var dragging=false, startX, startY, origLeft, origBottom;

  function getXY(e){
    if(e.touches&&e.touches[0]) return {x:e.touches[0].clientX, y:e.touches[0].clientY};
    return {x:e.clientX, y:e.clientY};
  }

  function onMove(e){
    if(!dragging) return;
    e.preventDefault();
    var p=getXY(e);
    var wrap=document.getElementById('sw-joy-wrap'); if(!wrap) return;
    var newLeft=Math.max(0,Math.min(window.innerWidth-150, origLeft+(p.x-startX)));
    var newBottom=Math.max(0,Math.min(window.innerHeight-150, origBottom-(p.y-startY)));
    wrap.style.left=newLeft+'px'; wrap.style.bottom=newBottom+'px';
  }

  function onEnd(){
    if(!dragging) return;
    dragging=false;
    var wrap=document.getElementById('sw-joy-wrap');
    if(wrap) try{ localStorage.setItem('sw_joy_pos',JSON.stringify({left:wrap.style.left,bottom:wrap.style.bottom})); }catch(e){}
  }

  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onEnd);
  document.addEventListener('touchmove', onMove, {passive:false});
  document.addEventListener('touchend', onEnd);

  function bindHandle(wrap){
    if(!wrap||wrap._dragBound) return;
    var handle=document.getElementById('sw-joy-handle');
    if(!handle) return;
    wrap._dragBound=true;

    // Restore saved position
    try{
      var pos=JSON.parse(localStorage.getItem('sw_joy_pos')||'null');
      if(pos&&pos.left&&pos.bottom){ wrap.style.left=pos.left; wrap.style.bottom=pos.bottom; wrap.style.right=''; wrap.style.top=''; }
      else if(pos&&pos.right&&pos.bottom){ wrap.style.right=pos.right; wrap.style.bottom=pos.bottom; wrap.style.left=''; wrap.style.top=''; }
    }catch(e){}

    function startDrag(e){
      e.stopPropagation(); e.preventDefault();
      dragging=true;
      var p=getXY(e);
      startX=p.x; startY=p.y;
      var rect=wrap.getBoundingClientRect();
      origLeft=rect.left; origBottom=window.innerHeight-rect.bottom;
      wrap.style.right=''; wrap.style.top='';
      wrap.style.left=origLeft+'px'; wrap.style.bottom=origBottom+'px';
    }
    handle.addEventListener('pointerdown', startDrag);
    handle.addEventListener('touchstart', startDrag, {passive:false});
  }

  // Bind now if already in DOM
  bindHandle(document.getElementById('sw-joy-wrap'));

  // Re-bind every time sc-if creates a new element
  new MutationObserver(function(){
    bindHandle(document.getElementById('sw-joy-wrap'));
  }).observe(document.body, {childList:true, subtree:true});
})();


window.__swLockPicker=function(label){
  const existing=document.getElementById('sw-lock-pop');
  if(existing) existing.remove();
  const app=window.__swApp;
  if(!app||!app.state||!app.state.staffName){ var _nt2=document.createElement('div');_nt2.style.cssText='position:fixed;top:70px;left:50%;transform:translateX(-50%);background:#1f2a37;color:#fff;font-size:14px;font-weight:900;padding:12px 24px;border-radius:32px;box-shadow:0 6px 28px rgba(0,0,0,.45);z-index:999999;pointer-events:none;white-space:nowrap;';_nt2.textContent='🔒 Log in first to change lock status';document.body.appendChild(_nt2);setTimeout(()=>_nt2.remove(),2500);if(app&&app.setState)app.setState({showLogin:true});return; }
  const statuses=[
    {st:'green',  col:'#1f9d4d', label:'Rented'},
    {st:'red',    col:'#cc2b2b', label:'Late'},
    {st:'flashred', col:'#ff4400', label:'Lock It'},
    {st:'flashgreen',col:'#00cc44',label:'Lock Off'},
    {st:'blue',   col:'#2a6fdb', label:'Reserved'},
    {st:'yellow', col:'#22c55e', label:'Rented · No Lock'},
    {st:'black',  col:'#333333', label:'N/A'},
  ];
  const cur=app&&app._statusOf?app._statusOf(label):'green';

  const pop=document.createElement('div');
  pop.id='sw-lock-pop';
  pop.style.cssText='position:fixed;bottom:30px;left:50%;transform:translateX(-50%);z-index:9999;background:rgba(255,255,255,.97);border-radius:20px;padding:12px 16px;box-shadow:0 8px 40px rgba(0,0,0,.35);font-family:Segoe UI,Arial;display:flex;flex-direction:column;align-items:center;gap:10px;border:2px solid #eee;';

  pop.innerHTML=`
    <div style="font-weight:800;font-size:13px;color:#1f2a33;letter-spacing:.3px;">Unit ${label}</div>
    <div style="display:flex;gap:10px;align-items:center;">
      ${statuses.map(s=>`
        <div onclick="window.__swApplyLock('${label}','${s.st}')" title="${s.label}" style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;padding:4px;">
          <div style="width:36px;height:36px;border-radius:50%;background:${s.col};box-shadow:0 3px 10px ${s.col}88;border:${s.st===cur?'3px solid #1f2a33':'3px solid transparent'};transition:transform .15s;${s.st==='flashred'?'animation:sw-flash-red .5s infinite;':s.st==='flashgreen'?'animation:sw-flash-green .5s infinite;':''}" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></div>
          <div style="font-size:9px;font-weight:700;color:#666;text-align:center;">${s.label}</div>
        </div>`).join('')}
    </div>
    <label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-size:11.5px;font-weight:700;color:#1f7a3d;background:#eafff1;border:1px solid #c7f0d6;border-radius:10px;padding:6px 12px;">📋 <input type="checkbox" id="sw-ready-cb" style="width:15px;height:15px;accent-color:#00b341;cursor:pointer;"/> Application inside &middot; ready to rent</label>
    <button onclick="document.getElementById('sw-lock-pop')?.remove()" style="border:none;background:#f0f0f0;color:#888;font:600 11px Segoe UI;padding:4px 14px;border-radius:10px;cursor:pointer;">Cancel</button>
  `;
  document.body.appendChild(pop);
  // "Application inside / ready to rent" checkbox — load current value + save on toggle
  try{ const _rk=(label||'').replace(/[-\s]/g,'').toUpperCase();
    fetch('https://storewell-3d-default-rtdb.firebaseio.com/lockReady/'+_rk+'.json').then(r=>r.json()).then(v=>{ const cb=document.getElementById('sw-ready-cb'); if(cb) cb.checked=!!(v&&v.ready); }).catch(()=>{});
    setTimeout(()=>{ const cb=document.getElementById('sw-ready-cb'); if(cb) cb.onchange=()=>{ const by=(window.__swApp&&window.__swApp.state&&window.__swApp.state.staffName)||'Staff'; const val=cb.checked?{ready:true,by,t:Date.now()}:null; if(window._swSet&&window._swRef&&window._swDB){ window._swSet(window._swRef(window._swDB,'lockReady/'+_rk),val).catch(()=>{}); } else { fetch('https://storewell-3d-default-rtdb.firebaseio.com/lockReady/'+_rk+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(val)}).catch(()=>{}); } }; },200);
  }catch(e){}
  // If this unit has an out-of-service note, show it at the top
  try{ const _k=(label||'').replace(/[-\s]/g,'').toUpperCase();
    fetch('https://storewell-3d-default-rtdb.firebaseio.com/lockNotes/'+_k+'.json').then(r=>r.json()).then(n=>{
      if(n&&n.note){ const pop2=document.getElementById('sw-lock-pop'); if(!pop2) return;
        const d=document.createElement('div'); d.style.cssText='font-size:11px;color:#8a5a00;background:#fff7e6;border:1px solid #ffe2a8;border-radius:9px;padding:5px 10px;max-width:250px;text-align:center;font-weight:600;';
        d.textContent='📝 '+n.note; pop2.insertBefore(d, pop2.children[1]||null);
      }
    }).catch(()=>{});
  }catch(e){}
  setTimeout(()=>{ const p=document.getElementById('sw-lock-pop'); if(p) p.remove(); },12000);
};

// Ask for a reason when a unit is marked Out of Service / N/A
window.__swAskReason=function(label){
  const k=(label||'').replace(/[-\s]/g,'').toUpperCase();
  const base='https://storewell-3d-default-rtdb.firebaseio.com';
  document.getElementById('sw-reason-modal')?.remove();
  const ov=document.createElement('div');
  ov.id='sw-reason-modal';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10001;display:flex;align-items:center;justify-content:center;font-family:Segoe UI,Arial;padding:16px;';
  ov.innerHTML=`<div style="background:#fff;border-radius:18px;max-width:360px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.4);overflow:hidden;">
    <div style="background:linear-gradient(135deg,#8893a0,#5b6b7d);padding:16px 18px;"><div style="color:#fff;font-weight:800;font-size:16px;">⚪ Unit ${label} — Out of Service</div><div style="color:#fff;opacity:.92;font-size:12px;margin-top:2px;">Add a reason (why it's not rentable)</div></div>
    <div style="padding:16px 18px;">
      <textarea id="sw-reason-txt" placeholder="e.g. broken latch, water damage, held for repair..." style="width:100%;box-sizing:border-box;min-height:84px;border:1.5px solid #dbe4ef;border-radius:10px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1f2a37;outline:none;resize:vertical;"></textarea>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button id="sw-reason-save" style="flex:1;border:none;cursor:pointer;background:linear-gradient(135deg,#00b4ff,#0066cc);color:#fff;font:700 14px Segoe UI;padding:11px;border-radius:10px;">💾 Save reason</button>
        <button id="sw-reason-skip" style="border:1.5px solid #e3eaf3;cursor:pointer;background:#f4f7fb;color:#5b6b7d;font:600 13px Segoe UI;padding:11px 16px;border-radius:10px;">Skip</button>
      </div>
    </div></div>`;
  document.body.appendChild(ov);
  fetch(base+'/lockNotes/'+k+'.json').then(r=>r.json()).then(n=>{ if(n&&n.note){ const t=document.getElementById('sw-reason-txt'); if(t&&!t.value) t.value=n.note; } }).catch(()=>{});
  const close=()=>ov.remove();
  document.getElementById('sw-reason-skip').onclick=close;
  document.getElementById('sw-reason-save').onclick=()=>{
    const note=(document.getElementById('sw-reason-txt').value||'').trim();
    const by=(window.__swApp&&window.__swApp.state&&window.__swApp.state.staffName)||'Staff';
    const _noteVal=note?{note,by,t:Date.now()}:null; if(window._swSet&&window._swRef&&window._swDB){ window._swSet(window._swRef(window._swDB,'lockNotes/'+k),_noteVal).catch(()=>{}); } else { fetch(base+'/lockNotes/'+k+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(_noteVal)}).catch(()=>{}); }
    close();
  };
  setTimeout(()=>{const t=document.getElementById('sw-reason-txt'); if(t) t.focus();},120);
};

window.__swApplyLock=function(label,st){
  const app=window.__swApp;
  if(app&&app.setStatus) app.setStatus(label,st);
  document.getElementById('sw-lock-pop')?.remove();
  // When marking Out of Service / N/A, ask for a reason
  if(st==='black'){ setTimeout(()=>{ try{ window.__swAskReason(label); }catch(e){} },350); }
  else { // clearing N/A -> remove any old note
    try{ const _k=(label||'').replace(/[-\s]/g,'').toUpperCase(); if(window._swRemove&&window._swRef&&window._swDB){ window._swRemove(window._swRef(window._swDB,'lockNotes/'+_k)).catch(()=>{}); } else { fetch('https://storewell-3d-default-rtdb.firebaseio.com/lockNotes/'+_k+'.json',{method:'DELETE'}).catch(()=>{}); } }catch(e){}
  }
  // Flash confirmation
  const colors={green:'#1f9d4d',red:'#cc2b2b',flashred:'#ff4400',flashgreen:'#00cc44',purple:'#9b30d1',blue:'#2a6fdb',yellow:'#e6c01f',black:'#333'};
  const names={green:'Rented ✓',red:'Late ✓',flashred:'Lock It ✓',flashgreen:'Lock Off ✓',blue:'Reserved ✓',yellow:'Rented · No Lock ✓',black:'N/A ✓'};
  const col=colors[st]||'#1f9d4d';
  const f=document.createElement('div');
  f.style.cssText=`position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(1);background:${col};color:#fff;font:800 18px Segoe UI;padding:12px 28px;border-radius:30px;z-index:10000;pointer-events:none;box-shadow:0 8px 32px ${col}88;transition:all .5s;`;
  f.textContent=names[st]||st;
  document.body.appendChild(f);
  setTimeout(()=>{ f.style.transform='translate(-50%,-80%) scale(1.15)'; f.style.opacity='0'; },600);
  setTimeout(()=>f.remove(),1100);
  // Refresh command center inventory if open
  setTimeout(()=>{ const inv=document.getElementById('sw-inv-list'); if(inv&&window.__swApp){const rows=[];const sc={blue:'#00aaff',red:'#ff1111',green:'#00ff44',white:'#ffffff',black:'#aaaaaa',yellow:'#ffee00',flashred:'#ff0000',flashgreen:'#00ff44',purple:'#9b30d1'};Object.keys(window.__swApp._locks||{}).sort().forEach(k=>{const rec=window.__swApp._locks[k];const s=window.__swApp._statusOf?window.__swApp._statusOf(rec.label):'green';const c=sc[s]||'#1f9d4d';const cid3='swc-'+rec.label.replace(/[^a-z0-9]/gi,'');rows.push(`<div onclick="window.__swCycleNext('${rec.label}')" oncontextmenu="event.preventDefault();window.__swApp&&window.__swApp.locate&&window.__swApp.locate('${rec.label}'.replace(/[-\\s]/g,'').toUpperCase());window.__swApp&&window.__swApp.setState&&window.__swApp.setState({showSearch:false});" title="Left-click: change status | Right-click: find on map" style="cursor:pointer;padding:4px 2px;user-select:none;transition:transform .15s;" onmouseover="this.style.transform='scale(1.12)'" onmouseout="this.style.transform='scale(1)'"><div id="${cid3}" style="width:46px;height:46px;border-radius:50%;background:${c};box-shadow:0 4px 12px ${c}99;display:flex;align-items:center;justify-content:center;"><span style="color:#000;font-size:11px;font-weight:900;font-family:'Arial Black',Impact,sans-serif;text-align:center;line-height:1.1;padding:2px;overflow:hidden;word-break:break-all;">${rec.label}</span></div></div>`);});inv.innerHTML='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;">'+rows.join('')+'</div>';} },200);
};

// Keep __swCycleStatus as alias for backward compat
window.__swCycleStatus=function(label){ window.__swCycleNext(label); };

// Dropdown menu on click — pick any status directly
window.__swCycleNext=function(label,srcEvent){
  document.getElementById('sw-drop-menu')?.remove();
  const app=window.__swApp; if(!app) return;
  if(!app.state||!app.state.staffName){ var _nt=document.createElement('div');_nt.style.cssText='position:fixed;top:70px;left:50%;transform:translateX(-50%);background:#1f2a37;color:#fff;font-size:14px;font-weight:900;padding:12px 24px;border-radius:32px;box-shadow:0 6px 28px rgba(0,0,0,.45);z-index:999999;pointer-events:none;white-space:nowrap;';_nt.textContent='🔒 Log in first to change lock status';document.body.appendChild(_nt);setTimeout(()=>_nt.remove(),2500);if(app.setState)app.setState({showLogin:true});return; }
  const cols={green:'#22c55e',red:'#ef4444',flashred:'#ff0000',flashgreen:'#00ff44',purple:'#9b30d1',blue:'#3b82f6',yellow:'#22c55e',black:'#6b7280'};
  const lbls={green:'Rented',red:'Late',flashred:'Lock It',flashgreen:'Lock Off',purple:'Ready to Rent',blue:'Reserved',yellow:'Rented · No Lock',black:'N/A'};
  const cur=app._statusOf?app._statusOf(label):'green';
  const cid='swc-'+label.replace(/[^a-z0-9]/gi,'');
  const circleEl=document.getElementById(cid);
  const menu=document.createElement('div');
  menu.id='sw-drop-menu';
  menu.style.cssText='position:fixed;background:#fff;border-radius:14px;box-shadow:0 8px 40px rgba(0,0,0,.35);z-index:99999;min-width:180px;overflow:hidden;font-family:Arial Black,sans-serif;';
  const hdr=document.createElement('div');
  hdr.style.cssText='background:linear-gradient(135deg,#FF6B6B,#FFD93D,#6BCB77,#4D96FF);color:#fff;font-size:13px;font-weight:900;padding:10px 14px;text-align:center;letter-spacing:1px;';
  hdr.textContent='Unit '+label;
  menu.appendChild(hdr);
  const curRow=document.createElement('div');
  curRow.style.cssText='padding:5px 14px;font-size:10px;color:#888;background:#f9f9f9;border-bottom:1px solid #eee;';
  curRow.textContent='Now: '+(lbls[cur]||cur);
  menu.appendChild(curRow);
  Object.entries(lbls).forEach(([st,lbl])=>{
    const row=document.createElement('div');
    const active=st===cur;
    row.style.cssText='display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;background:'+(active?'#f0f9ff':'#fff')+';border-left:4px solid '+(active?cols[st]:'transparent')+';';
    row.onmouseover=()=>row.style.background='#f5f5f5';
    row.onmouseout=()=>row.style.background=active?'#f0f9ff':'#fff';
    const fa=st==='flashred'?'animation:sw-flash-red .5s infinite;':st==='flashgreen'?'animation:sw-flash-green .5s infinite;':'';
    const dot=document.createElement('div');
    dot.style.cssText = (st==='yellow')
      ? 'width:16px;height:16px;border-radius:4px;background:#22c55e;flex-shrink:0;box-shadow:0 0 0 3px #eab308, 0 2px 6px rgba(0,0,0,.25);'
      : 'width:16px;height:16px;border-radius:50%;background:'+cols[st]+';flex-shrink:0;box-shadow:0 2px 6px '+cols[st]+'88;'+fa;
    const span=document.createElement('span');
    span.style.cssText='font-size:13px;font-weight:900;color:#222;flex:1;';
    span.textContent=lbl;
    row.appendChild(dot);row.appendChild(span);
    if(active){const chk=document.createElement('span');chk.style.cssText='color:'+cols[st]+';font-size:15px;';chk.textContent='✓';row.appendChild(chk);}
    row.onclick=(e)=>{
      e.stopPropagation();app.setStatus(label,st);
      const el=document.getElementById(cid);
      if(el){el.style.background=cols[st];el.style.boxShadow='0 4px 12px '+cols[st]+'99';el.style.animation=fa||'';}
      menu.remove(); document.removeEventListener('click',window.__swDropClose); window.__swDropClose=null;
      const toast=document.createElement('div');
      toast.style.cssText='position:fixed;top:70px;left:50%;transform:translateX(-50%);background:'+cols[st]+';color:#fff;font-size:14px;font-weight:900;padding:11px 26px;border-radius:32px;box-shadow:0 6px 28px '+cols[st]+'99;z-index:999999;pointer-events:none;white-space:nowrap;transition:opacity .3s;';
      toast.textContent='Unit '+label+' → '+lbl;
      document.body.appendChild(toast);
      setTimeout(()=>{toast.style.opacity='0';},1800);
      setTimeout(()=>toast.remove(),2200);
    };
    menu.appendChild(row);
  });
  const fr=document.createElement('div');
  fr.style.cssText='display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;background:#f0f8ff;border-top:2px solid #e0e0e0;';
  fr.onmouseover=()=>fr.style.background='#dbeafe';
  fr.onmouseout=()=>fr.style.background='#f0f8ff';
  const md=document.createElement('div');md.style.cssText='width:16px;height:16px;border-radius:50%;background:#0ea5e9;flex-shrink:0;';
  const ms=document.createElement('span');ms.style.cssText='font-size:13px;font-weight:900;color:#0ea5e9;';ms.textContent='Find on Map';
  fr.appendChild(md);fr.appendChild(ms);
  fr.onclick=(e)=>{e.stopPropagation();const k=label.replace(/[-\s]/g,'').toUpperCase();if(app.locate)app.locate(k);menu.remove();};
  menu.appendChild(fr);
  document.body.appendChild(menu);
  if(circleEl){
    const r=circleEl.getBoundingClientRect();
    let top=r.bottom+6,left=r.left-20;
    if(top+370>window.innerHeight)top=r.top-375;
    if(left+185>window.innerWidth)left=window.innerWidth-190;
    if(left<5)left=5;
    menu.style.top=top+'px';menu.style.left=left+'px';
  } else if(srcEvent&&srcEvent.clientX){
    let top=srcEvent.clientY+10,left=srcEvent.clientX-90;
    if(top+370>window.innerHeight)top=srcEvent.clientY-375;
    if(left+185>window.innerWidth)left=window.innerWidth-190;
    if(left<5)left=5;
    menu.style.top=top+'px';menu.style.left=left+'px';
  } else {
    menu.style.top='50%';menu.style.left='50%';menu.style.transform='translate(-50%,-50%)';
  }
  if(window.__swDropClose) document.removeEventListener('click',window.__swDropClose);
  window.__swDropClose=function(){menu.remove();document.removeEventListener('click',window.__swDropClose);window.__swDropClose=null;};
  setTimeout(()=>{ if(window.__swDropClose) document.addEventListener('click',window.__swDropClose); },120);
}

window.__swCheckLogin=function(){
  return localStorage.getItem('sw_user')||null;
};
window.__swLogout=function(){
  localStorage.removeItem('sw_user');localStorage.removeItem('sw_staff_name');
  location.reload();
};
window.__swLoginGate=async function(sc){
  // If already logged in, just activate edit mode directly
  const existing=window.__swCheckLogin();
  if(existing){
    if(sc&&sc.setState){
      try{localStorage.setItem('sw_staff_name',existing);}catch(er){}
      sc.setState({editMode:true,staffName:existing,showLogin:false});
      if(window.__swStaffOnline) window.__swStaffOnline(existing);
    }
    return;
  }
  // Fetch staff from Firebase
  let staffMap={};
  try{
    const _sr5r=await fetch('https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json');
    const cfg=(_sr5r.ok?(await _sr5r.json()):{})||{};
    ['Kevin','Mike','Brad'].forEach(n=>{
      if(cfg[n]&&cfg[n].email&&cfg[n].phone)
        staffMap[cfg[n].email.toLowerCase()]={name:n,pin:cfg[n].phone.slice(-4)};
    });
  }catch(e){}

  return new Promise(resolve=>{
    // Inject shake style
    if(!document.getElementById('sw-login-style')){
      const s=document.createElement('style');
      s.id='sw-login-style';
      s.textContent='@keyframes sw-lshake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}';
      document.head.appendChild(s);
    }
    const overlay=document.createElement('div');
    overlay.id='sw-login-overlay';
    overlay.style.cssText='position:fixed;inset:0;background:#0d1117;z-index:99999;display:flex;align-items:center;justify-content:center;font-family:Segoe UI,Arial;';
    overlay.innerHTML=`<div style="background:#1f2a33;border-radius:20px;padding:32px 28px;width:320px;text-align:center;box-shadow:0 16px 56px rgba(0,0,0,.7);">
      <div style="font-size:40px;margin-bottom:8px;">🏪</div>
      <div style="color:#fff;font-size:19px;font-weight:800;margin-bottom:2px;">StoreWell</div>
      <div style="color:#8a9baa;font-size:12px;margin-bottom:24px;">Staff Login</div>
      <form id="sw-login-form" autocomplete="on" style="text-align:left;">
        <div style="margin-bottom:12px;">
          <label style="color:#8a9baa;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px;">Email</label>
          <input id="sw-login-email" name="username" type="email" autocomplete="username" placeholder="your@email.com"
            style="width:100%;box-sizing:border-box;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.15);border-radius:10px;padding:11px 14px;font-size:14px;color:#fff;outline:none;" />
        </div>
        <div style="margin-bottom:20px;">
          <label style="color:#8a9baa;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px;">Password</label>
          <input id="sw-login-pw" name="password" type="password" autocomplete="current-password" placeholder="••••"
            style="width:100%;box-sizing:border-box;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.15);border-radius:10px;padding:11px 14px;font-size:14px;color:#fff;outline:none;" />
        </div>
        <button type="submit" style="width:100%;border:none;cursor:pointer;background:#2a6fdb;color:#fff;font:700 14px 'Segoe UI';padding:12px;border-radius:10px;">Sign In</button>
      </form>
      <div id="sw-login-err" style="color:#e05555;font-size:12px;font-weight:700;min-height:16px;margin-top:10px;text-align:center;"></div>
    </div>`;
    document.body.appendChild(overlay);

    function shake(){
      const box=overlay.querySelector('div');
      box.style.animation='sw-lshake .4s ease';
      setTimeout(()=>{ box.style.animation=''; },400);
    }
    function tryLogin(){
      const email=overlay.querySelector('#sw-login-email').value.trim().toLowerCase();
      const pw=overlay.querySelector('#sw-login-pw').value.trim();
      const staff=staffMap[email];
      if(!staff){ overlay.querySelector('#sw-login-err').textContent='Email not recognized.'; shake(); return; }
      if(staff.pin!==pw){ overlay.querySelector('#sw-login-err').textContent='Incorrect password.'; shake(); overlay.querySelector('#sw-login-pw').value=''; return; }
      localStorage.setItem('sw_user',staff.name);
      overlay.remove();
      resolve(staff.name);
      // Activate edit mode on the state component
      if(sc && sc.setState){
        try{ localStorage.setItem('sw_staff_name',staff.name); }catch(er){}
        sc.setState({editMode:true,staffName:staff.name,showLogin:false});
        if(window.__swStaffOnline) window.__swStaffOnline(staff.name);
      }
    }
    overlay.querySelector('#sw-login-form').addEventListener('submit',function(e){
      e.preventDefault(); tryLogin();
    });
  });
};



window.__swAdminSave=async function(contacts,ejsKey){
  const _sr6=await fetch('https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json');const existing=await _sr6.json()||{};
  const obj={_ejsKey:ejsKey,_tbKey:existing._tbKey||''};
  contacts.forEach(c=>{obj[c.name]={email:c.email||'',phone:c.phone||'',carrier:c.carrier||'',pref:c.pref||'email'};});
  await set(ref(_db,'staffConfig'),obj);
};
window.__swStaffReport=async function(fromName,changes){
  if(!fromName||!changes?.length)return;
  push(ref(_db,'staffReports'),{name:fromName,changes,ts:Date.now()}).catch(()=>console.warn('Staff report activity could not be recorded'));
  const _sr7=await fetch('https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json');const cfg=await _sr7.json()||{};const key=cfg._ejsKey||'';
  const msg=fromName+' updated StoreWell ('+new Date().toLocaleString()+'):\n'+changes.map(c=>'• Unit '+c.label+': '+c.from+' → '+c.to).join('\n');
  for(const name of['Kevin','Mike','Brad']){
    if(name===fromName)continue;
    const c=cfg[name]||{},pref=c.pref||'none';
    if((pref==='email'||pref==='both')&&c.email)await _sendEmail(c.email,name,fromName,msg,key);
    if(pref==='text'||pref==='push'||pref==='both')await window.__swNotifyReport?.(fromName+': '+msg,[name]);
  }
};
window.__swStaffOnline=(n)=>{push(ref(_db,'staffActivity'),{name:n,action:'logged in',ts:Date.now()});};
class SWNet{
  constructor(comp,uid){this.comp=comp;this.uid=uid;this.name='';this.avatars={};this._avatarHash={};this._lastMsgT=0;this._iv=null;this._seen={};this._pruneIv=null;}
  join(name){this.name=name;const pr=ref(_db,'players/'+this.uid);
    // Remove stale entries with same name from other sessions before joining
    fetch('https://storewell-3d-default-rtdb.firebaseio.com/players.json').then(r=>r.json()).then(pl=>{Object.entries(pl||{}).forEach(([u,p])=>{if(u!==this.uid&&p.name===name){remove(ref(_db,'players/'+u)).catch(()=>{});}});}).catch(()=>{});
    const _char=window._swGetChar?window._swGetChar():{};
    set(pr,{name,x:0,y:0,z:0,h:0,t:Date.now(),char:_char}).catch(()=>{clearInterval(this._iv);clearInterval(this._pruneIv);});onDisconnect(pr).remove().catch(()=>{});
    onValue(ref(_db,'players'),snap=>{const pl=snap.val()||{};try{this.comp.setState({online:Object.entries(pl).map(([u,p])=>({name:p.name,me:u===this.uid}))});}catch(e){}this._sync(pl);});
    onValue(ref(_db,'messages'),snap=>{const m=snap.val()||{};Object.values(m).filter(x=>x.t>this._lastMsgT&&x.uid!==this.uid).sort((a,b)=>a.t-b.t).forEach(x=>{this._lastMsgT=x.t;try{this.comp._pushMsg(x.name,x.text);}catch(e){}});});
    this._iv=setInterval(()=>this._pos(),150);
    this._pruneIv=setInterval(()=>this._pruneStale(),4000);}
  send(t){push(ref(_db,'messages'),{uid:this.uid,name:this.name,text:t,t:Date.now()});try{this.comp._pushMsg(this.name,t);}catch(e){}}
  notify(){}
  _pos(){if(window.__swDeckVisible||document.hidden)return;const w=this.comp.walker;if(!w||!w.g)return;const p=w.g.position;
    // Idle presence: if this session hasn't moved in a while, stop broadcasting and remove
    // its own record so an abandoned/open tab doesn't linger as a ghost for everyone.
    var now=Date.now();
    if(!this._lastMovePos){ this._lastMovePos=p.clone(); this._lastMoveT=now; }
    if(p.distanceTo(this._lastMovePos)>0.05){ this._lastMovePos.copy(p); this._lastMoveT=now; this._idleGone=false; }
    if(now-this._lastMoveT>120000){ if(!this._idleGone){ try{ remove(ref(_db,'players/'+this.uid)).catch(()=>{}); }catch(e){} this._idleGone=true; } return; }
    const _char=window._swGetChar?window._swGetChar():{};update(ref(_db,'players/'+this.uid),{x:Math.round(p.x*10)/10,y:Math.round(p.y*10)/10,z:Math.round(p.z*10)/10,h:Math.round((w.h||0)*100)/100,t:now,char:_char,name:(((window._swGetChar&&window._swGetChar())||{}).nick)||(typeof _myName==="function"?(_myName()||this.name):this.name)||'Guest'}).catch(()=>{clearInterval(this._iv);clearInterval(this._pruneIv);});}
  _sync(pl){this._lastPl=pl;const sc=this.comp.scene,T=window.THREE;if(!sc||!T)return;
    const nowL=Date.now(); if(!this._seen)this._seen={};
    for(const[uid,p]of Object.entries(pl)){
      if(uid===this.uid)continue;
      // Track freshness by when THEIR timestamp last changed (clock-skew proof)
      if(!this._seen[uid]||this._seen[uid].t!==p.t){ this._seen[uid]={t:p.t,at:nowL}; }
      // Inactive too long → drop them from the screen
      if(nowL-this._seen[uid].at>30000){ if(this.avatars[uid]){sc.remove(this.avatars[uid]);delete this.avatars[uid];delete this._avatarHash[uid];} continue; }
      const ch=JSON.stringify(p.char||{});
      if(!this.avatars[uid]||this._avatarHash[uid]!==ch){
        if(this.avatars[uid]){sc.remove(this.avatars[uid]);}
        const g=window._swBuildAvatar(T,uid,p);
        sc.add(g);this.avatars[uid]=g;this._avatarHash[uid]=ch;
      }
      const av=this.avatars[uid];
      if(p.x!==undefined){av.position.set(p.x,p.y||0,p.z);av.rotation.y=p.h||0;}
    }
    for(const uid of Object.keys(this.avatars)){if(!pl[uid]){sc.remove(this.avatars[uid]);delete this.avatars[uid];delete this._avatarHash[uid];delete this._seen[uid];}}}
  // Periodic sweep: remove avatars whose owner stopped updating (left / went inactive)
  _pruneStale(){ const nowL=Date.now();
    // Permanently delete dead records from the shared DB (owner left / tab closed → timestamp frozen).
    const pl=this._lastPl||{};
    for(const uid of Object.keys(pl)){ if(uid===this.uid) continue; const p=pl[uid]||{}; if(nowL-(p.t||0)>60000){ try{ remove(ref(_db,'players/'+uid)).catch(()=>{}); }catch(e){} } }
    const sc=this.comp&&this.comp.scene; if(!sc)return;
    for(const uid of Object.keys(this.avatars)){ const s=this._seen&&this._seen[uid]; if(!s||nowL-s.at>30000){ sc.remove(this.avatars[uid]); delete this.avatars[uid]; delete this._avatarHash[uid]; } } }
  destroy(){clearInterval(this._iv);clearInterval(this._pruneIv);remove(ref(_db,'players/'+this.uid)).catch(()=>{});}
}
window.__swSetup=function(comp){
  // Skip Firebase anonymous auth — use stable local device ID
  let uid=localStorage.getItem('sw_device_uid');
  if(!uid){uid='dev-'+Math.random().toString(36).slice(2)+'-'+Date.now().toString(36);localStorage.setItem('sw_device_uid',uid);}
  try{ const net=new SWNet(comp,uid);comp._net=net;net.join(_myName()||'Guest'); }catch(e){ console.warn('SWNet init skipped',e); }
  try{ if(window._swMakeControls) window._swMakeControls(); }catch(e){}

  // Add look sensitivity slider for mobile tuning
  const isMob=/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)||navigator.maxTouchPoints>0;
  // Controls are built by the bulletproof window._swMakeControls() (see bottom of file).
  try{ if(window._swMakeControls) window._swMakeControls(); }catch(e){}
  setTimeout(()=>{
      const wrap=document.getElementById('sw-joy-wrap');
      if(!wrap||wrap._swJoyTouchBound) return;
      wrap._swJoyTouchBound=true;
      // Find the joystick circle (second child, the big round div)
      const circle=wrap.querySelector('div:not(#sw-joy-handle)');
      const target=circle||wrap;
      target.addEventListener('touchstart',e=>{
        e.preventDefault();
        e.stopPropagation();
        comp._joyStart(e);
      },{passive:false,capture:true});
    },1500);
};
