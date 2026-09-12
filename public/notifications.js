
(function(){
  if(!('serviceWorker' in navigator)) return;
  window.addEventListener('load', function(){ navigator.serviceWorker.register('/sw.js').catch(function(){}); });
  window.addEventListener('beforeinstallprompt',function(e){ e.preventDefault(); window._swInstallPrompt=e; });
  var PUB='BMdsVeAQi5T1q696P9T6hDtV7ubKVw2Zbuv4RwYfuSpp9us_hLYZKDrjA6xCRReiH-mQtvGCBhmP6KNq4jsiAG0';
  var FB='https://storewell-3d-default-rtdb.firebaseio.com';
  // Alert types a brand-new device gets until it customizes (matches notify.js).
  var DEFAULT_PREFS={flashred:true,flashgreen:true,report:true};
  // Board colours -> label + emoji (exactly matching the lock board).
  var LBL={green:'Rented',red:'Late',blue:'Reserved',yellow:'Rented · No Lock',white:'Empty',black:'Out of Service',flashred:'Lock It',flashgreen:'Lock Off',purple:'Ready to Rent',ready:'Ready to rent',report:'Reports'};
  var EMO={green:'🟢',red:'🔴',blue:'🔵',yellow:'🟡',white:'⚪',black:'⚫',flashred:'⚡🔴',flashgreen:'⚡🟢',ready:'🔓',report:'📊',purple:'🟣'};
  // Only these statuses ever fire an alert (each phone still chooses which it wants).
  var ALERT_STATES=['flashred','flashgreen','red','green','blue','yellow','purple'];
  // Toggles shown in the "which alerts" panel, in order.
  var PANEL=['flashred','flashgreen','red','green','blue','yellow','purple','report'];

  function u8(b64){var p='='.repeat((4-b64.length%4)%4);var s=atob((b64+p).replace(/-/g,'+').replace(/_/g,'/'));var a=new Uint8Array(s.length);for(var i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return a;}
  function setBell(on){window._swBellOn=!!on;var b=document.getElementById('sw-bell');if(b){b.innerHTML='<span style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,.35));">'+(on?'🔔':'🔕')+'</span><span class="sw-glbl">'+(on?'ALERTS ON':'ALERTS')+'</span>';b.style.background=on?'linear-gradient(180deg,#f2a33c,#d9791a)':'linear-gradient(180deg,#9aa6b2,#6b7280)';b.style.boxShadow=on?'-4px 3px 10px rgba(0,0,0,.35),inset 0 2px 3px rgba(255,255,255,.55)':'-4px 3px 10px rgba(0,0,0,.35),inset 0 2px 3px rgba(255,255,255,.45)';b.title=on?'Alerts ON — tap to choose which alerts':'Tap to turn on lock & report alerts';}
    var c=document.getElementById('sw-cc-bell');
    if(c){ var sp=c.getElementsByTagName('span');
      if(sp[0]) sp[0].textContent=on?'🔔':'🔕';
      if(sp[1]) sp[1].textContent=on?'ALERTS ON':'ALERTS';
      c.title=on?'Alerts ON — tap to choose which alerts':'Tap to turn on lock & report alerts';
      c.style.background=on?'linear-gradient(180deg,#f2a33c,#d9791a)':'linear-gradient(180deg,#9aa6b2,#6b7280)';
      c.style.boxShadow=on?'0 5px 0 #a85712,0 8px 14px rgba(0,0,0,.32),inset 0 2px 3px rgba(255,255,255,.55)':'0 5px 0 #4b5563,0 8px 14px rgba(0,0,0,.32),inset 0 2px 3px rgba(255,255,255,.45)';
    }}
  function getSub(){return navigator.serviceWorker.ready.then(function(reg){return reg.pushManager.getSubscription();});}
  function subId(ep){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(ep)).then(function(d){return Array.prototype.slice.call(new Uint8Array(d),0,12).map(function(x){return x.toString(16).padStart(2,'0');}).join('');});}
  function staffName(){try{return (window.__swApp&&window.__swApp.state&&window.__swApp.state.staffName)||'';}catch(e){return '';}}

  function savePrefs(id,prefs){
    return fetch(FB+'/pushSubs/'+id+'/prefs.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(prefs)});
  }
  // Turn on alerts for this device: subscribe, save it (keeping any prefs it had), then let them choose.
  function subscribe(){
    if(!staffName()){alert('Alerts are for logged-in staff only. Log in first, then tap the bell.');return;}
      Notification.requestPermission().then(function(perm){
      if(perm!=='granted'){alert('Notifications are blocked for this site. Turn them on in your browser settings, then tap the bell again.');return;}
      return navigator.serviceWorker.ready.then(function(reg){
        return reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:u8(PUB)});
      }).then(function(sub){
        return subId(sub.endpoint).then(function(id){
          return fetch(FB+'/pushSubs/'+id+'.json').then(function(r){return r.ok?r.json():null;}).catch(function(){return null;}).then(function(existing){
            var prefs=(existing&&existing.prefs)||DEFAULT_PREFS;
            var node=sub.toJSON(); node.prefs=prefs; node.staff=staffName();
            return fetch(FB+'/pushSubs/'+id+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(node)}).then(function(resp){
              if(!resp.ok){throw new Error('save failed ('+resp.status+')');}
              setBell(true); openPanel(id,prefs);
            });
          });
        });
      });
    }).catch(function(e){alert('Could not turn on alerts: '+(e&&e.message||e));});
  }
  // Exposed so the Command Center's ALERTS button can drive it (admin-only area).
  window.__swBellTap=function(){ try{ bellTap(); }catch(e){} };
  window.__swBellRefresh=function(){ try{ getSub().then(function(s){ setBell(!!s); }).catch(function(){}); }catch(e){} };
  // Tapping the bell: if already on, open the chooser; otherwise turn it on.
  function bellTap(){ if(!staffName()){alert('Alerts are for logged-in staff only. Log in first, then tap the bell.');return;}
    getSub().then(function(sub){
      if(!sub){subscribe();return;}
      subId(sub.endpoint).then(function(id){
        fetch(FB+'/pushSubs/'+id+'.json').then(function(r){return r.ok?r.json():null;}).catch(function(){return null;}).then(function(node){
          var prefs=(node&&node.prefs)||DEFAULT_PREFS;
          // Always re-save the full subscription to Firebase (handles wiped DB, key rotation, etc.)
          var fullNode=sub.toJSON(); fullNode.prefs=prefs; fullNode.staff=staffName();
          fetch(FB+'/pushSubs/'+id+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(fullNode)}).catch(function(){});
          openPanel(id,prefs);
        });
      });
    });
  }
  // The per-device "which alerts do you want" panel.
  function openPanel(id,prefs){
    var old=document.getElementById('sw-pref-panel'); if(old) old.remove();
    prefs=prefs||{};
    // Position below the ALERTS button in the toolbar
    var bellBtn=document.getElementById('sw-bell');
    var rect=bellBtn?bellBtn.getBoundingClientRect():{top:80,right:window.innerWidth-10,bottom:80};
    var panelTop=rect.bottom+8;
    var panelRight=window.innerWidth-rect.right;
    var wrap=document.createElement('div');
    wrap.id='sw-pref-panel';
    wrap.style.cssText='position:fixed;top:'+panelTop+'px;right:'+panelRight+'px;z-index:100000;background:#fff;color:#1f2a37;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.35);padding:14px 14px 10px;width:230px;font-family:-apple-system,Segoe UI,sans-serif;';
    var h=document.createElement('div');
    h.textContent='Alerts on this phone';
    h.style.cssText='font-weight:800;font-size:14px;margin-bottom:2px;';
    var sub=document.createElement('div');
    sub.textContent='Tap the ones you want to be buzzed for.';
    sub.style.cssText='font-size:11px;color:#6b7a8d;margin-bottom:10px;';
    wrap.appendChild(h); wrap.appendChild(sub);
    PANEL.forEach(function(t){
      var row=document.createElement('label');
      row.style.cssText='display:flex;align-items:center;gap:10px;padding:7px 4px;font-size:14px;cursor:pointer;border-top:1px solid #eef1f5;';
      var cb=document.createElement('input');
      cb.type='checkbox'; cb.checked=prefs[t]===true;
      cb.style.cssText='width:20px;height:20px;flex-shrink:0;accent-color:#9a3b30;';
      cb.onchange=function(){
        prefs[t]=cb.checked;
        savePrefs(id,prefs).catch(function(){alert('Could not save that — check your connection and try again.');});
      };
      var txt=document.createElement('span');
      txt.textContent=(EMO[t]||'')+' '+(LBL[t]||t);
      row.appendChild(cb); row.appendChild(txt);
      wrap.appendChild(row);
    });
    var done=document.createElement('button');
    done.textContent='Done';
    done.style.cssText='margin-top:10px;width:100%;border:none;background:#9a3b30;color:#fff;font:700 14px Segoe UI;padding:10px;border-radius:10px;cursor:pointer;';
    done.onclick=function(){wrap.remove();};
    wrap.appendChild(done);
    document.body.appendChild(wrap);
  }

  window.addEventListener('load', function(){
    var b=document.getElementById('sw-bell');
    if(b) b.onclick=bellTap;
    // Auto-resubscribe: runs on page load AND whenever the tab becomes visible.
    // This handles VAPID key rotation — no manual refresh needed, just switch to the tab.
    function doResubscribe(){
      if(Notification.permission==='granted'){
        navigator.serviceWorker.ready.then(function(reg){
          return reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:u8(PUB)});
        }).then(function(sub){
          setBell(true);
          return subId(sub.endpoint).then(function(id){
            return fetch(FB+'/pushSubs/'+id+'.json').then(function(r){return r.ok?r.json():null;}).catch(function(){return null;}).then(function(existing){
              var prefs=(existing&&existing.prefs)||DEFAULT_PREFS;
              var node=sub.toJSON(); node.prefs=prefs; node.staff=staffName();
              return fetch(FB+'/pushSubs/'+id+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(node)});
            });
          });
        }).catch(function(){
          getSub().then(function(s){setBell(!!s);});
        });
      } else {
        getSub().then(function(s){setBell(!!s);});
      }
    }
    doResubscribe();
    // Also resubscribe when user switches back to this tab (handles already-open tabs)
    document.addEventListener('visibilitychange', function(){
      if(document.visibilityState==='visible') doResubscribe();
    });
  });

  // Test notification — sends a real push and shows who got it
  window.__swTestNotif = async function(){
    var btn = document.getElementById('sw-cc-testnotif');
    if(btn){ btn.disabled=true; btn.style.opacity='0.6'; }
    try {
      var r = await fetch('/notify',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({type:'flashgreen',title:'📡 Test Notification',body:'Push notifications are working!'})});
      var j = await r.json();
      var msg = '📡 Test Notification Sent!\n\n'
        + '✅ Delivered: ' + j.sent + ' device' + (j.sent!==1?'s':'') + '\n'
        + '❌ Failed: '    + j.failed + ' device' + (j.failed!==1?'s':'');
      if(j.failed > 0 && j.sent === 0){
        msg += '\n\n⚠️ All subscriptions failed.\nEveryone needs to refresh the app once to re-subscribe.';
      } else if(j.failed > 0){
        msg += '\n\n⚠️ Some devices failed.\nThose users should refresh the app to re-subscribe.';
      }
      alert(msg);
    } catch(e) {
      alert('❌ Could not reach /notify endpoint.\n' + e.message);
    } finally {
      if(btn){ btn.disabled=false; btn.style.opacity='1'; }
    }
  };

  // Fire a colour-matched alert whenever a lock's status changes, when a lock is
  // marked Ready, or when a report is emailed. notify.js decides who actually gets it.
  function fire(type,title,body){
    _f('/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:type,title:title,body:body||''})}).catch(function(){});
  }
  var _f=window.fetch.bind(window);
  window.fetch=function(input,init){
    var pr=_f(input,init);
    try{
      var u=typeof input==='string'?input:((input&&input.url)||'');
      var m=(init&&init.method)||(input&&input.method)||'GET';
      if(/lockOverrides\/[^\/]+\.json/.test(u)&&m==='PUT'){
        var unit=(u.match(/lockOverrides\/([^\/.]+)/)||[])[1]||'unit';
        var st=null;try{st=JSON.parse((init&&init.body)||'null');}catch(e){}
        if(typeof st==='string'&&ALERT_STATES.indexOf(st)>=0){
          var who=staffName(); var by=who?(' — by '+who):'';
          var title;
          if(st==='flashred') title='⚡🔴 LOCK IT — Unit '+unit+' needs locking';
          else if(st==='flashgreen') title='⚡🟢 LOCK OFF — Unit '+unit+' lock removed';
          else title=EMO[st]+' '+LBL[st]+' — Unit '+unit;
          pr.then(function(r){if(r&&r.ok){fire(st,title,('Unit '+unit+by));}}).catch(function(){});
        }
      } else if(u==='/email'&&m==='POST'){
        pr.then(function(r){if(r&&r.ok){fire('report','📊 StoreWell report emailed','');}}).catch(function(){});
      }
    }catch(e){}
    return pr;
  };
})();
