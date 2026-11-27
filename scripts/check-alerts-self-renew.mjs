// Nov 19 2026: a signup the push service killed must renew itself on the next app open.
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';import fs from 'node:fs';import assert from 'node:assert/strict';
// Page side: server says renew -> phone makes a fresh signup and sends the old one along.
{
  const src=fs.readFileSync('public/notifications.js','utf8');
  const dom=new JSDOM('<!doctype html><body></body>',{runScripts:'outside-only',url:'https://storewell.test/'});const w=dom.window;
  Object.defineProperty(w.crypto,'subtle',{value:globalThis.crypto.subtle});w.TextEncoder=TextEncoder;
  w.Notification={permission:'granted',requestPermission:async()=>'granted'};w.PushManager=function(){};
  let unsub=0,subs=0;const mk=n=>({endpoint:'https://fcm.googleapis.com/'+n,toJSON:()=>({endpoint:'https://fcm.googleapis.com/'+n,keys:{p256dh:'p'+n,auth:'a'+n}}),options:{},unsubscribe:async()=>{unsub++;return true;}});
  const reg={pushManager:{getSubscription:async()=>mk('old'),subscribe:async()=>{subs++;return mk('new');}}};
  Object.defineProperty(w.navigator,'serviceWorker',{value:{register:async()=>reg,ready:Promise.resolve(reg),getRegistration:async()=>reg}});
  w.__swCheckLogin=()=>'';try{w.localStorage.setItem('sw_alerts_wanted','1');}catch{}
  const posts=[];
  w.fetch=async(u,init)=>{if(u==='/notify')return {ok:true,json:async()=>({configured:true,publicKey:'cHVi'})};
    const body=JSON.parse(init.body);posts.push(body);
    if(body.subscription.endpoint.endsWith('/old'))return {ok:false,status:409,json:async()=>({error:'renew',renew:true})};
    return {ok:true,json:async()=>({success:true,id:createHash('sha256').update(body.subscription.endpoint).digest('hex').slice(0,24),staff:'Brad',prefs:{report:true}})};};
  w.eval(src);
  const waitUntil=Date.now()+1500;
  while(w._swBellOn!==true&&Date.now()<waitUntil)await new Promise(r=>setTimeout(r,10));
  assert.equal(w._swBellOn,true,'the replacement subscription is acknowledged for this device');
  assert.equal(unsub,1,'dead signup is dropped on the phone');assert.equal(subs,1,'fresh signup is made');
  assert.equal(posts.at(-1).previousSubscription.endpoint,'https://fcm.googleapis.com/old','old signup is sent so the owner carries over');
  assert.equal(!!w.document.getElementById('sw-alerts-off'),false,'no banner once renewed');
  dom.window.close();
}
// Server side: dead copy proves the owner with no sign-in and gets cleaned up.
{
  const {onRequestPost}=await import('../functions/push-subscription.js');
  const id=async e=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(e)))].slice(0,12).map(x=>x.toString(16).padStart(2,'0')).join('');
  const oldE='https://fcm.googleapis.com/fcm/send/old',newE='https://fcm.googleapis.com/fcm/send/new';
  const k={p256dh:'B'+'x'.repeat(86),auth:'y'.repeat(22)};
  const db={['pushDead/'+await id(oldE)]:{endpoint:oldE,keys:k,staff:'Brad',prefs:{report:true,flashred:true}}};
  const deleted=[];
  globalThis.fetch=async(url,init={})=>{const path=new URL(url).pathname.replace(/^\//,'').replace(/\.json$/,'');
    if(init.method==='PUT'){db[path]=JSON.parse(init.body);return new Response('{}');}
    if(init.method==='DELETE'){deleted.push(path);delete db[path];return new Response('null');}
    return new Response(JSON.stringify(db[path]??null));};
  const req=body=>new Request('https://storewell.test/push-subscription',{method:'POST',headers:{Origin:'https://storewell.test','Content-Type':'application/json'},body:JSON.stringify(body)});
  const env={FIREBASE_DB_SECRET:'s'};
  let r=await onRequestPost({request:req({subscription:{endpoint:oldE,keys:k}}),env});
  assert.equal(r.status,409,'a dead signup is never saved again');assert.equal((await r.json()).renew,true);
  r=await onRequestPost({request:req({subscription:{endpoint:newE,keys:k},previousSubscription:{endpoint:oldE,keys:k}}),env});
  assert.equal(r.status,200,'fresh signup saved with no sign-in');
  const saved=db['pushSubs/'+await id(newE)];assert.equal(saved.staff,'Brad');assert.equal(saved.prefs.flashred,true,'choices carried over');
  assert.ok(!deleted.includes('pushDead/'+await id(oldE)),'Nov 26 2026: the dead copy is kept as a record');
}
console.log('self-renew ok');
