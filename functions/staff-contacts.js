import {STAFF,json,staffSession,safeContact,sameOrigin,dbRequest,readData,sessionCookie} from '../server/staff-access.js';
export async function onRequestGet({request,env}){
  const session=await staffSession(request,env);
  if(!session)return json({error:'Sign in to view staff contacts.'},401);
  try{
    const subs=await readData('pushSubs',env),delivery={};
    for(const name of STAFF){const own=Object.values(subs).filter(s=>s?.staff?.toLowerCase()===name.toLowerCase());delivery[name]={devices:own.length,reportDevices:own.filter(s=>(s.prefs||{report:true}).report===true).length};}
    return json({contacts:Object.fromEntries(STAFF.map(n=>[n,safeContact(session.config[n])])),delivery});
  }catch{return json({error:'Team information could not connect. Reopen Team to retry.'},503);}
}
export async function onRequestPatch({request,env}){
  if(!sameOrigin(request))return json({error:'Open StoreWell to save contacts.'},403);
  const session=await staffSession(request,env);
  if(!session)return json({error:'Sign in again before saving contacts.'},401);
  let input;try{input=await request.json();}catch{return json({error:'Invalid contact changes.'},400);}
  if(!Array.isArray(input.contacts)||input.contacts.length>STAFF.length)return json({error:'Invalid contact changes.'},400);
  const patch={};
  for(const contact of input.contacts){
    if(!contact||!STAFF.includes(contact.name))return json({error:'Unknown staff member.'},400);
    for(const [field,raw] of Object.entries(contact)){
      if(field==='name')continue;
      if(!['email','phone','carrier','pref'].includes(field)||typeof raw!=='string')return json({error:'Invalid contact field.'},400);
      const value=raw.trim();
      if(value.length>254)return json({error:'Contact value is too long.'},400);
      if(field==='email'&&!/^\S+@\S+\.\S+$/.test(value))return json({error:'Enter a valid email for '+contact.name+'.'},400);
      if(field==='phone'&&!/^\+?[\d ()-]{7,24}$/.test(value))return json({error:'Enter a valid phone number for '+contact.name+'.'},400);
      if(field==='pref'&&!['email','text','push','both','none'].includes(value))return json({error:'Choose a valid delivery preference.'},400);
      patch[contact.name+'/'+field]=value;
    }
  }
  try{
    if(Object.keys(patch).length){
      const response=await dbRequest('staffConfig',env,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(patch)});
      if(!response.ok)throw new Error();
    }
    const verified=await readData('staffConfig',env);
    for(const [path,value]of Object.entries(patch)){const [name,field]=path.split('/');if(verified[name]?.[field]!==value)throw new Error();}
    return json({success:true,contacts:Object.fromEntries(STAFF.map(n=>[n,safeContact(verified[n])]))},200,{'Set-Cookie':await sessionCookie(session.name,verified[session.name],env)});
  }catch{return json({error:'Contacts could not be confirmed saved. Reopen Team before retrying.'},503);}
}
