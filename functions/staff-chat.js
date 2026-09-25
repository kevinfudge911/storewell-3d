import {json,staffSession,sameOrigin,readData,dbRequest,takeLoginAttempt} from '../server/staff-access.js';
const clean=(id,r)=>({id,name:String(r.name||'Staff'),text:String(r.text||''),uid:String(r.uid||''),t:Number(r.t)||0});
export async function onRequestGet({request,env}){
  const session=await staffSession(request,env);if(!session)return json({error:'Staff sign-in is required.'},401);
  try{const messages=await readData('messages',env);return json({messages:Object.entries(messages).filter(([,r])=>r&&typeof r==='object').map(([id,r])=>clean(id,r)).sort((a,b)=>a.t-b.t)});}catch{return json({error:'Staff chat could not load. Please retry.'},503);}
}
export async function onRequestPost({request,env}){
  if(!sameOrigin(request))return json({error:'Open StoreWell to send a message.'},403);
  const session=await staffSession(request,env);if(!session)return json({error:'Staff sign-in is required.'},401);
  let body;try{body=await request.json();}catch{return json({error:'Invalid message.'},400);}
  if(!body||typeof body.text!=='string'||!body.text.trim()||body.text.length>2000||typeof body.id!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(body.id))return json({error:'Enter a message of 1–2000 characters.'},400);
  const id=session.name+'-'+body.id,text=body.text.trim(),path='messages/'+id;
  try{
    const response=await dbRequest(path,env,{headers:{'X-Firebase-ETag':'true'}});if(!response.ok)throw new Error();const existing=await response.json();
    if(existing){if(existing.name!==session.name||existing.text!==text)return json({error:'This message identifier is already in use.'},409);return json({success:true,message:clean(id,existing)});}
    if(!await takeLoginAttempt('chat:'+session.name,90,env))return json({error:'Please wait a little before sending another message.'},429);
    const message={name:session.name,text,t:Date.now(),uid:typeof body.uid==='string'?body.uid.slice(0,100):session.name};
    const write=await dbRequest(path,env,{method:'PUT',headers:{'Content-Type':'application/json','if-match':response.headers.get('etag')||'null_etag'},body:JSON.stringify(message)});
    if(!write.ok)throw new Error();return json({success:true,message:clean(id,message)});
  }catch{return json({error:'Your message was not confirmed saved. Retry with your draft intact.'},503);}
}
