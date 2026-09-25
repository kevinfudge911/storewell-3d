import assert from 'node:assert/strict';
import * as login from '../functions/staff-session.js';
import * as contacts from '../functions/staff-contacts.js';
import * as subscriptions from '../functions/push-subscription.js';
import * as receipts from '../functions/push-receipt.js';
import {sessionCookie} from '../server/staff-access.js';

const originalFetch=globalThis.fetch;
const env={FIREBASE_DB_SECRET:'generated-offline-test-only'};
const db={staffConfig:{Kevin:{email:'kevin@example.test',phone:'5550100911',pref:'text',retained:'yes'},Mike:{email:'mike@example.test',phone:'5550100222',pref:'text'},Brad:{email:'brad@example.test',phone:'5550100333',pref:'both'},_ejsKey:'retained-test-setting'},pushSubs:{legacy:{staff:'Kevin',endpoint:'https://fcm.googleapis.com/legacy',prefs:{report:true}}}};
let writes=[],rejectContactWrite=false;
function read(path){return path.split('/').reduce((value,key)=>value?.[key],db)??null;}
function write(path,value){const parts=path.split('/'),key=parts.pop();let target=db;for(const part of parts)target=target[part]||={};if(value===null)delete target[key];else target[key]=value;}
globalThis.fetch=async(url,init={})=>{
  const u=new URL(url);assert.equal(u.origin,'https://storewell-3d-default-rtdb.firebaseio.com','Checks cannot reach providers or production');assert.equal(u.searchParams.get('auth'),env.FIREBASE_DB_SECRET);
  const path=u.pathname.slice(1,-5),method=init.method||'GET';
  if(method==='GET')return Response.json(read(path),{headers:{etag:'"offline"'}});
  if(rejectContactWrite&&path==='staffConfig')return Response.json({error:'denied'},{status:403});
  writes.push({path,method});
  if(method==='PATCH'){for(const [key,value]of Object.entries(JSON.parse(init.body)))write(path+'/'+key,value);}
  else write(path,method==='DELETE'?null:JSON.parse(init.body));
  return Response.json({success:true});
};
function req(path,method='GET',body,cookie,origin='https://storewell.test'){
  return new Request('https://storewell.test'+path,{method,headers:{Origin:origin,...(cookie?{Cookie:cookie}:{}),'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'},...(body?{body:JSON.stringify(body)}:{})});
}
const call=(handler,request)=>handler({request,env});
assert.equal((await call(contacts.onRequestPatch,req('/staff-contacts','PATCH',{contacts:[]}))).status,401);
assert.equal((await call(login.onRequestPost,req('/staff-session','POST',{email:'kevin@example.test',password:'incorrect'},undefined,'https://attacker.test'))).status,403);
let response=await call(login.onRequestPost,req('/staff-session','POST',{email:'kevin@example.test',password:'incorrect'}));assert.equal(response.status,401);
response=await call(login.onRequestPost,req('/staff-session','POST',{email:'KEVIN@example.test',password:'0911'}));assert.equal(response.status,200);
const rawCookie=response.headers.get('set-cookie'),cookie=rawCookie.split(';')[0];assert(/HttpOnly; Secure; SameSite=Strict/.test(rawCookie));assert(!JSON.stringify(await response.json()).includes('0911'));
assert.equal((await (await call(login.onRequestGet,req('/staff-session','GET',null,cookie))).json()).name,'Kevin');
const loaded=await (await call(contacts.onRequestGet,req('/staff-contacts','GET',null,cookie))).json();assert.equal(loaded.delivery.Kevin.reportDevices,1);assert.equal(loaded.delivery.Mike.devices,0);assert(!JSON.stringify(loaded).includes('retained-test-setting'));
response=await call(contacts.onRequestPatch,req('/staff-contacts','PATCH',{contacts:[{name:'Mike',email:'updated@example.test'}]},cookie));assert.equal(response.status,200);assert.equal(db.staffConfig.Mike.email,'updated@example.test');assert.equal(db.staffConfig.Kevin.retained,'yes');assert.equal(db.staffConfig._ejsKey,'retained-test-setting');assert.equal(db.staffConfig.Mike.phone,'5550100222');
assert.equal((await call(contacts.onRequestPatch,req('/staff-contacts','PATCH',{contacts:[{name:'Mike','../Kevin/phone':'bad'}]},cookie))).status,400);
assert.equal((await call(contacts.onRequestPatch,req('/staff-contacts','PATCH',{contacts:[{name:'Mike',email:''}]},cookie))).status,400);
assert.equal((await call(contacts.onRequestPatch,req('/staff-contacts','PATCH',{contacts:[{name:'Mike',pref:'unexpected'}]},cookie))).status,400);
rejectContactWrite=true;assert.equal((await call(contacts.onRequestPatch,req('/staff-contacts','PATCH',{contacts:[{name:'Mike',carrier:'changed'}]},cookie))).status,503);rejectContactWrite=false;
assert.equal((await call(contacts.onRequestGet,req('/staff-contacts','GET',null,cookie+'tampered'))).status,401);
const sub={endpoint:'https://fcm.googleapis.com/new-device',keys:{p256dh:'A'.repeat(87),auth:'B'.repeat(22)}};
assert.equal((await call(subscriptions.onRequestPost,req('/push-subscription','POST',{subscription:sub}))).status,401);
response=await call(subscriptions.onRequestPost,req('/push-subscription','POST',{subscription:sub,staff:'Brad'},cookie));assert.equal(response.status,200);const saved=await response.json();assert.equal(db.pushSubs[saved.id].staff,'Kevin','The server owns staff attribution');assert.equal(saved.prefs.report,true);
const receipt=await receipts.makeReceipt(crypto.randomUUID(),saved.id,'Kevin',env);
assert.equal((await call(receipts.onRequestPost,req('/push-receipt','POST',{...receipt,token:'forged'}))).status,403);
assert.equal((await call(receipts.onRequestPost,req('/push-receipt','POST',receipt))).status,200);
assert.equal((await (await call(receipts.onRequestGet,req('/push-receipt?id='+receipt.id,'GET',null,cookie))).json()).received,1);
const bradCookie=(await sessionCookie('Brad',db.staffConfig.Brad,env)).split(';')[0];assert.equal((await (await call(receipts.onRequestGet,req('/push-receipt?id='+receipt.id,'GET',null,bradCookie))).json()).received,0,'Staff can only inspect their own display confirmations');
db.staffConfig.Kevin.phone='5550100999';assert.equal((await call(contacts.onRequestGet,req('/staff-contacts','GET',null,cookie))).status,401,'Changing a credential invalidates its old session');
for(let n=0;n<6;n++)await call(login.onRequestPost,req('/staff-session','POST',{email:'brad@example.test',password:'incorrect'}));assert.equal((await call(login.onRequestPost,req('/staff-session','POST',{email:'brad@example.test',password:'incorrect'}))).status,429);
assert(writes.every(x=>!['lockLog','lockOverrides','/.settings/rules'].includes(x.path)),'Staff checks never touch inventory, history or rules');
globalThis.fetch=originalFetch;
console.log('PASS: verified staff sessions, rejected forged/expired sessions, login throttling, exact contact patches, retained settings, truthful failures, owned push registration and signed device display receipts. No production requests.');
