// Offline tests: mocked speech and saves. No microphone, staff service or production write.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
import {transform} from 'esbuild';
const source=fs.readFileSync(new URL('../public/voice-commands.js',import.meta.url),'utf8');
const sandbox={};vm.createContext(sandbox);vm.runInContext(source,sandbox);const voice=sandbox.StoreWellVoice;
const sample=()=>[
  {id:'G7',label:'G7',status:'flashred'}, {id:'G8',label:'G8',status:'white'},
  {id:'C111',label:'C11-1',status:'green'}, {id:'C111REAL',label:'C111',status:'green'},
  {id:'D61',label:'D-6-1',status:'green'}, {id:'121',label:'12-1',status:'white'},
  {id:'12',label:'12',status:'white'}, {id:'37',label:'37',status:'white'},
  {id:'24',label:'24',status:'white'}, {id:'OFFICE',label:'Office',status:'black'}
];
for(const command of ['Change G seven to rented','G7 rented','set unit gee seven as rented','Please mark golf seven into rented please','change G seven from needs lock to uh rented']){
  const result=voice.parse(command,sample());assert.equal(result.kind,'change',command);assert.equal(result.unitId,'G7');assert.equal(result.to,'green');
}
for(const [text,key] of [['Rented','green'],['Late','red'],['needs lock','flashred'],['Lock It','flashred'],['Lock Off','flashgreen'],['Reserved','blue'],['Rented no lock','yellow'],['Rented without a lock','yellow'],['Ready to Rent','purple'],['Empty','white'],['Not rentable','black']])assert.equal(voice.parse('G7 to '+text,sample()).to,key,text);
for(const [text,id] of [['C eleven dash one','C111'],['C111','C111REAL'],['D six dash one','D61'],['D-6-1','D61'],['twelve dash one','121'],['12','12'],['thirty seven','37'],['twenty-four','24'],['Office','OFFICE']])assert.equal(voice.parse(`${text} to rented`,sample()).unitId,id,text);
for(const text of ['G7 locked','change G7 from needs lock to locked','G7 unlocked'])assert.equal(voice.parse(text,sample()).code,'ambiguous-status');
for(const text of ['G7 not rented','do not change G7 to rented','G7 rented and G8 empty','G7 rented confirm','G7 to rented or empty','C eleven one rented','G7 <script>rented</script>','G seven to red','G seven to rented no','G7 from empty to rented'])assert.equal(voice.parse(text,sample()).kind,'error',text);
assert.equal(voice.parse('G9 rented',sample()).code,'unknown-unit');
assert.equal(voice.parse('G7 rented',[...sample(),{id:'other',label:'G-7',status:'white'}]).code,'ambiguous-unit');
assert.equal(voice.parse('confirm',sample()).kind,'confirm');assert.equal(voice.parse('never mind',sample()).kind,'cancel');
let units=sample(),signedIn=true,time=1000,writes=[],saved=[];
const session=voice.createSession({getUnits:()=>units,canEdit:()=>signedIn,now:()=>time,save:async(label,status)=>{writes.push([label,status]);units.find(u=>u.label===label).status=status;return true;},onSaved:p=>saved.push(p)});
assert.equal(session.submit('G7 rented').kind,'preview');assert.equal(writes.length,0,'No writes before review confirmation');
assert.equal(session.cancel().kind,'cancelled');assert.equal((await session.confirm()).code,'no-preview');assert.equal(writes.length,0);
session.submit('G7 rented');assert.equal(session.submit('not a command').kind,'error');assert.equal((await session.confirm()).code,'no-preview','Unclear replacement clears the previous review');
session.submit('G7 rented');units[0].status='blue';assert.equal((await session.confirm()).code,'changed');assert.equal(writes.length,0,'Concurrent status changes are not overwritten');
units=sample();session.submit('G7 rented');time+=60001;assert.equal((await session.confirm()).code,'expired');assert.equal(writes.length,0);
session.submit('G7 rented');signedIn=false;assert.equal((await session.confirm()).code,'sign-in');assert.equal(writes.length,0);assert.equal(session.submit('G7 rented').code,'sign-in');signedIn=true;
session.submit('G7 rented');assert.equal((await session.confirm()).kind,'saved');assert.deepEqual(writes,[['G7','green']]);assert.equal(saved.length,1);assert.equal(session.submit('G7 rented').kind,'unchanged');
let release,attempts=0;const pending=voice.createSession({getUnits:sample,canEdit:()=>true,save:()=>{attempts++;return new Promise(resolve=>release=resolve);}});
pending.submit('G7 rented');const saving=pending.confirm();assert(pending.busy);assert.equal((await pending.confirm()).code,'busy');assert.equal(pending.cancel().code,'busy');assert.equal(pending.submit('G8 empty').code,'busy');release(true);assert.equal((await saving).kind,'saved');assert.equal(attempts,1,'Repeated confirmation only saves once');
for(const save of [async()=>false,async()=>{throw new Error('offline');}]){const failed=voice.createSession({getUnits:sample,canEdit:()=>true,save});failed.submit('G7 rented');assert.equal((await failed.confirm()).code,'save-unconfirmed');assert.equal((await failed.confirm()).code,'no-preview','Unconfirmed save never automatically retries');}

function domFixture(support=true){
  const dom=new JSDOM('<section id="sw-tablet"><header><span id="host"></span></header><div class="tablet-glass"><main id="tablet-page"></main></div></section>',{url:'https://storewell.test/',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window,recognizers=[],writes=[];
  w.fetch=()=>{throw new Error('Voice code must not fetch or upload audio/transcripts');};
  if(support)w.SpeechRecognition=class{
    constructor(){recognizers.push(this);this.started=false;this.aborted=false;}
    start(){this.started=true;}
    abort(){this.aborted=true;this.onend?.();}
    result(alternatives){const r=alternatives.map(a=>typeof a==='string'?{transcript:a,confidence:.95}:a);r.isFinal=true;this.onresult?.({resultIndex:0,results:[r]});}
  };
  w.eval(source);
  const state=sample();const api=w.StoreWellVoice.mount({host:w.document.querySelector('#host'),panelHost:w.document.querySelector('.tablet-glass'),getUnits:()=>state,canEdit:()=>true,save:async(label,status)=>{writes.push([label,status]);state.find(u=>u.label===label).status=status;return true;}});
  return {dom,w,api,writes,recognizers,query:s=>w.document.querySelector(s)};
}
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
{
  const f=domFixture(),{api,query,recognizers,writes}=f;
  assert.equal(recognizers.length,0,'Mount never requests microphone');query('.sw-voice-open').click();assert.equal(recognizers.length,0,'Opening controls does not request microphone');
  assert(!query('#sw-voice-panel').hidden);assert(query('.sw-voice-help').textContent.includes('audio online'),'Browser processing notice visible before listening');
  query('[data-voice-mic]').click();assert(api.listening);assert.equal(recognizers.length,1);assert(recognizers[0].started);assert.equal(recognizers[0].continuous,false);
  recognizers[0].result(['G seven to rented']);assert(!api.listening);assert(recognizers[0].aborted);assert.equal(writes.length,0);assert(query('[data-voice-proposal]').textContent.includes('G7: Lock It → Rented'));
  recognizers[0].result(['confirm']);await tick();assert.equal(writes.length,0,'Stale result cannot confirm from the same recording');
  query('[data-voice-mic]').click();recognizers[1].result(['cancel']);await tick();assert.equal(writes.length,0);assert(query('[data-voice-review]').hidden);
  query('[data-voice-mic]').click();recognizers[2].result(['G seven to rented']);query('[data-voice-mic]').click();recognizers[3].result(['confirm']);await tick();assert.deepEqual(writes,[['G7','green']]);
  query('[data-voice-mic]').click();recognizers[4].result(['G eight to rented','G seven to empty']);assert.equal(api.session.pending,null);assert(query('[data-voice-message]').textContent.includes('different commands'));
  query('[data-voice-mic]').click();recognizers[5].result([{transcript:'G eight to rented',confidence:.3}]);assert.equal(api.session.pending,null);assert(query('[data-voice-message]').textContent.includes('not clear enough'));
  query('[data-voice-mic]').click();recognizers[6].onerror({error:'not-allowed'});assert(!api.listening);assert(query('[data-voice-message]').textContent.includes('permission was blocked'));
  query('[data-voice-mic]').click();api.close();assert(recognizers[7].aborted);recognizers[7].result(['G eight rented']);assert.equal(api.session.pending,null,'Closing invalidates delayed speech');assert.equal(query('input').value,'');
  api.open();query('input').value='G8 rented';query('[data-voice-form]').dispatchEvent(new f.w.Event('submit',{cancelable:true}));assert(api.session.pending);query('input').value='G7 empty';query('input').dispatchEvent(new f.w.Event('input'));assert.equal(api.session.pending,null,'Editing clears the prior review');assert(query('[data-voice-confirm]').disabled);query('input').value='G8 rented';query('[data-voice-form]').dispatchEvent(new f.w.Event('submit',{cancelable:true}));assert(api.session.pending);f.w.dispatchEvent(new f.w.Event('pagehide'));assert.equal(api.session.pending,null);assert.equal(query('input').value,'','Navigating away clears the transient transcript');
  api.destroy();f.dom.window.close();
}
{
  const f=domFixture(false);f.api.open();assert(f.query('[data-voice-mic]').disabled);assert(f.query('[data-voice-message]').textContent.includes('keyboard'));
  f.query('input').value='G7 rented';f.query('[data-voice-form]').dispatchEvent(new f.w.Event('submit',{cancelable:true}));assert.equal(f.writes.length,0);f.query('[data-voice-confirm]').click();await tick();assert.deepEqual(f.writes,[['G7','green']],'Unsupported speech keeps a typed/dictation fallback');f.api.destroy();f.dom.window.close();
}
await transform(fs.readFileSync(new URL('../public/voice-commands.css',import.meta.url),'utf8'),{loader:'css'});
console.log('PASS: voice commands parse all nine statuses, numeric and dashed units; reject ambiguous/negated/multiple commands; require separate confirmation; cancel/expire/recheck staff and status; avoid duplicate or unconfirmed retries. Mocked browser speech covers consent, stop, stale results, alternatives, low confidence, permission denial, page hide and fallback. No production writes or real microphone test.');
