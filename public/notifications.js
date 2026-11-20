/* StoreWell alerts: successful saves trigger notifications directly, including SDK saves. */
(() => {
  'use strict';
  const DEFAULT_PREFS={flashred:true,flashgreen:true,report:true};
  const LABELS={flashred:'Lock It',flashgreen:'Lock Off',red:'Late',green:'Rented',blue:'Reserved',yellow:'Rented · No Lock',purple:'Ready to Rent',white:'Empty',black:'Not rentable',report:'Reports'};
  const staffName=()=>window.__swCheckLogin?.()||'';
  const supported=()=>('serviceWorker' in navigator)&&('PushManager' in window)&&('Notification' in window);
  const b64=a=>btoa(String.fromCharCode(...new Uint8Array(a))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const bytes=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
  let syncing=null,reconnecting=false;
  async function bounded(p,message){let timer;try{return await Promise.race([p,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(message)),12000);})]);}finally{clearTimeout(timer);}}
  function notice(message){window.dispatchEvent(new CustomEvent('sw-notification-notice',{detail:message}));const old=document.getElementById('sw-alert-notice');old?.remove();const el=document.createElement('div');el.id='sw-alert-notice';el.setAttribute('role','status');el.style.cssText='position:fixed;bottom:145px;left:50%;transform:translateX(-50%);z-index:100001;padding:14px 18px;border:1px solid #b9a057;border-radius:9px;background:#122b3c;color:#edf6ff;font:14px Arial;width:max-content;max-width:90vw;';el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),8500);}
  async function api(url,init){const r=await fetch(url,init);const d=await r.json().catch(()=>({}));if(!r.ok||d.success===false){const e=new Error(d.error||'The request could not be completed');e.renew=d.renew===true;throw e;}return d;}
  async function post(url,data){return api(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),keepalive:true,signal:AbortSignal.timeout(45000)});}
  function setBell(on){window._swBellOn=!!on;for(const id of ['sw-bell','sw-cc-bell','sw-tablet-notifications']){const el=document.getElementById(id);if(!el)continue;el.dataset.subscribed=String(on);el.title=on?'Choose alerts for this device':'Enable push notifications';const spans=el.querySelectorAll('span');if(spans[0])spans[0].textContent=on?'🔔':'🔕';if(spans[1])spans[1].textContent=on?'ALERTS ON':'ALERTS';}}
  async function subId(endpoint){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(endpoint)))].slice(0,12).map(x=>x.toString(16).padStart(2,'0')).join('');}
  async function saveNode(id,node,previousSubscription){return post('/push-subscription',{subscription:{endpoint:node.endpoint,keys:node.keys,expirationTime:node.expirationTime},...(node.prefs?{prefs:node.prefs}:{}),...(previousSubscription?{previousSubscription}:{})});}
  async function syncSubscription(){
    if(syncing)return syncing;
    syncing=(async()=>{
      if(!supported())throw new Error('Push notifications are not supported in this browser');
      let existing=null;if(!staffName()){try{existing=await (await navigator.serviceWorker.getRegistration?.('/'))?.pushManager.getSubscription();}catch{}}
      // A device that already holds its saved signup can refresh it without a fresh sign-in.
      if(!staffName()&&!existing)throw new Error('Staff sign in is needed to enable alerts');
      const config=await api('/notify',{cache:'no-store',signal:AbortSignal.timeout(12000)});
      if(!config.configured||!config.publicKey)throw new Error('The push service is not ready');
      await bounded(navigator.serviceWorker.register('/sw.js'),'StoreWell could not start the alerts service. Reopen the installed StoreWell app, then retry.');
      const reg=await bounded(navigator.serviceWorker.ready,'The alerts service did not start. Reopen the installed StoreWell app, then retry.');
      let sub=await reg.pushManager.getSubscription(),previousSubscription;
      // Reuse every valid subscription; migrate a mismatched old key while preserving preferences.
      if(sub&&sub.options?.applicationServerKey&&b64(sub.options.applicationServerKey)!==config.publicKey){previousSubscription=sub.toJSON();await sub.unsubscribe();sub=null;}
      if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:bytes(config.publicKey)});
      let saved;
      try{saved=await saveNode(null,sub.toJSON(),previousSubscription);}
      catch(e){
        // The push service killed this signup. Make a fresh one and carry the old owner over.
        if(!e.renew)throw e;
        previousSubscription=sub.toJSON();try{await sub.unsubscribe();}catch{}
        sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:bytes(config.publicKey)});
        saved=await saveNode(null,sub.toJSON(),previousSubscription);
      }
      const expectedId=await subId(sub.endpoint);
      if(saved?.success!==true||saved.id!==expectedId||typeof saved.staff!=='string'||!saved.staff.trim()||!saved.prefs||typeof saved.prefs!=='object'||Array.isArray(saved.prefs)||Object.entries(saved.prefs).some(([key,value])=>!Object.hasOwn(LABELS,key)||typeof value!=='boolean')){
        throw new Error('StoreWell did not confirm this device’s alert signup. Retry reconnecting alerts.');
      }
      const node={...sub.toJSON(),prefs:saved.prefs,staff:saved.staff};
      try{localStorage.setItem('sw_alerts_wanted','1');}catch{}offBanner(false);
      setBell(true);return {id:saved.id,node};
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
  window.__swBellTap=async({embedded=false,reconnect=false}={})=>{
    if(reconnecting){if(embedded)throw new Error('StoreWell is already reconnecting alerts.');return;}
    reconnecting=true;
    if(reconnect)offBanner(true,'Reconnecting alerts…');
    try{
      if(!supported())throw new Error('This browser cannot receive push alerts. On iPhone, open StoreWell from its Home Screen icon.');
      if(!staffName())throw new Error('Sign in to StoreWell on this device, then retry.');
      if(Notification.permission==='denied')throw new Error('StoreWell notifications are blocked. Allow them in your device or browser settings, then retry.');
      if(Notification.permission!=='granted'){
        const permission=await Notification.requestPermission();
        if(permission!=='granted')throw new Error('StoreWell notifications were not allowed. Allow them in your device or browser settings, then retry.');
      }
      const {id,node}=await syncSubscription();
      reconnecting=false;
      offBanner(false);
      openPanel(id,node);
    }catch(e){
      reconnecting=false;
      if(!supported()||Notification.permission!=='granted')setBell(false);
      if(reconnect)offBanner(true,'Retry reconnecting alerts',e.message);
      else if(embedded)throw e;
      else notice(e.message);
    }finally{reconnecting=false;}
  };
  window.__swBellRefresh=()=>{if(supported()&&Notification.permission==='granted')syncSubscription().catch(()=>setBell(false));else setBell(false);};
  window.__swNotifyStatus=async(type,unit,who,eventId,eventAt)=>{
    if(!LABELS[type]||type==='report')return;
    try{const result=await post('/notify',{type,unit,eventId,eventAt,title:LABELS[type]+' — Unit '+unit,body:'Unit '+unit+' · '+(who||'Staff')});const me=staffName();if(!result.sent&&!result.emailed?.length){if(result.done||type==='flashred'||type==='flashgreen')notice('Status saved. Nobody has '+(result.done||LABELS[type])+' alerts turned on yet. Open Alerts on their phone.');}else if(result.done&&result.pushedTo&&!result.pushedTo.includes('Brad')&&!result.emailed?.includes('Brad'))notice('Saved. '+result.done+' sent, but Brad has no alerts set up on his phone yet.');else if(me&&result.noDevice?.includes(me)&&!result.emailed?.includes(me))notice('Saved. This phone is not set up for alerts yet. Tap Alerts to turn them on.');return result;}
    catch(e){notice('Status saved. Push alerts could not be sent: '+e.message);throw e;}
  };
  window.__swNotifyReport=(body,recipients)=>post('/notify',{type:'report',title:'StoreWell report',body, ...(recipients?{recipients}:{})});
  window.__swTestNotif=async()=>{
    const who=staffName();
    if(!who||!window.__swCheckLogin?.())return notice('Staff sign in is needed to test your alerts');
    try{
      const d=await post('/notify',{type:'report',title:'StoreWell test notification',body:'Test alert for '+who+'.',recipients:[who]});
      if(!d.sent)return notice('No device for '+who+' has Reports alerts enabled. Open Alerts on your phone to enable them.');
      notice('Push service accepted '+d.sent+' test notification(s) for '+who+'. Check that it appears on your device.');
      if(d.notificationId){
        for(let attempt=0;attempt<8;attempt++){
          await new Promise(resolve=>setTimeout(resolve,1500));
          let receipt;try{receipt=await api('/push-receipt?id='+encodeURIComponent(d.notificationId),{cache:'no-store',signal:AbortSignal.timeout(8000)});}catch{break;}
          if(receipt.received)return notice('Confirmed: '+receipt.received+' device(s) displayed your StoreWell test notification.');
        }
        notice('The push service accepted your test, but no device confirmation has arrived yet. Open StoreWell on your phone, then test again.');
      }
    }catch(e){notice(e.message);}
  };
  const wanted=()=>{if(staffName())return true;try{return localStorage.getItem('sw_alerts_wanted')==='1';}catch{return false;}};
  function offBanner(show,label='Alerts are off on this device. Reconnect alerts.',message=''){
    let wrap=document.getElementById('sw-alerts-off');
    if(!show){wrap?.remove();return;}
    if(reconnecting&&label!=='Reconnecting alerts…')return;
    if(wrap&&wrap.dataset.feedback==='true'&&!message&&label!=='Reconnecting alerts…')return;
    if(!wrap){
      wrap=document.createElement('div');wrap.id='sw-alerts-off';
      wrap.style.cssText='position:fixed;top:max(8px,env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:100002;padding:7px 12px;border:1px solid #b9a057;border-radius:8px;background:#7a1d12;color:#fff;font:600 13px Arial;width:max-content;max-width:92vw;text-align:center;';
      const b=document.createElement('button');b.id='sw-alerts-reconnect';b.type='button';
      b.style.cssText='min-height:44px;padding:6px;color:inherit;background:transparent;border:0;font:inherit;cursor:pointer;';
      b.onclick=()=>window.__swBellTap({reconnect:true});
      const p=document.createElement('div');p.id='sw-alerts-feedback';p.setAttribute('role','status');p.setAttribute('aria-live','polite');
      wrap.append(b,p);document.body.append(wrap);
    }
    wrap.dataset.feedback=String(!!message);
    const b=document.getElementById('sw-alerts-reconnect'),p=document.getElementById('sw-alerts-feedback');
    b.textContent=label;b.disabled=reconnecting;p.textContent=message||(reconnecting?'Checking this device’s notification signup.':'');
  }
  // Nov 19 2026: alerts must never stop silently. If this device had alerts and lost them
  // (permission removed, signup dropped), show a one-tap banner until they are back on.
  async function checkAlive(){
    if(!supported()||!wanted())return;
    let sub=null;try{const reg=await navigator.serviceWorker.getRegistration?.('/');sub=await reg?.pushManager.getSubscription();}catch{}
    if(Notification.permission!=='granted'||!sub){offBanner(true);return;}
    syncSubscription().then(()=>offBanner(false)).catch(()=>offBanner(true));
  }
  window.__swAlertsCheck=checkAlive;
  function start(){if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});const b=document.getElementById('sw-bell');if(b)b.onclick=window.__swBellTap;if(staffName()&&supported()&&Notification.permission==='granted')syncSubscription().catch(()=>{setBell(false);offBanner(true);});else checkAlive();}
  if(document.readyState==='complete')start();else window.addEventListener('load',start);
  window.addEventListener('sw-staff-signed-in',()=>window.__swBellRefresh());
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible')return;if(staffName()&&supported()&&Notification.permission==='granted')syncSubscription().catch(()=>{setBell(false);offBanner(true);});else checkAlive();});
})();
