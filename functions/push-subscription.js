import {json,staffSession,sameOrigin,readData,dbRequest} from '../server/staff-access.js';
export function endpointAllowed(endpoint){
  try{const u=new URL(endpoint);return u.protocol==='https:'&&!u.username&&!u.password&&(!u.port||u.port==='443')&&(/(^|\.)push\.apple\.com$/.test(u.hostname)||/(^|\.)notify\.windows\.com$/.test(u.hostname)||/(^|\.)push\.services\.mozilla\.com$/.test(u.hostname)||['fcm.googleapis.com','android.googleapis.com','web.push.apple.com'].includes(u.hostname));}catch{return false;}
}
const DEFAULT={flashred:true,flashgreen:true,report:true};
const TYPES=['flashred','flashgreen','red','green','blue','yellow','purple','white','black','report'];
export async function onRequestPost({request,env}){
  if(!sameOrigin(request))return json({error:'Open StoreWell to enable alerts.'},403);
  const session=await staffSession(request,env);if(!session)return json({error:'Sign in before enabling alerts.'},401);
  let input;try{input=await request.json();}catch{return json({error:'Invalid device subscription.'},400);}
  const sub=input.subscription;
  if(!sub||!endpointAllowed(sub.endpoint)||sub.endpoint.length>2048||!/^[A-Za-z0-9_-]{80,100}={0,2}$/.test(sub.keys?.p256dh||'')||!/^[A-Za-z0-9_-]{20,30}={0,2}$/.test(sub.keys?.auth||''))return json({error:'This device did not provide a valid push subscription.'},400);
  const id=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(sub.endpoint)))].slice(0,12).map(x=>x.toString(16).padStart(2,'0')).join('');
  try{
    const existing=await readData('pushSubs/'+id,env);
    let previous,previousId;
    if(input.previousSubscription?.endpoint&&input.previousSubscription.endpoint!==sub.endpoint){
      previousId=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(input.previousSubscription.endpoint)))].slice(0,12).map(x=>x.toString(16).padStart(2,'0')).join('');
      previous=await readData('pushSubs/'+previousId,env);
      if(previous.staff!==session.name||previous.endpoint!==input.previousSubscription.endpoint||previous.keys?.auth!==input.previousSubscription.keys?.auth||previous.keys?.p256dh!==input.previousSubscription.keys?.p256dh){previous=null;previousId=null;}
    }
    const prefs=input.prefs??existing.prefs??previous?.prefs??DEFAULT;
    if(!prefs||typeof prefs!=='object'||Object.entries(prefs).some(([k,v])=>!TYPES.includes(k)||typeof v!=='boolean'))return json({error:'Invalid alert preferences.'},400);
    const node={endpoint:sub.endpoint,keys:{p256dh:sub.keys.p256dh,auth:sub.keys.auth},expirationTime:sub.expirationTime??null,prefs,staff:session.name,updatedAt:Date.now()};
    const response=await dbRequest('pushSubs/'+id,env,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(node)});
    if(!response.ok)throw new Error();
    if(previousId)await dbRequest('pushSubs/'+previousId,env,{method:'DELETE'});
    return json({success:true,id,prefs,staff:session.name});
  }catch{return json({error:'Could not save this device’s alert settings.'},503);}
}
