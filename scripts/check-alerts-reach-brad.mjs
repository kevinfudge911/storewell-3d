// Nov 26 2026: Brad had no phone signed up for a week and nothing told him. Offline only.
import {JSDOM} from 'jsdom';import fs from 'node:fs';import assert from 'node:assert/strict';
import * as push from '../functions/notify.js';
const src=fs.readFileSync('public/notifications.js','utf8');

// 1. Alerts go out like Ohana Home: high urgency, kept 24 hours, one retry when busy.
assert.deepEqual(push.PUSH_OPTIONS,{ttl:86400,urgency:'high'});
{
  const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
  const rx=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
  const pub=Buffer.from(await crypto.subtle.exportKey('raw',rx.publicKey)).toString('base64url');
  const env={VAPID_PRIVATE_JWK:JSON.stringify(await crypto.subtle.exportKey('jwk',pair.privateKey)),FIREBASE_DB_SECRET:'offline'};
  let tries=0,headers=null;const prev=globalThis.fetch;
  globalThis.fetch=async(url,init={})=>{const u=String(url);
    if(u.includes('/pushSubs.json'))return Response.json({b:{staff:'Brad',prefs:{report:true},endpoint:'https://fcm.googleapis.com/brad',keys:{p256dh:pub,auth:Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64url')}}});
    if(u.startsWith('https://fcm.googleapis.com/')){tries++;headers=new Headers(init.headers);return new Response('',{status:tries===1?503:201});}
    throw new Error('Unexpected '+u);};
  const r=await (await push.onRequestPost({env,request:new Request('https://storewell.test/notify',{method:'POST',body:JSON.stringify({type:'report',title:'t',body:'b',recipients:['Brad']})})})).json();
  globalThis.fetch=prev;
  assert.equal(headers.get('urgency'),'high','Sent as high priority');assert.equal(headers.get('ttl'),'86400','Kept 24 hours');
  assert.equal(tries,2,'A busy push service gets one retry');assert.equal(r.sent,1);assert.deepEqual(r.pushedTo,['Brad']);
}

// 2. A phone that can't get alerts always says so, with the exact fix.
async function run({ua,push=false,standalone=false,signedInLate=false,perm='default'}){
  const dom=new JSDOM('<!doctype html><body></body>',{runScripts:'outside-only',url:'https://storewell.test/'});const w=dom.window;Object.defineProperty(w.navigator,'userAgent',{value:ua});
  Object.defineProperty(w.crypto,'subtle',{value:globalThis.crypto.subtle});w.TextEncoder=TextEncoder;
  w.matchMedia=()=>({matches:standalone});
  if(push){w.Notification={permission:perm,requestPermission:async()=>perm};w.PushManager=function(){};
    const reg={pushManager:{getSubscription:async()=>null,subscribe:async()=>null}};
    Object.defineProperty(w.navigator,'serviceWorker',{value:{register:async()=>reg,ready:Promise.resolve(reg),getRegistration:async()=>reg}});}
  let who=signedInLate?'':'Brad';w.__swCheckLogin=()=>who;
  w.fetch=async()=>({ok:true,json:async()=>({configured:true,publicKey:'cHVi'})});
  w.eval(src);w.dispatchEvent(new w.Event('load'));await new Promise(r=>setTimeout(r,30));
  if(signedInLate){assert.equal(w.document.getElementById('sw-alerts-off'),null);who='Brad';w.dispatchEvent(new w.CustomEvent('sw-staff-signed-in'));await new Promise(r=>setTimeout(r,30));}
  return w.document.getElementById('sw-alerts-off')?.textContent||'';
}
const iphone='Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1';
const android='Mozilla/5.0 (Linux; Android 15; SM-S938U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36';
assert.match(await run({ua:iphone}),/Add to Home Screen/,'iPhone in Safari is told to use the Home Screen app');
assert.match(await run({ua:iphone,signedInLate:true}),/Add to Home Screen/,'Also when the sign-in finishes after the page loads');
assert.match(await run({ua:android+' FBAV/1'}),/Open StoreWell in Chrome/,'In-app browsers are told to open Chrome');
assert.match(await run({ua:android,push:true,signedInLate:true}),/Alerts are off/,'An Android phone signed in late with alerts not allowed shows the red bar');
console.log('PASS alerts go out high priority for 24 hours with a retry, and a phone that cannot get alerts always says so.');
