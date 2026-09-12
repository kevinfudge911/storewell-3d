/* StoreWell alerts: successful saves trigger notifications directly, including SDK saves. */
(() => {
  'use strict';
  const FB='https://storewell-3d-default-rtdb.firebaseio.com';
  const DEFAULT_PREFS={flashred:true,flashgreen:true,report:true};
  const LABELS={flashred:'Lock It',flashgreen:'Lock Off',red:'Locked out',green:'Rented',blue:'Reserved',yellow:'Rented · No Lock',purple:'Ready to Rent',white:'Empty',black:'Out of Service',report:'Reports'};
  const staffName=()=>window.__swApp?.state?.staffName||'';
  const supported=()=>('serviceWorker' in navigator)&&('PushManager' in window)&&('Notification' in window);
  const b64=a=>btoa(String.fromCharCode(...new Uint8Array(a))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const bytes=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
  let syncing=null;
  function notice(message){window.dispatchEvent(new CustomEvent('sw-notification-notice',{detail:message}));const old=document.getElementById('sw-alert-notice');old?.remove();const el=document.createElement('div');el.id='sw-alert-notice';el.setAttribute('role','status');el.style.cssText='position:fixed;bottom:145px;left:50%;transform:translateX(-50%);z-index:100001;padding:14px 18px;border:1px solid #b9a057;border-radius:9px;background:#122b3c;color:#edf6ff;font:14px Arial;width:max-content;max-width:90vw;';el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),8500);}
  async function api(url,init){const r=await fetch(url,init);const d=await r.json().catch(()=>({}));if(!r.ok||d.success===false)throw new Error(d.error||'The request could not be completed');return d;}
  async function post(url,data){return api(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),keepalive:true,signal:AbortSignal.timeout(45000)});}
  function setBell(on){window._swBellOn=!!on;for(const id of ['sw-bell','sw-cc-bell']){const el=document.getElementById(id);if(!el)continue;el.title=on?'Choose alerts for this device':'Enable push notifications';const spans=el.querySelectorAll('span');if(spans[0])spans[0].textContent=on?'🔔':'🔕';if(spans[1])spans[1].textContent=on?'ALERTS ON':'ALERTS';}}
  async function subId(endpoint){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(endpoint)))].slice(0,12).map(x=>x.toString(16).padStart(2,'0')).join('');}
  async function saveNode(id,node){const r=await fetch(FB+'/pushSubs/'+id+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(node),signal:AbortSignal.timeout(12000)});if(!r.ok)throw new Error('Could not save this device’s alert settings');}
  async function syncSubscription(){
    if(syncing)return syncing;
    syncing=(async()=>{
      if(!supported())throw new Error('Push notifications are not supported in this browser');
      const config=await api('/notify',{cache:'no-store',signal:AbortSignal.timeout(12000)});
      if(!config.configured||!config.publicKey)throw new Error('The push service is not ready');
      const reg=await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;
      let sub=await reg.pushManager.getSubscription(),oldId,existing={};
      if(sub){oldId=await subId(sub.endpoint);existing=await api(FB+'/pushSubs/'+oldId+'.json',{signal:AbortSignal.timeout(12000)})||{};}
      const prefs=existing.prefs||DEFAULT_PREFS;
      // Reuse every valid subscription; migrate a mismatched old key while preserving preferences.
      if(sub&&sub.options?.applicationServerKey&&b64(sub.options.applicationServerKey)!==config.publicKey){await sub.unsubscribe();sub=null;}
      if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:bytes(config.publicKey)});
      const id=await subId(sub.endpoint),node={...sub.toJSON(),prefs,staff:staffName()||existing.staff||'',updatedAt:Date.now()};
      await saveNode(id,node);
      if(oldId&&id!==oldId)await fetch(FB+'/pushSubs/'+oldId+'.json',{method:'DELETE'}).catch(()=>{});
      setBell(true);return {id,node};
    })().catch(e=>{setBell(false);throw e;}).finally(()=>syncing=null);
    return syncing;
  }
  function openPanel(id,node){
    document.getElementById('sw-pref-panel')?.remove();const panel=document.createElement('section');panel.id='sw-pref-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Alerts on this device');
    panel.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:100000;background:linear-gradient(145deg,#153248,#071522);color:#e6f7ff;border:1px solid #58a9c8;border-radius:14px;box-shadow:0 18px 80px #000b;padding:20px;width:320px;max-width:90vw;max-height:85dvh;overflow:auto;font:14px Arial;color-scheme:dark;';
    const title=document.createElement('h2');title.textContent='Alerts on this device';title.style.cssText='font-size:18px;margin:0 0 12px';panel.append(title);
    for(const [type,label]of Object.entries(LABELS)){const row=document.createElement('label');row.style.cssText='display:flex;align-items:center;gap:12px;padding:8px 0;border-top:1px solid #31546a;';const cb=document.createElement('input');cb.type='checkbox';cb.checked=node.prefs[type]===true;cb.style.cssText='width:21px;height:21px;accent-color:#21a8e0';cb.onchange=async()=>{const previous=!cb.checked;node.prefs[type]=cb.checked;cb.disabled=true;try{await saveNode(id,node);}catch(e){node.prefs[type]=previous;cb.checked=previous;notice(e.message);}finally{cb.disabled=false;}};row.append(cb,document.createTextNode(label));panel.append(row);}
    const done=document.createElement('button');done.textContent='Done';done.style.cssText='margin-top:14px;width:100%;padding:12px;background:#155b80;border:1px solid #5fadc6;color:white;border-radius:7px;font:700 14px Arial';done.onclick=()=>panel.remove();panel.append(done);document.body.append(panel);
  }
  window.__swBellTap=async()=>{
    if(!staffName()||!window.__swCheckLogin?.())return notice('Staff sign in is needed to enable alerts');
    if(!supported())return notice('This browser cannot receive push alerts. On iPhone, install StoreWell on the Home Screen first.');
    try{const permission=await Notification.requestPermission();if(permission!=='granted')throw new Error('Allow StoreWell notifications in your browser settings to receive alerts');const {id,node}=await syncSubscription();openPanel(id,node);}catch(e){notice(e.message);}
  };
  window.__swBellRefresh=()=>{if(supported()&&Notification.permission==='granted')syncSubscription().catch(()=>setBell(false));else setBell(false);};
  window.__swNotifyStatus=async(type,unit,who)=>{
    if(!LABELS[type]||type==='report')return;
    try{return await post('/notify',{type,title:LABELS[type]+' — Unit '+unit,body:'Unit '+unit+' · '+(who||'Staff')});}
    catch(e){notice('Status saved. Push alerts could not be sent: '+e.message);throw e;}
  };
  window.__swNotifyReport=(body,recipients)=>post('/notify',{type:'report',title:'StoreWell report',body, ...(recipients?{recipients}:{})});
  window.__swTestNotif=async()=>{try{const d=await post('/notify',{type:'report',title:'StoreWell test notification',body:'Push notifications are connected.'});notice('Push service accepted '+d.sent+' notification(s); '+d.failed+' failed.');}catch(e){notice(e.message);}};
  function start(){if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});const b=document.getElementById('sw-bell');if(b)b.onclick=window.__swBellTap;if(supported()&&Notification.permission==='granted')syncSubscription().catch(()=>setBell(false));}
  if(document.readyState==='complete')start();else window.addEventListener('load',start);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&supported()&&Notification.permission==='granted')syncSubscription().catch(()=>setBell(false));});
})();
