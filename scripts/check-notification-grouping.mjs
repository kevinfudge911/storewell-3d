// Actual encrypted server payload -> actual worker, generated keys/offline providers.
// Device cache and notifications survive fresh worker VM contexts.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {notificationTag,notificationActivity} from '../server/notification-tag.js';
import {onRequestPost} from '../functions/notify.js';
const base={type:'green',unit:'C2',eventId:'history-1',eventAt:119999};
const tag=(message,id='delivery-1')=>notificationTag(message,id);
for(const type of ['red','green','blue','yellow','purple','white','black','flashred','flashgreen']){
  const message={...base,type};
  assert.equal(tag(message),notificationTag(message,'retry',999999),'Retry identity never depends on arrival time');
  assert.notEqual(tag(message),tag({...message,eventId:'history-2'}),'New saved events have different identities');
  assert.notEqual(tag(message),tag({...message,unit:'C3'}));
}
assert.equal(tag(base),tag({...base,unit:' c-2 '}));
assert.notEqual(tag(base),tag({...base,type:'blue'}));
for(const eventId of [undefined,{},12,'a/b','x'.repeat(151)])assert.equal(tag({...base,eventId}),'delivery-1');
for(const unit of [undefined,{},12,'C/2','x'.repeat(13),''])assert.equal(tag({...base,unit}),'delivery-1');
assert.equal(tag({...base,type:'report'}),'delivery-1');
assert.equal(tag({type:'green',title:'Unit C2'}),'delivery-1','Never infer identity from titles');
assert.deepEqual(notificationActivity(base),{key:'storewell:lock:C2:green',eventId:'history-1',eventAt:119999});
for(const eventAt of [undefined,{},'123',-1,1.5,Infinity]){
  assert.equal(notificationActivity({...base,eventAt}),undefined);
  assert.equal(tag({...base,eventAt}),tag(base),'An exact saved identity is stable even without a usable ordering timestamp');
}
for(const type of ['red','flashred','flashgreen','report'])assert.equal(notificationActivity({...base,type}),undefined,'Urgent events and reports never enter routine grouping');

const signer=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
const receiver=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
const receiverPublic=new Uint8Array(await crypto.subtle.exportKey('raw',receiver.publicKey));
const auth=crypto.getRandomValues(new Uint8Array(16));
const env={VAPID_PRIVATE_JWK:JSON.stringify(await crypto.subtle.exportKey('jwk',signer.privateKey)),FIREBASE_DB_SECRET:'offline-fixture'};
const subscription={staff:'Kevin',endpoint:'https://fcm.googleapis.com/offline-grouping-fixture',keys:{p256dh:Buffer.from(receiverPublic).toString('base64url'),auth:Buffer.from(auth).toString('base64url')},prefs:Object.fromEntries(['red','green','blue','yellow','purple','white','black','flashred','flashgreen','report'].map(type=>[type,true]))};
const text=new TextEncoder();
async function hkdf(input,salt,info,length){
  const key=await crypto.subtle.importKey('raw',input,'HKDF',false,['deriveBits']);
  return crypto.subtle.deriveBits({name:'HKDF',hash:'SHA-256',salt,info},key,length*8);
}
async function decrypt(body){
  const bytes=new Uint8Array(body),salt=bytes.slice(0,16),senderPublic=bytes.slice(21,21+bytes[20]);
  const sender=await crypto.subtle.importKey('raw',senderPublic,{name:'ECDH',namedCurve:'P-256'},false,[]);
  const shared=await crypto.subtle.deriveBits({name:'ECDH',public:sender},receiver.privateKey,256);
  const info=Buffer.concat([text.encode('WebPush: info\0'),receiverPublic,senderPublic]);
  const ikm=await hkdf(shared,auth,info,32);
  const key=await crypto.subtle.importKey('raw',await hkdf(ikm,salt,text.encode('Content-Encoding: aes128gcm\0'),16),'AES-GCM',false,['decrypt']);
  const plain=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:await hkdf(ikm,salt,text.encode('Content-Encoding: nonce\0'),12)},key,bytes.slice(21+bytes[20])));
  let end=plain.length-1;while(plain[end]===0)end--;assert.equal(plain[end],2);
  return JSON.parse(new TextDecoder().decode(plain.slice(0,end)));
}
const source=fs.readFileSync(new URL('../public/sw.js',import.meta.url),'utf8');
const visible=new Map(),durable=new Map(),displayed=[],receipts=[],payloads=[],deleted=[];
let failDisplay=false,failStorage=false,serverNow=119999,staleReplays=0;
const cacheStorage={
  keys:async()=>['storewell-old-shell','storewell-handheld-alerts-v45',...durable.keys()],
  delete:async name=>{deleted.push(name);durable.delete(name);return true;},
  open:async name=>{
    assert.equal(name,'storewell-notification-state-v1');
    if(!durable.has(name))durable.set(name,new Map());
    const entries=durable.get(name);
    return {
      match:async key=>entries.has(key)?new Response(entries.get(key)):undefined,
      put:async(key,response)=>{if(failStorage)throw new Error('Offline storage failure');entries.set(key,await response.text());},
    };
  },
};
function worker(){
  const events={};
  vm.runInNewContext(source,{
    self:{location:{origin:'https://storewell.test'},clients:{claim:async()=>{}},addEventListener:(name,fn)=>events[name]=fn,registration:{showNotification:async(title,options)=>{
      if(failDisplay)throw new Error('Offline display failure');
      displayed.push({title,options});visible.set(options.tag,{title,options});
    }}},URL,Response,caches:cacheStorage,fetch:async(url,init)=>{assert.equal(url,'/push-receipt');receipts.push(JSON.parse(init.body));return Response.json({success:true});},
  });
  return events;
}
let events=worker();
const restart=()=>events=worker();
function resetDevice(){visible.clear();durable.clear();failDisplay=false;failStorage=false;restart();}
async function display(payload){let pending;events.push({data:{json:()=>payload},waitUntil:p=>pending=p});await pending;}
const latest=()=>[...visible.values()].at(-1);
const originalFetch=globalThis.fetch,originalNow=Date.now;
try{
  Date.now=()=>serverNow;
  globalThis.fetch=async(url,init={})=>{
    const parsed=new URL(url);
    if(parsed.hostname==='storewell-3d-default-rtdb.firebaseio.com'){
      assert.equal(parsed.pathname,'/pushSubs.json');assert.equal(init.method,undefined,'No database mutations');
      return Response.json({fixture:subscription});
    }
    assert.equal(String(url),subscription.endpoint);assert.equal(init.redirect,'manual');
    payloads.push(await decrypt(init.body));return new Response('',{status:201});
  };
  async function send(message){
    const result=await(await onRequestPost({env,request:new Request('https://storewell.test/notify',{method:'POST',body:JSON.stringify({title:'Offline lock fixture',body:'Latest activity',...message})})})).json();
    assert.equal(result.sent,1);const payload=payloads.at(-1);
    assert.equal(payload.receipt.id,result.notificationId,'Delivery receipt identity remains independent');
    return {payload,result};
  }
  async function deliver(message){const sent=await send(message);await display(sent.payload);return sent;}

  for(const type of ['green','blue','yellow','purple','white','black']){
    resetDevice();serverNow=119999;
    const first=await deliver({...base,type,body:'First saved activity'});
    serverNow=120000;restart();
    const retry=await deliver({...base,type,body:'First saved activity'});
    assert.notEqual(first.result.notificationId,retry.result.notificationId);
    assert.equal(visible.size,1,'SAME saved event at 119999/120000ms remains one alert after restart');
    const next={...base,type,eventId:'history-2',eventAt:120000,body:'Newest operator'};
    await deliver(next);assert.equal(visible.size,1,'Distinct routine updates group across the former bucket boundary');
    assert.equal(latest().options.body,'Newest operator');
    serverNow=999999;restart();await deliver(next);
    assert.equal(visible.size,1,'Retry of latest event stays stable long after the rolling window');
    // Exactly 120 seconds still shares the burst; 120001ms from latest starts a new one.
    await deliver({...next,eventId:'history-3',eventAt:240000});assert.equal(visible.size,1);
    await deliver({...next,eventId:'history-4',eventAt:360001});assert.equal(visible.size,2,'A real gap starts a new alert');
    const count=displayed.length,ack=receipts.length;restart();await deliver(next);
    assert.equal(displayed.length,count+1,'Older burst redraws only the cached newest group');assert.equal(visible.size,2,'An older burst cannot be resurrected');assert.equal(receipts.length,ack);staleReplays++;
  }
  assert(displayed.every(x=>x.options.renotify===false));

  resetDevice();
  const older=await send({...base,eventAt:120001,eventId:'older',body:'Old operator'});
  const newer=await send({...base,eventAt:120002,eventId:'newer',body:'Newest operator'});
  await display(newer.payload);const count=displayed.length,ack=receipts.length;restart();await display(older.payload);
  assert.equal(visible.size,1);assert.equal(latest().options.body,'Newest operator','Late older event never replaces newer content');
  assert.equal(latest().options.silent,true,'A stale push redraws current contents without sound/vibration');
  assert.equal(displayed.length,count+1);assert.equal(receipts.length,ack,'Newest-content replay never claims the stale payload was displayed');staleReplays++;
  visible.clear();restart();await display(older.payload);
  assert.equal(visible.size,1,'Watermark survives dismissal AND restart; only the newest content may reappear');assert.equal(latest().options.body,'Newest operator');staleReplays++;
  // Concurrency and same-millisecond ties use the same durable ordering rule.
  resetDevice();await Promise.all([display(newer.payload),display(older.payload)]);
  assert.equal(visible.size,1);assert.equal(latest().options.body,'Newest operator');staleReplays++;
  resetDevice();await deliver({...base,eventId:'history-b',eventAt:500,body:'Same-ms newer'});restart();
  await deliver({...base,eventId:'history-a',eventAt:500,body:'Same-ms older'});
  assert.equal(latest().options.body,'Same-ms newer','History ID deterministically breaks timestamp ties');staleReplays++;
  let activated;events.activate({waitUntil:p=>activated=p});await activated;
  assert(deleted.includes('storewell-old-shell'));assert(!deleted.includes('storewell-notification-state-v1'));
  assert(durable.has('storewell-notification-state-v1'),'Shell upgrades retain durable ordering');

  resetDevice();await deliver(base);await deliver({...base,unit:'C3'});await deliver({...base,type:'blue'});assert.equal(visible.size,3);
  for(const type of ['red','flashred','flashgreen']){
    const urgent={...base,type};await deliver(urgent);const size=visible.size;
    restart();serverNow+=120001;await deliver(urgent);assert.equal(visible.size,size,'Urgent retry replaces only itself');assert.equal(latest().options.silent,undefined,'Urgent delivery retains normal alert behavior');
    await deliver({...urgent,eventId:'history-2'});assert.equal(visible.size,size+1,'Every distinct urgent event stays visible');
  }
  const size=visible.size;
  await deliver({...base,type:'report'});await deliver({...base,type:'report'});assert.equal(visible.size,size+2);
  await deliver({type:'green'});await deliver({type:'green'});assert.equal(visible.size,size+4,'Older clients fall back safely');

  resetDevice();failDisplay=true;const before=receipts.length;
  await assert.rejects(deliver(base),/Offline display failure/);assert.equal(receipts.length,before);
  restart();failDisplay=false;await deliver(base);assert.equal(visible.size,1,'Exact event retries a failed display after restart');
  failStorage=true;const displayedBefore=displayed.length,receiptsBefore=receipts.length;
  await assert.rejects(deliver({...base,eventId:'history-2',eventAt:120000}),/Offline storage failure/);
  assert.equal(displayed.length,displayedBefore,'No unsafe grouped display without durable ordering');assert.equal(receipts.length,receiptsBefore);
  await deliver({...base,type:'flashred'});assert.equal(visible.size,2,'Urgent delivery does not depend on routine state storage');
  failStorage=false;restart();await deliver({...base,eventId:'history-2',eventAt:120000});assert.equal(visible.size,2,'Queue recovers and routine retry replaces its group');
  assert.equal(receipts.length,displayed.length-staleReplays,'Only successfully displayed original payloads are acknowledged; stale pushes redraw current contents without false receipts');
}finally{globalThis.fetch=originalFetch;Date.now=originalNow;}
console.log('PASS: rolling boundary grouping, stable retries, durable stale-event rejection after restart/dismissal, races/ties, urgent/distinct events, encrypted payloads, receipt truthfulness and failure recovery. Offline only.');
