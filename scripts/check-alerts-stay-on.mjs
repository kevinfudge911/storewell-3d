import {JSDOM} from 'jsdom';import fs from 'node:fs';import assert from 'node:assert/strict';
const src=fs.readFileSync('public/notifications.js','utf8');
async function run(perm,hasSub,signedIn){
  const dom=new JSDOM('<!doctype html><body></body>',{runScripts:'outside-only',url:'https://storewell.test/'});const w=dom.window;
  w.Notification={permission:perm,requestPermission:async()=>perm};w.PushManager=function(){};
  const sub=hasSub?{toJSON:()=>({endpoint:'https://fcm.googleapis.com/x',keys:{p256dh:'a',auth:'b'}}),options:{}}:null;
  const fresh={toJSON:()=>({endpoint:'https://fcm.googleapis.com/y',keys:{p256dh:'a',auth:'b'}}),options:{}};const reg={pushManager:{getSubscription:async()=>sub,subscribe:async()=>sub||fresh}};
  Object.defineProperty(w.navigator,'serviceWorker',{value:{register:async()=>reg,ready:Promise.resolve(reg),getRegistration:async()=>reg}});
  w.__swCheckLogin=()=>signedIn?'Kevin':'';
  w.fetch=async(u)=>({ok:true,json:async()=>u==='/notify'?{configured:true,publicKey:'cHVi'}:{success:true,id:'d',staff:'Kevin',prefs:{}}});
  w.eval(src);await new Promise(r=>setTimeout(r,50));
  return !!w.document.getElementById('sw-alerts-off');
}
assert.equal(await run('denied',false,true),true,'Signed-in staff with alerts removed sees the banner');
assert.equal(await run('default',false,true),true,'Permission reset shows the banner');
assert.equal(await run('granted',false,true),false,'Granted + signed in re-subscribes on its own');
assert.equal(await run('granted',true,false),false,'Signed out device with its signup refreshes quietly');
assert.equal(await run('denied',false,false),false,'A visitor who never had alerts sees nothing');
console.log('banner ok');
