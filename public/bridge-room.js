/* Walkable command bridge. CSS3D keeps the same geometry available without a GPU. */
(() => {
  'use strict';
  window.__swCreateBridge = function ({deck, screen, units, status, escape, showUnit, showDialog, content, login, gear, alerts, report, exit}) {
    const T = window.THREE;
    if (!T?.CSS3DRenderer) throw new Error('3D room renderer unavailable');
    const scene = new T.Scene(); scene.scale.setScalar(100);
    const camera = new T.PerspectiveCamera(55, 1, .1, 160); camera.rotation.order = 'YXZ';
    // Keep the viewport clip outside the perspective transform. Mobile GPU
    // compositors must not project a clip mask or unbounded off-screen content.
    const roomLayer=document.createElement('div');
    Object.assign(roomLayer.style,{position:'absolute',inset:'0',overflow:'hidden',isolation:'isolate',pointerEvents:'none'});
    let renderWidth=1,renderHeight=1;
    const renderer={domElement:roomLayer,setSize(width,height){renderWidth=width;renderHeight=height;}};
    deck.querySelector('.room-ui').append(renderer.domElement);
    deck.classList.add('walkable-bridge');
    const faces = [], obstacles = [], keys = new Set();
    const joystick={id:null,x:0,y:0};
    const renderedPose={x:NaN,y:NaN,z:NaN,yaw:NaN,pitch:NaN};
    const touches=new Map();
    let pinch=null,zoom=1,suppressTapUntil=0;
    let doorOpen=false,doorReady=false,doorManual=false,doorTimer;
    let view = 'room', active = false, raf = 0, lastTime = 0, drag, yaw = 0, pitch = .04, unsubscribe, history = [], historyState = 'Connecting to saved lock history…', watched = false;
    const limitPitch = value => Math.max(-.25,Math.min(.22,value));
    const normal = new T.Vector3(), toCamera = new T.Vector3();
    const viewFrustum = new T.Frustum(), projectionView = new T.Matrix4();
    const setRoomBounds = (obj,w,h) => {
      obj.userData.roomCorners=[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]].map(([x,y])=>new T.Vector3(x,y,0).applyQuaternion(obj.quaternion).add(obj.position));
      obj.userData.roomBounds=new T.Box3().setFromPoints(obj.userData.roomCorners);
      obj.userData.roomWidth=w;obj.userData.roomHeight=h;obj.userData.inverseRotation=obj.quaternion.clone().invert();
      obj.userData.roomNormal=new T.Vector3(0,0,1).applyQuaternion(obj.quaternion);
      obj.userData.layer=document.createElement('div');
      obj.userData.layer.className='bridge-face-viewport';
      Object.assign(obj.userData.layer.style,{position:'absolute',overflow:'hidden',isolation:'isolate',pointerEvents:'none'});
      obj.userData.projection=document.createElement('div');
      obj.userData.projection.className='bridge-face-projection';
      Object.assign(obj.userData.projection.style,{position:'absolute',left:'0',top:'0',transformOrigin:'0 0',transformStyle:'flat',overflow:'hidden',contain:'paint',pointerEvents:'none'});
      obj.userData.projection.append(obj.element);
      obj.userData.layer.append(obj.userData.projection);
      obj.userData.patches=[obj.userData.projection];
      roomLayer.append(obj.userData.layer);
    };
    function clippedFace(face) {
      let polygon=face.userData.roomCorners;
      for(const plane of viewFrustum.planes){
        const clipped=[];
        for(let i=0;i<polygon.length;i++){
          const a=polygon[i],b=polygon[(i+1)%polygon.length];
          const da=plane.distanceToPoint(a),db=plane.distanceToPoint(b);
          if(da>=0)clipped.push(a);
          if((da>=0)!==(db>=0))clipped.push(a.clone().lerp(b,da/(da-db)));
        }
        polygon=clipped;if(polygon.length<3)return null;
      }
      return polygon;
    }
    const cross2=(a,b,p)=>(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x);
    function overlapPolygon(subject,clip) {
      let result=subject;
      for(let i=0;i<clip.length;i++){
        const a=clip[i],b=clip[(i+1)%clip.length],next=[];
        for(let j=0;j<result.length;j++){
          const p=result[j],q=result[(j+1)%result.length],dp=cross2(a,b,p),dq=cross2(a,b,q);
          if(dp>=-1e-9)next.push(p);
          if((dp>=0)!==(dq>=0)){const t=dp/(dp-dq);next.push({x:p.x+(q.x-p.x)*t,y:p.y+(q.y-p.y)*t});}
        }
        result=next;if(result.length<3)return null;
      }
      return result;
    }
    const signedArea=polygon=>polygon.reduce((sum,p,i)=>{const q=polygon[(i+1)%polygon.length];return sum+p.x*q.y-q.x*p.y;},0);
    // Clipping a polygon is not enough: its local bounding rectangle can still
    // cross behind the eye when the camera turns. Chrome must rasterize that
    // rectangle before the viewport clip, producing an unbounded paint surface.
    // Split only those rectangles; every painted corner stays in front of the
    // camera and each patch has at most a 2:1 perspective depth range.
    function paintPatches(polygon,depthAt) {
      const result=[];
      const split=points=>{
        const left=Math.min(...points.map(p=>p.x)),right=Math.max(...points.map(p=>p.x));
        const top=Math.min(...points.map(p=>p.y)),bottom=Math.max(...points.map(p=>p.y));
        if(right-left<1e-7||bottom-top<1e-7)return;
        const corners=[{x:left,y:top},{x:right,y:top},{x:right,y:bottom},{x:left,y:bottom}];
        const depths=corners.map(depthAt),near=Math.min(...depths),far=Math.max(...depths);
        if(near>0&&far<=near*2.01){result.push({left,top,right,bottom});return;}
        const axis=Math.abs(depths[1]-depths[0])>=Math.abs(depths[3]-depths[0])?'x':'y';
        const mid=axis==='x'?(left+right)/2:(top+bottom)/2;
        for(const sign of [-1,1]){
          const clipped=[];
          for(let i=0;i<points.length;i++){
            const a=points[i],b=points[(i+1)%points.length],da=(a[axis]-mid)*sign,db=(b[axis]-mid)*sign;
            if(da>=0)clipped.push(a);
            if((da>=0)!==(db>=0)){const t=da/(da-db);clipped.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});}
          }
          if(clipped.length>=3)split(clipped);
        }
      };
      split(polygon);return result;
    }
    function syncPaintCopies() {
      for(const face of faces){
        if(face.userData.patches.length<2)continue;
        const source=face.element,markup=source.innerHTML;
        for(const patch of face.userData.patches.slice(1)){
          const copy=patch.firstElementChild;copy.className=source.className;
          if(patch._markup!==markup){copy.innerHTML=markup;copy.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));patch._markup=markup;}
        }
      }
    }
    function paintRoom() {
      const drawing=[],matrix=new T.Matrix4();
      const focal=camera.projectionMatrix.elements[5]*renderHeight/2;
      for(const face of faces){
        const data=face.userData,layer=data.layer;
        layer.style.display=face.visible&&face.parent?'':'none';
        if(!face.visible||!face.parent)continue;
        const polygon=clippedFace(face);if(!polygon){face.visible=false;layer.style.display='none';continue;}
        const projected=polygon.map(point=>{const p=point.clone().project(camera);return {x:p.x,y:p.y};});
        if(signedArea(projected)<0)projected.reverse();
        const bounds={left:Math.min(...projected.map(p=>p.x)),right:Math.max(...projected.map(p=>p.x)),bottom:Math.min(...projected.map(p=>p.y)),top:Math.max(...projected.map(p=>p.y))};
        const screenLeft=(bounds.left+1)*renderWidth/2,screenTop=(1-bounds.top)*renderHeight/2;
        Object.assign(layer.style,{left:screenLeft+'px',top:screenTop+'px',width:(bounds.right-bounds.left)*renderWidth/2+'px',height:(bounds.top-bounds.bottom)*renderHeight/2+'px'});
        // This polygon lives in ordinary viewport pixels, never in the tilted
        // face's coordinate system. Its bounds stay finite at every camera angle.
        layer.style.clipPath='polygon('+projected.map(p=>`${((p.x+1)*renderWidth/2-screenLeft).toFixed(4)}px ${((1-p.y)*renderHeight/2-screenTop).toFixed(4)}px`).join(',')+')';
        const width=data.roomWidth*50,height=data.roomHeight*50;
        const local=polygon.map(point=>{const p=point.clone().sub(face.position).applyQuaternion(data.inverseRotation);return {x:(p.x/data.roomWidth+.5)*width,y:(.5-p.y/data.roomHeight)*height};});
        face.updateMatrix();matrix.multiplyMatrices(camera.matrixWorldInverse,face.matrix);
        const e=matrix.elements;
        const patches=paintPatches(local,p=>-(e[14]+e[2]*(p.x-width/2)+e[6]*(height/2-p.y)));
        const source=face.element,markup=patches.length>1?source.innerHTML:'';
        for(let i=0;i<patches.length;i++){
          const {left,top,right,bottom}=patches[i];
          let projection=data.patches[i],newPatch=!projection;
          if(!projection){
            projection=data.projection.cloneNode(false);projection.setAttribute('aria-hidden','true');projection.inert=true;
            const copy=source.cloneNode(true);copy.removeAttribute('id');copy.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
            projection.append(copy);data.patches.push(projection);layer.append(projection);
          }
          const patchWasHidden=projection.style.display==='none';
          projection.style.display='';projection.style.width=(right-left)+'px';projection.style.height=(bottom-top)+'px';
          const el=i?projection.firstElementChild:source;
          if(el.parentNode!==projection)projection.append(el);
          if(i){
            const spaceDelay=data.spaceWindow&&(newPatch||patchWasHidden||data.paintBecameVisible)?`${-(performance.now()-spaceEpoch)/1000}s`:el.style.getPropertyValue('--space-delay');
            el.className=source.className;el.style.cssText=source.style.cssText;
            if(projection._markup!==markup){el.innerHTML=markup;el.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));projection._markup=markup;}
            if(spaceDelay)el.style.setProperty('--space-delay',spaceDelay);
          }
          Object.assign(el.style,{display:'',left:-left+'px',top:-top+'px',transform:'none',clipPath:''});
          const originX=left-width/2,originY=height/2-top;
          const x=e[12]+e[0]*originX+e[4]*originY,y=e[13]+e[1]*originX+e[5]*originY,z=e[14]+e[2]*originX+e[6]*originY;
          const scale=50;
          const css=[e[0]*scale,-e[1]*scale,e[2]*scale,0,-e[4]*scale,e[5]*scale,-e[6]*scale,0,e[8]*scale,-e[9]*scale,e[10]*scale,0,x*scale,-y*scale,focal+z*scale,1];
          projection.style.transform=`translate(${renderWidth/2-screenLeft}px,${renderHeight/2-screenTop}px) perspective(${focal}px) matrix3d(${css.map(v=>Math.abs(v)<1e-12?0:v).join(',')})`;
        }
        for(let i=patches.length;i<data.patches.length;i++)data.patches[i].style.display='none';
        drawing.push({face,layer,polygon:projected,bounds,farther:[],incoming:0,depth:face.position.clone().applyMatrix4(camera.matrixWorldInverse).z});
      }
      // Compare depth only where projected faces actually overlap. Sorting by
      // their centers alone can wrongly put a wall in front of its own screen.
      for(let i=0;i<drawing.length;i++)for(let j=i+1;j<drawing.length;j++){
        const a=drawing[i],b=drawing[j],aa=a.bounds,bb=b.bounds;
        if(aa.left>=bb.right-1e-7||aa.right<=bb.left+1e-7||aa.bottom>=bb.top-1e-7||aa.top<=bb.bottom+1e-7)continue;
        const overlap=overlapPolygon(a.polygon,b.polygon);if(!overlap||Math.abs(signedArea(overlap))<1e-8)continue;
        const point=overlap.reduce((p,q)=>({x:p.x+q.x/overlap.length,y:p.y+q.y/overlap.length}),{x:0,y:0});
        const ray=new T.Vector3(point.x,point.y,.5).unproject(camera).sub(camera.position);
        const depth=item=>item.face.userData.roomNormal.dot(item.face.position.clone().sub(camera.position))/item.face.userData.roomNormal.dot(ray);
        const da=depth(a),db=depth(b);if(Math.abs(da-db)<1e-7)continue;
        const far=da>db?a:b,near=da>db?b:a;far.farther.push(near);near.incoming++;
      }
      let rank=0;const remaining=new Set(drawing);
      while(remaining.size){
        const ready=[...remaining].filter(item=>!item.incoming);
        const candidates=ready.length?ready:[...remaining];candidates.sort((a,b)=>a.depth-b.depth);
        const next=candidates[0];remaining.delete(next);next.layer.style.zIndex=String(++rank);
        for(const nearer of next.farther)nearer.incoming--;
      }
    }
    let spaceEpoch = 0;
    // Each pane crops its actual position on one 184-metre perimeter. The
    // forward inset windows use the same coordinates as the wall behind them.
    const spaceView = (offset,top=0,borderTop=15) => `<div class="space-scene" aria-hidden="true" style="--space-x:${offset*50+12}px;--space-y:${top*50+borderTop}px"><div class="space-stars stars-far"></div><div class="space-stars stars-near"></div><div class="space-meteors"></div></div><div class="window-glass" aria-hidden="true"></div>`;
    const plane = (name,w,h,x,y,z,ry=0,rx=0,html='') => {
      const el = document.createElement('div'); el.className = 'bridge-surface '+name;
      el.style.width = w*50+'px'; el.style.height = h*50+'px'; el.innerHTML = html;
      const obj = new T.CSS3DObject(el); obj.scale.setScalar(.02); obj.position.set(x,y,z); obj.rotation.set(rx,ry,0,'YXZ');
      setRoomBounds(obj,w,h);
      obj.userData.spaceWindow=!!el.querySelector('.space-scene');
      scene.add(obj); faces.push(obj); return obj;
    };
    const box = (name,x,y,z,w,h,d) => {
      plane(name,w,h,x,y,z+d/2);
      plane(name,w,h,x,y,z-d/2,Math.PI);
      plane(name,d,h,x-w/2,y,z,-Math.PI/2);
      plane(name,d,h,x+w/2,y,z,Math.PI/2);
      plane(name,w,d,x,y+h/2,z,0,-Math.PI/2);
    };
    plane('bridge-floor',44,48,0,0,0,0,-Math.PI/2);
    plane('bridge-ceiling',44,48,0,12,0,0,Math.PI/2);
    // Separate bulkheads, ceiling ribs, and windows create depth in every direction.
    for (const side of [-1,1]) {
      for (let z=-18;z<=18;z+=12) {
        plane('bridge-bulkhead bridge-observation',12,12,side*22,6,z,-side*Math.PI/2,0,spaceView(side>0?62+z:154-z));
        box('bridge-rib',side*21.65,6,z-5.8,.65,12,.6);
      }
      plane('bridge-window window-'+(side<0?'port':'starboard'),8.8,9.8,side*16.8,6.5,-23.7,0,0,spaceView(22+side*16.8-4.4,.6,12));
    }
    plane('bridge-bulkhead bridge-observation',44,12,0,6,24,Math.PI,0,spaceView(92));
    plane('bridge-bulkhead bridge-observation',44,12,0,6,-24,0,0,spaceView(0));
    for (const z of [-20,-8,4,16]) box('bridge-overhead',0,11.6,z,43,.7,.6);
    for(const x of [-12,12])plane('bridge-light-strip',.4,43,x,11.15,0,0,Math.PI/2);
    for(const side of [-1,1])plane('bridge-wall-wash',46,.35,side*21.2,10.8,0,-side*Math.PI/2);
    plane('bridge-wall-wash',42,.4,0,11.4,-23.4);
    plane('bridge-front-frame',23.8,11.25,0,6.35,-23.72);
    const board = new T.CSS3DObject(screen); board.scale.setScalar(.02); board.position.set(0,6.65,-23.5); setRoomBounds(board,21.2,9.52); scene.add(board); faces.push(board);
    const station = (cls,title,sub,w,h,x,y,z,ry,html) => plane('bridge-station '+cls,w,h,x,y,z,ry,0,
      `<header><span>${sub}</span><h2>${title}</h2></header>${html}`);
    const logWall = station('bridge-log-wall','LOCK ACTIVITY','PORT · OPERATIONS',14,7.8,-21.15,6,2,Math.PI/2,
      '<div class="bridge-log-state" role="status"></div><div class="bridge-log-rows"></div><footer><button data-station="history">Open full lock history</button><button data-station="refresh">Refresh history</button></footer>').element;
    const rosterWall = station('bridge-roster-wall','UNIT STATUS','STARBOARD · SECURITY',14,7.8,21.15,6,2,-Math.PI/2,
      '<div class="bridge-roster"></div><footer>Live unit status · Select a unit to inspect</footer>').element;
    station('bridge-comms','COMMUNICATIONS','PORT · CREW STATION',10,8.4,-21.15,5.3,16,Math.PI/2,
      '<div class="bridge-station-actions"><button data-station="alerts">Push notifications</button><button data-station="report">Save &amp; email report</button><button data-station="gear">Team &amp; ship systems</button></div>');
    // Preserve the original office's wall boards and real crew photo inside
    // the upgraded bridge; the observation windows continue behind the fittings.
    station('bridge-lock-supply','DISC LOCKS','PORT · LOCK SUPPLIES',10,7.5,-21.15,5.8,-14,Math.PI/2,
      '<div class="disc-lock-board">'+['red','blue','silver'].map(color=>'<div class="disc-lock-row"><span>'+color.toUpperCase()+'</span>'+Array.from({length:4},()=>'<i class="disc-lock '+color+'" aria-hidden="true"></i>').join('')+'</div>').join('')+'</div><footer>Red · Blue · Silver disc locks</footer>');
    const calendarWall=station('bridge-calendar-wall','TIME & CALENDAR','STARBOARD · LOCAL TIME',11,8.4,21.15,6,-14,-Math.PI/2,
      '<div class="bridge-clock" role="timer" aria-label="Local time"></div><div class="bridge-clock-date"></div><div class="bridge-calendar" aria-label="Current month calendar"></div>').element;
    plane('bridge-crew-photo',11,4.8,-9.7,8.4,23.55,Math.PI,0,
      '<figure><figcaption>IGGY’S — THE CREW</figcaption><img src="/img/limo.jpg" alt="Original limousine photograph outside Iggy’s Diner" draggable="false"></figure>');
    const bookColors=['#176aba','#c54d56','#2e956c','#dfad42','#905bbd','#e5763c','#0a99b3'];
    for(const [shelfIndex,x] of [-17.8,-1.6].entries()){
      box('bridge-bookcase',x,3.05,23.2,4.6,6.1,.18);
      for(const side of [-1,1])box('bridge-bookcase',x+side*2.25,3.05,22.6,.18,6.1,1.4);
      for(let row=0;row<5;row++){
        const y=.15+row*1.45;
        box('bridge-bookcase',x,y,22.6,4.6,.14,1.4);
        if(row<4)plane('bridge-books',4.1,1.22,x,y+.68,21.91,Math.PI,0,Array.from({length:14},(_,i)=>'<i style="--book-color:'+bookColors[(i+row+shelfIndex*3)%bookColors.length]+';height:'+(72+(i*13+row*7)%25)+'%;flex:'+(1+(i%3)*.25)+'"></i>').join(''));
      }
    }
    // The original blue lounge, accent cushions, table and rug stay under the photo.
    plane('bridge-lounge-rug',12,7.3,-9.7,.025,19.5,0,-Math.PI/2);
    box('bridge-sofa',-9.7,.6,21.2,9.6,1.1,2.4);
    box('bridge-sofa sofa-back',-9.7,1.85,22.2,9.6,2,.5);
    for(const x of [-14.4,-5])box('bridge-sofa',x,1.1,21.2,.5,2,2.6);
    for(let i=-1;i<=1;i++)box('bridge-sofa-cushion',-9.7+i*3,1.25,21.05,2.85,.35,2);
    box('bridge-lounge-pillow pillow-gold',-12,1.95,21.75,1.1,1.1,.38);
    box('bridge-lounge-pillow pillow-purple',-7.4,1.95,21.75,1.1,1.1,.38);
    box('bridge-coffee-table',-9.7,1.12,17.8,5,.2,2.3);
    for(const x of [-11.8,-7.6])for(const z of [17,18.6])box('bridge-table-leg',x,.5,z,.18,1,.18);
    obstacles.push({x:-9.7,z:21.2,w:10.2,d:3},{x:-9.7,z:17.8,w:5.4,d:2.7});
    const portal=plane('bridge-airlock-portal',9.4,10.6,7,5.3,23.6,Math.PI,0,
      '<header class="airlock-sign"><span>PROPERTY ACCESS</span><strong>EXIT</strong><i></i></header><div class="airlock-cavity"><div class="airlock-corridor"><svg class="corridor-perspective" viewBox="0 0 400 400" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="sw-corridor-wall"><stop stop-color="#40627d"/><stop offset="1" stop-color="#122a42"/></linearGradient></defs><path d="M0 0H400L272 100H128Z" fill="#18334c"/><path d="M0 0 128 100V312L0 400Z M400 0 272 100V312L400 400Z" fill="url(#sw-corridor-wall)" stroke="#4e819e"/><path d="M0 400 128 312H272L400 400Z" fill="#29475e"/><path d="M44 34V370 M88 69V340 M356 34V370 M312 69V340" stroke="#274b65" stroke-width="4"/><path d="M0 40 128 128 M400 40 272 128 M0 385 128 306 M400 385 272 306" stroke="#8aebf0" stroke-width="3"/><path d="M85 0 155 100 M315 0 245 100" stroke="#ffe0a0" stroke-width="4"/><path d="M35 375H365 M78 345H322 M115 320H285 M100 400 165 312 M300 400 235 312" stroke="#688fa8" stroke-width="1.5"/><rect x="128" y="100" width="144" height="212" fill="#071624" stroke="#63c7dc" stroke-width="3"/></svg><div class="corridor-end">STOREWELL<br><small>STORAGE PROPERTY</small></div></div><div class="airlock-leaf leaf-left"><span>SW</span></div><div class="airlock-leaf leaf-right"><span>01</span></div><button class="airlock-trigger" data-station="door" aria-label="Open exit doors"><span class="airlock-prompt">TAP TO OPEN</span></button></div><footer class="airlock-status" role="status">Automatic doors · Approach to open</footer>').element;
    const doorTrigger=portal.querySelector('.airlock-trigger');
    deck.dataset.bridgeDoor='closed';
    for(const x of [1.9,12.1])box('airlock-jamb',x,5.4,23.35,.55,10.8,.65);
    const instrument = '<div class="instrument-radar"></div><div class="instrument-lines"><i></i><i></i><i></i><i></i><i></i></div><div class="instrument-lights">● ● ● <b>● ●</b></div>';
    function consoleDesk(x,z,w,d) {
      box('bridge-console-base',x,.9,z,w,1.8,d);
      plane('bridge-console-top',w,d,x,1.94,z,0,-1.32,instrument);
      obstacles.push({x,z,w:w+1,d:d+1});
    }
    consoleDesk(-4.7,-10,7.5,3.8); consoleDesk(4.7,-10,7.5,3.8);
    for (const side of [-1,1]) { consoleDesk(side*16,-11,5.5,8); consoleDesk(side*16,10,5.5,6); }
    // Reference composition: enter behind the captain's chair, facing the
    // paired consoles and distant wall display. Both sides remain walkable.
    const daisHeight=.28;
    box('bridge-chair',0,.75+daisHeight,1,2.3,1.5,2.5);
    box('bridge-chair chair-back',0,2.25+daisHeight,2.05,2.4,3,.55);
    for (const x of [-1.45,1.45]) box('bridge-chair chair-arm',x,1.35+daisHeight,1,.55,1.6,2.9);
    obstacles.push({x:0,z:1,w:4.2,d:4});
    // The command deck has a visible solid edge. A shallow perimeter ramp
    // raises the walking camera naturally instead of blocking the player.
    box('bridge-dais-riser',0,daisHeight/2,-1,12,daisHeight,11);
    plane('bridge-dais',12,11,0,daisHeight+.012,-1,0,-Math.PI/2);
    function deckHeight(x,z){return daisHeight*Math.max(0,Math.min(1,(6-Math.abs(x))/.8,(5.5-Math.abs(z+1))/.8));}
    const controls=document.createElement('div');controls.className='bridge-joystick';
    controls.innerHTML='<span class="joystick-caption">MOVE / TURN</span><button class="joystick-pad" aria-label="Bridge joystick" aria-describedby="bridge-joystick-help"><span class="joystick-ring"></span><span class="joystick-direction north" aria-hidden="true">↑</span><span class="joystick-direction south" aria-hidden="true">↓</span><span class="joystick-direction west" aria-hidden="true">↶</span><span class="joystick-direction east" aria-hidden="true">↷</span><span class="joystick-stick"><i></i></span></button><span id="bridge-joystick-help">Drag up or down to walk. Drag left or right to turn.</span><button class="level-view" type="button">Level view</button>';
    deck.append(controls);const pad=controls.querySelector('.joystick-pad'),stick=controls.querySelector('.joystick-stick');
    function releaseJoystick(){const id=joystick.id;joystick.id=null;if(id!==null&&pad.hasPointerCapture?.(id))pad.releasePointerCapture(id);joystick.x=joystick.y=0;stick.style.transform='translate(0px,0px)';pad.classList.remove('held');}
    function releaseLook(){const id=drag?.id;if((drag?.travel||0)>8)suppressTapUntil=performance.now()+500;drag=null;if(id!==undefined&&deck.hasPointerCapture?.(id))deck.releasePointerCapture(id);}
    function stop(){keys.clear();const ids=[...touches.keys()];touches.clear();pinch=null;releaseLook();releaseJoystick();for(const id of ids)if(deck.hasPointerCapture?.(id))deck.releasePointerCapture(id);}
    function blocked() { return !active || deck.inert || !document.getElementById('sw-deck-dialog').hidden || !!document.querySelector('#sw-cmd-panel,#sw-help-modal,#sw-wardrobe,#sw-rpm,#sw-pref-panel,#sw-save-report-modal,#sw-rounds-modal,#sw-login-overlay') || document.getElementById('sw-sens-panel')?.style.display==='block'; }
    function canStand(x,z) { return Math.abs(x)<20.5 && z>-21.5 && (z<21.8||(doorReady&&Math.abs(x-7)<3.5&&z<25.5)) && !obstacles.some(o=>Math.abs(x-o.x)<o.w/2&&Math.abs(z-o.z)<o.d/2); }
    function move(dx,dz) { const x=camera.position.x+dx,z=camera.position.z+dz; if(canStand(x,camera.position.z))camera.position.x=x; if(canStand(camera.position.x,z))camera.position.z=z; }
    function setDoor(open) {
      if(open===doorOpen)return;
      clearTimeout(doorTimer);doorOpen=open;doorReady=false;portal.classList.toggle('is-open',open);
      deck.dataset.bridgeDoor=open?'opening':'closed';doorTrigger.disabled=open;
      doorTrigger.setAttribute('aria-label',open?'Exit doors opening':'Open exit doors');
      portal.querySelector('.airlock-prompt').textContent=open?'OPENING…':'TAP TO OPEN';
      portal.querySelector('.airlock-status').textContent=open?'Opening exit doors…':'Automatic doors · Approach to open';
      syncPaintCopies();
      if(open)doorTimer=setTimeout(()=>{
        if(!active||!doorOpen)return;doorReady=true;doorTrigger.disabled=false;deck.dataset.bridgeDoor='open';
        doorTrigger.setAttribute('aria-label','Exit to storage property');
        portal.querySelector('.airlock-prompt').textContent='RETURN OUTSIDE';
        portal.querySelector('.airlock-status').textContent='Walk through · or tap to exit';
        syncPaintCopies();
      },window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?0:760);
    }
    function openExitDoors() {
      if(doorReady){exit();return;}
      if(!doorOpen){setView('door');doorManual=true;setDoor(true);}
    }
    function setZoom(value) {
      zoom=Math.max(.65,Math.min(2.5,value));camera.zoom=zoom;camera.updateProjectionMatrix();render();
    }
    function resize() {
      const width=deck.clientWidth||innerWidth,height=deck.clientHeight||innerHeight;
      // Preserve the reference's 74-degree horizontal framing on phones: the
      // chair, paired consoles, wall display and both windows share one view.
      // Wider screens need more floor in view. Step back in the room overview
      // and keep enough vertical field of view to show the complete chair/dais.
      camera.aspect=width/height; camera.fov=Math.max(55,2*Math.atan(Math.tan(74*Math.PI/360)/camera.aspect)*180/Math.PI);
      if(view==='room')camera.position.set(0,5.2,Math.max(10,Math.min(16,4.5+8*camera.aspect)));
      camera.zoom=zoom;camera.updateProjectionMatrix(); renderer.setSize(width,height);
      const focus=view==='desk'; deck.classList.toggle('screen-focused',focus);controls.hidden=focus;
      if(focus) {scene.remove(board); deck.querySelector('.mobile-dock').append(screen); screen.style.display='';}
      else if(!board.parent)scene.add(board);
      render();
    }
    function setView(next,keepInput=false) {
      if(!keepInput)stop(); if(next==='center')next='room';
      if(next==='level'){pitch=0;render();return;}
      if(next==='history') { camera.position.set(-10,5.2,2); yaw=Math.PI/2; pitch=.04; view='walk'; openHistory(); }
      else if(next==='door') {camera.position.set(7,5.2,(deck.clientWidth||innerWidth)<=700?9.5:13.5);yaw=Math.PI;pitch=0;zoom=1;view='walk';}
      else {
        view=next;
        if(next==='room') {camera.position.set(0,5.2,10);yaw=0;pitch=.035;zoom=1;doorManual=false;setDoor(false);}
        if(next==='desk') {camera.position.set(0,4.7,-5);yaw=0;pitch=.105;}
        if(next==='walk' && !canStand(camera.position.x,camera.position.z))camera.position.set(0,5.2,10);
      }
      deck.dataset.bridgeView=view; deck.classList.toggle('exploring',view==='walk'||view==='look');
      controls.hidden=view==='desk';
      const help=deck.querySelector('.view-help'); help.hidden=view==='desk'; help.textContent='Drag to look · Pinch to zoom';
      deck.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view||(b.dataset.view==='room'&&(view==='walk'||view==='look')))));
      resize();
    }
    function render() {
      camera.rotation.set(pitch,yaw,0,'YXZ'); camera.updateMatrixWorld(true);
      viewFrustum.setFromProjectionMatrix(projectionView.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
      for(const face of faces) {
        normal.set(0,0,1).applyQuaternion(face.quaternion); toCamera.copy(camera.position).sub(face.position);
        const wasVisible=face.visible;
        // Off-screen consoles and wall sections that cross the camera plane
        // can project enormous CSS paint bounds over the room. Clip against
        // the entire view, including its sides and top/bottom, before drawing.
        face.visible=normal.dot(toCamera)>.015&&viewFrustum.intersectsBox(face.userData.roomBounds);
        face.userData.paintBecameVisible=face.visible&&!wasVisible;
        // CSS animations restart when a culled face becomes visible. Resume
        // the shared sky clock so turning around never restarts that window.
        if(face.userData.spaceWindow&&face.visible&&(!wasVisible||face.userData.syncSpace)){
          face.element.style.setProperty('--space-delay',`${-(performance.now()-spaceEpoch)/1000}s`);
          face.userData.syncSpace=false;
        }
      }
      paintRoom();
      Object.assign(renderedPose,{x:camera.position.x,y:camera.position.y,z:camera.position.z,yaw,pitch});
      deck.dataset.bridgeX=camera.position.x.toFixed(6);deck.dataset.bridgeY=camera.position.y.toFixed(6);deck.dataset.bridgeZ=camera.position.z.toFixed(6);deck.dataset.bridgeYaw=yaw.toFixed(6);deck.dataset.bridgePitch=pitch.toFixed(6);deck.dataset.bridgeFov=String(camera.fov);deck.dataset.bridgeZoom=String(zoom);
    }
    function frame(now) {
      if(!active){raf=0;return;} raf=requestAnimationFrame(frame);
      const dt=Math.min(.05,(now-lastTime)/1000||0);lastTime=now;
      if(document.hidden||blocked()){stop();return;}
      if(view==='walk'||view==='look') {
        const speed=5*dt*Math.max(.4,Math.min(2.5,(window._swWalkSpd||.2)/.2));
        const turn=1.25*Math.max(.4,Math.min(2.5,(window._swTurnSpd||.006)/.006));
        yaw+=((keys.has('turnleft')?1:0)-(keys.has('turnright')?1:0)-joystick.x)*turn*dt;
        let forward=(keys.has('forward')?1:0)-(keys.has('back')?1:0)-joystick.y,side=(keys.has('right')?1:0)-(keys.has('left')?1:0);
        if(Math.abs(forward)+Math.abs(side)>.05&&!drag)pitch+=(.04-pitch)*Math.min(1,dt*6);
        const length=Math.max(1,Math.hypot(forward,side));forward/=length;side/=length;
        move((-Math.sin(yaw)*forward+Math.cos(yaw)*side)*speed,(-Math.cos(yaw)*forward-Math.sin(yaw)*side)*speed);
        camera.position.y+=(5.2+deckHeight(camera.position.x,camera.position.z)-camera.position.y)*Math.min(1,dt*10);
        if(Math.abs(camera.position.y-5.2-deckHeight(camera.position.x,camera.position.z))<.001)camera.position.y=5.2+deckHeight(camera.position.x,camera.position.z);
        if(doorManual&&Math.hypot(camera.position.x-7,camera.position.z-24)>16)doorManual=false;
        setDoor(doorManual||(Math.abs(camera.position.x-7)<5&&camera.position.z>17));
        if(doorReady&&Math.abs(camera.position.x-7)<3.5&&camera.position.z>23.8){exit();return;}
      }
      if(camera.position.x!==renderedPose.x||camera.position.y!==renderedPose.y||camera.position.z!==renderedPose.z||yaw!==renderedPose.yaw||pitch!==renderedPose.pitch)render();
    }
    const keyMap={w:'forward',s:'back',a:'left',d:'right',q:'turnleft',e:'turnright',ArrowLeft:'turnleft',ArrowRight:'turnright',ArrowUp:'forward',ArrowDown:'back'};
    document.addEventListener('keydown',e=>{
      if(blocked()||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||e.target.isContentEditable)return;
      if(e.key==='Escape'){setView('room');return;}
      if(view==='desk')return;
      const key=keyMap[e.key]||keyMap[e.key.toLowerCase()];if(!key)return;
      if(view!=='walk'&&view!=='look')setView('walk');keys.add(key);e.preventDefault();
    });
    document.addEventListener('keyup',e=>keys.delete(keyMap[e.key]||keyMap[e.key.toLowerCase()]));
    function joystickMove(e){
      if(joystick.id!==e.pointerId)return;
      const rect=pad.getBoundingClientRect(),radius=rect.width*.32;
      let x=(e.clientX-rect.left-rect.width/2)/radius,y=(e.clientY-rect.top-rect.height/2)/radius;
      const magnitude=Math.hypot(x,y);if(magnitude>1){x/=magnitude;y/=magnitude;}
      const amount=Math.min(1,magnitude),gain=amount>.13?(amount-.13)/(.87*amount):0;
      joystick.x=x*gain;joystick.y=y*gain;
      stick.style.transform=`translate(${x*radius}px,${y*radius}px)`;
    }
    pad.addEventListener('pointerdown',e=>{if(blocked()||joystick.id!==null||e.button>0)return;e.preventDefault();e.stopPropagation();if(view!=='walk')setView('walk',true);joystick.id=e.pointerId;pad.setPointerCapture?.(e.pointerId);pad.classList.add('held');joystickMove(e);});
    pad.addEventListener('pointermove',e=>{if(joystick.id===e.pointerId){e.preventDefault();e.stopPropagation();joystickMove(e);}});
    const release=e=>{if(joystick.id===e.pointerId){releaseJoystick();if(pad.hasPointerCapture?.(e.pointerId))pad.releasePointerCapture(e.pointerId);}};
    pad.addEventListener('pointerup',release);pad.addEventListener('pointercancel',release);pad.addEventListener('lostpointercapture',release);
    controls.querySelector('.level-view').onclick=()=>setView('level');
    // Track the room's two touch points before button handlers; a pinch must never select a tile.
    deck.addEventListener('pointerdown',e=>{
      if(!touches.size&&!pinch)suppressTapUntil=0;
      if(e.pointerType!=='touch'||blocked()||view==='desk'||e.target.closest('.bridge-nav,.bridge-joystick'))return;
      touches.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(touches.size===2){const [a,b]=[...touches.values()];pinch={distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),zoom};drag=null;keys.clear();suppressTapUntil=performance.now()+500;e.preventDefault();for(const id of touches.keys())deck.setPointerCapture?.(id);}
    },true);
    deck.addEventListener('pointermove',e=>{
      if(!touches.has(e.pointerId))return;touches.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(pinch&&touches.size>=2){const [a,b]=[...touches.values()];setZoom(pinch.zoom*Math.hypot(a.x-b.x,a.y-b.y)/pinch.distance);suppressTapUntil=performance.now()+500;e.preventDefault();e.stopPropagation();}
    },true);
    const endTouch=e=>{if(!touches.has(e.pointerId))return;if(pinch)suppressTapUntil=performance.now()+500;if(drag?.id===e.pointerId)releaseLook();touches.delete(e.pointerId);if(touches.size<2)pinch=null;if(deck.hasPointerCapture?.(e.pointerId))deck.releasePointerCapture(e.pointerId);};
    deck.addEventListener('pointerup',endTouch,true);deck.addEventListener('pointercancel',endTouch,true);
    deck.addEventListener('click',e=>{if(performance.now()<suppressTapUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
    deck.addEventListener('wheel',e=>{if(blocked()||view==='desk'||e.target.closest('.bridge-nav,.bridge-joystick')||(!e.ctrlKey&&e.target.closest('.command-screen,.bridge-station')))return;e.preventDefault();setZoom(zoom*Math.exp(-e.deltaY*.004));},{passive:false});
    deck.addEventListener('pointerdown',e=>{if(blocked()||pinch||drag||e.button>0||e.target.closest('button,input,select,.command-screen,.bridge-station,.bridge-nav,.bridge-joystick')||view==='desk')return; if(view==='room')setView('look',true);drag={id:e.pointerId,x:e.clientX,y:e.clientY,travel:0};deck.setPointerCapture?.(e.pointerId);});
    deck.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const sens=Math.max(.001,Math.min(.004,window._swLookSens||.002));const dx=e.clientX-drag.x,dy=e.clientY-drag.y;yaw-=dx*sens*1.4;pitch=limitPitch(pitch-dy*sens*.55);drag={id:e.pointerId,x:e.clientX,y:e.clientY,travel:drag.travel+Math.hypot(dx,dy)};});
    const endLook=e=>{if(drag?.id===e.pointerId)releaseLook();};
    deck.addEventListener('pointerup',endLook);deck.addEventListener('pointercancel',endLook);deck.addEventListener('lostpointercapture',endLook);
    window.addEventListener('blur',stop);document.addEventListener('visibilitychange',stop);window.addEventListener('resize',resize);
    window.visualViewport?.addEventListener('resize',resize);
    let historyRecords={},historyDownloadUrl=null,clockMinute='',calendarMonth='';
    const historyTime=r=>Number(r.t)||0;
    // A retained diagnostic record contains t=1, a placeholder rather than a
    // business date. Keep it and its raw timestamp in the archive without
    // presenting the Unix epoch as the beginning of StoreWell's history.
    const datedHistory=r=>historyTime(r)>=86400000;
    const historyStatus=value=>status[value]?.[0]||value||'—';
    function rowsHtml(rows) {return rows.map(r=>`<div class="bridge-history-entry"><strong>${escape(r.label||r.unit||'Unit')}</strong><span>${escape(historyStatus(r.from))} → <b>${escape(historyStatus(r.to||r.status))}</b></span><small>${escape(r.who||r.staff||'Staff')} · ${escape(datedHistory(r)?new Date(historyTime(r)).toLocaleString():'Unverified date · original timestamp '+String(r.t??'not recorded'))}</small></div>`).join('');}
    function releaseHistoryDownload(){if(historyDownloadUrl){URL.revokeObjectURL(historyDownloadUrl);historyDownloadUrl=null;}}
    content.closest('dialog')?.addEventListener('close',releaseHistoryDownload);
    function drawFullHistory(){
      const slot=content.querySelector('[data-full-lock-history]');if(!slot)return;
      const query=(content.querySelector('[data-history-search]')?.value||'').trim().replace(/[-\s]/g,'').toLowerCase();
      const rows=history.filter(r=>(String(r.label||r.unit||'')+' '+String(r.who||r.staff||'')).replace(/[-\s]/g,'').toLowerCase().includes(query));
      const oldest=content.querySelector('[data-history-order]')?.value==='oldest';
      rows.sort((a,b)=>datedHistory(a)!==datedHistory(b)?datedHistory(a)?-1:1:oldest?historyTime(a)-historyTime(b):historyTime(b)-historyTime(a));slot.innerHTML=rowsHtml(rows);
      content.querySelector('[data-lock-history-state]').textContent=historyState;
      content.querySelector('[data-history-count]').textContent=`Showing ${rows.length} of ${history.length} saved lock changes · ${oldest?'Oldest':'Newest'} first`;
      const backup=content.querySelector('[data-history-backup]');releaseHistoryDownload();
      const count=Object.keys(historyRecords).length;
      if(count){historyDownloadUrl=URL.createObjectURL(new Blob([JSON.stringify({exportedAt:new Date().toISOString(),recordCount:count,records:historyRecords},null,2)],{type:'application/json'}));backup.href=historyDownloadUrl;backup.download='storewell-complete-history-'+new Date().toISOString().slice(0,10)+'.json';backup.removeAttribute('aria-disabled');}
      else{backup.removeAttribute('href');backup.setAttribute('aria-disabled','true');}
    }
    function drawHistory() {
      logWall.querySelector('.bridge-log-state').textContent=historyState;
      logWall.querySelector('.bridge-log-rows').innerHTML=rowsHtml(history.slice(0,20));
      syncPaintCopies();
      drawFullHistory();
    }
    function openHistory() {
      stop();showDialog('Lock activity history','<p class="muted" data-lock-history-state role="status"></p><div class="history-tools"><div><label for="bridge-history-search">Unit or staff</label><input id="bridge-history-search" data-history-search type="search" placeholder="Unit number or name" autocomplete="off"></div><div><label for="bridge-history-order">History order</label><select id="bridge-history-order" data-history-order><option value="newest">Newest first</option><option value="oldest">Oldest first — from the beginning</option></select></div></div><p class="muted" data-history-count></p><div class="full-lock-history" data-full-lock-history></div><div class="dialog-actions"><button class="action-button" data-history-login>Refresh history</button><a class="action-button" data-history-backup>Back up full history</a></div><p class="history-backup-note">The backup includes every saved activity record, including lock changes, emails and sign-ins.</p>');
      content.querySelector('[data-history-search]').oninput=drawFullHistory;
      content.querySelector('[data-history-order]').onchange=drawFullHistory;
      drawHistory();content.querySelector('[data-history-login]').onclick=()=>watchHistory(true);
    }
    function watchHistory(retry=false) {
      const signed=window.__swCheckLogin?.() && window._swAuth?.currentUser;
      if(!signed){if(watched){unsubscribe?.();unsubscribe=null;watched=false;}history=[];historyState='Connecting to saved lock history…';drawHistory();return;}
      if(watched&&!retry)return;
      if(!window._swOnValue||!window._swRef)return;
      unsubscribe?.();watched=true;historyState='Loading saved lock history…';drawHistory();
      unsubscribe=window._swOnValue(window._swRef(window._swDB,'lockLog'),snapshot=>{
        historyRecords=snapshot.val()||{};
        history=Object.values(historyRecords).filter(r=>r&&typeof r==='object'&&!['email','login'].includes(r.type)&&(r.label||r.unit)).sort((a,b)=>historyTime(b)-historyTime(a));
        const dated=history.filter(datedHistory),first=dated.at(-1),last=dated[0],unverified=history.length-dated.length;
        historyState=history.length?`${history.length} saved lock changes${first?' · '+new Date(historyTime(first)).toLocaleDateString()+' – '+new Date(historyTime(last)).toLocaleDateString():''}${unverified?' · '+unverified+' with an unverified date':''} · Complete saved history`:'No saved lock changes yet';drawHistory();
      },()=>{watched=false;historyState='Lock history could not connect. Refresh to retry.';drawHistory();});
    }
    let rosterSignature='';
    function refresh() {
      if(!active)return;watchHistory();
      const now=new Date(),minute=String(Math.floor(now.getTime()/60000)),month=now.getFullYear()+'-'+now.getMonth()+'-'+now.getDate();
      if(minute!==clockMinute){clockMinute=minute;calendarWall.querySelector('.bridge-clock').textContent=now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});calendarWall.querySelector('.bridge-clock-date').textContent=now.toLocaleDateString([],{weekday:'long',month:'long',day:'numeric',year:'numeric'});}
      if(month!==calendarMonth){calendarMonth=month;const first=new Date(now.getFullYear(),now.getMonth(),1).getDay(),days=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();calendarWall.querySelector('.bridge-calendar').innerHTML='<strong>'+escape(now.toLocaleDateString([],{month:'long',year:'numeric'}))+'</strong><div>'+['S','M','T','W','T','F','S'].map(d=>'<b>'+d+'</b>').join('')+Array.from({length:first},()=>'<i></i>').join('')+Array.from({length:days},(_,i)=>'<span'+(i+1===now.getDate()?' aria-current="date"':'')+'>'+(i+1)+'</span>').join('')+'</div>';}
      const list=units(),signature=list.map(u=>u.id+u.status).join('|');
      if(signature!==rosterSignature){rosterSignature=signature;rosterWall.querySelector('.bridge-roster').innerHTML=list.map(u=>`<button data-room-unit="${escape(u.id)}" style="--unit-color:${status[u.status]?.[1]||'#adc1d2'}" aria-label="Unit ${escape(u.label)} · ${escape(status[u.status]?.[0]||'Unknown')}">${escape(u.label)}</button>`).join('');}
      syncPaintCopies();
    }
    function localBounds(node,surface) {
      let x=0,y=0,el=node;
      while(el&&el!==surface){x+=el.offsetLeft;y+=el.offsetTop;const parent=el.offsetParent;if(parent){x+=parent.clientLeft;y+=parent.clientTop;}el=parent;}
      if(el!==surface)return null;
      for(let parent=node.parentElement;parent&&parent!==surface.parentElement;parent=parent.parentElement){x-=parent.scrollLeft;y-=parent.scrollTop;}
      return {x,y,w:node.offsetWidth,h:node.offsetHeight};
    }
    // Some mobile browsers paint rotated CSS3D controls but hit-test the empty canvas behind them.
    // Pick the nearest visible room face, then its real button, in the same room geometry.
    function pickRoomButton(clientX,clientY) {
      const rect=deck.getBoundingClientRect();if(!rect.width||!rect.height)return null;
      camera.updateMatrixWorld(true);const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((clientX-rect.left)/rect.width*2-1,1-(clientY-rect.top)/rect.height*2),camera);
      let picked=null,nearest=Infinity;
      for(const face of faces){
        if(!face.visible||!face.parent)continue;const element=face.element,w=element.offsetWidth,h=element.offsetHeight;if(!w||!h)continue;
        const n=new T.Vector3(0,0,1).applyQuaternion(face.quaternion),plane=new T.Plane().setFromNormalAndCoplanarPoint(n,face.position);
        const point=ray.ray.intersectPlane(plane,new T.Vector3());if(!point)continue;
        const distance=point.distanceTo(camera.position);if(distance>=nearest)continue;
        const local=point.clone().sub(face.position).applyQuaternion(face.quaternion.clone().invert()).multiplyScalar(50);
        const x=local.x+w/2,y=h/2-local.y;if(x<0||x>w||y<0||y>h)continue;
        nearest=distance;picked={element,x,y};
      }
      if(!picked)return null;
      for(const button of picked.element.querySelectorAll('button')){
        if(button.disabled||button.hidden)continue;const r=localBounds(button,picked.element);if(!r||picked.x<r.x||picked.x>r.x+r.w||picked.y<r.y||picked.y>r.y+r.h)continue;
        let clipped=false;
        for(let parent=button.parentElement;parent&&parent!==picked.element;parent=parent.parentElement){
          const style=getComputedStyle(parent);if(!/hidden|auto|scroll|clip/.test(style.overflowX+' '+style.overflowY))continue;
          const clip=localBounds(parent,picked.element);if(clip&&(picked.x<clip.x||picked.x>clip.x+clip.w||picked.y<clip.y||picked.y>clip.y+clip.h)){clipped=true;break;}
        }
        if(!clipped)return button;
      }
      return null;
    }
    deck.addEventListener('click',e=>{
      if(!blocked()&&view!=='desk'&&!e.target.closest('button,input,select,.bridge-nav,.bridge-joystick')){const button=pickRoomButton(e.clientX,e.clientY);if(button){e.preventDefault();button.click();return;}}
      const id=e.target.closest('[data-room-unit]')?.dataset.roomUnit;if(id){stop();const u=units().find(u=>u.id===id);if(u)showUnit(u);return;}
      const action=e.target.closest('[data-station]')?.dataset.station;if(!action)return;stop();
      ({history:openHistory,refresh:()=>watchHistory(true),door:openExitDoors,gear,alerts,report,exit}[action])?.();
    });
    return {
      open(){active=true;lastTime=0;spaceEpoch=performance.now();for(const face of faces)if(face.userData.spaceWindow)face.userData.syncSpace=true;setView('room');refresh();if(!raf)raf=requestAnimationFrame(frame);},
      close(){active=false;stop();clearTimeout(doorTimer);doorManual=false;setDoor(false);unsubscribe?.();unsubscribe=null;watched=false;history=[];historyRecords={};releaseHistoryDownload();drawHistory();},
      setView,refresh,stop,resize
    };
  };
})();
