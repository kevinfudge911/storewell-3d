// Nov 26 2026: a saved alert signup stays saved. Only a real 410 retires one, only after its
// dead copy is saved, and every real change goes in the signup history. Offline only.
import assert from 'node:assert/strict';
import * as push from '../functions/notify.js';
const receiver=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
const pub=Buffer.from(await crypto.subtle.exportKey('raw',receiver.publicKey)).toString('base64url');
const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
const env={VAPID_PRIVATE_JWK:JSON.stringify(await crypto.subtle.exportKey('jwk',pair.privateKey)),FIREBASE_DB_SECRET:'offline',BREVO_API_KEY:'offline'};
const auth=()=>Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64url');
async function run(subs,status,{deadOk=true}={}){
  const deleted=[],dead=[],log=[],mails=[];
  globalThis.fetch=async(url,init={})=>{
    const u=String(url);
    if(u.includes('/pushSubs.json'))return Response.json(subs);
    if(u.includes('/staffConfig.json'))return Response.json({Brad:{email:'b@example.test',pref:'text'}});
    if(u.includes('/pushSubs/')&&init.method==='DELETE'){deleted.push(u.split('/pushSubs/')[1].split('.json')[0]);return Response.json(null);}
    if(u.includes('/pushDead/')&&init.method==='PUT'){if(!deadOk)return new Response('',{status:500});dead.push(JSON.parse(init.body).staff);return Response.json({});}
    if(u.includes('/pushLog.json')&&init.method==='POST'){log.push(JSON.parse(init.body));return Response.json({name:'x'});}
    if(u.startsWith('https://fcm.googleapis.com/')){const s=u.endsWith('/works')?201:status;return new Response('',{status:s});}
    if(u==='https://api.brevo.com/v3/smtp/email'){mails.push(JSON.parse(init.body).to[0].email);return Response.json({messageId:'x'},{status:201});}
    throw new Error('Unexpected '+u);
  };
  const r=await (await push.onRequestPost({env,request:new Request('https://storewell.test/notify',{method:'POST',body:JSON.stringify({type:'report',title:'Report',body:'x',recipients:['Brad']})})})).json();
  return {r,deleted,dead,log,mails};
}
const brad=(end)=>({staff:'Brad',prefs:{report:true},endpoint:'https://fcm.googleapis.com/'+end,keys:{p256dh:pub,auth:auth()}});
let t=await run({b:brad('x')},404);
assert.deepEqual(t.deleted,[],'A 404 never removes a saved signup');assert.deepEqual(t.mails,[],'and sends no "alerts off" email');
t=await run({b:brad('x')},500);
assert.deepEqual(t.deleted,[],'A busy or broken push service never removes a saved signup');
t=await run({b:brad('x')},410,{deadOk:false});
assert.deepEqual(t.deleted,[],'A 410 keeps the signup if its dead copy could not be saved');
t=await run({b:brad('x')},410);
assert.deepEqual(t.deleted,['b'],'A real 410 retires the signup');assert.deepEqual(t.dead,['Brad']);
assert.equal(t.log[0].event,'dropped');assert.equal(t.log[0].staff,'Brad');assert.equal(t.log[0].status,410);assert.equal(t.log[0].host,'fcm.googleapis.com');
assert.deepEqual(t.mails,['b@example.test'],'Brad is told when his only phone stopped');
t=await run({b:brad('x'),c:brad('works')},410);
assert.deepEqual(t.mails,[],'No "alerts off" email while another phone of his still gets alerts');assert.deepEqual(t.r.pushedTo,['Brad']);
console.log('PASS: saved alert signups stay saved; only a real 410 retires one, every change is recorded. Offline only.');
