/* FICHAS DE PERSONAJE con ALFA: monta un renderer offscreen propio dentro de la página del juego,
   clona la plantilla GLB de cada clase (_charTpls), le aplica el recolor de marca y el arma de
   preview, y vuelca un PNG transparente por (clase × ángulo). Salida: fichas_chars/<clase>_<ang>.png
   Uso: node _fichas_chars.js <carpetaSalida>   (Edge headless en :9444, juego en :8181) */
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || (__dirname + '\\fichas_chars');
const PORT_CDP = 9444, PORT_WEB = 8181;
const W = 900, H = 1200;                       // resolución por ficha
const ANGLES = [ ['frente', 0], ['tres4', 35], ['perfil', 90], ['espalda', 180] ];

let ws, seq = 0, pend = new Map();
const send = (m, p) => new Promise((res, rej) => {
  const id = ++seq; pend.set(id, res);
  ws.send(JSON.stringify({ id, method: m, params: p }));
  setTimeout(() => { if (pend.has(id)) { pend.delete(id); rej(new Error('timeout ' + m)); } }, 120000);
});
const ev = async (e) => {
  const r = await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error('EVAL ' + String((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || '').slice(0, 800));
  return r.result && r.result.value;
};

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  const list = await (await fetch(`http://127.0.0.1:${PORT_CDP}/json/list`)).json();
  const page = list.find(t => t.type === 'page' && t.url.includes(String(PORT_WEB)));
  if (!page) { console.log('SIN PESTAÑA del juego'); process.exit(2); }
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('ws')); });
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); } };
  await send('Runtime.enable', {});

  /* espera a que TODAS las plantillas de clase hayan parseado (95 MB de .js: 40-85 s en frío) */
  const ROSTER = ['samurai', 'voxelhero', 'nun', 'knight', 'link', 'archer'];
  let ready = null;
  for (let i = 0; i < 180; i++) {
    try {
      ready = await ev(`(function(){ if(typeof _charTpls==='undefined'||!window.THREE) return null;
        return ${JSON.stringify(ROSTER)}.filter(k=>!!(_charTpls[k]&&_charTpls[k].scene)); })()`);
    } catch (e) { }
    if (ready && ready.length === ROSTER.length) break;
    if (i % 10 === 0) console.log(`  esperando modelos… ${ready ? ready.length : 0}/${ROSTER.length}`);
    await new Promise(r => setTimeout(r, 1000));
  }
  if (!ready || !ready.length) { console.log('NO CARGARON LOS MODELOS'); process.exit(1); }
  console.log('modelos listos: ' + ready.join(', '));

  /* estudio offscreen: renderer alpha propio, 3 luces como el preview del carrusel pero más suaves */
  await ev(`(function(){
    if(window.__frame) return 'ya';
    if(window.__fichaStudio){ try{ window.__fichaStudio.r.dispose(); }catch(e){} window.__fichaStudio=null; }   // relanzar el script no debe fabricar un 2º contexto WebGL
    const cv = document.createElement('canvas'); cv.width=${W}; cv.height=${H};
    const r = new THREE.WebGLRenderer({ canvas:cv, alpha:true, antialias:true, preserveDrawingBuffer:true });
    r.setPixelRatio(1); r.setSize(${W}, ${H}, false); r.setClearColor(0x000000, 0);
    if(THREE.sRGBEncoding) r.outputEncoding = THREE.sRGBEncoding;
    const sc = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(28, ${W}/${H}, 0.1, 100);
    /* LUZ NEUTRA y contenida: la ficha es referencia de COLOR, no una pose de juego. Con la luz
       del carrusel (key 1.7 cálida) el caballero y el mago salían quemados y perdían su color. */
    sc.add(new THREE.HemisphereLight(0xeef2ff, 0x77707a, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 0.95); key.position.set(3.5, 5, 4.5); sc.add(key);
    const rim = new THREE.DirectionalLight(0xbcd4ff, 0.45); rim.position.set(-4, 3, -3.5); sc.add(rim);
    const fill = new THREE.DirectionalLight(0xffffff, 0.30); fill.position.set(0, 2, 6); sc.add(fill);
    window.__fichaStudio = { cv, r, sc, cam, cur:null };

    /* --- medida de SILUETA: el único encuadre fiable con mallas con skin --- */
    const m2 = document.createElement('canvas'); m2.width=${W}; m2.height=${H};
    const cx2 = m2.getContext('2d', { willReadFrequently:true });
    function siluetaEnAngulo(deg){
      const S = window.__fichaStudio;
      S.cur.rotation.y = deg * Math.PI/180; S.cur.updateMatrixWorld(true);
      S.r.render(S.sc, S.cam);
      cx2.clearRect(0,0,${W},${H}); cx2.drawImage(S.cv,0,0);
      const d = cx2.getImageData(0,0,${W},${H}).data;
      let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
      for(let y=0;y<${H};y+=2) for(let x=0;x<${W};x+=2){
        if(d[(y*${W}+x)*4+3] > 12){ if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; }
      }
      return (x1<0) ? null : {x0,x1,y0,y1};
    }
    /* encuadre COMÚN a todos los ángulos: el personaje sale al mismo tamaño en las 4 fichas */
    window.__frame = function(angles){
      const S = window.__fichaStudio, OBJ = 0.84;   // fracción del alto que debe ocupar
      for(let it=0; it<7; it++){
        let u = null;
        for(const a of angles){ const b = siluetaEnAngulo(a); if(!b) continue;
          u = u ? {x0:Math.min(u.x0,b.x0), x1:Math.max(u.x1,b.x1), y0:Math.min(u.y0,b.y0), y1:Math.max(u.y1,b.y1)} : b; }
        if(!u){ S.cam.position.z *= 2.2; S.cam.lookAt(S.cam.position.x, S.cam.position.y, 0); continue; }   // fuera de cuadro: aléjate y vuelve a mirar
        const hpx = u.y1-u.y0, wpx = u.x1-u.x0;
        const f = Math.max(hpx/(${H}*OBJ), wpx/(${W}*OBJ));
        const wpp = (2*S.cam.position.z*Math.tan(S.cam.fov*Math.PI/360))/${H};   // unidades de mundo por píxel
        S.cam.position.y -= ((u.y0+u.y1)/2 - ${H}/2) * wpp;
        S.cam.position.x += ((u.x0+u.x1)/2 - ${W}/2) * wpp;
        S.cam.position.z *= f;
        S.cam.lookAt(S.cam.position.x, S.cam.position.y, 0);
        if(Math.abs(f-1) < 0.02 && Math.abs((u.y0+u.y1)/2 - ${H}/2) < 8) return JSON.stringify({it, hpx, wpx});
      }
      return JSON.stringify({ it:'max' });
    };
    return 'ok';
  })()`);

  const PUP_H = 2.4;
  for (const k of ready) {
    /* monta la clase una vez; luego solo se gira la raíz y se re-renderiza */
    const info = await ev(`(function(){
      const S = window.__fichaStudio;
      if(S.cur){ S.sc.remove(S.cur); S.cur = null; }
      const tpl = _charTpls[${JSON.stringify(k)}]; if(!tpl) return 'sin tpl';
      const k = ${JSON.stringify(k)};
      const model = THREE.SkeletonUtils ? THREE.SkeletonUtils.clone(tpl.scene) : tpl.scene.clone(true);
      const fit = (typeof CHAR_FITS!=='undefined' && CHAR_FITS[k]) || {};
      model.updateMatrixWorld(true);
      const box = charModelBox(model), sz = new THREE.Vector3(); box.getSize(sz);
      const s = ${PUP_H} / (sz.y || 1);
      model.scale.setScalar(s);
      model.position.y = -box.min.y * s;
      /* +PI extra sobre el yaw del preview: MEDIDO — con el yaw de showPuppet las 6 clases salían de
         espaldas a la cámara del estudio, así 0° = de cara y los nombres de ángulo son verdad */
      model.rotation.y = (typeof CHAR_YAW!=='undefined'?CHAR_YAW:0) + (fit.yaw||0) + ((typeof RICH_CFG!=='undefined'&&RICH_CFG[k]) ? Math.PI : 0) + Math.PI;
      model.traverse(o=>{ if(!o.isMesh) return; o.frustumCulled = false; o.castShadow = false;
        if(typeof BRAND_HUE!=='undefined' && BRAND_HUE[k]!=null){
          o.material = Array.isArray(o.material) ? o.material.map(m=> m && m.clone()) : (o.material && o.material.clone());
          (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{ if(m && m.map){ const t=recolorAtlas(m.map,k); if(t){ m.map=t; if(m.color) m.color.setRGB(1,1,1); m.needsUpdate=true; } } });
        }
        /* SIN los apaños de partida: el KNIGHT_LIGHTEN y el emissive existen para que el personaje
           destaque sobre un mapa oscuro; en la ficha solo lavan el color. Fuera también la
           transparencia (barba y manos del mago salían fantasmales sobre fondo alfa). */
        o.material = Array.isArray(o.material) ? o.material.map(m=> m && m.clone()) : (o.material && o.material.clone());
        (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{ if(!m) return;
          if(m.emissive){ m.emissive.setHex(0x000000); m.emissiveIntensity = 0; }
          if(m.transparent){ m.transparent = false; m.opacity = 1; m.depthWrite = true; }
          if('metalness' in m) m.metalness = 0.0;
          if('roughness' in m) m.roughness = 0.72;
          /* ALFA DE SALIDA = 1. El canvas es alpha:true, así que el alfa del FRAGMENTO (= alfa de la
             textura) acaba en el PNG: la capa del bárbaro y la barba del mago salían fantasmales.
             Poner transparent=false no basta — hay que forzarlo en el shader. */
          m.onBeforeCompile = (sh)=>{
            sh.fragmentShader = sh.fragmentShader
              .replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );', 'gl_FragColor = vec4( outgoingLight, 1.0 );')
              .replace('gl_FragColor = vec4( diffuseColor.rgb, diffuseColor.a );', 'gl_FragColor = vec4( diffuseColor.rgb, 1.0 );');
          };
          m.customProgramCacheKey = ()=> 'ficha-alfa1';
          m.needsUpdate = true;
        });
      });
      /* POSE: el idle del propio personaje, no el bind pose (brazos en T) */
      if(tpl.animations && tpl.animations.length){
        const mx = new THREE.AnimationMixer(model);
        const idle = tpl.animations.find(a=>/idle/i.test(a.name)) || tpl.animations[0];
        if(idle){ mx.clipAction(idle).play(); mx.update(0.6); }   // 0.6 s dentro del idle: postura asentada
        model.updateMatrixWorld(true);
      }
      try { attachPreviewWeapons(model, k, ${PUP_H}/CHAR_TARGET_H); } catch(e){}
      const root = new THREE.Group(); root.add(model); S.sc.add(root); S.cur = root;
      root.updateMatrixWorld(true);
      /* NADA de Box3 para encuadrar: sobre SkinnedMesh mide el bind pose y da números imposibles
         (nun: 0.01 de alto). El encuadre se MIDE en la silueta renderizada, ver framePorSilueta(). */
      S.cam.position.set(0, ${PUP_H}*0.55, ${PUP_H}*3.2); S.cam.lookAt(0, ${PUP_H}*0.55, 0);
      return 'montado';
    })()`);
    const enc = await ev(`window.__frame(${JSON.stringify(ANGLES.map(a => a[1]))})`);
    console.log(`${k}: ${info} · encuadre ${enc}`);

    for (const [nombre, deg] of ANGLES) {
      const durl = await ev(`(function(){
        const S = window.__fichaStudio;
        S.cur.rotation.y = ${deg} * Math.PI/180;
        S.cur.updateMatrixWorld(true);
        S.r.render(S.sc, S.cam);
        return S.cv.toDataURL('image/png');
      })()`);
      if (!durl || durl.length < 2000) { console.log(`  !! ${k}_${nombre} vacío`); continue; }
      const f = path.join(OUT, `${k}_${nombre}.png`);
      fs.writeFileSync(f, Buffer.from(durl.split(',')[1], 'base64'));
      console.log(`  ✓ ${path.basename(f)}  ${(fs.statSync(f).size / 1024).toFixed(0)} KB`);
    }
  }
  console.log('HECHO → ' + OUT);
  process.exit(0);
})().catch(e => { console.log('ERROR ' + e.message); process.exit(1); });
