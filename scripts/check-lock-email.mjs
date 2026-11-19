// Lock It / Lock Off alerts reach every staff member the way they chose (Nov 18 2026).
// Offline only: Firebase, push and email providers are intercepted; nothing real is sent.
import assert from 'node:assert/strict';
import {emailRecipients} from '../server/lock-email.js';
import {sessionCookie} from '../server/staff-access.js';
import * as push from '../functions/notify.js';

// Who gets an email.
const cfg={Kevin:{email:'k@example.test',pref:'text'},Mike:{email:'m@example.test',pref:'both'},Brad:{email:'b@example.test',pref:'email'}};
let names=emailRecipients(cfg,{Kevin:{devices:1,eligible:1,sent:1}}).map(r=>r.name);
assert.deepEqual(names,['Mike','Brad'],'Email only and Email + push always email; a delivered push needs no email');
names=emailRecipients({...cfg,Brad:{email:'b@example.test',pref:'text'}},{Kevin:{devices:1,eligible:1,sent:1}}).map(r=>r.name);
assert(names.includes('Brad'),'A push chooser with no registered device is emailed instead');
names=emailRecipients({...cfg,Brad:{email:'b@example.test',pref:'text'}},{Brad:{devices:1,eligible:1,sent:0}}).map(r=>r.name);
assert(names.includes('Brad'),'A push chooser whose push failed is emailed instead');
names=emailRecipients({...cfg,Brad:{email:'b@example.test',pref:'text'}},{Brad:{devices:1,eligible:0,sent:0}}).map(r=>r.name);
assert(!names.includes('Brad'),'Turning this alert off on every device is respected');
names=emailRecipients({Brad:{email:'b@example.test',pref:'none'}},{}).map(r=>r.name);
assert.deepEqual(names,[],'No notifications means none');
names=emailRecipients({Brad:{pref:'email'}},{}).map(r=>r.name);
assert.deepEqual(names,[],'No saved email address, no email');

names=emailRecipients(cfg,{},new Set(['brad'])).map(r=>r.name);
assert.deepEqual(names,['Brad'],'A send aimed at one person emails only that person');

// Full /notify path: Brad saves E16 Lock Off from a phone with no push device.
const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
const receiver=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
const pub=Buffer.from(await crypto.subtle.exportKey('raw',receiver.publicKey)).toString('base64url');
const env={VAPID_PRIVATE_JWK:JSON.stringify(await crypto.subtle.exportKey('jwk',pair.privateKey)),FIREBASE_DB_SECRET:'offline-test-secret',BREVO_API_KEY:'offline-test-provider'};
const staffConfig={Kevin:{email:'k@example.test',pref:'text'},Mike:{email:'m@example.test',pref:'none'},Brad:{email:'b@example.test',pref:'text'}};
const cookie=(await sessionCookie('Brad',staffConfig.Brad,env)).split(';')[0];
let marks={},mails=[],pushes=0;
const now=Date.now();
globalThis.fetch=async(url,init={})=>{
  const u=String(url);
  if(u.includes('/staffConfig.json'))return Response.json(staffConfig);
  if(u.includes('/pushSubs.json'))return Response.json({a:{staff:'Kevin',endpoint:'https://fcm.googleapis.com/kevin',keys:{p256dh:pub,auth:Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64url')}}});
  if(u.includes('/lockLog/evE16.json'))return Response.json({type:'lock',label:'E16',from:'Late',to:'Lock Off',who:'Brad',t:now,notificationCommittedAt:now});
  if(u.includes('/lockLog/evOld.json'))return Response.json({type:'lock',label:'E16',from:'Late',to:'Lock Off',who:'Brad',t:now-3600e3,notificationCommittedAt:now-3600e3});
  if(u.includes('/lockEmails/')){const k=u.split('/lockEmails/')[1].split('.json')[0];if(init.method==='PUT'){marks[k]=JSON.parse(init.body);return Response.json(marks[k]);}return Response.json(marks[k]||null);}
  if(u.startsWith('https://fcm.googleapis.com/')){pushes++;return new Response('',{status:201});}
  if(u==='https://api.brevo.com/v3/smtp/email'){mails.push(JSON.parse(init.body));return Response.json({messageId:'offline'},{status:201});}
  throw new Error('Unexpected request '+u);
};
const req=(d,withCookie=true)=>new Request('https://storewell.test/notify',{method:'POST',headers:withCookie?{Cookie:cookie}:{},body:JSON.stringify(d)});
const body={type:'flashgreen',unit:'E16',eventId:'evE16',title:'Lock Off — Unit E16',body:'Unit E16 · Brad'};
let d=await (await push.onRequestPost({env,request:req(body)})).json();
assert.equal(d.sent,1,'Kevin still gets his push');assert.equal(pushes,1);
assert.deepEqual(d.emailed,['Brad'],'Brad has no device, so Brad gets the alert by email');
assert.deepEqual(d.noDevice,['Mike','Brad']);
assert.equal(mails[0].to[0].email,'b@example.test');assert.match(mails[0].subject,/Lock Off - Unit E16/);assert.match(mails[0].textContent,/Set by Brad, .* CT\./);
d=await (await push.onRequestPost({env,request:req(body)})).json();
assert.equal(mails.length,1,'A retry of the same save does not email twice');
mails=[];d=await (await push.onRequestPost({env,request:req({...body,eventId:'evE16x'},false)})).json();
assert.deepEqual(d.emailed,[],'No staff sign-in, no email');assert.equal(mails.length,0);
d=await (await push.onRequestPost({env,request:req({...body,eventId:'evOld'})})).json();
assert.equal(mails.length,0,'Old history records cannot be replayed into emails');
d=await (await push.onRequestPost({env,request:req({...body,type:'green',title:'Rented — Unit E16'})})).json();
assert.equal(mails.length,0,'Routine colors stay push only');
console.log('PASS: Lock It and Lock Off reach every staff member by push or email as they chose; offline only.');

// Nov 19 2026: Kevin finishes a Lock Off job (E16 Lock Off -> Rented). Brad must hear it is done.
{
  const {lockJobDone}=push;
  assert.deepEqual(lockJobDone({type:'green'},{from:'Lock Off',to:'Rented'}),{flash:'flashgreen',label:'Lock Off done'});
  assert.deepEqual(lockJobDone({type:'red'},{from:'Lock It',to:'Late'}),{flash:'flashred',label:'Lock It done'});
  assert.equal(lockJobDone({type:'green'},{from:'Reserved',to:'Rented'}),null,'Routine changes are not lock jobs');
  assert.equal(lockJobDone({type:'flashgreen'},{from:'Lock It',to:'Lock Off'}),null,'A new action is not a finished job');
  assert.equal(lockJobDone({type:'green'},{from:'Lock Off',to:'Late'}),null,'History must match the saved status');
  const bradPub=pub;
  const kevinCookie=(await sessionCookie('Kevin',staffConfig.Kevin,env)).split(';')[0];
  let done=[];mails=[];pushes=0;
  staffConfig.Mike.pref='email';
  const prev=globalThis.fetch;
  globalThis.fetch=async(url,init={})=>{
    const u=String(url);
    if(u.includes('/pushSubs.json'))return Response.json({b:{staff:'Brad',prefs:{flashred:true,flashgreen:true,report:true},endpoint:'https://fcm.googleapis.com/brad',keys:{p256dh:bradPub,auth:Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64url')}},k:{staff:'Kevin',prefs:{flashred:false,flashgreen:false,report:true},endpoint:'https://fcm.googleapis.com/kevin2',keys:{p256dh:bradPub,auth:Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64url')}}});
    if(u.includes('/lockLog/evDone.json'))return Response.json({type:'lock',label:'E16',from:'Lock Off',to:'Rented',who:'Kevin',t:Date.now(),notificationCommittedAt:Date.now()});
    if(u.includes('/lockLog/evRoutine.json'))return Response.json({type:'lock',label:'E16',from:'Reserved',to:'Rented',who:'Kevin',t:Date.now(),notificationCommittedAt:Date.now()});
    if(u.startsWith('https://fcm.googleapis.com/')){done.push(u);pushes++;return new Response('',{status:201});}
    return prev(url,init);
  };
  const kreq=d=>new Request('https://storewell.test/notify',{method:'POST',headers:{Cookie:kevinCookie},body:JSON.stringify(d)});
  let r=await (await push.onRequestPost({env,request:kreq({type:'green',unit:'E16',eventId:'evDone',title:'Rented — Unit E16',body:'Unit E16 · Kevin'})})).json();
  assert.equal(r.done,'Lock Off done');assert.deepEqual(done,['https://fcm.googleapis.com/brad'],'Brad\'s Lock Off device gets the done push; Kevin\'s (Lock Off off) does not');
  assert.deepEqual(r.pushedTo,['Brad']);
  assert(mails.length===1&&mails[0].to[0].email==='m@example.test'&&mails.every(m=>/Lock Off done - Unit E16/.test(m.subject)),'Email choosers get "Lock Off done"');
  assert(mails.some(m=>/Now Rented\. Done by Kevin/.test(m.textContent)));
  done=[];mails=[];
  r=await (await push.onRequestPost({env,request:kreq({type:'green',unit:'E16',eventId:'evRoutine',title:'Rented — Unit E16',body:'Unit E16 · Kevin'})})).json();
  assert.equal(r.done,undefined);assert.deepEqual(done,[],'A plain Rented change stays quiet unless someone turned Rented on');assert.equal(mails.length,0);
  staffConfig.Mike.pref='none';
  globalThis.fetch=prev;
  console.log('PASS lock job done alerts reach Brad');
}

// Nov 19 2026: a dropped phone signup (410) is removed AND its owner is emailed once.
{
  let mailsTo=[],deleted=[];const prev=globalThis.fetch;
  globalThis.fetch=async(url,init={})=>{
    const u=String(url);
    if(u.includes('/staffConfig.json'))return Response.json({Kevin:{email:'k@example.test',pref:'text'},Mike:{email:'m@example.test',pref:'none'},Brad:{email:'b@example.test',pref:'text'}});
    if(u.includes('/pushSubs.json'))return Response.json({b:{staff:'Brad',prefs:{report:true},endpoint:'https://fcm.googleapis.com/gone',keys:{p256dh:pub,auth:Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64url')}}});
    if(u.includes('/pushSubs/b.json')&&init.method==='DELETE'){deleted.push('b');return Response.json(null);}
    if(u.startsWith('https://fcm.googleapis.com/gone'))return new Response('',{status:410});
    if(u==='https://api.brevo.com/v3/smtp/email'){mailsTo.push(JSON.parse(init.body).to[0].email);return Response.json({messageId:'offline'},{status:201});}
    return prev(url,init);
  };
  const r=await (await push.onRequestPost({env,request:new Request('https://storewell.test/notify',{method:'POST',body:JSON.stringify({type:'report',title:'Report',body:'x',recipients:['Brad']})})})).json();
  assert.deepEqual(deleted,['b'],'The dead signup is removed');
  assert.deepEqual(r.droppedNotified,['Brad']);assert.deepEqual(mailsTo,['b@example.test'],'Brad is told his phone alerts stopped');
  globalThis.fetch=prev;console.log('PASS dropped phone signups email their owner');
}
