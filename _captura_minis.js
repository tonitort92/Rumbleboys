/* Screenshots de los SEIS minijuegos, sin personajes.
   No valen para ellos las islas isométricas de capturas_islas.js: cuadrimanía y arena construyen
   su escena en su propio módulo AL ENTRAR (rebuildBelt no les monta nada, se comprobó: salían en
   blanco), y los tres descensos y el tubo se quedan el frame entero con escena y cámara propias.
   Así que aquí se ENTRA en cada uno y se captura el canvas tal cual. */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 9392;
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = 'http://localhost:8181/rumble_arena_cinta_v4.html?explorar';
const DEST = 'C:/Users/tonit/Desktop/Rumbleboys Alfa';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const MINIS = [
  { out: 'mini_m_sand.png', tipo: 'desc', piel: 'arena', nom: 'SANDBOARD' },
  { out: 'mini_m_surf.png', tipo: 'desc', piel: 'mar',   nom: 'SURF' },
  { out: 'mini_m_snow.png', tipo: 'desc', piel: 'nieve', nom: 'SNOWBOARD' },
  { out: 'mini_m_tubo.png', tipo: 'tubo', nom: 'TUBO' },
];

(async () => {
  const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader', '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + path.join(__dirname, 'prof_mini2'),
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
    if (r.result && r.result.exceptionDetails) return { err: JSON.stringify(r.result.exceptionDetails).slice(0, 400) };
    return { v: r.result && r.result.result && r.result.result.value };
  };

  await send('Runtime.enable'); await send('Page.enable');
  await send('Page.navigate', { url: URL });
  let listo = false;
  for (let i = 0; i < 260 && !listo; i++) {
    await sleep(1000);
    listo = (await ev("(typeof renderer!=='undefined' && typeof players!=='undefined' && players.length>0 && !!window.DESC && !!window.TUBO)")).v === true;
    if (i % 30 === 29) console.log('  ...cargando', i + 1, 's');
  }
  if (!listo) { console.log('NO CARGO'); ws.close(); edge.kill(); return; }
  console.log('cargado');

  await ev(`(function(){
    try{ demo = false; }catch(e){}
    /* fuera todo overlay: la foto es del escenario */
    document.querySelectorAll('.overlay').forEach(o => o.style.display = 'none');
    const t = document.getElementById('titleOverlay'); if(t) t.style.display = 'none';
    const ld = document.getElementById('loadScreen'); if(ld) ld.style.display = 'none';
    const h = document.getElementById('hud'); if(h) h.style.display = 'none';
    return 'ok';
  })()`);

  for (const M of MINIS) {
    let entrar;
    if (M.tipo === 'stage') entrar = `(function(){ const f = window['goToStage' + ${M.st}]; if(typeof f==='function'){ f(); return 'go'; } return 'sin goToStage' + ${M.st}; })()`;
    else if (M.tipo === 'desc') entrar = `(function(){ DESC.lanzar({ piel:'${M.piel}', campana:false, alAcabar:function(){} }); return 'go'; })()`;
    else entrar = `(function(){ TUBO.lanzar({ campana:false, alAcabar:function(){} }); return 'go'; })()`;

    const e1 = await ev(entrar);
    if (e1.err) { console.log('  ' + M.nom.padEnd(11) + ' FALLO AL ENTRAR ' + e1.err.slice(0, 140)); continue; }
    /* SALTAR LA PRESENTACION. En headless el bucle va a 1-3 fps, asi que a los 9 s la camara de
       intro sigue en mitad del travelling y sale mirando al horizonte (el surf salio siendo cielo y
       una banda de mar). Empujando el reloj de intro por encima de su duracion, el tick llama a
       raceGo() y la camara pasa a la de carrera, que es la que mira la pista. */
    await sleep(2500);
    await ev(`(function(){
      try{ if(window.DESC && DESC.on) DESC.introT = 9999; }catch(e){}
      try{ if(window.TUBO && TUBO.on) TUBO.introT = 9999; }catch(e){}
      return 'ok';
    })()`);
    await sleep(9000);

    const shot = await ev(`(function(){
      /* SIN PERSONAJES: fuera los muñecos de la partida y los corredores del modulo */
      try{ if(typeof players!=='undefined') for(const p of players){ if(p.gfx && p.gfx.root) p.gfx.root.visible = false; } }catch(e){}
      try{ if(window.DESC && DESC.on && DESC.scene) DESC.scene.traverse(o => { if(o.isSkinnedMesh) o.visible = false; }); }catch(e){}
      try{ if(window.TUBO && TUBO.on && TUBO.scene) TUBO.scene.traverse(o => { if(o.isSkinnedMesh) o.visible = false; }); }catch(e){}
      /* el corredor entero: su raiz se llama gfx (dentro van cuerpo, TABLA y capsula) y la sombra
         va aparte. Escondiendo solo el SkinnedMesh se quedaba el snowboard flotando sobre su sombra. */
      for(const MOD of [window.DESC, window.TUBO]){
        try{ if(MOD && MOD.on && MOD.racers) for(const r of MOD.racers){
          const g = r.gfx || r.g || r.root; if(g) g.visible = false;
          if(r.shadow) r.shadow.visible = false;
          if(r.tabla && r.tabla.visible !== undefined) r.tabla.visible = false;
          if(r.kite && r.kite.visible !== undefined) r.kite.visible = false;
        } }catch(e){}
      }
      /* fuera el HUD propio del modulo, que es un div aparte */
      for(const q of ['descHud','tuboHud']){ const n = document.getElementById(q); if(n) n.style.display = 'none'; }
      /* dibujar UNA vez y sacar el canvas: Page.captureScreenshot saca la portada, que va encima */
      try{
        if(window.DESC && DESC.on && DESC.render) DESC.render();
        else if(window.TUBO && TUBO.on && TUBO.render) TUBO.render();
        else renderer.render(scene, camera);
      }catch(e){ return 'ERR render ' + e.message; }
      return renderer.domElement.toDataURL('image/png');
    })()`);

    if (shot.err || !shot.v || shot.v.slice(0, 10) !== 'data:image') {
      console.log('  ' + M.nom.padEnd(11) + ' SIN IMAGEN ' + String(shot.err || shot.v).slice(0, 140));
    } else {
      fs.writeFileSync(path.join(DEST, M.out), Buffer.from(shot.v.split(',')[1], 'base64'));
      console.log('  ' + M.nom.padEnd(11) + ' -> ' + M.out + '  ' + Math.round(shot.v.length / 1365) + ' KB');
    }

    // salir del modulo para poder entrar en el siguiente
    await ev(`(function(){
      try{ if(window.DESC && DESC.on && DESC.salir) DESC.salir(); }catch(e){}
      try{ if(window.TUBO && TUBO.on && TUBO.salir) TUBO.salir(); }catch(e){}
      return 'ok';
    })()`);
    await sleep(1500);
  }

  ws.close(); edge.kill(); await sleep(300); process.exit(0);
})();
