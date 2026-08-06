/* =====================================================================
   ►DESCENSO — PROTOTIPO (carrera de transición entre stages)  ·  v2

   Minijuego de sandboard / snowboard / surf que se juega ENTRE dos mundos.
   Un solo sistema con tres pieles: cambia la paleta y el material del suelo,
   no la mecánica.

   ---------------------------------------------------------------------
   CÓMO SE ENTRA (igual que ?explorar):

        rumble_arena_cinta_v4.html?descenso
        rumble_arena_cinta_v4.html?descenso&humanos=2      2 humanos
        rumble_arena_cinta_v4.html?descenso&semilla=1234   pista repetible
        rumble_arena_cinta_v4.html?descenso&piel=nieve     nieve (hielo→lanzadera)
        rumble_arena_cinta_v4.html?descenso&piel=mar       agua (piratas)

   Sin el parámetro, este fichero sale en su primera línea y no hace nada.

   ---------------------------------------------------------------------
   CONTROLES

     Stick ←/→ · A/D ....... carvear
     A         · Espacio ... saltar (ollie)
     RT        · Shift ..... turbo — es lo ÚNICO que pasa del tope de velocidad
     X         · J ......... ATAQUE: dash-meteorito con tu color (cooldown)
     LT        · L ......... AGARRAR al rival — y el MISMO botón es el CONTRA
     RB        · U ......... usar objeto recogido

     TRUCOS (sólo en el aire, cada uno con DURACIÓN FIJA):
     B         · 1 ......... Indy .................. 0,40 s ...  40 pts
     D-pad ↓   · 6 ......... Superman .............. 0,50 s ...  60 pts
     D-pad ←/→ · 4 ......... 360 lateral ........... 0,65 s ...  90 pts
     Y         · 2 ......... Mortal ATRÁS .......... 0,80 s ... 130 pts
     LB        · 3 ......... Mortal ADELANTE ....... 0,80 s ... 130 pts
     D-pad ↑   · 5 ......... DOBLE mortal atrás .... 1,35 s ... 320 pts

     R reiniciar (misma semilla) · T semilla nueva

   AFINADO EN CALIENTE desde la consola, sin recargar:
        DESC.K.tilt = 26 ; DESC.K.spdMax = 70 ; DESC.K.camPitch = 40

   ---------------------------------------------------------------------
   LAS REGLAS DEL JUEGO (pedidas por Toni, 6/08)

   · NO CAERTE TE ACELERA. La velocidad sube sola mientras aguantes en pie,
     hasta K.spdMax. El turbo es lo único que pasa de ahí. Bajar limpio es la
     recompensa; no hay velocidad "de crucero" que te regalen.
   · CAERTE = VELOCIDAD 0 y volver a empezar. Es el castigo gordo y el único.
   · CHOCAR sólo resta velocidad… pero varios choques SEGUIDOS (contra roca,
     contra rival o contra compañero) te tiran al suelo. Encadenar errores es
     lo que mata, no el error suelto.
   · EL TRUCO NO SE FALLA GIRANDO, SE FALLA POR TIEMPO. Cada truco dura lo que
     dura; si tocas suelo a media animación, te caes. Por eso las rampas tienen
     3 tamaños: la grande no es "más alto", es "aquí cabe el doble mortal".
   · AGARRAR tiene CONTRA. Si molestas a alguien y responde con su botón de
     agarre dentro de la ventana, el que se va al suelo eres tú.
   · No hay vidas ni eliminación: es una transición, no un stage.

   ---------------------------------------------------------------------
   CÓMO ESTÁ HECHO

   1) LA PENDIENTE ES MENTIRA. La física corre en un plano llano; todo el
      contenido visual cuelga de un grupo inclinado K.tilt grados, con la
      cámara FUERA de él. Así el surf pirata es el mismo código con tilt≈0 y
      no hay que auditar 30.000 líneas que asumen que Y es arriba.
   2) LAS RAMPAS SÍ SON REALES: subes por su geometría y sales despedido con
      lo que traías. Si también fueran falsas, el salto se sentiría a goma.
   3) GARGANTA, NO CARRETERA. Los límites laterales son paredes de roca que
      tapan el horizonte: sólo se ve paisaje AL FONDO, por la salida. El
      efecto túnel es lo que hace que la velocidad se lea.
   4) PISTA CON SEMILLA (mulberry32). Lo único determinista, a propósito: es
      lo que tendrán que compartir los clientes el día del online.
   5) ESCENA, CÁMARA Y RENDER PROPIOS. No comparte estado con el juego.
   ===================================================================== */
(function(){
'use strict';

const Q = location.search;
if(!/[?&]descenso(=|&|$)/.test(Q)) return;

const _qs    = new URLSearchParams(Q);
const HUMANS = Math.max(1, Math.min(4, parseInt(_qs.get('humanos')||'1', 10) || 1));
const SKIN   = (_qs.get('piel') || 'arena').toLowerCase();
const TAU    = Math.PI * 2;

/* RNG con semilla: TODO lo que genera la pista pasa por aquí. */
function mulberry32(a){
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* =====================================================================
   K — TODO el tacto, en un sitio y editable en caliente
   ===================================================================== */
const K = {
  /* --- pista --- */
  len:        2600,
  width:      44,     // ancho jugable entre paredes de roca
  rowEvery:   30,
  clearStart: 130,
  clearEnd:   90,

  /* --- VELOCIDAD ACUMULATIVA ---
     No hay crucero: arrancas lento y la velocidad SUBE mientras no te caigas.
     Es el bucle de recompensa del minijuego entero. */
  spdStart:   16,     // con la que sales (y a la que vuelves tras caerte: 0 → sube)
  spdMax:     64,     // tope aguantando en pie
  spdRamp:    2.9,    // u/s² de subida limpia
  turboMax:   88,     // el turbo SUPERA el tope
  turboRamp:  46,     // qué rápido sube con turbo
  turboDecay: 26,     // qué rápido vuelve al tope al soltarlo
  dashMax:    2.4,    // segundos de turbo
  dashRegen:  0.34,
  slowMul:    0.55,   // dentro de una zona blanda

  /* --- CHOQUES Y CAÍDAS --- */
  crashMul:   0.55,   // velocidad que te queda tras un choque
  crashTime:  0.55,   // sin control tras chocar
  crashChain: 3,      // choques seguidos que te tiran al suelo
  crashWindow:3.0,    // ventana (s) en la que cuentan como "seguidos"
  fallTime:   1.35,   // en el suelo tras caerte (y la velocidad se queda a 0)

  /* --- lateral (el tacto de la tabla) --- */
  latAcc:     84,
  latMax:     25,
  latDamp:    0.90,   // más bajo = patina más
  airCtrl:    0.40,

  /* --- salto / aire ---
     Los tamaños de rampa están calculados para que CADA TRUCO tenga su rampa:
       ollie   vy 15 → 0,58 s   (Indy, Superman)
       peq.    vy 22 → 0,85 s   (+360)
       media   vy 30 → 1,15 s   (+mortales)
       grande  vy 41 → 1,58 s   (+doble mortal)  */
  grav:       52,
  jumpV:      15,
  rampVy:     { s:16, m:22, l:37 },
  rampSpdK:   0.05,   // cuánta velocidad se convierte en altura extra. BAJO a
                      // propósito: si la velocidad infla mucho el salto, a 70 u/s
                      // la rampa mediana ya daría para el doble mortal y el
                      // escalonado de trucos se deshace (medido abajo).

  /* --- ATAQUE (dash-meteorito) --- */
  atkSpeed:   34,     // empujón de velocidad
  atkTime:    0.55,   // cuánto dura el meteorito
  atkCd:      4.2,
  atkPush:    30,     // a quien pilles de lado, lo aparta
  atkPts:     45,

  /* --- AGARRE Y CONTRA --- */
  grabRange:  7.0,
  grabTime:   0.5,    // ventana en la que la víctima puede CONTRAatacar
  grabSlow:   0.6,    // multiplicador de velocidad al agarrado
  grabCd:     1.2,
  grabPts:    60,
  counterPts: 120,

  /* --- puntos --- */
  ptsPos:     [300, 200, 120, 60],
  comboMul:   [1, 1.5, 2, 2.5],

  /* --- LA PENDIENTE FALSA --- */
  tilt:       24,     // grados de bajada aparente (subir = más vertical)

  /* --- cámara --- */
  camPitch:   30,     // picado de la mirada, en grados
  camDist:    30,
  camLookAhead: 17,
  camLookY:   2.4,
  camLag:     8.0,
  camXFollow: 0.55,
  fovBase:    58,
  fovSpeed:   26,     // cuánto se abre a tope: la dopamina de la velocidad
  shakeSpeed: 0.5,    // temblor con la velocidad
  leash:      70,     // correa SÓLO entre humanos (cámara compartida)

  /* --- IA --- */
  aiBand:     0.14,
  aiMaxGap:   170,
  aiLook:     50,
  aiSkill:    [0.93, 0.87, 0.81],
};

/* --------------------------------------------------------------------
   TRUCOS. duración fija; si tocas suelo antes de cerrarla, al suelo.
   `rot` describe qué eje gira y cuántas vueltas → una sola rutina los anima
   a todos y el día de las animaciones sólo hay que cambiar esta tabla por
   nombres de clip.
   -------------------------------------------------------------------- */
const TRICKS = {
  indy:   { name:'Indy',              dur:0.40, pts:40,  axis:'z', turns:0.18 },
  super:  { name:'Superman',          dur:0.50, pts:60,  axis:'x', turns:0.15 },
  spin:   { name:'360',               dur:0.65, pts:90,  axis:'y', turns:1 },
  flipB:  { name:'Mortal atrás',      dur:0.80, pts:130, axis:'x', turns:-1 },
  flipF:  { name:'Mortal adelante',   dur:0.80, pts:130, axis:'x', turns:1 },
  flipB2: { name:'DOBLE mortal atrás',dur:1.35, pts:320, axis:'x', turns:-2 },
};

/* --------------------------------------------------------------------
   PIELES. Cambiar de mundo = cambiar esta ficha, nada más.
   -------------------------------------------------------------------- */
const SKINS = {
  arena: { sky:0xf0cf9a, fog:0xe8c187, ground:0xdfb570, gr2:0xcfa25c,
           wall:0xa8794a, wall2:0x8a6039, rock:0x7d6547, ramp:0xa8672c,
           part:0xf0d9a8, valley:0xd8ae72, ridge:0xbe9463, sun:0xfff0d0, hemi:0xffe0b0 },
  nieve: { sky:0xdfeefb, fog:0xd6e7f4, ground:0xf2f8fd, gr2:0xdde9f3,
           wall:0x8fa4b6, wall2:0x6f8496, rock:0x6d7f8e, ramp:0x7fa8cc,
           part:0xffffff, valley:0xc6dced, ridge:0xa4bcd2, sun:0xffffff, hemi:0xdcecff },
  mar:   { sky:0x8fdcec, fog:0x76cde2, ground:0x2f9fc4, gr2:0x2588ab,
           wall:0x4a6b78, wall2:0x37525d, rock:0x40606d, ramp:0xcdf6ff,
           part:0xdffaff, valley:0x2f9fc4, ridge:0x4a8fa8, sun:0xfffbe8, hemi:0xbfeef8 },
};
const PAL = SKINS[SKIN] || SKINS.arena;

const RACER_COL = [0x35c9ff, 0xff5a52, 0x7bf06a, 0xffd23f];

/* PUENTE CON EL JUEGO: `renderer` y `keys` son const del ámbito léxico del
   script grande (globales por nombre, NO propiedades de window). Por eso este
   fichero se carga después, justo antes de </body>. */
function GAME_RENDERER(){ return (typeof renderer !== 'undefined') ? renderer : null; }
function GAME_KEYS(){ return (typeof keys !== 'undefined') ? keys : null; }

/* =====================================================================
   ESTADO
   ===================================================================== */
const DESC = window.DESC = {
  on:false, K, TRICKS,
  scene:null, cam:null, world:null, backdrop:null,
  seed:0, rng:null,
  racers:[], obst:[], buckets:null,
  t:0, phase:'countdown', count:3.2,
  finishOrder:[], hud:null, fx:null,
  _built:false,
};

const HALF = () => K.width / 2;
const BUCKET = 60;

/* =====================================================================
   TEXTURA DEL SUELO — arena/nieve/agua de verdad, no una carretera
   Pedido de Toni: "que se note la textura de la arena, no una pista lisa".
   Se pinta a mano en un canvas: base + ondas de duna + grano grueso + grano
   fino. Sin líneas de carril (eso leía como carretera).
   ===================================================================== */
function groundTexture(){
  const S = 512;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const g = cv.getContext('2d');
  const hex = c => '#' + c.toString(16).padStart(6, '0');

  g.fillStyle = hex(PAL.ground); g.fillRect(0, 0, S, S);

  /* ONDAS: las crestas de duna / los surcos de nieve / el oleaje. Son lo que
     de verdad hace que se lea el relieve al pasar por encima. */
  for(let i = 0; i < 26; i++){
    const y = (i / 26) * S + Math.sin(i * 1.7) * 6;
    g.strokeStyle = hex(PAL.gr2);
    g.globalAlpha = 0.20 + 0.16 * Math.abs(Math.sin(i * 2.3));
    g.lineWidth = 6 + 10 * Math.abs(Math.cos(i * 1.1));
    g.beginPath();
    for(let x = 0; x <= S; x += 16){
      const yy = y + Math.sin((x / S) * Math.PI * 3 + i) * 11 + Math.sin(x * 0.05 + i * 2) * 4;
      x === 0 ? g.moveTo(x, yy) : g.lineTo(x, yy);
    }
    g.stroke();
  }
  /* brillo en la cresta de cada onda: da volumen sin necesitar normal map */
  g.globalAlpha = 0.16;
  for(let i = 0; i < 26; i++){
    const y = (i / 26) * S + Math.sin(i * 1.7) * 6 - 5;
    g.strokeStyle = '#ffffff'; g.lineWidth = 2.5;
    g.beginPath();
    for(let x = 0; x <= S; x += 16){
      const yy = y + Math.sin((x / S) * Math.PI * 3 + i) * 11 + Math.sin(x * 0.05 + i * 2) * 4;
      x === 0 ? g.moveTo(x, yy) : g.lineTo(x, yy);
    }
    g.stroke();
  }
  g.globalAlpha = 1;

  /* GRANO: grueso (piedrecillas) + fino (el grano de la arena) */
  for(let i = 0; i < 900; i++){
    const x = Math.random() * S, y = Math.random() * S, r = 1 + Math.random() * 3;
    g.fillStyle = 'rgba(0,0,0,' + (0.03 + Math.random() * 0.07) + ')';
    g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  }
  for(let i = 0; i < 2600; i++){
    g.fillStyle = (Math.random() < 0.5 ? 'rgba(255,255,255,' : 'rgba(0,0,0,') + (0.03 + Math.random() * 0.06) + ')';
    g.fillRect(Math.random() * S, Math.random() * S, 1.6, 1.6);
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, K.len / 34);      // 3 a lo ancho: el grano se ve a tamaño real
  tex.anisotropy = 8;
  return tex;
}

/* =====================================================================
   GENERACIÓN DE PISTA
   Regla dura: SIEMPRE queda un carril libre en cada fila.
   ===================================================================== */
function genTrack(rng){
  const obst = [];
  const LANES = 5;
  const laneX = i => -HALF() + (K.width / LANES) * (i + 0.5);
  let z = -K.clearStart, sinceRamp = 0;

  while(z > -(K.len - K.clearEnd)){
    const free = Math.floor(rng() * LANES);
    sinceRamp++;
    if(sinceRamp >= 3 && rng() < 0.5){
      /* FILA DE RAMPAS. El tamaño se sortea con pesos: la grande es rara, y
         por eso el doble mortal vale 320. */
      sinceRamp = 0;
      const n = 1 + (rng() < 0.55 ? 1 : 0);
      const used = {};
      for(let k = 0; k < n; k++){
        let l = Math.floor(rng() * LANES);
        if(l === free || used[l]) l = (l + 1) % LANES;
        if(l === free) continue;
        used[l] = 1;
        const r = rng();
        const size = r < 0.46 ? 's' : (r < 0.83 ? 'm' : 'l');
        const dim  = size === 's' ? { w:7.0, len:11, h:2.4 }
                   : size === 'm' ? { w:8.4, len:15, h:3.8 }
                   :                { w:10.5, len:21, h:6.2 };
        obst.push({ type:'ramp', size, x:laneX(l), z, ...dim });
      }
    } else {
      const n = 1 + Math.floor(rng() * 3);
      const used = {};
      for(let k = 0; k < n; k++){
        let l = Math.floor(rng() * LANES);
        if(l === free || used[l]) continue;
        used[l] = 1;
        if(rng() < 0.22) obst.push({ type:'slow', x:laneX(l), z, w:8.4, len:17 });
        else             obst.push({ type:'rock', x:laneX(l) + (rng()-0.5)*3, z, r:2.4 + rng()*1.5 });
      }
    }
    /* RECOGIDA en el carril libre: premia leer el hueco bueno, no sólo esquivar */
    if(rng() < 0.34) obst.push({ type:'pick', x:laneX(free), z: z - K.rowEvery*0.4, taken:false });

    z -= K.rowEvery * (0.8 + rng() * 0.5);
  }
  return obst;
}

/* --------------------------------------------------------------------
   OBJETOS. Dos, de efecto inmediato: en un greybox un proyectil con física
   propia cuesta mucho y no aporta nada a la pregunta que estamos contestando.
   -------------------------------------------------------------------- */
const ITEMS = {
  turbo: { name:'TURBO', col:0x7bf06a, use(r){ r.dash = K.dashMax; r.spd = Math.min(K.turboMax, r.spd + 26); } },
  rayo:  { name:'RAYO',  col:0xffd23f, use(r){
    /* al que va PRIMERO, al suelo. Sólo sirve si no vas ganando tú. */
    let lider = null;
    for(const q of DESC.racers) if(!q.done && q !== r && (!lider || q.z < lider.z)) lider = q;
    if(lider && lider.z < r.z){ fall(lider); r.pts += 80; }
  } },
};
const ITEM_KEYS = Object.keys(ITEMS);

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

/* altura del suelo: 0 salvo sobre una rampa. Coincide EXACTAMENTE con la
   geometría que se dibuja (si divergen, el salto se siente a goma). */
function groundYAt(x, z){
  let y = 0;
  for(const o of nearObst(z, 26)){
    if(o.type !== 'ramp') continue;
    if(Math.abs(x - o.x) > o.w / 2) continue;
    const z0 = o.z + o.len / 2, z1 = o.z - o.len / 2;
    if(z > z0 || z < z1) continue;
    y = Math.max(y, ((z0 - z) / o.len) * o.h);
  }
  return y;
}
DESC._gy = groundYAt;

/* =====================================================================
   ESCENA
   ===================================================================== */
function buildScene(){
  const sc = new THREE.Scene();
  sc.background = new THREE.Color(PAL.sky);
  sc.fog = new THREE.Fog(PAL.fog, 150, 560);

  sc.add(new THREE.HemisphereLight(PAL.hemi, 0x3a3a48, 1.0));
  const sun = new THREE.DirectionalLight(PAL.sun, 1.2);
  sun.position.set(-40, 80, 20);
  sc.add(sun);

  /* MUNDO INCLINADO: todo lo que se pisa cuelga de aquí. La física trabaja
     en las coordenadas SIN rotar; la inclinación es puro maquillaje. */
  const world = new THREE.Group();
  world.rotation.x = -K.tilt * Math.PI / 180;
  sc.add(world);
  DESC.world = world;

  const rng = mulberry32(DESC.seed ^ 0x5a17);   // rng aparte para el decorado

  /* --- SUELO --- */
  const gm = new THREE.Mesh(
    new THREE.PlaneGeometry(K.width, K.len + 500),
    new THREE.MeshLambertMaterial({ map: groundTexture() })
  );
  gm.rotation.x = -Math.PI / 2;
  gm.position.set(0, 0, -K.len / 2 + 120);
  world.add(gm);

  /* --- PAREDES DE ROCA (la garganta) ---
     Pedido de Toni: nada de quitamiedos ni de paisaje lateral. Bajas por un
     canal de montaña/duna: rocas grandes amontonadas que TAPAN el horizonte.
     Es lo que crea el efecto túnel y lo que hace legible la velocidad. */
  {
    const rocasPorLado = Math.floor((K.len + 400) / 9);
    const total = rocasPorLado * 2;
    const im = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.MeshLambertMaterial({ color: PAL.wall, flatShading:true }), total);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(),
          p = new THREE.Vector3(), s = new THREE.Vector3();
    let i = 0;
    for(let k = 0; k < rocasPorLado; k++){
      const z = 120 - k * 9;
      for(const side of [-1, 1]){
        const r  = 2.8 + rng() * 3.6;
        const dx = HALF() + r * 0.5 + rng() * 2.0;
        p.set(side * dx, r * 0.25 + rng() * 1.4, z + (rng() - 0.5) * 6);
        q.setFromEuler(new THREE.Euler(rng() * 3, rng() * 3, rng() * 3));
        s.set(r, r * (0.75 + rng() * 0.5), r);
        m.compose(p, q, s);
        im.setMatrixAt(i++, m);
      }
    }
    im.count = i;
    im.instanceMatrix.needsUpdate = true;
    world.add(im);

    /* SEGUNDA FILA, más alta y más oscura: cierra el cielo por los lados.
       Sin esto se veía el paisaje por encima de las rocas y se perdía el túnel. */
    const nb = Math.floor((K.len + 400) / 16) * 2;
    const im2 = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.MeshLambertMaterial({ color: PAL.wall2, flatShading:true }), nb);
    let j = 0;
    for(let k = 0; k < nb / 2; k++){
      const z = 120 - k * 16;
      for(const side of [-1, 1]){
        /* alejadas y no tan altas: pegadas al carril tapaban la garganta entera
           y no se veía ni la pista ni a los rivales (captura del 6/08) */
        const r = 9 + rng() * 9;
        p.set(side * (HALF() + 17 + rng() * 12), r * 0.18, z + (rng() - 0.5) * 10);
        q.setFromEuler(new THREE.Euler(rng() * 3, rng() * 3, rng() * 3));
        s.set(r, r * (0.9 + rng() * 0.7), r);
        m.compose(p, q, s);
        im2.setMatrixAt(j++, m);
      }
    }
    im2.count = j;
    im2.instanceMatrix.needsUpdate = true;
    world.add(im2);
  }

  /* --- OBSTÁCULOS (un InstancedMesh por tipo, color único: en r128
         instanceColor nace con el tamaño de this.count y es una trampa) --- */
  const rocks = DESC.obst.filter(o => o.type === 'rock');
  const ramps = DESC.obst.filter(o => o.type === 'ramp');
  const slows = DESC.obst.filter(o => o.type === 'slow');
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(),
        p = new THREE.Vector3(), s = new THREE.Vector3();

  if(rocks.length){
    const im = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.MeshLambertMaterial({ color: PAL.rock, flatShading:true }), rocks.length);
    rocks.forEach((o, i) => {
      p.set(o.x, o.r * 0.5, o.z);
      q.setFromEuler(new THREE.Euler(o.r, o.x, o.z));
      s.set(o.r, o.r * 0.85, o.r);
      m.compose(p, q, s); im.setMatrixAt(i, m);
    });
    im.instanceMatrix.needsUpdate = true;
    world.add(im);
  }

  if(ramps.length){
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      -.5,0,.5,  .5,0,.5,  .5,1,-.5,   -.5,0,.5,  .5,1,-.5, -.5,1,-.5,
      -.5,0,.5, -.5,1,-.5, -.5,0,-.5,   .5,0,.5,  .5,0,-.5,  .5,1,-.5,
      -.5,0,-.5,-.5,1,-.5,  .5,1,-.5,  -.5,0,-.5,  .5,1,-.5,  .5,0,-.5,
    ]), 3));
    geo.computeVertexNormals();
    const im = new THREE.InstancedMesh(
      geo, new THREE.MeshLambertMaterial({ color: PAL.ramp, flatShading:true }), ramps.length);
    ramps.forEach((o, i) => {
      p.set(o.x, 0, o.z); q.identity(); s.set(o.w, o.h, o.len);
      m.compose(p, q, s); im.setMatrixAt(i, m);
    });
    im.instanceMatrix.needsUpdate = true;
    world.add(im);

    /* LABIO de la rampa: una barra oscura en el borde de salida.
       La cara de la rampa mira hacia ARRIBA, así que la luz hemisférica se la
       come y por oscuro que pongas el material queda del color del suelo
       (comprobado con captura). Lo que hace legible una rampa a distancia es
       el canto, no el relleno — y de paso el jugador ve DÓNDE despega.
       El tamaño del labio delata además el tamaño de la rampa = qué truco cabe. */
    const lip = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshLambertMaterial({ color: 0x33302c }), ramps.length);
    ramps.forEach((o, i) => {
      p.set(o.x, o.h, o.z - o.len / 2 + 0.5);
      q.identity();
      s.set(o.w * 1.03, 0.55, 1.1);
      m.compose(p, q, s); lip.setMatrixAt(i, m);
    });
    lip.instanceMatrix.needsUpdate = true;
    world.add(lip);

    /* y dos jalones verticales a los lados del labio: se ven por encima de
       todo lo demás y avisan de la rampa MUCHO antes de llegar */
    const post = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshLambertMaterial({ color: 0xff8a3d }), ramps.length * 2);
    let pi = 0;
    ramps.forEach(o => {
      for(const side of [-1, 1]){
        p.set(o.x + side * o.w / 2, o.h + 1.6, o.z - o.len / 2 + 0.5);
        q.identity(); s.set(0.5, 3.2, 0.5);
        m.compose(p, q, s); post.setMatrixAt(pi++, m);
      }
    });
    post.count = pi;
    post.instanceMatrix.needsUpdate = true;
    world.add(post);
  }

  if(slows.length){
    const im = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshLambertMaterial({ color: PAL.gr2, transparent:true, opacity:.8 }), slows.length);
    q.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    slows.forEach((o, i) => {
      p.set(o.x, 0.06, o.z); s.set(o.w, o.len, 1);
      m.compose(p, q, s); im.setMatrixAt(i, m);
    });
    im.instanceMatrix.needsUpdate = true;
    world.add(im);
  }

  /* --- RECOGIDAS: mallas sueltas (son ~30, y así se ocultan de una en una
         al cogerlas sin pelearse con el InstancedMesh) --- */
  {
    const picks = DESC.obst.filter(o => o.type === 'pick');
    const geo = new THREE.OctahedronGeometry(1.25, 0);
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x666633 });
    for(const o of picks){
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(o.x, 2.2, o.z);
      o._m = mesh;
      world.add(mesh);
    }
    DESC.picks = picks;
  }

  /* --- META --- */
  {
    const g = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    for(const side of [-1, 1]){
      const c = new THREE.Mesh(new THREE.BoxGeometry(2.6, 18, 2.6), mat);
      c.position.set(side * (HALF() - 1), 9, 0); g.add(c);
    }
    const top = new THREE.Mesh(new THREE.BoxGeometry(K.width, 3.4, 2.6), mat);
    top.position.y = 16.3; g.add(top);
    g.position.z = -K.len;
    world.add(g);
  }

  /* --- PAISAJE, SÓLO AL FONDO ---
     Toni: "sólo al final de la pista puedes ver paisaje". Las paredes de roca
     tapan los lados, así que este fondo únicamente asoma por la salida de la
     garganta. Va MUY bajo a propósito: verlo por debajo de la línea de la
     pista es lo que dice "estoy bajando hacia allí". */
  {
    const bd = new THREE.Group();
    const valley = new THREE.Mesh(
      new THREE.PlaneGeometry(7000, 2600),
      new THREE.MeshBasicMaterial({ color: PAL.valley, depthWrite:false }));
    valley.position.set(0, -1150, -1500);
    bd.add(valley);
    const capas = [
      { z:-1450, y:-980, s:0.85, col:PAL.ridge, n:15 },
      { z:-1350, y:-880, s:0.6,  col:PAL.wall2, n:12 },
    ];
    for(const c of capas){
      const im = new THREE.InstancedMesh(
        new THREE.ConeGeometry(1, 1, 4),
        new THREE.MeshBasicMaterial({ color:c.col, depthWrite:false }), c.n);
      for(let i = 0; i < c.n; i++){
        const f = i / (c.n - 1) - 0.5;
        const w = 300 + ((i * 37) % 150);
        const h = (200 + ((i * 53) % 240)) * c.s;
        p.set(f * 3800 + ((i * 71) % 100), c.y + h / 2, c.z);
        q.setFromEuler(new THREE.Euler(0, (i * 0.7) % 1.5, 0));
        s.set(w, h, w);
        m.compose(p, q, s); im.setMatrixAt(i, m);
      }
      im.instanceMatrix.needsUpdate = true;
      bd.add(im);
    }
    bd.traverse(o => { if(o.material) o.material.fog = false; });
    sc.add(bd);
    DESC.backdrop = bd;
  }

  /* --- PARTÍCULAS: la arena/nieve/espuma que levantas ---
     Toni: "que al moverte las partículas físicamente se desplacen". Pool
     instanciado (nada de crear mallas por frame) con física propia: salen del
     pie, heredan tu velocidad lateral y caen. Es también el mejor chivato de
     velocidad que tiene el prototipo. */
  {
    const N = 420;
    const im = new THREE.InstancedMesh(
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.MeshLambertMaterial({ color: PAL.part, transparent:true, opacity:0.95 }), N);
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    world.add(im);
    DESC.parts = {
      im, N, i:0,
      x:new Float32Array(N), y:new Float32Array(N), z:new Float32Array(N),
      vx:new Float32Array(N), vy:new Float32Array(N), vz:new Float32Array(N),
      life:new Float32Array(N), size:new Float32Array(N),
    };
  }

  DESC.scene = sc;
  DESC.cam = new THREE.PerspectiveCamera(K.fovBase, innerWidth / innerHeight, 0.5, 4000);
  return sc;
}

/* --------------------------------------------------------------------
   PARTÍCULAS
   -------------------------------------------------------------------- */
function emit(x, y, z, vx, vy, vz, size){
  const P = DESC.parts; if(!P) return;
  const i = P.i = (P.i + 1) % P.N;
  P.x[i]=x; P.y[i]=y; P.z[i]=z;
  P.vx[i]=vx; P.vy[i]=vy; P.vz[i]=vz;
  P.life[i] = 0.55 + Math.random()*0.45;
  P.size[i] = size;
}
const _pm = new THREE.Matrix4(), _pq = new THREE.Quaternion(),
      _pp = new THREE.Vector3(), _ps = new THREE.Vector3();
function updateParts(dt){
  const P = DESC.parts; if(!P) return;
  for(let i = 0; i < P.N; i++){
    if(P.life[i] <= 0){ _pm.makeScale(0,0,0); P.im.setMatrixAt(i, _pm); continue; }
    P.life[i] -= dt;
    P.vy[i] -= K.grav * 0.55 * dt;
    P.vx[i] *= 0.97; P.vz[i] *= 0.99;
    P.x[i] += P.vx[i]*dt; P.y[i] += P.vy[i]*dt; P.z[i] += P.vz[i]*dt;
    if(P.y[i] < 0.05){ P.y[i] = 0.05; P.vy[i] *= -0.25; P.vx[i] *= 0.6; P.vz[i] *= 0.6; }
    const k = Math.max(0, Math.min(1, P.life[i] * 2.2));
    _pp.set(P.x[i], P.y[i], P.z[i]);
    _pq.setFromEuler(new THREE.Euler(P.x[i], P.y[i]*2, P.z[i]));
    _ps.setScalar(P.size[i] * k);
    _pm.compose(_pp, _pq, _ps);
    P.im.setMatrixAt(i, _pm);
  }
  P.im.instanceMatrix.needsUpdate = true;
}

/* =====================================================================
   CORREDORES
   ===================================================================== */
function makeRacer(i, human){
  const g = new THREE.Group();
  const col = RACER_COL[i];
  const mat = new THREE.MeshLambertMaterial({ color: col });

  /* el cuerpo va en un SUBGRUPO: los trucos rotan este, no el grupo raíz, así
     la posición y la sombra no se enteran de la voltereta. */
  const body = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.24, 4.6),
                               new THREE.MeshLambertMaterial({ color: 0x2a2f38 }));
  board.position.y = 0.12; body.add(board);
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.74, 1.7, 12), mat);
  torso.position.y = 1.4; body.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.64, 14, 10), mat);
  head.position.y = 2.6; body.add(head);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.95),
                              new THREE.MeshLambertMaterial({ color: 0x101418 }));
  nose.position.set(0, 2.6, -0.66); body.add(nose);
  g.add(body);

  /* METEORITO del ataque básico: cáscara del color del jugador. Apagada casi
     siempre. Sustituye a una animación de ataque — Toni: "así no tenemos que
     meter animaciones extrañas". */
  const meteor = new THREE.Mesh(
    new THREE.SphereGeometry(2.1, 14, 10),
    new THREE.MeshBasicMaterial({ color: col, transparent:true, opacity:0.5 }));
  meteor.position.y = 1.5; meteor.visible = false;
  g.add(meteor);

  const sh = new THREE.Mesh(new THREE.CircleGeometry(1.5, 16),
    new THREE.MeshBasicMaterial({ color:0x000000, transparent:true, opacity:0.32, depthWrite:false }));
  sh.rotation.x = -Math.PI / 2;

  DESC.world.add(g); DESC.world.add(sh);

  return {
    i, human, col,
    name: human ? ('P' + (i + 1)) : ('CPU-' + 'ABC'[Math.max(0, i - HUMANS)]),
    gfx:g, body, meteor, shadow:sh,
    padIndex: human ? (HUMANS === 1 ? 0 : i) : -1,
    kb: human && i === 0,
    x:(i - 1.5) * 7, y:0, z:0,
    vx:0, vy:0, spd:K.spdStart,
    air:false, fall:0, crash:0, crashN:0, crashT:0,
    trick:null, trickT:0, combo:0,
    dash:K.dashMax, turbo:false,
    atk:0, atkCd:0, grab:0, grabCd:0, grabbed:0, grabbedBy:null,
    item:null, slow:0,
    pts:0, tricks:0, falls:0, crashes:0,
    done:false, place:0, time:0,
    _ai:{ targetMul:1, spinAx:null, plan:null },
  };
}

/* =====================================================================
   INPUT — mapa completo (mando + teclado)
   Misma FORMA de estructura que readInput() del juego → el día del online se
   sustituye la fuente y nada más se entera.
   ===================================================================== */
const TRICK_KEYS = { indy:'Digit1', flipB:'Digit2', flipF:'Digit3', spin:'Digit4', flipB2:'Digit5', super:'Digit6' };
function readDesc(r){
  const o = { ax:0, jump:false, turbo:false, atk:false, grab:false, item:false, trick:null };
  if(!r.human) return o;
  const kk = GAME_KEYS() || {};
  if(r.kb){
    if(kk['KeyD'] || kk['ArrowRight']) o.ax += 1;
    if(kk['KeyA'] || kk['ArrowLeft'])  o.ax -= 1;
    o.jump  = !!kk['Space'];
    o.turbo = !!(kk['ShiftLeft'] || kk['ShiftRight']);
    o.atk   = !!kk['KeyJ'];
    o.grab  = !!kk['KeyL'];
    o.item  = !!kk['KeyU'];
    for(const t in TRICK_KEYS) if(kk[TRICK_KEYS[t]]){ o.trick = t; break; }
  }
  if(r.padIndex >= 0 && navigator.getGamepads){
    const gp = navigator.getGamepads(), pad = gp && gp[r.padIndex];
    if(pad){
      const lx = pad.axes[0] || 0;
      if(Math.abs(lx) > 0.22) o.ax += lx;
      const B = i => !!(pad.buttons[i] && pad.buttons[i].pressed);
      o.jump  = o.jump  || B(0);    // A
      o.turbo = o.turbo || B(7);    // RT
      o.atk   = o.atk   || B(2);    // X
      o.grab  = o.grab  || B(6);    // LT
      o.item  = o.item  || B(5);    // RB
      if(!o.trick){
        if(B(1))       o.trick = 'indy';    // B
        else if(B(3))  o.trick = 'flipB';   // Y
        else if(B(4))  o.trick = 'flipF';   // LB
        else if(B(12)) o.trick = 'flipB2';  // D-pad ↑
        else if(B(13)) o.trick = 'super';   // D-pad ↓
        else if(B(14) || B(15)) o.trick = 'spin';  // D-pad ←/→
      }
    }
  }
  o.ax = Math.max(-1, Math.min(1, o.ax));
  return o;
}

/* =====================================================================
   IA
   ===================================================================== */
function aiInput(r, dt){
  const o = { ax:0, jump:false, turbo:false, atk:false, grab:false, item:false, trick:null };
  const skill = K.aiSkill[Math.min(K.aiSkill.length - 1, Math.max(0, r.i - HUMANS))] || 0.85;
  const lead = DESC.racers.find(q => q.human) || DESC.racers[0];

  const gap = r.z - lead.z;
  let band = Math.max(-1, Math.min(1, gap / 100));
  if(Math.abs(gap) > K.aiMaxGap) band = Math.sign(gap) * 2.4;
  r._ai.targetMul = 1 + band * K.aiBand;

  /* EN EL AIRE: elige el truco MÁS CARO que le quepa en el tiempo de vuelo
     que le queda. Misma regla que el jugador, así que la IA también se estampa
     si se pasa de ambiciosa (pero con margen de seguridad según su nivel). */
  if(r.air){
    if(!r.trick && r._ai.plan !== 'done'){
      const tAir = (r.vy + Math.sqrt(Math.max(0, r.vy*r.vy + 2*K.grav*Math.max(0.01, r.y)))) / K.grav;
      const margen = 1.18 - skill * 0.16;
      let best = null;
      for(const k in TRICKS) if(TRICKS[k].dur * margen <= tAir && (!best || TRICKS[k].pts > TRICKS[best].pts)) best = k;
      if(best && skill > 0.7) o.trick = best;
      r._ai.plan = 'done';
    }
    return o;
  }
  r._ai.plan = null;

  /* esquiva + busca rampas */
  const ahead = nearObst(r.z - K.aiLook / 2, K.aiLook);
  let danger = null, dz = 1e9;
  for(const ob of ahead){
    const d = r.z - ob.z;
    if(d < 2 || d > K.aiLook || ob.type === 'ramp') continue;
    const w = ob.type === 'rock' ? ob.r + 2.4 : ob.w / 2 + 1.6;
    if(Math.abs(ob.x - r.x) > w) continue;
    if(d < dz){ dz = d; danger = ob; }
  }
  if(danger){
    o.ax = (r.x >= danger.x ? 1 : -1) * skill;
    if(Math.abs(r.x) > HALF() - 6) o.ax = -Math.sign(r.x);
  } else {
    let best = null, bd = 1e9;
    for(const ob of ahead){
      if(ob.type !== 'ramp') continue;
      const d = r.z - ob.z;
      if(d > 4 && d < K.aiLook && d < bd){ bd = d; best = ob; }
    }
    if(best && skill > 0.78) o.ax = Math.max(-1, Math.min(1, (best.x - r.x) * 0.17));
    else o.ax = Math.max(-1, Math.min(1, -r.x * 0.02));
  }
  /* ollie en el labio */
  if(groundYAt(r.x, r.z) > 0.4 && groundYAt(r.x, r.z - 2.6) <= 0.05 && skill > 0.75) o.jump = true;
  o.turbo = gap > 35 && skill > 0.82;
  if(r.item && Math.random() < 0.02 * skill) o.item = true;   // la IA también gasta lo que recoge
  /* ataca / agarra si tiene a alguien al lado */
  for(const q of DESC.racers){
    if(q === r || q.done) continue;
    if(Math.abs(q.z - r.z) < K.grabRange && Math.abs(q.x - r.x) < K.grabRange){
      if(skill > 0.85 && Math.random() < 0.012) o.grab = true;
      else if(Math.random() < 0.006) o.atk = true;
      break;
    }
  }
  return o;
}

/* =====================================================================
   CAÍDAS Y CHOQUES
   ===================================================================== */
function crash(r){
  if(r.fall > 0 || r.crash > 0) return;
  r.crashes++;
  /* cadena: varios choques dentro de la ventana → al suelo. Encadenar errores
     es lo que te tira, no un error suelto. */
  r.crashN = (DESC.t - r.crashT < K.crashWindow) ? r.crashN + 1 : 1;
  r.crashT = DESC.t;
  if(r.crashN >= K.crashChain){ fall(r); return; }
  r.crash = K.crashTime;
  r.spd *= K.crashMul;
  r.vx *= 0.25;
  spray(r, 22, 3.2);
}
function fall(r){
  if(r.fall > 0) return;
  r.falls++;
  r.fall = K.fallTime;
  r.spd = 0;                 // ← el castigo: vuelves a empezar a acelerar
  r.vx = 0; r.vy = 0; r.air = false;
  r.trick = null; r.combo = 0; r.crashN = 0;
  r.meteor.visible = false; r.atk = 0;
  spray(r, 40, 4.2);
}
function spray(r, n, force){
  for(let i = 0; i < n; i++){
    emit(r.x + (Math.random()-0.5)*2.2, 0.3 + Math.random()*0.6, r.z + (Math.random()-0.5)*2.2,
         (Math.random()-0.5)*force*2.2, Math.random()*force*1.5, (Math.random()*0.4+0.5)*force,
         0.20 + Math.random()*0.34);
  }
}

/* =====================================================================
   SIMULACIÓN DE UN CORREDOR
   ===================================================================== */
function stepRacer(r, dt){
  if(r.done) return;
  /* `aiDrive` = lo pilota la IA pero SIGUE contando como humano para la cámara
     y la correa. Lo usan las sondas (para capturar con acción real sin perder
     el encuadre) y serviría para un modo demo/atracción. */
  const inp = (r.human && !r.aiDrive) ? readDesc(r) : aiInput(r, dt);

  /* --- CAÍDA: tumbado, sin control, velocidad a 0 --- */
  if(r.fall > 0){
    r.fall -= dt;
    r.body.rotation.set(-1.35, 0, Math.sin(DESC.t*7)*0.12);   // tumbado boca arriba
    r.spd += (K.spdStart - r.spd) * Math.min(1, 2.4 * dt) * (r.fall < 0.4 ? 1 : 0);
    r.z -= r.spd * dt;
    r.gfx.position.set(r.x, 0, r.z);
    r.shadow.position.set(r.x, 0.06, r.z);
    if(r.fall <= 0) r.body.rotation.set(0, 0, 0);
    return;
  }

  /* --- CHOQUE: control cortado un instante --- */
  if(r.crash > 0){
    r.crash -= dt;
    inp.ax = 0; inp.jump = false; inp.turbo = false; inp.trick = null;
    r.body.rotation.y += dt * 11;
    if(r.crash <= 0) r.body.rotation.y = 0;
  }

  /* --- AGARRADO: te frenan, y tienes UNA ventana para contraatacar --- */
  if(r.grabbed > 0){
    r.grabbed -= dt;
    if(inp.grab && r.grabbedBy && r.grabCd <= 0){
      fall(r.grabbedBy);                       // CONTRA: el que se va al suelo es él
      r.pts += K.counterPts;
      r.grabbed = 0; r.grabbedBy = null; r.grabCd = K.grabCd;
    }
  }

  /* --- TURBO / VELOCIDAD ACUMULATIVA ---
     La velocidad SUBE sola mientras aguantes en pie. El turbo es lo único que
     pasa del tope; al soltarlo se vuelve a él. */
  r.turbo = inp.turbo && r.dash > 0 && r.crash <= 0;
  if(r.turbo) r.dash = Math.max(0, r.dash - dt);
  else        r.dash = Math.min(K.dashMax, r.dash + dt * K.dashRegen);

  let tope = K.spdMax * (r._ai.targetMul || 1);
  if(r.slow > 0){ tope *= K.slowMul; r.slow -= dt; }
  if(r.grabbed > 0) tope *= K.grabSlow;

  if(r.turbo)               r.spd = Math.min(K.turboMax, r.spd + K.turboRamp * dt);
  else if(r.spd > tope)     r.spd = Math.max(tope, r.spd - K.turboDecay * dt);
  else                      r.spd = Math.min(tope, r.spd + K.spdRamp * dt);

  /* --- ATAQUE BÁSICO: dash-meteorito --- */
  r.atkCd = Math.max(0, r.atkCd - dt);
  if(inp.atk && r.atkCd <= 0 && r.crash <= 0 && r.atk <= 0){
    r.atk = K.atkTime; r.atkCd = K.atkCd;
    r.spd = Math.min(K.turboMax, r.spd + K.atkSpeed);
    r.meteor.visible = true;
  }
  if(r.atk > 0){
    r.atk -= dt;
    const k = Math.max(0, r.atk / K.atkTime);
    r.meteor.material.opacity = 0.20 + 0.55 * k;
    r.meteor.scale.setScalar(1 + (1 - k) * 0.8);
    /* estela de meteorito: partículas del color del jugador saliendo por detrás */
    if(Math.random() < 0.8) emit(r.x + (Math.random()-0.5)*1.6, 1 + Math.random()*1.6, r.z + 1.5,
                                 (Math.random()-0.5)*6, Math.random()*5, 14 + Math.random()*10, 0.3);
    /* embiste: a quien pille de lado lo aparta */
    for(const q of DESC.racers){
      if(q === r || q.done || q.fall > 0) continue;
      if(Math.abs(q.z - r.z) < 4.5 && Math.abs(q.x - r.x) < 4.5){
        q.vx += Math.sign(q.x - r.x || 1) * K.atkPush;
        crash(q); r.pts += K.atkPts;
      }
    }
    if(r.atk <= 0) r.meteor.visible = false;
  }

  /* --- USAR OBJETO --- */
  if(inp.item && r.item && !r._itemHeld && r.fall <= 0){
    ITEMS[r.item].use(r);
    r._lastTrick = ITEMS[r.item].name; r._lastTrickT = 1.0;
    r.item = null;
  }
  r._itemHeld = inp.item;

  /* --- AGARRAR / MOLESTAR --- */
  r.grabCd = Math.max(0, r.grabCd - dt);
  if(inp.grab && r.grabCd <= 0 && r.grabbed <= 0 && r.crash <= 0){
    r.grabCd = K.grabCd;
    for(const q of DESC.racers){
      if(q === r || q.done || q.fall > 0) continue;
      if(Math.abs(q.z - r.z) > K.grabRange || Math.abs(q.x - r.x) > K.grabRange) continue;
      q.grabbed = K.grabTime; q.grabbedBy = r;      // ← él tiene grabTime para el CONTRA
      r.pts += K.grabPts;
      break;
    }
  }

  /* --- avance --- */
  r.z -= r.spd * dt;

  /* --- lateral: aceleración + rozamiento = carve con inercia --- */
  const ctrl = r.air ? K.airCtrl : 1;
  r.vx += inp.ax * K.latAcc * ctrl * dt;
  r.vx *= Math.pow(K.latDamp, dt * 60);
  r.vx = Math.max(-K.latMax, Math.min(K.latMax, r.vx));
  r.x += r.vx * dt;

  /* --- paredes de roca: chocar contra la garganta ES un choque --- */
  const lim = HALF() - 1.8;
  if(Math.abs(r.x) > lim){
    r.x = Math.sign(r.x) * lim;
    r.vx *= -0.3;
    crash(r);
  }

  /* --- salto / aire / TRUCOS --- */
  const gy = groundYAt(r.x, r.z);
  if(!r.air){
    const prevY = r.y;
    r.y = gy;
    const climb = (r.y - prevY) / Math.max(1e-4, dt);
    r.vy = 0;
    if(inp.jump && !r._jumpHeld && r.crash <= 0){
      r.air = true; r.vy = K.jumpV + Math.max(0, climb) * 0.3;
    } else if(prevY > 0.25 && gy <= 0.02){
      /* labio de rampa: el tamaño manda. Aquí es donde cada rampa "significa"
         un truco distinto (ver la tabla de alturas en K). */
      const o = nearObst(r.z, 26).find(v => v.type === 'ramp' && Math.abs(v.x - r.x) < v.w/2 + 2);
      const base = o ? (K.rampVy[o.size] || K.rampVy.m) : K.rampVy.s;
      r.air = true;
      r.vy = base + r.spd * K.rampSpdK;
      spray(r, 10, 2.6);
    }
    /* estela al carvear: cuanto más rápido y más cerrado, más arena levantas */
    const carve = Math.abs(r.vx) / K.latMax;
    if(Math.random() < 0.25 + carve * 0.7 + (r.spd / K.spdMax) * 0.35){
      emit(r.x - Math.sign(r.vx) * 0.8, 0.25, r.z + 1.4,
           -r.vx * 0.35 + (Math.random()-0.5)*3, 1.5 + Math.random()*3.5 + carve*5,
           4 + Math.random()*5 + r.spd*0.06, 0.16 + Math.random()*0.22 + carve*0.2);
    }
  } else {
    r.vy -= K.grav * dt;
    r.y += r.vy * dt;

    /* arrancar truco: sólo si no hay otro en curso */
    if(inp.trick && !r.trick && TRICKS[inp.trick]){
      r.trick = inp.trick; r.trickT = 0;
    }
    if(r.trick){
      const T = TRICKS[r.trick];
      r.trickT += dt;
      const p = Math.min(1, r.trickT / T.dur);
      const ang = p * TAU * T.turns;
      r.body.rotation.set(0, 0, 0);
      r.body.rotation[T.axis] = ang;
      if(r.trickT >= T.dur){
        /* cerrado a tiempo: puntúa y deja encadenar si queda aire */
        const mul = K.comboMul[Math.min(K.comboMul.length - 1, r.combo)];
        r.pts += Math.round(T.pts * mul);
        r.tricks++; r.combo++;
        r.trick = null; r.trickT = 0;
        r.body.rotation.set(0, 0, 0);
        r._lastTrick = T.name + (mul > 1 ? ' ×' + mul : '');
        r._lastTrickT = 1.2;
      }
    }

    if(r.y <= gy){
      r.y = gy; r.air = false;
      if(r.trick){
        fall(r);                 // ← LA REGLA: la animación no cerró a tiempo
      } else {
        r.combo = 0;
        spray(r, 8, 2.2);
      }
    }
  }
  r._jumpHeld = inp.jump;

  /* --- obstáculos --- */
  if(r.crash <= 0 && r.fall <= 0){
    for(const o of nearObst(r.z, 16)){
      if(o.type === 'rock'){
        if(r.y > o.r * 1.05) continue;
        if(Math.abs(o.z - r.z) < o.r + 1.6 && Math.abs(o.x - r.x) < o.r + 1.2) crash(r);
      } else if(o.type === 'slow'){
        if(r.y > 0.8) continue;
        if(Math.abs(o.z - r.z) < o.len/2 && Math.abs(o.x - r.x) < o.w/2) r.slow = 0.25;
      } else if(o.type === 'pick' && !o.taken){
        if(Math.abs(o.z - r.z) < 3.2 && Math.abs(o.x - r.x) < 3.2 && r.y < 4.2){
          o.taken = true;
          if(o._m) o._m.visible = false;
          r.item = ITEM_KEYS[(Math.random() * ITEM_KEYS.length) | 0];
        }
      }
    }
    /* chocar CONTRA OTRO corredor también cuenta para la cadena */
    for(const q of DESC.racers){
      if(q === r || q.done || q.fall > 0) continue;
      if(Math.abs(q.z - r.z) < 2.6 && Math.abs(q.x - r.x) < 2.2 && Math.abs(q.y - r.y) < 2){
        const s = Math.sign(r.x - q.x || 1);
        r.vx += s * 10; q.vx -= s * 10;
        crash(r); crash(q);
      }
    }
  }

  /* --- meta --- */
  if(r.z <= -K.len && !r.done){
    r.done = true; r.time = DESC.t;
    DESC.finishOrder.push(r);
    r.place = DESC.finishOrder.length;
    r.pts += K.ptsPos[Math.min(K.ptsPos.length - 1, r.place - 1)];
  }

  /* --- gráficos --- */
  r.gfx.position.set(r.x, r.y, r.z);
  if(r.crash <= 0 && r.fall <= 0 && !r.trick){
    r.body.rotation.set(r.air ? -0.14 : 0.06, 0, -(r.vx / K.latMax) * 0.6);
  }
  const gy2 = groundYAt(r.x, r.z);
  r.shadow.position.set(r.x, gy2 + 0.07, r.z);
  const h = Math.max(0, r.y - gy2);
  r.shadow.material.opacity = 0.32 / (1 + h * 0.11);
  r.shadow.scale.setScalar(1 / (1 + h * 0.045));
  if(r._lastTrickT > 0) r._lastTrickT -= dt;
}

/* CORREA: sólo entre HUMANOS, porque su única razón de ser es que la cámara
   compartida siga siendo jugable. Atando también a la IA la carrera salía
   decorativa (medido: los 4 llegaban en 0,2 s). */
function leash(){
  const hum = DESC.racers.filter(r => r.human && !r.done);
  if(hum.length < 2) return;
  let anchor = 0; for(const r of hum) anchor += r.z; anchor /= hum.length;
  for(const r of hum){
    if(r.z > anchor + K.leash){ r.z = anchor + K.leash; r.spd = Math.max(r.spd, K.spdMax * 0.7); }
    if(r.z < anchor - K.leash) r.z = anchor - K.leash;
  }
}

/* =====================================================================
   CÁMARA
   ===================================================================== */
const _camPos = new THREE.Vector3(), _camLook = new THREE.Vector3();
let _camInit = false, _shake = 0;
function stepCamera(dt){
  let hum = DESC.racers.filter(r => r.human);
  if(!hum.length) hum = DESC.racers;      // respaldo: sin esto el promedio es 0/0 = NaN
  let ax = 0, az = 0, fast = 0;
  for(const r of hum){ ax += r.x; az += r.z; fast = Math.max(fast, r.spd); }
  ax /= hum.length; az /= hum.length;

  /* La cámara se coloca EN EL MARCO DE LA LADERA (coordenadas locales, las
     mismas de la física) y luego se pasa a mundo. Consecuencia importante: el
     ENCUADRE DE JUEGO no cambia por mucho que subas K.tilt — lo único que
     mueve la inclinación es dónde queda el cielo y el valle del fondo, que es
     justo la señal de que bajas.

     Calculándolo en mundo (como estaba) pasaba lo contrario: subir tilt a 24º
     dejaba la vista casi paralela a la ladera, rozando la arena, y los
     corredores desaparecían de cuadro. */
  _camLook.set(ax * K.camXFollow, K.camLookY, az - K.camLookAhead);
  const p = K.camPitch * Math.PI / 180;
  _camPos.set(_camLook.x, _camLook.y + Math.sin(p) * K.camDist, _camLook.z + Math.cos(p) * K.camDist);
  if(DESC.world){
    DESC.world.updateMatrixWorld();
    DESC.world.localToWorld(_camLook);
    DESC.world.localToWorld(_camPos);
  }

  if(!_camInit){ DESC.cam.position.copy(_camPos); _camInit = true; }
  else DESC.cam.position.lerp(_camPos, Math.min(1, K.camLag * dt));

  /* TEMBLOR con la velocidad: parte de la dopamina */
  const k = Math.max(0, Math.min(1, (fast - K.spdMax * 0.45) / (K.spdMax * 0.8)));
  _shake = k * K.shakeSpeed;
  DESC.cam.position.x += (Math.random() - 0.5) * _shake;
  DESC.cam.position.y += (Math.random() - 0.5) * _shake;
  DESC.cam.lookAt(_camLook);

  if(DESC.backdrop) DESC.backdrop.position.copy(DESC.cam.position);

  /* FOV que se abre con la velocidad: el truco más barato y más eficaz para
     que 64 u/s se sientan como 200 */
  const want = K.fovBase + K.fovSpeed * k * k;
  DESC.cam.fov += (want - DESC.cam.fov) * Math.min(1, 5 * dt);
  DESC.cam.updateProjectionMatrix();
  DESC._spdK = k;
}

/* =====================================================================
   HUD + EFECTO DE VELOCIDAD (líneas y viñeta en DOM: coste ~0 y se ve)
   ===================================================================== */
function buildHud(){
  const d = document.createElement('div');
  d.id = 'descHud';
  d.style.cssText = 'position:fixed;inset:0;z-index:120;pointer-events:none;' +
    'font:13px/1.45 ui-monospace,Consolas,monospace;color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.75)';
  d.innerHTML =
    /* viñeta + líneas de velocidad: se encienden con DESC._spdK */
    '<div id="dVig" style="position:absolute;inset:0;opacity:0;' +
      'background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 38%,rgba(0,0,0,.55) 100%)"></div>' +
    '<div id="dLin" style="position:absolute;inset:0;opacity:0;background:' +
      'repeating-conic-gradient(from 0deg at 50% 55%,rgba(255,255,255,.5) 0deg 0.35deg,rgba(255,255,255,0) 0.35deg 7deg);' +
      '-webkit-mask:radial-gradient(ellipse at 50% 55%,transparent 30%,#000 78%);' +
      'mask:radial-gradient(ellipse at 50% 55%,transparent 30%,#000 78%)"></div>' +
    '<div id="dTop" style="position:absolute;top:14px;left:50%;transform:translateX(-50%);text-align:center;font-size:15px;font-weight:700"></div>' +
    '<div id="dLeft" style="position:absolute;top:14px;left:16px;background:rgba(6,10,20,.5);padding:9px 13px;border-radius:9px"></div>' +
    '<div id="dRight" style="position:absolute;top:14px;right:16px;background:rgba(6,10,20,.5);padding:9px 13px;border-radius:9px;text-align:right"></div>' +
    '<div id="dTrick" style="position:absolute;top:31%;left:50%;transform:translate(-50%,-50%);font-size:34px;font-weight:900;opacity:0;color:#ffe14d"></div>' +
    '<div id="dBig" style="position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);font-size:84px;font-weight:900;letter-spacing:-2px"></div>' +
    '<div id="dBar" style="position:absolute;left:50%;bottom:22px;transform:translateX(-50%);width:min(620px,72vw);height:9px;background:rgba(0,0,0,.42);border-radius:6px;overflow:hidden">' +
      '<div id="dFill" style="height:100%;width:0;background:#fff;border-radius:6px"></div></div>' +
    '<div id="dHelp" style="position:absolute;left:16px;bottom:14px;opacity:.55;font-size:11px;line-height:1.5">' +
      'A/D carvear · ESPACIO saltar · SHIFT turbo · J meteorito · L agarrar/contra · U objeto<br>' +
      'TRUCOS en el aire: 1 Indy · 2 mortal atrás · 3 mortal adelante · 4 360 · 5 DOBLE mortal · 6 Superman<br>' +
      'R reiniciar · T semilla nueva · afinado en vivo: <b>DESC.K</b></div>';
  document.body.appendChild(d);
  DESC.hud = { root:d, top:d.querySelector('#dTop'), left:d.querySelector('#dLeft'),
    right:d.querySelector('#dRight'), big:d.querySelector('#dBig'), fill:d.querySelector('#dFill'),
    vig:d.querySelector('#dVig'), lin:d.querySelector('#dLin'), trick:d.querySelector('#dTrick') };
}

function updateHud(){
  const h = DESC.hud; if(!h) return;
  const me = DESC.racers[0];
  const order = DESC.racers.slice().sort((a, b) => a.z - b.z);
  const place = order.indexOf(me) + 1;
  const k = DESC._spdK || 0;

  h.vig.style.opacity = (k * 0.85).toFixed(2);
  h.lin.style.opacity = (Math.max(0, k - 0.25) * 0.9).toFixed(2);

  const turboBars = Math.ceil(me.dash / K.dashMax * 6);
  h.left.innerHTML =
    '<div style="font-size:26px;font-weight:900;line-height:1">' + place + 'º</div>' +
    '<div style="font-size:18px;font-weight:800;color:' + (me.spd > K.spdMax ? '#ffd23f' : '#fff') + '">' +
      Math.round(me.spd * 2.6) + ' km/h</div>' +
    '<div style="opacity:.8">turbo ' + '▮'.repeat(turboBars) + '▯'.repeat(6 - turboBars) + '</div>' +
    (me.atkCd > 0 ? '<div style="opacity:.55">meteorito ' + me.atkCd.toFixed(1) + 's</div>'
                  : '<div style="color:#7bf06a">meteorito LISTO</div>') +
    (me.item ? '<div style="margin-top:4px;font-weight:800;color:#' +
        ITEMS[me.item].col.toString(16).padStart(6,'0') + '">◆ ' + ITEMS[me.item].name + ' (U)</div>'
             : '<div style="opacity:.4;margin-top:4px">sin objeto</div>');

  h.right.innerHTML =
    '<div style="font-size:20px;font-weight:800">' + me.pts + ' pts</div>' +
    '<div style="opacity:.8">' + me.tricks + ' trucos · ' + me.falls + ' caídas</div>' +
    '<div style="opacity:.8">' + DESC.t.toFixed(1) + ' s</div>';

  h.top.innerHTML = order.map(r =>
    '<span style="color:#' + r.col.toString(16).padStart(6,'0') + ';margin:0 7px">' + r.name + '</span>').join('');

  h.trick.style.opacity = (me._lastTrickT > 0) ? Math.min(1, me._lastTrickT) : 0;
  if(me._lastTrickT > 0) h.trick.textContent = me._lastTrick || '';

  h.fill.style.width = Math.min(100, (-me.z / K.len) * 100) + '%';

  if(DESC.phase === 'countdown'){
    const n = Math.ceil(DESC.count);
    h.big.style.fontSize = '84px';
    h.big.textContent = n > 0 ? n : '¡YA!';
    h.big.style.opacity = 1;
  } else if(DESC.phase === 'finish'){
    h.big.style.fontSize = '34px';
    h.big.innerHTML = 'META<br>' + DESC.finishOrder.map((r, i) =>
      '<div style="font-size:17px;margin-top:6px;color:#' + r.col.toString(16).padStart(6,'0') + '">' +
      (i+1) + 'º ' + r.name + ' — ' + r.time.toFixed(1) + 's · ' + r.pts + ' pts · ' +
      r.tricks + ' trucos · ' + r.falls + ' caídas</div>').join('') +
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
  if(DESC.scene){
    DESC.scene.traverse(o => {
      if(o.geometry) o.geometry.dispose();
      if(o.material){ const mm = Array.isArray(o.material) ? o.material : [o.material];
        mm.forEach(x => { if(x.map) x.map.dispose(); x.dispose(); }); }
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
  console.log('[descenso] semilla=' + seed + ' · ' + DESC.obst.length + ' obstáculos · piel=' + SKIN);
}
DESC._start = start;

/* =====================================================================
   TICK
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
    if(DESC.finishOrder.length && DESC.t - DESC.finishOrder[0].time > 10){
      for(const r of DESC.racers) if(!r.done){
        r.done = true; r.time = DESC.t; DESC.finishOrder.push(r);
        r.place = DESC.finishOrder.length;
        r.pts += K.ptsPos[Math.min(K.ptsPos.length - 1, r.place - 1)];
      }
      DESC.phase = 'finish';
    }
  }

  /* las recogidas giran (que se vean como "cógeme", no como decorado) */
  if(DESC.picks) for(const o of DESC.picks){
    if(o._m && o._m.visible){ o._m.rotation.y += dt * 2.4; o._m.rotation.x += dt * 1.1; }
  }

  updateParts(dt);
  stepCamera(dt);
  updateHud();
};

DESC.render = function(){
  if(!DESC.scene) return;
  const rr = GAME_RENDERER(); if(!rr) return;
  rr.setRenderTarget(null);
  rr.render(DESC.scene, DESC.cam);
};

/* =====================================================================
   ENTRADA
   ===================================================================== */
addEventListener('keydown', e => {
  if(!DESC.on) return;
  if(e.code === 'KeyR'){ start(DESC.seed); e.preventDefault(); }
  if(e.code === 'KeyT'){ start((Math.random()*1e9)|0); e.preventDefault(); }
});
addEventListener('resize', () => {
  if(DESC.cam){ DESC.cam.aspect = innerWidth / innerHeight; DESC.cam.updateProjectionMatrix(); }
});

function boot(){
  if(DESC._built) return;
  if(typeof THREE === 'undefined' || !GAME_RENDERER()) return;
  DESC._built = true;
  buildHud();
  start(parseInt(_qs.get('semilla') || '', 10) || ((Math.random()*1e9)|0));
  DESC.on = true;
  let n = 0;
  const t = setInterval(() => {
    for(const id of ['startOverlay','hud','shopOverlay','scoreOverlay']){
      const el = document.getElementById(id); if(el) el.style.display = 'none';
    }
    if(++n > 120) clearInterval(t);
  }, 250);
}
const _bootT = setInterval(() => { boot(); if(DESC._built) clearInterval(_bootT); }, 60);
boot();

})();
