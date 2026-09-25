import {STAFF,json,readData,sameOrigin,sessionCookie,clearCookie,staffSession,takeLoginAttempt,clearLoginAttempts,sign} from '../server/staff-access.js';
export async function onRequestGet({request,env}){
  const session=await staffSession(request,env);
  return json({signedIn:!!session,name:session?.name||null});
}
export async function onRequestDelete({request}){
  if(!sameOrigin(request))return json({error:'Open StoreWell to sign out.'},403);
  return json({success:true},200,{'Set-Cookie':clearCookie()});
}
export async function onRequestPost({request,env}){
  if(!sameOrigin(request))return json({error:'Open StoreWell to sign in.'},403);
  let input;try{input=await request.json();}catch{return json({error:'Enter your email and password.'},400);}
  const email=String(input.email||'').trim().toLowerCase(),password=String(input.password||'').trim();
  if(!email||email.length>254||!password||password.length>128)return json({error:'Enter your email and password.'},400);
  try{
    const accountKey='account:'+email,ipKey='ip:'+(request.headers.get('CF-Connecting-IP')||'unknown');
    if(!await takeLoginAttempt(ipKey,30,env)||!await takeLoginAttempt(accountKey,6,env))return json({error:'Too many sign-in attempts. Please wait 15 minutes before trying again.'},429);
    const config=await readData('staffConfig',env);
    const name=STAFF.find(n=>String(config[n]?.email||'').toLowerCase()===email);
    const saved=name&&config[name]?.phone?String(config[name].phone).slice(-4):null;
    // Keep the existing staff credentials; never return them to the browser.
    if(!name||!saved||await sign('credential:'+password,env)!==await sign('credential:'+saved,env))return json({error:'Email or password is incorrect.'},401);
    await clearLoginAttempts(accountKey,env);
    return json({success:true,name},200,{'Set-Cookie':await sessionCookie(name,config[name],env)});
  }catch{return json({error:'Staff sign-in could not connect. Please retry.'},503);}
}
