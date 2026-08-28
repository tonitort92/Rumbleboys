/* Genera mundo<N>_iso.png para TODOS los stages del motor, en UNA sola sesión de navegador.
   Reutiliza la receta de _captura_isla.js (recorte elíptico por plataforma entera, revelado,
   tinta 2D y limpieza por componentes conexas) con dos cambios:

   1. CÁMARA AUTO-ENCAJADA. El original lleva un JSON de cámara a mano por mundo y, cuando la isla
      no cabe en el viewport, el recorte final la siega: es lo que le pasa al mundo 2 (la pasarela
      de abajo a la derecha y la plataforma del borde salen rebanadas). Aquí se conserva la
      DIRECCIÓN isométrica del JSON y se recalcula la distancia proyectando las 8 esquinas de la
      caja de lo que ha sobrevivido al filtro, iterando hasta que encaja con margen. Así no se
      corta nada y además la isla llena el cuadro.

   2. VISIBILIDAD RESTAURABLE. Cada captura "quema" la escena (deja medio mundo en visible=false).
      El original moría después de una; aquí se guarda el estado antes y se restaura después, que
      es lo que permite hacer los doce de un tirón sin recargar los 95 MB cada vez.
*/
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 9391;
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = 'http://localhost:8181/rumble_arena_cinta_v4.html?explorar';
const DEST = 'C:/Users/tonit/Desktop/Rumbleboys Alfa';
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* dirección isométrica y elipse por stage. La dirección es la del mundo 1 salvo donde el mundo
   pide otra cosa; los radios salen del tamaño real del segmento (la jungla mide 67 u de largo). */
const STAGES = [
  { st: 1,  rx: 27, rz: 24, cz: -3 },
  { st: 2,  rx: 34, rz: 27, cz: 4  },
  { st: 3,  rx: 30, rz: 26, cz: 0  },
  { st: 11, rx: 30, rz: 26, cz: 0  },
  { st: 4,  rx: 32, rz: 27, cz: 0  },
  { st: 5,  rx: 30, rz: 26, cz: 0  },
  /* ►BARCO (Toni 28/08: "en el selector falta el barco pirata, no ha salido en la imagen").
     El barco NO es decorado: es el suelo del mundo 12. Pero mide 60 u de eslora (PIR_SHIP_L,
     HTML:33711) en UNA sola malla, y con PIR_SHIP_Y=-2 su casco tiene el centro del bbox en y~18.4,
     asi que los tres cortes de abajo lo mataban por separado. Los canones y barriles de cubierta
     miden 2-3 u y SI pasaban: por eso la caratura vieja tenia canones flotando en el vacio.
     Se le da salvoconducto explicito en vez de aflojar los umbrales, que estan ahi por los
     mega-suelos y los mares de nubes; y `minFrac` baja el liston de la limpieza por manchas, porque
     con el barco dentro la componente mayor pasa a ser EL BARCO y al 4% de su area se irian los dos
     islotes con palmera que hoy salen. */
  { st: 12, rx: 32, rz: 27, cz: 0, keep: ['PIR.ship'], minFrac: 0.015 },
  { st: 7,  rx: 30, rz: 26, cz: 0  },
  { st: 8,  rx: 30, rz: 26, cz: 0  },
  { st: 10, rx: 30, rz: 26, cz: 0  },
  /* NO metas aqui el 13 ni el 14. Cuadrimania y Arena montan su escena en su PROPIO modulo al
     entrar, y rebuildBelt() no les monta nada: salen en blanco. Sus caratulas son fotos de
     gameplay y las hace _captura_minis.js. Estaban en esta lista y podian sobrescribir dos PNG
     que estaban bien. */
];

(async () => {
  const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader', '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + path.join(__dirname, 'prof_isla'),
    '--autoplay-policy=no-user-gesture-required', '--window-size=1600,900', 'about:blank'],
    { stdio: 'ignore' });

  let tabs = null;
  for (let i = 0; i < 60 && !tabs; i++) {
    await sleep(500);
    try {
      const j = await (await fetch('http://127.0.0.1:' + PORT + '/json')).json();
      const p = j.filter(t => t.type === 'page' && t.webSocketDebuggerUrl && !/^(chrome|devtools)-/.test(t.url));
      if (p.length) tabs = p;
    } catch (e) {}
  }
  if (!tabs) { console.log('SIN PESTANIA'); edge.kill(); return; }

  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
  let id = 0; const pend = new Map();
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
  await new Promise(r => ws.addEventListener('open', r));
  const send = (m, p) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method: m, params: p || {} })); });
  const ev = async x => {
    const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true });
    if (r.result && r.result.exceptionDetails) return { err: JSON.stringify(r.result.exceptionDetails).slice(0, 500) };
    return { v: r.result && r.result.result && r.result.result.value };
  };

  await send('Runtime.enable'); await send('Page.enable');
  await send('Page.navigate', { url: URL });
  let listo = false;
  for (let i = 0; i < 260 && !listo; i++) {
    await sleep(1000);
    listo = (await ev("(typeof renderer!=='undefined' && typeof scene!=='undefined' && typeof BELT!=='undefined' && typeof players!=='undefined' && players.length>0)")).v === true;
    if (i % 30 === 29) console.log('  ...cargando', i + 1, 's');
  }
  if (!listo) { console.log('NO CARGO'); ws.close(); edge.kill(); return; }
  console.log('cargado');

  // ---- la función de captura, definida UNA vez en la página ----
  const def = await ev(String.raw`(function(){
  window.__snapVis = function(){
    const v = []; scene.traverse(o => { if(o.isMesh) v.push([o, o.visible]); });
    return { v, fog: scene.fog, bg: scene.background,
             pl: (typeof players!=='undefined' ? players.map(p => [p, p.gfx && p.gfx.root ? p.gfx.root.visible : null]) : []) };
  };
  window.__restVis = function(s){
    for(const [o, x] of s.v) o.visible = x;
    scene.fog = s.fog; scene.background = s.bg;
    for(const [p, x] of s.pl) if(x !== null && p.gfx && p.gfx.root) p.gfx.root.visible = x;
  };
  window.__capturaIsla = function(C){
    if(!window.__frozen){ window.__frozen = true; window.requestAnimationFrame = () => 0; }
    document.querySelectorAll('.overlay').forEach(o => o.style.display = 'none');
    const hud = document.getElementById('hud'); if(hud) hud.style.display = 'none';
    if(typeof players!=='undefined') for(const p of players){ if(p.gfx && p.gfx.root) p.gfx.root.visible = false; }
    scene.fog = null; scene.background = null;

    /* ---- filtrado: idéntico a _captura_isla.js ---- */
    /* ►KEEP: salvoconducto por stage. Las rutas de C.keep se resuelven contra el scope del juego
       (los const de modulo como PIR o BELT no cuelgan de window, pero si son visibles aqui, que es
       como este mismo script usa scene y _cloudMat), y TODO su subarbol queda exento de los
       cortes por tamano, por altura y por la elipse. Se autolimita solo: PIR.ship solo existe con
       STAGE=12. Es preferible a subir los umbrales para ese stage, porque subirlos dejaria entrar
       tambien cualquier otra cosa que midiera entre 55 y 65 o volara entre 16 y 40 — justo lo que
       esos numeros estan ahi para matar. */
    const KEEP = new Set();
    for(const ruta of (C.keep || [])){
      let o = null;
      try{ o = eval(ruta); }catch(e){ console.warn('[keep] no resuelve ' + ruta, e && e.message); }
      if(o && o.traverse) o.traverse(x => KEEP.add(x));
    }
    const MAXSZ = (C.maxSz != null ? C.maxSz : 55), MAXY = (C.maxY != null ? C.maxY : 16),
          MINY  = (C.minY  != null ? C.minY  : -6), PAD  = (C.pad  != null ? C.pad  : 4);
    { const box = new THREE.Box3(), sz = new THREE.Vector3();
      for(const ch of scene.children){
        if(!ch.isMesh || !ch.visible) continue;
        try{ box.setFromObject(ch); box.getSize(sz); }catch(e){ continue; }
        if(Math.max(sz.x, sz.z) > 300) ch.visible = false;
      }
      let central = null;
      if(typeof BELT!=='undefined' && BELT.segs) for(const s of BELT.segs){
        if(s.group) s.group.visible = Math.abs(s.x) < 34;
        if(Math.abs(s.x) < 34) central = s;
      }
      const wp = new THREE.Vector3();
      scene.traverse(o => { if(o.isMesh && o.visible){ if(KEEP.has(o)) return; o.getWorldPosition(wp);
        if(wp.y > MAXY || Math.abs(wp.x) > 32) o.visible = false;
        else if(typeof _cloudMat!=='undefined' && o.material === _cloudMat) o.visible = false;
      } });
      if(central && central.group){
        const bb = new THREE.Box3(), ctr = new THREE.Vector3();
        const RX = C.rx || 27, RZ = C.rz || 24, CZ = (C.cz != null ? C.cz : -3), CX = C.cx || 0;
        const vivos = [];
        for(const ch of [...central.group.children]){
          if(!ch.visible || KEEP.has(ch)) continue;
          try{ bb.setFromObject(ch); bb.getCenter(ctr); }catch(e){ continue; }
          const szc = bb.getSize(new THREE.Vector3());
          if(szc.x > MAXSZ || szc.z > MAXSZ) continue;
          const ex = (ctr.x - CX)/RX, ez = (ctr.z - CZ)/RZ;
          if(ex*ex + ez*ez > 1){ ch.visible = false; continue; }
          vivos.push({ ch, b: bb.clone() });
        }
        for(const v of vivos){
          if(v.b.min.y <= (C.sup != null ? C.sup : 2.5)) continue;
          let apoyado = false;
          for(const o of vivos){ if(o === v) continue;
            if(o.b.min.y >= v.b.min.y - 0.5) continue;
            if(o.b.max.x > v.b.min.x-0.3 && o.b.min.x < v.b.max.x+0.3 &&
               o.b.max.z > v.b.min.z-0.3 && o.b.min.z < v.b.max.z+0.3){ apoyado = true; break; }
          }
          if(!apoyado) v.ch.visible = false;
        }
      }
      { const bbG = new THREE.Box3(), szG = new THREE.Vector3(), ctG = new THREE.Vector3();
        const RXg = C.rx || 22, RZg = C.rz || 19, CZg = (C.cz != null ? C.cz : -3), CXg = C.cx || 0;
        scene.traverse(o => { if(!o.isMesh || !o.visible) return;
          if(KEEP.has(o)) return;
          if(o.isSkinnedMesh){ o.visible = false; return; }
          try{ bbG.setFromObject(o); bbG.getSize(szG); bbG.getCenter(ctG); }catch(e){ return; }
          if(szG.x > MAXSZ || szG.z > MAXSZ){ o.visible = false; return; }
          const ex = (ctG.x - CXg)/RXg, ez = (ctG.z - CZg)/RZg;
          if(ex*ex + ez*ez > 1 || ctG.y > MAXY || ctG.y < MINY){ o.visible = false; return; }
          if(bbG.min.x < CXg-RXg-PAD || bbG.max.x > CXg+RXg+PAD ||
             bbG.min.z < CZg-RZg-PAD || bbG.max.z > CZg+RZg+PAD) o.visible = false;
        });
      }
    }

    /* ---- CÁMARA AUTO-ENCAJADA (lo nuevo) ----
       Se conserva la DIRECCIÓN isométrica y se recalcula la distancia proyectando las 8 esquinas
       de la caja de lo que ha sobrevivido: si algo se sale (m>1) se aleja, si sobra sitio (m<1) se
       acerca. Converge en 3-4 vueltas. Es lo que impide que una pasarela quede rebanada por el
       borde del viewport, que es de donde salía el corte del mundo 2. */
    const caja = new THREE.Box3(), tmpB = new THREE.Box3();
    let hay = false;
    scene.traverse(o => { if(o.isMesh && o.visible){ try{ tmpB.setFromObject(o); caja.union(tmpB); hay = true; }catch(e){} } });
    if(!hay) return null;
    const ctr = caja.getCenter(new THREE.Vector3());
    const esq = [];
    for(let i = 0; i < 8; i++) esq.push(new THREE.Vector3(
      (i&1) ? caja.max.x : caja.min.x, (i&2) ? caja.max.y : caja.min.y, (i&4) ? caja.max.z : caja.min.z));
    const dir = new THREE.Vector3(C.px - C.tx, C.py - C.ty, C.pz - C.tz).normalize();
    let dist = new THREE.Vector3(C.px - C.tx, C.py - C.ty, C.pz - C.tz).length();
    camera.fov = C.fov;
    for(let it = 0; it < 6; it++){
      camera.position.copy(ctr).addScaledVector(dir, dist);
      camera.lookAt(ctr);
      camera.updateProjectionMatrix(); camera.updateMatrixWorld(true);
      let m = 0;
      for(const p of esq){ const q = p.clone().project(camera); m = Math.max(m, Math.abs(q.x), Math.abs(q.y)); }
      if(!isFinite(m) || m <= 0) break;
      dist *= m * 1.04;                       // 4% de margen: ni corta ni deja marco de sobra
    }

    /* ---- render + revelado + tinta + limpieza: idéntico al original ---- */
    if(!window.__capGL) window.__capGL = new THREE.WebGLRenderer({ alpha:true, antialias:true });
    const pr2 = window.__capGL;
    pr2.setPixelRatio(renderer.getPixelRatio()*2); pr2.setSize(innerWidth, innerHeight, false);
    pr2.toneMapping = renderer.toneMapping; pr2.toneMappingExposure = renderer.toneMappingExposure;
    if(renderer.outputEncoding !== undefined) pr2.outputEncoding = renderer.outputEncoding;
    pr2.setClearColor(0x000000, 0);
    pr2.render(scene, camera);
    const src = pr2.domElement;
    const c = document.createElement('canvas'); c.width = (src.width/2)|0; c.height = (src.height/2)|0;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.drawImage(src, 0, 0, c.width, c.height);
    const idt = g.getImageData(0, 0, c.width, c.height), d = idt.data;
    let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
    for(let i = 0; i < d.length; i += 4){
      if(d[i+3] < 12){ d[i+3] = 0; }
      else {
        const SAT = 1.3, CON = 1.2, GAM = 1.55, DIM = 0.88, PIV = 118;
        const l = 0.299*d[i] + 0.587*d[i+1] + 0.114*d[i+2];
        for(let k = 0; k < 3; k++){
          let v = l + (d[i+k]-l)*SAT;
          v = 255*Math.pow(Math.max(0,v)/255, GAM);
          v *= DIM;
          v = (v-PIV)*CON + PIV;
          d[i+k] = Math.max(0, Math.min(255, Math.round(v)));
        }
      }
      if(d[i+3] > 20){ const px = (i/4)%c.width, py = ((i/4)/c.width)|0;
        if(px<minX)minX=px; if(px>maxX)maxX=px; if(py<minY)minY=py; if(py>maxY)maxY=py; }
    }
    { const W2 = c.width, H2 = c.height;
      const lum = new Float32Array(W2*H2);
      for(let p = 0; p < W2*H2; p++) lum[p] = d[p*4+3] > 40 ? (0.299*d[p*4]+0.587*d[p*4+1]+0.114*d[p*4+2]) : -1;
      const ink = (p,k) => { d[p*4] = d[p*4]*(1-k)+5*k; d[p*4+1] = d[p*4+1]*(1-k)+5*k; d[p*4+2] = d[p*4+2]*(1-k)+13*k; };
      for(let y = 1; y < H2-1; y++) for(let x = 1; x < W2-1; x++){
        const p = y*W2+x; if(lum[p] < 0) continue;
        if(lum[p-1]<0 || lum[p+1]<0 || lum[p-W2]<0 || lum[p+W2]<0){ ink(p, .6); continue; }
        const gx = lum[p+1]-lum[p-1], gy = lum[p+W2]-lum[p-W2];
        const e = Math.hypot(gx, gy);
        if(e > 30) ink(p, Math.min(.45, (e-30)/80));
      }
    }
    { const W = c.width, H = c.height, lab = new Int32Array(W*H); let nextL = 0; const sizes = [];
      const stack = [];
      for(let p = 0; p < W*H; p++){
        if(lab[p] !== 0 || d[p*4+3] <= 40) continue;
        nextL++; let sz = 0; stack.length = 0; stack.push(p); lab[p] = nextL;
        while(stack.length){ const q = stack.pop(); sz++;
          const qx = q%W, qy = (q/W)|0;
          if(qx>0){ const r=q-1; if(!lab[r]&&d[r*4+3]>40){ lab[r]=nextL; stack.push(r); } }
          if(qx<W-1){ const r=q+1; if(!lab[r]&&d[r*4+3]>40){ lab[r]=nextL; stack.push(r); } }
          if(qy>0){ const r=q-W; if(!lab[r]&&d[r*4+3]>40){ lab[r]=nextL; stack.push(r); } }
          if(qy<H-1){ const r=q+W; if(!lab[r]&&d[r*4+3]>40){ lab[r]=nextL; stack.push(r); } }
        }
        sizes[nextL] = sz;
      }
      let big = 0; for(let l = 1; l <= nextL; l++) if(sizes[l] > (sizes[big]||0)) big = l;
      const min = (sizes[big]||0) * (C.minFrac != null ? C.minFrac : 0.04);   // ►BARCO: bajable por stage, ver minFrac en STAGES
      minX = W; minY = H; maxX = 0; maxY = 0;
      for(let p = 0; p < W*H; p++){
        if(d[p*4+3] > 0 && (lab[p] === 0 || sizes[lab[p]] < min)) d[p*4+3] = 0;
        if(d[p*4+3] > 20){ const px = p%W, py = (p/W)|0;
          if(px<minX)minX=px; if(px>maxX)maxX=px; if(py<minY)minY=py; if(py>maxY)maxY=py; }
      }
    }
    g.putImageData(idt, 0, 0);
    const pad = 8, w = Math.max(1, maxX-minX+2*pad), h = Math.max(1, maxY-minY+2*pad);
    const c2 = document.createElement('canvas'); c2.width = w; c2.height = h;
    c2.getContext('2d').drawImage(c, minX-pad, minY-pad, w, h, 0, 0, w, h);
    /* ¿toca el borde del viewport? Si el contenido llega al canvas, algo se ha quedado fuera. */
    const roza = (minX <= 1 || minY <= 1 || maxX >= c.width-2 || maxY >= c.height-2);
    return { png: c2.toDataURL('image/png'), w, h, roza };
  };
  return 'ok';
})()`);
  console.log('capturador:', def.v || def.err);
  if (def.err) { ws.close(); edge.kill(); return; }

  const DIR_ISO = { px: 24, py: 22, pz: 24, tx: 0, ty: 2, tz: -3, fov: 30 };
  for (const S of STAGES) {
    const C = Object.assign({}, DIR_ISO, S);
    const prep = await ev(`(async function(){
      STAGE = ${S.st}; _stagePreview = ${S.st};
      try{ if(typeof ensureStageAssets==='function') await ensureStageAssets(${S.st}); }catch(e){}
      applyStageTheme(${S.st}); rebuildBelt();
      return (typeof BELT!=='undefined' && BELT.segs) ? BELT.segs.length : -1;
    })()`);
    await sleep(2500);
    const snap = await ev(`(window.__snap = window.__snapVis(), 'ok')`);
    const r = await ev(`(function(){ const x = window.__capturaIsla(${JSON.stringify(C)}); window.__restVis(window.__snap);
      if(!x) return null; window.__png = x.png; return JSON.stringify({w:x.w,h:x.h,roza:x.roza}); })()`);
    if (r.err || !r.v) { console.log('  stage', S.st, 'FALLO', (r.err||'sin geometria').slice(0,200)); continue; }
    const meta = JSON.parse(r.v);
    const durl = await ev('window.__png || ""');
    if (durl.v && durl.v.length > 100) {
      fs.writeFileSync(path.join(DEST, 'mundo' + S.st + '_iso.png'), Buffer.from(durl.v.split(',')[1], 'base64'));
    }
    console.log('  stage ' + String(S.st).padStart(2) + '  segs=' + prep.v + '  ' + meta.w + 'x' + meta.h +
                (meta.roza ? '  ROZA EL BORDE' : '') + '  ' + (durl.v ? Math.round(durl.v.length/1365) + ' KB' : 'SIN PNG'));
  }
  ws.close(); edge.kill(); await sleep(300); process.exit(0);
})();
