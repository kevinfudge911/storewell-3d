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
