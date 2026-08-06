/* =====================================================================
   ►DESCENSO — carrera de transición entre stages  ·  v3

   Minijuego de sandboard / snowboard / surf que se juega ENTRE dos mundos.
   Un solo sistema con tres pieles.

   ---------------------------------------------------------------------
   ENTRADA
        rumble_arena_cinta_v4.html?descenso
        ...&humanos=2      ...&semilla=1234      ...&piel=nieve|mar
   Sin ?descenso, este fichero sale en su primera línea.

   ---------------------------------------------------------------------
   CONTROLES
     Stick ←/→ · A/D ....... carvear (y CARVEAR FRENA, como en la realidad)
     A         · Espacio ... saltar
     RT        · Shift ..... turbo
     X         · J ......... ATAQUE: dash-meteorito con tu color (cooldown)
     LT        · L ......... AGARRAR — y el MISMO botón es el CONTRA
     RB        · U ......... usar objeto

     TRUCOS (en el aire, duración FIJA — si aterrizas a medias, te caes):
     B  · 1 .. Indy 0,40 s · 40    |  Y  · 2 .. Mortal atrás 0,80 s · 130
     ↓  · 6 .. Superman 0,50 s · 60|  LB · 3 .. Mortal adelante 0,80 s · 130
     ←→ · 4 .. 360 0,65 s · 90     |  ↑  · 5 .. DOBLE mortal 1,35 s · 320

     R reiniciar · T semilla nueva · afinado en vivo: DESC.K

   =====================================================================
   EL CAMBIO GORDO DE LA v3: LA PENDIENTE YA NO ES MENTIRA

   La v1 y la v2 fingían la bajada inclinando el mundo visualmente sobre un
   suelo plano. Dos problemas, los dos reportados por Toni: no se leía como
   una bajada, y el suelo era una tabla lisa sin física.

   Ahora el terreno es un MAPA DE ALTURAS de verdad que desciende K.slope
   grados y lleva ruido encima. De ahí sale, gratis y sin inventar nada:

     · SE VE que bajas: el terreno cae y el paisaje del fondo queda por debajo.
     · FÍSICA REAL: te acelera la componente de la gravedad en la pendiente,
       te frena el rozamiento del material y te frena CARVEAR. La velocidad
       máxima ya no es un número: es la velocidad terminal que sale de esa
       ecuación. El turbo mete empuje extra y por eso la supera.
     · TERRENO IRREGULAR: una hondonada te acelera y un lomo te frena, porque
       la pendiente LOCAL es la que manda, no una constante.
     · DUREZA DEL MATERIAL: hay zonas prensadas (rápidas) y zonas de nieve/
       arena suelta (lentas). Se VEN — pintadas en el color del vértice —
       porque un modificador de velocidad invisible es una tomadura de pelo.
     · La tabla se HUNDE según lo blando que esté el suelo y deja RASTRO.

   K.tilt (la inclinación falsa) sigue existiendo pero vale 0: se queda para
   el surf, donde no hay pendiente y hay que fingir algo de inclinación.
   ===================================================================== */
(function(){
'use strict';

const Q = location.search;
if(!/[?&]descenso(=|&|$)/.test(Q)) return;

const _qs    = new URLSearchParams(Q);
const HUMANS = Math.max(1, Math.min(4, parseInt(_qs.get('humanos')||'1', 10) || 1));
const SKIN   = (_qs.get('piel') || 'arena').toLowerCase();
const TAU    = Math.PI * 2;

function mulberry32(a){
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Ruido de valor con semilla (Perlin simplificado). Determinista: dos clientes
   con la misma semilla ven EXACTAMENTE el mismo terreno, que es lo que hará
   falta el día del online. */
function makeNoise(seed){
  const rng = mulberry32(seed);
  const perm = new Uint8Array(512);
  const p = []; for(let i = 0; i < 256; i++) p.push(i);
  for(let i = 255; i > 0; i--){ const j = (rng() * (i + 1)) | 0; const t = p[i]; p[i] = p[j]; p[j] = t; }
  for(let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + (b - a) * t;
  const grad = (h, x, y) => ((h & 1) ? x : -x) + ((h & 2) ? y : -y);
  return function(x, y){
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y);
    const A = perm[X] + Y, B = perm[X + 1] + Y;
    return lerp(lerp(grad(perm[A], x, y),       grad(perm[B], x - 1, y), u),
                lerp(grad(perm[A + 1], x, y-1), grad(perm[B + 1], x-1, y-1), u), v) * 1.75;
  };
}

/* =====================================================================
   K
   ===================================================================== */
const K = {
  /* --- pista --- */
  len:        2600,
  width:      46,
  rowEvery:   30,
  clearStart: 130,
  clearEnd:   90,

  /* --- TERRENO --- */
  slope:      15,     // GRADOS de bajada REAL del terreno
  bumpBig:    4.2,    // amplitud REAL en unidades de los lomos (whoops)
  bumpSmall:  0.55,   // rizado fino (amplitud real)
  bumpFreqB:  0.010,
  bumpFreqS:  0.075,
  hardFreq:   0.016,  // frecuencia del mapa de DUREZA del material

  /* --- FÍSICA (snowboard: gravedad − rozamiento − carve) ---
     La velocidad máxima NO es un número que yo elija: es la terminal que sale
     de gravedad-en-pendiente contra rozamiento. Por eso una hondonada te
     acelera de verdad y una zona blanda te hunde. */
  grav:       52,
  dragC:      0.0031, // coef. de rozamiento (∝ v²). Terminal ≈ 64 a 15º en suelo medio
  dragSoft:   1.9,    // multiplicador de rozamiento en el material MÁS blando
  dragHard:   0.62,   // ...y en el más prensado
  carveBrake: 11,     // u/s² que te quita carvear a tope ← "si giras frenas"
  turboThrust:12,     // empuje extra del turbo (supera la terminal)
  dashMax:    2.4,
  dashRegen:  0.34,

  /* --- HUNDIMIENTO Y RASTRO --- */
  sinkMax:    0.42,   // cuánto se hunde la tabla en lo más blando
  trailEvery: 1.9,    // una marca de rastro cada X unidades recorridas
  trailLife:  7.0,    // segundos que tarda en borrarse
  trailN:     760,    // tamaño del pool

  /* --- CHOQUES Y CAÍDAS --- */
  crashMul:   0.5,
  crashTime:  0.55,
  crashChain: 3,
  crashWindow:3.0,
  fallTime:   1.35,

  /* --- lateral --- */
  latAcc:     84,
  latMax:     25,
  latDamp:    0.90,
  airCtrl:    0.40,

  /* --- salto / rampas --- */
  jumpV:      15,
  rampVy:     { s:16, m:22, l:37 },
  rampSpdK:   0.05,

  /* --- ataque / agarre --- */
  atkSpeed:   30, atkTime:0.55, atkCd:4.2, atkPush:30, atkPts:45,
  grabRange:  7.0, grabTime:0.5, grabSlow:0.55, grabCd:1.2, grabPts:60, counterPts:120,

  ptsPos:     [300, 200, 120, 60],
  comboMul:   [1, 1.5, 2, 2.5],

  /* --- cámara --- */
  tilt:       0,      // inclinación FALSA. 0 porque ya hay pendiente real; se
                      // queda para el surf, donde el mar es plano.
  camPitch:   26,     // picado SOBRE la pendiente local (se suma a ella)
  camDist:    34,
  camDistFast:-7,     // cuánto SE ACERCA la cámara a tope de velocidad (túnel)
  camLookAhead: 17,
  camLookY:   2.4,
  camLag:     8.0,
  camXFollow: 0.55,
  fovBase:    56,
  fovSpeed:   28,
  shakeSpeed: 0.55,
  leash:      70,

  /* --- efecto de velocidad --- */
  streakN:    340,    // estelas EN EL MUNDO (las rayas en DOM eran cutres)
  streakFrom: 0.25,   // a partir de qué fracción de velocidad empiezan

  /* --- IA --- */
  aiBand: 0.14, aiMaxGap: 170, aiLook: 50, aiSkill: [0.93, 0.87, 0.81],
};

const TRICKS = {
  indy:   { name:'Indy',              dur:0.40, pts:40,  axis:'z', turns:0.18 },
  super:  { name:'Superman',          dur:0.50, pts:60,  axis:'x', turns:0.15 },
  spin:   { name:'360',               dur:0.65, pts:90,  axis:'y', turns:1 },
  flipB:  { name:'Mortal atrás',      dur:0.80, pts:130, axis:'x', turns:-1 },
  flipF:  { name:'Mortal adelante',   dur:0.80, pts:130, axis:'x', turns:1 },
  flipB2: { name:'DOBLE mortal atrás',dur:1.35, pts:320, axis:'x', turns:-2 },
};

/* PIELES. `soft`/`hard` son los dos colores entre los que se interpola el
   terreno según la dureza → el jugador VE dónde corre y dónde se hunde. */
const SKINS = {
  arena: { sky:0xf3d6a4, sky2:0xbfd8ea, fog:0xe8c187,
           soft:0xf0d3a0, hard:0xb07f42, wall:0xb8834f, wall2:0x8a6039,
           rock:0x8a6f4d, ramp:0xa8672c, part:0xf3e0bb, trail:0xb08a55,
           valley:0xd8ae72, ridge:0xc09a68, sun:0xfff0d0, hemi:0xffe4bc },
  nieve: { sky:0xe8f4ff, sky2:0x9dc4e8, fog:0xd6e7f4,
           soft:0xffffff, hard:0x9fbdd8, wall:0x93a9bb, wall2:0x6f8496,
           rock:0x6d7f8e, ramp:0x7fa8cc, part:0xffffff, trail:0x9fb8cc,
           valley:0xc6dced, ridge:0xa4bcd2, sun:0xffffff, hemi:0xdcecff },
  mar:   { sky:0xa8e8f5, sky2:0x4fb0d8, fog:0x76cde2,
           soft:0x4fc4e0, hard:0x14647f, wall:0x4a6b78, wall2:0x37525d,
           rock:0x40606d, ramp:0xcdf6ff, part:0xeafcff, trail:0x8fe0f0,
           valley:0x2f9fc4, ridge:0x4a8fa8, sun:0xfffbe8, hemi:0xbfeef8 },
};
const PAL = SKINS[SKIN] || SKINS.arena;
if(SKIN === 'mar') K.tilt = 7;        // el mar es plano: aquí SÍ hace falta fingir

const RACER_COL = [0x35c9ff, 0xff5a52, 0x7bf06a, 0xffd23f];

function GAME_RENDERER(){ return (typeof renderer !== 'undefined') ? renderer : null; }
function GAME_KEYS(){ return (typeof keys !== 'undefined') ? keys : null; }

const DESC = window.DESC = {
  on:false, K, TRICKS,
  scene:null, cam:null, world:null, backdrop:null,
  seed:0, rng:null, noise:null, noiseH:null,
  racers:[], obst:[], buckets:null, picks:null,
  t:0, phase:'countdown', count:3.2,
  finishOrder:[], hud:null, _built:false,
};

const HALF = () => K.width / 2;
const BUCKET = 60;

/* =====================================================================
   TERRENO
   ===================================================================== */
const _slopeK = () => Math.tan(K.slope * Math.PI / 180);

/* altura del TERRENO (sin rampas). Baja de verdad + lomos + rizado. */
function terrainY(x, z){
  const n  = DESC.noise; if(!n) return 0;
  const base = z * _slopeK();                                   // z<0 ⇒ baja
  const big  = n(x * K.bumpFreqB, z * K.bumpFreqB) * K.bumpBig;
  const sml  = n(x * K.bumpFreqS, z * K.bumpFreqS) * K.bumpSmall;
  return base + big + sml;
}
/* DUREZA 0..1 del material: 0 = suelto y profundo (frena, te hundes),
   1 = prensado (corre). Se pinta en el terreno para que se pueda leer. */
function hardnessAt(x, z){
  const n = DESC.noiseH; if(!n) return 0.5;
  return Math.max(0, Math.min(1, 0.5 + n(x * K.hardFreq, z * K.hardFreq) * 0.9));
}
DESC._ty = terrainY;
DESC._hard = hardnessAt;

/* =====================================================================
   PISTA
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
        obst.push({ type:'rock', x:laneX(l) + (rng()-0.5)*3, z, r:2.4 + rng()*1.5 });
      }
    }
    if(rng() < 0.34) obst.push({ type:'pick', x:laneX(free), z: z - K.rowEvery*0.4, taken:false });
    z -= K.rowEvery * (0.8 + rng() * 0.5);
  }
  return obst;
}

const ITEMS = {
  turbo: { name:'TURBO', col:0x7bf06a, use(r){ r.dash = K.dashMax; r.spd += 22; } },
  rayo:  { name:'RAYO',  col:0xffd23f, use(r){
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

/* rampa bajo un punto (o null). La superficie de la rampa arranca en el
   TERRENO de su base, no en 0 — si no, con terreno irregular las rampas
   quedarían enterradas o flotando. */
function rampAt(x, z){
  for(const o of nearObst(z, 26)){
    if(o.type !== 'ramp') continue;
    if(Math.abs(x - o.x) > o.w / 2) continue;
    const z0 = o.z + o.len / 2, z1 = o.z - o.len / 2;
    if(z > z0 || z < z1) continue;
    return o;
  }
  return null;
}
function rampSurfaceY(o, z){
  return terrainY(o.x, o.z) + ((o.z + o.len/2 - z) / o.len) * o.h;
}
/* altura pisable: terreno, o la rampa si estás sobre una */
function groundYAt(x, z){
  const t = terrainY(x, z);
  const o = rampAt(x, z);
  return o ? Math.max(t, rampSurfaceY(o, z)) : t;
}
DESC._gy = groundYAt;

/* pendiente LOCAL en el sentido de la marcha (rad). >0 = cuesta abajo.
   Es lo que hace que una hondonada acelere y un lomo frene. */
function slopeAt(x, z){
  const a = groundYAt(x, z), b = groundYAt(x, z - 3);
  return Math.atan2(a - b, 3);
}

/* =====================================================================
   ESCENA
   ===================================================================== */
function buildScene(){
  const sc = new THREE.Scene();
  sc.fog = new THREE.Fog(PAL.fog, 170, 620);

  sc.add(new THREE.HemisphereLight(PAL.hemi, 0x40404e, 0.9));
  const sun = new THREE.DirectionalLight(PAL.sun, 1.25);
  sun.position.set(-50, 90, 30);
  sc.add(sun);

  /* CIELO con degradado (un color plano se veía a plástico) */
  {
    const g = new THREE.SphereGeometry(2600, 20, 14);
    const col = [], pos = g.attributes.position;
    const cTop = new THREE.Color(PAL.sky2), cBot = new THREE.Color(PAL.sky);
    const c = new THREE.Color();
    for(let i = 0; i < pos.count; i++){
      const t = Math.max(0, Math.min(1, (pos.getY(i) / 2600) * 1.6 + 0.35));
      c.copy(cBot).lerp(cTop, t);
      col.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    const sky = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors:true, side:THREE.BackSide, fog:false }));
    sc.add(sky);
    DESC.sky = sky;
  }

  const world = new THREE.Group();
  world.rotation.x = -K.tilt * Math.PI / 180;
  sc.add(world);
  DESC.world = world;

  const rng = mulberry32(DESC.seed ^ 0x5a17);

  /* --- TERRENO: malla con relieve real y color por dureza --- */
  {
    const WSEG = 34, LSEG = 620;
    const L = K.len + 420;
    const geo = new THREE.PlaneGeometry(K.width + 26, L, WSEG, LSEG);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const col = [];
    const cSoft = new THREE.Color(PAL.soft), cHard = new THREE.Color(PAL.hard);
    const c = new THREE.Color();
    const z0 = 140;                       // la malla arranca por detrás de la salida
    for(let i = 0; i < pos.count; i++){
      const x  = pos.getX(i);
      const zz = pos.getZ(i) - (L / 2) + z0;   // z de MUNDO del vértice (la malla
                                               // se centra luego en position.z)
      pos.setY(i, terrainY(x, zz));
      const h = hardnessAt(x, zz);
      c.copy(cSoft).lerp(cHard, h);
      /* sombreado extra en los valles: da lectura de relieve sin normal map */
      const shade = 0.90 + 0.10 * h;
      col.push(c.r * shade, c.g * shade, c.b * shade);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.computeVertexNormals();           // ← lo que hace que deje de parecer papel pintado
    const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors:true }));
    mesh.position.z = -L / 2 + z0;
    world.add(mesh);
    DESC.terrain = mesh;
  }

  /* --- PAREDES DE ROCA: la garganta --- */
  {
    const perSide = Math.floor((K.len + 400) / 9);
    const n1 = perSide * 2;
    const im = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading:true }), n1);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(),
          p = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color();
    const base = new THREE.Color(PAL.wall);
    let i = 0;
    for(let k = 0; k < perSide; k++){
      const z = 120 - k * 9;
      for(const side of [-1, 1]){
        const r  = 2.8 + rng() * 3.8;
        const dx = HALF() + r * 0.5 + rng() * 2.0;
        const x  = side * dx;
        p.set(x, terrainY(x, z) + r * 0.2 + rng() * 1.2, z + (rng() - 0.5) * 6);
        q.setFromEuler(new THREE.Euler(rng()*3, rng()*3, rng()*3));
        s.set(r, r * (0.75 + rng() * 0.5), r);
        m.compose(p, q, s);
        im.setMatrixAt(i, m);
        /* variación de color por instancia: sin esto las rocas son una mancha
           uniforme. En r128 instanceColor NACE con el tamaño de this.count →
           por eso el count se fija en el constructor y no se toca después. */
        c.copy(base).offsetHSL((rng()-0.5)*0.03, (rng()-0.5)*0.12, (rng()-0.5)*0.16);
        im.setColorAt(i, c);
        i++;
      }
    }
    im.instanceMatrix.needsUpdate = true;
    if(im.instanceColor) im.instanceColor.needsUpdate = true;
    world.add(im);

    const nb = Math.floor((K.len + 400) / 16) * 2;
    const im2 = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading:true }), nb);
    const base2 = new THREE.Color(PAL.wall2);
    let j = 0;
    for(let k = 0; k < nb / 2; k++){
      const z = 120 - k * 16;
      for(const side of [-1, 1]){
        const r = 9 + rng() * 10;
        const x = side * (HALF() + 16 + rng() * 12);
        p.set(x, terrainY(x, z) + r * 0.15, z + (rng() - 0.5) * 10);
        q.setFromEuler(new THREE.Euler(rng()*3, rng()*3, rng()*3));
        s.set(r, r * (0.9 + rng() * 0.7), r);
        m.compose(p, q, s);
        im2.setMatrixAt(j, m);
        c.copy(base2).offsetHSL((rng()-0.5)*0.03, (rng()-0.5)*0.10, (rng()-0.5)*0.14);
        im2.setColorAt(j, c);
        j++;
      }
    }
    im2.instanceMatrix.needsUpdate = true;
    if(im2.instanceColor) im2.instanceColor.needsUpdate = true;
    world.add(im2);
  }

  /* --- OBSTÁCULOS --- */
  const rocks = DESC.obst.filter(o => o.type === 'rock');
  const ramps = DESC.obst.filter(o => o.type === 'ramp');
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(),
        p = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color();

  if(rocks.length){
    const im = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading:true }), rocks.length);
    const base = new THREE.Color(PAL.rock);
    rocks.forEach((o, i) => {
      o.baseY = terrainY(o.x, o.z);                 // apoyada en el terreno, no en 0
      p.set(o.x, o.baseY + o.r * 0.45, o.z);
      q.setFromEuler(new THREE.Euler(o.r, o.x, o.z));
      s.set(o.r, o.r * 0.85, o.r);
      m.compose(p, q, s); im.setMatrixAt(i, m);
      c.copy(base).offsetHSL((rng()-0.5)*0.03, (rng()-0.5)*0.10, (rng()-0.5)*0.14);
      im.setColorAt(i, c);
    });
    im.instanceMatrix.needsUpdate = true;
    if(im.instanceColor) im.instanceColor.needsUpdate = true;
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
      o.baseY = terrainY(o.x, o.z);
      p.set(o.x, o.baseY, o.z); q.identity(); s.set(o.w, o.h, o.len);
      m.compose(p, q, s); im.setMatrixAt(i, m);
    });
    im.instanceMatrix.needsUpdate = true;
    world.add(im);

    /* LABIO oscuro + jalones: la cara de la rampa mira hacia arriba y la luz
       se la come, así que lo legible a distancia es el CANTO, no el relleno. */
    const lip = new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),
      new THREE.MeshLambertMaterial({ color:0x33302c }), ramps.length);
    ramps.forEach((o, i) => {
      p.set(o.x, o.baseY + o.h, o.z - o.len/2 + 0.5); q.identity(); s.set(o.w*1.03, 0.55, 1.1);
      m.compose(p, q, s); lip.setMatrixAt(i, m);
    });
    lip.instanceMatrix.needsUpdate = true; world.add(lip);

    const post = new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),
      new THREE.MeshLambertMaterial({ color:0xff8a3d }), ramps.length*2);
    let pi = 0;
    ramps.forEach(o => { for(const side of [-1,1]){
      p.set(o.x + side*o.w/2, o.baseY + o.h + 1.6, o.z - o.len/2 + 0.5);
      q.identity(); s.set(0.5, 3.2, 0.5);
      m.compose(p, q, s); post.setMatrixAt(pi++, m);
    }});
    post.instanceMatrix.needsUpdate = true; world.add(post);
  }

  /* --- RECOGIDAS --- */
  {
    const picks = DESC.obst.filter(o => o.type === 'pick');
    const geo = new THREE.OctahedronGeometry(1.25, 0);
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x776633 });
    for(const o of picks){
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(o.x, terrainY(o.x, o.z) + 2.4, o.z);
      o._m = mesh; world.add(mesh);
    }
    DESC.picks = picks;
  }

  /* --- META --- */
  {
    const g = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    for(const side of [-1, 1]){
      const cc = new THREE.Mesh(new THREE.BoxGeometry(2.6, 18, 2.6), mat);
      cc.position.set(side * (HALF() - 1), 9, 0); g.add(cc);
    }
    const top = new THREE.Mesh(new THREE.BoxGeometry(K.width, 3.4, 2.6), mat);
    top.position.y = 16.3; g.add(top);
    g.position.set(0, terrainY(0, -K.len), -K.len);
    world.add(g);
  }

  /* --- PAISAJE SÓLO AL FONDO --- */
  {
    const bd = new THREE.Group();
    const valley = new THREE.Mesh(new THREE.PlaneGeometry(8000, 3000),
      new THREE.MeshBasicMaterial({ color: PAL.valley, depthWrite:false, fog:false }));
    valley.position.set(0, -900, -1700);
    bd.add(valley);
    const capas = [
      { z:-1650, y:-760, s:0.8, col:PAL.ridge, n:15 },
      { z:-1500, y:-680, s:0.55, col:PAL.wall2, n:12 },
    ];
    for(const cc of capas){
      const im = new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,4),
        new THREE.MeshBasicMaterial({ color:cc.col, depthWrite:false, fog:false }), cc.n);
      for(let i = 0; i < cc.n; i++){
        const f = i / (cc.n - 1) - 0.5;
        const w = 320 + ((i*37) % 160), h = (220 + ((i*53) % 260)) * cc.s;
        p.set(f*4200 + ((i*71)%110), cc.y + h/2, cc.z);
        q.setFromEuler(new THREE.Euler(0, (i*0.7)%1.5, 0)); s.set(w, h, w);
        m.compose(p, q, s); im.setMatrixAt(i, m);
      }
      im.instanceMatrix.needsUpdate = true; bd.add(im);
    }
    sc.add(bd);
    DESC.backdrop = bd;
  }

  /* --- PARTÍCULAS (arena/nieve levantada) --- */
  {
    const N = 460;
    const im = new THREE.InstancedMesh(new THREE.TetrahedronGeometry(1,0),
      new THREE.MeshLambertMaterial({ color: PAL.part, transparent:true, opacity:0.95 }), N);
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    im.frustumCulled = false;
    world.add(im);
    DESC.parts = { im, N, i:0,
      x:new Float32Array(N), y:new Float32Array(N), z:new Float32Array(N),
      vx:new Float32Array(N), vy:new Float32Array(N), vz:new Float32Array(N),
      life:new Float32Array(N), size:new Float32Array(N) };
  }

  /* --- RASTRO DE LA TABLA ---
     Marcas planas que se dejan cada K.trailEvery unidades y se desvanecen.
     Es lo que convierte "voy por encima" en "estoy tallando el material". */
  {
    const N = K.trailN;
    const im2 = new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),
      new THREE.MeshBasicMaterial({ color:PAL.trail, transparent:true, opacity:0.5, depthWrite:false }), N);
    im2.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    im2.frustumCulled = false;
    im2.renderOrder = 1;
    world.add(im2);
    DESC.trail = { im:im2, N, i:0,
      x:new Float32Array(N), y:new Float32Array(N), z:new Float32Array(N),
      rot:new Float32Array(N), w:new Float32Array(N), life:new Float32Array(N) };
  }

  /* --- ESTELAS DE VELOCIDAD (en el MUNDO, no rayas en pantalla) ---
     Toni: "el efecto túnel son unas rayas cutres y no aumenta con la
     velocidad". Ahora son barras que pasan de largo alrededor de la cámara:
     su número, longitud y opacidad crecen con la velocidad. */
  {
    const N = K.streakN;
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.08, 0.08, 1),
      new THREE.MeshBasicMaterial({ color:PAL.part, transparent:true, opacity:0.35,
                                    depthWrite:false, fog:false }), N);
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    im.frustumCulled = false;
    im.renderOrder = 3;
    sc.add(im);           // en la ESCENA: viven alrededor de la cámara
    DESC.streaks = { im, N,
      x:new Float32Array(N), y:new Float32Array(N), z:new Float32Array(N), on:new Uint8Array(N) };
  }

  DESC.scene = sc;
  DESC.cam = new THREE.PerspectiveCamera(K.fovBase, innerWidth / innerHeight, 0.5, 5000);
  return sc;
}

/* --------------------------------------------------------------------
   POOLS
   -------------------------------------------------------------------- */
function emit(x, y, z, vx, vy, vz, size){
  const P = DESC.parts; if(!P) return;
  const i = P.i = (P.i + 1) % P.N;
  P.x[i]=x; P.y[i]=y; P.z[i]=z; P.vx[i]=vx; P.vy[i]=vy; P.vz[i]=vz;
  P.life[i] = 0.55 + Math.random()*0.45; P.size[i] = size;
}
const _m4 = new THREE.Matrix4(), _qt = new THREE.Quaternion(),
      _v3 = new THREE.Vector3(), _sc3 = new THREE.Vector3(), _eu = new THREE.Euler();

function updateParts(dt){
  const P = DESC.parts; if(!P) return;
  for(let i = 0; i < P.N; i++){
    if(P.life[i] <= 0){ _m4.makeScale(0,0,0); P.im.setMatrixAt(i, _m4); continue; }
    P.life[i] -= dt;
    P.vy[i] -= K.grav * 0.55 * dt;
    P.vx[i] *= 0.97; P.vz[i] *= 0.99;
    P.x[i] += P.vx[i]*dt; P.y[i] += P.vy[i]*dt; P.z[i] += P.vz[i]*dt;
    const g = terrainY(P.x[i], P.z[i]) + 0.05;
    if(P.y[i] < g){ P.y[i] = g; P.vy[i] *= -0.25; P.vx[i] *= 0.6; P.vz[i] *= 0.6; }
    const k = Math.max(0, Math.min(1, P.life[i] * 2.2));
    _v3.set(P.x[i], P.y[i], P.z[i]);
    _qt.setFromEuler(_eu.set(P.x[i], P.y[i]*2, P.z[i]));
    _sc3.setScalar(P.size[i] * k);
    _m4.compose(_v3, _qt, _sc3);
    P.im.setMatrixAt(i, _m4);
  }
  P.im.instanceMatrix.needsUpdate = true;
}

function dropTrail(x, z, rot, w){
  const T = DESC.trail; if(!T) return;
  const i = T.i = (T.i + 1) % T.N;
  T.x[i]=x; T.y[i]=terrainY(x,z)+0.10; T.z[i]=z; T.rot[i]=rot; T.w[i]=w;
  T.life[i]=K.trailLife;
}
function updateTrail(dt){
  const T = DESC.trail; if(!T) return;
  for(let i = 0; i < T.N; i++){
    if(T.life[i] <= 0){ _m4.makeScale(0,0,0); T.im.setMatrixAt(i, _m4); continue; }
    T.life[i] -= dt;
    const k = Math.max(0, Math.min(1, T.life[i] / K.trailLife));
    _v3.set(T.x[i], T.y[i], T.z[i]);
    _qt.setFromEuler(_eu.set(-Math.PI/2, 0, T.rot[i], 'ZYX'));
    _sc3.set(T.w[i] * (0.5 + k*0.5), 4.4, 1);
    _m4.compose(_v3, _qt, _sc3);
    T.im.setMatrixAt(i, _m4);
  }
  T.im.instanceMatrix.needsUpdate = true;
}

/* estelas de velocidad: se reciclan alrededor de la cámara; cuantas más
   activas y más largas, más rápido parece que vas */
/* POLVO EN VUELO (arena / nieve / espuma barriendo la cámara).
   Toni, del v2: "el efecto túnel son unas rayas cutres y no aumenta con la
   velocidad". Dos correcciones:
   · Es material del stage volando, no líneas blancas de pantalla.
   · La LONGITUD de cada mota crece con su distancia al eje de la vista, que
     es lo que hace el desenfoque de movimiento real: en el centro son motas,
     en la periferia son trazos. Cruzar el centro con rayas es justo lo que
     se veía barato.
   Número, longitud, velocidad y opacidad escalan con k (la velocidad). */
function updateStreaks(dt, k){
  const S = DESC.streaks; if(!S || !DESC.cam) return;
  const cam = DESC.cam;
  const activos = Math.floor(S.N * Math.max(0, (k - K.streakFrom) / (1 - K.streakFrom)));
  const vel = 150 + 420 * k;
  for(let i = 0; i < S.N; i++){
    if(i >= activos){ _m4.makeScale(0,0,0); S.im.setMatrixAt(i, _m4); S.on[i]=0; continue; }
    if(!S.on[i]){
      const a = Math.random()*TAU, rad = 9 + Math.random()*30;
      S.x[i] = Math.cos(a)*rad; S.y[i] = Math.sin(a)*rad; S.z[i] = -70 - Math.random()*110;
      S.on[i] = 1;
    }
    S.z[i] += vel * dt;
    if(S.z[i] > 26){ S.on[i] = 0; _m4.makeScale(0,0,0); S.im.setMatrixAt(i, _m4); continue; }
    const rad = Math.hypot(S.x[i], S.y[i]);
    const largo = (1.2 + 20 * k * k) * Math.min(1, rad / 26);   // trazo sólo en la periferia
    const gordo = 0.7 + 1.3 * Math.min(1, rad / 30);
    _v3.set(S.x[i], S.y[i], S.z[i]).applyMatrix4(cam.matrixWorld);
    _qt.copy(cam.quaternion);
    _sc3.set(gordo, gordo, largo);
    _m4.compose(_v3, _qt, _sc3);
    S.im.setMatrixAt(i, _m4);
  }
  S.im.instanceMatrix.needsUpdate = true;
  S.im.material.opacity = 0.06 + 0.34 * k;
}

/* =====================================================================
   CORREDORES
   ===================================================================== */
function makeRacer(i, human){
  const g = new THREE.Group();
  const col = RACER_COL[i];
  const mat = new THREE.MeshLambertMaterial({ color: col });

  const body = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.24, 4.6),
                               new THREE.MeshLambertMaterial({ color: 0x22262e }));
  board.position.y = 0.12; body.add(board);
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.74, 1.7, 12), mat);
  torso.position.y = 1.4; body.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.64, 14, 10), mat);
  head.position.y = 2.6; body.add(head);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.95),
                              new THREE.MeshLambertMaterial({ color: 0x101418 }));
  nose.position.set(0, 2.6, -0.66); body.add(nose);
  g.add(body);

  const meteor = new THREE.Mesh(new THREE.SphereGeometry(2.1, 14, 10),
    new THREE.MeshBasicMaterial({ color: col, transparent:true, opacity:0.5 }));
  meteor.position.y = 1.5; meteor.visible = false; g.add(meteor);

  const sh = new THREE.Mesh(new THREE.CircleGeometry(1.5, 16),
    new THREE.MeshBasicMaterial({ color:0x000000, transparent:true, opacity:0.3, depthWrite:false }));
  sh.rotation.x = -Math.PI / 2;

  DESC.world.add(g); DESC.world.add(sh);

  const x0 = (i - 1.5) * 7;
  return {
    i, human, col,
    name: human ? ('P' + (i + 1)) : ('CPU-' + 'ABC'[Math.max(0, i - HUMANS)]),
    gfx:g, body, board, meteor, shadow:sh,
    padIndex: human ? (HUMANS === 1 ? 0 : i) : -1,
    kb: human && i === 0,
    x:x0, y:terrainY(x0, 0), z:0,
    vx:0, vy:0, spd:0, sink:0, _trailAcc:0,
    air:false, onRamp:false, fall:0, crash:0, crashN:0, crashT:0,
    trick:null, trickT:0, combo:0,
    dash:K.dashMax, turbo:false,
    atk:0, atkCd:0, grabCd:0, grabbed:0, grabbedBy:null,
    item:null,
    pts:0, tricks:0, falls:0, crashes:0,
    done:false, place:0, time:0,
    _ai:{ targetMul:1, plan:null },
  };
}

/* =====================================================================
   INPUT
   ===================================================================== */
const TRICK_KEYS = { indy:'Digit1', flipB:'Digit2', flipF:'Digit3', spin:'Digit4', flipB2:'Digit5', super:'Digit6' };
function readDesc(r){
  const o = { ax:0, jump:false, turbo:false, atk:false, grab:false, item:false, trick:null };
  if(!r.human) return o;
  const kk = GAME_KEYS() || {};
  if(r.kb){
    if(kk['KeyD'] || kk['ArrowRight']) o.ax += 1;
    if(kk['KeyA'] || kk['ArrowLeft'])  o.ax -= 1;
    o.jump = !!kk['Space']; o.turbo = !!(kk['ShiftLeft']||kk['ShiftRight']);
    o.atk = !!kk['KeyJ']; o.grab = !!kk['KeyL']; o.item = !!kk['KeyU'];
    for(const t in TRICK_KEYS) if(kk[TRICK_KEYS[t]]){ o.trick = t; break; }
  }
  if(r.padIndex >= 0 && navigator.getGamepads){
    const gp = navigator.getGamepads(), pad = gp && gp[r.padIndex];
    if(pad){
      const lx = pad.axes[0] || 0;
      if(Math.abs(lx) > 0.22) o.ax += lx;
      const B = i => !!(pad.buttons[i] && pad.buttons[i].pressed);
      o.jump = o.jump || B(0); o.turbo = o.turbo || B(7);
      o.atk = o.atk || B(2); o.grab = o.grab || B(6); o.item = o.item || B(5);
      if(!o.trick){
        if(B(1)) o.trick='indy'; else if(B(3)) o.trick='flipB';
        else if(B(4)) o.trick='flipF'; else if(B(12)) o.trick='flipB2';
        else if(B(13)) o.trick='super'; else if(B(14)||B(15)) o.trick='spin';
      }
    }
  }
  o.ax = Math.max(-1, Math.min(1, o.ax));
  return o;
}

function aiInput(r, dt){
  const o = { ax:0, jump:false, turbo:false, atk:false, grab:false, item:false, trick:null };
  const skill = K.aiSkill[Math.min(K.aiSkill.length-1, Math.max(0, r.i - HUMANS))] || 0.85;
  const lead = DESC.racers.find(q => q.human) || DESC.racers[0];
  const gap = r.z - lead.z;
  let band = Math.max(-1, Math.min(1, gap / 100));
  if(Math.abs(gap) > K.aiMaxGap) band = Math.sign(gap) * 2.4;
  r._ai.targetMul = 1 + band * K.aiBand;

  if(r.air){
    if(!r.trick && r._ai.plan !== 'done'){
      const tAir = (r.vy + Math.sqrt(Math.max(0, r.vy*r.vy + 2*K.grav*Math.max(0.01, r.y - groundYAt(r.x, r.z))))) / K.grav;
      const margen = 1.18 - skill * 0.16;
      let best = null;
      for(const k in TRICKS) if(TRICKS[k].dur*margen <= tAir && (!best || TRICKS[k].pts > TRICKS[best].pts)) best = k;
      if(best && skill > 0.7) o.trick = best;
      r._ai.plan = 'done';
    }
    return o;
  }
  r._ai.plan = null;

  const ahead = nearObst(r.z - K.aiLook/2, K.aiLook);
  let danger = null, dz = 1e9;
  for(const ob of ahead){
    const d = r.z - ob.z;
    if(d < 2 || d > K.aiLook || ob.type === 'ramp' || ob.type === 'pick') continue;
    if(Math.abs(ob.x - r.x) > ob.r + 2.4) continue;
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
  if(groundYAt(r.x, r.z) - terrainY(r.x, r.z) > 0.4 && !rampAt(r.x, r.z - 2.6) && skill > 0.75) o.jump = true;
  o.turbo = gap > 35 && skill > 0.82;
  if(r.item && Math.random() < 0.02*skill) o.item = true;
  for(const q of DESC.racers){
    if(q === r || q.done) continue;
    if(Math.abs(q.z-r.z) < K.grabRange && Math.abs(q.x-r.x) < K.grabRange){
      if(skill > 0.85 && Math.random() < 0.012) o.grab = true;
      else if(Math.random() < 0.006) o.atk = true;
      break;
    }
  }
  return o;
}

/* =====================================================================
   CAÍDAS
   ===================================================================== */
function crash(r){
  if(r.fall > 0 || r.crash > 0) return;
  r.crashes++;
  r.crashN = (DESC.t - r.crashT < K.crashWindow) ? r.crashN + 1 : 1;
  r.crashT = DESC.t;
  if(r.crashN >= K.crashChain){ fall(r); return; }
  r.crash = K.crashTime;
  r.spd *= K.crashMul; r.vx *= 0.25;
  spray(r, 22, 3.2);
}
function fall(r){
  if(r.fall > 0) return;
  r.falls++; r.fall = K.fallTime;
  r.spd = 0; r.vx = 0; r.vy = 0; r.air = false;
  r.trick = null; r.combo = 0; r.crashN = 0;
  r.meteor.visible = false; r.atk = 0;
  spray(r, 40, 4.2);
}
function spray(r, n, force){
  const gy = groundYAt(r.x, r.z);
  for(let i = 0; i < n; i++){
    emit(r.x + (Math.random()-0.5)*2.2, gy + 0.3 + Math.random()*0.6, r.z + (Math.random()-0.5)*2.2,
         (Math.random()-0.5)*force*2.2, Math.random()*force*1.5, (Math.random()*0.4+0.5)*force,
         0.20 + Math.random()*0.34);
  }
}

/* =====================================================================
   SIMULACIÓN
   ===================================================================== */
function stepRacer(r, dt){
  if(r.done) return;
  const inp = (r.human && !r.aiDrive) ? readDesc(r) : aiInput(r, dt);

  if(r.fall > 0){
    r.fall -= dt;
    r.body.rotation.set(-1.35, 0, Math.sin(DESC.t*7)*0.12);
    r.z -= r.spd * dt;
    r.y = groundYAt(r.x, r.z);
    r.gfx.position.set(r.x, r.y, r.z);
    r.shadow.position.set(r.x, r.y + 0.07, r.z);
    if(r.fall <= 0) r.body.rotation.set(0,0,0);
    return;
  }

  if(r.crash > 0){
    r.crash -= dt;
    inp.ax = 0; inp.jump = false; inp.turbo = false; inp.trick = null;
    r.body.rotation.y += dt * 11;
    if(r.crash <= 0) r.body.rotation.y = 0;
  }

  if(r.grabbed > 0){
    r.grabbed -= dt;
    if(inp.grab && r.grabbedBy && r.grabCd <= 0){
      fall(r.grabbedBy); r.pts += K.counterPts;
      r.grabbed = 0; r.grabbedBy = null; r.grabCd = K.grabCd;
    }
  }

  r.turbo = inp.turbo && r.dash > 0 && r.crash <= 0;
  if(r.turbo) r.dash = Math.max(0, r.dash - dt);
  else        r.dash = Math.min(K.dashMax, r.dash + dt * K.dashRegen);

  /* ================= FÍSICA DE TABLA =================
     gravedad en la pendiente LOCAL − rozamiento del material − freno de carve.
     De aquí sale sola la velocidad máxima (terminal), que las hondonadas
     aceleren, que los lomos frenen y que la nieve blanda te coma. */
  const hard = hardnessAt(r.x, r.z);
  const slope = r.air ? 0 : slopeAt(r.x, r.z);
  const carve = Math.min(1, Math.abs(r.vx) / K.latMax);

  if(!r.air){
    let acc = K.grav * Math.sin(slope);                                  // empuje de la cuesta
    const dragMul = K.dragSoft + (K.dragHard - K.dragSoft) * hard;       // suelto frena, prensado corre
    acc -= K.dragC * r.spd * r.spd * dragMul;
    acc -= carve * K.carveBrake;                                          // carvear FRENA
    if(r.turbo)     acc += K.turboThrust;
    if(r.grabbed>0) acc -= 8;
    acc *= (r._ai.targetMul || 1);
    r.spd = Math.max(0, r.spd + acc * dt);
  }
  r.z -= r.spd * dt;

  /* ataque */
  r.atkCd = Math.max(0, r.atkCd - dt);
  if(inp.atk && r.atkCd <= 0 && r.crash <= 0 && r.atk <= 0){
    r.atk = K.atkTime; r.atkCd = K.atkCd; r.spd += K.atkSpeed; r.meteor.visible = true;
  }
  if(r.atk > 0){
    r.atk -= dt;
    const k = Math.max(0, r.atk / K.atkTime);
    r.meteor.material.opacity = 0.20 + 0.55*k;
    r.meteor.scale.setScalar(1 + (1-k)*0.8);
    if(Math.random() < 0.8) emit(r.x + (Math.random()-0.5)*1.6, r.y + 1 + Math.random()*1.6, r.z + 1.5,
                                 (Math.random()-0.5)*6, Math.random()*5, 14 + Math.random()*10, 0.3);
    for(const q of DESC.racers){
      if(q === r || q.done || q.fall > 0) continue;
      if(Math.abs(q.z-r.z) < 4.5 && Math.abs(q.x-r.x) < 4.5){
        q.vx += Math.sign(q.x - r.x || 1) * K.atkPush; crash(q); r.pts += K.atkPts;
      }
    }
    if(r.atk <= 0) r.meteor.visible = false;
  }

  /* objeto */
  if(inp.item && r.item && !r._itemHeld && r.fall <= 0){
    ITEMS[r.item].use(r);
    r._lastTrick = ITEMS[r.item].name; r._lastTrickT = 1.0; r.item = null;
  }
  r._itemHeld = inp.item;

  /* agarre */
  r.grabCd = Math.max(0, r.grabCd - dt);
  if(inp.grab && r.grabCd <= 0 && r.grabbed <= 0 && r.crash <= 0){
    r.grabCd = K.grabCd;
    for(const q of DESC.racers){
      if(q === r || q.done || q.fall > 0) continue;
      if(Math.abs(q.z-r.z) > K.grabRange || Math.abs(q.x-r.x) > K.grabRange) continue;
      q.grabbed = K.grabTime; q.grabbedBy = r; r.pts += K.grabPts; break;
    }
  }

  /* lateral */
  const ctrl = r.air ? K.airCtrl : 1;
  r.vx += inp.ax * K.latAcc * ctrl * dt;
  r.vx *= Math.pow(K.latDamp, dt*60);
  r.vx = Math.max(-K.latMax, Math.min(K.latMax, r.vx));
  r.x += r.vx * dt;

  const lim = HALF() - 1.8;
  if(Math.abs(r.x) > lim){ r.x = Math.sign(r.x)*lim; r.vx *= -0.3; crash(r); }

  /* --- suelo / aire / rampas / trucos --- */
  const gy = groundYAt(r.x, r.z);
  const onR = !!rampAt(r.x, r.z);
  if(!r.air){
    r.y = gy;
    if(inp.jump && !r._jumpHeld && r.crash <= 0){
      r.air = true; r.vy = K.jumpV;
      spray(r, 6, 2.0);
    } else if(r.onRamp && !onR){
      /* ha pasado el LABIO de la rampa (con terreno irregular no vale mirar
         "y≈0": hay que seguir si estabas o no sobre una rampa) */
      const o = rampAt(r.x, r.z + 3) || null;
      const base = o ? (K.rampVy[o.size] || K.rampVy.m) : K.rampVy.s;
      r.air = true; r.vy = base + r.spd * K.rampSpdK;
      spray(r, 12, 2.8);
    }
    /* RASTRO + partículas de carve */
    r._trailAcc += r.spd * dt;
    if(r._trailAcc >= K.trailEvery){
      r._trailAcc = 0;
      dropTrail(r.x, r.z, Math.atan2(r.vx, r.spd || 1), 1.7 + carve*1.5);
    }
    if(Math.random() < 0.2 + carve*0.8 + (r.spd/70)*0.4){
      emit(r.x - Math.sign(r.vx)*0.8, gy + 0.25, r.z + 1.4,
           -r.vx*0.35 + (Math.random()-0.5)*3, 1.5 + Math.random()*3.5 + carve*6,
           4 + Math.random()*5 + r.spd*0.06, 0.16 + Math.random()*0.22 + carve*0.24);
    }
  } else {
    r.vy -= K.grav * dt;
    r.y += r.vy * dt;
    if(inp.trick && !r.trick && TRICKS[inp.trick]){ r.trick = inp.trick; r.trickT = 0; }
    if(r.trick){
      const T = TRICKS[r.trick];
      r.trickT += dt;
      r.body.rotation.set(0,0,0);
      r.body.rotation[T.axis] = Math.min(1, r.trickT/T.dur) * TAU * T.turns;
      if(r.trickT >= T.dur){
        const mul = K.comboMul[Math.min(K.comboMul.length-1, r.combo)];
        r.pts += Math.round(T.pts*mul); r.tricks++; r.combo++;
        r._lastTrick = T.name + (mul>1 ? ' ×'+mul : ''); r._lastTrickT = 1.2;
        r.trick = null; r.trickT = 0; r.body.rotation.set(0,0,0);
      }
    }
    if(r.y <= gy){
      r.y = gy; r.air = false;
      if(r.trick) fall(r);
      else { r.combo = 0; spray(r, 10, 2.4); }
    }
  }
  r.onRamp = onR;
  r._jumpHeld = inp.jump;

  /* obstáculos */
  if(r.crash <= 0 && r.fall <= 0){
    for(const o of nearObst(r.z, 16)){
      if(o.type === 'rock'){
        if(r.y > (o.baseY||0) + o.r*1.05) continue;
        if(Math.abs(o.z-r.z) < o.r+1.6 && Math.abs(o.x-r.x) < o.r+1.2) crash(r);
      } else if(o.type === 'pick' && !o.taken){
        if(Math.abs(o.z-r.z) < 3.2 && Math.abs(o.x-r.x) < 3.2 && r.y - terrainY(r.x,r.z) < 4.2){
          o.taken = true; if(o._m) o._m.visible = false;
          r.item = ITEM_KEYS[(Math.random()*ITEM_KEYS.length)|0];
        }
      }
    }
    for(const q of DESC.racers){
      if(q === r || q.done || q.fall > 0) continue;
      if(Math.abs(q.z-r.z) < 2.6 && Math.abs(q.x-r.x) < 2.2 && Math.abs(q.y-r.y) < 2){
        const s = Math.sign(r.x - q.x || 1);
        r.vx += s*10; q.vx -= s*10; crash(r); crash(q);
      }
    }
  }

  if(r.z <= -K.len && !r.done){
    r.done = true; r.time = DESC.t;
    DESC.finishOrder.push(r); r.place = DESC.finishOrder.length;
    r.pts += K.ptsPos[Math.min(K.ptsPos.length-1, r.place-1)];
  }

  /* --- gráficos: HUNDIMIENTO de la tabla en el material --- */
  r.sink = r.air ? 0 : K.sinkMax * (1 - hard) * (0.55 + carve*0.45);
  r.gfx.position.set(r.x, r.y - r.sink, r.z);
  if(r.crash <= 0 && r.fall <= 0 && !r.trick){
    /* el cuerpo se alinea con la pendiente y se tumba en la curva */
    r.body.rotation.set((r.air ? -0.14 : 0.06) - slope*0.6, 0, -(r.vx/K.latMax)*0.6);
  }
  r.shadow.position.set(r.x, gy + 0.07, r.z);
  const h = Math.max(0, r.y - gy);
  r.shadow.material.opacity = 0.30 / (1 + h*0.11);
  r.shadow.scale.setScalar(1 / (1 + h*0.045));
  if(r._lastTrickT > 0) r._lastTrickT -= dt;
}

function leash(){
  const hum = DESC.racers.filter(r => r.human && !r.done);
  if(hum.length < 2) return;
  let anchor = 0; for(const r of hum) anchor += r.z; anchor /= hum.length;
  for(const r of hum){
    if(r.z > anchor + K.leash){ r.z = anchor + K.leash; r.spd = Math.max(r.spd, 40); }
    if(r.z < anchor - K.leash) r.z = anchor - K.leash;
  }
}

/* =====================================================================
   CÁMARA
   ===================================================================== */
const _camPos = new THREE.Vector3(), _camLook = new THREE.Vector3();
let _camInit = false;
function stepCamera(dt){
  let hum = DESC.racers.filter(r => r.human);
  if(!hum.length) hum = DESC.racers;
  let ax=0, az=0, fast=0;
  for(const r of hum){ ax += r.x; az += r.z; fast = Math.max(fast, r.spd); }
  ax /= hum.length; az /= hum.length;

  const k = Math.max(0, Math.min(1, (fast - 22) / 52));    // 0..1 de "voy rápido"
  DESC._spdK = k;

  const lookZ = az - K.camLookAhead;
  _camLook.set(ax * K.camXFollow, groundYAt(ax, lookZ) + K.camLookY, lookZ);

  /* el picado se SUMA a la pendiente local: la cámara baja la cuesta contigo
     en vez de quedarse mirando al cielo o clavarse en la arena */
  const sl = slopeAt(ax, az);
  const p = K.camPitch * Math.PI/180 + sl;
  const dist = K.camDist + K.camDistFast * k;              // se ACERCA al correr = túnel
  _camPos.set(_camLook.x, _camLook.y + Math.sin(p)*dist, _camLook.z + Math.cos(p)*dist);

  if(DESC.world && K.tilt){
    DESC.world.updateMatrixWorld();
    DESC.world.localToWorld(_camLook); DESC.world.localToWorld(_camPos);
  }

  if(!_camInit){ DESC.cam.position.copy(_camPos); _camInit = true; }
  else DESC.cam.position.lerp(_camPos, Math.min(1, K.camLag*dt));

  const sh = k * K.shakeSpeed;
  DESC.cam.position.x += (Math.random()-0.5)*sh;
  DESC.cam.position.y += (Math.random()-0.5)*sh;
  DESC.cam.lookAt(_camLook);
  DESC.cam.updateMatrixWorld();

  if(DESC.backdrop) DESC.backdrop.position.set(DESC.cam.position.x, DESC.cam.position.y, DESC.cam.position.z);
  if(DESC.sky) DESC.sky.position.copy(DESC.cam.position);

  const want = K.fovBase + K.fovSpeed * k * k;
  DESC.cam.fov += (want - DESC.cam.fov) * Math.min(1, 5*dt);
  DESC.cam.updateProjectionMatrix();
}

/* =====================================================================
   HUD
   ===================================================================== */
function buildHud(){
  const d = document.createElement('div');
  d.id = 'descHud';
  d.style.cssText = 'position:fixed;inset:0;z-index:120;pointer-events:none;' +
    'font:13px/1.45 ui-monospace,Consolas,monospace;color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.75)';
  d.innerHTML =
    '<div id="dVig" style="position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 42%,rgba(0,0,0,.5) 100%)"></div>' +
    '<div id="dTop" style="position:absolute;top:14px;left:50%;transform:translateX(-50%);text-align:center;font-size:15px;font-weight:700"></div>' +
    '<div id="dLeft" style="position:absolute;top:14px;left:16px;background:rgba(6,10,20,.5);padding:9px 13px;border-radius:9px"></div>' +
    '<div id="dRight" style="position:absolute;top:14px;right:16px;background:rgba(6,10,20,.5);padding:9px 13px;border-radius:9px;text-align:right"></div>' +
    '<div id="dTrick" style="position:absolute;top:31%;left:50%;transform:translate(-50%,-50%);font-size:34px;font-weight:900;opacity:0;color:#ffe14d"></div>' +
    '<div id="dBig" style="position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);font-size:84px;font-weight:900;letter-spacing:-2px"></div>' +
    '<div id="dBar" style="position:absolute;left:50%;bottom:22px;transform:translateX(-50%);width:min(620px,72vw);height:9px;background:rgba(0,0,0,.42);border-radius:6px;overflow:hidden">' +
      '<div id="dFill" style="height:100%;width:0;background:#fff;border-radius:6px"></div></div>' +
    '<div id="dHelp" style="position:absolute;left:16px;bottom:14px;opacity:.5;font-size:11px;line-height:1.5">' +
      'A/D carvear (¡frena!) · ESPACIO saltar · SHIFT turbo · J meteorito · L agarrar/contra · U objeto<br>' +
      'TRUCOS: 1 Indy · 2 mortal atrás · 3 mortal adelante · 4 360 · 5 DOBLE mortal · 6 Superman<br>' +
      'R reiniciar · T semilla nueva · <b>DESC.K</b></div>';
  document.body.appendChild(d);
  DESC.hud = { root:d, top:d.querySelector('#dTop'), left:d.querySelector('#dLeft'),
    right:d.querySelector('#dRight'), big:d.querySelector('#dBig'), fill:d.querySelector('#dFill'),
    vig:d.querySelector('#dVig'), trick:d.querySelector('#dTrick') };
}

function updateHud(){
  const h = DESC.hud; if(!h) return;
  const me = DESC.racers[0];
  const order = DESC.racers.slice().sort((a,b) => a.z - b.z);
  const place = order.indexOf(me) + 1;
  const k = DESC._spdK || 0;
  const hard = hardnessAt(me.x, me.z);

  h.vig.style.opacity = (k*0.8).toFixed(2);

  const tb = Math.ceil(me.dash / K.dashMax * 6);
  h.left.innerHTML =
    '<div style="font-size:26px;font-weight:900;line-height:1">' + place + 'º</div>' +
    '<div style="font-size:18px;font-weight:800;color:' + (me.turbo ? '#ffd23f' : '#fff') + '">' +
      Math.round(me.spd*2.6) + ' km/h</div>' +
    '<div style="opacity:.8">turbo ' + '▮'.repeat(tb) + '▯'.repeat(6-tb) + '</div>' +
    '<div style="opacity:.7">suelo ' + (hard > 0.62 ? '<b style="color:#7bf06a">DURO</b>'
      : hard < 0.38 ? '<b style="color:#ff8a3d">BLANDO</b>' : 'normal') + '</div>' +
    (me.atkCd > 0 ? '<div style="opacity:.5">meteorito ' + me.atkCd.toFixed(1) + 's</div>'
                  : '<div style="color:#7bf06a">meteorito LISTO</div>') +
    (me.item ? '<div style="margin-top:4px;font-weight:800;color:#' + ITEMS[me.item].col.toString(16).padStart(6,'0') + '">◆ ' + ITEMS[me.item].name + ' (U)</div>'
             : '<div style="opacity:.35;margin-top:4px">sin objeto</div>');

  h.right.innerHTML =
    '<div style="font-size:20px;font-weight:800">' + me.pts + ' pts</div>' +
    '<div style="opacity:.8">' + me.tricks + ' trucos · ' + me.falls + ' caídas</div>' +
    '<div style="opacity:.8">' + DESC.t.toFixed(1) + ' s</div>';

  h.top.innerHTML = order.map(r => '<span style="color:#' + r.col.toString(16).padStart(6,'0') + ';margin:0 7px">' + r.name + '</span>').join('');
  h.trick.style.opacity = (me._lastTrickT > 0) ? Math.min(1, me._lastTrickT) : 0;
  if(me._lastTrickT > 0) h.trick.textContent = me._lastTrick || '';
  h.fill.style.width = Math.min(100, (-me.z/K.len)*100) + '%';

  if(DESC.phase === 'countdown'){
    const n = Math.ceil(DESC.count);
    h.big.style.fontSize = '84px';
    h.big.textContent = n > 0 ? n : '¡YA!'; h.big.style.opacity = 1;
  } else if(DESC.phase === 'finish'){
    h.big.style.fontSize = '34px';
    h.big.innerHTML = 'META<br>' + DESC.finishOrder.map((r,i) =>
      '<div style="font-size:17px;margin-top:6px;color:#' + r.col.toString(16).padStart(6,'0') + '">' +
      (i+1) + 'º ' + r.name + ' — ' + r.time.toFixed(1) + 's · ' + r.pts + ' pts · ' +
      r.tricks + ' trucos · ' + r.falls + ' caídas</div>').join('') +
      '<div style="font-size:12px;opacity:.6;margin-top:14px">R reiniciar · T semilla nueva</div>';
    h.big.style.opacity = 1;
  } else h.big.style.opacity = 0;
}

/* =====================================================================
   ARRANQUE
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
  DESC.noise  = makeNoise(seed);
  DESC.noiseH = makeNoise(seed ^ 0x9e37);
  DESC.obst = genTrack(DESC.rng);
  DESC.buckets = bucketize(DESC.obst);
  buildScene();
  DESC.racers = [];
  for(let i = 0; i < 4; i++) DESC.racers.push(makeRacer(i, i < HUMANS));
  DESC.t = 0; DESC.phase = 'countdown'; DESC.count = 3.2;
  DESC.finishOrder = []; _camInit = false;
  console.log('[descenso] semilla=' + seed + ' · ' + DESC.obst.length + ' obstáculos · piel=' + SKIN +
              ' · pendiente ' + K.slope + 'º');
}
DESC._start = start;

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
        r.pts += K.ptsPos[Math.min(K.ptsPos.length-1, r.place-1)];
      }
      DESC.phase = 'finish';
    }
  }

  if(DESC.picks) for(const o of DESC.picks)
    if(o._m && o._m.visible){ o._m.rotation.y += dt*2.4; o._m.rotation.x += dt*1.1; }

  stepCamera(dt);
  updateParts(dt);
  updateTrail(dt);
  updateStreaks(dt, DESC._spdK || 0);
  updateHud();
};

DESC.render = function(){
  if(!DESC.scene) return;
  const rr = GAME_RENDERER(); if(!rr) return;
  rr.setRenderTarget(null);
  rr.render(DESC.scene, DESC.cam);
};

addEventListener('keydown', e => {
  if(!DESC.on) return;
  if(e.code === 'KeyR'){ start(DESC.seed); e.preventDefault(); }
  if(e.code === 'KeyT'){ start((Math.random()*1e9)|0); e.preventDefault(); }
});
addEventListener('resize', () => {
  if(DESC.cam){ DESC.cam.aspect = innerWidth/innerHeight; DESC.cam.updateProjectionMatrix(); }
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
