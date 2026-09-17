import assert from 'node:assert/strict';

// Compare the browser-facing CSS projection against Three's independent camera
// projection. This checks geometry, not whether a physical GPU paints it.
export function checkRoomProjection(w) {
  const deck=w.document.querySelector('#sw-deck'),d=deck.dataset;
  const camera=new w.THREE.PerspectiveCamera(Number(d.bridgeFov),w.innerWidth/w.innerHeight,.1,160);
  camera.position.set(Number(d.bridgeX),Number(d.bridgeY),Number(d.bridgeZ));
  camera.rotation.set(Number(d.bridgePitch),Number(d.bridgeYaw),0,'YXZ');
  camera.zoom=Number(d.bridgeZoom);camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
  for(const layer of w.document.querySelectorAll('.bridge-face-viewport')){
    if(layer.style.display==='none')continue;
    const [x,y,width,height]=['left','top','width','height'].map(key=>parseFloat(layer.style[key]));
    assert([x,y,width,height].every(Number.isFinite),'Visible paint bounds stay finite');
    assert(x>=-.01&&y>=-.01&&x+width<=w.innerWidth+.01&&y+height<=w.innerHeight+.01,'Visible paint bounds stay inside the viewport');
    assert(!layer.style.transform,'The viewport clip never gets a perspective transform');
    for(const part of layer.querySelectorAll('.bridge-face-projection')){
      if(part.style.display==='none')continue;
      const t=part.style.transform,focal=Number(t.match(/perspective\(([-\d.e+]+)px\)/)[1]);
      const m=t.match(/matrix3d\(([^)]+)\)/)[1].split(',').map(Number);
      const cw=parseFloat(part.style.width),ch=parseFloat(part.style.height);
      const cornerW=[[0,0],[cw,0],[cw,ch],[0,ch]].map(([x,y])=>1-(m[2]*x+m[6]*y+m[14])/focal);
      const minW=Math.min(...cornerW),maxW=Math.max(...cornerW);
      assert(minW>0,part.firstElementChild.className+' paint rectangle crosses the camera at yaw '+d.bridgeYaw+' (w='+minW+')');
      assert(maxW/minW<=2.02,'Each raster rectangle has bounded perspective magnification');
    }
  }
  for(const [selector,world,local] of [
    ['.bridge-floor',[0,0,0],[1100,1200]],
    ['.bridge-ceiling',[0,12,0],[1100,1200]],
    ['.bridge-dais',[0,.292,-1],[300,275]],
    ['.command-screen',[0,6.65,-23.5],[530,238]],
  ]){
    const el=w.document.querySelector(selector),projection=el.parentElement,layer=projection.parentElement;
    if(layer.style.display==='none')continue;
    const transform=projection.style.transform;
    const translation=transform.match(/translate\(([-\d.e+]+)px,([-\d.e+]+)px\)/).slice(1).map(Number);
    const focal=Number(transform.match(/perspective\(([-\d.e+]+)px\)/)[1]);
    const m=transform.match(/matrix3d\(([^)]+)\)/)[1].split(',').map(Number);
    assert(m.every(Number.isFinite),'Every pose component is finite');
    assert.deepEqual([m[3],m[7],m[11],m[15]],[0,0,0,1],'Each face has an ordinary affine 3D pose');
    const point=new w.THREE.Vector4(local[0]+parseFloat(el.style.left),local[1]+parseFloat(el.style.top),0,1).applyMatrix4(new w.THREE.Matrix4().fromArray(m));
    const perspectiveW=1-point.z/focal;
    const expected=new w.THREE.Vector3(...world).project(camera);
    if(perspectiveW<=.01||Math.abs(expected.x)>2||Math.abs(expected.y)>2)continue;
    const x=parseFloat(layer.style.left)+translation[0]+point.x/perspectiveW;
    const y=parseFloat(layer.style.top)+translation[1]+point.y/perspectiveW;
    // The published camera pose is rounded for diagnostics, hence 1px tolerance.
    assert(Math.abs(x-(expected.x+1)*w.innerWidth/2)<1,selector+' retains horizontal perspective');
    assert(Math.abs(y-(1-expected.y)*w.innerHeight/2)<1,selector+' retains vertical perspective');
  }
}
