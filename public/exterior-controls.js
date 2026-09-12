
/* Bulletproof on-screen controls — built independently of React/SWNet so they ALWAYS appear
   for everyone (like the bell). Idempotent: safe to call many times. */
(function(){
  function build(){
    try{
      // ---- Speed/look PANEL (opened by the GEAR button that lives in the top toolbar) ----
      if(!document.getElementById('sw-sens-panel')){
        var saved=parseFloat(localStorage.getItem('sw_look_sens')||'0.002'); window._swLookSens=saved;
        var savedW=parseFloat(localStorage.getItem('sw_walk_spd')||'0'); if(savedW>0){ window._swWalkSpd=savedW; } else { savedW=0; }
        var savedT=parseFloat(localStorage.getItem('sw_turn_spd')||'0.006'); window._swTurnSpd=savedT;
        var panel=document.createElement('div');
        panel.id='sw-sens-panel';
        panel.style.cssText='position:fixed;top:96px;right:12px;z-index:100000;background:#ffffff;color:#1f2a33;border-radius:14px;padding:16px;width:256px;box-shadow:0 8px 30px rgba(0,0,0,.3);font:600 12px Segoe UI,Arial;display:none;';
        function _row(icon,label,id,val,min,max){return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:11px;"><span style="font-size:13px;font-weight:700;">'+icon+' '+label+'</span><input id="'+id+'" type="number" inputmode="numeric" min="'+min+'" max="'+max+'" value="'+val+'" style="width:84px;padding:10px;border-radius:9px;border:1px solid #d4dce6;background:#f1f5f9;color:#1f2a33;font-size:17px;font-weight:800;text-align:center;"></div>';}
        panel.innerHTML='<div style="font-weight:900;margin-bottom:2px;font-size:15px;">🎮 Player Controls</div><div style="font-size:10px;color:#8a93a3;margin-bottom:12px;">Set it how you like — higher = faster.</div>'
          +_row('🚶','Move Speed','sw-walk-in',(savedW>0?Math.round(savedW*500):100),20,800)
          +_row('👁','Look Speed','sw-sens-in',Math.round(saved*10000),5,100)
          +_row('↩','Turn Speed','sw-turn-in',Math.round(savedT*1000),1,60)
          +'<button id="sw-sens-save" style="width:100%;border:none;background:#00aaff;color:#fff;font:800 15px Segoe UI;padding:12px;border-radius:10px;cursor:pointer;margin-top:4px;">Save</button>';
        document.body.appendChild(panel);
        window.__swGear=function(){ panel.style.display=(panel.style.display==='none'?'block':'none'); };
        function _clamp(v,mn,mx){ v=parseFloat(v); if(isNaN(v)) v=mn; return Math.max(mn,Math.min(mx,v)); }
        document.getElementById('sw-sens-save').onclick=function(){
          var wv=_clamp(document.getElementById('sw-walk-in').value,20,800);
          var lv=_clamp(document.getElementById('sw-sens-in').value,5,100);
          var tv=_clamp(document.getElementById('sw-turn-in').value,1,60);
          window._swWalkSpd=wv/500; window._swLookSens=lv/10000; window._swTurnSpd=tv/1000;
          try{ localStorage.setItem('sw_walk_spd',wv/500); localStorage.setItem('sw_look_sens',lv/10000); localStorage.setItem('sw_turn_spd',tv/1000); }catch(e){}
          document.getElementById('sw-walk-in').value=wv; document.getElementById('sw-sens-in').value=lv; document.getElementById('sw-turn-in').value=tv;
          panel.style.display='none';
        };
      }
      // Exit Command Center — handled by sw-exit-tab in the right-side tab strip
      // ---- Clear Route / Exit route menu (only shows while a route is drawn) ----
      if(!document.getElementById('sw-clear-route')){
        var crBtn=document.createElement('button'); crBtn.id='sw-clear-route'; crBtn.textContent='✕ Clear Route';
        crBtn.style.cssText='position:fixed;bottom:88px;left:50%;transform:translateX(-50%);z-index:100000;display:none;background:#c0392b;color:#fff;border:none;border-radius:22px;padding:11px 20px;font:800 14px "Segoe UI",Arial;box-shadow:0 4px 16px rgba(0,0,0,.4);cursor:pointer;letter-spacing:.3px;-webkit-tap-highlight-color:transparent;';
        crBtn.onclick=function(){ try{ var a=window.__swApp; if(a._clearTour)a._clearTour(); if(a._marker)a._marker.visible=false; if(a._route)a._route.visible=false; var t2=document.getElementById('sw-route-toast'); if(t2)t2.remove(); }catch(e){} };
        document.body.appendChild(crBtn);
      }
    }catch(e){ /* keep retrying */ }
  }
  // Keep EXIT tab visible only when inside the Command Center room.
  function tick(){
    try{
      var a=window.__swApp;
      var exitTab=document.getElementById('sw-exit-tab');
      if(exitTab) exitTab.style.display=(a&&a._inCommandRoom&&!document.getElementById('sw-cmd-panel'))?'flex':'none';
      var cr=document.getElementById('sw-clear-route');
      if(cr){ var active=!!(a&&!window.__swDeckVisible&&(a._tour||(a._marker&&a._marker.visible))); cr.style.display=active?'block':'none'; }
    }catch(e){}
  }
  window._swMakeControls=build;
  // Build now (in case app already mounted), on load, and via a short retry burst — bulletproof.
  build();
  window.addEventListener('load', build);
  var tries=0; var iv=setInterval(function(){ build(); tries++; if(tries>20) clearInterval(iv); }, 500);
  setInterval(tick, 400);
})();
