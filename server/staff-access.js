// Staff credentials and database administration stay on the server.
export const STAFF=['Kevin','Mike','Brad'];
export const FB='https://storewell-3d-default-rtdb.firebaseio.com';
export const json=(data,status=200,headers={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store',...headers}});
const COOKIE='__Host-storewell_staff';
const LIFE=30*24*60*60;
const encode=bytes=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const decode=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
export async function sign(value,env){
  if(!env.FIREBASE_DB_SECRET)throw new Error('Staff service is not configured');
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode('storewell-staff-v1:'+env.FIREBASE_DB_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  return encode(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value))));
}
export async function dbRequest(path,env,init={}){
  if(!env.FIREBASE_DB_SECRET)throw new Error('Staff service is not configured');
  const url=FB+'/'+path+'.json?auth='+encodeURIComponent(env.FIREBASE_DB_SECRET);
  return fetch(url,{...init,signal:AbortSignal.timeout(12000)});
}
export async function readData(path,env){
  const response=await dbRequest(path,env);
  if(!response.ok)throw new Error('The saved staff information could not be reached');
  return await response.json()||{};
}
export function sameOrigin(request){
  const origin=request.headers.get('Origin');
  return origin===new URL(request.url).origin&&request.headers.get('Sec-Fetch-Site')!=='cross-site';
}
export function safeContact(value={}){
  return Object.fromEntries(['email','phone','carrier','pref'].map(key=>[key,String(value[key]??(key==='pref'?'email':''))]));
}
async function fingerprint(name,contact,env){return sign('account:'+name+':'+String(contact?.email||'').toLowerCase()+':'+String(contact?.phone||''),env);}
export async function sessionCookie(name,contact,env){
  const payload=encode(new TextEncoder().encode(JSON.stringify({name,expires:Date.now()+LIFE*1000,version:await fingerprint(name,contact,env)})));
  return COOKIE+'='+payload+'.'+await sign(payload,env)+'; Path=/; Max-Age='+LIFE+'; HttpOnly; Secure; SameSite=Strict';
}
export const clearCookie=()=>COOKIE+'=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict';
export async function staffSession(request,env){
  const raw=(request.headers.get('Cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
  if(!raw||raw.length>1800)return null;
  try{
    const [payload,signature,...extra]=raw.split('.');
    if(extra.length||!signature||signature!==await sign(payload,env))return null;
    const claims=JSON.parse(new TextDecoder().decode(decode(payload)));
    if(!STAFF.includes(claims.name)||!Number.isFinite(claims.expires)||claims.expires<Date.now()||claims.expires>Date.now()+LIFE*1000)return null;
    const config=await readData('staffConfig',env);
    if(claims.version!==await fingerprint(claims.name,config[claims.name],env))return null;
    return {name:claims.name,config};
  }catch{return null;}
}
// Atomically count attempts, including concurrent requests. Values never contain
// an email, IP address or credential. These records expire as a sliding window.
export async function takeLoginAttempt(key,limit,env){
  const path='staffLoginAttempts/'+await sign(key,env),now=Date.now();
  for(let retry=0;retry<3;retry++){
    const response=await dbRequest(path,env,{headers:{'X-Firebase-ETag':'true'}});
    if(!response.ok)throw new Error('Sign-in is temporarily unavailable');
    const old=await response.json(),active=old&&old.until>now;
    if(active&&old.count>=limit)return false;
    const next={count:active?old.count+1:1,until:active?old.until:now+15*60*1000};
    const saved=await dbRequest(path,env,{method:'PUT',headers:{'Content-Type':'application/json','if-match':response.headers.get('etag')||'null_etag'},body:JSON.stringify(next)});
    if(saved.ok)return true;
    if(saved.status!==412)throw new Error('Sign-in is temporarily unavailable');
  }
  throw new Error('Sign-in is busy. Please try again.');
}
export async function clearLoginAttempts(key,env){await dbRequest('staffLoginAttempts/'+await sign(key,env),env,{method:'DELETE'});}
