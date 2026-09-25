import {json,sign,dbRequest,readData,staffSession,STAFF} from '../server/staff-access.js';
export async function makeReceipt(id,device,staff,env){
  const expires=Date.now()+24*60*60*1000;
  return {id,device,staff,expires,token:await sign('push-receipt:'+id+':'+device+':'+staff+':'+expires,env)};
}
export async function onRequestPost({request,env}){
  let receipt;try{receipt=await request.json();}catch{return json({error:'Invalid receipt.'},400);}
  const {id,device,staff,expires,token}=receipt||{};
  if(!/^[a-f0-9-]{36}$/.test(id||'')||!/^[A-Za-z0-9_-]{1,150}$/.test(device||'')||!STAFF.includes(staff)||!Number.isFinite(expires)||expires<Date.now()||expires>Date.now()+24*60*60*1000)return json({error:'Invalid receipt.'},400);
  try{
    if(token!==await sign('push-receipt:'+id+':'+device+':'+staff+':'+expires,env))return json({error:'Invalid receipt.'},403);
    const path='pushReceipts/'+id+'/'+device,old=await readData(path,env);
    if(!old.displayedAt){const response=await dbRequest(path,env,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({staff,displayedAt:Date.now()})});if(!response.ok)throw new Error();}
    return json({success:true});
  }catch{return json({error:'Receipt could not be recorded.'},503);}
}
export async function onRequestGet({request,env}){
  const session=await staffSession(request,env);if(!session)return json({error:'Sign in to check your test.'},401);
  const id=new URL(request.url).searchParams.get('id');if(!/^[a-f0-9-]{36}$/.test(id||''))return json({error:'Invalid test.'},400);
  try{const records=Object.values(await readData('pushReceipts/'+id,env)).filter(x=>x.staff===session.name&&x.displayedAt);return json({received:records.length,displayedAt:records.length?Math.max(...records.map(x=>x.displayedAt)):null});}
  catch{return json({error:'Device confirmations are unavailable.'},503);}
}
