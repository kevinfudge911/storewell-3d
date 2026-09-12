// Existing Cloudflare secrets remain the source of provider credentials.
const API='https://api.brevo.com/v3';
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const headers=env=>({'api-key':env.BREVO_API_KEY,'Content-Type':'application/json',accept:'application/json'});
const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function onRequestGet({env}){
  if(!env.BREVO_API_KEY)return json({configured:false,ready:false},503);
  try{const r=await fetch(API+'/account',{headers:headers(env),signal:AbortSignal.timeout(10000)});const account=await r.json().catch(()=>({}));const enabled=account.relay?.enabled!==false;
    return json({configured:true,providerConnected:r.ok,smtpEnabled:enabled,ready:r.ok&&enabled},r.ok&&enabled?200:503);
  }catch{return json({configured:true,ready:false,error:'Email provider is unavailable'},503);}
}
export async function onRequestPost({request,env}){
  let d;try{d=await request.json();}catch{return json({success:false,error:'Invalid email request'},400);}
  if(typeof d.to!=='string'||!/^\S+@\S+\.\S+$/.test(d.to)||d.to.length>254)return json({success:false,error:'A valid recipient is required'},400);
  if(!env.BREVO_API_KEY)return json({success:false,error:'Email service is not configured'},503);
  try{const r=await fetch(API+'/smtp/email',{method:'POST',headers:headers(env),signal:AbortSignal.timeout(15000),body:JSON.stringify({sender:{name:'StoreWell Storage',email:'kevin.fudge911@gmail.com'},to:[{email:d.to,name:String(d.toName||d.to).slice(0,100)}],subject:String(d.subject||'StoreWell report').slice(0,250),textContent:String(d.body||' '),htmlContent:d.html||'<pre>'+escape(d.body)+'</pre>'})});
    const result=await r.json().catch(()=>({}));
    if(!r.ok||!result.messageId)return json({success:false,error:'The email provider did not accept this report. Please retry.',providerStatus:r.status},502);
    return json({success:true,messageId:result.messageId});
  }catch{return json({success:false,error:'The email provider could not be reached. Your report has not been cleared.'},503);}
}
