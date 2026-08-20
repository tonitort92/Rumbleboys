/* Captura ISOMÉTRICA del mundo con ALFA — receta v2 (20/08): congela el loop, renderer PROPIO
   con canal alfa (v1 usaba croma magenta: el tone mapping por-stage lo volvía rosa/rojo pastel y
   el filtro no lo reconocía — HIELO salía sobre rosa y JAPÓN, que ES rosa, se lo comía entero),
   recorte elíptico GLOBAL parametrizable, y el mismo revelado/tinta/limpieza de siempre.
   Parámetros nuevos del JSON de cámara: rx/rz (radios de la elipse global, def. 22/19) y cx
   (centro desplazado en x, p.ej. el saloon del western vive en x≈-14). Elipses prietas (rx≈9-15)
   = modo "trozo"; ojo: matan la losa principal de los mundos de losa gigante (desierto, japón). */
const fs = require('fs');
const CAM = JSON.parse(process.argv[2] || '{"px":24,"py":22,"pz":24,"tx":0,"ty":2,"tz":-3,"fov":30}');
const OUT = process.argv[3] || (__dirname + '\\isla1.png');
let ws, seq=0, pend=new Map();
const send=(m,p)=>new Promise((res,rej)=>{ const id=++seq; pend.set(id,res); ws.send(JSON.stringify({id,method:m,params:p})); setTimeout(()=>{ if(pend.has(id)){pend.delete(id);rej(new Error('timeout '+m));} },60000); });
const ev=async e=>{ const r=await send('Runtime.evaluate',{expression:e,returnByValue:true}); if(r.exceptionDetails) throw new Error('EVAL '+JSON.stringify(r.exceptionDetails.exception&&r.exceptionDetails.exception.description||'').slice(0,500)); return r.result&&r.result.value; };
(async()=>{
  const list = await (await fetch('http://127.0.0.1:9333/json/list')).json();
  const page = list.find(t=>t.type==='page'&&t.url.includes('8282'));
  if(!page){ console.log('SIN NAVEGADOR'); process.exit(2); }
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r,j)=>{ ws.onopen=r; ws.onerror=()=>j(new Error('ws')); });
  ws.onmessage=e=>{ const m=JSON.parse(e.data); if(m.id&&pend.has(m.id)){pend.get(m.id)(m.result);pend.delete(m.id);} };
  await send('Runtime.enable',{});
  let up=false;
  for(let i=0;i<120;i++){ try{ up=await ev('typeof renderer!=="undefined"&&typeof scene!=="undefined"&&typeof players!=="undefined"&&players.length>0'); }catch(e){} if(up) break; await new Promise(r=>setTimeout(r,1000)); }
  if(!up){ console.log('NO CARGO'); process.exit(1); }
  const durl = await ev(`(function(){
    if(!window.__frozen){ window.__frozen = true; window.requestAnimationFrame = ()=>0; }   // congela el loop
    document.querySelectorAll('.overlay').forEach(o=>o.style.display='none');
    const hud=document.getElementById('hud'); if(hud) hud.style.display='none';
    /* la foto es del MUNDO, no de la partida: fuera los muñecos (players; los minions del demo
       caen luego con la regla de SkinnedMesh del recorte global) */
    if(typeof players!=='undefined') for(const p of players){ if(p.gfx && p.gfx.root) p.gfx.root.visible = false; }
    scene.fog = null;
    scene.background = null;   // v2: el alfa lo da el renderer, no un croma que adivinar
    /* ISLA: fuera cielo, mar y segmentos lejanos — queda SOLO el segmento central de la cinta */
    { const box = new THREE.Box3(), sz = new THREE.Vector3();
      for(const ch of scene.children){
        if(!ch.isMesh || !ch.visible) continue;
        try{ box.setFromObject(ch); box.getSize(sz); }catch(e){ continue; }
        if(Math.max(sz.x, sz.z) > 300) ch.visible = false;      // cúpula de cielo y plano de mar
      }
      let central = null;
      if(typeof BELT!=='undefined' && BELT.segs) for(const s of BELT.segs){
        if(s.group) s.group.visible = Math.abs(s.x) < 34;       // solo el segmento en x≈0
        if(Math.abs(s.x) < 34) central = s;
      }
      const wp = new THREE.Vector3();
      scene.traverse(o=>{ if(o.isMesh && o.visible){ o.getWorldPosition(wp);
        if(wp.y > 16 || Math.abs(wp.x) > 32) o.visible = false;
        else if(typeof _cloudMat!=='undefined' && o.material === _cloudMat) o.visible = false;   // NUBES: por su material único
      } });
      /* SIN CORTES: fuera toda malla del segmento que CRUCE el límite lateral — se recorta por
         PLATAFORMA ENTERA, no por píxel, y la silueta queda orgánica */
      if(central && central.group){
        const bb = new THREE.Box3(), ctr = new THREE.Vector3();
        const RX = 27, RZ = 24, CZ = -3;   // ELIPSE de selección: isla ovalada orgánica, no rectángulo cortado
        const vivos = [];
        for(const ch of [...central.group.children]){
          if(!ch.visible) continue;
          try{ bb.setFromObject(ch); bb.getCenter(ctr); }catch(e){ continue; }
          const ex = ctr.x/RX, ez = (ctr.z-CZ)/RZ;
          if(ex*ex + ez*ez > 1){ ch.visible = false; continue; }   // plataforma ENTERA dentro o fuera
          vivos.push({ ch, b: bb.clone() });
        }
        /* TEST DE SOPORTE: una pieza ELEVADA sin nada debajo que solape su huella es un puente
           huérfano (su torre cruzaba el límite y se fue) → fuera. Los puentes de verdad apoyan
           los extremos en plataformas visibles y pasan. */
        for(const v of vivos){
          if(v.b.min.y <= 2.5) continue;
          let apoyado = false;
          for(const o of vivos){ if(o===v) continue;
            if(o.b.min.y >= v.b.min.y - 0.5) continue;
            if(o.b.max.x > v.b.min.x-0.3 && o.b.min.x < v.b.max.x+0.3 &&
               o.b.max.z > v.b.min.z-0.3 && o.b.min.z < v.b.max.z+0.3){ apoyado = true; break; }
          }
          if(!apoyado) v.ch.visible = false;
        }
      }
      /* v2: RECORTE ELÍPTICO GLOBAL — la selección de arriba solo mira central.group, pero el mar
         de nubes del desierto o los icebergs del hielo viven en otros grupos y llenaban el cuadro.
         Regla pareja para TODO lo visible: personajes fuera (SkinnedMesh), gigantes fuera
         (mega-suelos y mares de nubes, bbox > 55 u), fuera de la elipse fuera, y fuera también lo
         que CRUZA el borde de la elipse (puentes/cintas: mejor un hueco que un puente rebanado). */
      { const bbG = new THREE.Box3(), szG = new THREE.Vector3(), ctG = new THREE.Vector3();
        const RXg = ${CAM.rx||22}, RZg = ${CAM.rz||19}, CZg = ${CAM.cz!=null?CAM.cz:-3}, CXg = ${CAM.cx||0};
        scene.traverse(o=>{ if(!o.isMesh || !o.visible) return;
          if(o.isSkinnedMesh){ o.visible = false; return; }
          try{ bbG.setFromObject(o); bbG.getSize(szG); bbG.getCenter(ctG); }catch(e){ return; }
          if(szG.x > 55 || szG.z > 55){ o.visible = false; return; }
          const ex = (ctG.x-CXg)/RXg, ez = (ctG.z-CZg)/RZg;
          if(ex*ex + ez*ez > 1 || ctG.y > 16 || ctG.y < -6){ o.visible = false; return; }
          if(bbG.min.x < CXg-RXg-4 || bbG.max.x > CXg+RXg+4 ||
             bbG.min.z < CZg-RZg-4 || bbG.max.z > CZg+RZg+4) o.visible = false;
        });
      }
    }
    const C = ${JSON.stringify(CAM)};
    camera.position.set(C.px, C.py, C.pz);
    camera.lookAt(C.tx, C.ty, C.tz);
    camera.fov = C.fov; camera.updateProjectionMatrix();
    /* SUPERSAMPLING ×2: render a doble resolución y reducción a la mitad = antialiasing real
       (el render crudo sin FXAA salía "crispy") */
    /* v2: renderer PROPIO con alpha:true — el del juego nació sin canal alfa. Compila sus
       programas una vez (en SwiftShader tarda unos segundos, da igual); misma curva que el juego. */
    if(!window.__capGL) window.__capGL = new THREE.WebGLRenderer({ alpha:true, antialias:true });
    const pr2 = window.__capGL;
    pr2.setPixelRatio(renderer.getPixelRatio()*2); pr2.setSize(innerWidth, innerHeight, false);
    pr2.toneMapping = renderer.toneMapping; pr2.toneMappingExposure = renderer.toneMappingExposure;
    if(renderer.outputEncoding !== undefined) pr2.outputEncoding = renderer.outputEncoding;
    pr2.setClearColor(0x000000, 0);
    pr2.render(scene, camera);                            // crudo: sin vignette/bloom/tinta
    const src = pr2.domElement;
    const c = document.createElement('canvas'); c.width = (src.width/2)|0; c.height = (src.height/2)|0;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.drawImage(src, 0, 0, c.width, c.height);
    const id = g.getImageData(0, 0, c.width, c.height), d = id.data;
    let minX=c.width, minY=c.height, maxX=0, maxY=0;
    for(let i=0;i<d.length;i+=4){
      const r=d[i], gg=d[i+1], b=d[i+2];
      /* v2: el alfa ya viene del renderer — sin croma que adivinar */
      if(d[i+3] < 12){ d[i+3] = 0; }
      else {                                              // píxel de la ISLA: le devolvemos el PUNCH del grade
        const SAT = 1.3, CON = 1.2, GAM = 1.55, DIM = 0.88, PIV = 118;   // v5: bajada global de luz + gamma honda + pivote bajo
        const l = 0.299*d[i] + 0.587*d[i+1] + 0.114*d[i+2];
        for(let ch2=0; ch2<3; ch2++){
          let v = l + (d[i+ch2]-l)*SAT;                   // saturación
          v = 255*Math.pow(Math.max(0,v)/255, GAM);       // gamma: oscurece medios/altas sin aplastar sombras
          v *= DIM;                                       // menos luz global
          v = (v-PIV)*CON + PIV;                          // contraste con pivote bajo (no re-aclara)
          d[i+ch2] = Math.max(0, Math.min(255, Math.round(v)));
        }
      }
      if(d[i+3] > 20){ const px=(i/4)%c.width, py=((i/4)/c.width)|0;
        if(px<minX)minX=px; if(px>maxX)maxX=px; if(py<minY)minY=py; if(py>maxY)maxY=py; }
    }
    /* ►TINTA 2D (Toni: "te falta el outline del mapa"): el ►INK del juego es un detector de
       bordes por profundidad; aquí lo emulamos con Sobel sobre la LUMINANCIA (los saltos de cara
       del low-poly coinciden con los saltos de profundidad) + línea de SILUETA donde el alfa
       toca transparente. Mismo tinte oscuro azulado que el ink real. */
    { const W2=c.width, H2=c.height;
      const lum = new Float32Array(W2*H2);
      for(let p=0;p<W2*H2;p++) lum[p] = d[p*4+3]>40 ? (0.299*d[p*4]+0.587*d[p*4+1]+0.114*d[p*4+2]) : -1;
      const ink = (p,k)=>{ d[p*4] = d[p*4]*(1-k) + 5*k; d[p*4+1] = d[p*4+1]*(1-k) + 5*k; d[p*4+2] = d[p*4+2]*(1-k) + 13*k; };
      for(let y=1;y<H2-1;y++) for(let x=1;x<W2-1;x++){
        const p=y*W2+x; if(lum[p]<0) continue;
        if(lum[p-1]<0 || lum[p+1]<0 || lum[p-W2]<0 || lum[p+W2]<0){ ink(p, .6); continue; }   // SILUETA
        const gx = lum[p+1]-lum[p-1], gy = lum[p+W2]-lum[p-W2];
        const e = Math.hypot(gx, gy);
        if(e > 30) ink(p, Math.min(.45, (e-30)/80));                                          // tinta interior
      }
    }
    /* LIMPIEZA 2D: etiquetado de componentes conexas sobre el alfa — se conservan solo las
       manchas grandes (la isla y lo pegado a ella); tablones/nubes/motas sueltas fuera, vengan
       del grupo que vengan. */
    { const W=c.width, H=c.height, lab=new Int32Array(W*H); let nextL=0; const sizes=[];
      const stack=[];
      for(let p=0;p<W*H;p++){
        if(lab[p]!==0 || d[p*4+3]<=40) continue;
        nextL++; let sz=0; stack.length=0; stack.push(p); lab[p]=nextL;
        while(stack.length){ const q=stack.pop(); sz++;
          const qx=q%W, qy=(q/W)|0;
          if(qx>0){ const r=q-1; if(!lab[r]&&d[r*4+3]>40){ lab[r]=nextL; stack.push(r); } }
          if(qx<W-1){ const r=q+1; if(!lab[r]&&d[r*4+3]>40){ lab[r]=nextL; stack.push(r); } }
          if(qy>0){ const r=q-W; if(!lab[r]&&d[r*4+3]>40){ lab[r]=nextL; stack.push(r); } }
          if(qy<H-1){ const r=q+W; if(!lab[r]&&d[r*4+3]>40){ lab[r]=nextL; stack.push(r); } }
        }
        sizes[nextL]=sz;
      }
      let big=0; for(let l=1;l<=nextL;l++) if(sizes[l]>(sizes[big]||0)) big=l;
      const min=(sizes[big]||0)*0.04;
      minX=W; minY=H; maxX=0; maxY=0;
      for(let p=0;p<W*H;p++){
        if(d[p*4+3]>0 && (lab[p]===0 || sizes[lab[p]]<min)) d[p*4+3]=0;
        if(d[p*4+3]>20){ const px=p%W, py=(p/W)|0;
          if(px<minX)minX=px; if(px>maxX)maxX=px; if(py<minY)minY=py; if(py>maxY)maxY=py; }
      }
    }
    g.putImageData(id, 0, 0);
    const pad=8, w=Math.max(1,maxX-minX+2*pad), h=Math.max(1,maxY-minY+2*pad);
    const c2 = document.createElement('canvas'); c2.width=w; c2.height=h;
    c2.getContext('2d').drawImage(c, minX-pad, minY-pad, w, h, 0, 0, w, h);   // recorte al contenido
    return c2.toDataURL('image/png');
  })()`);
  fs.writeFileSync(OUT, Buffer.from(durl.split(',')[1], 'base64'));
  console.log('guardada', OUT);
  process.exit(0);
})().catch(e=>{ console.error('ERROR', e.message); process.exit(1); });
