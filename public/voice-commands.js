/* Explicit, one-shot speech entry. Inventory/history remain owned by app.setStatus. */
(function(root){
  'use strict';
  const labels=Object.freeze({green:'Rented',red:'Late',flashred:'Lock It',flashgreen:'Lock Off',blue:'Reserved',yellow:'Rented · No Lock',purple:'Ready to Rent',white:'Empty',black:'Not rentable'});
  const aliases=Object.freeze({
    rented:'green',late:'red','late locked':'red','late and locked':'red',
    'lock it':'flashred','needs lock':'flashred','needs a lock':'flashred','lock now':'flashred',
    'lock off':'flashgreen','remove lock':'flashgreen','remove the lock':'flashgreen','needs lock removal':'flashgreen',
    reserved:'blue','rented no lock':'yellow','rented with no lock':'yellow','rented without a lock':'yellow','rented without lock':'yellow',
    'ready to rent':'purple',empty:'white','not rentable':'black'
  });
  const ones=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const tens={twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
  const letters={a:'A',ay:'A',alpha:'A',b:'B',bee:'B',bravo:'B',c:'C',see:'C',sea:'C',charlie:'C',d:'D',dee:'D',delta:'D',e:'E',ee:'E',echo:'E',f:'F',eff:'F',foxtrot:'F',g:'G',gee:'G',golf:'G',h:'H',aitch:'H',hotel:'H',i:'I',eye:'I',india:'I',j:'J',jay:'J',juliet:'J',juliett:'J',k:'K',kay:'K',kilo:'K'};
  const clean=text=>String(text??'').toLowerCase().replace(/[.,!?;:]/g,' ').replace(/[–—]/g,'-').replace(/\b(?:uh|um)\b/g,' ').replace(/\s+/g,' ').trim();
  function number(text){
    if(/^\d{1,3}$/.test(text))return String(Number(text));
    const parts=text.trim().split(/\s+/);
    if(parts.length===1&&ones.includes(parts[0]))return String(ones.indexOf(parts[0]));
    if(tens[parts[0]]&&(parts.length===1||(parts.length===2&&ones.indexOf(parts[1])>0&&ones.indexOf(parts[1])<10)))return String(tens[parts[0]]+(ones.indexOf(parts[1])>0?ones.indexOf(parts[1]):0));
    return null;
  }
  // A subunit separator is mandatory: C11-1 can never silently become C111.
  function unitLabel(text){
    const s=clean(text).replace(/^unit\s+/,'').replace(/\b(?:dash|hyphen)\b/g,'-').replace(/\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)-(one|two|three|four|five|six|seven|eight|nine)\b/g,'$1 $2');
    if(s==='office')return 'OFFICE';
    const match=s.match(/^([a-z]+)\s*-?\s*(.+)$/);
    const prefix=match&&letters[match[1]];
    const body=prefix?match[2]:s;
    const pieces=body.split(/\s*-\s*/);if(pieces.length>2)return null;
    const nums=pieces.map(n=>number(n.trim()));if(nums.some(n=>n===null))return null;
    return (prefix||'')+nums.join('-');
  }
  const fail=(code,message)=>({kind:'error',code,message});
  function parse(text,units=[]){
    const spoken=clean(text);
    if(!spoken||spoken.length>180)return fail('syntax','Say one unit and one status, for example: G seven to rented.');
    if(/^(?:confirm|confirm change|save change|yes confirm)$/.test(spoken))return {kind:'confirm'};
    if(/^(?:cancel|cancel change|never mind|nevermind)$/.test(spoken))return {kind:'cancel'};
    const command=spoken.replace(/^please\s+/,'').replace(/^(?:change|set|mark)\s+/,'').replace(/^unit\s+/,'').replace(/\s+please$/,'');
    let unitText,targetText,fromText;
    const withFrom=command.match(/^(.+?)\s+from\s+(.+?)\s+(?:to|into)\s+(.+)$/);
    if(withFrom){[,unitText,fromText,targetText]=withFrom;}
    else {
      // Match the whole status phrase, not a substring such as 'rented' in 'not rented'.
      const statuses=[...Object.keys(aliases),'locked','unlocked'].sort((a,b)=>b.length-a.length);
      for(const candidate of statuses){
        if(command.endsWith(' '+candidate)){
          const before=command.slice(0,-candidate.length).trim().replace(/\s+(?:to|into|as)$/,'');
          if(unitLabel(before)){unitText=before;targetText=candidate;break;}
        }
      }
    }
    if(targetText==='locked'||targetText==='unlocked')return fail('ambiguous-status','“Locked” or “unlocked” does not identify a saved status. Say Late, Lock It, Lock Off, Rented, or another status from the key.');
    if(!unitText||!Object.hasOwn(aliases,targetText))return fail('syntax','Say one exact unit and status, for example: Change G seven to rented. Use the full status name.');
    const wanted=unitLabel(unitText);if(!wanted)return fail('unit','Say the complete unit, including “dash” for a subunit.');
    const matches=units.filter(u=>unitLabel(u.label)===wanted);
    if(matches.length!==1)return fail(matches.length?'ambiguous-unit':'unknown-unit',matches.length?'That unit name matches more than one record. Choose the unit by touch.':`Unit ${wanted} was not found. Check the unit number; use “dash” for a subunit.`);
    if(fromText&&!Object.hasOwn(aliases,fromText))return fail('from-status','The starting status was not clear. Say the exact status, or leave out “from”.');
    const unit=matches[0],to=aliases[targetText];
    if(fromText&&aliases[fromText]!==unit.status)return fail('from-changed',`Unit ${unit.label} is ${labels[unit.status]||'not recorded'}, not ${labels[aliases[fromText]]}. Nothing changed.`);
    if(!Object.hasOwn(labels,unit.status))return fail('current-status','The current saved status is not available. Refresh inventory first.');
    return {kind:'change',unitId:unit.id,label:unit.label,from:unit.status,to};
  }
  function createSession({getUnits,canEdit,save,onSaved=()=>{},now=()=>Date.now()}){
    let pending=null,busy=false;
    function cancel(){if(busy)return fail('busy','A save is already in progress. Wait for its result.');pending=null;return {kind:'cancelled',message:'Cancelled. Nothing changed.'};}
    function submit(text){
      if(busy)return fail('busy','Wait for the current save to finish.');
      const result=parse(text,getUnits());
      if(result.kind==='cancel')return cancel();
      if(result.kind==='confirm')return {kind:'confirm-request'};
      pending=null;
      if(!canEdit())return fail('sign-in','Sign in to staff controls before changing a unit.');
      if(result.kind==='error')return result;
      if(result.from===result.to)return {kind:'unchanged',message:`Unit ${result.label} is already ${labels[result.to]}. Nothing changed.`};
      pending={...result,createdAt:now()};return {...pending,kind:'preview'};
    }
    async function confirm(){
      if(busy)return fail('busy','Wait for the current save to finish.');
      const proposal=pending;pending=null;
      if(!proposal)return fail('no-preview','Say a unit and status first, then confirm the displayed change.');
      if(!canEdit())return fail('sign-in','Staff sign-in has ended. Sign in and say the command again.');
      if(now()-proposal.createdAt>60000)return fail('expired','That review expired. Say the command again to check the latest status.');
      const unit=getUnits().find(u=>u.id===proposal.unitId);
      if(!unit||unit.label!==proposal.label||unit.status!==proposal.from)return fail('changed','This unit changed after your command. Nothing was saved. Say the command again to review its current status.');
      busy=true;
      try{
        const saved=await save(unit.label,proposal.to);
        if(saved!==true)return fail('save-unconfirmed','Save was not confirmed. Check inventory and history before trying again.');
        try{onSaved(proposal);}catch(_){/* A display refresh must not turn a confirmed save into a reported failure. */}
        return {...proposal,kind:'saved',message:`Unit ${unit.label} · ${labels[proposal.to]} saved to inventory and lock history.`};
      }catch(_){return fail('save-unconfirmed','Save was not confirmed. Check inventory and history before trying again.');}
      finally{busy=false;}
    }
    return {submit,confirm,cancel,get pending(){return pending;},get busy(){return busy;}};
  }
  function mount({host,panelHost=host,getUnits,canEdit,save,onSaved}){
    if(!host||host.__swVoice)return host?.__swVoice;
    const doc=host.ownerDocument,win=doc.defaultView;
    const Recognition=win.SpeechRecognition||win.webkitSpeechRecognition;
    const available=!!Recognition&&win.isSecureContext!==false;
    const button=doc.createElement('button');button.type='button';button.className='sw-voice-open';button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','sw-voice-panel');button.textContent='Talk';host.append(button);
    const panel=doc.createElement('section');panel.id='sw-voice-panel';panel.className='sw-voice-panel';panel.hidden=true;panel.setAttribute('aria-label','Voice unit change');
    panel.innerHTML='<div class="sw-voice-heading"><strong>Say a unit + status</strong><button type="button" data-voice-close aria-label="Close voice controls">×</button></div><div class="sw-voice-entry"><button type="button" data-voice-mic>Speak a command</button><form data-voice-form><label for="sw-voice-text">Or type / use your keyboard mic</label><div><input id="sw-voice-text" autocomplete="off" maxlength="180" placeholder="G seven to rented"><button type="submit">Review</button></div></form></div><p class="sw-voice-message" data-voice-message role="status" aria-live="polite"></p><div data-voice-review hidden><p class="sw-voice-proposal" data-voice-proposal></p><div class="sw-voice-confirm"><button type="button" data-voice-confirm>Confirm change</button><button type="button" data-voice-cancel>Cancel</button></div></div><p class="sw-voice-help">Review before confirming. Your browser may process microphone audio online.</p><details class="sw-voice-privacy"><summary>Microphone privacy &amp; status names</summary><p>Listening starts only when you tap “Speak”. Your browser or device may send audio to its speech provider. StoreWell does not record or store audio or transcripts. Only a confirmed status change enters the existing saved history and report.</p><p>Rented · Late · Lock It (needs lock) · Lock Off · Reserved · Rented no lock · Ready to Rent · Empty · Not rentable. Say “dash” for a subunit. “Locked” alone is not a saved status.</p></details>';
    const page=panelHost.querySelector?.('#tablet-page');if(page)page.before(panel);else panelHost.append(panel);
    const el=selector=>panel.querySelector(selector),mic=el('[data-voice-mic]'),input=el('input'),message=el('[data-voice-message]'),review=el('[data-voice-review]');
    const session=createSession({getUnits,canEdit,save,onSaved});
    let recognition=null,attempt=0,listening=false,timer=null,destroyed=false;
    function status(text){message.textContent=text;}
    function sync(){
      const pending=session.pending;
      review.hidden=!pending;el('[data-voice-proposal]').textContent=pending?`Unit ${pending.label}: ${labels[pending.from]} → ${labels[pending.to]}`:'';
      for(const control of panel.querySelectorAll('button,input'))control.disabled=session.busy;
      mic.disabled=session.busy||!available;
      mic.textContent=listening?'Stop listening':pending?'Speak confirm / cancel':'Speak a command';
      mic.setAttribute('aria-pressed',String(listening));
      el('[data-voice-confirm]').disabled=session.busy||!pending;
      button.disabled=session.busy;
    }
    function stop(){
      attempt++;listening=false;clearTimeout(timer);timer=null;
      const old=recognition;recognition=null;if(old){try{old.abort();}catch(_){}}
      sync();
    }
    function result(out){
      if(out.kind==='preview')status('Check the change below. Tap Confirm, or tap the microphone and say “confirm” or “cancel”.');
      else status(out.message||'Nothing changed.');
      if(out.kind==='saved'||out.kind==='cancelled')input.value='';
      sync();
    }
    async function confirm(){
      stop();const promise=session.confirm();status(session.busy?'Saving…':'Checking…');sync();const out=await promise;
      if(!destroyed)result(out);
    }
    function accept(text){
      input.value=text;
      const out=session.submit(text);
      if(out.kind==='confirm-request')return confirm();
      result(out);
    }
    function open(){panel.hidden=false;button.setAttribute('aria-expanded','true');status(available?'Example: “Change G seven to rented.” Tap Speak when ready.':'Browser speech is unavailable here. Type the command, or use your phone keyboard’s microphone.');sync();}
    function close(){
      if(session.busy)return;
      const wasOpen=!panel.hidden;
      stop();session.cancel();input.value='';status('');sync();panel.hidden=true;button.setAttribute('aria-expanded','false');if(wasOpen)button.focus({preventScroll:true});
    }
    function start(){
      if(session.busy||!available)return;
      if(listening){stop();status('Listening stopped. Nothing new was saved.');return;}
      if(!canEdit()){result(fail('sign-in','Sign in to staff controls first.'));return;}
      if(win.navigator.onLine===false){result(fail('offline','You are offline. Reconnect before speaking or saving a change.'));return;}
      stop();const id=attempt,rec=new Recognition();recognition=rec;rec.lang='en-US';rec.continuous=false;rec.interimResults=false;rec.maxAlternatives=3;
      let received=false;
      rec.onresult=event=>{
        if(id!==attempt||panel.hidden||destroyed)return;
        const results=event.results?.[event.resultIndex||0];if(!results||results.isFinal===false)return;
        received=true;
        const alternatives=Array.from(results),best=alternatives[0];
        stop();
        if(!best||Number(best.confidence)>0&&Number(best.confidence)<.65){session.cancel();result(fail('unclear','Speech was not clear enough. Nothing changed. Try again or type the command.'));return;}
        const interpretations=alternatives.map(a=>parse(a.transcript,getUnits())).filter(p=>p.kind!=='error');
        const meanings=new Set(interpretations.map(p=>JSON.stringify([p.kind,p.unitId,p.from,p.to])));
        if(meanings.size>1){session.cancel();result(fail('ambiguous-speech','Speech matched different commands. Nothing changed. Say the full unit and status again, or type them.'));return;}
        accept(String(best.transcript||'').trim());
      };
      rec.onerror=event=>{
        if(id!==attempt||destroyed)return;
        stop();const messages={'not-allowed':'Microphone permission was blocked. Type below, or allow this site’s microphone in browser settings and try again.','service-not-allowed':'The browser speech service is unavailable. Type below or use your keyboard’s microphone.','audio-capture':'No microphone was available. Check your microphone, or type below.','no-speech':'No speech was heard. Tap Speak and try again.','network':'The browser speech service could not connect. Type below or try again.','aborted':'Listening stopped. Nothing new was saved.'};
        status(messages[event.error]||'Speech was interrupted. Nothing new was saved. Try again or type below.');
      };
      rec.onend=()=>{if(id!==attempt||destroyed)return;stop();if(!received)status('Listening ended. Tap Speak to try again, or type below.');};
      listening=true;status(session.pending?'Listening for “confirm” or “cancel”…':'Listening… say the unit and status.');sync();
      try{rec.start();timer=win.setTimeout(()=>{if(id!==attempt)return;stop();status('Listening timed out. Tap Speak to try again.');},15000);}
      catch(_){stop();status('Speech could not start. Type below, or try again.');}
    }
    button.onclick=()=>panel.hidden?open():close();mic.onclick=start;
    el('[data-voice-close]').onclick=close;
    el('[data-voice-form]').onsubmit=event=>{event.preventDefault();stop();accept(input.value);};
    input.addEventListener('input',()=>{if(session.busy)return;stop();if(session.pending){session.cancel();status('Command edited. Select Review to check the new change.');sync();}});
    el('[data-voice-confirm]').onclick=confirm;
    el('[data-voice-cancel]').onclick=()=>{stop();result(session.cancel());input.value='';};
    panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();}});
    const visibility=()=>{if(doc.hidden){stop();if(!session.busy){session.cancel();input.value='';status('Voice review cleared while the page was hidden. Say a fresh command.');sync();}}};
    const pagehide=()=>{stop();if(!session.busy){session.cancel();input.value='';status('');sync();panel.hidden=true;button.setAttribute('aria-expanded','false');}};
    doc.addEventListener('visibilitychange',visibility);win.addEventListener('pagehide',pagehide);
    const api={open,close,stop,get listening(){return listening;},get session(){return session;},destroy(){destroyed=true;stop();session.cancel();doc.removeEventListener('visibilitychange',visibility);win.removeEventListener('pagehide',pagehide);panel.remove();button.remove();delete host.__swVoice;}};
    host.__swVoice=api;sync();return api;
  }
  root.StoreWellVoice=Object.freeze({parse,unitLabel,createSession,mount,labels});
})(typeof window!=='undefined'?window:globalThis);
