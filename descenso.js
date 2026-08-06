/* =====================================================================
   ►DESCENSO — PROTOTIPO GREYBOX (carrera de transición entre stages)

   Qué es: la puerta de prototipo del minijuego de sandboard/snowboard/surf.
   Cápsulas grises bajando una pista con semilla. SIN animaciones, SIN tabla,
   SIN arte, SIN integración con la campaña. Sirve para contestar UNA pregunta:

        ¿es divertido bajar?

   Si con cápsulas grises no lo es, con animaciones tampoco — y nos hemos
   ahorrado el pipeline de Blender entero.

   ---------------------------------------------------------------------
   CÓMO SE ENTRA (igual que ?explorar, la otra herramienta de dev):

        rumble_arena_cinta_v4.html?descenso
        rumble_arena_cinta_v4.html?descenso&humanos=2      2 humanos (prueba la correa)
        rumble_arena_cinta_v4.html?descenso&semilla=1234   pista concreta y repetible
        rumble_arena_cinta_v4.html?descenso&piel=nieve     paleta de nieve (hielo→lanzadera)
        rumble_arena_cinta_v4.html?descenso&piel=mar       paleta de surf (piratas)

   Sin el parámetro este fichero no hace absolutamente NADA: sale en la
   primera línea. Cero riesgo para el juego.

   CONTROLES (P1: teclado o Mando 1 · P2: Mando 1 si humanos=2)
        A / D  ·  stick X     carvear (con inercia, no instantáneo)
        Espacio · A           saltar / ollie
        Shift  ·  RT          turbo (gasta barra)
        J      ·  X           empujón lateral al rival de al lado
        En el aire, A/D       truco: rota. Cae recto o te comes el suelo.
        R                     reiniciar la carrera con la misma semilla
        T                     reiniciar con semilla NUEVA

   AFINADO EN CALIENTE: todos los números del tacto viven en DESC.K y se
   pueden tocar desde la consola del navegador sin recargar. Ej.:
        DESC.K.latAcc = 90 ; DESC.K.camPitch = 42
   Esa es media gracia del prototipo: el objetivo no es que esté bien a la
   primera, es poder buscar el punto en vivo.

   ---------------------------------------------------------------------
   DECISIONES DE DISEÑO QUE YA ESTÁN TOMADAS AQUÍ (y por qué):

   1) LA PENDIENTE ES MENTIRA. La FÍSICA corre en un plano llano; la bajada la
      cuentan (a) un grupo con TODO el contenido visual inclinado K.tilt grados
      con la cámara FUERA de él, (b) la cámara picada, (c) el FOV que se abre
      con la velocidad, (d) el rayado del suelo y (e) el balanceo del cuerpo.
      Así el surf pirata (sin pendiente) es EL MISMO código con K.tilt=0, y no
      hay que auditar 30.000 líneas que asumen que Y es arriba.

      OJO, corregido con una captura el 6/08: (b)…(e) SOLOS no bastan — sin (a)
      la escena se lee como un pasillo llano visto desde arriba. La pendiente
      la vende que el mundo esté torcido respecto a la vertical de la CÁMARA,
      que es quien define "arriba" para el que mira.

   2) LAS RAMPAS SÍ SON REALES. Subes por su rampa de verdad (altura real
      bajo los pies) y sales despedido con la velocidad que traías. Si la
      rampa también fuese falsa, el salto se sentiría a goma y ahí sí se nota.

   3) PISTA CON SEMILLA. Es lo ÚNICO determinista del prototipo, a propósito:
      el día que haya online, todos los clientes tienen que estar de acuerdo
      en dónde están las piedras. Son 10 llamadas y cuesta 20 minutos ahora;
      retrofitearlo después es rediseñar. El resto puede ser tan sucio como
      el juego actual (que tiene 905 Math.random()).

   4) ESCENA PROPIA. DESC.scene / DESC.cam propios, render directo sin el
      composer. Aislamiento total: el prototipo no puede romper nada del
      juego porque no comparte ni la escena ni la cámara ni el post.

   5) NO PUEDE MATARTE. No hay vidas, no hay eliminación, el último cobra
      igual. Es una transición: si puede arruinarte la run, el jugador
      aprende a temerla.
   ===================================================================== */
(function(){
'use strict';

const Q = location.search;
if(!/[?&]descenso(=|&|$)/.test(Q)) return;      // sin el parámetro, este fichero no existe

const _qs   = new URLSearchParams(Q);
const HUMANS = Math.max(1, Math.min(4, parseInt(_qs.get('humanos')||'1', 10) || 1));
const SKIN   = (_qs.get('piel') || 'arena').toLowerCase();

/* ---------------------------------------------------------------------
   RNG CON SEMILLA (mulberry32). Todo lo que genera la PISTA pasa por aquí.
   Nada de Math.random() en la generación: dos clientes con la misma semilla
   tienen que ver exactamente las mismas piedras.
   --------------------------------------------------------------------- */
function mulberry32(a){
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* =====================================================================
   K — LOS NÚMEROS DEL TACTO. Todo lo afinable, en un sitio y en caliente.
   ===================================================================== */
const K = {
  /* --- pista --- */
  len:        2400,   // longitud de la carrera (u). A ~36 u/s ≈ 68 s
  width:      46,     // ancho jugable
  rowEvery:   30,     // separación entre filas de obstáculos
  clearStart: 120,    // tramo limpio de salida (para coger velocidad sin morir)
  clearEnd:   90,     // tramo limpio antes de meta (que no se decida por una piedra tonta)

  /* --- velocidad ---
     spdAcc es EL número que decide si el juego premia jugar bien. MEDIDO
     (6/08): con 2.2 la velocidad se recuperaba en 0,45 s, así que 15 choques
     y 3 choques daban el mismo resultado a meta (horquilla 0,1-0,7 s en 6
     carreras). Bajarlo hace que un error se PAGUE durante un segundo entero,
     que es lo que deja acumularse la habilidad a lo largo de 70 s. */
  spdBase:    36,     // crucero
  spdAcc:     1.15,   // cuánto tira hacia la velocidad objetivo (1/s)
  dashMul:    1.42,   // multiplicador del turbo
  dashMax:    2.2,    // segundos de turbo llenos
  dashRegen:  0.28,   // recarga por segundo
  slowMul:    0.62,   // multiplicador dentro de una zona lenta
  crashMul:   0.26,   // qué velocidad te queda tras chocar
  crashTime:  1.0,    // segundos sin control tras chocar

  /* --- lateral (esto ES el tacto de la tabla) --- */
  latAcc:     78,     // aceleración lateral del carve
  latMax:     23,     // velocidad lateral máxima
  latDamp:    0.90,   // rozamiento lateral por frame@60 (bajo = más patina = más tabla)
  airCtrl:    0.42,   // cuánto control lateral queda en el aire

  /* --- salto / aire ---
     CUENTA QUE HAY QUE RESPETAR: un 360 son 2π rad. A spinSpeed rad/s hacen
     falta 2π/spinSpeed segundos de aire, y el aire de un salto es 2·vy/grav.
     Con los números viejos (rampa vy≈13 → 0,46 s de vuelo; 360 → 0,85 s) el
     truco era IMPOSIBLE y el sistema de puntos estaba muerto sin que se
     notara en pantalla. Ahora: ollie plano 0,59 s (NO llega a 360, a
     propósito) · rampa ≈0,95 s (sí llega). Los trucos son de rampa. */
  grav:       58,
  jumpV:      17,     // ollie plano: 0,59 s de aire → ~277º, no cierra el giro
  rampLaunch: 5.5,    // multiplicador de la altura de rampa → velocidad de salida
  rampBoost:  1.22,   // afinado fino encima de rampLaunch
  spinSpeed:  8.2,    // rad/s de rotación del truco (2π/8.2 = 0,77 s por vuelta)
  landTol:    0.62,   // rad de tolerancia al aterrizar (fuera de eso, te caes)

  /* --- empujón --- */
  shoveRange: 5.2,
  shoveForce: 26,
  shoveCd:    0.8,

  /* --- puntos (calibrar contra una run medida; ver nota al final) --- */
  ptsTrick:   [0, 60, 150, 280],   // por cada 360º completo encadenado
  ptsShove:   35,
  ptsPos:     [300, 200, 120, 60], // por puesto de llegada

  /* --- LA PENDIENTE FALSA ---
     tilt = grados que se inclina TODO EL CONTENIDO VISUAL (suelo, quitamiedos,
     obstáculos, corredores) dentro de un grupo. La FÍSICA no se entera: sigue
     corriendo en el plano sin rotar, así que nada del juego asume que Y dejó
     de ser arriba.

     APRENDIDO EN LA PRIMERA CAPTURA (6/08): con tilt=0 y sólo cámara picada,
     la escena se lee como un PASILLO LLANO visto desde arriba, no como una
     bajada. La picada sola no vende la pendiente — hace falta que el mundo
     esté torcido respecto a la vertical de la CÁMARA, que es la que define
     "arriba" para el que mira. La cámara vive FUERA del grupo rotado: si se
     inclinara con él, la rotación sería invisible (marco relativo idéntico). */
  tilt:       11,     // grados de bajada aparente

  /* --- cámara: la "picada" --- */
  camPitch:   34,     // GRADOS de picado de la MIRADA (lo que vende la bajada)
  camDist:    34,     // distancia desde el punto mirado
  camLookAhead: 15,   // cuánto por delante del corredor mira
  camLookY:   2.2,
  camLag:     7.5,    // suavizado
  camXFollow: 0.42,   // cuánto sigue el desplazamiento lateral (1 = pegada, 0 = fija)
  fovBase:    56,
  fovSpeed:   16,     // cuánto se abre a tope de velocidad
  leash:      46,     // correa: nadie se descuelga más de esto (multijugador)

  /* --- IA --- */
  aiBand:     0.16,   // goma elástica: ±% de velocidad según vaya detrás/delante
  aiMaxGap:   150,    // tope BLANDO: más allá de esto el elástico aprieta fuerte (ni desaparece ni se pierde)
  aiLook:     46,     // cuánto mira adelante para esquivar
  aiSkill:    [0.92, 0.86, 0.80],   // 0..1 por rival: reacción y limpieza
};

/* paletas: la MISMA pista con otro traje. Es literalmente el coste de
   exportar el minijuego al stage de hielo y al de piratas. */
const SKINS = {
  arena: { sky:0xe9c48a, fog:0xe9c48a, ground:0xd8ab63, lane:0xc2914b, rail:0x8d6334,
           rock:0x7d6547, ramp:0xb98a4c, slow:0xbf9b5c, sun:0xfff0d0, hemi:0xffe0b0,
           ridge:0xcaa06a, valley:0xdcb47e },
  nieve: { sky:0xcfe4f5, fog:0xcfe4f5, ground:0xeef5fb, lane:0xd2e2f0, rail:0x8fa8bd,
           rock:0x6d7f8e, ramp:0xa9c3d8, slow:0xc4d6e4, sun:0xffffff, hemi:0xdcecff,
           ridge:0xa9c2d8, valley:0xc2d8e8 },
  mar:   { sky:0x7fd6e8, fog:0x7fd6e8, ground:0x2f9fc4, lane:0x53b6d6, rail:0x1d6f8e,
           rock:0x4a5f6b, ramp:0x9fe0ef, slow:0x1d80a0, sun:0xfffbe8, hemi:0xbfeef8,
           ridge:0x5fc0d8, valley:0x3aa8c8 },
};
const PAL = SKINS[SKIN] || SKINS.arena;   // piel desconocida → arena

/* colores de los corredores — los mismos 4 de siempre para que se lean */
const RACER_COL = [0x35c9ff, 0xff5a52, 0x7bf06a, 0xffd23f];

/* ---------------------------------------------------------------------
   PUENTE CON EL JUEGO. `renderer` y `keys` se declaran con const EN EL
   ÁMBITO LÉXICO del script grande: son globales accesibles por nombre,
   pero NO son propiedades de window (window.renderer es undefined). Por eso
   este fichero se carga DESPUÉS del script principal, justo antes de
   </body>, y los resuelve por identificador con typeof.
   --------------------------------------------------------------------- */
function GAME_RENDERER(){ return (typeof renderer !== 'undefined') ? renderer : null; }
function GAME_KEYS(){ return (typeof keys !== 'undefined') ? keys : null; }

/* =====================================================================
   ESTADO
   ===================================================================== */
const DESC = window.DESC = {
  on: false, K,
  scene: null, cam: null,
  seed: 0, rng: null,
  racers: [], obst: [], buckets: null,
  t: 0, phase: 'countdown',   // countdown → race → finish
  count: 3.2,
  finishOrder: [],
  hud: null,
  _built: false,
};

/* =====================================================================
   CONSTRUCCIÓN DE LA PISTA
   ===================================================================== */
const HALF = () => K.width / 2;
const BUCKET = 60;

/* textura del suelo: rayado longitudinal + travesaños. Sin esto NO SE LEE
   LA VELOCIDAD y el prototipo no contesta a nada — es lo primero que se
   nota cuando falta. 1 sola draw call para todo el suelo. */
function groundTexture(){
  const cv = document.createElement('canvas');
  cv.width = 256; cv.height = 256;
  const g = cv.getContext('2d');
  g.fillStyle = '#' + PAL.ground.toString(16).padStart(6, '0');
  g.fillRect(0, 0, 256, 256);
  /* carriles (5) */
  g.strokeStyle = '#' + PAL.lane.toString(16).padStart(6, '0');
  g.lineWidth = 3;
  for(let i = 1; i < 5; i++){
    g.beginPath(); g.moveTo(i * 256 / 5, 0); g.lineTo(i * 256 / 5, 256); g.stroke();
  }
  /* travesaños: son los que dan la sensación de avance */
  g.fillStyle = '#' + PAL.lane.toString(16).padStart(6, '0');
  g.globalAlpha = 0.55;
  g.fillRect(0, 0, 256, 10);
  g.globalAlpha = 0.22;
  g.fillRect(0, 128, 256, 6);
  g.globalAlpha = 1;
  /* grano, para que no sea un plano muerto */
  for(let i = 0; i < 1400; i++){
    const x = Math.random() * 256, y = Math.random() * 256;
    g.fillStyle = 'rgba(0,0,0,' + (0.02 + Math.random() * 0.05) + ')';
    g.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, K.len / 26);          // travesaño cada 26 u
  tex.anisotropy = 8;
  return tex;
}

/* generación de la PISTA a partir de la semilla.
   Regla dura: en cada fila queda SIEMPRE al menos un carril libre. Un
   prototipo que a veces genera un muro infranqueable no mide el tacto,
   mide la frustración. */
function genTrack(rng){
  const obst = [];
  const LANES = 5;
  const laneX = (i) => -HALF() + (K.width / LANES) * (i + 0.5);
  let z = -K.clearStart;
  let sinceRamp = 0;
  while(z > -(K.len - K.clearEnd)){
    const free = Math.floor(rng() * LANES);          // carril garantizado libre
    sinceRamp++;
    /* cada 4-6 filas, una fila de RAMPAS en vez de piedras */
    if(sinceRamp >= 4 && rng() < 0.42){
      sinceRamp = 0;
      const n = 1 + (rng() < 0.5 ? 1 : 0);
      const used = {};
      for(let k = 0; k < n; k++){
        let l = Math.floor(rng() * LANES);
        if(l === free || used[l]) l = (l + 1) % LANES;
        if(l === free) continue;
        used[l] = 1;
        obst.push({ type:'ramp', x:laneX(l), z, w:7.4, len:13, h:3.4 });
      }
    } else {
      const n = 1 + Math.floor(rng() * 3);           // 1..3 bloqueados de 5
      const used = {};
      for(let k = 0; k < n; k++){
        let l = Math.floor(rng() * LANES);
        if(l === free || used[l]) continue;
        used[l] = 1;
        if(rng() < 0.24) obst.push({ type:'slow', x:laneX(l), z, w:8.2, len:16 });
        else             obst.push({ type:'rock', x:laneX(l) + (rng()-0.5)*3, z, r:2.5 + rng()*1.3 });
      }
    }
    z -= K.rowEvery * (0.78 + rng() * 0.5);
  }
  return obst;
}

/* índice por cubos en Z: mirar sólo los obstáculos que tienes cerca */
function bucketize(obst){
  const b = new Map();
  for(const o of obst){
    const i = Math.floor(-o.z / BUCKET);
    if(!b.has(i)) b.set(i, []);
    b.get(i).push(o);
  }
  return b;
}
function nearObst(z, span){
  const out = [];
  const i0 = Math.floor((-z - span) / BUCKET), i1 = Math.floor((-z + span) / BUCKET);
  for(let i = i0; i <= i1; i++){ const a = DESC.buckets.get(i); if(a) for(const o of a) out.push(o); }
  return out;
}

function buildScene(){
  const sc = new THREE.Scene();
  sc.background = new THREE.Color(PAL.sky);
  sc.fog = new THREE.Fog(PAL.fog, 120, 420);

  /* luz: plana y clara, es un greybox. Va en la ESCENA, no en el mundo
     inclinado: el sol no baja la cuesta contigo. */
  sc.add(new THREE.HemisphereLight(PAL.hemi, 0x404050, 0.95));
  const sun = new THREE.DirectionalLight(PAL.sun, 1.15);
  sun.position.set(-40, 80, 20);
  sc.add(sun);

  /* EL MUNDO INCLINADO: todo lo que se pisa y se choca cuelga de aquí. La
     física trabaja en coordenadas SIN rotar (las de este grupo); la rotación
     es puro maquillaje. Cambiar K.tilt en consola cambia la pendiente
     aparente al vuelo, sin tocar una sola línea de simulación. */
  const world = new THREE.Group();
  world.rotation.x = -K.tilt * Math.PI / 180;   // negativo = el fondo de la pista CAE
  sc.add(world);
  DESC.world = world;

  /* SUELO: un único plano largo con la textura rayada */
  const gm = new THREE.Mesh(
    new THREE.PlaneGeometry(K.width, K.len + 400),
    new THREE.MeshLambertMaterial({ map: groundTexture() })
  );
  gm.rotation.x = -Math.PI / 2;
  gm.position.set(0, 0, -K.len / 2 + 100);
  world.add(gm);

  /* QUITAMIEDOS laterales: además de limitar, son la referencia periférica
     que hace que la velocidad se note. Sin ellos parece que flotas. */
  const railMat = new THREE.MeshLambertMaterial({ color: PAL.rail });
  for(const s of [-1, 1]){
    const r = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, K.len + 400), railMat);
    r.position.set(s * (HALF() + 0.6), 1.1, -K.len / 2 + 100);
    world.add(r);
  }
  /* postes cada 18 u: el "tic-tic-tic" periférico de la velocidad */
  const nP = Math.floor((K.len + 300) / 18) * 2;
  const posts = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1.0, 4.2, 1.0), railMat, nP);
  {
    const m = new THREE.Matrix4(); let i = 0;
    for(let z = 60; z > -(K.len + 240); z -= 18){
      for(const s of [-1, 1]){
        m.makeTranslation(s * (HALF() + 1.9), 2.1, z);
        posts.setMatrixAt(i++, m);
      }
    }
    posts.count = i;                      // ►r128: fija count ANTES de nada más
    posts.instanceMatrix.needsUpdate = true;
  }
  world.add(posts);

  /* OBSTÁCULOS: un InstancedMesh por tipo, color único (nada de setColorAt:
     en r128 instanceColor nace con el tamaño de this.count y es una trampa
     conocida del proyecto). */
  const rocks = DESC.obst.filter(o => o.type === 'rock');
  const ramps = DESC.obst.filter(o => o.type === 'ramp');
  const slows = DESC.obst.filter(o => o.type === 'slow');

  if(rocks.length){
    const im = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.MeshLambertMaterial({ color: PAL.rock }), rocks.length);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(),
          p = new THREE.Vector3(), s = new THREE.Vector3();
    rocks.forEach((o, i) => {
      p.set(o.x, o.r * 0.55, o.z);
      q.setFromEuler(new THREE.Euler(o.r, o.x, o.z));
      s.set(o.r, o.r * 0.85, o.r);
      m.compose(p, q, s);
      im.setMatrixAt(i, m);
    });
    im.instanceMatrix.needsUpdate = true;
    world.add(im);
  }

  if(ramps.length){
    /* cuña real: sube de 0 a h a lo largo de len. La geometría coincide con
       la altura que lee la física (ver groundYAt) — si no coincidieran, el
       salto se sentiría a mentira, que es justo lo que queremos evitar. */
    const gRamp = new THREE.BufferGeometry();
    const v = new Float32Array([
      -.5,0,.5,  .5,0,.5,  .5,1,-.5,   -.5,0,.5,  .5,1,-.5, -.5,1,-.5,   // rampa
      -.5,0,.5, -.5,1,-.5, -.5,0,-.5,   .5,0,.5,  .5,0,-.5,  .5,1,-.5,   // costados
      -.5,0,-.5,-.5,1,-.5,  .5,1,-.5,  -.5,0,-.5,  .5,1,-.5,  .5,0,-.5,  // culata
    ]);
    gRamp.setAttribute('position', new THREE.BufferAttribute(v, 3));
    gRamp.computeVertexNormals();
    const im = new THREE.InstancedMesh(
      gRamp, new THREE.MeshLambertMaterial({ color: PAL.ramp }), ramps.length);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(),
          p = new THREE.Vector3(), s = new THREE.Vector3();
    ramps.forEach((o, i) => {
      p.set(o.x, 0, o.z);
      q.identity();
      s.set(o.w, o.h, o.len);
      m.compose(p, q, s);
      im.setMatrixAt(i, m);
    });
    im.instanceMatrix.needsUpdate = true;
    world.add(im);
  }

  if(slows.length){
    const im = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshLambertMaterial({ color: PAL.slow, transparent:true, opacity:.75 }), slows.length);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(),
          p = new THREE.Vector3(), s = new THREE.Vector3();
    q.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    slows.forEach((o, i) => {
      p.set(o.x, 0.05, o.z);
      s.set(o.w, o.len, 1);
      m.compose(p, q, s);
      im.setMatrixAt(i, m);
    });
    im.instanceMatrix.needsUpdate = true;
    world.add(im);
  }

  /* META: tiene que verse llegar. Una carrera sin final visible se hace
     eterna aunque dure 60 s. */
  {
    const g = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    for(const s of [-1, 1]){
      const c = new THREE.Mesh(new THREE.BoxGeometry(2.4, 16, 2.4), mat);
      c.position.set(s * (HALF() - 1), 8, 0); g.add(c);
    }
    const top = new THREE.Mesh(new THREE.BoxGeometry(K.width, 3.2, 2.4), mat);
    top.position.y = 14.4; g.add(top);
    g.position.z = -K.len;
    world.add(g);
    /* banderas de aviso a 200 y 80 u */
    for(const d of [200, 80]){
      for(const s of [-1, 1]){
        const f = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7, 1.2), mat);
        f.position.set(s * (HALF() - 1), 3.5, -(K.len - d));
        world.add(f);
      }
    }
  }

  /* ---------------------------------------------------------------------
     EL DESTINO. Al inclinar el mundo aparece una franja de cielo por encima
     del final de la pista: ESA franja es la señal de que estás bajando. Vacía
     se lee como "cielo" y la pendiente no cuenta nada; con un valle y una
     cordillera dentro se lee como "voy hacia allá abajo".

     Va FUERA del grupo inclinado y se recoloca cada frame sobre la cámara
     (parallax de fondo infinito): así no se descuelga según desciendes.
     Mismo patrón que el horizonte del jefe del Stage 1 (mar + capas).
     --------------------------------------------------------------------- */
  {
    const bd = new THREE.Group();
    const valley = new THREE.Mesh(
      new THREE.PlaneGeometry(6000, 1800),
      new THREE.MeshBasicMaterial({ color: PAL.valley, depthWrite:false }));
    valley.position.set(0, -560, -1300);
    bd.add(valley);
    /* cordillera: dos bandas de conos a distinta altura y tono = profundidad */
    const capas = [   // (y/s afinados con captura: que quede CIELO por encima — el
                      //  horizonte alto es una de las señales de la bajada)
      { z:-1250, y:-500, s:0.78, col:PAL.ridge, n:16 },
      { z:-1150, y:-430, s:0.55, col:PAL.rock,  n:13 },
    ];
    for(const c of capas){
      const im = new THREE.InstancedMesh(
        new THREE.ConeGeometry(1, 1, 4),
        new THREE.MeshBasicMaterial({ color:c.col, depthWrite:false }), c.n);
      const m = new THREE.Matrix4(), q = new THREE.Quaternion(),
            p = new THREE.Vector3(), sv = new THREE.Vector3();
      for(let i = 0; i < c.n; i++){
        const f = (i / (c.n - 1) - 0.5);
        const w = 260 + ((i * 37) % 130);                 // variación estable, sin rng
        const h = (150 + ((i * 53) % 190)) * c.s;
        p.set(f * 3400 + ((i * 71) % 90), c.y + h / 2, c.z);
        q.setFromEuler(new THREE.Euler(0, (i * 0.7) % 1.5, 0));
        sv.set(w, h, w);
        m.compose(p, q, sv);
        im.setMatrixAt(i, m);
      }
      im.instanceMatrix.needsUpdate = true;
      bd.add(im);
    }
    bd.renderOrder = -10;
    bd.traverse(o => { if(o.material) o.material.fog = false; });   // el fondo no se come la niebla
    sc.add(bd);
    DESC.backdrop = bd;
  }

  DESC.scene = sc;
  DESC.cam = new THREE.PerspectiveCamera(K.fovBase, innerWidth / innerHeight, 0.5, 3000);
  return sc;
}

/* altura del suelo bajo un punto: 0 salvo encima de una rampa, donde sube
   linealmente. Es la ÚNICA geometría con relieve real del prototipo. */
function groundYAt(x, z){
  let y = 0;
  for(const o of nearObst(z, 24)){
    if(o.type !== 'ramp') continue;
    if(Math.abs(x - o.x) > o.w / 2) continue;
    const z0 = o.z + o.len / 2, z1 = o.z - o.len / 2;   // entra por z0 (más cerca), sale por z1
    if(z > z0 || z < z1) continue;
    const k = (z0 - z) / o.len;                          // 0 abajo → 1 arriba
    y = Math.max(y, k * o.h);
  }
  return y;
}
DESC._gy = groundYAt;   // expuesto para sondas: comprobar que la física de la rampa
                        // coincide con la geometría que se dibuja (si divergen, el
                        // salto se siente a goma y es un bug invisible en pantalla)

/* =====================================================================
   CORREDORES
   ===================================================================== */
function makeRacer(i, human){
  const g = new THREE.Group();
  const col = RACER_COL[i];
  const mat = new THREE.MeshLambertMaterial({ color: col });
  /* tabla (aunque sea greybox, la tabla es lo que hace legible el balanceo) */
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.22, 4.2),
                               new THREE.MeshLambertMaterial({ color: 0x2a2f38 }));
  board.position.y = 0.11; g.add(board);
  /* cápsula */
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 1.7, 12), mat);
  body.position.y = 1.35; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.62, 14, 10), mat);
  head.position.y = 2.55; g.add(head);
  /* morro: sin esto no se ve hacia dónde mira cuando gira en un truco */
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.9),
                              new THREE.MeshLambertMaterial({ color: 0x101418 }));
  nose.position.set(0, 2.55, -0.62); g.add(nose);

  /* sombra de contacto: un disco plano. En un juego con saltos, sin esto NO
     SE SABE a qué altura estás ni dónde vas a caer. */
  const sh = new THREE.Mesh(new THREE.CircleGeometry(1.35, 16),
    new THREE.MeshBasicMaterial({ color:0x000000, transparent:true, opacity:0.3, depthWrite:false }));
  sh.rotation.x = -Math.PI / 2;

  /* los corredores cuelgan del MUNDO INCLINADO, como la pista: sus coordenadas
     siguen siendo las planas de la física y la inclinación se la aplica el
     grupo padre. Si colgasen de la escena, bajarían "flotando" sobre la cuesta. */
  DESC.world.add(g); DESC.world.add(sh);

  return {
    i, human, name: human ? ('P' + (i + 1)) : ('CPU-' + 'ABC'[i - HUMANS] ), col,
    gfx: g, shadow: sh,
    padIndex: human ? (HUMANS === 1 ? 0 : i) : -1,   // mismo reparto que el juego: solo = P1+Mando1
    kb: human && i === 0,                             // sólo P1 lee teclado
    x: (i - (4 - 1) / 2) * 7, z: 0, y: 0,
    vx: 0, vy: 0, spd: 0,
    air: false, spin: 0, spinAcc: 0,
    crash: 0, dash: K.dashMax, dashing: false,
    slow: 0, shoveCd: 0,
    pts: 0, tricks: 0, done: false, place: 0, time: 0,
    _ai: { lane: 0, react: 0 },
  };
}

/* =====================================================================
   INPUT — misma FORMA que readInput() del juego (move/jump/dash/atk) para
   que el día del online se sustituya la fuente y nada más se entere.
   Aquí se lee el eje CRUDO: un corredor quiere el stick, no una dirección
   relativa a la cámara.
   ===================================================================== */
function readDesc(r){
  if(!r.human) return { ax:0, jump:false, dash:false, atk:false };
  let ax = 0, jump = false, dash = false, atk = false;
  const kk = GAME_KEYS() || {};
  if(r.kb){
    if(kk['KeyD'] || kk['ArrowRight']) ax += 1;
    if(kk['KeyA'] || kk['ArrowLeft'])  ax -= 1;
    jump = !!kk['Space'];
    dash = !!(kk['ShiftLeft'] || kk['ShiftRight']);
    atk  = !!kk['KeyJ'];
  }
  if(r.padIndex >= 0 && navigator.getGamepads){
    const gp = navigator.getGamepads();
    const pad = gp && gp[r.padIndex];
    if(pad){
      const lx = pad.axes[0] || 0;
      if(Math.abs(lx) > 0.22) ax += lx;
      const B = (i) => !!(pad.buttons[i] && pad.buttons[i].pressed);
      jump = jump || B(0);          // A
      dash = dash || B(7);          // RT
      atk  = atk  || B(2);          // X
    }
  }
  return { ax: Math.max(-1, Math.min(1, ax)), jump, dash, atk };
}

/* =====================================================================
   IA DE CARRERA — deliberadamente tonta: goma elástica + esquiva. Sólo
   tiene que dar con quién competir para poder juzgar el tacto.
   ===================================================================== */
function aiInput(r, dt){
  const skill = K.aiSkill[Math.min(K.aiSkill.length - 1, r.i - HUMANS)] || 0.85;
  const lead = DESC.racers.find(q => q.human) || DESC.racers[0];

  /* goma elástica: si va por detrás del humano, aprieta; si va muy por
     delante, afloja. Sin esto la carrera se decide en los primeros 5 s.
     Sustituye a la correa dura (ver leash): presiona, pero deja que la
     distancia EXISTA. */
  const gap = (r.z - lead.z);                 // >0 = va por detrás
  let band = Math.max(-1, Math.min(1, gap / 90));
  if(Math.abs(gap) > K.aiMaxGap) band = Math.sign(gap) * 2.4;   // tope blando: ni desaparece ni se pierde
  r._ai.targetMul = 1 + band * K.aiBand;

  /* EN EL AIRE: la IA también hace trucos, pero sólo se compromete a un giro
     que le DÉ TIEMPO a cerrar (calcula el tiempo de vuelo y ajusta la
     velocidad de giro para caer recta). Si no le da, no gira: la IA no se
     estrella por presumir. Sin esto los rivales bajaban a 0 puntos de truco
     y el marcador no tenía con quién competir. */
  if(r.air){
    if(r._ai.spinAx === null || r._ai.spinAx === undefined){
      const tAir = (r.vy + Math.sqrt(Math.max(0, r.vy * r.vy + 2 * K.grav * Math.max(0.01, r.y)))) / K.grav;
      const need = (Math.PI * 2) / Math.max(0.25, tAir) / K.spinSpeed;   // ax exacto para 360º clavados
      r._ai.spinAx = (need <= 0.98 && skill > 0.78) ? need * ((r.i % 2) ? 1 : -1) : 0;
    }
    return { ax: r._ai.spinAx, jump:false, dash:false, atk:false };
  }
  r._ai.spinAx = null;

  /* esquiva: mira adelante y busca el hueco lateral más cercano */
  let ax = 0, jump = false;
  const ahead = nearObst(r.z - K.aiLook / 2, K.aiLook);
  let danger = null, dz = 1e9;
  for(const o of ahead){
    const d = r.z - o.z;                       // >0 = está delante
    if(d < 2 || d > K.aiLook) continue;
    const w = (o.type === 'rock') ? o.r + 2.2 : o.w / 2 + 1.6;
    if(Math.abs(o.x - r.x) > w) continue;
    if(o.type === 'ramp'){ if(d < 10) jump = false; continue; }   // la rampa se toma, no se esquiva
    if(d < dz){ dz = d; danger = o; }
  }
  if(danger){
    const side = (r.x >= danger.x) ? 1 : -1;
    ax = side * skill;
    if(Math.abs(r.x) > HALF() - 6) ax = -Math.sign(r.x);   // no te comas el quitamiedos por esquivar
  } else {
    /* busca una rampa cercana (puntos + velocidad) */
    let best = null, bd = 1e9;
    for(const o of ahead){
      if(o.type !== 'ramp') continue;
      const d = r.z - o.z;
      if(d < 4 || d > K.aiLook) continue;
      if(d < bd){ bd = d; best = o; }
    }
    if(best && skill > 0.8) ax = Math.max(-1, Math.min(1, (best.x - r.x) * 0.16));
    else ax = Math.max(-1, Math.min(1, (-r.x) * 0.02));   // tiende al centro
  }
  /* ollie EN EL LABIO de la rampa (suelo alto aquí, suelo llano 2,5 u más
     adelante): más altura = da tiempo a más giro = más puntos */
  if(groundYAt(r.x, r.z) > 0.4 && groundYAt(r.x, r.z - 2.5) <= 0.05 && skill > 0.75) jump = true;

  r._ai.react = Math.max(0, r._ai.react - dt);
  return { ax, jump, dash: (gap > 30 && skill > 0.82), atk: false };
}

/* =====================================================================
   SIMULACIÓN
   ===================================================================== */
function stepRacer(r, dt){
  if(r.done) return;

  const inp = r.human ? readDesc(r) : aiInput(r, dt);

  /* --- choque: sin control un momento --- */
  if(r.crash > 0){
    r.crash -= dt;
    r.gfx.rotation.y += dt * 9;                 // da vueltas: se lee que la has liado
    inp.ax = 0; inp.jump = false; inp.dash = false;
  }

  /* --- turbo --- */
  r.dashing = inp.dash && r.dash > 0 && r.crash <= 0;
  if(r.dashing) r.dash = Math.max(0, r.dash - dt);
  else          r.dash = Math.min(K.dashMax, r.dash + dt * K.dashRegen);

  /* --- velocidad de avance --- */
  let target = K.spdBase * (r._ai && r._ai.targetMul ? r._ai.targetMul : 1);
  if(r.dashing) target *= K.dashMul;
  if(r.slow > 0){ target *= K.slowMul; r.slow -= dt; }
  r.spd += (target - r.spd) * Math.min(1, K.spdAcc * dt);
  r.z -= r.spd * dt;

  /* --- lateral: aceleración + rozamiento = carve con inercia --- */
  const ctrl = r.air ? K.airCtrl : 1;
  r.vx += inp.ax * K.latAcc * ctrl * dt;
  r.vx *= Math.pow(K.latDamp, dt * 60);
  r.vx = Math.max(-K.latMax, Math.min(K.latMax, r.vx));
  r.x += r.vx * dt;

  /* --- quitamiedos: rebota y castiga (pero no mata) --- */
  const lim = HALF() - 1.6;
  if(Math.abs(r.x) > lim){
    r.x = Math.sign(r.x) * lim;
    r.vx *= -0.28;
    r.spd *= 0.86;
  }

  /* --- salto y aire --- */
  const TAU = Math.PI * 2;
  const gy = groundYAt(r.x, r.z);
  if(!r.air){
    /* EN EL SUELO. Sobre una rampa, la altura la manda la GEOMETRÍA real:
       subes de verdad. Es el punto 2 del diseño — si la rampa también fuese
       falsa, el salto se sentiría a goma. */
    const prevY = r.y;
    r.y = gy;
    const climb = (r.y - prevY) / Math.max(1e-4, dt);   // velocidad de subida real
    r.vy = 0;
    if(inp.jump && !r._jumpHeld){
      r.air = true;
      r.vy = K.jumpV + Math.max(0, climb) * 0.35;       // ollie en el labio = más alto
    } else if(prevY > 0.25 && gy <= 0.02){
      /* ha pasado el labio de la rampa: sale despedido con lo que traía
         (altura de la rampa + velocidad). Saltar arriba suma; no saltar
         también despega, pero menos. Este es el salto GRANDE: el único que
         da aire suficiente para cerrar un giro (ver la cuenta en K). */
      r.air = true;
      r.vy = Math.max(K.jumpV * 1.2, prevY * K.rampBoost * K.rampLaunch + r.spd * 0.15);
    }
  } else {
    /* EN EL AIRE */
    r.vy -= K.grav * dt;
    r.y += r.vy * dt;
    /* TRUCO: girar da puntos, pero hay que caer recto. Ese es todo el
       riesgo/recompensa del minijuego y cabe en 4 líneas. */
    r.spinAcc += Math.abs(inp.ax) * K.spinSpeed * dt;
    r.spin    += inp.ax * K.spinSpeed * dt;
    if(r.y <= gy){
      r.y = gy; r.air = false;
      let m = r.spin % TAU; if(m < 0) m += TAU;
      const dev = Math.min(m, TAU - m);                 // desvío al múltiplo de 360º más cercano
      const spins = Math.floor(r.spinAcc / TAU);
      if(r.spinAcc > 0.6 && dev > K.landTol){
        crash(r);                                       // torcido → al suelo
      } else if(spins > 0){
        r.pts += K.ptsTrick[Math.min(K.ptsTrick.length - 1, spins)];
        r.tricks += spins;
      }
      r.spin = 0; r.spinAcc = 0;
    }
  }
  r._jumpHeld = inp.jump;

  /* --- obstáculos --- */
  if(r.crash <= 0){
    for(const o of nearObst(r.z, 14)){
      if(o.type === 'rock'){
        if(r.y > o.r * 1.1) continue;                       // lo has saltado
        if(Math.abs(o.z - r.z) < o.r + 1.6 && Math.abs(o.x - r.x) < o.r + 1.2) crash(r);
      } else if(o.type === 'slow'){
        if(r.y > 0.8) continue;
        if(Math.abs(o.z - r.z) < o.len / 2 && Math.abs(o.x - r.x) < o.w / 2) r.slow = 0.25;
      }
    }
  }

  /* --- empujón --- */
  r.shoveCd = Math.max(0, r.shoveCd - dt);
  if(inp.atk && r.shoveCd <= 0 && r.crash <= 0){
    for(const q of DESC.racers){
      if(q === r || q.done) continue;
      if(Math.abs(q.z - r.z) > K.shoveRange) continue;
      if(Math.abs(q.x - r.x) > K.shoveRange) continue;
      q.vx += Math.sign(q.x - r.x || 1) * K.shoveForce;
      q.spd *= 0.92;
      r.pts += K.ptsShove;
      r.shoveCd = K.shoveCd;
      break;
    }
    if(r.shoveCd <= 0) r.shoveCd = K.shoveCd * 0.5;   // fallar también tiene coste
  }

  /* --- meta --- */
  if(r.z <= -K.len && !r.done){
    r.done = true;
    r.time = DESC.t;
    DESC.finishOrder.push(r);
    r.place = DESC.finishOrder.length;
    r.pts += K.ptsPos[Math.min(K.ptsPos.length - 1, r.place - 1)];
  }

  /* --- gráficos --- */
  r.gfx.position.set(r.x, r.y, r.z);
  if(r.crash <= 0){
    r.gfx.rotation.y = r.spin;
    r.gfx.rotation.z = -(r.vx / K.latMax) * 0.55;      // se tumba en la curva: vende la gravedad lateral
    r.gfx.rotation.x = r.air ? -0.12 : 0.05;
  }
  r.shadow.position.set(r.x, groundYAt(r.x, r.z) + 0.06, r.z);
  const h = Math.max(0, r.y - groundYAt(r.x, r.z));
  r.shadow.material.opacity = 0.3 / (1 + h * 0.14);
  r.shadow.scale.setScalar(1 / (1 + h * 0.05));
}

function crash(r){
  if(r.crash > 0) return;
  r.crashes = (r.crashes || 0) + 1;   // contador para las sondas: densidad de obstáculos = ¿castiga demasiado?
  r.crash = K.crashTime;
  r.spd *= K.crashMul;
  r.vx *= 0.2;
  r.spin = 0; r.spinAcc = 0;
  r.air = false;
}

/* CORREA — sólo ENTRE HUMANOS.
   Existe por una razón concreta: con cámara compartida, dos humanos no pueden
   separarse más de lo que cabe en pantalla. No existe para "igualar" la carrera.

   MEDIDO (sonda del 6/08): atando también a la IA, los 4 corredores llegaban
   a meta en un margen de 0,2 s hiciera lo que hiciera el jugador — la correa
   de 46 u a 36 u/s son 1,3 s de diferencia MÁXIMA posible. Una carrera que no
   puedes ganar ni perder no mide nada. Los rivales de IA ya no se atan: si te
   sacan tres segundos, te los sacan de verdad. */
function leash(){
  const hum = DESC.racers.filter(r => r.human && !r.done);
  if(hum.length < 2) return;                    // con un solo humano no hay nada que encuadrar
  let anchor = 0;
  for(const r of hum) anchor += r.z;
  anchor /= hum.length;
  for(const r of hum){
    if(r.z > anchor + K.leash){ r.z = anchor + K.leash; r.spd = Math.max(r.spd, K.spdBase * 1.06); }
    if(r.z < anchor - K.leash) r.z = anchor - K.leash;
  }
}

/* =====================================================================
   CÁMARA — aquí vive la MENTIRA de la pendiente
   ===================================================================== */
const _camPos = new THREE.Vector3(), _camLook = new THREE.Vector3();
let _camInit = false;
function stepCamera(dt){
  /* Ancla = centro de los HUMANOS. Si no hay ninguno (sondas que pilotan a
     P1 con el cerebro de IA, o un futuro modo espectador) el filter deja la
     lista VACÍA y el promedio sale 0/0 = NaN → la cámara se va a NaN y la
     pantalla queda del color del cielo, sin un solo error en consola. Caído
     en la primera captura del 6/08; el respaldo cuesta una línea. */
  let hum = DESC.racers.filter(r => r.human);
  if(!hum.length) hum = DESC.racers;
  let ax = 0, az = 0;
  for(const r of hum){ ax += r.x; az += r.z; }
  ax /= hum.length; az /= hum.length;

  /* punto mirado: por delante del corredor (mirar adelante = ir rápido).
     Se calcula en coordenadas PLANAS (las de la física) y se pasa al espacio
     de mundo aplicando la inclinación — así la cámara sigue la cuesta sin que
     la simulación sepa que existe. */
  _camLook.set(ax * K.camXFollow, K.camLookY, az - K.camLookAhead);
  if(DESC.world){ DESC.world.updateMatrixWorld(); DESC.world.localToWorld(_camLook); }

  /* y la cámara, a camDist de ese punto con camPitch grados de PICADO, en
     espacio de MUNDO (sin inclinar): mantener la cámara fuera del grupo es lo
     que hace visible la pendiente — si se inclinara con él, el marco relativo
     sería idéntico y no se vería ninguna cuesta.
     Formulado así, camPitch ES literalmente el ángulo de la mirada: subirlo
     en consola pica más la vista sin descuadrar nada. */
  const p = K.camPitch * Math.PI / 180;
  _camPos.set(
    _camLook.x,
    _camLook.y + Math.sin(p) * K.camDist,
    _camLook.z + Math.cos(p) * K.camDist
  );

  if(!_camInit){ DESC.cam.position.copy(_camPos); _camInit = true; }
  else DESC.cam.position.lerp(_camPos, Math.min(1, K.camLag * dt));
  DESC.cam.lookAt(_camLook);

  /* el fondo VIAJA con la cámara (parallax de distancia infinita): hereda su
     posición pero NO su rotación, así la cordillera no se ladea al picar la
     vista y no se descuelga a medida que desciendes 450 u de altura. */
  if(DESC.backdrop) DESC.backdrop.position.copy(DESC.cam.position);

  /* FOV que se abre con la velocidad: el truco más barato y más eficaz
     para que 36 u/s se sientan como 90. */
  const fast = hum.reduce((m, r) => Math.max(m, r.spd), 0);   // mismo respaldo que el ancla
  const k = Math.max(0, Math.min(1, (fast - K.spdBase * 0.6) / (K.spdBase * 0.85)));
  const want = K.fovBase + K.fovSpeed * k;
  DESC.cam.fov += (want - DESC.cam.fov) * Math.min(1, 4 * dt);
  DESC.cam.updateProjectionMatrix();
}

/* =====================================================================
   HUD
   ===================================================================== */
function buildHud(){
  const d = document.createElement('div');
  d.id = 'descHud';
  d.style.cssText =
    'position:fixed;inset:0;z-index:120;pointer-events:none;' +
    'font:13px/1.45 ui-monospace,Consolas,monospace;color:#fff;' +
    'text-shadow:0 2px 6px rgba(0,0,0,.75)';
  d.innerHTML =
    '<div id="dTop" style="position:absolute;top:14px;left:50%;transform:translateX(-50%);' +
      'text-align:center;font-size:15px;font-weight:700"></div>' +
    '<div id="dLeft" style="position:absolute;top:14px;left:16px;background:rgba(6,10,20,.55);' +
      'padding:9px 13px;border-radius:9px"></div>' +
    '<div id="dRight" style="position:absolute;top:14px;right:16px;background:rgba(6,10,20,.55);' +
      'padding:9px 13px;border-radius:9px;text-align:right"></div>' +
    '<div id="dBig" style="position:absolute;top:38%;left:50%;transform:translate(-50%,-50%);' +
      'font-size:84px;font-weight:900;letter-spacing:-2px"></div>' +
    '<div id="dBar" style="position:absolute;left:50%;bottom:22px;transform:translateX(-50%);' +
      'width:min(620px,72vw);height:9px;background:rgba(0,0,0,.42);border-radius:6px;overflow:hidden">' +
      '<div id="dFill" style="height:100%;width:0;background:#fff;border-radius:6px"></div></div>' +
    '<div id="dHelp" style="position:absolute;left:16px;bottom:16px;opacity:.6;font-size:11px">' +
      'A/D carvear · ESPACIO saltar · SHIFT turbo · J empujar · R reiniciar · T semilla nueva<br>' +
      'afinado en vivo desde la consola: <b>DESC.K</b></div>';
  document.body.appendChild(d);
  DESC.hud = {
    root:d, top:d.querySelector('#dTop'), left:d.querySelector('#dLeft'),
    right:d.querySelector('#dRight'), big:d.querySelector('#dBig'),
    fill:d.querySelector('#dFill'),
  };
}

function updateHud(){
  const h = DESC.hud; if(!h) return;
  const me = DESC.racers[0];

  /* puesto en vivo: cuenta cuántos van por delante */
  const order = DESC.racers.slice().sort((a, b) => a.z - b.z);
  const place = order.indexOf(me) + 1;

  h.left.innerHTML =
    '<div style="font-size:26px;font-weight:900;line-height:1">' + place + 'º</div>' +
    '<div style="opacity:.8">' + Math.round(me.spd * 2.6) + ' km/h</div>' +
    '<div style="opacity:.8">turbo ' + '▮'.repeat(Math.ceil(me.dash / K.dashMax * 6)).padEnd(6, '▯') + '</div>';

  h.right.innerHTML =
    '<div style="font-size:20px;font-weight:800">' + me.pts + ' pts</div>' +
    '<div style="opacity:.8">' + me.tricks + ' giros</div>' +
    '<div style="opacity:.8">' + DESC.t.toFixed(1) + ' s</div>';

  h.top.innerHTML = order.map(r =>
    '<span style="color:#' + r.col.toString(16).padStart(6, '0') + ';margin:0 7px">' +
    r.name + '</span>').join('');

  h.fill.style.width = Math.min(100, (-me.z / K.len) * 100) + '%';

  if(DESC.phase === 'countdown'){
    const n = Math.ceil(DESC.count);
    h.big.textContent = n > 0 ? n : '¡YA!';
    h.big.style.opacity = 1;
  } else if(DESC.phase === 'finish'){
    h.big.style.fontSize = '34px';
    h.big.innerHTML = 'META<br>' + DESC.finishOrder.map((r, i) =>
      '<div style="font-size:17px;margin-top:6px;color:#' + r.col.toString(16).padStart(6, '0') + '">' +
      (i + 1) + 'º ' + r.name + ' — ' + r.time.toFixed(1) + 's · ' + r.pts + ' pts</div>').join('') +
      '<div style="font-size:12px;opacity:.6;margin-top:14px">R reiniciar · T semilla nueva</div>';
    h.big.style.opacity = 1;
  } else {
    h.big.style.opacity = 0;
  }
}

/* =====================================================================
   ARRANQUE / REINICIO
   ===================================================================== */
function start(seed){
  /* limpia la escena anterior (reiniciar tiene que ser instantáneo: es la
     herramienta que más vas a usar afinando el tacto) */
  if(DESC.scene){
    DESC.scene.traverse(o => {
      if(o.geometry) o.geometry.dispose();
      if(o.material){ const m = o.material; (Array.isArray(m) ? m : [m]).forEach(x => {
        if(x.map) x.map.dispose(); x.dispose(); }); }
    });
  }
  DESC.seed = seed;
  DESC.rng = mulberry32(seed);
  DESC.obst = genTrack(DESC.rng);
  DESC.buckets = bucketize(DESC.obst);
  buildScene();
  DESC.racers = [];
  for(let i = 0; i < 4; i++) DESC.racers.push(makeRacer(i, i < HUMANS));
  DESC.t = 0; DESC.phase = 'countdown'; DESC.count = 3.2;
  DESC.finishOrder = [];
  _camInit = false;
  if(DESC.hud){ DESC.hud.big.style.fontSize = '84px'; }
  console.log('[descenso] semilla=' + seed + ' · ' + DESC.obst.length + ' obstáculos · piel=' + SKIN);
}

DESC._start = start;    // expuesto para sondas: correr N carreras seguidas a paso fijo
                        // sin pagar una recarga de 95 MB por muestra

/* =====================================================================
   TICK — lo llama frame() del juego
   ===================================================================== */
DESC.tick = function(dt){
  if(!DESC.scene) return;
  dt = Math.min(0.033, dt);

  if(DESC.phase === 'countdown'){
    DESC.count -= dt;
    if(DESC.count <= 0) DESC.phase = 'race';
  } else if(DESC.phase === 'race'){
    DESC.t += dt;
    for(const r of DESC.racers) stepRacer(r, dt);
    leash();
    if(DESC.racers.every(r => r.done)) DESC.phase = 'finish';
    /* corte de cortesía: 8 s después del primero se cierra la carrera */
    if(DESC.finishOrder.length && DESC.t - DESC.finishOrder[0].time > 8){
      for(const r of DESC.racers) if(!r.done){
        r.done = true; r.time = DESC.t; DESC.finishOrder.push(r);
        r.place = DESC.finishOrder.length;
        r.pts += K.ptsPos[Math.min(K.ptsPos.length - 1, r.place - 1)];
      }
      DESC.phase = 'finish';
    }
  }

  stepCamera(dt);
  updateHud();
};

DESC.render = function(){
  if(!DESC.scene) return;
  const rr = GAME_RENDERER();
  if(!rr) return;
  rr.setRenderTarget(null);          // el juego usa composer/RTs; volvemos a pantalla
  rr.render(DESC.scene, DESC.cam);
};

/* =====================================================================
   ENTRADA (mismo patrón que ?explorar: esconder la home a base de insistir,
   porque el arranque dura lo que tarden los 95 MB de assets)
   ===================================================================== */
addEventListener('keydown', e => {
  if(!DESC.on) return;
  if(e.code === 'KeyR'){ start(DESC.seed); e.preventDefault(); }
  if(e.code === 'KeyT'){ start((Math.random() * 1e9) | 0); e.preventDefault(); }
});
addEventListener('resize', () => {
  if(DESC.cam){ DESC.cam.aspect = innerWidth / innerHeight; DESC.cam.updateProjectionMatrix(); }
});

function boot(){
  if(DESC._built) return;
  if(typeof THREE === 'undefined' || !GAME_RENDERER()) return;   // espera a que el juego monte el renderer
  DESC._built = true;
  buildHud();
  start(parseInt(_qs.get('semilla') || '', 10) || ((Math.random() * 1e9) | 0));
  DESC.on = true;
  let n = 0;
  const t = setInterval(() => {
    for(const id of ['startOverlay', 'hud', 'shopOverlay', 'scoreOverlay']){
      const el = document.getElementById(id); if(el) el.style.display = 'none';
    }
    if(++n > 120) clearInterval(t);
  }, 250);
}
const _bootT = setInterval(() => { boot(); if(DESC._built) clearInterval(_bootT); }, 60);
boot();

})();
