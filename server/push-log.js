// Nov 26 2026: a lasting record of every alert signup change, so a lost signup can always be
// traced (who, which device, what happened, when). Refreshes of an unchanged signup are not logged.
import {dbRequest,FB} from './staff-access.js';
const host=e=>{try{return new URL(e).hostname;}catch{return '';}};
export async function logPush(env,{event,staff,id,endpoint,status,from}){
  try{await dbRequest('pushLog',env,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,staff:staff||null,id:id||null,host:host(endpoint),...(status?{status}:{}),...(from?{from}:{}),at:Date.now()})});}catch{/* the history must never block alerts */}
}
// Newest saved and dropped time per staff member, for the Team screen.
export async function lastPushEvents(env){
  const out={};
  try{
    const r=await fetch(FB+'/pushLog.json?orderBy=%22%24key%22&limitToLast=200&auth='+encodeURIComponent(env.FIREBASE_DB_SECRET),{signal:AbortSignal.timeout(8000)});if(!r.ok)return out;const log=await r.json();
    for(const e of Object.values(log||{})){
      if(!e?.staff)continue;const p=out[e.staff]||(out[e.staff]={});
      const kind=e.event==='dropped'?'dropped':(['new','moved','reassigned'].includes(e.event)?'saved':null);
      if(kind&&(!p[kind]||e.at>p[kind]))p[kind]=e.at;
    }
  }catch{}
  return out;
}
