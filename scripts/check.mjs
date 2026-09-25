// Offline regression checks. All network calls are intercepted; no production records change.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { JSDOM, VirtualConsole } from 'jsdom';
import { transform } from 'esbuild';
import { checkRoomProjection } from './check-room-projection.mjs';
const root=path.resolve(import.meta.dirname,'..');
const read=f=>fs.readFileSync(path.join(root,'public',f),'utf8');
const html=read('index.html');
// Real browser testing found malformed base64 in two retained recordings.
// Require strict browser decoding without replacing the original MP3 bytes.
const soundDom=new JSDOM('<body></body>',{url:'https://storewell.test/',runScripts:'outside-only'}),soundWindow=soundDom.window,playedSounds=[];
soundWindow.HTMLMediaElement.prototype.pause=function(){};
soundWindow.HTMLMediaElement.prototype.play=function(){
  if(this.src.startsWith('data:')){
    const encoded=this.src.split(',')[1],decoded=atob(encoded);
    assert.deepEqual(Buffer.from(decoded,'binary'),Buffer.from(soundWindow._swSND.SND[this.dataset.status],'base64'),'Playback preserves the saved recording');
  }else{
    const recovered=fs.readFileSync(path.join(root,'public',new URL(this.src).pathname));
    assert.equal(recovered.toString('ascii',0,4),'RIFF','Recovered playback file exists');assert.equal(recovered.toString('ascii',8,12),'WAVE');assert(recovered.length>1000);
  }
  playedSounds.push(this.dataset.status);return Promise.resolve();
};
soundWindow.eval(read('status-sounds.js'));
const savedSoundKeys=['green','red','flashgreen','flashred','blue','black','purple','yellow'];
for(const key of savedSoundKeys)soundWindow._swPlaySound(key);
assert.deepEqual(playedSounds,savedSoundKeys,'Every saved recording decodes through the browser base64 rules');
soundWindow._swPlaySound('white');assert.equal(playedSounds.length,8,'Empty retains its original silence');
soundWindow.__swSoundToggle();soundWindow._swPlaySound('green');assert.equal(playedSounds.length,8,'Muted changes stay silent');assert.equal(soundWindow.localStorage.getItem('sw_sound'),'off');
soundWindow.__swSoundToggle();assert.equal(playedSounds.at(-1),'blue','Sound-on feedback uses the original Reserved recording');soundDom.window.close();
const until=async(check,timeout=5000)=>{const end=Date.now()+timeout;while(!check()){assert(Date.now()<end,'Timed out waiting for the observed app state');await new Promise(resolve=>setTimeout(resolve,20));}};
assert(!/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(html),'No corrupted control characters');
const sourceDom=new JSDOM(html);
for(const script of sourceDom.window.document.querySelectorAll('script')){
  if(script.src){const p=new URL(script.src,'https://storewell.test').pathname;assert(fs.existsSync(path.join(root,'public',p)),`Local script exists: ${p}`);continue;}
  if(script.type==='module')await transform(script.textContent,{loader:'js'});
  else new vm.Script(script.textContent);
}
for(const f of ['property-route.js','lock-controls.js','tablet-hands.js','command-tablet.js','notifications.js','sw.js','staff.bundle.js',...fs.readdirSync(path.join(root,'public/vendor')).filter(f=>f.endsWith('.js')).map(f=>'vendor/'+f)]) new vm.Script(read(f));
for(const f of ['storewell-command-deck.webp','storewell-bridge-panorama.webp','command-tablet.css','command-hologram.css','tablet-hands.css','img/hands/soldier-grip.webp','img/hands/soldier-tap.webp','img/hands/character-sleeve.webp','manifest.json'])assert(fs.statSync(path.join(root,'public',f)).size>0,f);
assert(html.includes('this.buildScene()')&&html.includes('buildZone9()'),'Complete property model is restored');
async function verifyContext(noGpu){
const logs=[], requests=[];
const vc=new VirtualConsole();vc.on('jsdomError',e=>logs.push(e.message));vc.on('error',e=>logs.push(String(e)));
const dom=new JSDOM(html,{url:'https://storewell.test/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
const w=dom.window;
const modelRequests=[];
const ctx=new Proxy({measureText:t=>({width:String(t).length*9}),createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),getImageData:()=>({data:new Uint8ClampedArray(4)})},{get:(o,k)=>k in o?o[k]:()=>{}});
w.HTMLCanvasElement.prototype.getContext=function(){return ctx;};w.HTMLCanvasElement.prototype.toDataURL=()=>'';
w.matchMedia=q=>({matches:false,addEventListener(){}});w.alert=()=>{};
w.EventSource=class{addEventListener(){}close(){}};
w.fetch=async(url,opts={})=>{requests.push({url:String(url),opts});return {ok:true,json:async()=>({E5:'blue',E8:'white',G1:'red',D1:'flashgreen',E10:'purple'}),text:async()=>html};};
w.AbortSignal.timeout=()=>undefined;
for(const f of ['vendor/three.min.js','vendor/OrbitControls.js','vendor/CSS3DRenderer.js','vendor/react.production.min.js','vendor/react-dom.production.min.js'])w.eval(read(f));
// Parse the actual bundled character geometry, skeletons and animations; stub image decoding only.
w.TextDecoder=TextDecoder;w.TextEncoder=TextEncoder;
w.URL.createObjectURL=()=> 'blob:offline-model-texture';w.URL.revokeObjectURL=()=>{};
w.THREE.TextureLoader.prototype.load=function(url,onLoad){const t=new w.THREE.Texture();setTimeout(()=>onLoad(t),0);return t;};
w.eval(read('vendor/GLTFLoader.js'));
const ModelLoader=w.THREE.GLTFLoader;
w.THREE.GLTFLoader=class extends ModelLoader{load(url,onLoad,progress,onError){modelRequests.push(url);try{const bytes=fs.readFileSync(path.join(root,'public',new URL(url,'https://storewell.test').pathname));this.parse(new w.Uint8Array(bytes).buffer,'/',onLoad,onError);}catch(e){onError?.(e);}}};
w.eval(read('exterior-characters.js'));
w.eval(read('character-menu.js'));
w.eval(read('exterior-controls.js'));
// A software DOM cannot create a GPU context; keep real scene geometry and stub only rendering.
let renderers=0;
w.THREE.WebGLRenderer=class{constructor(){renderers++;if(noGpu)throw new Error('GPU context unavailable');this.domElement=w.document.createElement('canvas');this.shadowMap={};}setPixelRatio(){}setSize(){}render(){}dispose(){}};
w.eval(read('vendor/dc-runtime.js'));
await new Promise(resolve=>setTimeout(resolve,200));
const app=w.__swApp;
if(process.env.STOREWELL_LAYOUT_OUT&&!noGpu)fs.writeFileSync(process.env.STOREWELL_LAYOUT_OUT,JSON.stringify({locks:Object.fromEntries(Object.entries(app._locks).map(([id,r])=>[id,{label:r.label,pos:r.pos,face:r.face,size:app._sizeOf(r.label),status:app._statusOf(r.label)}])),solids:app.solids,grid:{...app._pathGrid(),grid:[...app._pathGrid().grid]}}));
assert(app,'Original property application boots');
assert(app.scene?.isScene,'Original Three.js scene exists');
assert.equal(app._webglAvailable,!noGpu,'GPU availability is recorded independently of inventory');
assert(Object.keys(app._locks||{}).length>=160,'Property has the full unit inventory');
console.log('Size catalog entries without a modeled door:',Object.keys(app._unitSize()).filter(k=>!app._locks[k]).join(', ')||'none');
assert.equal(app._statusOf('G2'),'green');
assert.equal(app._statusLabel('green'),'Rented');
assert.equal(app._statusOf('E5'),'blue');
assert.equal(app._statusOf('E8'),'white');
w._swApplyLook();await until(()=>app.walker._modelObj?.isGroup);
assert(app.walker._modelObj?.isGroup,'Recovered GLB character replaces the primitive body');
assert(app.walker._mixer,'Recovered character animation mixer starts');
assert(modelRequests.some(url=>url.endsWith('Soldier.glb')),'Default character is the newer Soldier model');
assert.deepEqual(Object.keys(w._SWMODELS).filter(k=>['soldier','robot','xbot','cesium'].includes(k)).sort(),['cesium','robot','soldier','xbot']);
w.localStorage.setItem('sw_char',JSON.stringify({shirt:'#123456'}));
assert.equal(w._swGetChar().model,'soldier','Old saved clothing does not strand the player on the old primitive character');
assert.equal(w._swGetChar().shirt,'#123456','Saved character preferences remain intact');
assert(app._computePath({x:0,z:10},{x:0,z:-100}).length>=2,'Recovered navigation can route around the buildings');
assert(app._locks.G2.doorMat&&app._locks.G2.frame,'Unit G2 retains the newer alert material and no-lock frame');
console.log('Doors without door-frame metadata:',Object.values(app._locks).filter(rec=>!rec.doorMat||!rec.frame).map(rec=>rec.label).join(', '));
w.eval(read('property-route.js'));w.eval(read('lock-controls.js'));w.eval(read('tablet-hands.js'));w.eval(read('command-tablet.js'));
const click=s=>{const el=w.document.querySelector(s);assert(el,s);el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));};
let signed=false;w.__swCheckLogin=()=>signed?'Offline test':null;w.__swLoginGate=async()=>null;
const enter=()=>w.__swCommandCenter();
assert.equal(w.__swDeckVisible,false);assert.equal(w.document.querySelector('#sw-tablet').hidden,true);
await enter();assert.equal(w.__swDeckVisible,false,'A cancelled login cannot open staff controls');
signed=true;app.state.editMode=true;w._swAuth={currentUser:{uid:'offline'}};
const records={early:{label:'C2',from:'green',to:'red',who:'Offline test',t:1782780000000,type:'lock'},email:{label:'Email',type:'email',t:1782780010000}};
for(let i=0;i<610;i++)records['later-'+i]={label:'G2',from:'green',to:'red',who:'Offline test',t:1782880000000+i,type:'lock'};
w._swRef=(db,key)=>key;w._swOnValue=(key,cb)=>{assert.equal(key,'lockLog');cb({val:()=>records});return()=>{};};
await enter();assert.equal(w.__swDeckVisible,true);assert.equal(renderers,1,'Tablet does not start a room renderer');
assert(!w.document.querySelector('.bridge-surface'),'Command room is replaced by the tablet');
const order=w.__swPropertyRoute.ordered(app);assert.equal(order[0],'C2');assert.equal(order[1],'C3');assert.equal(new Set(order).size,Object.keys(app._locks).length,'Every door occurs exactly once in the walking order');
assert.equal(app._locks.C2.face,'E','First door is on the right/east side of the front building');
console.log('Property walking route starts:',order.slice(0,14).join(' → '));
const initialLocation=app.walker.g.position.clone();click('[data-action="exit"]');assert(!w.__swDeckVisible);assert(app.walker.g.position.equals(initialLocation));
await enter();click('[data-nav="locks"]');
assert.equal(w.document.querySelector('[data-nav="history"]').textContent,'Lock History','History has its own clearly named tab');
assert.deepEqual([...w.document.querySelectorAll('.lock-tile')].map(el=>el.dataset.unit),[...order],'Lock tiles follow the physical route and include every door');
assert.equal(w.document.querySelector('.lock-bank h2').textContent,'Front building · C');
assert(w.document.querySelector('.lock-tile').getAttribute('aria-label').includes('Right side · East'));
for(const id of order){click(`[data-unit="${id}"]`);assert.equal(w.document.querySelector('main').dataset.screen,'locks');assert(w.document.querySelector('.lock-status-menu').getAttribute('aria-label').includes(app._locks[id].label));for(const el of w.document.querySelectorAll('[data-status]'))assert.equal(el.querySelector('.status-choice-label').textContent,app._statusLabel(el.dataset.status),'Original status meanings retained');click('[data-choice-close]');}
click('[data-nav="action"]');assert.equal(w.document.querySelectorAll('.lock-tile').length,Object.values(app._locks).filter(r=>['flashred','flashgreen'].includes(app._statusOf(r.label))).length);assert.equal(w.document.querySelector('[data-nav="action"]').getAttribute('aria-pressed'),'true');
click('[data-nav="locks"]');click('[data-layout="map"]');assert.equal(w.document.querySelectorAll('[data-map-unit]').length,Object.keys(app._locks).length,'Map includes all modeled doors');
for(const id of order){click(`[data-map-unit="${id}"]`);assert.equal(w.document.querySelector('main').dataset.screen,'locks');assert(w.document.querySelector('.lock-status-menu').getAttribute('aria-label').includes(app._locks[id].label));assert.equal(w.document.querySelectorAll('[data-status]').length,9);click('[data-choice-close]');}
click('[data-layout="list"]');
for(const st of ['all','action','green','red','black','purple','blue','yellow','white','flashred','flashgreen']){
 const el=w.document.querySelector('#tablet-filter');el.value=st;el.dispatchEvent(new w.Event('change'));
 const expected=Object.values(app._locks).filter(r=>st==='all'||st==='action'&&['flashred','flashgreen'].includes(app._statusOf(r.label))||app._statusOf(r.label)===st).length;
 assert.equal(w.document.querySelectorAll('[data-unit]').length,expected,st+' filter');
}
click('[data-nav="locks"]');const select=w.document.querySelector('#tablet-filter');select.value='all';select.dispatchEvent(new w.Event('change'));
const search=w.document.querySelector('#tablet-search');search.value='c11-2';search.dispatchEvent(new w.Event('input'));assert.equal(w.document.querySelectorAll('[data-unit]').length,1);click('[data-unit="C112"]');
assert.equal(w.document.activeElement,w.document.querySelector('.lock-status-menu header strong'),'Opening choices keeps focus away from text inputs');
click('[data-action="locate"]');assert(!w.__swDeckVisible);if(noGpu)assert.equal(w.document.querySelector('.plan-unit.selected').dataset.planUnit,'C112');else assert(app._marker.visible);
await enter();click('[data-nav="route"]');const routeSearch=w.document.querySelector('#tablet-search');routeSearch.value='';routeSearch.dispatchEvent(new w.Event('input'));
assert(w.document.querySelector('#route-stop').textContent.includes('C2'));click('[data-route-step="1"]');assert(w.document.querySelector('#route-stop').textContent.includes('C3'));click('[data-route-step="-1"]');assert(w.document.querySelector('#route-stop').textContent.includes('C2'));click('[data-action="route-unit"]');await new Promise(r=>setTimeout(r,2100));assert(w.document.querySelector('.lock-status-menu'),'Live refresh leaves the open choices in place');w.document.querySelector('.lock-status-menu header strong').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert(!w.document.querySelector('.lock-status-menu'));assert.equal(w.document.querySelector('main').dataset.screen,'route','Escape returns to the same route');
click('[data-nav="history"]');assert.equal(w.document.querySelectorAll('.history-row').length,611,'Full history exceeds 500 records');
const histOrder=w.document.querySelector('[data-history-order]');histOrder.value='oldest';histOrder.dispatchEvent(new w.Event('change'));assert(w.document.querySelector('.history-row').textContent.includes('C2'),'Oldest saved change is reachable');
const histType=w.document.querySelector('[data-history-type]');histType.value='all';histType.dispatchEvent(new w.Event('change'));assert.equal(w.document.querySelectorAll('.history-row').length,612,'Email records also remain in the full archive');assert(w.document.querySelector('[data-history-backup]').download.startsWith('storewell-complete-history-'));
click('[data-nav="home"]');click('[data-action="reports"]');assert(w.document.querySelector('[data-inventory-download]').download.startsWith('storewell-inventory-'));
click('[data-nav="more"]');assert(w.document.querySelector('img[src="/img/limo.jpg"]'),'Original crew photograph retained');click('[data-action="help"]');assert(w.document.querySelector('.help-cards').textContent.includes('C2'));
const savedStatusFn=app.setStatus;let attempts=0;
app.setStatus=async()=>{attempts++;return false;};await w.__swOpenUnitMenu('G2');await new Promise(r=>setTimeout(r,0));click('[data-status="black"]');click('[data-status="black"]');await new Promise(r=>setTimeout(r,0));assert.equal(attempts,1,'A repeated tap cannot submit twice');assert(!w.document.querySelector('[data-status="black"]').disabled);assert(w.document.querySelector('.save-result').textContent.includes('did not save'));
app.setStatus=async(label,st)=>{app._overrides.G2=st;return true;};click('[data-status="black"]');await new Promise(r=>setTimeout(r,0));assert(!w.document.querySelector('.lock-status-menu'),'Successful save closes the choices');assert(w.document.querySelector('.tablet-toast').textContent.includes('saved to inventory and lock history'));assert.equal(app._statusOf('G2'),'black');delete app._overrides.G2;app.setStatus=savedStatusFn;
// The retained team, report, character and movement tools must mount inside the tablet.
const staff=fs.readFileSync(path.join(root,'src/staff.js'),'utf8');
w._loadStaffConfig=async()=>({Kevin:{email:'kevin@example.test',pref:'email'},Mike:{email:'mike@example.test',pref:'text'},Brad:{email:'brad@example.test',pref:'both'},_delivery:{}});
w.eval(staff.slice(staff.indexOf('window.__swOperationsOpen='),staff.indexOf('window.__swAdminOpen=')));
w.eval(staff.slice(staff.indexOf('window.__swSaveReport='),staff.indexOf('// Joystick repositioning')));
click('[data-nav="team"]');await new Promise(r=>setTimeout(r,30));
assert(w.document.querySelector('.tablet-tool-host #sw-cmd-panel'),'Team opens within the tablet');assert.equal(w.document.querySelectorAll('#sw-contact-cards [data-field="email"]').length,3);
assert.equal(w.document.querySelector('#sw-tab-control').style.display,'block');click('#sw-send-report');await new Promise(r=>setTimeout(r,30));assert(w.document.querySelector('.tablet-tool-host #sw-save-report-modal'),'Report is embedded, not layered over Team');click('#sw-sr-close');await new Promise(r=>setTimeout(r,0));assert(w.document.querySelector('[data-action="controls"]'),'Closing a retained tool returns to the menu');
click('[data-action="controls"]');await new Promise(r=>setTimeout(r,0));assert(w.document.querySelector('.tablet-tool-host #sw-sens-panel'));click('[data-nav="home"]');assert(w.document.querySelector('body > #sw-sens-panel'),'Movement controls return to the property rather than being deleted');click('[data-nav="more"]');click('[data-action="controls"]');await new Promise(r=>setTimeout(r,0));assert(w.document.querySelector('.tablet-tool-host #sw-sens-panel'),'Movement controls can be reopened');
click('[data-nav="more"]');click('[data-action="character"]');await new Promise(r=>setTimeout(r,0));assert(w.document.querySelector('.tablet-tool-host #sw-wardrobe'),'Character remains available inside the tablet');
w.eval(staff.slice(staff.indexOf('window.__swRounds=function'),staff.indexOf('window.__swDashboard=function')));
const beforeRoundsFetch=w.fetch;
w.fetch=async(url,opts)=>String(url).includes('lockOverrides.json')?{ok:true,json:async()=>({C19:'flashred',C18:'flashred',C3:'flashred',C2:'flashred',G2:'flashred'})}:beforeRoundsFetch(url,opts);
click('[data-nav="more"]');click('[data-action="rounds"]');await until(()=>w.document.querySelector('.tablet-tool-host [data-round-unit]'));
const roundIds=[...w.document.querySelector('.sw-rounds-units').querySelectorAll('[data-round-unit]')].map(el=>el.dataset.roundUnit);
assert.deepEqual(roundIds,['C2','C3','C18','C19','G2'],'Rounds follow the property route instead of alphabetical sorting');
assert(w.document.querySelector('#sw-rounds-ts').textContent.endsWith(' CT'),'Rounds use Central time');
click('[data-round-unit="C3"]');await new Promise(r=>setTimeout(r,0));assert.equal(w.document.querySelector('.lock-status-menu').getAttribute('aria-label'),'Unit C3 status choices','A round stop opens its status choices');assert(w.document.querySelector('.tablet-tool-host [data-round-unit="C3"]'),'The rounds checklist stays in place');w.fetch=beforeRoundsFetch;
click('[data-nav="home"]');
// The shared persistence boundary must reject failures and retain atomic history.
const played=[];w._swPlaySound=st=>played.push(st);const original=app._statusOf('G2');w.fetch=async()=>({ok:false});assert.equal(await app.setStatus('G2','black'),false);assert.equal(app._statusOf('G2'),original);assert.equal(played.length,0,'Failed save stays silent');
let writes=0,alerts=0;w.__swCommitLockChange=async(key,state,entry)=>{assert.equal(key,'G2');assert.equal(state,'black');assert.equal(entry.type,'lock');writes++;};w.__swNotifyStatus=async()=>alerts++;
await app.setStatus('G2','black');assert.equal(writes,1);assert.equal(alerts,1);assert.deepEqual(played,['black'],'A successful change uses its original sound key once');await app.setStatus('G2','black');assert.equal(writes,1,'Current status creates no duplicate history');assert.deepEqual(played,['black'],'Current status does not replay its sound');w.__swCommitLockChange=async()=>{throw new Error('offline failure');};await app.setStatus('G2','green');assert.equal(writes,1);assert.equal(alerts,1,'Failed saves never alert');assert.deepEqual(played,['black'],'Failed retries do not play a sound');
assert(!logs.some(x=>/SyntaxError|ReferenceError|TypeError/.test(x)),logs.join('\n'));
console.log(`PASS (${noGpu?'no GPU':'GPU renderer'}): ${order.length} modeled doors, every tablet launcher, property route, filters, complete history, exports and confirmed saves. No production writes.`);
dom.window.close();
}
await verifyContext(false);await verifyContext(true);sourceDom.window.close();
