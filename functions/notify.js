import { buildPushPayload } from '@block65/webcrypto-web-push';
const FB='https://storewell-3d-default-rtdb.firebaseio.com';
const DEFAULT_PREFS={flashred:true,flashgreen:true,report:true};
const TYPES=new Set(['flashred','flashgreen','red','green','blue','yellow','purple','white','black','report']);
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const decode=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
const encode=a=>btoa(String.fromCharCode(...a)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
function vapid(env){
  const k=typeof env.VAPID_PRIVATE_JWK==='string'?JSON.parse(env.VAPID_PRIVATE_JWK):env.VAPID_PRIVATE_JWK;
  if(!k?.d||!k?.x||!k?.y||k.crv!=='P-256')throw new Error('Push signing key is not configured');
  const publicKey=encode(new Uint8Array([4,...decode(k.x),...decode(k.y)]));
  return {publicKey,privateKey:k.d,subject:'mailto:kevin.fudge911@gmail.com'};
}
function db(path,env){if(!env.FIREBASE_DB_SECRET)throw new Error('Notification database is not configured');return `${FB}/${path}.json?auth=${encodeURIComponent(env.FIREBASE_DB_SECRET)}`;}
function endpointAllowed(endpoint){
  try{const u=new URL(endpoint);return u.protocol==='https:'&&!u.username&&!u.password&&(!u.port||u.port==='443')&&(/(^|\.)push\.apple\.com$/.test(u.hostname)||/(^|\.)notify\.windows\.com$/.test(u.hostname)||/(^|\.)push\.services\.mozilla\.com$/.test(u.hostname)||['fcm.googleapis.com','android.googleapis.com','web.push.apple.com'].includes(u.hostname));}catch{return false;}
}
export async function onRequestGet({env}){
  try{const keys=vapid(env);return json({configured:!!env.FIREBASE_DB_SECRET,publicKey:keys.publicKey});}
  catch{return json({configured:false,error:'Push signing key is unavailable'},503);}
}
export async function onRequestPost({request,env}){
  let d;try{d=await request.json();}catch{return json({success:false,error:'Invalid notification'},400);}
  if(!TYPES.has(d.type)||typeof d.title!=='string'||!d.title.trim())return json({success:false,error:'Notification type and title are required'},400);
  let keys,subs;
  try{keys=vapid(env);const response=await fetch(db('pushSubs',env),{signal:AbortSignal.timeout(12000)});if(!response.ok)throw new Error();subs=await response.json()||{};}
  catch{return json({success:false,error:'Notification service is not ready',sent:0,failed:0},503);}
  const recipients=Array.isArray(d.recipients)?new Set(d.recipients.filter(x=>typeof x==='string').map(x=>x.toLowerCase())):null;
  const message={title:d.title.slice(0,150),body:String(d.body||'').slice(0,1600),type:d.type,tag:crypto.randomUUID(),url:'/'};
  let sent=0,failed=0,expired=0,skipped=0;
  const selected=Object.entries(subs).filter(([,sub])=>{const prefs=sub?.prefs||DEFAULT_PREFS;if(prefs[d.type]!==true||(recipients&&!recipients.has(String(sub.staff||'').toLowerCase()))){skipped++;return false;}return true;});
  // Every encrypted message carries its own contents, avoiding shared-lastAlert races.
  for(let start=0;start<selected.length;start+=8){
    await Promise.all(selected.slice(start,start+8).map(async([id,sub])=>{
      if(!endpointAllowed(sub?.endpoint)||!sub.keys?.p256dh||!sub.keys?.auth){failed++;return;}
      try{const payload=await buildPushPayload({data:JSON.stringify(message),options:{ttl:3600}},sub,keys);const response=await fetch(sub.endpoint,{...payload,redirect:'error',signal:AbortSignal.timeout(12000)});
        if(response.ok)sent++;else{failed++;if(response.status===404||response.status===410){expired++;await fetch(db('pushSubs/'+encodeURIComponent(id),env),{method:'DELETE',signal:AbortSignal.timeout(8000)});}}
      }catch{failed++;}
    }));
  }
  return json({success:failed===0,sent,failed,expired,skipped,eligible:selected.length},failed&&sent===0?502:200);
}
