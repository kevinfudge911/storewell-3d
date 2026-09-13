
// ── Character builder ────────────────────────────────────────────────────────
window._swGetChar=function(){
  try{const c=localStorage.getItem('sw_char');if(c){const saved=JSON.parse(c);if(!saved.model)saved.model='soldier';return saved;}}catch(e){}
  return {model:'soldier'}; // everyone starts on the realistic 3D character (no wardrobe needed)
};
window._swSaveChar=function(c){
  try{localStorage.setItem('sw_char',JSON.stringify(c));}catch(e){}
  // Push updated char to Firebase player record
  if(window.__swApp&&window.__swApp._net){
    const n=window.__swApp._net;
    try{
      fetch('https://storewell-3d-default-rtdb.firebaseio.com/players/'+n.uid+'/char.json',
        {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(c)}).catch(()=>{});
    }catch(e){}
  }
};

// Load the same 3D GLB character model the local player uses, onto a remote avatar group
window._swLoadAvatarModel=function(T,g,md){
  try{
    var GLTF=(T&&T.GLTFLoader)||(window.THREE&&window.THREE.GLTFLoader)||window.GLTFLoader;
    if(!GLTF) return;
    new GLTF().load(md.url,function(gl){
      var mo=gl.scene; mo.scale.setScalar(md.scale||1); mo.rotation.y=(md.rot||0);
      mo.traverse(function(o){ if(o.isMesh){ o.castShadow=true; o.frustumCulled=false; } });
      // Universal size clamp: force EVERY remote avatar to ~1.9 tall, feet on the floor — can never go giant/tiny
      try{ mo.updateMatrixWorld(true); var _b=new T.Box3().setFromObject(mo),_s3=new T.Vector3(); _b.getSize(_s3); if(_s3.y>0.3&&_s3.y<60){ mo.scale.multiplyScalar(1.9/_s3.y); } mo.updateMatrixWorld(true); var _b2=new T.Box3().setFromObject(mo),_c3=new T.Vector3(); _b2.getCenter(_c3); mo.position.x-=_c3.x; mo.position.z-=_c3.z; mo.position.y-=_b2.min.y; }catch(_e){}
      // hide the block figure (keep name sprite) now that the real model is here
      g.children.slice().forEach(function(c){ if(!c.isSprite && c!==mo) c.visible=false; });
      g.add(mo); g.userData.model=mo;
      if(gl.animations&&gl.animations.length){
        var mx=new T.AnimationMixer(mo);
        var walkC=T.AnimationClip.findByName(gl.animations,md.clip)||gl.animations[0];
        var idleC=T.AnimationClip.findByName(gl.animations,md.idle)||walkC;
        var walkA=mx.clipAction(walkC), idleA=mx.clipAction(idleC);
        idleA.play(); walkA.play(); walkA.setEffectiveWeight(0); idleA.setEffectiveWeight(1);
        var clk=new T.Clock(), curW=0, lastPos=g.position.clone(), lastMoveT=0;
        (function anim(){
          if(!g.parent){ return; } // avatar removed → stop animating
          requestAnimationFrame(anim);
          var dt=clk.getDelta(); mx.update(dt);
          var d=g.position.distanceTo(lastPos); lastPos.copy(g.position);
          var now=(window.performance&&performance.now)?performance.now():Date.now();
          if(d>0.003) lastMoveT=now;
          var target=(now-lastMoveT<250)?1:0; curW+=(target-curW)*Math.min(1,dt*10);
          walkA.setEffectiveWeight(curW); idleA.setEffectiveWeight(1-curW);
        })();
      }
    }, undefined, function(){});
  }catch(e){}
};
window._swBuildAvatar=function(T,uid,p){
  const g=new T.Group();
  const ch=p.char||{};
  const male=ch.gender!=='female';
  const skinC=new T.Color(ch.skin||'#FFCC99');
  const hairC=new T.Color(ch.hair||'#2c1810');
  const shirtC=new T.Color(ch.shirt||(male?'#3b82f6':'#ec4899'));
  const pantsC=new T.Color(ch.pants||(male?'#1e3a8a':'#7c3aed'));
  const shoeC=new T.Color(ch.shoes||'#3b2a1a');
  const hatType=ch.hat||'none';
  const hatC=new T.Color(ch.hatColor||'#ff6600');
  const mk=(geo,col)=>new T.Mesh(geo,new T.MeshLambertMaterial({color:col}));
  // Head
  const head=mk(new T.SphereGeometry(.32,10,10),skinC); head.position.y=1.85; g.add(head);
  var _le=mk(new T.SphereGeometry(.055,8,8),'#ffffff'); _le.position.set(-.12,1.92,.27); g.add(_le);
  var _re=mk(new T.SphereGeometry(.055,8,8),'#ffffff'); _re.position.set(.12,1.92,.27); g.add(_re);
  var _lp=mk(new T.SphereGeometry(.028,6,6),(ch.eyes||'#141414')); _lp.position.set(-.12,1.92,.32); g.add(_lp);
  var _rp=mk(new T.SphereGeometry(.028,6,6),(ch.eyes||'#141414')); _rp.position.set(.12,1.92,.32); g.add(_rp);
  var _mo=mk(new T.BoxGeometry(.13,.03,.02),'#7a3b2a'); _mo.position.set(0,1.75,.31); g.add(_mo);
  var _gl=ch.glasses||'none';
  if(_gl!=='none'){var _gc=_gl==='sun'?'#0a0a0a':'#e8eef5';var _fr=mk(new T.BoxGeometry(.30,.03,.03),'#1a1a1a');_fr.position.set(0,1.92,.30);g.add(_fr);var _g1=mk(new T.BoxGeometry(.11,.085,.02),_gc);_g1.position.set(-.12,1.92,.31);g.add(_g1);var _g2=mk(new T.BoxGeometry(.11,.085,.02),_gc);_g2.position.set(.12,1.92,.31);g.add(_g2);}
  var _bd=ch.beard||'none';
  if(_bd!=='none'){var _bcol=ch.hair||'#2c1810';var _bb=mk(new T.SphereGeometry(.30,12,10),_bcol);_bb.position.set(0,1.73,.1);_bb.scale.set(1,_bd==='full'?0.85:0.5,0.78);g.add(_bb);}
  // Hair
  const hair=mk(new T.SphereGeometry(.34,10,6,0,Math.PI*2,0,Math.PI*(male?.42:.6)),hairC);
  hair.position.y=1.85; g.add(hair);
  if(!male){const lh=mk(new T.CylinderGeometry(.22,.18,.65,8),hairC);lh.position.set(0,1.52,-.12);g.add(lh);}
  // Shirt/body
  const body=mk(new T.CylinderGeometry(.28,.28,.85,8),shirtC); body.position.y=1.15; g.add(body);
  // Arms
  const la=mk(new T.CylinderGeometry(.09,.09,.62,6),shirtC);la.rotation.z=.35;la.position.set(-.38,1.18,0);g.add(la);
  const ra=mk(new T.CylinderGeometry(.09,.09,.62,6),shirtC);ra.rotation.z=-.35;ra.position.set(.38,1.18,0);g.add(ra);
  // Hands
  const lh2=mk(new T.SphereGeometry(.1,6,6),skinC);lh2.position.set(-.5,.88,0);g.add(lh2);
  const rh2=mk(new T.SphereGeometry(.1,6,6),skinC);rh2.position.set(.5,.88,0);g.add(rh2);
  // Lower body
  if(!male){
    // Skirt
    const sk=mk(new T.CylinderGeometry(.32,.42,.5,8),pantsC);sk.position.y=.62;g.add(sk);
    // Legs (visible below skirt)
    const ll=mk(new T.CylinderGeometry(.1,.1,.48,6),skinC);ll.position.set(-.13,.28,0);g.add(ll);
    const rl=mk(new T.CylinderGeometry(.1,.1,.48,6),skinC);rl.position.set(.13,.28,0);g.add(rl);
  } else {
    const ll=mk(new T.CylinderGeometry(.12,.12,.72,6),pantsC);ll.position.set(-.13,.44,0);g.add(ll);
    const rl=mk(new T.CylinderGeometry(.12,.12,.72,6),pantsC);rl.position.set(.13,.44,0);g.add(rl);
  }
  // Shoes
  const ls=mk(new T.BoxGeometry(.22,.12,.34),shoeC);ls.position.set(-.13,.07,.04);g.add(ls);
  const rs=mk(new T.BoxGeometry(.22,.12,.34),shoeC);rs.position.set(.13,.07,.04);g.add(rs);
  // Hat
  if(hatType==='cap'){
    const top=mk(new T.CylinderGeometry(.27,.32,.2,10),hatC);top.position.y=2.24;g.add(top);
    const brim=mk(new T.CylinderGeometry(.4,.4,.05,12),hatC);brim.position.y=2.13;g.add(brim);
    const bill=mk(new T.BoxGeometry(.42,.04,.22),hatC);bill.position.set(0,2.12,.26);g.add(bill);
  } else if(hatType==='hardhat'){
    const dome=mk(new T.SphereGeometry(.38,10,5,0,Math.PI*2,0,Math.PI*.48),hatC);dome.position.y=2.08;g.add(dome);
    const brim=mk(new T.CylinderGeometry(.46,.46,.05,12),hatC);brim.position.y=2.06;g.add(brim);
  } else if(hatType==='beanie'){
    const bn=mk(new T.SphereGeometry(.36,10,8,0,Math.PI*2,0,Math.PI*.58),hatC);bn.position.y=2.02;g.add(bn);
  } else if(hatType==='cowboy'){
    const cr=mk(new T.CylinderGeometry(.24,.3,.32,10),hatC);cr.position.y=2.24;g.add(cr);
    const wb=mk(new T.CylinderGeometry(.62,.62,.05,12),hatC);wb.position.y=2.1;g.add(wb);
  } else if(hatType==='headband'){
    const hb=mk(new T.TorusGeometry(.34,.045,6,14),hatC);hb.rotation.x=Math.PI/2;hb.position.y=1.95;g.add(hb);
  } else if(hatType==='bow'){
    const b1=mk(new T.SphereGeometry(.12,6,6),hatC);b1.scale.set(1.4,.8,1);b1.position.set(-.18,2.18,0);g.add(b1);
    const b2=mk(new T.SphereGeometry(.12,6,6),hatC);b2.scale.set(1.4,.8,1);b2.position.set(.18,2.18,0);g.add(b2);
    const bc=mk(new T.SphereGeometry(.07,6,6),hatC);bc.position.set(0,2.18,0);g.add(bc);
  }
  // Name badge — worn on the chest (small ID tag) instead of a big overhead name
  const cv=document.createElement('canvas');cv.width=256;cv.height=80;
  const cx=cv.getContext('2d');
  (function(){var r=16,x=24,y=14,w=208,h=52;cx.fillStyle='rgba(255,255,255,.97)';cx.strokeStyle='rgba(20,40,70,.9)';cx.lineWidth=5;cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath();cx.fill();cx.stroke();})();
  cx.font='bold 30px sans-serif';cx.fillStyle='#12233a';cx.textAlign='center';cx.textBaseline='middle';
  cx.fillText(p.name||'Guest',128,42);
  const sp=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv),depthTest:false}));
  sp.scale.set(1.3,.41,1);sp.position.y=1.5;g.add(sp);
  // Load the SAME realistic 3D model the local player uses; it hides the block figure once it arrives.
  if(ch.rpm&&typeof ch.rpm==='string'){ try{ window._swLoadAvatarModel(T,g,{url:ch.rpm}); }catch(e){} }
  else { var _amk=(ch.model&&ch.model!=='none')?ch.model:'soldier'; var _amd=window._SWMODELS&&window._SWMODELS[_amk]; if(_amd){ try{ window._swLoadAvatarModel(T,g,_amd); }catch(e){} } }
  return g;
};

// ── Wardrobe Modal ────────────────────────────────────────────────────────────
window._swShowWardrobe=function(){
  document.getElementById('sw-wardrobe')&&document.getElementById('sw-wardrobe').remove();
  var ch=window._swGetChar()||{};
  var male=(ch.gender||'male')==='male';
  var skins=['#FDDBB4','#F1A875','#C68642','#8D5524','#4A2912'];
  var hairs=['#FAD5A5','#D4A017','#8B4513','#2c1810','#1a1a1a','#C0C0C0'];
  var colors=['#ef4444','#dc2626','#f97316','#f59e0b','#eab308','#84cc16','#22c55e','#14b8a6','#0ea5e9','#2563eb','#1e293b','#8b5cf6','#a855f7','#ec4899','#9a3b30','#8b5a2b','#6b7280','#475569','#ffffff','#000000'];
  var shoes=['#3b2a1a','#1a1a1a','#0a0a0a','#ffffff','#8B4513','#6b7280','#ef4444','#eab308'];
  var hats=male?[['none','None','⬛'],['cap','Cap','🧢'],['hardhat','Hard Hat','⛑️'],['beanie','Beanie','🎿'],['cowboy','Cowboy','🤠']]
               :[['none','None','⬛'],['cap','Cap','🧢'],['beanie','Beanie','🎿'],['headband','Band','💜'],['bow','Bow','🎀']];
  function sw(id,opts,cur,size){return opts.map(function(c){return '<div onclick="window._swWardrobeSet(\''+id+'\',\''+c+'\')" style="width:'+size+';height:'+size+';border-radius:6px;background:'+c+';border:3px solid '+(c===cur?'#fff':'transparent')+';cursor:pointer;flex-shrink:0;"></div>';}).join('');}
  function hatRow(cur){return hats.map(function(h){return '<div onclick="window._swWardrobeSet(\'hat\',\''+h[0]+'\')" style="display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;padding:6px 8px;border-radius:8px;background:'+(h[0]===cur?'rgba(255,255,255,.25)':'rgba(255,255,255,.07)')+';border:2px solid '+(h[0]===cur?'#fff':'transparent')+';"><span style="font-size:22px;">'+h[2]+'</span><span style="color:#fff;font-size:9px;font-weight:700;">'+h[1]+'</span></div>';}).join('');}
  function lab(t){return '<label style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1px;">'+t+'</label>';}
  function orow(id,opts,cur){return opts.map(function(o){return '<div onclick="window._swWardrobeSet(\''+id+'\',\''+o[0]+'\')" style="display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:7px 12px;border-radius:9px;background:'+(o[0]===cur?'rgba(255,255,255,.25)':'rgba(255,255,255,.07)')+';border:2px solid '+(o[0]===cur?'#fff':'transparent')+';"><span style="font-size:20px;">'+o[2]+'</span><span style="color:#fff;font-size:9px;font-weight:700;">'+o[1]+'</span></div>';}).join('');}
  function previewSVG(){
    var skin=ch.skin||'#FDDBB4',hair=ch.hair||'#2c1810',shirt=ch.shirt||'#3b82f6',pants=ch.pants||'#1e3a8a',shoe=ch.shoes||'#3b2a1a',hat=ch.hat||'none',hatc=ch.hatColor||'#ff6600';
    var nm=(ch.nick)||((typeof _myName==='function'?_myName():'')||'You');
    var glc=ch.glasses||'none',bdc=ch.beard||'none';
    var lower=male
      ?'<rect x="46" y="116" width="12" height="42" rx="4" fill="'+pants+'"/><rect x="62" y="116" width="12" height="42" rx="4" fill="'+pants+'"/>'
      :'<polygon points="40,114 80,114 88,150 32,150" fill="'+pants+'"/><rect x="48" y="140" width="10" height="18" fill="'+skin+'"/><rect x="62" y="140" width="10" height="18" fill="'+skin+'"/>';
    var hairS=male
      ?'<path d="M42 52 a18 18 0 0 1 36 0 v-6 a18 13 0 0 0 -36 0 z" fill="'+hair+'"/>'
      :'<path d="M40 54 a20 20 0 0 1 40 0 v18 h-7 v-15 a13 13 0 0 0 -26 0 v15 h-7 z" fill="'+hair+'"/>';
    var hs='';
    if(hat==='cap')hs='<path d="M42 42 a18 12 0 0 1 36 0 z" fill="'+hatc+'"/><rect x="60" y="38" width="26" height="6" rx="3" fill="'+hatc+'"/>';
    else if(hat==='hardhat')hs='<path d="M40 44 a20 16 0 0 1 40 0 z" fill="'+hatc+'"/><rect x="36" y="42" width="48" height="5" rx="2" fill="'+hatc+'"/>';
    else if(hat==='beanie')hs='<path d="M42 46 a18 15 0 0 1 36 0 z" fill="'+hatc+'"/>';
    else if(hat==='cowboy')hs='<ellipse cx="60" cy="44" rx="38" ry="7" fill="'+hatc+'"/><ellipse cx="60" cy="34" rx="16" ry="12" fill="'+hatc+'"/>';
    else if(hat==='headband')hs='<rect x="40" y="44" width="40" height="6" rx="3" fill="'+hatc+'"/>';
    else if(hat==='bow')hs='<circle cx="53" cy="38" r="6" fill="'+hatc+'"/><circle cx="67" cy="38" r="6" fill="'+hatc+'"/><circle cx="60" cy="38" r="4" fill="'+hatc+'"/>';
    return '<svg width="130" height="184" viewBox="0 0 120 184" style="background:rgba(255,255,255,.06);border-radius:14px;">'
      +'<rect x="14" y="2" width="92" height="22" rx="11" fill="rgba(0,0,0,.72)"/>'
      +'<text x="60" y="18" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold" font-family="Arial">'+nm+'</text>'
      +lower
      +'<rect x="42" y="156" width="16" height="10" rx="3" fill="'+shoe+'"/><rect x="62" y="156" width="16" height="10" rx="3" fill="'+shoe+'"/>'
      +'<rect x="42" y="82" width="36" height="40" rx="10" fill="'+shirt+'"/>'
      +'<rect x="30" y="84" width="12" height="34" rx="6" fill="'+shirt+'"/><rect x="78" y="84" width="12" height="34" rx="6" fill="'+shirt+'"/>'
      +'<circle cx="34" cy="120" r="6" fill="'+skin+'"/><circle cx="86" cy="120" r="6" fill="'+skin+'"/>'
      +'<circle cx="60" cy="60" r="18" fill="'+skin+'"/>'+'<circle cx="54" cy="58" r="3.2" fill="#fff"/><circle cx="66" cy="58" r="3.2" fill="#fff"/>'+'<circle cx="54" cy="58" r="1.5" fill="'+(ch.eyes||'#1a1a1a')+'"/><circle cx="66" cy="58" r="1.5" fill="'+(ch.eyes||'#1a1a1a')+'"/>'+'<path d="M53 66 q7 5 14 0" stroke="#7a3b2a" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
      +hairS+hs+(glc==='none'?'':(glc==='sun'?'<rect x="49" y="55" width="9" height="7" rx="2" fill="#111"/><rect x="62" y="55" width="9" height="7" rx="2" fill="#111"/>':'<rect x="49" y="55" width="9" height="7" rx="2" fill="none" stroke="#1a1a1a" stroke-width="1.4"/><rect x="62" y="55" width="9" height="7" rx="2" fill="none" stroke="#1a1a1a" stroke-width="1.4"/><line x1="58" y1="58" x2="62" y2="58" stroke="#1a1a1a" stroke-width="1.4"/>'))+(bdc==='none'?'':'<path d="M46 60 Q60 '+(bdc==='full'?'86':'76')+' 74 60 Q60 68 46 60 Z" fill="'+hair+'"/>')
      +'</svg>';
  }
  function setsRow(){return '<div style="margin-bottom:14px;">'+lab('Quick Uniforms — one tap')+'<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">'+(window._swSetList||[]).map(function(s){return '<button onclick="window._swWardSet(\''+s[0]+'\')" style="border:none;cursor:pointer;background:rgba(255,255,255,.12);color:#fff;font:700 11px Arial;padding:7px 10px;border-radius:10px;">'+s[1]+'</button>';}).join('')+'</div></div>';}
  var ov=document.createElement('div');

  ov.id='sw-wardrobe';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:100001;display:flex;align-items:flex-start;justify-content:center;font-family:Arial,sans-serif;overflow-y:auto;padding:12px;box-sizing:border-box;';
  ov.onclick=function(e){if(e.target===ov)ov.remove();};
  ov.innerHTML='<div style="background:linear-gradient(160deg,#1e1e2e,#2a1a3e);border-radius:20px;padding:18px 20px;max-width:520px;width:100%;max-height:94vh;overflow-y:auto;box-sizing:border-box;box-shadow:0 20px 80px #000;color:#fff;">'
    +'<div style="text-align:center;font-size:22px;font-weight:900;letter-spacing:1px;margin-bottom:16px;">👔 Build Your Character</div>'
    +'<div style="margin-bottom:14px;">'+lab('Nickname — shows on your tag')+'<input id="sw-nick" value="'+String(ch.nick||'').replace(/"/g,'&quot;')+'" placeholder="e.g. Big K, Ace, Sarge" oninput="window._swSetNick&&window._swSetNick(this.value)" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px 11px;border-radius:10px;border:none;background:rgba(255,255,255,.14);color:#fff;font-size:14px;font-weight:700;outline:none;">'+'</div>'
    +'<div style="margin-bottom:14px;">'+lab('Character — pick your look')+'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">'+orow('model',[['soldier','Soldier','🪖'],['xbot','Agent','🕵️'],['cesium','Worker','👷'],['robot','Robot','🤖']],(ch.model&&ch.model!=='none')?ch.model:'soldier')+'</div></div>'
    +(function(){var rd=(window._SWJOBLIST||[]).filter(function(j){return j.ready;});if(!rd.length)return '';return '<div style="margin-bottom:14px;">'+lab('Your custom characters')+'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">'+rd.map(function(j){var on=(ch.model===j.key&&!ch.rpm);return '<div onclick="window._swPickModel(\''+j.key+'\')" style="display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:7px 12px;border-radius:9px;background:'+(on?'rgba(255,255,255,.25)':'rgba(255,255,255,.07)')+';border:2px solid '+(on?'#fff':'transparent')+';"><span style="font-size:20px;">'+j.emoji+'</span><span style="color:#fff;font-size:9px;font-weight:700;white-space:nowrap;">'+j.label+'</span></div>';}).join('')+'</div></div>';})()
    +'<div style="margin-bottom:14px;">'+lab('Make your own — suit, cap, shades, anything')
      +'<button onclick="document.getElementById(\'sw-wardrobe\').remove();window._swOpenRPM&&window._swOpenRPM();" style="width:100%;border:none;background:linear-gradient(90deg,#0ea5e9,#22c55e);color:#fff;font:900 15px Arial;padding:13px;border-radius:12px;cursor:pointer;margin-top:6px;box-shadow:0 4px 14px rgba(14,165,233,.4);">🎨 Build Custom 3D Character</button>'
      +(ch.rpm?'<div onclick="window._swClearRPM&&window._swClearRPM()" style="text-align:center;color:#ff9a9a;font-size:11px;font-weight:700;margin-top:8px;cursor:pointer;text-decoration:underline;">↩ Reset to a built-in character</div>':'<div style="text-align:center;color:#8a8a9a;font-size:10px;margin-top:6px;">Opens a free builder — pick face, body, and outfit, then it walks in your world.</div>')
    +'</div>'
    +'<button onclick="document.getElementById(\'sw-wardrobe\').remove()" style="width:100%;border:none;background:linear-gradient(90deg,#8b5cf6,#ec4899);color:#fff;font:900 15px Arial;padding:12px;border-radius:12px;cursor:pointer;margin-top:6px;">Done</button>'
    +'<div style="text-align:center;color:#8a8a9a;font-size:10px;margin-top:8px;">Your look saves instantly and shows to everyone else in the yard.</div>'
  +'</div>';
  document.body.appendChild(ov);
};
window._swWardrobeSet=function(id,val){
  var ch=window._swGetChar()||{}; ch[id]=val;
  if(window._swSaveChar) window._swSaveChar(ch);
  window._swApplyLook&&window._swApplyLook();
  window._swShowWardrobe();
};
window._swWardGender=function(g){
  var ch=window._swGetChar()||{}; ch.gender=g;
  if(window._swSaveChar) window._swSaveChar(ch);
  window._swApplyLook&&window._swApplyLook();
  window._swShowWardrobe();
};

window._swApplyLook=function(){
  try{
    var app=window.__swApp, T=window.THREE;
    if(!app||!app.walker||!T) return;
    var ch=(window._swGetChar&&window._swGetChar())||{};
    var _rpmUrl=(ch.rpm&&typeof ch.rpm==='string')?ch.rpm:'';
    var _wm=_rpmUrl?('rpm:'+_rpmUrl):((ch.model&&ch.model!=='none')?ch.model:'');
    if(app.walker._modelKey!==_wm && T.GLTFLoader){
      app.walker._modelKey=_wm; app.walker._mixer=null;
      if(app.walker._modelObj){ app.walker.g.remove(app.walker._modelObj); app.walker._modelObj=null; }
      if(!_wm){ app.walker.g.children.forEach(function(c){ c.visible=true; }); }
      else if(_rpmUrl || (window._SWMODELS && window._SWMODELS[_wm])){
        var _md=_rpmUrl?{url:_rpmUrl}:window._SWMODELS[_wm], _np2=app.walker._np&&app.walker._np.sp;
        try{ new T.GLTFLoader().load(_md.url,function(gl){
          if(app.walker._modelKey!==_wm) return;
          var mo=gl.scene; mo.scale.setScalar(_md.scale||1); mo.rotation.y=(_md.rot||0);
          mo.traverse(function(o){ if(o.isMesh){o.castShadow=true; o.frustumCulled=false;} });
          // Auto-fit unknown models to a person-ish height, feet on the floor, centered
          // Universal size clamp: force EVERY character to ~1.9 tall, feet on the floor — can never go giant/tiny
          try{ mo.updateMatrixWorld(true); var _b=new T.Box3().setFromObject(mo),_s3=new T.Vector3(); _b.getSize(_s3); if(_s3.y>0.3&&_s3.y<60){ mo.scale.multiplyScalar(1.9/_s3.y); } mo.updateMatrixWorld(true); var _b2=new T.Box3().setFromObject(mo),_c3=new T.Vector3(); _b2.getCenter(_c3); mo.position.x-=_c3.x; mo.position.z-=_c3.z; mo.position.y-=_b2.min.y; }catch(_e){}
          app.walker.g.children.slice().forEach(function(c){ if(c!==_np2 && c!==mo) c.visible=false; });
          app.walker.g.add(mo); app.walker._modelObj=mo;
          try{ mo.updateMatrixWorld(true); var _tb=new T.Box3().setFromObject(mo); app.walker._modelTopY=_tb.max.y; }catch(_e2){}
          app.walker._hatKey=null; app.walker._uniKey=null; // force gear rebuild for the new body height
          if(window._swApplyLook) window._swApplyLook();
          if(gl.animations&&gl.animations.length){
            var mx=new T.AnimationMixer(mo);
            var walkC=T.AnimationClip.findByName(gl.animations,_md.clip)||gl.animations[0];
            var idleC=T.AnimationClip.findByName(gl.animations,_md.idle)||walkC;
            var walkA=mx.clipAction(walkC), idleA=mx.clipAction(idleC);
            idleA.play(); walkA.play(); walkA.setEffectiveWeight(0); idleA.setEffectiveWeight(1);
            app.walker._mixer=mx;
            var clk=new T.Clock(), curW=0;
            (function anim(){
              if(app.walker._mixer!==mx) return;
              requestAnimationFrame(anim);
              var dt=clk.getDelta(); mx.update(dt);
              // Framerate-independent, smoothly blended walk/idle (no twitch on high-refresh screens)
              var target=(app.walker&&app.walker._mov)?1:0;
              curW += (target-curW)*Math.min(1, dt*10);
              walkA.setEffectiveWeight(curW); idleA.setEffectiveWeight(1-curW);
            })();
          } else {
            // No built-in animation (e.g. a photo-made statue): fake natural life —
            // subtle stride bob + gentle forward lean while moving, soft breathe when idle.
            var _by=mo.position.y, _brx=mo.rotation.x, _clk2=new T.Clock(), _t=0, _lean=0, _step=0;
            app.walker._staticAnim=mo;
            (function bob(){
              if(app.walker._modelObj!==mo){ return; }
              requestAnimationFrame(bob);
              var dt=_clk2.getDelta(); _t+=dt;
              var mov=(app.walker&&app.walker._mov)?1:0;
              _lean += ((mov?1:0)-_lean)*Math.min(1,dt*8);          // ease into/out of the walk pose
              if(mov) _step += dt*7.5;                              // stride cadence only advances while moving
              var bob=Math.abs(Math.sin(_step))*0.035*_lean;        // small vertical rise per step
              var breathe=Math.sin(_t*1.8)*0.008*(1-_lean);         // idle breathe
              mo.position.y=_by+bob+breathe;
              mo.rotation.x=_brx - 0.06*_lean;                      // slight forward lean = "heading somewhere"
              mo.rotation.z=Math.sin(_step)*0.02*_lean;             // faint weight-shift sway
            })();
          }
        },undefined,function(){ app.walker._modelKey=''; }); }catch(_){ app.walker._modelKey=''; }
      }
    }
    var m=app.walker.mats;
    if(m){
      if(m.skin) m.skin.color.set(ch.skin||'#e8b68a');
      if(m.shirt) m.shirt.color.set(ch.shirt||'#2f7fd0');
      if(m.jeans) m.jeans.color.set(ch.pants||'#33405a');
      if(m.hair) m.hair.color.set(ch.hair||'#3a2a1a');
      if(m.shoe) m.shoe.color.set(ch.shoes||'#3b2a1a');
    }
    var g=app.walker.g;
    if(g){
      var nm=(ch.nick)||((typeof _myName==='function'?_myName():'')||'You');
      if(!app.walker._np){
        var cv=document.createElement('canvas');cv.width=256;cv.height=80;
        var tx=new T.CanvasTexture(cv);
        var sp=new T.Sprite(new T.SpriteMaterial({map:tx,depthTest:false}));
        sp.scale.set(1.3,0.41,1); sp.position.y=1.5; g.add(sp);
        app.walker._np={cv:cv,tx:tx,last:null};
      }
      var np=app.walker._np;
      if(np.last!==nm){
        var cx=np.cv.getContext('2d'); cx.clearRect(0,0,256,80);
        (function(){var r=16,x=24,y=14,w=208,h=52;cx.fillStyle='rgba(255,255,255,.97)';cx.strokeStyle='rgba(20,40,70,.9)';cx.lineWidth=5;cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath();cx.fill();cx.stroke();})();
        cx.font='bold 30px sans-serif'; cx.fillStyle='#12233a'; cx.textAlign='center'; cx.textBaseline='middle';
        cx.fillText(nm,128,42);
        np.tx.needsUpdate=true; np.last=nm;
      }
      var _isGLB=!!(ch.model&&ch.model!=='none');
      var _ht=((ch.rpm||_isGLB||(window._swUniHat&&window._swUniHat[ch.uniform]))?'none':(ch.hat||'none')), _hc=ch.hatColor||'#ff6600';
      var _hkey=_ht+'|'+_hc+'|'+(ch.model||'');
      if(app.walker._hatKey!==_hkey){
        if(app.walker._hatObj){ g.remove(app.walker._hatObj); app.walker._hatObj=null; }
        if(_ht!=='none'){
          var hg=new T.Group(), _hcol=new T.Color(_hc);
          var hm=function(geo){return new T.Mesh(geo,new T.MeshLambertMaterial({color:_hcol}));};
          if(_ht==='cap'){var a=hm(new T.CylinderGeometry(.27,.32,.2,10));a.position.y=2.24;hg.add(a);var b=hm(new T.CylinderGeometry(.4,.4,.05,12));b.position.y=2.13;hg.add(b);var d=hm(new T.BoxGeometry(.42,.04,.22));d.position.set(0,2.12,.26);hg.add(d);}
          else if(_ht==='hardhat'){var a=hm(new T.SphereGeometry(.38,10,5,0,Math.PI*2,0,Math.PI*.48));a.position.y=2.08;hg.add(a);var b=hm(new T.CylinderGeometry(.46,.46,.05,12));b.position.y=2.06;hg.add(b);}
          else if(_ht==='beanie'){var a=hm(new T.SphereGeometry(.36,10,8,0,Math.PI*2,0,Math.PI*.58));a.position.y=2.02;hg.add(a);}
          else if(_ht==='cowboy'){var a=hm(new T.CylinderGeometry(.24,.3,.32,10));a.position.y=2.24;hg.add(a);var b=hm(new T.CylinderGeometry(.62,.62,.05,12));b.position.y=2.1;hg.add(b);}
          else if(_ht==='headband'){var a=hm(new T.TorusGeometry(.34,.045,6,14));a.rotation.x=Math.PI/2;a.position.y=1.95;hg.add(a);}
          else if(_ht==='bow'){var a=hm(new T.SphereGeometry(.12,6,6));a.scale.set(1.4,.8,1);a.position.set(-.18,2.18,0);hg.add(a);var b=hm(new T.SphereGeometry(.12,6,6));b.scale.set(1.4,.8,1);b.position.set(.18,2.18,0);hg.add(b);var d=hm(new T.SphereGeometry(.07,6,6));d.position.set(0,2.18,0);hg.add(d);}
          g.add(hg);
          if(ch.model&&ch.model!=='none'&&app.walker._modelTopY){ hg.position.y+=(app.walker._modelTopY-2.12); }
          app.walker._hatObj=hg;
        }
        app.walker._hatKey=_hkey;
      }
      // Realistic uniform gear (coat/vest/helmet/tank/cap) sized to this body
      var _uni=ch.uniform||'none';
      var _HH=((ch.model&&ch.model!=='none'&&app.walker._modelTopY)?app.walker._modelTopY:1.95);
      var _ukey=_uni+'|'+(ch.model||'')+'|'+Math.round(_HH*50);
      if(app.walker._uniKey!==_ukey){
        if(app.walker._uniObj){ g.remove(app.walker._uniObj); app.walker._uniObj=null; }
        if(_uni&&_uni!=='none'&&window._swUniform&&!_isGLB){ var _kit=window._swUniform(T,_uni,_HH); if(_kit){ g.add(_kit); app.walker._uniObj=_kit; } }
        app.walker._uniKey=_ukey;
      }
    }
  }catch(e){}
};
window._swBuildOfficeCC=function(){
  try{
    var app=window.__swApp, T=window.THREE;
    if(!app||!T||!app.scene) return;
    function mat(color,opts){return new T.MeshStandardMaterial(Object.assign({color:color},opts||{}));}
    var ox=500, oz=500, W=28, D=32, H=5.2;
    // Always drop the player inside the room, facing the big command screen.
    if(app.walker){ if(app.setMode)app.setMode('walk'); app._inCommandRoom=true; app.walker.g.position.set(ox,0,oz+2); app.walker.h=Math.PI; if(app._net&&app._net._pos)app._net._pos(); }
    // Always tear down and rebuild so the room renders fully on EVERY re-entry (no empty room, no duplicates)
    if(app._officeCC){ try{ if(app._officeCCiv)clearInterval(app._officeCCiv); if(app._officeCCclock)clearInterval(app._officeCCclock); if(app._officeCChistiv)clearInterval(app._officeCChistiv); if(app._officeFanRAF)cancelAnimationFrame(app._officeFanRAF); if(app._officeCC.grp)app.scene.remove(app._officeCC.grp); }catch(e){} app._officeCC=null; app._histScr=null; app._officeFanOn=false; }
    var grp=new T.Group();
    // Realistic office shell: bright drywall, polished concrete floor, drop-ceiling with light panels
    function wall(w,h,color,x,y,z,ry){ var m=new T.Mesh(new T.PlaneGeometry(w,h), new T.MeshStandardMaterial({color:color,roughness:.96,metalness:0,side:T.DoubleSide})); m.position.set(x,y,z); if(ry)m.rotation.y=ry; m.receiveShadow=true; grp.add(m); return m; }
    // floor — polished light concrete
    // ── SPACECRAFT FLOOR — dark metallic plating with panel grid ──
    (function(){
      var fc=document.createElement('canvas'); fc.width=512; fc.height=512;
      var fx=fc.getContext('2d');
      fx.fillStyle='#080c14'; fx.fillRect(0,0,512,512);
      fx.strokeStyle='#141e2e'; fx.lineWidth=2;
      for(var pl=0;pl<512;pl+=64){fx.beginPath();fx.moveTo(pl,0);fx.lineTo(pl,512);fx.stroke();fx.beginPath();fx.moveTo(0,pl);fx.lineTo(512,pl);fx.stroke();}
      fx.strokeStyle='rgba(255,140,0,0.06)'; fx.lineWidth=1;
      for(var al=0;al<512;al+=128){fx.beginPath();fx.moveTo(al,0);fx.lineTo(al,512);fx.stroke();}
      var flT=new T.CanvasTexture(fc); flT.wrapS=flT.wrapT=T.RepeatWrapping; flT.repeat.set(7,8);
      var flMat=new T.MeshStandardMaterial({map:flT,color:'#0a0e18',roughness:.28,metalness:.75});
      var fl=new T.Mesh(new T.PlaneGeometry(W,D),flMat); fl.rotation.x=-Math.PI/2; fl.position.set(ox,0.02,oz); fl.receiveShadow=true; grp.add(fl);
    })();
    // ── SPACECRAFT CEILING — dark panels with structural ribs + amber glow ──
    var cl=new T.Mesh(new T.PlaneGeometry(W,D), new T.MeshStandardMaterial({color:'#06090f',roughness:.7,metalness:.4,side:T.DoubleSide})); cl.rotation.x=Math.PI/2; cl.position.set(ox,H,oz); grp.add(cl);
    // ceiling ribs (bulkheads)
    for(var rbi=0;rbi<=4;rbi++){ var rbz=oz-D/2+rbi*D/4; var rib=new T.Mesh(new T.BoxGeometry(W,0.22,0.42),new T.MeshStandardMaterial({color:'#10192a',metalness:.65,roughness:.38})); rib.position.set(ox,H-0.11,rbz); grp.add(rib); var rs=new T.Mesh(new T.BoxGeometry(W-0.6,0.04,0.06),new T.MeshStandardMaterial({color:'#d06000',emissive:'#d06000',emissiveIntensity:0.95})); rs.position.set(ox,H-0.24,rbz); grp.add(rs); var rg=new T.PointLight(0xd06000,0.35,12); rg.position.set(ox,H-0.35,rbz); grp.add(rg); }
    // ── SPACECRAFT WALLS — dark gunmetal with panel detail ──
    function spaceMat(hex){ return new T.MeshStandardMaterial({color:hex,roughness:.72,metalness:.45,side:T.DoubleSide}); }
    var frontWall=new T.Mesh(new T.PlaneGeometry(W,H),spaceMat('#07090f')); frontWall.position.set(ox,H/2,oz-D/2); frontWall.receiveShadow=true; grp.add(frontWall);
    wall(W,H,'#08090e',ox,H/2,oz+D/2,0);
    wall(D,H,'#070810',ox-W/2,H/2,oz,Math.PI/2);
    wall(D,H,'#070810',ox+W/2,H/2,oz,Math.PI/2);
    // amber cove strips
    function cove(w,x,z,ry){ var s=new T.Mesh(new T.BoxGeometry(w,0.10,0.10),new T.MeshStandardMaterial({color:'#e07800',emissive:'#e07800',emissiveIntensity:1.1})); s.position.set(x,H-0.28,z); if(ry)s.rotation.y=ry; grp.add(s); var gl=new T.PointLight(0xe07800,0.3,w*0.5); gl.position.set(x,H-0.4,z); grp.add(gl); }
    cove(W,ox,oz-D/2+0.08,0); cove(W,ox,oz+D/2-0.08,0); cove(D,ox-W/2+0.08,oz,Math.PI/2); cove(D,ox+W/2-0.08,oz,Math.PI/2);
    // amber corner cube connectors
    [[ox-W/2+0.08,oz-D/2+0.08],[ox+W/2-0.08,oz-D/2+0.08],[ox-W/2+0.08,oz+D/2-0.08],[ox+W/2-0.08,oz+D/2-0.08]].forEach(function(p){ var cp=new T.Mesh(new T.BoxGeometry(0.14,0.10,0.14),new T.MeshStandardMaterial({color:'#e07800',emissive:'#e07800',emissiveIntensity:1.1})); cp.position.set(p[0],H-0.28,p[1]); grp.add(cp); });
    // structural corner pillars (4 corners)
    [[ox-W/2+0.2,oz-D/2+0.2],[ox+W/2-0.2,oz-D/2+0.2],[ox-W/2+0.2,oz+D/2-0.2],[ox+W/2-0.2,oz+D/2-0.2]].forEach(function(p){ var pl=new T.Mesh(new T.BoxGeometry(0.5,H,0.5),new T.MeshStandardMaterial({color:'#0e1520',metalness:.7,roughness:.3})); pl.position.set(p[0],H/2,p[1]); grp.add(pl); var ps=new T.Mesh(new T.BoxGeometry(0.05,H*0.7,0.05),new T.MeshStandardMaterial({color:'#e07800',emissive:'#e07800',emissiveIntensity:0.7})); ps.position.set(p[0]+(p[0]>ox?-0.25:0.25),H/2,p[1]+(p[1]>oz?-0.25:0.25)); grp.add(ps); });
    // dark baseboards
    function baseboard(w,x,z,ry){ var b=new T.Mesh(new T.BoxGeometry(w,0.32,0.12),new T.MeshStandardMaterial({color:'#0d141e',roughness:.5,metalness:.4})); b.position.set(x,0.17,z); if(ry)b.rotation.y=ry; grp.add(b); var bs=new T.Mesh(new T.BoxGeometry(w,0.05,0.04),new T.MeshStandardMaterial({color:'#e07800',emissive:'#e07800',emissiveIntensity:0.5})); bs.position.set(x,0.34,z); if(ry)bs.rotation.y=ry; grp.add(bs); }
    baseboard(W,ox,oz-D/2+0.09,0); baseboard(W,ox,oz+D/2-0.09,0); baseboard(D,ox-W/2+0.09,oz,Math.PI/2); baseboard(D,ox+W/2-0.09,oz,Math.PI/2);
    // ONE big bright command screen on the front wall
    var cv=document.createElement('canvas'); cv.width=1024; cv.height=471;
    var tx=new T.CanvasTexture(cv);
    // ── COMMAND SCREEN — large raised bezel, screen glow ──
    var bez=new T.Mesh(new T.BoxGeometry(9.0,4.2,0.32),new T.MeshStandardMaterial({color:'#04080f',emissive:'#001428',emissiveIntensity:0.3,metalness:.7,roughness:.3})); bez.position.set(ox,3.3,oz-D/2+0.14); grp.add(bez);
    // side pillars of bezel
    [-1,1].forEach(function(side){ var bp=new T.Mesh(new T.BoxGeometry(0.4,4.8,0.38),new T.MeshStandardMaterial({color:'#0a0f1a',metalness:.75,roughness:.28})); bp.position.set(ox+side*4.7,3.3,oz-D/2+0.14); grp.add(bp); var bs2=new T.Mesh(new T.BoxGeometry(0.05,4.0,0.04),new T.MeshStandardMaterial({color:'#e07800',emissive:'#e07800',emissiveIntensity:0.8})); bs2.position.set(ox+side*4.95,3.3,oz-D/2+0.14); grp.add(bs2); });
    var scr=new T.Mesh(new T.PlaneGeometry(8.6,3.9),new T.MeshBasicMaterial({map:tx})); scr.position.set(ox,3.3,oz-D/2+0.31); grp.add(scr);
    // screen blue ambient glow
    var scrGl=new T.PointLight(0x0040ff,0.5,10); scrGl.position.set(ox,3.0,oz-D/2+0.8); grp.add(scrGl);
    // ── SPACECRAFT COMMAND CONSOLE (replaces wood desk) ──
    var consMat=new T.MeshStandardMaterial({color:'#0c1220',metalness:.8,roughness:.28});
    var deskZ=oz-D/2+3.0, deskW=6.8;
    // main console body
    var cb=new T.Mesh(new T.BoxGeometry(deskW,0.16,2.0),consMat); cb.position.set(ox,1.02,deskZ); grp.add(cb);
    // angled front panel
    var cfr=new T.Mesh(new T.BoxGeometry(deskW,0.7,0.1),consMat); cfr.rotation.x=-0.35; cfr.position.set(ox,0.7,deskZ-1.0); grp.add(cfr);
    // side risers
    [-1,1].forEach(function(s){ var cr=new T.Mesh(new T.BoxGeometry(0.3,1.05,2.0),new T.MeshStandardMaterial({color:'#0a1018',metalness:.8,roughness:.3})); cr.position.set(ox+s*(deskW/2+0.15),0.54,deskZ); grp.add(cr); });
    // amber edge strip on console top
    var ce=new T.Mesh(new T.BoxGeometry(deskW+0.1,0.04,0.04),new T.MeshStandardMaterial({color:'#e07800',emissive:'#e07800',emissiveIntensity:0.75})); ce.position.set(ox,1.12,deskZ-1.01); grp.add(ce);
    // console surface glow light
    var consGl=new T.PointLight(0x1060cc,0.35,8); consGl.position.set(ox,1.4,deskZ); grp.add(consGl);
    // small control panels on surface
    [-2.2,0,2.2].forEach(function(dx){ var cp2=new T.Mesh(new T.BoxGeometry(1.4,0.045,0.7),new T.MeshStandardMaterial({color:'#0d1828',metalness:.7,roughness:.4})); cp2.position.set(ox+dx,1.1,deskZ+0.3); grp.add(cp2); var cpe=new T.Mesh(new T.BoxGeometry(1.35,0.02,0.04),new T.MeshStandardMaterial({color:'#0080ff',emissive:'#0080ff',emissiveIntensity:0.6})); cpe.position.set(ox+dx,1.12,deskZ+0.67); grp.add(cpe); });
    // ── Office chair: seat, mesh back, arms, gas lift, 5-star base + casters ──
    var chair=new T.Group();
    var chMat=new T.MeshStandardMaterial({color:'#15181d',roughness:.6,metalness:.1});
    var seat=new T.Mesh(new T.BoxGeometry(0.92,0.16,0.86), chMat); seat.position.y=0.72; seat.castShadow=true; chair.add(seat);
    var back=new T.Mesh(new T.BoxGeometry(0.86,1.15,0.14), chMat); back.position.set(0,1.35,0.4); back.rotation.x=-0.12; back.castShadow=true; chair.add(back);
    var armL=new T.Mesh(new T.BoxGeometry(0.1,0.36,0.5), chMat); armL.position.set(-0.5,0.9,0.02); chair.add(armL);
    var armLp=new T.Mesh(new T.BoxGeometry(0.16,0.06,0.5), chMat); armLp.position.set(-0.5,1.08,0.02); chair.add(armLp);
    var armR=armL.clone(); armR.position.x=0.5; chair.add(armR); var armRp=armLp.clone(); armRp.position.x=0.5; chair.add(armRp);
    var lift=new T.Mesh(new T.CylinderGeometry(0.06,0.06,0.5,14), mat('#3a3f45',{metalness:.7,roughness:.3})); lift.position.y=0.42; chair.add(lift);
    var hub=new T.Mesh(new T.CylinderGeometry(0.12,0.12,0.08,16), mat('#26292e',{metalness:.5})); hub.position.y=0.16; chair.add(hub);
    for(var s=0;s<5;s++){ var a=s*Math.PI*2/5; var leg=new T.Mesh(new T.BoxGeometry(0.5,0.06,0.1), mat('#26292e',{metalness:.5})); leg.position.set(Math.cos(a)*0.26,0.12,Math.sin(a)*0.26); leg.rotation.y=-a; leg.castShadow=true; chair.add(leg); var cw2=new T.Mesh(new T.SphereGeometry(0.06,10,10), mat('#111')); cw2.position.set(Math.cos(a)*0.5,0.06,Math.sin(a)*0.5); chair.add(cw2); }
    chair.position.set(ox,0,deskZ+1.7); grp.add(chair);
    // ── Lighting: dark spacecraft — dim ambient + amber cove fills + blue screen wash ──
    grp.add(new T.HemisphereLight(0x080c18,0x030508,0.08));
    // cool blue screen glow from front wall
    var scrGlow=new T.SpotLight(0x0055cc,0.55,30,Math.PI/4,0.8,1.5); scrGlow.position.set(ox,3.2,oz-D/2+1.5); scrGlow.target.position.set(ox,1.5,oz); grp.add(scrGlow); grp.add(scrGlow.target);
    // amber under-console glow
    var cGlow=new T.PointLight(0xd06000,0.45,18); cGlow.position.set(ox,0.5,deskZ-0.2); grp.add(cGlow);
    // soft amber fill left + right (simulates cove strip bounce)
    var aL=new T.PointLight(0xc05500,0.25,28); aL.position.set(ox-W/2+1,H-0.4,oz); grp.add(aL);
    var aR=new T.PointLight(0xc05500,0.25,28); aR.position.set(ox+W/2-1,H-0.4,oz); grp.add(aR);

    // ── Sci-fi glowing ceiling fan ──
    var fanRod=new T.Mesh(new T.CylinderGeometry(0.045,0.045,0.65,12), new T.MeshStandardMaterial({color:'#0a0e18',metalness:.9,roughness:.2,emissive:'#00aaff',emissiveIntensity:.18})); fanRod.position.set(ox,H-0.32,oz); grp.add(fanRod);
    var fanMount=new T.Mesh(new T.CylinderGeometry(0.22,0.26,0.12,20), new T.MeshStandardMaterial({color:'#060a14',metalness:.85,roughness:.18,emissive:'#00ccff',emissiveIntensity:.25})); fanMount.position.set(ox,H-0.06,oz); grp.add(fanMount);
    var fan=new T.Group(); fan.position.set(ox,H-0.72,oz);
    var motor=new T.Mesh(new T.CylinderGeometry(0.32,0.26,0.22,20), new T.MeshStandardMaterial({color:'#060a12',metalness:.88,roughness:.15,emissive:'#0088ff',emissiveIntensity:.3})); fan.add(motor);
    var motorRing=new T.Mesh(new T.TorusGeometry(0.28,0.025,8,32), new T.MeshStandardMaterial({color:'#00aaff',emissive:'#00aaff',emissiveIntensity:1.2,metalness:.6})); motorRing.rotation.x=Math.PI/2; fan.add(motorRing);
    // 5 blades with glowing cyan edge strips
    var bladeGrp=new T.Group(); fan.add(bladeGrp);
    for(var fb=0;fb<5;fb++){
      var arm=new T.Group();
      var blade=new T.Mesh(new T.BoxGeometry(2.4,0.038,0.34), new T.MeshStandardMaterial({color:'#060b18',metalness:.85,roughness:.12,emissive:'#0066cc',emissiveIntensity:.15})); blade.position.set(1.42,0,0); arm.add(blade);
      // glowing edge strip on blade
      var strip=new T.Mesh(new T.BoxGeometry(2.4,0.018,0.04), new T.MeshStandardMaterial({color:'#00d4ff',emissive:'#00d4ff',emissiveIntensity:2.2})); strip.position.set(1.42,0.02,0.17); arm.add(strip);
      var strip2=new T.Mesh(new T.BoxGeometry(2.4,0.018,0.04), new T.MeshStandardMaterial({color:'#00d4ff',emissive:'#00d4ff',emissiveIntensity:2.2})); strip2.position.set(1.42,0.02,-0.17); arm.add(strip2);
      arm.rotation.y=fb*Math.PI*2/5; bladeGrp.add(arm);
    }
    grp.add(fan); app._officeFan=fan;
    // 3 rotating point lights on the blade ring — cast spinning shadows
    var fanLights=[]; var fanLightColors=[0x00ccff,0x0088ff,0x00ffcc];
    for(var fl=0;fl<3;fl++){
      var fpl=new T.PointLight(fanLightColors[fl],1.4,14); fpl.castShadow=true; fpl.shadow.mapSize.width=512; fpl.shadow.mapSize.height=512; fpl.shadow.bias=-0.002;
      fpl.position.set(Math.cos(fl*Math.PI*2/3)*1.2, H-0.72, oz+Math.sin(fl*Math.PI*2/3)*1.2);
      grp.add(fpl); fanLights.push({light:fpl,angle:fl*Math.PI*2/3});
    }
    // central cyan glow under fan
    var fanGlow=new T.PointLight(0x00bbff,0.5,22); fanGlow.position.set(ox,H-1.1,oz); grp.add(fanGlow);
    if(app._officeFanRAF) cancelAnimationFrame(app._officeFanRAF);
    app._officeFanOn=true;
    (function spin(){
      if(!app._officeFanOn||!app._officeFan){ return; }
      app._officeFan.rotation.y+=0.04;
      for(var i=0;i<fanLights.length;i++){
        fanLights[i].angle+=0.04;
        fanLights[i].light.position.x=ox+Math.cos(fanLights[i].angle)*1.2;
        fanLights[i].light.position.z=oz+Math.sin(fanLights[i].angle)*1.2;
      }
      app._officeFanRAF=requestAnimationFrame(spin);
    })();

    // ── Office décor ──────────────────────────────────────────────
    var _tickers=[];
    function mat(c,extra){ var o2={color:c,roughness:.7}; if(extra) for(var k in extra)o2[k]=extra[k]; return new T.MeshStandardMaterial(o2); }
    // A wall panel (framed picture / clock / calendar) drawn from a canvas
    function panel(cw,ch,x,y,z,ry,drawFn,frameC,live){
      var A=320, can=document.createElement('canvas'); can.width=A; can.height=Math.max(1,Math.round(A*ch/cw));
      var ctx=can.getContext('2d'); drawFn(ctx,can.width,can.height);
      var tex=new T.CanvasTexture(can);
      var g2=new T.Group();
      if(frameC!==null){ var fr=new T.Mesh(new T.BoxGeometry(cw+0.18,ch+0.18,0.07), mat(frameC||'#241a12',{metalness:.2})); fr.position.z=-0.02; g2.add(fr); }
      var pm=new T.Mesh(new T.PlaneGeometry(cw,ch), new T.MeshBasicMaterial({map:tex})); pm.position.z=0.045; g2.add(pm);
      g2.position.set(x,y,z); if(ry)g2.rotation.y=ry; grp.add(g2);
      if(live){ _tickers.push(function(){ drawFn(ctx,can.width,can.height); tex.needsUpdate=true; }); }
      return g2;
    }
    // A framed REAL photo (loads an image file, cover-fits it onto the frame)
    function photoPanel(cw,ch,x,y,z,ry,url,frameC){
      var can=document.createElement('canvas'); can.width=512; can.height=Math.max(1,Math.round(512*ch/cw));
      var ctx=can.getContext('2d'); ctx.fillStyle='#20242b'; ctx.fillRect(0,0,can.width,can.height);
      var tex=new T.CanvasTexture(can);
      var img=new Image();
      img.onload=function(){ var ir=img.width/img.height, cr=can.width/can.height, sw,sh,sx,sy; if(ir>cr){ sh=img.height; sw=sh*cr; sx=(img.width-sw)/2; sy=0; } else { sw=img.width; sh=sw/cr; sx=0; sy=(img.height-sh)/2; } ctx.drawImage(img,sx,sy,sw,sh,0,0,can.width,can.height); tex.needsUpdate=true; };
      img.src=url;
      var g2=new T.Group();
      if(frameC!==null){ var fr=new T.Mesh(new T.BoxGeometry(cw+0.2,ch+0.2,0.08), mat(frameC||'#241a12',{metalness:.2})); fr.position.z=-0.02; g2.add(fr); }
      var pm=new T.Mesh(new T.PlaneGeometry(cw,ch), new T.MeshBasicMaterial({map:tex})); pm.position.z=0.05; g2.add(pm);
      g2.position.set(x,y,z); if(ry)g2.rotation.y=ry; grp.add(g2); return g2;
    }
    // A round disc padlock (Move-N-Store style) in the given colour
    function discLock(col,metal){
      var g3=new T.Group();
      var body=new T.Mesh(new T.CylinderGeometry(0.24,0.24,0.14,26), mat(col,{metalness:metal||.55,roughness:.32})); body.rotation.x=Math.PI/2; g3.add(body);
      var hub=new T.Mesh(new T.CylinderGeometry(0.11,0.11,0.17,22), mat(col,{metalness:(metal||.55)+.1,roughness:.28})); hub.rotation.x=Math.PI/2; hub.position.z=0.02; g3.add(hub);
      var kh=new T.Mesh(new T.CircleGeometry(0.035,14), mat('#1a1a1a',{roughness:.5})); kh.position.z=0.1; g3.add(kh);
      var sh=new T.Mesh(new T.TorusGeometry(0.075,0.032,8,16,Math.PI), mat('#c9d0d6',{metalness:.85,roughness:.25})); sh.position.y=0.235; g3.add(sh);
      return g3;
    }
    function place(o3,x,y,z,ry){ o3.position.set(x,y,z); if(ry)o3.rotation.y=ry; grp.add(o3); return o3; }

    // LEFT WALL — pegboard with hanging locks (red / blue / silver for new renters)
    var pegCan=document.createElement('canvas'); pegCan.width=256; pegCan.height=256;
    (function(){ var c=pegCan.getContext('2d'); c.fillStyle='#d9b98c'; c.fillRect(0,0,256,256); c.fillStyle='#8a6b45'; for(var yy=14;yy<256;yy+=20){ for(var xx=14;xx<256;xx+=20){ c.beginPath(); c.arc(xx,yy,3,0,7); c.fill(); } } })();
    var pegTex=new T.CanvasTexture(pegCan); pegTex.wrapS=pegTex.wrapT=T.RepeatWrapping; pegTex.repeat.set(4,1.4);
    var pgz=oz-9;
    var pboard=new T.Mesh(new T.BoxGeometry(0.08,3.4,9), new T.MeshStandardMaterial({map:pegTex,roughness:.85})); pboard.position.set(ox-W/2+0.09,2.4,pgz); grp.add(pboard);
    var lockRows=[['#ff2222',3.35],['#1f8fff',2.45],['#c7ced4',1.55]];
    lockRows.forEach(function(row){ for(var i=0;i<4;i++){ var lz=pgz-3+i*2; var lk=discLock(row[0], row[0]==='#c7ced4'?.85:.5); place(lk, ox-W/2+0.34, row[1], lz, Math.PI/2); } });
    lockRows.forEach(function(row){ for(var i=0;i<4;i++){ var lz=pgz-3+i*2; var pg=new T.Mesh(new T.CylinderGeometry(0.02,0.02,0.18,8), mat('#555')); pg.rotation.z=Math.PI/2; pg.position.set(ox-W/2+0.22,row[1]+0.34,lz); grp.add(pg); } });
    panel(2.4,0.55, ox-W/2+0.12, 4.35, pgz, Math.PI/2, function(c,w,h){ c.fillStyle='#0f172a'; c.fillRect(0,0,w,h); c.fillStyle='#ffd23f'; c.font='bold '+Math.round(h*0.6)+'px Arial'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('DISC LOCKS', w/2, h/2); }, '#111', false);
    // ── SECOND WALL BOARD (left wall, back half) — huge LOCK HISTORY screen ──
    var hz=oz+7;
    var hbez=new T.Mesh(new T.BoxGeometry(0.26,4.7,12), new T.MeshStandardMaterial({color:'#04070b',emissive:'#00121e'})); hbez.position.set(ox-W/2+0.12,2.7,hz); grp.add(hbez);
    var hcanv=document.createElement('canvas'); hcanv.width=1024; hcanv.height=560; var htx=new T.CanvasTexture(hcanv);
    var hscr=new T.Mesh(new T.PlaneGeometry(11.4,4.35), new T.MeshBasicMaterial({map:htx})); hscr.rotation.y=Math.PI/2; hscr.position.set(ox-W/2+0.27,2.7,hz); grp.add(hscr);
    app._histScr=hscr;
    function drawHist(){
      var c=hcanv.getContext('2d'); var HW=1024,HH=560;
      c.fillStyle='#05090f'; c.fillRect(0,0,HW,HH);
      // subtle grid
      c.strokeStyle='rgba(30,80,160,0.07)'; c.lineWidth=1;
      for(var _gx2=0;_gx2<HW;_gx2+=64){c.beginPath();c.moveTo(_gx2,0);c.lineTo(_gx2,HH);c.stroke();}
      for(var _gy2=0;_gy2<HH;_gy2+=40){c.beginPath();c.moveTo(0,_gy2);c.lineTo(HW,_gy2);c.stroke();}
      // Header
      var hg=c.createLinearGradient(0,0,HW,0); hg.addColorStop(0,'#0d2145'); hg.addColorStop(1,'#0a3a6e');
      c.fillStyle=hg; c.fillRect(0,0,HW,52);
      c.fillStyle='#fff'; c.font='bold 26px "Courier New",monospace'; c.textAlign='left'; c.textBaseline='middle'; c.fillText('ADMIN ACTION LOG', 20, 27);
      var now=new Date(); c.fillStyle='#4aa3ff'; c.font='13px monospace'; c.textAlign='right'; c.fillText('LIVE  •  '+now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), HW-16, 27);
      c.fillStyle='#1a4a8a'; c.fillRect(0,52,HW,2);
      // Column headers
      c.fillStyle='rgba(74,163,255,0.12)'; c.fillRect(0,54,HW,28);
      c.fillStyle='#4aa3ff'; c.font='bold 11px monospace'; c.textAlign='left'; c.textBaseline='middle';
      c.fillText('TIME', 16, 68); c.fillText('STAFF', 160, 68); c.fillText('ACTION', 340, 68); c.fillText('UNIT', 680, 68);
      c.fillStyle='#1a3a6a'; c.fillRect(0,82,HW,1);
      // Log rows
      var log=(app._histLog||[]).filter(function(r){return r.type==='lock'||!r.type;});
      if(!log.length){
        c.fillStyle='#3a6090'; c.font='16px monospace'; c.textAlign='center'; c.textBaseline='middle';
        c.fillText('No actions logged yet.', HW/2, 300);
        c.fillStyle='#2a4060'; c.font='13px monospace'; c.fillText('Lock changes will appear here in real time.', HW/2, 330);
        htx.needsUpdate=true; return;
      }
      var y=90, rowH=34;
      var actionLabel={'flashred':'LOCKED','flashgreen':'UNLOCKED','green':'SET RENTED','blue':'RESERVED','yellow':'PENDING','purple':'READY','black':'N/A','red':'LOCKED'};
      var actionColor={'flashred':'#ff4444','flashgreen':'#3dff8a','green':'#37d67a','blue':'#4aa3ff','yellow':'#ffd23f','purple':'#c07bff','black':'#9aa6b2','red':'#ff4444'};
      var staffColor={'Kevin':'#2a6fdb','Mike':'#1f9d4d','Brad':'#9b3fcf'};
      log.slice(0,14).forEach(function(r,i){
        c.fillStyle=(i%2===0)?'#080e1c':'#060b16'; c.fillRect(0,y,HW,rowH-1);
        var d=new Date(r.t);
        var today=new Date(); var isToday=d.toDateString()===today.toDateString();
        var ds=isToday?d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):(d.getMonth()+1)+'/'+d.getDate()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
        // Time
        c.fillStyle='#5a7aa0'; c.font='13px monospace'; c.textAlign='left'; c.textBaseline='middle'; c.fillText(ds,16,y+rowH/2);
        // Staff name with color dot
        var sc=staffColor[r.who]||'#7a9abf';
        c.fillStyle=sc; c.beginPath(); c.arc(152,y+rowH/2,5,0,7); c.fill();
        c.fillStyle='#e0eaf8'; c.font='bold 15px Arial'; c.fillText(r.who||'Staff',162,y+rowH/2);
        // Action verb
        var toSt=String(r.to||'').toLowerCase(); var aLabel=actionLabel[toSt]||toSt.toUpperCase(); var aColor=actionColor[toSt]||'#8aa0c4';
        c.fillStyle=aColor; c.font='bold 14px monospace'; c.fillText(aLabel,340,y+rowH/2);
        // Unit label
        c.fillStyle='#c8d8f0'; c.font='bold 16px Arial'; c.fillText('Unit '+(r.label||'?'),680,y+rowH/2);
        y+=rowH;
      });
      htx.needsUpdate=true;
    }
    app._officeCCdrawHist=drawHist;
    // fetch the lock log — try Firebase SDK first (has auth context), then REST fallback
    function pullHist(){
      function useOverridesFallback(){
        fetch('https://storewell-3d-default-rtdb.firebaseio.com/lockOverrides.json')
          .then(function(r){return r.ok?r.json():null;})
          .then(function(ov){
            var synth=[]; var locks=app._locks||{};
            Object.keys(locks).forEach(function(k){
              var lock=locks[k]; var st=(ov&&ov[k])||'green';
              synth.push({label:lock.label||k,from:'—',to:st,who:'Current State',t:Date.now(),type:'lock'});
            });
            synth.sort(function(a,b){return (a.label||'').localeCompare(b.label||'');});
            if(synth.length>0) app._histLog=synth;
            drawHist();
          }).catch(function(){ drawHist(); });
      }
      function parseLog(d){
        if(!d||typeof d!=='object'||d.error) return null;
        var vals=Object.values(d).filter(function(v){return v&&v.t;});
        return vals.length>0?vals.sort(function(a,b){return b.t-a.t;}):null;
      }
      // Try Firebase SDK get() first — works if rules allow read with Firebase app context
      try{
        get(ref(_db,'lockLog')).then(function(snap){
          var parsed=parseLog(snap.val());
          if(parsed){ app._histLog=parsed; drawHist(); }
          else {
            // SDK returned empty — try REST API (different auth context)
            fetch('https://storewell-3d-default-rtdb.firebaseio.com/lockLog.json?orderBy=%22t%22&limitToLast=500')
              .then(function(r){return r.ok?r.json():null;})
              .then(function(d2){
                var parsed2=parseLog(d2);
                if(parsed2){ app._histLog=parsed2; drawHist(); }
                else useOverridesFallback();
              }).catch(useOverridesFallback);
          }
        }).catch(function(){
          fetch('https://storewell-3d-default-rtdb.firebaseio.com/lockLog.json')
            .then(function(r){return r.ok?r.json():null;})
            .then(function(d2){ var p=parseLog(d2); if(p){app._histLog=p;drawHist();}else useOverridesFallback(); })
            .catch(useOverridesFallback);
        });
      }catch(e){ useOverridesFallback(); }
    }
    // Draw loading state immediately, then fetch and redraw
    (function(){
      var c=hcanv.getContext('2d'); c.fillStyle='#07111f'; c.fillRect(0,0,1024,560);
      var hg=c.createLinearGradient(0,0,1024,0); hg.addColorStop(0,'#1e3a8a'); hg.addColorStop(1,'#0ea5e9'); c.fillStyle=hg; c.fillRect(0,0,1024,58);
      c.fillStyle='#fff'; c.font='bold 28px Arial'; c.textAlign='left'; c.textBaseline='middle'; c.fillText('📋  ACTIVITY LOG  —  LOCKS · EMAILS · LOGINS', 20, 30);
      c.fillStyle='#4aa3ff'; c.font='18px Arial'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('⟳  Loading activity history...', 512, 300);
      htx.needsUpdate=true;
    })();
    pullHist();
    app._officeCChistiv=setInterval(pullHist, 5000);

    // RIGHT WALL — live clock + live calendar
    panel(3.4,1.9, ox+W/2-0.12, 3.15, oz-3.5, -Math.PI/2, function(c,w,h){
      c.clearRect(0,0,w,h);
      c.fillStyle='#0b1220'; c.fillRect(0,0,w,h);
      c.strokeStyle='#1f3350'; c.lineWidth=h*0.03; c.strokeRect(h*0.04,h*0.04,w-h*0.08,h-h*0.08);
      var d=new Date(), hr=d.getHours(), mm=d.getMinutes();
      var ap=hr>=12?'PM':'AM', h12=hr%12||12;
      var t=h12+':'+String(mm).padStart(2,'0');
      c.textAlign='left'; c.textBaseline='middle';
      // Fit the big time + AM/PM inside the panel width so nothing is cut off
      var fs=h*0.46; c.font='bold '+Math.round(fs)+'px "Courier New",monospace';
      while(c.measureText(t).width > w*0.60 && fs>12){ fs-=2; c.font='bold '+Math.round(fs)+'px "Courier New",monospace'; }
      var apFs=Math.round(h*0.2); var apStr=' '+ap;
      var tw=c.measureText(t).width;
      c.save(); c.font='bold '+apFs+'px Arial'; var apw=c.measureText(apStr).width; c.restore();
      var startX=(w-(tw+apw))/2;
      c.fillStyle='#2ee6a6'; c.font='bold '+Math.round(fs)+'px "Courier New",monospace';
      c.shadowColor='#2ee6a6'; c.shadowBlur=h*0.05; c.fillText(t, startX, h*0.4); c.shadowBlur=0;
      c.fillStyle='#7fe9ff'; c.font='bold '+apFs+'px Arial'; c.fillText(apStr, startX+tw, h*0.42);
      var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      var mons=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      c.textAlign='center';
      c.fillStyle='#9fb3c8'; c.font='bold '+Math.round(h*0.14)+'px Arial';
      c.fillText(days[d.getDay()]+', '+mons[d.getMonth()]+' '+d.getDate(), w/2, h*0.78);
    }, '#2a2018', true);
    panel(2.5,2.9, ox+W/2-0.12, 2.5, oz+3.5, -Math.PI/2, function(c,w,h){
      var d=new Date(), yr=d.getFullYear(), mo=d.getMonth(), today=d.getDate();
      var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
      c.fillStyle='#ffffff'; c.fillRect(0,0,w,h);
      c.fillStyle='#9a3b30'; c.fillRect(0,0,w,h*0.16);
      c.fillStyle='#fff'; c.font='bold '+Math.round(h*0.07)+'px Arial'; c.textAlign='center'; c.textBaseline='middle';
      c.fillText(months[mo]+' '+yr, w/2, h*0.08);
      var dd=['S','M','T','W','T','F','S'], gx=w*0.04, gw=w*0.92, cw2=gw/7, top=h*0.2, rowH=(h*0.76)/7;
      c.fillStyle='#9a3b30'; c.font='bold '+Math.round(rowH*0.46)+'px Arial';
      for(var i=0;i<7;i++) c.fillText(dd[i], gx+cw2*(i+0.5), top+rowH*0.5);
      var first=new Date(yr,mo,1).getDay(), dim=new Date(yr,mo+1,0).getDate(), day=1;
      for(var row=1;row<7&&day<=dim;row++){ for(var col=0;col<7;col++){ var idx=(row-1)*7+col; if(idx<first||day>dim) continue; var xp=gx+cw2*(col+0.5), yp=top+rowH*(row+0.5); if(day===today){ c.fillStyle='#22c55e'; c.beginPath(); c.arc(xp,yp,rowH*0.42,0,7); c.fill(); c.fillStyle='#fff'; } else c.fillStyle='#2a3644'; c.font=(day===today?'bold ':'')+Math.round(rowH*0.44)+'px Arial'; c.fillText(String(day),xp,yp); day++; } }
    }, '#2a2018', false);

    // BACK WALL — real floor-standing bookshelves (flanking the picture) + a branded picture
    function sp(m,x,y,z){ m.position.set(x,y,z); return m; }
    var BOOKPAL=['#1e3a8a','#8f2d2d','#1f6b3a','#b5892a','#5b2a86','#c05621','#0e7490','#7c2d4d','#334155','#0d9488','#9d174d','#166534','#b91c1c'];
    function rnd(i){ var v=Math.sin(i*12.9898)*43758.5453; return v-Math.floor(v); }
    function fillBooks(g4,y,zoneH,wd,seed){
      var x=-wd/2+0.26, i=seed;
      while(x < wd/2-0.26){
        var r=rnd(i), r2=rnd(i*1.7+3);
        if(r2>0.85 && x < wd/2-1.0){ // occasional horizontal stack
          var n=2+Math.floor(r*2), sw=0.6+r*0.18;
          for(var s=0;s<n;s++){ g4.add(sp(new T.Mesh(new T.BoxGeometry(sw,0.085,0.42),mat(BOOKPAL[(i+s)%BOOKPAL.length],{roughness:.85})), x+sw/2, y+0.09+s*0.085, 0)); }
          x+=sw+0.12; i+=2; continue;
        }
        var w=0.1+r*0.13, h=Math.min(zoneH-0.14, 0.6+r2*0.3), lean=(r>0.9)?0.26:0;
        var bk=new T.Mesh(new T.BoxGeometry(w,h,0.44), mat(BOOKPAL[i%BOOKPAL.length],{roughness:.82}));
        bk.position.set(x+w/2+(lean?0.05:0), y+0.035+h/2, 0); bk.rotation.z=lean; g4.add(bk);
        x+=w+0.012; i++;
      }
    }
    function bookshelf(cx,seed){
      var g4=new T.Group(); var woodM=mat('#6b4f34',{roughness:.55}), woodD=mat('#5a4128',{roughness:.55});
      var wd=4.0, dp=0.6, ht=3.9, zc=oz+D/2-0.42;
      g4.add(sp(new T.Mesh(new T.BoxGeometry(0.12,ht,dp),woodD),-wd/2,ht/2,0));
      g4.add(sp(new T.Mesh(new T.BoxGeometry(0.12,ht,dp),woodD), wd/2,ht/2,0));
      g4.add(sp(new T.Mesh(new T.BoxGeometry(wd,ht,0.06),woodM),0,ht/2,-dp/2+0.03));
      g4.add(sp(new T.Mesh(new T.BoxGeometry(wd+0.14,0.12,dp+0.04),woodD),0,ht,0)); // top cap
      var lv=[0.06,1.14,2.22,3.3]; lv.forEach(function(y){ g4.add(sp(new T.Mesh(new T.BoxGeometry(wd,0.07,dp),woodM),0,y,0)); });
      // rows of standing books on each shelf (varied heights, colors; a few leaning + a stack)
      fillBooks(g4, lv[0], 1.08, wd, seed);
      fillBooks(g4, lv[1], 1.08, wd, seed+20);
      fillBooks(g4, lv[2], 1.08, wd, seed+40);
      // top zone: a few short books + a small potted plant as decor
      fillBooks(g4, lv[3], 0.58, wd*0.6, seed+60);
      var pot=new T.Mesh(new T.CylinderGeometry(0.16,0.12,0.24,12), mat('#c05621',{roughness:.7})); pot.position.set(wd/2-0.6,lv[3]+0.16,0); g4.add(pot);
      var plnt=new T.Mesh(new T.SphereGeometry(0.26,10,8), mat('#1f8f4d',{roughness:.8})); plnt.position.set(wd/2-0.6,lv[3]+0.42,0); plnt.scale.set(1,1.25,1); g4.add(plnt);
      g4.position.set(cx,0,zc); g4.rotation.y=Math.PI; g4.traverse(function(o){ if(o.isMesh){ o.castShadow=true; o.receiveShadow=true; } }); grp.add(g4); return g4;
    }
    bookshelf(ox-8.5, 1); bookshelf(ox+8.5, 137);
    // Brad's night at Iggy's Diner — real framed photo
    photoPanel(4.6,1.66, ox, 3.55, oz+D/2-0.12, Math.PI, '/img/limo.jpg', '#2a2018');
    panel(3.4,0.5, ox, 4.6, oz+D/2-0.11, Math.PI, function(c,w,h){
      var g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#123a6b'); g.addColorStop(1,'#0b2547'); c.fillStyle=g; c.fillRect(0,0,w,h);
      c.strokeStyle='#ffd23f'; c.lineWidth=Math.max(2,h*0.07); c.strokeRect(c.lineWidth,c.lineWidth,w-2*c.lineWidth,h-2*c.lineWidth);
      var t="IGGY'S — THE CREW", fs=Math.round(h*0.5); c.font='bold '+fs+"px 'Segoe UI',Arial";
      while(c.measureText(t).width>w*0.88 && fs>6){ fs--; c.font='bold '+fs+"px 'Segoe UI',Arial"; }
      c.fillStyle='#ffd23f'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(t, w/2, h/2+1);
    }, '#241a12', false);
    // ── Lounge area under the picture: couch + accent pillows + coffee table + vibrant rug ──
    (function(){
      var cz=oz+D/2-1.5;
      // layered vibrant area rug
      var rugC=oz+D/2-2.5;
      grp.add(sp(new T.Mesh(new T.BoxGeometry(6.4,0.04,4.6),mat('#2563eb',{roughness:.9})),ox,0.035,rugC));
      grp.add(sp(new T.Mesh(new T.BoxGeometry(5.5,0.05,3.7),mat('#f4a72c',{roughness:.9})),ox,0.05,rugC));
      grp.add(sp(new T.Mesh(new T.BoxGeometry(4.4,0.06,2.7),mat('#2f74c8',{roughness:.9})),ox,0.062,rugC));
      // couch (back to the wall, facing into the room)
      var couch=new T.Group(); var frameM=mat('#1d4ed8',{roughness:.7}), cushM=mat('#3b82f6',{roughness:.78});
      couch.add(sp(new T.Mesh(new T.BoxGeometry(4.4,0.45,1.4),frameM),0,0.33,0));
      for(var s=-1;s<=1;s++){ couch.add(sp(new T.Mesh(new T.BoxGeometry(1.34,0.28,1.2),cushM),s*1.42,0.63,-0.02)); couch.add(sp(new T.Mesh(new T.BoxGeometry(1.34,0.8,0.28),cushM),s*1.42,0.98,0.52)); }
      couch.add(sp(new T.Mesh(new T.BoxGeometry(0.34,0.92,1.4),frameM),-2.2,0.62,0)); couch.add(sp(new T.Mesh(new T.BoxGeometry(0.34,0.92,1.4),frameM),2.2,0.62,0));
      var pw1=sp(new T.Mesh(new T.BoxGeometry(0.52,0.52,0.18),mat('#f59e0b',{roughness:.8})),-1.0,0.82,0.34); pw1.rotation.z=0.22; couch.add(pw1);
      var pw2=sp(new T.Mesh(new T.BoxGeometry(0.52,0.52,0.18),mat('#a855f7',{roughness:.8})),1.1,0.82,0.34); pw2.rotation.z=-0.22; couch.add(pw2);
      [-2.0,2.0].forEach(function(x){[-0.55,0.55].forEach(function(z){ couch.add(sp(new T.Mesh(new T.CylinderGeometry(0.06,0.06,0.2,10),mat('#111')),x,0.1,z)); });});
      couch.position.set(ox,0,cz); couch.traverse(function(o){ if(o.isMesh){ o.castShadow=true; o.receiveShadow=true; } }); grp.add(couch);
      // coffee table in front of the couch
      var ct=new T.Group(); ct.add(sp(new T.Mesh(new T.BoxGeometry(2.2,0.12,1.0),mat('#6b4f34',{roughness:.45})),0,0.55,0));
      ct.add(sp(new T.Mesh(new T.BoxGeometry(2.0,0.05,0.85),mat('#8a6a3f',{roughness:.5})),0,0.48,0));
      [[-0.95,-0.4],[0.95,-0.4],[-0.95,0.4],[0.95,0.4]].forEach(function(p){ ct.add(sp(new T.Mesh(new T.BoxGeometry(0.1,0.55,0.1),mat('#3a2c1c')),p[0],0.27,p[1])); });
      ct.position.set(ox,0,oz+D/2-3.4); ct.traverse(function(o){ if(o.isMesh){ o.castShadow=true; } }); grp.add(ct);
    })();

    // FRONT WALL — two small framed photos flanking the command screen
    function photoFrame(x){ panel(1.7,1.2, x, 3.6, oz-D/2+0.12, 0, function(c,w,h){ c.fillStyle='#6b7f8f'; c.fillRect(0,0,w,h); c.fillStyle='#e8eef3'; for(var r=0;r<3;r++)for(var q=0;q<4;q++){ c.fillRect(w*(0.08+q*0.23),h*(0.12+r*0.28),w*0.17,h*0.2);} c.fillStyle='#9a3b30'; c.fillRect(0,h*0.86,w,h*0.14); }, '#2a2018', false); }
    photoFrame(ox-6.6); photoFrame(ox+6.6);

    // Corner potted plant + a filing cabinet, for office feel
    var pot=new T.Mesh(new T.CylinderGeometry(0.28,0.22,0.5,14), mat('#8a5a3c')); pot.position.set(ox-W/2+0.7,0.25,oz+D/2-0.9); grp.add(pot);
    var leaf=new T.Mesh(new T.SphereGeometry(0.5,10,10), mat('#2f7d3f',{roughness:.9})); leaf.scale.set(1,1.3,1); leaf.position.set(ox-W/2+0.7,1.0,oz+D/2-0.9); grp.add(leaf);
    var cab=new T.Mesh(new T.BoxGeometry(1.1,1.9,1.0), mat('#4a5560',{metalness:.3})); cab.position.set(ox+W/2-0.9,0.95,oz+D/2-1.1); grp.add(cab);
    for(var i=0;i<3;i++){ var dr=new T.Mesh(new T.BoxGeometry(0.9,0.05,0.04), mat('#2c343d')); dr.position.set(ox+W/2-0.9,0.5+i*0.55,oz+D/2-1.6); grp.add(dr); }

    if(_tickers.length){ app._officeCCclock=setInterval(function(){ _tickers.forEach(function(f){ try{ f(); }catch(e){} }); }, 1000); }

    // ── EXIT door (right wall) — walk into it to leave to the office in the yard ──
    var _dw=2.6, _dh=3.4, _drx=ox+W/2;
    var dfr=new T.Mesh(new T.BoxGeometry(0.36,_dh+0.4,_dw+0.4), mat('#241a12')); dfr.position.set(_drx-0.02,_dh/2,oz); grp.add(dfr);
    var dpn=new T.Mesh(new T.BoxGeometry(0.16,_dh,_dw), mat('#7a5a34',{roughness:.6})); dpn.position.set(_drx-0.22,_dh/2,oz); grp.add(dpn);
    var dhb=new T.Mesh(new T.CylinderGeometry(0.05,0.05,0.42,10), mat('#e6cf85',{metalness:.6,roughness:.3})); dhb.position.set(_drx-0.35,1.6,oz-0.75); grp.add(dhb);
    panel(2.3,0.62, _drx-0.14, _dh+0.55, oz, -Math.PI/2, function(c,w,h){ c.fillStyle='#0b3d1e'; c.fillRect(0,0,w,h); c.fillStyle='#3dff8a'; c.font='bold '+Math.round(h*0.52)+'px Arial'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('EXIT  →', w/2, h/2); }, '#111', false);
    var pad=new T.Mesh(new T.PlaneGeometry(2.6,2.2), new T.MeshBasicMaterial({color:'#2dff85',transparent:true,opacity:.28})); pad.rotation.x=-Math.PI/2; pad.position.set(_drx-1.6,0.06,oz); grp.add(pad);
    app.scene.add(grp);
    app._officeCC={cv:cv,tx:tx,grp:grp,scr:scr,hits:[]};
    function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
    function draw(){
      var c=cv.getContext('2d'); var W=1024,H=471;
      // ── STARSHIP DECK PLATING ──
      c.fillStyle='#050a14'; c.fillRect(0,0,W,H);
      c.save(); c.strokeStyle='rgba(20,45,80,0.25)'; c.lineWidth=1;
      for(var _hx=-H;_hx<W+H;_hx+=20){c.beginPath();c.moveTo(_hx,0);c.lineTo(_hx+H,H);c.stroke();}
      c.restore();
      // outer board glow frame
      c.save(); c.shadowColor='rgba(0,140,255,0.9)'; c.shadowBlur=22;
      c.strokeStyle='rgba(0,160,255,0.75)'; c.lineWidth=4;
      (function(){c.beginPath();var fcut=14;c.moveTo(fcut,0);c.lineTo(W-fcut,0);c.lineTo(W,fcut);c.lineTo(W,H-fcut);c.lineTo(W-fcut,H);c.lineTo(fcut,H);c.lineTo(0,H-fcut);c.lineTo(0,fcut);c.closePath();c.stroke();})();
      c.restore();
      // amber corner brackets
      (function(){ c.strokeStyle='#c88418'; c.lineWidth=3; var s=14;
        [[2,2,1,1],[W-2,2,-1,1],[W-2,H-2,-1,-1],[2,H-2,1,-1]].forEach(function(p){
          c.beginPath();c.moveTo(p[0]+p[2]*s,p[1]);c.lineTo(p[0],p[1]);c.lineTo(p[0],p[1]+p[3]*s);c.stroke();});
      })();
      var locks=app._locks||{}, cnt={}, total=0;
      Object.keys(locks).forEach(function(k){ var s=app._statusOf?app._statusOf(locks[k].label):'green'; cnt[s]=(cnt[s]||0)+1; total++; });
      var hits=[];
      function lg(x,y,h,a,b){ var g=c.createLinearGradient(x,y,x,y+h); g.addColorStop(0,a); g.addColorStop(1,b); return g; }
      function shadow(on){ if(on){ c.shadowColor='rgba(0,0,0,.75)'; c.shadowBlur=14; c.shadowOffsetY=5; } else { c.shadowColor='transparent'; c.shadowBlur=0; c.shadowOffsetY=0; } }
      // ── CUT-CORNER path (octagonal industrial panel) ──
      function cutPath(x,y,w,h,cut){ cut=cut||9; c.beginPath(); c.moveTo(x+cut,y); c.lineTo(x+w-cut,y); c.lineTo(x+w,y+cut); c.lineTo(x+w,y+h-cut); c.lineTo(x+w-cut,y+h); c.lineTo(x+cut,y+h); c.lineTo(x,y+h-cut); c.lineTo(x,y+cut); c.closePath(); }
      // ── ARMOR PANEL: thick colored octagonal border + dark body ──
      function armorPanel(x,y,w,h,accent,dA,dB){ dA=dA||'#08111e'; dB=dB||'#040a14'; var cut=Math.min(10,Math.floor(h*0.22)); var bi=3,ci=Math.max(2,cut-bi); c.shadowColor=accent; c.shadowBlur=16; cutPath(x,y,w,h,cut); c.fillStyle=accent; c.fill(); c.shadowColor='transparent'; c.shadowBlur=0; cutPath(x+bi,y+bi,w-bi*2,h-bi*2,ci); c.fillStyle=lg(x,y,h,dA,dB); c.fill(); c.save(); cutPath(x+bi,y+bi,w-bi*2,(h-bi*2)*0.48,ci); c.fillStyle='rgba(255,255,255,0.06)'; c.fill(); c.restore(); var ldx=x+w-10,ldy=y+9,ldr=3.5; var rg2=c.createRadialGradient(ldx-1,ldy-1,0.5,ldx,ldy,ldr); rg2.addColorStop(0,'#fff'); rg2.addColorStop(0.45,accent); rg2.addColorStop(1,'rgba(0,0,0,0)'); c.beginPath();c.arc(ldx,ldy,ldr,0,7);c.fillStyle=rg2;c.fill(); c.strokeStyle='rgba(255,255,255,0.10)'; c.lineWidth=1; c.beginPath();c.moveTo(x+bi+ci+4,y+h-bi-5);c.lineTo(x+w-bi-ci-4,y+h-bi-5);c.stroke(); }
      // glossy 3D circle
      function orb(cx,cy,r,a,b){ shadow(true); var g=c.createRadialGradient(cx-r*0.35,cy-r*0.42,r*0.15,cx,cy,r); g.addColorStop(0,a); g.addColorStop(1,b); c.beginPath();c.arc(cx,cy,r,0,7);c.fillStyle=g;c.fill(); shadow(false); c.beginPath();c.ellipse(cx,cy-r*0.42,r*0.6,r*0.3,0,0,7);c.fillStyle='rgba(255,255,255,.30)';c.fill(); c.lineWidth=Math.max(1,r*0.05);c.strokeStyle='rgba(255,255,255,.35)';c.beginPath();c.arc(cx,cy,r-c.lineWidth,0,7);c.stroke(); }
      // ---- white vector icons (cx,cy center, k≈size) ----
      function iLock(cx,cy,k,open){ c.save(); c.strokeStyle='#fff'; c.fillStyle='#fff'; c.lineCap='round'; var bw=k*0.9,bh=k*0.64,by=cy-bh*0.12; c.lineWidth=k*0.15; c.beginPath(); if(open){ c.arc(cx-k*0.02,by-k*0.06,k*0.3,Math.PI*0.86,Math.PI*2.02); } else { c.arc(cx,by-k*0.06,k*0.3,Math.PI,0); } c.stroke(); rr(c,cx-bw/2,by,bw,bh,k*0.13); c.fill(); c.fillStyle='rgba(0,0,0,.30)'; c.beginPath();c.arc(cx,by+bh*0.46,k*0.09,0,7);c.fill(); c.fillRect(cx-k*0.035,by+bh*0.46,k*0.07,k*0.17); c.restore(); }
      function iX(cx,cy,k){ c.save();c.strokeStyle='#fff';c.lineWidth=k*0.18;c.lineCap='round';c.beginPath();c.moveTo(cx-k*0.3,cy-k*0.3);c.lineTo(cx+k*0.3,cy+k*0.3);c.moveTo(cx+k*0.3,cy-k*0.3);c.lineTo(cx-k*0.3,cy+k*0.3);c.stroke();c.restore(); }
      function iStar(cx,cy,k){ c.save();c.fillStyle='#fff';c.beginPath();for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rd=(i%2===0)?k*0.42:k*0.18,px=cx+Math.cos(a)*rd,py=cy+Math.sin(a)*rd;if(i===0)c.moveTo(px,py);else c.lineTo(px,py);}c.closePath();c.fill();c.restore(); }
      function iCheck(cx,cy,k){ c.save();c.strokeStyle='#fff';c.lineWidth=k*0.17;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(cx-k*0.3,cy+k*0.03);c.lineTo(cx-k*0.05,cy+k*0.27);c.lineTo(cx+k*0.34,cy-k*0.25);c.stroke();c.restore(); }
      function iClock(cx,cy,k){ c.save();c.strokeStyle='#fff';c.lineWidth=k*0.11;c.beginPath();c.arc(cx,cy,k*0.36,0,7);c.stroke();c.lineCap='round';c.beginPath();c.moveTo(cx,cy);c.lineTo(cx,cy-k*0.24);c.moveTo(cx,cy);c.lineTo(cx+k*0.17,cy+k*0.07);c.stroke();c.restore(); }
      function iBuilding(cx,cy,k){ c.save();c.fillStyle='#fff';var bw=k*0.62,bh=k*0.76;rr(c,cx-bw/2,cy-bh/2,bw,bh,k*0.06);c.fill();c.fillStyle='rgba(0,0,0,.26)';var ww=k*0.11;for(var r2=0;r2<3;r2++){for(var q=0;q<2;q++){c.fillRect(cx-bw/2+k*0.13+q*k*0.24,cy-bh/2+k*0.12+r2*k*0.2,ww,ww);}}c.fillStyle='rgba(0,0,0,.30)';c.fillRect(cx-k*0.06,cy+bh/2-k*0.2,k*0.12,k*0.2);c.restore(); }
      function iPeople(cx,cy,k){ c.save();c.fillStyle='#fff';function fig(dx,dy,s){c.beginPath();c.arc(cx+dx,cy+dy-s*0.2,s*0.19,0,7);c.fill();c.beginPath();rr(c,cx+dx-s*0.25,cy+dy+s*0.02,s*0.5,s*0.4,s*0.16);c.fill();}fig(-k*0.32,k*0.04,k*0.7);fig(k*0.32,k*0.04,k*0.7);fig(0,-k*0.05,k*0.92);c.restore(); }
      function iWalk(cx,cy,k){ c.save();c.fillStyle='#fff';c.strokeStyle='#fff';c.lineWidth=k*0.13;c.lineCap='round';c.lineJoin='round';c.beginPath();c.arc(cx,cy-k*0.36,k*0.13,0,7);c.fill();c.beginPath();c.moveTo(cx+k*0.02,cy-k*0.2);c.lineTo(cx-k*0.02,cy+k*0.08);c.lineTo(cx-k*0.2,cy+k*0.34);c.moveTo(cx-k*0.02,cy+k*0.08);c.lineTo(cx+k*0.18,cy+k*0.3);c.moveTo(cx+k*0.0,cy-k*0.12);c.lineTo(cx-k*0.2,cy-k*0.02);c.moveTo(cx+k*0.0,cy-k*0.12);c.lineTo(cx+k*0.18,cy-k*0.06);c.stroke();c.restore(); }
      function iMag(cx,cy,k,col){ c.save();c.strokeStyle=col;c.lineWidth=k*0.13;c.lineCap='round';c.beginPath();c.arc(cx-k*0.05,cy-k*0.05,k*0.24,0,7);c.stroke();c.beginPath();c.moveTo(cx+k*0.14,cy+k*0.14);c.lineTo(cx+k*0.32,cy+k*0.32);c.stroke();c.restore(); }
      function iGear(cx,cy,k,col){ c.save();c.fillStyle=col;var teeth=8,ro=k*0.34,ri=k*0.24;c.beginPath();for(var i=0;i<teeth*2;i++){var a=i*Math.PI/teeth,rd=(i%2===0)?ro:ri;var px=cx+Math.cos(a)*rd,py=cy+Math.sin(a)*rd;if(i===0)c.moveTo(px,py);else c.lineTo(px,py);}c.closePath();c.fill();c.fillStyle='#fff';c.beginPath();c.arc(cx,cy,k*0.12,0,7);c.fill();c.restore(); }
      function icon(name,cx,cy,k){ if(name==='lockon')iLock(cx,cy,k,false); else if(name==='lockoff')iLock(cx,cy,k,true); else if(name==='x')iX(cx,cy,k); else if(name==='star')iStar(cx,cy,k); else if(name==='check')iCheck(cx,cy,k); else if(name==='clock')iClock(cx,cy,k); else if(name==='building')iBuilding(cx,cy,k); else if(name==='people')iPeople(cx,cy,k); }
      var mx=12;
      function tileBox(x,y,w,h,bg,brd){ shadow(true); rr(c,x,y,w,h,14); c.fillStyle=bg; c.fill(); shadow(false); c.lineWidth=1.5; c.strokeStyle=brd; c.stroke(); }
      var fOn=(app._officeCCflashOn!==false);
      function glossy(x,y,w,h,a,b,r){ armorPanel(x,y,w,h,a); }
      function flashCol(st){ if(st==='flashred') return fOn?['#ff5a45','#cc180a']:['#8a140b','#4e0a05']; if(st==='flashgreen') return fOn?['#48f08e','#00a848']:['#0c5a2e','#06381d']; return null; }
      // status color/label maps (shared by dashboard + unit editing screens)
      var SC={green:'#1f9d4d',red:'#cc2b2b',flashred:'#ff2a1a',flashgreen:'#00b34a',blue:'#2a6fdb',yellow:'#e0a81e',purple:'#8a2fc0',black:'#5b6b7d'};
      var SL={green:'Rented',red:'Late',flashred:'Lock It',flashgreen:'Lock Off',blue:'Reserved',yellow:'No Lock',purple:'Ready',black:'N/A'};
      var cc=app._officeCC; if(!cc.view) cc.view='dash';
      // ---- HEADER: dark panel with bright title + sector info ----
      var _hcut=8;
      c.shadowColor='rgba(0,0,0,.8)'; c.shadowBlur=14; c.shadowOffsetY=4;
      cutPath(8,6,1008,52,_hcut); c.fillStyle=lg(8,6,52,'#0d1828','#060e1c'); c.fill();
      c.shadowColor='transparent'; c.shadowBlur=0; c.shadowOffsetY=0;
      c.strokeStyle='rgba(0,140,230,0.55)'; c.lineWidth=2; cutPath(8,6,1008,52,_hcut); c.stroke();
      c.fillStyle='rgba(200,132,26,0.80)'; c.fillRect(8+_hcut,6,1008-_hcut*2,3);
      c.fillStyle='rgba(0,200,215,0.50)'; c.fillRect(8+_hcut,55,1008-_hcut*2,2);
      // logo badge
      c.shadowColor='rgba(0,140,255,0.8)'; c.shadowBlur=10;
      c.beginPath();c.arc(34,32,16,0,7);c.fillStyle='#0a1e38';c.fill();
      c.strokeStyle='rgba(0,160,255,0.8)';c.lineWidth=2;c.beginPath();c.arc(34,32,16,0,7);c.stroke();
      c.shadowColor='transparent';c.shadowBlur=0;
      c.fillStyle='#ffd233';c.font='bold 16px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('⚡',34,33);
      // title
      c.save(); c.shadowColor='rgba(0,200,255,0.6)'; c.shadowBlur=6;
      c.fillStyle='#ffffff'; c.font='bold 20px Arial'; c.textAlign='left'; c.textBaseline='middle';
      c.fillText(cc.view==='dash'?'STOREWELL COMMAND CENTER':(cc.view==='unit'?('UNIT '+cc.sel):('UNITS · '+(SL[cc.filter]||'All').toUpperCase())),58,30);
      c.restore();
      // sector sub-text
      if(cc.view==='dash'){ c.fillStyle='rgba(120,170,210,0.65)'; c.font='9px Arial'; c.textAlign='left'; c.textBaseline='middle'; c.fillText('SECTOR 7 · STORAGE DIVISION  |  UNIT KEYS & WORLDS MOVING',58,46); }
      function hdrBtn(x,w,drawIcon,label,act){ c.shadowColor='rgba(0,120,220,0.8)'; c.shadowBlur=10; rr(c,x,18,w,30,15); c.fillStyle='#1050a0'; c.fill(); c.shadowColor='transparent';c.shadowBlur=0; c.strokeStyle='rgba(80,160,255,0.8)';c.lineWidth=1.5; rr(c,x,18,w,30,15); c.stroke(); drawIcon(x+18,33); c.fillStyle='#ffffff'; c.font='bold 13px Arial'; c.textAlign='left'; c.textBaseline='middle'; c.fillText(label,x+34,34); hits.push({x:x-6,y:10,w:w+12,h:48,action:act}); }
      if(cc.view==='dash'){
        hdrBtn(724,150,function(cx,cy){iMag(cx,cy,26,'#243447');},'FIND UNIT','find');
        hdrBtn(884,124,function(cx,cy){iGear(cx,cy,24,'#5a6b7d');},'GEAR','gear');
      } else {
        // BACK button
        shadow(true); rr(c,842,20,166,30,15); c.fillStyle='#ffffff'; c.fill(); shadow(false);
        c.fillStyle='#243447'; c.font='bold 15px Arial'; c.textAlign='left'; c.textBaseline='middle'; c.fillText('‹  BACK',884,36); iX(866,35,20); c.fillStyle='#243447';
        hits.push({x:836,y:12,w:184,h:46,action:'back'});
      }

      if(cc.view==='dash'){
      // Row 1: 4 bright glossy tiles (tap a tile to see & edit those units)
      var r1y=66, r1h=56, g=8, w4=(W-2*mx-3*g)/4;
      function statTile(x,y,w,h,gA,gB,ic,val,lbl,filt,st){ var fc=st?flashCol(st):null; if(fc){gA=fc[0];gB=fc[1];} armorPanel(x,y,w,h,gA,'#08111e','#040a14'); icon(ic,x+28,y+h/2,20); c.save(); c.shadowColor=gA; c.shadowBlur=12; c.fillStyle='#ffffff'; c.textAlign='left'; c.textBaseline='middle'; c.font='bold 28px Arial'; c.fillText(String(val),x+56,y+h/2-5); c.restore(); c.fillStyle='rgba(190,220,240,0.90)'; c.font='bold 9px Arial'; c.textAlign='left'; c.textBaseline='top'; c.fillText(lbl,x+56,y+h/2+6); if(filt) hits.push({x:x,y:y,w:w,h:h,open:filt}); }
      statTile(mx+0*(w4+g),r1y,w4,r1h,'#b45ee0','#7a2db0','people',total,'TOTAL UNITS','all');
      statTile(mx+1*(w4+g),r1y,w4,r1h,'#5fd35b','#2f9e2f','building',cnt.green||0,'RENTED','green');
      statTile(mx+2*(w4+g),r1y,w4,r1h,'#9aa6b3','#5b6b7d','x',cnt.black||0,'OUT OF SERVICE','black');
      statTile(mx+3*(w4+g),r1y,w4,r1h,'#ff6a6a','#d21f1f','lockon',cnt.red||0,'LOCKED OUT','red');
      // Row 2: two big flashing action tiles — tile body opens the list, ROUTE button walks the route
      var r2y=r1y+r1h+8, r2h=92, w2=(W-2*mx-g)/2;
      function actionTile(x,ic,val,lbl,stk){ var isRed=stk==='flashred'; var fc=isRed?(fOn?['#e83828','#8a1408']:['#8a1208','#4e0805']):(fOn?['#22d86a','#0a8a3a']:['#0a6828','#053818']); armorPanel(x,r2y,w2,r2h,fc[0],'#080c18','#040810');
        c.save(); cutPath(x,r2y,w2,r2h,Math.min(10,Math.floor(r2h*0.22))); c.clip(); var sCol=isRed?'rgba(220,60,40,0.22)':'rgba(30,200,100,0.22)'; c.strokeStyle=sCol; c.lineWidth=7; for(var si=0;si<14;si++){var sx=x+w2*0.60+si*14;c.beginPath();c.moveTo(sx,r2y);c.lineTo(sx-r2h,r2y+r2h);c.stroke();} c.restore();
        icon(ic,x+46,r2y+r2h/2,36); c.save(); c.shadowColor=fc[0]; c.shadowBlur=20; c.fillStyle='#ffffff'; c.textAlign='left'; c.textBaseline='middle'; c.font='bold 48px Arial'; c.fillText(String(val),x+96,r2y+r2h/2-4); c.restore();
        c.fillStyle='rgba(200,225,240,0.88)'; c.font='bold 12px Arial'; c.textAlign='left'; c.textBaseline='top'; c.fillText(lbl,x+96,r2y+r2h/2+12);
        var bw=74,bh=62,bx=x+w2-bw-12,by=r2y+(r2h-bh)/2; armorPanel(bx,by,bw,bh,'#e07010','#140b04','#0c0702'); iWalk(bx+bw/2,by+bh*0.37,26); c.fillStyle='rgba(245,185,80,0.95)'; c.textAlign='center'; c.textBaseline='bottom'; c.font='bold 11px Arial'; c.fillText('ROUTE',bx+bw/2,by+bh-4);
        hits.push({x:x,y:r2y,w:w2-bw-30,h:r2h,open:stk}); hits.push({x:bx,y:by,w:bw,h:bh,status:stk}); }
      actionTile(mx,'lockon',cnt.flashred||0,'LOCK ON','flashred');
      actionTile(mx+w2+g,'lockoff',cnt.flashgreen||0,'LOCK OFF','flashgreen');
      // Row 3: 3 bright tiles
      var r3y=r2y+r2h+8, r3h=56, w3=(W-2*mx-2*g)/3;
      statTile(mx+0*(w3+g),r3y,w3,r3h,'#5aa0ea','#2f74c8','star',cnt.blue||0,'RESERVED','blue');
      statTile(mx+1*(w3+g),r3y,w3,r3h,'#ffb84d','#ef8a1a','clock',cnt.yellow||0,'PENDING','yellow');
      statTile(mx+2*(w3+g),r3y,w3,r3h,'#a86be6','#7a2db0','check',cnt.purple||0,'READY','purple');
      // Row 4: EXIT | ALERTS | INSTALL
      var r4y=r3y+r3h+8, r4h=48, w3b=(W-2*mx-2*g)/3;
      var bellOn=!!window._swBellOn;
      // EXIT
      armorPanel(mx,r4y,w3b,r4h,'#e03030','#130505','#0a0202');
      c.fillStyle='#ff8080'; c.textAlign='center'; c.textBaseline='middle'; c.font='bold 14px Arial'; c.fillText('🚪  EXIT',mx+w3b/2,r4y+r4h/2); hits.push({x:mx,y:r4y,w:w3b,h:r4h,action:'exit'});
      // ALERTS
      armorPanel(mx+w3b+g,r4y,w3b,r4h,bellOn?'#f08c1a':'#4a5060','#0e0b05','#080604');
      c.fillStyle=bellOn?'#ffd080':'rgba(160,175,195,0.75)'; c.textAlign='center'; c.textBaseline='middle'; c.font='bold 14px Arial'; c.fillText(bellOn?'🔔 ALERTS ON':'🔕 ALERTS',mx+w3b+g+w3b/2,r4y+r4h/2); hits.push({x:mx+w3b+g,y:r4y,w:w3b,h:r4h,action:'alerts'});
      // INSTALL
      var hasPWA=!!window._swInstallPrompt;
      armorPanel(mx+2*(w3b+g),r4y,w3b,r4h,hasPWA?'#00c8d7':'#2a3a50','#050e12','#030809');
      c.fillStyle=hasPWA?'#60eeff':'rgba(140,170,200,0.55)'; c.textAlign='center'; c.textBaseline='middle'; c.font='bold 14px Arial'; c.fillText('📲 INSTALL APP',mx+2*(w3b+g)+w3b/2,r4y+r4h/2); if(hasPWA) hits.push({x:mx+2*(w3b+g),y:r4y,w:w3b,h:r4h,action:'install'});
      // Save & Report — bottom RIGHT so the chair never blocks it
      var sbw=380, sbh=46, sbx=W-mx-sbw, sby=H-sbh-10;
      armorPanel(sbx,sby,sbw,sbh,'#00c8d7','#041016','#020a0e');
      c.save(); c.shadowColor='#00eeff'; c.shadowBlur=14;
      c.fillStyle='#ffffff'; c.textAlign='center'; c.textBaseline='middle'; c.font='bold 18px Arial';
      c.fillText('💾  SAVE & REPORT',sbx+sbw/2,sby+sbh/2+1); c.restore();
      hits.push({x:sbx,y:sby,w:sbw,h:sbh,action:'save'});
      }
      else if(cc.view==='units'){
        // grid of unit tiles for the chosen filter; tap a unit to edit it
        var list=Object.keys(locks).map(function(k){return {k:k,label:locks[k].label,st:app._statusOf?app._statusOf(locks[k].label):'green'};});
        if(cc.filter&&cc.filter!=='all') list=list.filter(function(u){return u.st===cc.filter;});
        list.sort(function(a,b){return a.label<b.label?-1:1;});
        var cols=8, rows=4, gap=8, top=72, botH=40, areaH=H-top-botH-8;
        var tw=(W-2*mx-(cols-1)*gap)/cols, th=(areaH-(rows-1)*gap)/rows, per=cols*rows;
        var pages=Math.max(1,Math.ceil(list.length/per)); if(cc.page>=pages)cc.page=pages-1; if(cc.page<0)cc.page=0;
        var start=cc.page*per, pageItems=list.slice(start,start+per);
        if(!pageItems.length){ c.fillStyle='#8a94a0'; c.font='bold 20px Arial'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('No units with this status ✓',W/2,H/2); }
        pageItems.forEach(function(u,i){ var cx2=mx+(i%cols)*(tw+gap), cy2=top+Math.floor(i/cols)*(th+gap);
          var fc=flashCol(u.st); var a=fc?fc[0]:SC[u.st], b=fc?fc[1]:SC[u.st]; glossy(cx2,cy2,tw,th,a,b,10);
          c.fillStyle='#fff'; c.textAlign='center';
          c.font='bold 22px Arial'; c.textBaseline='middle'; c.fillText(u.label, cx2+tw/2, cy2+th/2-6);
          c.font='bold 11px Arial'; c.fillText(SL[u.st]||u.st, cx2+tw/2, cy2+th/2+16);
          hits.push({x:cx2,y:cy2,w:tw,h:th,unit:u.label}); });
        // footer: paging + count
        var fy=H-botH+2;
        c.fillStyle='#334155'; c.font='bold 15px Arial'; c.textAlign='center'; c.textBaseline='middle';
        c.fillText(list.length+' unit'+(list.length===1?'':'s')+'  ·  tap one to change it'+(pages>1?('   (page '+(cc.page+1)+'/'+pages+')'):''), W/2, fy+14);
        if(pages>1){ shadow(true); rr(c,mx,fy,120,30,15); c.fillStyle='#e8effc'; c.fill(); shadow(false); c.fillStyle='#1f6fd6'; c.font='bold 15px Arial'; c.fillText('‹ Prev',mx+60,fy+15); hits.push({x:mx,y:fy,w:120,h:34,page:-1});
          shadow(true); rr(c,W-mx-120,fy,120,30,15); c.fillStyle='#e8effc'; c.fill(); shadow(false); c.fillStyle='#1f6fd6'; c.fillText('Next ›',W-mx-60,fy+15); hits.push({x:W-mx-120,y:fy,w:120,h:34,page:1}); }
      }
      else if(cc.view==='unit'){
        // Polished status picker — big glossy buttons, flashing dots like the doors.
        var lbl2=cc.sel, curSt=app._statusOf?app._statusOf(lbl2):'green';
        var opts=['green','red','flashred','flashgreen','blue','yellow','purple','black'];
        var cardX=150, cardW=724, cardY=70, cardH=394, hh=54;
        shadow(true); rr(c,cardX,cardY,cardW,cardH,20); c.fillStyle='#ffffff'; c.fill(); shadow(false);
        var rg=c.createLinearGradient(cardX,cardY,cardX+cardW,cardY); rg.addColorStop(0,'#FF6B6B'); rg.addColorStop(.33,'#FFD93D'); rg.addColorStop(.66,'#6BCB77'); rg.addColorStop(1,'#4D96FF');
        rr(c,cardX,cardY,cardW,hh,20); c.fillStyle=rg; c.fill();
        c.fillStyle='#fff'; c.font='bold 24px Arial'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('UNIT '+lbl2, cardX+cardW/2, cardY+hh/2);
        c.fillStyle='#8a8a8a'; c.font='bold 13px Arial'; c.textAlign='left'; c.textBaseline='middle'; c.fillText('Now: '+(SL[curSt]||curSt), cardX+22, cardY+hh+16);
        // 2 columns × 4 rows of BIG buttons
        var cols=2, rows=4, pad=18, gy=cardY+hh+30, areaW=cardW-2*pad, areaH=cardH-hh-42, cg=14, rgap=10;
        var bw=(areaW-(cols-1)*cg)/cols, bh=(areaH-(rows-1)*rgap)/rows;
        opts.forEach(function(st,i){ var bx=cardX+pad+(i%cols)*(bw+cg), by=gy+Math.floor(i/cols)*(bh+rgap), active=(st===curSt);
          var fc=flashCol(st); var dotA=fc?fc[0]:SC[st], dotB=fc?fc[1]:SC[st];
          shadow(true); rr(c,bx,by,bw,bh,bh/2); c.fillStyle=active?'#eaf4ff':'#f3f6fa'; c.fill(); shadow(false);
          if(active){ c.lineWidth=3.5; c.strokeStyle=dotA; c.stroke(); }
          var dr=bh*0.33; orb(bx+bh*0.52,by+bh/2,dr,dotA,dotB);
          c.fillStyle='#1f2a37'; c.font='bold 25px Arial'; c.textAlign='left'; c.textBaseline='middle'; c.fillText(SL[st], bx+bh*0.52+dr+16, by+bh/2);
          if(active){ c.fillStyle=dotA; c.font='bold 28px Arial'; c.textAlign='right'; c.fillText('✓', bx+bw-22, by+bh/2); }
          hits.push({x:bx,y:by,w:bw,h:bh,setstatus:{label:lbl2,st:st}});
        });
      }
      app._officeCC.hits=hits;
      tx.needsUpdate=true;
    }
    app._officeCCdraw=draw;
    app._officeCCflashOn=true;
    draw();
    // fast tick drives the flashing (Lock It / Lock Off pulse) AND keeps counts live
    app._officeCCiv=setInterval(function(){ app._officeCCflashOn=!app._officeCCflashOn; try{ draw(); }catch(e){} }, 500);
  }catch(e){}
};
window._SWMODELS={
  soldier:{url:'/models/Soldier.glb',clip:'Walk',idle:'Idle',scale:1.7,rot:Math.PI},
  robot:{url:'/models/RobotExpressive.glb',clip:'Walking',idle:'Idle',scale:0.55,rot:Math.PI},
  xbot:{url:'/models/Xbot.glb',clip:'walk',idle:'idle',fitH:1.85,rot:Math.PI},
  cesium:{url:'/models/CesiumMan.glb',clip:'walk',idle:'walk',fitH:1.85,rot:Math.PI},
  // ── Kevin's custom characters (from his own pictures) — files live in /models/, auto-sized by the universal clamp ──
  limo:{url:'/models/limo.glb',clip:'Walk',idle:'Idle',rot:Math.PI},
  police:{url:'/models/police.glb',clip:'Walk',idle:'Idle',rot:Math.PI},
  fire:{url:'/models/fire.glb',clip:'Walk',idle:'Idle',rot:Math.PI}
};
// Custom-character picker list. ready:true makes a character show up in the wardrobe.
// I flip ready:true (and drop the .glb into /models/) the moment Kevin sends each file.
window._SWJOBLIST=[
  {key:'limo',label:'Limo Driver',emoji:'🎩',ready:true},
  {key:'police',label:'Police',emoji:'👮',ready:true},
  {key:'fire',label:'Firefighter',emoji:'🚒',ready:true}
];
window._swPickModel=function(key){var ch=window._swGetChar()||{};ch.model=key;if(ch.rpm)delete ch.rpm;if(window._swSaveChar)window._swSaveChar(ch);window._swApplyLook&&window._swApplyLook();window._swShowWardrobe&&window._swShowWardrobe();};
window._swOpenRPM=function(){
  document.getElementById('sw-rpm')?.remove();
  var ov=document.createElement('div'); ov.id='sw-rpm';
  ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Character builder');
  ov.innerHTML='<div class="rpm-menu"><header><h2>Character builder</h2><button type="button" data-rpm-close aria-label="Close character builder">× Close</button></header><div class="rpm-connection" role="status">Connecting to the character builder…</div><div class="rpm-frame" hidden></div><footer><button type="button" data-rpm-back>Back to character choices</button><button type="button" data-rpm-retry hidden>Try again</button></footer></div>';
  var f=document.createElement('iframe');
  f.title='External character builder';
  f.allow='camera *; microphone *; clipboard-write';
  var status=ov.querySelector('.rpm-connection'),frame=ov.querySelector('.rpm-frame'),retry=ov.querySelector('[data-rpm-retry]'),timer;
  var builderUrl='https://demo.readyplayer.me/avatar?frameApi&bodyType=fullbody&clearCache';
  function cleanup(){clearTimeout(timer);ov.remove();window.removeEventListener('message',handler);}
  function connect(){
    clearTimeout(timer);ov.classList.remove('rpm-ready');frame.hidden=true;retry.hidden=true;status.hidden=false;status.textContent='Connecting to the character builder…';
    f.src=builderUrl;
    timer=setTimeout(function(){
      if(!ov.isConnected)return;
      status.textContent='The external character builder has not connected. You can still choose your StoreWell characters, or try the builder again.';
      retry.hidden=false;f.removeAttribute('src');
    },12000);
  }
  function handler(e){
    if(e.source!==f.contentWindow||e.origin!=='https://demo.readyplayer.me')return;
    var d; try{ d=typeof e.data==='string'?JSON.parse(e.data):e.data; }catch(_){ return; }
    if(!d||d.source!=='readyplayerme') return;
    if(d.eventName==='v1.frame.ready'){
      clearTimeout(timer);status.hidden=true;frame.hidden=false;retry.hidden=true;ov.classList.add('rpm-ready');
      try{f.contentWindow.postMessage(JSON.stringify({target:'readyplayerme',type:'subscribe',eventName:'v1.**'}),'https://demo.readyplayer.me');}catch(_){}
    }
    if(d.eventName==='v1.avatar.exported'){
      var url=d.data&&d.data.url;
      if(url){ var ch=window._swGetChar()||{}; ch.rpm=url; if(window._swSaveChar)window._swSaveChar(ch); window._swApplyLook&&window._swApplyLook(); }
      cleanup(); alert('3D avatar saved! It loads on your character now.');
    }
  }
  ov.querySelector('[data-rpm-close]').onclick=cleanup;
  ov.querySelector('[data-rpm-back]').onclick=function(){cleanup();window._swShowWardrobe();};
  retry.onclick=connect;
  ov.addEventListener('keydown',function(e){
    if(e.key==='Escape'){e.preventDefault();cleanup();}
    if(e.key==='Tab'){
      var buttons=Array.from(ov.querySelectorAll('button')).filter(function(b){return !b.hidden;}),first=buttons[0],last=buttons[buttons.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  window.addEventListener('message',handler);
  frame.appendChild(f);document.body.appendChild(ov);connect();ov.querySelector('[data-rpm-back]').focus();
};
window._swClearRPM=function(){ var ch=window._swGetChar()||{}; delete ch.rpm; if(window._swSaveChar)window._swSaveChar(ch); alert('Reverted to the built-in character. Close and reopen the app.'); };
window._swSets={fire:{shirt:'#b91c1c',pants:'#1a1a1a',shoes:'#0a0a0a',hat:'hardhat',hatColor:'#dc2626'},police:{shirt:'#1e293b',pants:'#1e293b',shoes:'#000000',hat:'cap',hatColor:'#0f172a'},ems:{shirt:'#2563eb',pants:'#1e293b',shoes:'#000000',hat:'none',hatColor:'#2563eb'},limo:{shirt:'#0a0a0a',pants:'#0a0a0a',shoes:'#0a0a0a',hat:'cap',hatColor:'#0a0a0a'},construction:{shirt:'#f59e0b',pants:'#1e293b',shoes:'#3b2a1a',hat:'hardhat',hatColor:'#f59e0b'},security:{shirt:'#1a1a1a',pants:'#1a1a1a',shoes:'#1a1a1a',hat:'cap',hatColor:'#1a1a1a'},business:{shirt:'#ffffff',pants:'#1e293b',shoes:'#1a1a1a',hat:'none',hatColor:'#1e293b'},medical:{shirt:'#14b8a6',pants:'#14b8a6',shoes:'#ffffff',hat:'none',hatColor:'#14b8a6'},mechanic:{shirt:'#475569',pants:'#475569',shoes:'#1a1a1a',hat:'cap',hatColor:'#ef4444'},manager:{shirt:'#9a3b30',pants:'#1e293b',shoes:'#1a1a1a',hat:'cap',hatColor:'#9a3b30'},rancher:{shirt:'#8b5a2b',pants:'#33405a',shoes:'#3b2a1a',hat:'cowboy',hatColor:'#6b4423'},casual:{shirt:'#22c55e',pants:'#33405a',shoes:'#ffffff',hat:'none',hatColor:'#ff6600'}};
window._swSetList=[['fire','🔥 Fire'],['police','👮 Police'],['ems','🚑 EMS'],['limo','🚗 Limo Driver'],['construction','🦺 Construction'],['security','🛡️ Security'],['business','💼 Business'],['medical','🩺 Medical'],['mechanic','🔧 Mechanic'],['manager','🏢 Manager'],['rancher','🤠 Rancher'],['none','🚫 None']];
window._swSetNick=function(v){var ch=window._swGetChar()||{};ch.nick=v;if(window._swSaveChar)window._swSaveChar(ch);window._swApplyLook&&window._swApplyLook();};
// Uniforms that bring their own headwear (so we hide the plain hat)
window._swUniHat={fire:1,ems:1,police:1,limo:1,construction:1,security:1,mechanic:1,manager:1,rancher:1};
// Build a realistic 3D uniform (coat/vest + reflective stripes + helmet/cap + gear),
// sized to a body of height H (feet at 0). Works on the built-in avatar AND the GLB bodies.
window._swUniform=function(T,name,H){
  if(!T||!name||name==='none'||name==='casual') return null;
  H=H||1.95; var g=new T.Group();
  function M(c,o){return new T.MeshStandardMaterial(Object.assign({color:c,roughness:.62,metalness:.08},o||{}));}
  function box(w,h,d,c,x,y,z,o){var m=new T.Mesh(new T.BoxGeometry(w*H,h*H,d*H),M(c,o));m.position.set((x||0)*H,(y||0)*H,(z||0)*H);g.add(m);return m;}
  function torso(color,y0,y1,rt,rb,o){var m=new T.Mesh(new T.CylinderGeometry(rt*H,rb*H,(y1-y0)*H,20),M(color,o));m.position.y=(y0+y1)/2*H;m.scale.z=0.62;g.add(m);return m;}
  function stripe(color,yF,rF){var m=new T.Mesh(new T.TorusGeometry(rF*H,0.013*H,8,26),M(color,{metalness:.45,roughness:.3,emissive:new T.Color(color),emissiveIntensity:.18}));m.rotation.x=Math.PI/2;m.scale.z=0.62;m.position.y=yF*H;g.add(m);return m;}
  function belt(color,yF,rF){var m=new T.Mesh(new T.TorusGeometry(rF*H,0.024*H,8,24),M(color,{roughness:.5}));m.rotation.x=Math.PI/2;m.scale.z=0.62;m.position.y=yF*H;g.add(m);return m;}
  function capPeak(color){var cr=new T.Mesh(new T.CylinderGeometry(0.115*H,0.128*H,0.09*H,18),M(color));cr.position.y=0.955*H;g.add(cr);var tp=new T.Mesh(new T.CylinderGeometry(0.128*H,0.128*H,0.012*H,18),M(color));tp.position.y=1.0*H;g.add(tp);var bd=new T.Mesh(new T.CylinderGeometry(0.129*H,0.129*H,0.022*H,18),M('#111'));bd.position.y=0.912*H;g.add(bd);var pk=new T.Mesh(new T.BoxGeometry(0.21*H,0.02*H,0.12*H),M('#111'));pk.position.set(0,0.908*H,0.15*H);g.add(pk);}
  function badge(color,yF){box(0.05,0.06,0.012,color,-0.06,yF,0.12,{metalness:.7,roughness:.3});}
  function tie(color){box(0.03,0.2,0.012,color,0,0.7,0.125,{roughness:.5});box(0.045,0.03,0.02,color,0,0.8,0.125);}
  function shirtV(color){box(0.09,0.17,0.02,color,0,0.72,0.115);}
  function shades(){box(0.16,0.032,0.02,'#0a0a0a',0,0.925,0.11,{roughness:.2,metalness:.3});}
  function tank(){var t=new T.Mesh(new T.CylinderGeometry(0.055*H,0.055*H,0.32*H,12),M('#caa11a',{metalness:.4,roughness:.4}));t.position.set(0,0.66*H,-0.15*H);g.add(t);box(0.04,0.05,0.04,'#333',0,0.84,-0.15);}
  if(name==='fire'){
    torso('#c9a86a',0.5,0.84,0.17,0.19);
    stripe('#e9ff5a',0.79,0.178); stripe('#c7ccd1',0.77,0.178);
    stripe('#e9ff5a',0.56,0.19); stripe('#c7ccd1',0.545,0.19);
    tank();
    var sh=new T.Mesh(new T.SphereGeometry(0.15*H,16,10,0,Math.PI*2,0,Math.PI*0.55),M('#151515',{roughness:.4}));sh.position.y=0.93*H;g.add(sh);
    var br=new T.Mesh(new T.CylinderGeometry(0.21*H,0.21*H,0.016*H,18),M('#151515'));br.position.y=0.9*H;br.scale.z=1.18;g.add(br);
    box(0.07,0.06,0.012,'#c81e1e',0,0.945,0.19,{metalness:.3});
  } else if(name==='ems'){
    torso('#17233f',0.5,0.82,0.165,0.185);
    stripe('#8fe3ff',0.6,0.186); badge('#1e6fd0',0.74);
    box(0.05,0.07,0.03,'#111',0.075,0.75,0.11); capPeak('#17233f');
  } else if(name==='police'){
    torso('#12203a',0.5,0.82,0.165,0.185);
    badge('#e9c94a',0.75); belt('#0a0a0a',0.52,0.187); box(0.04,0.09,0.035,'#0a0a0a',0.15,0.5,0.03);
    capPeak('#12203a'); shades();
  } else if(name==='limo'){
    torso('#0b0b0d',0.5,0.84,0.17,0.19); shirtV('#f2f2f2'); tie('#0b0b0d'); capPeak('#0b0b0d'); shades();
  } else if(name==='construction'){
    torso('#c9f000',0.52,0.8,0.176,0.19,{roughness:.5});
    box(0.032,0.26,0.012,'#dfe6ea',-0.07,0.66,0.12,{metalness:.5,roughness:.3});
    box(0.032,0.26,0.012,'#dfe6ea',0.07,0.66,0.12,{metalness:.5,roughness:.3});
    stripe('#dfe6ea',0.6,0.186);
    var hh=new T.Mesh(new T.SphereGeometry(0.15*H,16,8,0,Math.PI*2,0,Math.PI*0.5),M('#f2c200'));hh.position.y=0.93*H;g.add(hh);
    var hb=new T.Mesh(new T.CylinderGeometry(0.19*H,0.19*H,0.014*H,18),M('#f2c200'));hb.position.y=0.905*H;g.add(hb);
    box(0.06,0.02,0.06,'#f2c200',0,0.955,0);
  } else if(name==='security'){
    torso('#161616',0.5,0.82,0.165,0.185); badge('#c9d2da',0.75); belt('#0a0a0a',0.52,0.187); capPeak('#161616');
  } else if(name==='medical'){
    torso('#1a9c8a',0.5,0.82,0.165,0.185); box(0.05,0.05,0.012,'#fff',-0.06,0.73,0.12);
    var stt=new T.Mesh(new T.TorusGeometry(0.075*H,0.012*H,8,20,Math.PI),M('#2b2b2b'));stt.position.set(0,0.84*H,0.03*H);g.add(stt);
  } else if(name==='mechanic'){
    torso('#54606b',0.5,0.84,0.17,0.19); box(0.07,0.045,0.012,'#c0392b',-0.06,0.74,0.12); capPeak('#c0392b');
  } else if(name==='business'){
    torso('#1e293b',0.5,0.84,0.17,0.19); shirtV('#f2f2f2'); tie('#9a3b30');
  } else if(name==='manager'){
    torso('#9a3b30',0.5,0.82,0.165,0.185); shirtV('#f2f2f2'); capPeak('#9a3b30');
  } else if(name==='rancher'){
    torso('#8b5a2b',0.5,0.82,0.165,0.185);
    var cc=new T.Mesh(new T.CylinderGeometry(0.1*H,0.12*H,0.13*H,16),M('#6b4423'));cc.position.y=0.965*H;g.add(cc);
    var cb=new T.Mesh(new T.CylinderGeometry(0.25*H,0.25*H,0.014*H,20),M('#6b4423'));cb.position.y=0.9*H;cb.scale.z=1.12;g.add(cb);
  } else { return null; }
  // The kit was tuned for the old wide block body; slim it in width/depth so it hugs the
  // realistic 3D character instead of ballooning into a barrel + drum hat.
  g.scale.set(0.55,1,0.55);
  g.traverse(function(o){ if(o.isMesh){ o.castShadow=true; o.frustumCulled=false; } });
  return g;
};
window._swWardSet=function(name){var ch=window._swGetChar()||{};ch.uniform=(name==='none'?'none':name);var s=window._swSets[name];if(s){['shirt','pants','shoes','hat','hatColor'].forEach(function(k){if(s[k]!==undefined)ch[k]=s[k];});}if(window._swSaveChar)window._swSaveChar(ch);window._swApplyLook&&window._swApplyLook();window._swShowWardrobe();};
(function(){var n=0;var iv=setInterval(function(){n++;if(window.__swApp&&window.__swApp.walker){try{window._swApplyLook&&window._swApplyLook();}catch(e){}}if(n>60)clearInterval(iv);},600);})();
