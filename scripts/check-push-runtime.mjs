// Exercise the actual Cloudflare runtime with generated keys and local providers.
// Node's fetch accepts options that workerd rejects before contacting the provider.
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';

const signer=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
const receiver=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
const subscription={staff:'Brad',endpoint:'https://fcm.googleapis.com/runtime-fixture',keys:{
  p256dh:Buffer.from(await crypto.subtle.exportKey('raw',receiver.publicKey)).toString('base64url'),
  auth:Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64url'),
}};
const {outputFiles}=await build({stdin:{contents:"import {onRequestPost} from './functions/notify.js';export default {fetch(request,env){return onRequestPost({request,env})}}",resolveDir:process.cwd()},bundle:true,write:false,format:'esm',platform:'browser'});
let providerStatus=201,deliveries=0,otherRequests=0;
const mf=new Miniflare(convertV4MiniflareOptions({
  modules:true,script:outputFiles[0].text,compatibilityDate:'2026-09-01',
  bindings:{VAPID_PRIVATE_JWK:JSON.stringify(await crypto.subtle.exportKey('jwk',signer.privateKey)),FIREBASE_DB_SECRET:'runtime-fixture'},
  outboundService:async request=>{
    const url=new URL(request.url);
    if(url.hostname==='storewell-3d-default-rtdb.firebaseio.com'&&url.pathname==='/pushSubs.json')return Response.json({device:subscription});
    if(url.hostname==='fcm.googleapis.com'){
      deliveries++;assert.equal(request.method,'POST');assert.equal(request.headers.get('Content-Encoding'),'aes128gcm');
      assert((await request.arrayBuffer()).byteLength>1000);
      return new Response('',{status:providerStatus,...(providerStatus===307?{headers:{Location:'https://never-follow.example.test'}}:{})});
    }
    otherRequests++;return new Response('Unexpected request',{status:500});
  },
}));
try{
  const send=()=>mf.dispatchFetch('https://storewell.test/notify',{method:'POST',body:JSON.stringify({type:'report',title:'Runtime fixture',recipients:['Brad']})});
  let response=await send(),result=await response.json();
  assert.equal(response.status,200,JSON.stringify(result));assert.equal(result.sent,1);assert.equal(deliveries,1);
  providerStatus=307;response=await send();result=await response.json();
  assert.equal(response.status,502);assert.equal(result.sent,0);assert.equal(result.failed,1);
  assert.equal(result.failures[0].status,307);assert.equal(otherRequests,0,'Never forward push credentials to a redirect destination');
  console.log('PASS: Cloudflare runtime sends encrypted push requests and refuses redirects. Local providers only; no live messages.');
}finally{await mf.dispose();}
