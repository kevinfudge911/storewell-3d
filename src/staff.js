
import{initializeApp}from"firebase/app";
import{getDatabase,ref,set,update,push,remove,get,onValue,onDisconnect}from"firebase/database";
import{getAuth,signInAnonymously}from"firebase/auth";
const _app=initializeApp({apiKey:"AIzaSyBdYyhNaNJs-Xv8Fe4bOuAoXWNOb_1D_94",authDomain:"storewell-3d.firebaseapp.com",databaseURL:"https://storewell-3d-default-rtdb.firebaseio.com",projectId:"storewell-3d",storageBucket:"storewell-3d.firebasestorage.app",messagingSenderId:"1093355976155",appId:"1:1093355976155:web:33b21794eaf968d006e3fe"});
const _db=getDatabase(_app),_auth=getAuth(_app);
window._swDB=_db;
window.__swMobileLook=(function(){
  // Always init slider values from localStorage so they work regardless of device detection
  try{ const sv=localStorage.getItem('sw_look_sens'); if(sv!=null) window._swLookSens=parseFloat(sv);
       const wv=localStorage.getItem('sw_walk_spd'); if(wv!=null) window._swWalkSpd=parseFloat(wv);
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
    for(const t of e.changedTouches){
      if(t.identifier!==lookId) continue;
      const dx=t.clientX-lx, dy=t.clientY-ly;
      lx=t.clientX; ly=t.clientY;
      const app=window.__swApp;
      if(!app||!app.cur) continue;
      const _s=(window._swLookSens!=null?window._swLookSens:0.0008);
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
  if(!key||!to)return;
  try{await fetch('https://api.emailjs.com/api/v1.0/email/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({service_id:'service_storewell',template_id:'sw_notify',user_id:key,template_params:{to_email:to,to_name:toName,from_name:from,message:msg}})});}catch(e){console.warn('email err',e);}
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



window.__swPanelOpen=async function(){
  // Prevent double-open
  if(document.getElementById('sw-cmd-panel')) return;

  const app=window.__swApp;

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

  // Build panel HTML
  const panel=document.createElement('div');
  panel.id='sw-cmd-panel';
  // Restore saved position
  let panelLeft='auto', panelTop='60px', panelRight='16px';
  try{ const p=JSON.parse(localStorage.getItem('sw_cmd_pos')||'null'); if(p){panelLeft=p.left;panelTop=p.top;panelRight=p.right||'auto';} }catch(e){}
  panel.style.cssText='position:fixed;top:'+panelTop+';right:'+panelRight+';left:'+panelLeft+';width:280px;height:auto;max-height:82vh;background:#ffffff;border-radius:18px;z-index:9000;display:flex;flex-direction:column;animation:sw-slidein .25s ease;box-shadow:0 12px 48px rgba(0,0,0,.25);overflow:hidden;';

  const contacts=['Kevin','Mike','Brad'].map(n=>({
    name:n,
    email:(cfg[n]&&cfg[n].email)||'',
    phone:(cfg[n]&&cfg[n].phone)||'',
    pref:(cfg[n]&&cfg[n].pref)||'email',
    color:n==='Kevin'?'#2a6fdb':n==='Mike'?'#1f9d4d':'#9b3fcf'
  }));

  function prefOpts(val){
    return ['email','text','both','none'].map(v=>`<option value="${v}"${v===val?' selected':''}>${{email:'Email only',text:'Text only',both:'Email + Text',none:'No notifications'}[v]}</option>`).join('');
  }

  function buildInvRows(){
    if(!app||!app._locks) return '<div style="color:#999;font-size:12px;padding:16px;text-align:center;">No data</div>';
    const statusColor={blue:'#00aaff',red:'#ff1111',green:'#00ff44',white:'#ffffff',black:'#aaaaaa',yellow:'#ffee00',flashred:'#ff0000',flashgreen:'#00ff44'};
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
    return entries.slice().reverse().map(r=>{
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
      const res=await fetch('https://storewell-3d-default-rtdb.firebaseio.com/lockLog.json');
      const data=await res.json()||{};
      const entries=Object.values(data||{}).sort((a,b)=>b.t-a.t).slice(0,200);
      const logEl=document.getElementById('sw-log-list');
      const ovEl=document.getElementById('sw-ov-log');
      if(logEl) logEl.innerHTML=buildLogRows(entries);
      if(ovEl) ovEl.innerHTML=buildLogRows(entries.slice(0,5));
    }catch(e){ console.warn('log load error',e); }
  }

  function buildStats(){
    if(!app||!app._locks) return '';
    const counts={};
    Object.keys(app._locks).forEach(k=>{
      const st=app._statusOf?app._statusOf(app._locks[k].label):'green';
      counts[st]=(counts[st]||0)+1;
    });
    const total=Object.keys(app._locks).length;
    const rented=(counts.green||0)+(counts.white||0);
    const lockedOut=counts.red||0;
    const reserved=counts.blue||0;
    const outOfSvc=counts.black||0;
    const needLock=counts.flashred||0;
    const removeLock=counts.flashgreen||0;
    const card=(val,lbl,col,bg)=>`<div style="background:${bg};border-radius:12px;padding:10px 8px;text-align:center;"><div style="font-size:26px;font-weight:900;color:${col};line-height:1;">${val}</div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:${col}99;margin-top:3px;">${lbl}</div></div>`;
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
      <div style="grid-column:1/-1;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:10px;text-align:center;"><div style="font-size:32px;font-weight:900;color:#fff;line-height:1;">${total}</div><div style="font-size:10px;font-weight:800;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:.5px;">Total Units</div></div>
      ${card(rented,'Rented','#1f9d4d','#e8faf0')}
      ${card(lockedOut,'Locked Out','#cc2b2b','#fef0f0')}
      ${card(reserved,'Reserved','#2a6fdb','#eef3ff')}
      ${card(outOfSvc,'Out of Svc','#888','#f5f5f5')}
      ${needLock?card(needLock,'Lock It!','#ff4400','#fff3ee'):''}
      ${removeLock?card(removeLock,'Remove','#00aa44','#efffef'):''}
    </div>`;
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

    <div style="display:flex;background:#f8f9fa;border-bottom:2px solid #eee;">
      <button class="sw-tab-btn active" data-tab="overview" style="flex:1;padding:9px 4px;font-size:10px;color:#666;border:none;background:transparent;cursor:pointer;font-weight:700;">📊 Stats</button>
      <button class="sw-tab-btn" data-tab="inventory" style="flex:1;padding:9px 4px;font-size:10px;color:#666;border:none;background:transparent;cursor:pointer;font-weight:700;">🔒 Units</button>
      <button class="sw-tab-btn" data-tab="log" style="flex:1;padding:9px 4px;font-size:10px;color:#666;border:none;background:transparent;cursor:pointer;font-weight:700;">📋 Log</button>
      <button class="sw-tab-btn" data-tab="contacts" style="flex:1;padding:9px 4px;font-size:10px;color:#666;border:none;background:transparent;cursor:pointer;font-weight:700;">👥 Team</button>
    </div>

    <div id="sw-panel-body" style="flex:1;overflow-y:auto;padding:12px;background:#fff;">

      <div id="sw-tab-overview">
        ${buildStats()}
        <div style="color:#4a6380;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;">Recent</div>
        <div id="sw-ov-log" style="max-height:120px;overflow-y:auto;">${'<div style="color:#4a6380;font-size:12px;text-align:center;padding:8px;">Loading...</div>'}</div>
        <div style="margin-top:12px;display:flex;gap:6px;">
          <button id="sw-send-report" style="flex:1;border:none;cursor:pointer;background:linear-gradient(135deg,#FF6B6B,#ee0979);color:#fff;font:700 12px Segoe UI;padding:9px;border-radius:8px;box-shadow:0 3px 10px rgba(238,9,121,.3);">📤 Save & Report</button>
          <button id="sw-logout-btn" style="border:2px solid #eee;cursor:pointer;background:#f8f9fa;color:#666;font:600 11px Segoe UI;padding:9px 10px;border-radius:8px;">Exit</button>
        </div>
      </div>

      <div id="sw-tab-inventory" style="display:none;">
        <input id="sw-inv-search" type="text" placeholder="🔍 Search unit..." style="width:100%;box-sizing:border-box;background:#f4f7fb;border:1.5px solid #dbe4ef;border-radius:10px;padding:10px 12px;font-size:13px;color:#1f2a37;outline:none;margin-bottom:10px;"/>
        <div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap;">
          ${[{f:'all',col:'#667eea',lbl:'All'},{f:'green',col:'#1f9d4d',lbl:'Rented'},{f:'red',col:'#cc2b2b',lbl:'Late'},{f:'flashred',col:'#ff4400',lbl:'Lock It'},{f:'flashgreen',col:'#00cc44',lbl:'Remove'},{f:'blue',col:'#2a6fdb',lbl:'Resv'},{f:'yellow',col:'#e6c01f',lbl:'Pend'},{f:'black',col:'#555',lbl:'N/A'}].map(({f,col,lbl})=>`<button class="sw-inv-filter" data-filter="${f}" style="border:2px solid ${f==='all'?col+'88':'#eee'};cursor:pointer;background:${f==='all'?col+'22':'#f8f9fa'};color:#333;font:700 9px Segoe UI;padding:3px 7px;border-radius:12px;display:flex;align-items:center;gap:4px;"><div style="width:8px;height:8px;border-radius:50%;background:${col};flex-shrink:0;"></div>${lbl}</button>`).join('')}
        </div>
        <div id="sw-inv-list">${buildInvRows()}</div>
      </div>

      <div id="sw-tab-log" style="display:none;">
        <div id="sw-log-list"><div style="color:#4a6380;font-size:12px;text-align:center;padding:8px;">Loading...</div></div>
        <button id="sw-send-report2" style="margin-top:10px;width:100%;border:none;cursor:pointer;background:linear-gradient(135deg,#B22234,#8b1a1a);color:#fff;font:700 12px Segoe UI;padding:9px;border-radius:8px;">📤 Save & Report</button>
        <div id="sw-report-sent2" style="display:none;color:#00d68f;font-size:11px;font-weight:700;text-align:center;margin-top:6px;"></div>
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
  `;

  document.body.appendChild(panel);
  loadFirebaseLog();
  // Make panel draggable from header
  (function(){
    const hdr=document.getElementById('sw-panel-drag');
    if(!hdr) return;
    let ox=0,oy=0,mx=0,my=0;
    hdr.addEventListener('pointerdown',e=>{
      if(e.target.id==='sw-panel-close') return;
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
      const stColors={blue:'#00b4ff',red:'#ff4444',green:'#00d68f',white:'#94a3b8',black:'#475569',yellow:'#f59e0b',flashred:'#ff6666',flashgreen:'#66ff99'};
      const stLabels={blue:'Reserved',red:'Locked Out',green:'Rented',white:'Available',black:'Out of Service',yellow:'Pending',flashred:'Need to Lock',flashgreen:'Lock Off'};
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
  const sc2={blue:'#00aaff',red:'#ff1111',green:'#00ff44',white:'#ffffff',black:'#aaaaaa',yellow:'#ffee00',flashred:'#ff0000',flashgreen:'#00ff44'};
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
  document.getElementById('sw-send-report2').onclick=()=>{ panel.remove(); if(window.__swSaveReport) window.__swSaveReport(); };

  // ── Logout ──
  document.getElementById('sw-logout-btn').onclick=()=>{
    panel.remove();
    if(app&&app.setState){ try{localStorage.removeItem('sw_staff_name');localStorage.removeItem('sw_user');}catch(e){} app.setState({editMode:false,staffName:'',pickUnit:null,showInv:false}); }
  };

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
};

window.__swAdminOpen=async function(){
  const _sr3=await fetch('https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json');const cfg=await _sr3.json()||{};
  const contacts=['Kevin','Mike','Brad'].map(n=>({name:n,color:SC[n],email:'',phone:'',carrier:'',pref:'email',...(cfg[n]||{})}));
  const modal=document.getElementById('sw-admin-modal');
  if(!modal)return;
  const prefOpts=(val)=>['email','text','both','none'].map(v=>`<option value="${v}"${v===val?' selected':''}>${{email:'Email only',text:'Text only',both:'Email + Text',none:'No notifications'}[v]}</option>`).join('');
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

window.__swCommandCenter=async function(){
  const app=window.__swApp;
  // Command Center requires login
  if(app&&app.state&&app.state.editMode){
    if(window.__swPanelOpen) window.__swPanelOpen();
    return;
  }
  if(window.__swLoginGate){
    const sc=app;
    await window.__swLoginGate(sc);
    // After login, open panel
    setTimeout(()=>{ if(window.__swPanelOpen) window.__swPanelOpen(); }, 150);
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



window.__swSaveReport=async function(){
  const app=window.__swApp;
  const log=(app&&app.state&&app.state.sessionLog)||[];

  // Fetch contacts from Firebase
  let cfg={};
  try{ const _sr4=await fetch('https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json'); cfg=await _sr4.json()||{}; }catch(e){}
  const staff=['Kevin','Mike','Brad'].map(n=>({
    name:n,
    email:(cfg[n]&&cfg[n].email)||'',
    phone:(cfg[n]&&cfg[n].phone)||'',
    pref:(cfg[n]&&cfg[n].pref)||'email',
    color:n==='Kevin'?'#2a6fdb':n==='Mike'?'#1f9d4d':'#9b3fcf'
  })).filter(c=>c.email||c.phone);

  const existing=document.getElementById('sw-save-report-modal');
  if(existing) existing.remove();

  const overlay=document.createElement('div');
  overlay.id='sw-save-report-modal';
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9200;display:flex;align-items:center;justify-content:center;padding:16px;font-family:Segoe UI,Arial;';

  const checked={};
  staff.forEach(c=>{ checked[c.name]=c.pref!=='none'; });

  function render(){
    const stColors={green:'#00d68f',red:'#ff4444',blue:'#00b4ff',yellow:'#f59e0b',black:'#94a3b8',flashred:'#ff6666',flashgreen:'#66ff99',white:'#94a3b8'};
    overlay.innerHTML=`<div style="background:#0f1923;border:1px solid #1e3a5f;border-radius:20px;width:100%;max-width:420px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.8);">
      <div style="padding:20px 20px 16px;border-bottom:1px solid #1e3a5f;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="color:#00b4ff;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">Session Report</div>
          <div style="color:#e2e8f0;font-size:16px;font-weight:800;margin-top:2px;">Save & Notify</div>
        </div>
        <button id="sw-sr-close" style="border:none;cursor:pointer;background:#0d1f35;border:1px solid #1e3a5f;color:#8ab4d4;border-radius:8px;width:30px;height:30px;font-size:16px;">×</button>
      </div>

      <div style="padding:16px 20px;border-bottom:1px solid #0d1f35;">
        <div style="color:#4a6380;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;">Changes This Session (${log.length})</div>
        ${log.length?log.slice().reverse().map(r=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #0d1f35;">
            <div>
              <div style="color:#e2e8f0;font-size:13px;font-weight:700;">${r.label}</div>
              <div style="color:#4a6380;font-size:11px;">${r.from} → <b style="color:#7dd3fc;">${r.to}</b></div>
            </div>
            <div style="color:#2a4a6a;font-size:10px;">${new Date(r.t).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
          </div>`).join('')
        :'<div style="color:#4a6380;font-size:13px;text-align:center;padding:12px;">No changes this session</div>'}
      </div>

      <div style="padding:16px 20px;border-bottom:1px solid #0d1f35;">
        <div style="color:#4a6380;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;">Who to Notify</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${staff.map(c=>`
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border-radius:10px;background:${checked[c.name]?'#0d2d4a':'#0a1520'};border:1px solid ${checked[c.name]?'#1e5080':'#1a2d46'};">
              <input type="checkbox" data-name="${c.name}" ${checked[c.name]?'checked':''} style="width:16px;height:16px;accent-color:#00b4ff;cursor:pointer;flex-shrink:0;"/>
              <div style="width:32px;height:32px;border-radius:50%;background:${c.color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:14px;flex-shrink:0;">${c.name[0]}</div>
              <div style="flex:1;">
                <div style="color:#e2e8f0;font-size:13px;font-weight:700;">${c.name}</div>
                <div style="color:#4a6380;font-size:11px;">${{email:'📧 Email only',text:'💬 Text only',both:'📧💬 Email + Text',none:'🔕 No notifications'}[c.pref]||'📧 Email'}</div>
              </div>
            </label>`).join('')}
        </div>
      </div>

      <div style="padding:16px 20px;display:flex;gap:8px;">
        <button id="sw-sr-send" class="sw-btn-primary" style="flex:1;border:none;cursor:pointer;background:linear-gradient(135deg,#00b4ff,#0066cc);color:#fff;font:700 14px Segoe UI;padding:12px;border-radius:10px;box-shadow:0 4px 16px rgba(0,140,255,.3);">📤 Send Report</button>
        <button id="sw-sr-save" style="border:1px solid #1e3a5f;cursor:pointer;background:#0d1f35;color:#8ab4d4;font:600 13px Segoe UI;padding:12px 16px;border-radius:10px;">Save Only</button>
      </div>
      <div id="sw-sr-status" style="display:none;text-align:center;padding:0 20px 16px;font-size:13px;font-weight:700;color:#00d68f;"></div>
    </div>`;

    overlay.querySelectorAll('input[type=checkbox]').forEach(cb=>{
      cb.addEventListener('change',()=>{ checked[cb.dataset.name]=cb.checked; render(); });
    });

    const close=()=>overlay.remove();
    document.getElementById('sw-sr-close').onclick=close;

    document.getElementById('sw-sr-save').onclick=()=>{
      if(app&&app.setState) app.setState({sessionLog:[]});
      close();
    };

    document.getElementById('sw-sr-send').onclick=async()=>{
      if(!log.length){ close(); return; }
      const targets=staff.filter(c=>checked[c.name]);
      const btn=document.getElementById('sw-sr-send');
      btn.textContent='Sending...'; btn.disabled=true;
      const ts=new Date().toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
      const staffNm=(app&&app.state&&app.state.staffName)||'Staff';
      const _meta={'Rented':['🟢','#00b341'],'Late':['🔴','#ff1111'],'Reserved':['🔵','#00aaff'],'Pending':['🟡','#e6a700'],'Not rentable':['⚪','#8893a0'],'Lock It':['🔒🔴','#ff3d00'],'Lock Off':['🔓🟢','#00b341']};
      const _sty=(l)=>_meta[l]||['•','#5b6b7d'];
      const _rows=log.map(r=>{const t=_sty(r.to),f=_sty(r.from);const tm=new Date(r.t).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});return `<tr><td style="padding:10px 12px;border-bottom:1px solid #eef2f7;"><span style="font-weight:800;color:#1f2a37;font-size:15px;background:#eef4ff;border-radius:8px;padding:3px 10px;">${r.label}</span></td><td style="padding:10px 12px;border-bottom:1px solid #eef2f7;text-align:right;font-size:14px;color:#5b6b7d;">${f[0]} ${r.from} &nbsp;&rarr;&nbsp; <b style="color:${t[1]};">${t[0]} ${r.to}</b> <span style="color:#aab4c0;font-size:11px;">${tm}</span></td></tr>`;}).join('');
      const _lockIt=log.filter(r=>r.to==='Lock It').length;
      const _quip=_lockIt?`🔒 ${_lockIt} unit${_lockIt!==1?'s':''} still need${_lockIt!==1?'':'s'} a lock — go get 'em!`:`✅ All caught up — nice work!`;
      const emailHtml=`<div style="font-family:Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;border-radius:18px;overflow:hidden;border:1px solid #e3eaf3;background:#fff;"><div style="background:linear-gradient(135deg,#FF6B6B,#FFD93D,#6BCB77,#4D96FF);padding:20px 22px;"><div style="font-size:24px;font-weight:900;color:#fff;text-shadow:0 1px 5px rgba(0,0,0,.35);">🏪 StoreWell Report</div><div style="color:#fff;font-size:13px;font-weight:600;margin-top:3px;">${ts} &middot; by ${staffNm} 👤</div></div><div style="padding:18px 20px;"><div style="color:#5b6b7d;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;margin-bottom:12px;">📋 ${log.length} change${log.length!==1?'s':''} this round</div><table style="width:100%;border-collapse:collapse;">${_rows}</table><div style="margin-top:14px;background:#f0f7ff;border:1.5px solid #d6e8ff;border-radius:10px;padding:10px 14px;color:#1f2a37;font-size:13px;font-weight:700;">${_quip}</div></div><div style="padding:14px 20px;background:#f4f7fb;color:#8493a4;font-size:11px;text-align:center;">🏬 StoreWell Storage &middot; 1215 E Church St, Aurora MO &middot; sent automatically ✨🤖</div></div>`;
      const emailBody=`🏪 StoreWell Report\n${ts} - by ${staffNm}\n\n📋 Changes (${log.length}):\n`+log.map(r=>{const t=_sty(r.to);return `${t[0]} ${r.label}: ${r.from} -> ${r.to}`;}).join('\n')+`\n\n${_quip}\n\n— sent automatically by StoreWell ✨`;
      for(const contact of targets){
        // Text: send consolidated list (split if > 155 chars)
        if((contact.pref==='text'||contact.pref==='both')&&contact.phone){
          const allChanges=log.map(r=>`${r.label}:${r.to}`).join(', ');
          const smsText=`StoreWell Report (${ts}): ${allChanges}`;
          try{ const _rr=await fetch('/sms',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:String(contact.phone).replace(/\D/g,''),message:smsText.slice(0,300),key:(cfg&&cfg._tbKey)||''})}); const _dd=await _rr.json().catch(()=>({})); if(!_dd.success) console.warn('Report SMS to '+contact.name+' failed',_dd); else console.log('Report SMS sent to '+contact.name+', quota',_dd.quotaRemaining); }catch(e){console.warn('Report SMS error',e);}
        }
        // Email: auto-send via Brevo (server-side function, key kept secret)
        if((contact.pref==='email'||contact.pref==='both')&&contact.email){
          try{
            const er=await fetch('/email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({to:contact.email,toName:contact.name,subject:'🏪 StoreWell Report '+ts,body:emailBody,html:emailHtml})});
            const ed=await er.json().catch(()=>({}));
            if(!ed.success) console.warn('Report email to '+contact.name+' failed',ed); else console.log('Report email sent to '+contact.name);
          }catch(e){ console.warn('Report email error',e); }
        }
      }
      if(app&&app.setState) app.setState({sessionLog:[]});
      const st=document.getElementById('sw-sr-status');
      st.style.display='block';
      st.textContent=targets.length?`✅ Sent to ${targets.map(c=>c.name).join(', ')}`:'✅ Saved (no one notified)';
      setTimeout(close,2200);
    };
  }

  document.body.appendChild(overlay);
  render();
};


// Joystick repositioning
(function(){
  function initJoyDrag(){
    const wrap = document.getElementById('sw-joy-wrap');
    const handle = document.getElementById('sw-joy-handle');
    if(!wrap||!handle){ setTimeout(initJoyDrag,300); return; }

    // Restore saved position
    try{
      const pos=JSON.parse(localStorage.getItem('sw_joy_pos')||'null');
      if(pos){ wrap.style.left=pos.left; wrap.style.bottom=pos.bottom; wrap.style.top=pos.top||''; wrap.style.right=pos.right||''; }
    }catch(e){}

    let startX, startY, origLeft, origBottom;
    const mv=(e)=>{
      const cx=e.clientX!=null?e.clientX:(e.touches&&e.touches[0]&&e.touches[0].clientX)||0;
      const cy=e.clientY!=null?e.clientY:(e.touches&&e.touches[0]&&e.touches[0].clientY)||0;
      const dx=cx-startX, dy=cy-startY;
      const newLeft=Math.max(10,Math.min(window.innerWidth-150, origLeft+dx));
      const newBottom=Math.max(10,Math.min(window.innerHeight-150, origBottom-dy));
      wrap.style.left=newLeft+'px'; wrap.style.bottom=newBottom+'px';
      wrap.style.right=''; wrap.style.top='';
    };
    const up=()=>{
      handle.style.cursor='grab';
      document.removeEventListener('pointermove',mv);
      document.removeEventListener('pointerup',up);
      document.removeEventListener('touchmove',mv);
      document.removeEventListener('touchend',up);
      try{ localStorage.setItem('sw_joy_pos',JSON.stringify({left:wrap.style.left,bottom:wrap.style.bottom})); }catch(e){}
    };
    handle.addEventListener('pointerdown',e=>{
      e.stopPropagation(); e.preventDefault();
      handle.style.cursor='grabbing';
      startX=e.clientX; startY=e.clientY;
      const rect=wrap.getBoundingClientRect();
      origLeft=rect.left; origBottom=window.innerHeight-rect.bottom;
      wrap.style.transition='none';
      document.addEventListener('pointermove',mv);
      document.addEventListener('pointerup',up);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initJoyDrag);
  else initJoyDrag();
})();


window.__swLockPicker=function(label){
  const existing=document.getElementById('sw-lock-pop');
  if(existing) existing.remove();
  const app=window.__swApp;
  const statuses=[
    {st:'green',  col:'#1f9d4d', label:'Rented'},
    {st:'red',    col:'#cc2b2b', label:'Late'},
    {st:'flashred', col:'#ff4400', label:'Lock It'},
    {st:'flashgreen',col:'#00cc44',label:'Lock Off'},
    {st:'blue',   col:'#2a6fdb', label:'Reserved'},
    {st:'yellow', col:'#e6c01f', label:'Pending'},
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
    setTimeout(()=>{ const cb=document.getElementById('sw-ready-cb'); if(cb) cb.onchange=()=>{ const by=(window.__swApp&&window.__swApp.state&&window.__swApp.state.staffName)||'Staff'; fetch('https://storewell-3d-default-rtdb.firebaseio.com/lockReady/'+_rk+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(cb.checked?{ready:true,by,t:Date.now()}:null)}).catch(()=>{}); }; },200);
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
    fetch(base+'/lockNotes/'+k+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(note?{note,by,t:Date.now()}:null)}).catch(()=>{});
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
    try{ const _k=(label||'').replace(/[-\s]/g,'').toUpperCase(); fetch('https://storewell-3d-default-rtdb.firebaseio.com/lockNotes/'+_k+'.json',{method:'DELETE'}).catch(()=>{}); }catch(e){}
  }
  // Flash confirmation
  const colors={green:'#1f9d4d',red:'#cc2b2b',flashred:'#ff4400',flashgreen:'#00cc44',blue:'#2a6fdb',yellow:'#e6c01f',black:'#333'};
  const names={green:'Rented ✓',red:'Late ✓',flashred:'Lock It ✓',flashgreen:'Lock Off ✓',blue:'Reserved ✓',yellow:'Pending ✓',black:'N/A ✓'};
  const col=colors[st]||'#1f9d4d';
  const f=document.createElement('div');
  f.style.cssText=`position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(1);background:${col};color:#fff;font:800 18px Segoe UI;padding:12px 28px;border-radius:30px;z-index:10000;pointer-events:none;box-shadow:0 8px 32px ${col}88;transition:all .5s;`;
  f.textContent=names[st]||st;
  document.body.appendChild(f);
  setTimeout(()=>{ f.style.transform='translate(-50%,-80%) scale(1.15)'; f.style.opacity='0'; },600);
  setTimeout(()=>f.remove(),1100);
  // Refresh command center inventory if open
  setTimeout(()=>{ const inv=document.getElementById('sw-inv-list'); if(inv&&window.__swApp){const rows=[];const sc={blue:'#00aaff',red:'#ff1111',green:'#00ff44',white:'#ffffff',black:'#aaaaaa',yellow:'#ffee00',flashred:'#ff0000',flashgreen:'#00ff44'};Object.keys(window.__swApp._locks||{}).sort().forEach(k=>{const rec=window.__swApp._locks[k];const s=window.__swApp._statusOf?window.__swApp._statusOf(rec.label):'green';const c=sc[s]||'#1f9d4d';const cid3='swc-'+rec.label.replace(/[^a-z0-9]/gi,'');rows.push(`<div onclick="window.__swCycleNext('${rec.label}')" oncontextmenu="event.preventDefault();window.__swApp&&window.__swApp.locate&&window.__swApp.locate('${rec.label}'.replace(/[-\\s]/g,'').toUpperCase());window.__swApp&&window.__swApp.setState&&window.__swApp.setState({showSearch:false});" title="Left-click: change status | Right-click: find on map" style="cursor:pointer;padding:4px 2px;user-select:none;transition:transform .15s;" onmouseover="this.style.transform='scale(1.12)'" onmouseout="this.style.transform='scale(1)'"><div id="${cid3}" style="width:46px;height:46px;border-radius:50%;background:${c};box-shadow:0 4px 12px ${c}99;display:flex;align-items:center;justify-content:center;"><span style="color:#000;font-size:11px;font-weight:900;font-family:'Arial Black',Impact,sans-serif;text-align:center;line-height:1.1;padding:2px;overflow:hidden;word-break:break-all;">${rec.label}</span></div></div>`);});inv.innerHTML='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;">'+rows.join('')+'</div>';} },200);
};

// Keep __swCycleStatus as alias for backward compat
window.__swCycleStatus=function(label){ window.__swCycleNext(label); };

// Dropdown menu on click — pick any status directly
window.__swCycleNext=function(label,srcEvent){
  document.getElementById('sw-drop-menu')?.remove();
  const app=window.__swApp; if(!app) return;
  const cols={green:'#22c55e',red:'#ef4444',flashred:'#ff0000',flashgreen:'#00ff44',blue:'#3b82f6',yellow:'#eab308',black:'#6b7280'};
  const lbls={green:'Rented',red:'Late',flashred:'Lock It',flashgreen:'Lock Off',blue:'Reserved',yellow:'Pending',black:'N/A'};
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
    dot.style.cssText='width:16px;height:16px;border-radius:50%;background:'+cols[st]+';flex-shrink:0;box-shadow:0 2px 6px '+cols[st]+'88;'+fa;
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
  localStorage.removeItem('sw_user');
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
      <button type="button" id="sw-login-cancel" style="min-height:44px;margin-top:8px;background:transparent;border:1px solid #526476;border-radius:8px;color:#cce8f6;width:100%;cursor:pointer;">Cancel</button>
    </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#sw-login-cancel').onclick=()=>{overlay.remove();resolve(null);};
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
  push(ref(_db,'staffReports'),{name:fromName,changes,ts:Date.now()});
  const _sr7=await fetch('https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json');const cfg=await _sr7.json()||{};const key=cfg._ejsKey||'';
  const msg=fromName+' updated StoreWell ('+new Date().toLocaleString()+'):\n'+changes.map(c=>'• Unit '+c.label+': '+c.from+' → '+c.to).join('\n');
  for(const name of['Kevin','Mike','Brad']){
    if(name===fromName)continue;
    const c=cfg[name]||{},pref=c.pref||'none';
    if((pref==='email'||pref==='both')&&c.email)await _sendEmail(c.email,name,fromName,msg,key);
    if((pref==='text'||pref==='both')&&c.phone&&c.phone&&cfg._tbKey)await _sendSMS(c.phone.replace(/\D/g,''),fromName+': '+msg.slice(0,140),cfg._tbKey);
  }
};
window.__swStaffOnline=(n)=>{push(ref(_db,'staffActivity'),{name:n,action:'logged in',ts:Date.now()});};
class SWNet{
  constructor(comp,uid){this.comp=comp;this.uid=uid;this.name='';this.avatars={};this._avatarHash={};this._lastMsgT=0;this._iv=null;}
  join(name){this.name=name;const pr=ref(_db,'players/'+this.uid);
    // Remove stale entries with same name from other sessions before joining
    fetch('https://storewell-3d-default-rtdb.firebaseio.com/players.json').then(r=>r.json()).then(pl=>{Object.entries(pl||{}).forEach(([u,p])=>{if(u!==this.uid&&p.name===name){remove(ref(_db,'players/'+u)).catch(()=>{});}});}).catch(()=>{});
    const _char=window._swGetChar?window._swGetChar():{};
    set(pr,{name,x:0,y:0,z:0,h:0,t:Date.now(),char:_char});onDisconnect(pr).remove();
    onValue(ref(_db,'players'),snap=>{const pl=snap.val()||{};try{this.comp.setState({online:Object.entries(pl).map(([u,p])=>({name:p.name,me:u===this.uid}))});}catch(e){}this._sync(pl);});
    onValue(ref(_db,'messages'),snap=>{const m=snap.val()||{};Object.values(m).filter(x=>x.t>this._lastMsgT&&x.uid!==this.uid).sort((a,b)=>a.t-b.t).forEach(x=>{this._lastMsgT=x.t;try{this.comp._pushMsg(x.name,x.text);}catch(e){}});});
    this._iv=setInterval(()=>this._pos(),150);}
  send(t){push(ref(_db,'messages'),{uid:this.uid,name:this.name,text:t,t:Date.now()});try{this.comp._pushMsg(this.name,t);}catch(e){}}
  notify(){}
  _pos(){const w=this.comp.walker;if(!w||!w.g)return;const p=w.g.position;const _char=window._swGetChar?window._swGetChar():{};update(ref(_db,'players/'+this.uid),{x:Math.round(p.x*10)/10,y:Math.round(p.y*10)/10,z:Math.round(p.z*10)/10,h:Math.round((w.h||0)*100)/100,t:Date.now(),char:_char});}
  _sync(pl){const sc=this.comp.scene,T=window.THREE;if(!sc||!T)return;
    for(const[uid,p]of Object.entries(pl)){
      if(uid===this.uid)continue;
      const ch=JSON.stringify(p.char||{});
      if(!this.avatars[uid]||this._avatarHash[uid]!==ch){
        if(this.avatars[uid]){sc.remove(this.avatars[uid]);}
        const g=window._swBuildAvatar(T,uid,p);
        sc.add(g);this.avatars[uid]=g;this._avatarHash[uid]=ch;
      }
      const av=this.avatars[uid];
      if(p.x!==undefined){av.position.set(p.x,p.y||0,p.z);av.rotation.y=p.h||0;}
    }
    for(const uid of Object.keys(this.avatars)){if(!pl[uid]){sc.remove(this.avatars[uid]);delete this.avatars[uid];delete this._avatarHash[uid];}}}
  destroy(){clearInterval(this._iv);remove(ref(_db,'players/'+this.uid));}
}
window.__swSetup=function(comp){
  // Skip Firebase anonymous auth — use stable local device ID
  let uid=localStorage.getItem('sw_device_uid');
  if(!uid){uid='dev-'+Math.random().toString(36).slice(2)+'-'+Date.now().toString(36);localStorage.setItem('sw_device_uid',uid);}
  const net=new SWNet(comp,uid);comp._net=net;net.join(_myName()||'Guest');

  // Add look sensitivity slider for mobile tuning
  const isMob=/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)||navigator.maxTouchPoints>0;
  // Always show slider and bind joystick (mobile detection unreliable on some tablets)
  setTimeout(()=>{
      if(document.getElementById('sw-sens-ctrl')) return;
      const saved=parseFloat(localStorage.getItem('sw_look_sens')||'0.0008');
      window._swLookSens=saved;
      const ctrl=document.createElement('div');
      ctrl.id='sw-sens-ctrl';
      ctrl.style.cssText='position:fixed;bottom:10px;left:10px;z-index:9999;background:rgba(0,0,0,.65);border-radius:10px;padding:8px 12px;color:#fff;font:600 11px Segoe UI,Arial;display:flex;align-items:center;gap:8px;';
      const savedW=parseFloat(localStorage.getItem('sw_walk_spd')||'0.012');
      window._swWalkSpd=savedW;
      ctrl.innerHTML='👁 Look: <input id="sw-sens-sl" type="range" min="1" max="100" value="'+Math.round(saved*10000)+'" style="width:90px;accent-color:#00aaff;"> <span id="sw-sens-val">'+Math.round(saved*10000)+'</span>'
        +'&nbsp;&nbsp;🚶 Walk: <input id="sw-walk-sl" type="range" min="1" max="200" value="'+Math.round(savedW*1000)+'" style="width:90px;accent-color:#00ff44;"> <span id="sw-walk-val">'+Math.round(savedW*1000)+'</span>'
        +'&nbsp;&nbsp;↩ Turn: <input id="sw-turn-sl" type="range" min="1" max="100" value="'+Math.round((parseFloat(localStorage.getItem('sw_turn_spd')||'0.005')*1000))+'" style="width:90px;accent-color:#ffee00;"> <span id="sw-turn-val">'+Math.round((parseFloat(localStorage.getItem('sw_turn_spd')||'0.005')*1000))+'</span>';
      document.body.appendChild(ctrl);
      // Wardrobe button
      const wBtn=document.createElement('button');
      wBtn.id='sw-ward-btn';
      wBtn.textContent='👔 Wardrobe';
      wBtn.style.cssText='position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:9999;background:linear-gradient(90deg,#8b5cf6,#ec4899);color:#fff;border:none;border-radius:20px;padding:6px 16px;font-size:12px;font-weight:900;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.4);';
      wBtn.onclick=function(){window._swShowWardrobe&&window._swShowWardrobe();};
      document.body.appendChild(wBtn);
      document.getElementById('sw-sens-sl').addEventListener('input',function(){
        const v=parseInt(this.value)/10000;
        window._swLookSens=v;
        document.getElementById('sw-sens-val').textContent=this.value;
        try{localStorage.setItem('sw_look_sens',v);}catch(e){}
      });
      document.getElementById('sw-walk-sl').addEventListener('input',function(){
        const v=parseInt(this.value)/1000;
        window._swWalkSpd=v;
        document.getElementById('sw-walk-val').textContent=this.value;
        try{localStorage.setItem('sw_walk_spd',v);}catch(e){}
      });
      const savedT=parseFloat(localStorage.getItem('sw_turn_spd')||'0.005');
      window._swTurnSpd=savedT;
      document.getElementById('sw-turn-sl').addEventListener('input',function(){
        const v=parseInt(this.value)/1000;
        window._swTurnSpd=v;
        document.getElementById('sw-turn-val').textContent=this.value;
        try{localStorage.setItem('sw_turn_spd',v);}catch(e){}
      });
    },2000);
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
