// Lock action emails: every staff member gets Lock It / Lock Off alerts the way
// they chose under Team > Notify Via, not only by push. Added Nov 18 2026 after
// Brad set E16 to Lock Off and got nothing while Kevin's phone did.
import {STAFF,staffSession,readData,dbRequest} from './staff-access.js';
export const EMAIL_TYPES={flashred:'Lock It',flashgreen:'Lock Off'};
const unitKey=s=>String(s||'').replace(/[-\s]/g,'').toUpperCase();
const validEmail=s=>typeof s==='string'&&s.length<=254&&/^\S+@\S+\.\S+$/.test(s);
const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Who should get an email for this event. pushByStaff[name] = {eligible, sent}.
export function emailRecipients(config,pushByStaff,only){
  const out=[];
  for(const name of STAFF){
    if(only&&!only.has(name.toLowerCase()))continue;
    const c=config?.[name]||{},pref=c.pref||'email';
    if(pref==='none'||!validEmail(c.email))continue;
    const p=pushByStaff[name]||{devices:0,eligible:0,sent:0};
    // Email only / Email + push always email. Push choosers get email when no
    // device of theirs received it (no device, or every delivery failed), but not
    // when they switched this alert off on every device they have.
    if(pref==='email'||pref==='both'||p.devices===0||(p.eligible>0&&p.sent===0))out.push({name,email:c.email});
  }
  return out;
}
export async function sendLockEmails(d,request,env,pushByStaff,only,done){
  // done = a finished Lock It / Lock Off job (Nov 19 2026), checked against history in notify.js.
  if((!EMAIL_TYPES[d.type]&&!done)||!env.BREVO_API_KEY)return {emailed:[]};
  // Only a signed-in staff save of a real, recent history record can email anyone.
  const session=await staffSession(request,env);
  if(!session||typeof d.eventId!=='string'||!/^[A-Za-z0-9_-]{1,150}$/.test(d.eventId))return {emailed:[]};
  let record;try{record=await readData('lockLog/'+encodeURIComponent(d.eventId),env);}catch{return {emailed:[],emailError:'history'};}
  if(record?.type!=='lock'||unitKey(record.label)!==unitKey(d.unit)||(done?record.from!==EMAIL_TYPES[done.flash]:record.to!==EMAIL_TYPES[d.type])||!Number.isFinite(record.notificationCommittedAt??record.t)||Math.abs(Date.now()-(record.notificationCommittedAt??record.t))>30*60*1000)return {emailed:[]};
  // One email per event, even if the saving device retries.
  const mark='lockEmails/'+encodeURIComponent(d.eventId);
  try{const old=await readData(mark,env);if(old&&old.at)return {emailed:old.to||[],repeat:true};}catch{return {emailed:[],emailError:'history'};}
  const list=emailRecipients(session.config,pushByStaff,only);
  const when=new Date(record.notificationCommittedAt??record.t).toLocaleString('en-US',{timeZone:'America/Chicago',weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})+' CT';
  const label=done?done.label:EMAIL_TYPES[d.type],unit=String(record.label).slice(0,20),who=String(record.who||'Staff').slice(0,40);
  const subject=label+' - Unit '+unit;
  const by=done?'Now '+String(record.to).slice(0,30)+'. Done by ':'Set by ';
  const text=label+' - Unit '+unit+'\n'+by+who+', '+when+'.\n\nOpen StoreWell: https://storewell-3d.pages.dev';
  const emailed=[],failedTo=[];
  await Promise.all(list.map(async r=>{
    try{
      const res=await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',signal:AbortSignal.timeout(15000),headers:{'api-key':env.BREVO_API_KEY,'Content-Type':'application/json',accept:'application/json'},
        body:JSON.stringify({sender:{name:'StoreWell Storage',email:'kevin.fudge911@gmail.com'},to:[{email:r.email,name:r.name}],subject,textContent:text,htmlContent:'<p style="font:16px Arial"><b>'+escape(label)+' - Unit '+escape(unit)+'</b><br>'+escape(by)+escape(who)+', '+escape(when)+'.</p><p><a href="https://storewell-3d.pages.dev">Open StoreWell</a></p>'})});
      const out=await res.json().catch(()=>({}));
      if(res.ok&&out.messageId)emailed.push(r.name);else failedTo.push(r.name);
    }catch{failedTo.push(r.name);}
  }));
  if(emailed.length){try{await dbRequest(mark,env,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({at:Date.now(),to:emailed})});}catch{/* the emails already went */}}
  return {emailed,...(failedTo.length?{emailFailed:failedTo}:{})};
}
