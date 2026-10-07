// Exercise the actual fallback reader with intercepted responses only.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html=fs.readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
const start=html.indexOf('    this._syncPoll=setInterval(async()=>{');
const end=html.indexOf('    },2500);',start)+'    },2500);'.length;
assert(start>=0&&end>start);
let poll,respond,fetches=0,repaints=0;
const writes=[];
const app={_overrides:{C2:'red'},_pendingWrites:{},_LC:()=>({red:1,green:1})};
const context=vm.createContext({
  app,AbortSignal,Date,JSON,Object,Array,Error,
  setInterval:fn=>{poll=fn;return 1;},
  localStorage:{setItem:(k,v)=>writes.push([k,v])},
  _repaintFromOverrides:()=>repaints++,
  fetch:async()=>{fetches++;return respond();}
});
vm.runInContext(`(function(){${html.slice(start,end)}}).call(app)`,context);
for(const [ok,body] of [[false,{error:'Permission denied'}],[true,['green']],[true,{C2:{bad:true}}],[true,{C2:'invalid-status'}]]){
  respond=async()=>({ok,json:async()=>body});await poll();
  assert.deepEqual(app._overrides,{C2:'red'},'A failed or invalid read must preserve valid inventory');
  assert.equal(writes.length,0,'A failed read must not overwrite the local inventory cache');
}
let release;
respond=()=>new Promise(resolve=>{release=resolve;});
const pending=poll(),before=fetches;
await poll();assert.equal(fetches,before,'Do not overlap slow fallback requests');
release({ok:true,json:async()=>({C2:'green'})});await pending;
assert.equal(app._overrides.C2,'green','A later valid read must recover');
assert.equal(repaints,1);
respond=async()=>{throw new Error('network unavailable');};await poll();
assert.equal(app._overrides.C2,'green');
respond=async()=>({ok:true,json:async()=>({C2:'red'})});await poll();
assert.equal(app._overrides.C2,'red','A rejected request must release the in-flight guard');
const tablet=fs.readFileSync(new URL('../public/command-tablet.js',import.meta.url),'utf8');
const healthStart=tablet.indexOf('  async function syncHealth(){');
const healthEnd=tablet.indexOf("  window.addEventListener('online'",healthStart);
assert(healthStart>=0&&healthEnd>healthStart);
const healthContext=vm.createContext({app,AbortSignal,Date,JSON,Object,Array,Error,STATUS:{red:[],green:[]},live:true,refresh:()=>{},fetch:async()=>respond()});
vm.runInContext(tablet.slice(healthStart,healthEnd),healthContext);
for(const [ok,body] of [[false,{error:'Permission denied'}],[true,['green']],[true,{C2:{bad:true}}],[true,{C2:'invalid-status'}]]){
  respond=async()=>({ok,json:async()=>body});await vm.runInContext('syncHealth()',healthContext);
  assert.equal(app._overrides.C2,'red','Tablet health checks also preserve inventory on invalid reads');
  assert.equal(healthContext.live,false,'A failed read is not reported as connected');
}
respond=async()=>({ok:true,json:async()=>({C2:'green'})});await vm.runInContext('syncHealth()',healthContext);
assert.equal(app._overrides.C2,'green');assert.equal(healthContext.live,true);
console.log('Inventory fallback preserves valid records on read failures and resumes after recovery.');
