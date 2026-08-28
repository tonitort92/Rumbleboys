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

/* `out` LLEVA _iso: es como los pide el menu (rumble_arena_cinta_v4.html:20106, 'mini_'+pasoClave+
   suf+'.png' con suf='_iso'). Sin el sufijo hay que renombrar a mano tras cada pasada, que es lo
   que paso el 27/08. No quitarlo.
   `avance` = segundos de carrera que se simulan antes de la foto (ver el bombeo mas abajo). Va por
   mini y no global porque la parrilla del MAR es el doble de ancha (x0 = (i-1.5)*26 frente a *16),
   asi que con el mismo valor el kitesurf sale mucho mas disperso que la nieve.
   Los dos numeros son un EQUILIBRIO medido, no un capricho: la parrilla nace con 48 u de ancho y la
   camara va al hombro del corredor 0, asi que cuanto mas se avanza mas se dispersan y mas atras hay
   que irse para que quepan; y cuanto mas atras, mas pequenos salen. Probado: con avance 5 y sin
   tope salian los cuatro pero como MOTAS (ilegibles en una card de 440 px); con tope 20 salian dos
   GRANDES. Con 2 s y tope 34 salen tres a tamano legible, que es el mejor punto.
   PROBADO Y DESCARTADO: apretar la formacion moviendo la x de los rivales hacia el protagonista
   para que cupieran los cuatro y grandes. Aunque se daba un tick corto despues para recolocar
   sombra y cometa, el resultado tenia TABLAS HUERFANAS tiradas por el suelo sin jinete — mover a un
   corredor de golpe le dispara su propia logica. No volver a intentarlo por esta via. */
const MINIS = [
  { out: 'mini_m_sand_iso.png', tipo: 'desc', piel: 'arena', nom: 'SANDBOARD', avance: 2.0, retroMax: 34 },
  { out: 'mini_m_surf_iso.png', tipo: 'desc', piel: 'mar',   nom: 'KITESURF',  avance: 2.0, retroMax: 34 },
  { out: 'mini_m_snow_iso.png', tipo: 'desc', piel: 'nieve', nom: 'SNOWBOARD', avance: 2.0, retroMax: 34 },
  { out: 'mini_m_tubo_iso.png', tipo: 'tubo', nom: 'TUBO',   avance: 4.0, retroMax: 10 },
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
    /* ================= LA CARRERA, SIMULADA A MANO =================
       Antes esto era sleep(2500) -> introT=9999 -> sleep(9000) y foto a lo que hubiera. En headless
       el bucle va a 1-3 fps, o sea que esos 11 s son ~25 frames de fisica: los cuatro seguian
       AMONTONADOS en la parrilla y sus mixer casi en pose de bind. Ahora se bombea tick(dt) a mano,
       que es publico (descenso.js:5848, tubo.js:2736) y no depende del rAF estrangulado. Con eso la
       foto es ademas DETERMINISTA: mismo avance, mismo encuadre. */

    /* 1) ESPERAR EL MONTAJE **EN TIEMPO REAL**, y hacerlo ANTES de bombear. Es obligatorio:
       tick() en fase intro acumula _espera y dispara introGo() al llegar a INTRO.espera (12 s,
       descenso.js:5136). Bombear se come esos 12 s en milisegundos, asi que si se bombea antes de
       que los GLB (12 MB) hayan resuelto, la presentacion arranca con cuatro CAPSULAS GRISES. Y los
       GLB solo pueden resolverse entre turnos del event loop, que un Runtime.evaluate sincrono no
       cede: por eso se espera desde Node, con sleeps de verdad.
       OJO AL ORDEN, que es lo que fallo en el primer intento: `pideTabla()` y el reintento de
       `montaPersonaje` viven DENTRO de tick (descenso.js:5920-5921, tubo.js:2795), o sea que si el
       tick no corre NADIE pide los GLB. Y en headless el rAF esta estrangulado, asi que no corre
       solo. Esperar 90 s sin bombear daba 0/4 eternamente: no es que tardaran, es que nadie los
       habia pedido. Por eso el sondeo bombea UN tick por vuelta (dispara la peticion y reintenta el
       montaje) y luego cede el hilo un segundo de verdad, que es cuando la promesa del GLB resuelve.
       Un tick por vuelta ademas mantiene `_espera` a raya: 90 vueltas son 1,5 s simulados, muy por
       debajo de los 12 s de INTRO.espera que dispararian la presentacion con capsulas grises. */
    let mont = '';
    for (let k = 0; k < 90; k++) {
      const q = await ev(`(function(){ const M = (window.DESC && DESC.on) ? DESC : ((window.TUBO && TUBO.on) ? TUBO : null);
        if(!M || !M.racers || !M.racers.length) return '0/0';
        try{ M.tick(1/60); }catch(e){}
        return M.racers.filter(r => r.montado).length + '/' + M.racers.length; })()`);
      mont = q.v || '';
      const mm = /^(\d+)\/(\d+)$/.exec(mont);
      if (mm && +mm[2] > 0 && mm[1] === mm[2]) break;
      await sleep(1000);
    }
    if (!/^(\d+)\/\1$/.test(mont)) console.log('  ' + M.nom.padEnd(11) + ' AVISO: montaje ' + mont + ' -> saldran capsulas grises');

    /* 2) que la IA conduzca TAMBIEN al corredor 0. El gancho ya existia en descenso.js:5877 y no lo
       usaba nadie; en tubo.js se acaba de anadir igual. Sin esto el humano no traza (ax:0) y en el
       tubo acaba estrellado o fuera, que es peor foto que ninguna.
       3) saltar la presentacion. NO basta con introT=9999: el tick solo mira ese reloj DENTRO de
       `if(_introGo)`, y _introGo solo se pone cuando los cuatro estan montados o cuando _espera pasa
       de 12 s. Con el reloj a 9999 y _introGo a mano, el primer tick del bombeo llama a raceGo(),
       que ademas reasienta a los corredores sobre el suelo real. */
    await ev(`(function(){
      for(const MOD of [window.DESC, window.TUBO]){
        if(!MOD || !MOD.on || !MOD.racers) continue;
        for(const r of MOD.racers) r.aiDrive = true;
        MOD._introGo = true; MOD.introT = 9999;
      }
      return 'ok';
    })()`);

    /* 4) BOMBEO, en tandas con un respiro entre ellas: cada tanda es una evaluacion SINCRONA, y
       encadenar miles de ticks sin ceder el hilo bloquea al navegador. Cada tick va en try/catch
       porque DESC.tick no lo lleva por dentro: si updateAudio o updateHud lanzan, se cortaria el
       bombeo a media carrera y la escena quedaria a medias. */
    const TANDA = 120, dtF = 1 / 60;
    const ticks = Math.max(1, Math.round((M.avance || 4) / dtF));
    let hechos = 0, fallos = 0;
    for (let done = 0; done < ticks; done += TANDA) {
      const n = Math.min(TANDA, ticks - done);
      const q = await ev(`(function(){ const M = (window.DESC && DESC.on) ? DESC : ((window.TUBO && TUBO.on) ? TUBO : null);
        if(!M || !M.tick) return '0/0';
        let ok = 0, ko = 0;
        for(let i = 0; i < ${n}; i++){ try{ M.tick(${dtF}); ok++; }catch(e){ ko++; } }
        return ok + '/' + ko; })()`);
      const pr = String(q.v || '0/0').split('/');
      hechos += (+pr[0] || 0); fallos += (+pr[1] || 0);
      await sleep(200);
    }
    const fase = (await ev(`(function(){ const M = (window.DESC && DESC.on) ? DESC : ((window.TUBO && TUBO.on) ? TUBO : null);
      return M ? (M.phase + ' t=' + (M.t || 0).toFixed(1)) : '?'; })()`)).v;
    console.log('  ' + M.nom.padEnd(11) + ' montaje ' + mont + ' · ticks ' + hechos + (fallos ? (' · FALLOS ' + fallos) : '') + ' · ' + fase);

    const shot = await ev(`(function(){
      /* ►CORREDORES (Toni 28/08: "los personajes no salen en los surf, sandboard, kitesurf y
         tubo"). Aqui estaba el ocultado, y era DELIBERADO: la peticion del 27/08 fue "un screenshot
         sin personajes me vale". Ahora los quiere, asi que se cae entero el bloque que apagaba
         r.gfx / r.shadow / r.tabla / r.kite y los SkinnedMesh de las dos escenas de modulo. Quitar
         el kite es justo lo que hace que el kitesurf se lea como kitesurf: antes se veian las
         cuerdas de la cometa colgando sin cometa ni jinete.
         Lo UNICO que se sigue escondiendo son los munecos de la PARTIDA: viven en scene, no en
         DESC.scene, asi que hoy ni se dibujan (DESC.render pinta DESC.scene con DESC.cam). Cuesta
         cero y cubre el caso de que el render caiga al else de renderer.render(scene,camera). */
      try{ if(typeof players!=='undefined') for(const p of players){ if(p.gfx && p.gfx.root) p.gfx.root.visible = false; } }catch(e){}
      /* fuera el HUD propio del modulo, que es un div aparte */
      for(const q of ['descHud','tuboHud']){ const n = document.getElementById(q); if(n) n.style.display = 'none'; }

      /* ►ENCUADRE: RETROCEDER HASTA QUE QUEPAN LOS CUATRO.
         La camara de carrera va pegada al hombro del corredor 0 (stepCamera sigue a
         racers.find(q=>q.human)), asi que con los rivales repartidos por la pista solo salia UNO
         y la caratula no contaba que es una carrera. Medido: tras 5 s los cuatro abarcan ~47 u en
         X, muy fuera de ese encuadre.
         Se hace AQUI, despues del ultimo tick y antes de render, que es cuando ya no vuelve a
         correr stepCamera y por tanto no lo deshace. Mismo metodo que el auto-encaje del arnes de
         islas: proyectar los puntos a NDC y alejarse mientras alguno se salga.
         OJO con la cupula: sky/backdrop/cielo (y fill en el tubo) van pegados a la camara cada
         frame (descenso.js:5077-5079); si se mueve la camara sin moverlos, un retroceso grande la
         deja fuera de la cupula y sale un agujero de fondo.
         Y OJO con pasarse: sin tope, encajar a los cuatro mandaba la camara tan atras que salian
         DIMINUTOS (probado: la parrilla ya nace con 48 u de ancho, x0 = (i-1.5)*16, y encima se
         separan en Z al correr). La caratula la manda el protagonista, asi que retroMax corta el
         retroceso: si alguno se queda fuera de cuadro, mejor eso que cuatro motas. */
      try{
        const MOD = (window.DESC && DESC.on) ? DESC : ((window.TUBO && TUBO.on) ? TUBO : null);
        if(MOD && MOD.cam && MOD.racers && MOD.racers.length && MOD.scene){
          MOD.scene.updateMatrixWorld(true);
          const cam = MOD.cam, dir = new THREE.Vector3();
          cam.getWorldDirection(dir);
          const pts = [];
          for(const r of MOD.racers){
            const g = r.gfx || r.g || r.root; if(!g) continue;
            const v = new THREE.Vector3().setFromMatrixPosition(g.matrixWorld); v.y += 1.2;
            pts.push(v);
          }
          const PASO = 2.5, TOPE = ${M.retroMax || 20};
          for(let it = 0; it < Math.floor(TOPE / PASO) && pts.length; it++){
            cam.updateMatrixWorld(true); cam.updateProjectionMatrix();
            let m = 0;
            for(const P of pts){
              const q = P.clone().project(cam);
              /* q.z > 1 = detras de la camara: no hay NDC que valga, hay que alejarse si o si */
              m = (q.z > 1) ? 9 : Math.max(m, Math.abs(q.x), Math.abs(q.y));
              if(m >= 9) break;
            }
            if(m <= 0.86) break;             // 14% de margen, como el 4% del arnes de islas pero mas holgado
            cam.position.addScaledVector(dir, -PASO);
          }
          cam.updateMatrixWorld(true); cam.updateProjectionMatrix();
          for(const q of [MOD.backdrop, MOD.sky, MOD.cielo, MOD.fill]) if(q && q.position) q.position.copy(cam.position);
        }
      }catch(e){}
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
