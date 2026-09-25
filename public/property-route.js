/* Geometry-backed walking order. All units and statuses stay in the original app. */
(()=>{
  let cachedApp,cachedOrder;
  const normal={E:[1,0],W:[-1,0],N:[0,-1],S:[0,1]};
  function ordered(app){
    if(cachedApp===app&&cachedOrder?.length===Object.keys(app._locks||{}).length)return cachedOrder.slice();
    const locks=Object.entries(app._locks||{}).map(([id,rec])=>({id,label:rec.label,pos:rec.pos,face:rec.face}));
    if(!locks.length)return [];
    const G=app._pathGrid(),{cols,rows,grid,minX,minZ,CS}=G;
    function cell(p,face){
      const n=normal[face]||[0,0],x=p.x+n[0]*2.2,z=p.z+n[1]*2.2;
      let best=-1,d=Infinity;
      for(let i=0;i<grid.length;i++)if(!grid[i]){
        const dx=minX+(i%cols+.5)*CS-x,dz=minZ+(Math.floor(i/cols)+.5)*CS-z,q=dx*dx+dz*dz;
        if(q<d){d=q;best=i;}
      }
      return best;
    }
    locks.forEach(u=>u.cell=cell(u.pos,u.face));
    const remaining=locks.slice(),order=[];
    // C2 is the first storage door on the front building's right-hand face,
    // immediately inside the main gate (15,13), confirmed against buildC().
    let current=remaining.find(u=>u.id==='C2')||remaining.reduce((a,b)=>Math.hypot(a.pos.x-15,a.pos.z-13)<Math.hypot(b.pos.x-15,b.pos.z-13)?a:b);
    while(remaining.length){
      order.push(current.id);remaining.splice(remaining.indexOf(current),1);if(!remaining.length)break;
      const dist=new Int32Array(grid.length).fill(-1),q=new Int32Array(grid.length);let head=0,tail=0;
      if(current.cell>=0){dist[current.cell]=0;q[tail++]=current.cell;}
      while(head<tail){const a=q[head++],c=a%cols,r=Math.floor(a/cols);
        for(const b of [c>0?a-1:-1,c<cols-1?a+1:-1,r>0?a-cols:-1,r<rows-1?a+cols:-1])if(b>=0&&!grid[b]&&dist[b]<0){dist[b]=dist[a]+1;q[tail++]=b;}
      }
      const score=u=>(dist[u.cell]<0?100000:dist[u.cell]*CS)+Math.hypot(u.pos.x-current.pos.x,u.pos.z-current.pos.z)*.01;
      current=remaining.reduce((a,b)=>score(a)<=score(b)?a:b);
    }
    cachedApp=app;cachedOrder=order;return order.slice();
  }
  // These names follow buildColliders() and the original outdoor buildings.
  const buildingNames=['Front building · C','Front wing · G','Building D','Building J','Building E','Building H','West row · 1–24','Back row · 36–50','Office','West row · 12 annex','Building F','Building B','East row · 25–36','East row · 36 annex','Building C · rear row','Building C · rear shed'];
  const sideNames={E:'Right side · East',W:'Left side · West',S:'Front side · South',N:'Back side · North'};
  function sectionFor(app,unit){
    let index=-1,distance=Infinity;
    (app.solids||[]).forEach((s,i)=>{
      const dx=Math.max(s.x0-unit.pos.x,0,unit.pos.x-s.x1),dz=Math.max(s.z0-unit.pos.z,0,unit.pos.z-s.z1),d=dx*dx+dz*dz;
      if(d<distance){distance=d;index=i;}
    });
    return {id:String(index),name:buildingNames[index]||'Property doors',side:sideNames[unit.face]||'Property lane'};
  }
  window.__swPropertyRoute={ordered,sectionFor,gate:{x:15,z:13},first:'C2'};
})();
