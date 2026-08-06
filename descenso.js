/* =====================================================================
   ►DESCENSO — carrera de transición entre stages  ·  v4

   Minijuego de sandboard / snowboard / surf que se juega ENTRE dos mundos.
   Un solo sistema con tres pieles.

   ---------------------------------------------------------------------
   ENTRADA
        rumble_arena_cinta_v4.html?descenso
        ...&humanos=2      ...&semilla=1234      ...&piel=nieve|mar
   Sin ?descenso, este fichero sale en su primera línea.

   ---------------------------------------------------------------------
   CONTROLES
     Stick ←/→ · A/D ....... GIRAR (el board apunta; la velocidad le sigue)
     A         · Espacio ... OLLIE: mantén para cargar, suelta para saltar
     RT        · Shift ..... turbo
     X         · J ......... ATAQUE: dash-meteorito con tu color (cooldown)
     LT        · L ......... AGARRAR — y el MISMO botón es el CONTRA
     RB        · U ......... usar objeto
     Stick der.· Q/E/ratón . girar la CÁMARA (vuelve sola detrás)

     TRUCOS (en el aire, duración FIJA — si aterrizas a medias, te caes):
     B  · 1 .. Indy 0,40 s · 40    |  Y  · 2 .. Mortal atrás 0,80 s · 130
     ↓  · 6 .. Superman 0,50 s · 60|  LB · 3 .. Mortal adelante 0,80 s · 130
     ←→ · 4 .. 360 0,65 s · 90     |  ↑  · 5 .. DOBLE mortal 1,35 s · 320

     R reiniciar · T semilla nueva · afinado en vivo: DESC.K

   =====================================================================
   QUÉ CAMBIA EN LA v4 (petición de Toni + salto a física "de juego serio")

   1) LA PISTA ES UN ABANICO DE 180°, NO UN PASILLO.
      El límite ya no son dos paredes a 23 unidades: la montaña se abre de
      ±70 a ±200 unidades y el board puede APUNTAR a cualquier sitio dentro
      de media circunferencia (±90° respecto de la línea de máxima pendiente).
      A 90° estás atravesando la ladera y te paras solo, porque la gravedad
      ya no tiene componente en tu dirección. Ese es todo el límite: no hay
      muro invisible, hay física.

   2) ZONAS DE PENDIENTE, COMO UNA ESTACIÓN DE ESQUÍ.
      La bajada son BANDAS encadenadas — verde 11°, azul 18°, roja 26°,
      negra 35°, fuera pista 42° — con la transición en 26 unidades: entras
      "de golpe". Cada zona trae su propio material (el fuera pista es nieve
      profunda: frena y te hunde), su propio relieve (lomos de 4,6 u contra
      0,5 de la verde) y su propio color, y el borde va SEÑALIZADO con una
      hilera de jalones del color de lo que viene.

   3) FÍSICA DE TABLA DE VERDAD. Seis piezas, todas las que separan un
      minijuego de un SSX/Steep/Descenders:
        · VELOCIDAD VECTORIAL sobre el terreno: la gravedad se proyecta en
          el plano de la superficie. No hay "avanzar en Z" ni velocidad
          máxima elegida a mano.
        · MODELO DE CANTO tipo neumático: el board desliza libre a lo largo
          y agarra de lado, con un TOPE de agarre. Por debajo TALLAS (giras
          conservando velocidad); por encima DERRAPAS y raspas. "Girar
          frena" deja de ser una resta inventada: es energía perdida.
        · FUERZA NORMAL POR CURVATURA: en una compresión pesas más (más
          agarre) y en un lomo pesas menos. Si el terreno cae más rápido de
          lo que la gravedad te puede bajar, DESPEGAS SOLO. Las rampas ya no
          tienen impulso escrito a mano: salen por esto mismo.
        · ATERRIZAJE POR ABSORCIÓN NORMAL: al caer se descompone la
          velocidad en normal + tangencial y solo se pierde la normal.
          Caer en plano te seca; caer en una pared de 40° es suave. Por eso
          ahora INTERESA saltar donde hay pendiente.
        · OLLIE CON CARGA: mantener el botón carga (hasta 0,4 s) y soltar
          salta; si sales por un labio con la carga puesta, sumas pop.
        · PASO FIJO a 120 Hz. Estabilidad y, de paso, el determinismo que
          hará falta el día del online.

   4) CÁMARA detrás del board (no detrás del eje Z), picada sobre la
      pendiente local, y ORBITABLE en todas direcciones con el stick
      derecho / Q / E / arrastrar el ratón. Vuelve sola detrás en 1,2 s y no
      se mete bajo tierra.

   K.tilt (la inclinación falsa) sigue existiendo y vale 0: se queda para el
   surf, donde el mar es plano y hay que fingir algo de inclinación.

   ---------------------------------------------------------------------
   MEDIDO EN EJECUCIÓN (Edge headless, semilla 4242, 0 excepciones, 0 NaN)

   · Bajada limpia sin tocar nada: 54 s, 2.600 u de pista, 1.255 u de desnivel.
     Velocidad de equilibrio por zona: verde 41 · azul 52 · roja 54 · negra
     60-63 · fuera pista 50. El fuera pista es la MÁS inclinada y NO la más
     rápida: la nieve profunda se la come. Eso es exactamente lo que se busca.
   · Carrera con 4 corredores: 85-97 s, llegadas en 3 s, 0-3 caídas cada uno.
   · Terreno: 47.120 triángulos.

   CINCO TRAMPAS CAÍDAS Y ANOTADAS (todas encontradas midiendo, ninguna a ojo)
   1. DEVANADO DEL TERRENO AL REVÉS: la malla en abanico se culleaba entera y
      la escena parecía "props flotando sobre el telón". Se cazó lanzando un
      rayo por el centro de la pantalla: impactaba a 2.400 u, en el fondo.
   2. Al aterrizar se dejaba _vT a 0 → el paso siguiente creía que el suelo se
      escapaba y te RELANZABA: se pasaba el 69% de la bajada volando.
   3. Sin rozamiento EN EL AIRE, y volando la mitad del tiempo, la velocidad se
      iba a 196 u/s. El aire frena, y a 100 u/s es lo que más frena.
   4. Con el agarre lateral infinito, pararse cruzado en la ladera era un
      callejón SIN SALIDA (la IA se plantó 200 s a 1,8 u/s). Parado no se
      aguanta el canto: el agarre se desvanece y el morro cae a la pendiente.
   5. La cámara heredaba la pendiente medida en 3 unidades: un lomo la mandaba
      a cenital. Se mide sobre 30 u y se topa a 36°.
   ===================================================================== */
(function(){
'use strict';

const Q = location.search;
if(!/[?&]descenso(=|&|$)/.test(Q)) return;

const _qs    = new URLSearchParams(Q);
const HUMANS = Math.max(1, Math.min(4, parseInt(_qs.get('humanos')||'1', 10) || 1));
const SKIN   = (_qs.get('piel') || 'arena').toLowerCase();
const TAU    = Math.PI * 2;
const RAD    = Math.PI / 180;
const clamp  = (v, a, b) => v < a ? a : (v > b ? b : v);
const lerp   = (a, b, t) => a + (b - a) * t;
const smooth = x => x * x * (3 - 2 * x);

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
   falta el día del online. Normalizado a ±1 de verdad (en la v3 devolvía ±0,4
   y todas las amplitudes mentían por 2,5×). */
function makeNoise(seed){
  const rng = mulberry32(seed);
  const perm = new Uint8Array(512);
  const p = []; for(let i = 0; i < 256; i++) p.push(i);
  for(let i = 255; i > 0; i--){ const j = (rng() * (i + 1)) | 0; const t = p[i]; p[i] = p[j]; p[j] = t; }
  for(let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
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
  /* --- ABANICO (el límite de 180°) ---
     La montaña se abre según bajas. El board no puede apuntar más de
     yawLimit a cada lado de la línea de máxima pendiente: 180° en total. */
  hw0:        70,      // semianchura en la salida
  hw1:        200,     // ...y en la meta
  hwPow:      0.8,
  yawLimit:   88 * RAD,
  bowl:       20,      // cuánto suben los bordes (cuenco): te devuelve al centro
  len:        0,       // ← lo calcula PLAN

  /* --- ZONAS --- */
  zoneBlend:  26,      // unidades de transición entre bandas ("de golpe")
  bumpFreqB:  0.010,   // lomos grandes (su amplitud la pone la zona)
  bumpSmall:  0.42,
  bumpFreqS:  0.075,
  hardFreq:   0.016,   // ruido de dureza SOBRE la dureza base de la zona

  /* --- FÍSICA DE TABLA ---
     Nada de "velocidad máxima": sale de gravedad-en-el-plano contra
     rozamiento. A 11° son ~54 u/s y a 42° pasa de 100. */
  grav:       52,
  dragC:      0.0055,  // rozamiento aerodinámico (∝ v²). Calibrado para que la
                       // velocidad de equilibrio salga 45/56/63/68/58 u/s por
                       // zona (verde/azul/roja/negra/fuera): ver la cabecera.
  dragAir:    0.85,    // el MISMO rozamiento vale en el aire. Sin esto la
                       // bajada limpia se iba a 196 u/s: medido — volando el
                       // 60% del tiempo, el rozamiento solo actuaba el 40%.
  dragSoft:   2.0,     // multiplicador en el material MÁS suelto
  dragHard:   0.60,    // ...y en el más prensado
  muBase:     2.2,     // rozamiento seco del material (u/s², escala con la normal)
  grip:       62,      // TOPE de agarre lateral (u/s² con N=1). Pasado esto, DERRAPAS
  gripSoft:   0.55,    // el agarre que queda en material suelto
  gripLowV:   10,      // por debajo de esta velocidad el canto NO agarra: parado
                       // y cruzado se derrapa ladera abajo, como en la realidad
  gripLowMin: 0.22,
  fallTurn:   1.1,     // rad/s con que el morro cae hacia la máxima pendiente a
                       // poca velocidad. Sin esto, cruzarse a 0 km/h es un
                       // callejón sin salida: medido, la IA se plantó 200 s.
  carveDrag:  0.055,   // freno longitudinal proporcional a la fuerza de canto
  skidDrag:   0.65,    // ...y el que raspa el derrape
  turnLow:    2.5,     // rad/s de giro a poca velocidad
  turnHigh:   1.15,    // ...y a tope (un board rápido gira menos)
  airTurn:    1.5,
  turboThrust:13,
  dashMax:    2.4,
  dashRegen:  0.34,
  nMax:       3.0,     // tope de la fuerza normal (compresiones)

  /* --- SALTO / AIRE / ATERRIZAJE --- */
  ollieMin:   9,       // impulso del ollie sin cargar
  ollieMax:   19,      // ...y con la carga llena
  ollieChg:   0.40,    // segundos de carga
  olliePop:   9,       // pop extra si sales por un labio con la carga puesta
  landHard:   34,      // componente NORMAL de impacto que te tumba
  landSlip:   62 * RAD,// desalineación board/velocidad que te tumba al caer
  airMin:     1.2,     // vy mínima para dar por bueno un despegue por relieve
  airThr:     1.35,    // margen sobre la gravedad para despegar de verdad. Es la
                       // "suspensión": las piernas absorben lo que no llega.

  /* --- HUNDIMIENTO Y RASTRO --- */
  sinkMax:    0.55,
  trailEvery: 1.9,
  trailLife:  7.0,
  trailN:     760,

  /* --- CHOQUES Y CAÍDAS --- */
  crashMul:   0.5,
  crashTime:  0.55,
  crashChain: 3,
  crashWindow:3.0,
  fallTime:   1.35,

  /* --- ataque / agarre --- */
  atkSpeed:   30, atkTime:0.55, atkCd:4.2, atkPush:30, atkPts:45,
  grabRange:  7.0, grabTime:0.5, grabSlow:0.55, grabCd:1.2, grabPts:60, counterPts:120,

  ptsPos:     [300, 200, 120, 60],
  comboMul:   [1, 1.5, 2, 2.5],

  /* --- cámara --- */
  tilt:       0,       // inclinación FALSA. 0: ya hay pendiente real. Para el surf.
  camPitch:   16,      // picado SOBRE la pendiente local. Medido: con 24 y
                       // herencia 0,75 la cámara miraba 38° hacia abajo en una
                       // roja y la bajada se leía como un plano cenital.
  camSlopeK:  0.85,    // cuánto de la pendiente local hereda el picado: casi
                       // toda, para ir "dentro" de la ladera y ver el horizonte
  camSlopeBase:30,     // sobre cuántas unidades se mide esa pendiente. Con 3 (la
                       // que usa la IA) un lomo la disparaba y en el fuera pista
                       // la cámara se iba a cenital.
  camPitchMin:10 * RAD,
  camPitchMax:36 * RAD,
  camDist:    34,
  camDistFast:-7,
  camLookAhead: 14,    // con 26 el encuadre se comía al jugador por abajo:
                       // el punto de mira tira de la cámara más que la distancia
  camLookY:   3.0,
  camLookMix: 0.5,     // el punto de mira se queda a media altura entre yo y el
                       // suelo de allí; apuntar al suelo de una pared de 42°
                       // manda la cámara a mirarse los pies
  camLag:     8.0,
  fovBase:    56,
  fovSpeed:   28,
  shakeSpeed: 0.55,
  leash:      70,
  orbSpeed:   2.3,     // rad/s del stick derecho / Q / E
  orbMouse:   0.006,   // rad por píxel arrastrado
  orbPitchMin:-28 * RAD,
  orbPitchMax: 68 * RAD,
  orbHold:    1.2,     // s parado antes de volver sola detrás
  orbBack:    2.4,     // velocidad de recentrado
  camMinH:    3.2,     // la cámara nunca baja de esto sobre el suelo

  /* --- efecto de velocidad --- */
  streakN:    340,
  streakFrom: 0.25,

  /* --- IA --- */
  aiBand: 0.14, aiMaxGap: 170, aiLook: 55, aiSkill: [0.93, 0.87, 0.81],

  /* --- simulación --- */
  fixed:      1/120,
};

const TRICKS = {
  indy:   { name:'Indy',              dur:0.40, pts:40,  axis:'z', turns:0.18 },
  super:  { name:'Superman',          dur:0.50, pts:60,  axis:'x', turns:0.15 },
  spin:   { name:'360',               dur:0.65, pts:90,  axis:'y', turns:1 },
  flipB:  { name:'Mortal atrás',      dur:0.80, pts:130, axis:'x', turns:-1 },
  flipF:  { name:'Mortal adelante',   dur:0.80, pts:130, axis:'x', turns:1 },
  flipB2: { name:'DOBLE mortal atrás',dur:1.35, pts:320, axis:'x', turns:-2 },
};

/* =====================================================================
   ZONAS DE PENDIENTE
   Cada banda es un tramo de montaña con su inclinación, su material, su
   relieve y su color. `hard` 1 = prensado (corre y agarra), 0 = profundo.
   ===================================================================== */
const ZONA = {
  verde: { deg:11, nombre:'PISTA VERDE', col:0x3fbe63, hard:0.90, bump:0.5, rock:0.30, ramp:1.15 },
  azul:  { deg:18, nombre:'PISTA AZUL',  col:0x3d86e0, hard:0.84, bump:0.9, rock:0.50, ramp:1.05 },
  roja:  { deg:26, nombre:'PISTA ROJA',  col:0xdd4a3a, hard:0.75, bump:1.5, rock:0.75, ramp:0.90 },
  negra: { deg:35, nombre:'PISTA NEGRA', col:0x22222c, hard:0.66, bump:3.0, rock:0.85, ramp:0.65 },
  fuera: { deg:42, nombre:'FUERA PISTA', col:0x9d5ad4, hard:0.20, bump:4.6, rock:1.25, ramp:0.30 },
};

/* El recorrido. Cambiar esta lista es cambiar la montaña entera. */
const PLAN = [
  ['verde', 240], ['azul', 250], ['roja', 300], ['negra', 260], ['verde', 210],
  ['fuera', 340], ['roja', 270], ['negra', 300], ['azul', 230], ['verde', 200],
];

const BANDS = [];
{
  let z = 0;
  for(const [tipo, L] of PLAN){ BANDS.push({ tipo, z0:z, z1:z - L }); z -= L; }
  K.len = -z;
}

function bandIdx(z){
  if(z >= 0) return 0;
  let i = 0;
  while(i < BANDS.length - 1 && z <= BANDS[i].z1) i++;
  return i;
}
/* Propiedad de zona en z, con las transiciones suavizadas en K.zoneBlend.
   En el borde exacto sale la media de las dos bandas: continuo pero corto. */
function zoneProp(z, key){
  const i = bandIdx(z), b = BANDS[i], B = K.zoneBlend;
  let v = ZONA[b.tipo][key];
  if(i < BANDS.length - 1){
    const d = z - b.z1;
    if(d < B){ const t = 0.5 + 0.5 * smooth(Math.max(0, d) / B); return lerp(ZONA[BANDS[i+1].tipo][key], v, t); }
  }
  if(i > 0){
    const d = b.z0 - z;
    if(d < B){ const t = 0.5 + 0.5 * smooth(Math.max(0, d) / B); return lerp(ZONA[BANDS[i-1].tipo][key], v, t); }
  }
  return v;
}
function zoneAt(z){ return ZONA[BANDS[bandIdx(z)].tipo]; }

/* --- PERFIL DE ALTURA: integral acumulada de la pendiente de cada banda ---
   Se tabula una vez (no depende de la semilla) y se interpola. Así una banda
   negra de 35° está de verdad 210 unidades más abajo que su entrada. */
const HSTEP = 2, HZ0 = 300;
let HTAB = null;
function buildHeights(){
  const n = Math.ceil((HZ0 + K.len + 500) / HSTEP) + 2;
  HTAB = new Float32Array(n);
  let h = 0;
  for(let i = 1; i < n; i++){
    const z = HZ0 - (i - 0.5) * HSTEP;
    h -= Math.tan(zoneProp(z, 'deg') * RAD) * HSTEP;
    HTAB[i] = h;
  }
}
buildHeights();
function baseY(z){
  const f = (HZ0 - z) / HSTEP;
  /* por detrás del arranque de la tabla: sigue subiendo con la 1ª banda */
  if(f <= 0) return (z - HZ0) * Math.tan(ZONA[BANDS[0].tipo].deg * RAD);
  const i = f | 0;
  if(i >= HTAB.length - 1) return HTAB[HTAB.length - 1];
  return lerp(HTAB[i], HTAB[i + 1], f - i);
}

/* semianchura del abanico */
function hwAt(z){
  const t = clamp(-z / K.len, 0, 1);
  return K.hw0 + (K.hw1 - K.hw0) * Math.pow(t, K.hwPow);
}

/* PIELES. `soft`/`hard` son los dos colores entre los que se interpola el
   terreno según la dureza; encima se mezcla el color de la ZONA. */
const SKINS = {
  arena: { sky:0xf3d6a4, sky2:0xbfd8ea, fog:0xe8c187,
           soft:0xf0d3a0, hard:0xb07f42, wall:0xb8834f, wall2:0x8a6039,
           rock:0x8a6f4d, ramp:0xa8672c, part:0xf3e0bb, trail:0xb08a55,
           valley:0xd8ae72, ridge:0xc09a68, sun:0xfff0d0, hemi:0xffe4bc, zmix:0.42 },
  nieve: { sky:0xe8f4ff, sky2:0x9dc4e8, fog:0xd6e7f4,
           soft:0xffffff, hard:0x9fbdd8, wall:0x93a9bb, wall2:0x6f8496,
           rock:0x6d7f8e, ramp:0x7fa8cc, part:0xffffff, trail:0x9fb8cc,
           valley:0xc6dced, ridge:0xa4bcd2, sun:0xffffff, hemi:0xdcecff, zmix:0.34 },
  mar:   { sky:0xa8e8f5, sky2:0x4fb0d8, fog:0x76cde2,
           soft:0x4fc4e0, hard:0x14647f, wall:0x4a6b78, wall2:0x37525d,
           rock:0x40606d, ramp:0xcdf6ff, part:0xeafcff, trail:0x8fe0f0,
           valley:0x2f9fc4, ridge:0x4a8fa8, sun:0xfffbe8, hemi:0xbfeef8, zmix:0.18 },
};
const PAL = SKINS[SKIN] || SKINS.arena;
if(SKIN === 'mar') K.tilt = 7;

const RACER_COL = [0x35c9ff, 0xff5a52, 0x7bf06a, 0xffd23f];

function GAME_RENDERER(){ return (typeof renderer !== 'undefined') ? renderer : null; }
function GAME_KEYS(){ return (typeof keys !== 'undefined') ? keys : null; }

const DESC = window.DESC = {
  on:false, K, TRICKS, ZONA, BANDS,
  scene:null, cam:null, world:null, backdrop:null,
  seed:0, rng:null, noise:null, noiseH:null,
  racers:[], obst:[], buckets:null, picks:null,
  t:0, phase:'countdown', count:3.2,
  finishOrder:[], hud:null, _built:false, _why:{},
  orb:{ yaw:0, pitch:0, idle:9, mx:0, my:0, down:false },
};

const BUCKET = 60;

/* =====================================================================
   TERRENO
   ===================================================================== */
function terrainY(x, z){
  const n = DESC.noise; if(!n) return 0;
  const hw  = hwAt(z);
  const u   = x / hw;
  const cuenco = K.bowl * u * u;                         // los bordes suben
  const big = n(x * K.bumpFreqB, z * K.bumpFreqB) * zoneProp(z, 'bump');
  const sml = n(x * K.bumpFreqS, z * K.bumpFreqS) * K.bumpSmall;
  return baseY(z) + cuenco + big + sml;
}
/* DUREZA 0..1: base de la zona (el fuera pista es nieve profunda) + ruido. */
function hardnessAt(x, z){
  const n = DESC.noiseH; if(!n) return 0.5;
  return clamp(zoneProp(z, 'hard') + n(x * K.hardFreq, z * K.hardFreq) * 0.22, 0, 1);
}
DESC._ty = terrainY;
DESC._hard = hardnessAt;

/* =====================================================================
   PISTA: props repartidos por TODO el abanico, con la densidad de la zona
   ===================================================================== */
function genTrack(rng){
  const obst = [];
  let z = -120;
  let sinceRamp = 0;
  while(z > -(K.len - 70)){
    const hw = hwAt(z) - 12;
    const zn = { rock: zoneProp(z, 'rock'), ramp: zoneProp(z, 'ramp') };
    sinceRamp++;

    /* rampas: en pista, no en el fuera pista */
    if(sinceRamp >= 2 && rng() < 0.42 * zn.ramp){
      sinceRamp = 0;
      const n = 1 + (rng() < 0.5 ? 1 : 0);
      for(let k = 0; k < n; k++){
        const r = rng();
        const size = r < 0.42 ? 's' : (r < 0.80 ? 'm' : 'l');
        const dim  = size === 's' ? { w:7.0, len:11, h:2.4 }
                   : size === 'm' ? { w:8.4, len:15, h:3.8 }
                   :                { w:10.5, len:21, h:6.2 };
        obst.push({ type:'ramp', size, x:(rng()*2-1)*hw, z:z + (rng()-0.5)*20, ...dim });
      }
    }

    /* rocas: el fuera pista está sembrado, la verde casi limpia */
    const nr = Math.floor(rng() * 1.4 + zn.rock * 1.5);
    for(let k = 0; k < nr; k++){
      obst.push({ type:'rock', x:(rng()*2-1)*hw, z:z + (rng()-0.5)*26,
                  r: 2.2 + rng()*1.6 + zn.rock * 1.1 });
    }

    if(rng() < 0.42) obst.push({ type:'pick', x:(rng()*2-1)*hw*0.9, z:z - 12, taken:false });
    z -= 26 + rng() * 16;
  }
  return obst;
}

const ITEMS = {
  turbo: { name:'TURBO', col:0x7bf06a, use(r){ r.dash = K.dashMax; addSpeed(r, 22); } },
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

/* SIN reservar array: esto se llama ~12 veces por corredor y paso fijo
   (120 Hz × 4), y con nearObst() eran 5.000 arrays por segundo a la basura. */
function rampAt(x, z){
  const i0 = Math.floor((-z - 26) / BUCKET), i1 = Math.floor((-z + 26) / BUCKET);
  for(let i = i0; i <= i1; i++){
    const a = DESC.buckets.get(i); if(!a) continue;
    for(let k = 0; k < a.length; k++){
      const o = a[k];
      if(o.type !== 'ramp') continue;
      if(Math.abs(x - o.x) > o.w / 2) continue;
      if(z > o.z + o.len / 2 || z < o.z - o.len / 2) continue;
      return o;
    }
  }
  return null;
}
function rampSurfaceY(o, z){
  return terrainY(o.x, o.z) + ((o.z + o.len/2 - z) / o.len) * o.h;
}
function groundYAt(x, z){
  const t = terrainY(x, z);
  const o = rampAt(x, z);
  return o ? Math.max(t, rampSurfaceY(o, z)) : t;
}
DESC._gy = groundYAt;

/* HUELLA DE LA TABLA: un board mide 4,6 unidades y no cabe en un punto.
   Promediar tres puntos a lo largo de su eje es lo que impide que el rizado
   fino (13 u de longitud de onda) te esté lanzando por los aires a 60 u/s:
   la tabla PUENTEA los baches pequeños, exactamente como en la realidad.
   Sin esto, la detección de despegue por curvatura es una traca. */
function padY(x, z, fx, fz){
  return 0.25 * groundYAt(x - fx*2.0, z - fz*2.0)
       + 0.50 * groundYAt(x, z)
       + 0.25 * groundYAt(x + fx*2.0, z + fz*2.0);
}

/* SUPERFICIE: altura + NORMAL. La normal es la pieza de la que cuelga toda la
   física nueva (gravedad proyectada, agarre, aterrizaje). En una rampa se usa
   su gradiente analítico: con diferencias finitas el labio daría una normal
   disparatada. */
const _N = { y:0, nx:0, ny:1, nz:0, ramp:null };
function surfaceAt(x, z, out){
  out = out || _N;
  const o = rampAt(x, z);
  if(o){
    const ry = rampSurfaceY(o, z), ty = terrainY(x, z);
    if(ry >= ty){
      const g = o.h / o.len;                    // sube hacia -z
      const inv = 1 / Math.sqrt(1 + g * g);
      out.y = ry; out.nx = 0; out.ny = inv; out.nz = g * inv; out.ramp = o;
      return out;
    }
  }
  const e = 2.2;
  const hx = terrainY(x + e, z) - terrainY(x - e, z);
  const hz = terrainY(x, z + e) - terrainY(x, z - e);
  const gx = -hx / (2 * e), gz = -hz / (2 * e);
  const inv = 1 / Math.sqrt(gx * gx + 1 + gz * gz);
  out.y = terrainY(x, z); out.nx = gx * inv; out.ny = inv; out.nz = gz * inv; out.ramp = null;
  return out;
}
/* pendiente en la dirección de la marcha (rad, >0 cuesta abajo) — para cámara e IA */
function slopeAt(x, z){
  const a = groundYAt(x, z), b = groundYAt(x, z - 3);
  return Math.atan2(a - b, 3);
}

/* =====================================================================
   ESCENA
   ===================================================================== */
function buildScene(){
  const sc = new THREE.Scene();
  sc.fog = new THREE.Fog(PAL.fog, 190, 700);

  /* 0,9 + 1,25 = 2,15 de luz: TODO saturaba a blanco y el color de zona no se
     leía (medido en captura: la pista roja salía color arena). */
  sc.add(new THREE.HemisphereLight(PAL.hemi, 0x40404e, 0.52));
  const sun = new THREE.DirectionalLight(PAL.sun, 0.85);
  sun.position.set(-50, 90, 30);
  sc.add(sun);

  /* CIELO con degradado */
  {
    const g = new THREE.SphereGeometry(2600, 20, 14);
    const col = [], pos = g.attributes.position;
    const cTop = new THREE.Color(PAL.sky2), cBot = new THREE.Color(PAL.sky);
    const c = new THREE.Color();
    for(let i = 0; i < pos.count; i++){
      const t = clamp((pos.getY(i) / 2600) * 1.6 + 0.35, 0, 1);
      c.copy(cBot).lerp(cTop, t);
      col.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    const sky = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors:true, side:THREE.BackSide, fog:false }));
    sc.add(sky);
    DESC.sky = sky;
  }

  const world = new THREE.Group();
  world.rotation.x = -K.tilt * RAD;
  sc.add(world);
  DESC.world = world;

  const rng = mulberry32(DESC.seed ^ 0x5a17);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(),
        p = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color();

  /* --- TERRENO: malla en ABANICO (sigue la semianchura, así que la
         resolución cae donde hace falta y no se malgastan vértices) --- */
  {
    const COLS = 62, ROWS = 380;
    const zTop = 160, zBot = -(K.len + 240);
    const OUT = 1.16;                    // se pinta un poco más allá del límite
    const nv = (COLS + 1) * (ROWS + 1);
    const pos = new Float32Array(nv * 3), col = new Float32Array(nv * 3);
    const idx = new Uint32Array(COLS * ROWS * 6);
    const cSoft = new THREE.Color(PAL.soft), cHard = new THREE.Color(PAL.hard), cz = new THREE.Color();
    let vi = 0;
    for(let ri = 0; ri <= ROWS; ri++){
      const z  = zTop + (zBot - zTop) * (ri / ROWS);
      const hw = hwAt(z) * OUT;
      /* zoneProp interpola NÚMEROS y un color en hex NO se puede interpolar
         así (0x22222c entre 0x3fbe63 daría un color que no existe): el tinte
         se toma de la banda dominante y el corte se ve, que es lo que se busca. */
      cz.setHex(zoneAt(z).col);
      for(let ci = 0; ci <= COLS; ci++){
        const u = -1 + 2 * (ci / COLS);
        const x = u * hw;
        const y = terrainY(x, z);
        pos[vi*3] = x; pos[vi*3+1] = y; pos[vi*3+2] = z;
        const h = hardnessAt(x, z);
        c.copy(cSoft).lerp(cHard, h).lerp(cz, PAL.zmix);
        const fuera = Math.abs(u) > 1 / OUT ? 0.68 : 1;      // fuera del límite: apagado
        const shade = (0.90 + 0.10 * h) * fuera;
        col[vi*3] = c.r * shade; col[vi*3+1] = c.g * shade; col[vi*3+2] = c.b * shade;
        vi++;
      }
    }
    let ii = 0;
    for(let ri = 0; ri < ROWS; ri++) for(let ci = 0; ci < COLS; ci++){
      /* OJO AL DEVANADO: con las filas yendo hacia -z y las columnas hacia +x,
         el orden (a,d,b) da la normal MIRANDO AL SUELO → el terreno entero se
         culleaba y la escena parecía "props flotando sobre el telón de fondo".
         Se cazó con un raycast por el centro de pantalla: impactaba a 2.400 u. */
      const a = ri * (COLS + 1) + ci, b = a + 1, d = a + (COLS + 1), e = d + 1;
      idx[ii++] = a; idx[ii++] = b; idx[ii++] = d;
      idx[ii++] = b; idx[ii++] = e; idx[ii++] = d;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors:true }));
    world.add(mesh);
    DESC.terrain = mesh;
  }

  /* --- BORDE DEL ABANICO: rocas siguiendo la semianchura --- */
  {
    const step = 11, n1 = Math.floor((K.len + 300) / step) * 2;
    const im = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading:true }), n1);
    const base = new THREE.Color(PAL.wall);
    let i = 0;
    for(let k = 0; k < n1 / 2; k++){
      const z = 120 - k * step, hw = hwAt(z);
      for(const side of [-1, 1]){
        const r  = 3.4 + rng() * 4.6;
        const x  = side * (hw + r * 0.45 + rng() * 3);
        p.set(x, terrainY(x, z) + r * 0.2 + rng() * 1.4, z + (rng() - 0.5) * 8);
        q.setFromEuler(new THREE.Euler(rng()*3, rng()*3, rng()*3));
        s.set(r, r * (0.75 + rng() * 0.6), r);
        m.compose(p, q, s); im.setMatrixAt(i, m);
        c.copy(base).offsetHSL((rng()-0.5)*0.03, (rng()-0.5)*0.12, (rng()-0.5)*0.16);
        im.setColorAt(i, c); i++;
      }
    }
    im.instanceMatrix.needsUpdate = true;
    if(im.instanceColor) im.instanceColor.needsUpdate = true;
    world.add(im);

    const step2 = 26, nb = Math.floor((K.len + 300) / step2) * 2;
    const im2 = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading:true }), nb);
    const base2 = new THREE.Color(PAL.wall2);
    let j = 0;
    for(let k = 0; k < nb / 2; k++){
      const z = 120 - k * step2, hw = hwAt(z);
      for(const side of [-1, 1]){
        const r = 9 + rng() * 11;
        const x = side * (hw + 30 + rng() * 22);
        p.set(x, terrainY(x, z) + r * 0.1, z + (rng() - 0.5) * 14);
        q.setFromEuler(new THREE.Euler(rng()*3, rng()*3, rng()*3));
        s.set(r, r * (0.9 + rng() * 0.8), r);
        m.compose(p, q, s); im2.setMatrixAt(j, m);
        c.copy(base2).offsetHSL((rng()-0.5)*0.03, (rng()-0.5)*0.10, (rng()-0.5)*0.14);
        im2.setColorAt(j, c); j++;
      }
    }
    im2.instanceMatrix.needsUpdate = true;
    if(im2.instanceColor) im2.instanceColor.needsUpdate = true;
    world.add(im2);
  }

  /* --- JALONES DEL LÍMITE: cada 46 u a los dos lados, para que se LEA dónde
         acaba la pista sin necesidad de muro --- */
  {
    const step = 46, n = Math.floor((K.len + 60) / step) * 2;
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),
      new THREE.MeshLambertMaterial({ color:0xff8a3d }), n);
    let i = 0;
    for(let k = 0; k < n / 2; k++){
      const z = 20 - k * step, hw = hwAt(z);
      for(const side of [-1, 1]){
        const x = side * hw;
        p.set(x, terrainY(x, z) + 2.2, z); q.identity(); s.set(0.42, 4.4, 0.42);
        m.compose(p, q, s); im.setMatrixAt(i++, m);
      }
    }
    im.instanceMatrix.needsUpdate = true; world.add(im);
  }

  /* --- SEÑALIZACIÓN DE ZONA: en cada cambio de banda, una hilera de jalones
         del color de lo que VIENE, de lado a lado. Es la lectura de "de golpe
         entras en negra". --- */
  {
    const filas = [];
    for(let i = 1; i < BANDS.length; i++) filas.push({ z: BANDS[i].z0, col: ZONA[BANDS[i].tipo].col });
    const perFila = 15;
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),
      new THREE.MeshLambertMaterial({ color:0xffffff }), filas.length * perFila);
    let i = 0;
    for(const f of filas){
      const hw = hwAt(f.z);
      c.setHex(f.col);
      for(let k = 0; k < perFila; k++){
        const x = -hw + (2 * hw) * (k / (perFila - 1));
        p.set(x, terrainY(x, f.z) + 3.0, f.z); q.identity(); s.set(0.7, 6.0, 0.7);
        m.compose(p, q, s); im.setMatrixAt(i, m); im.setColorAt(i, c); i++;
      }
    }
    im.instanceMatrix.needsUpdate = true;
    if(im.instanceColor) im.instanceColor.needsUpdate = true;
    world.add(im);
  }

  /* --- OBSTÁCULOS --- */
  const rocks = DESC.obst.filter(o => o.type === 'rock');
  const ramps = DESC.obst.filter(o => o.type === 'ramp');

  if(rocks.length){
    const im = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading:true }), rocks.length);
    const base = new THREE.Color(PAL.rock);
    rocks.forEach((o, i) => {
      o.baseY = terrainY(o.x, o.z);
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

    /* LABIO oscuro + jalones: a distancia lo legible es el CANTO. */
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

  /* --- META: cruza TODO el abanico --- */
  {
    const g = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const hw = hwAt(-K.len);
    const n = 16;
    for(let k = 0; k < n; k++){
      const x = -hw + (2*hw)*(k/(n-1));
      const cc = new THREE.Mesh(new THREE.BoxGeometry(1.8, 16, 1.8), mat);
      cc.position.set(x, terrainY(x, -K.len) + 8, -K.len); g.add(cc);
    }
    const top = new THREE.Mesh(new THREE.BoxGeometry(hw*2, 3.4, 2.2), mat);
    top.position.set(0, terrainY(0, -K.len) + 16, -K.len); g.add(top);
    world.add(g);
  }

  /* --- PAISAJE SÓLO AL FONDO --- */
  {
    const bd = new THREE.Group();
    const valley = new THREE.Mesh(new THREE.PlaneGeometry(9000, 3400),
      new THREE.MeshBasicMaterial({ color: PAL.valley, depthWrite:false, fog:false }));
    valley.position.set(0, -960, -1800);
    bd.add(valley);
    const capas = [
      { z:-1750, y:-820, s:0.8, col:PAL.ridge, n:15 },
      { z:-1580, y:-740, s:0.55, col:PAL.wall2, n:12 },
    ];
    for(const cc of capas){
      const im = new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,4),
        new THREE.MeshBasicMaterial({ color:cc.col, depthWrite:false, fog:false }), cc.n);
      for(let i = 0; i < cc.n; i++){
        const f = i / (cc.n - 1) - 0.5;
        const w = 320 + ((i*37) % 160), h = (220 + ((i*53) % 260)) * cc.s;
        p.set(f*4600 + ((i*71)%110), cc.y + h/2, cc.z);
        q.setFromEuler(new THREE.Euler(0, (i*0.7)%1.5, 0)); s.set(w, h, w);
        m.compose(p, q, s); im.setMatrixAt(i, m);
      }
      im.instanceMatrix.needsUpdate = true; bd.add(im);
    }
    sc.add(bd);
    DESC.backdrop = bd;
  }

  /* --- PARTÍCULAS --- */
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

  /* --- RASTRO DE LA TABLA --- */
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

  /* --- POLVO EN VUELO --- */
  {
    const N = K.streakN;
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.08, 0.08, 1),
      new THREE.MeshBasicMaterial({ color:PAL.part, transparent:true, opacity:0.35,
                                    depthWrite:false, fog:false }), N);
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    im.frustumCulled = false;
    im.renderOrder = 3;
    sc.add(im);
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
    const k = clamp(P.life[i] * 2.2, 0, 1);
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
    const k = clamp(T.life[i] / K.trailLife, 0, 1);
    _v3.set(T.x[i], T.y[i], T.z[i]);
    /* ORDEN 'YXZ' y el giro en Y: con 'ZYX' el ángulo se aplicaba sobre el eje
       Z del MUNDO y ponía cada marca de canto — el rastro salía a escalones. */
    _qt.setFromEuler(_eu.set(-Math.PI/2, -T.rot[i], 0, 'YXZ'));
    _sc3.set(T.w[i] * (0.5 + k*0.5), 4.4, 1);
    _m4.compose(_v3, _qt, _sc3);
    T.im.setMatrixAt(i, _m4);
  }
  T.im.instanceMatrix.needsUpdate = true;
}

/* POLVO EN VUELO: material del stage barriendo la cámara. La LONGITUD de cada
   mota crece con su distancia al eje de la vista (como el desenfoque real):
   motas en el centro, trazos en la periferia. */
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
    const largo = (1.2 + 20 * k * k) * Math.min(1, rad / 26);
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
  g.rotation.order = 'YXZ';
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

  const x0 = (i - 1.5) * 9;
  return {
    i, human, col,
    name: human ? ('P' + (i + 1)) : ('CPU-' + 'ABC'[Math.max(0, i - HUMANS)]),
    gfx:g, body, board, meteor, shadow:sh,
    padIndex: human ? (HUMANS === 1 ? 0 : i) : -1,
    kb: human && i === 0,
    x:x0, y:terrainY(x0, 0), z:0,
    /* velocidad VECTORIAL en el plano + vertical */
    vx:0, vz:0, vy:0, spd:0,
    yaw:0,                       // hacia dónde apunta el board (0 = máxima pendiente)
    slip:0, skid:0, nForce:1, sink:0, _trailAcc:0, _vT:NaN,
    air:false, airVy0:0, fall:0, crash:0, crashN:0, crashT:0, charge:0,
    trick:null, trickT:0, combo:0,
    dash:K.dashMax, turbo:false,
    atk:0, atkCd:0, grabCd:0, grabbed:0, grabbedBy:null,
    item:null,
    pts:0, tricks:0, falls:0, crashes:0,
    done:false, place:0, time:0,
    _inp:null, _ai:{ targetMul:1, plan:null, tx:0 },
  };
}

/* sumar velocidad en la dirección del board (turbos, objetos, ataque) */
function addSpeed(r, v){
  r.vx += Math.sin(r.yaw) * v;
  r.vz += -Math.cos(r.yaw) * v;
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
  o.ax = clamp(o.ax, -1, 1);
  return o;
}

/* IA: elige un objetivo lateral y GIRA hacia él (ya no empuja una x). */
function aiInput(r, dt){
  const o = { ax:0, jump:false, turbo:false, atk:false, grab:false, item:false, trick:null };
  const skill = K.aiSkill[Math.min(K.aiSkill.length-1, Math.max(0, r.i - HUMANS))] || 0.85;
  const lead = DESC.racers.find(q => q.human) || DESC.racers[0];
  const gap = r.z - lead.z;
  let band = clamp(gap / 100, -1, 1);
  if(Math.abs(gap) > K.aiMaxGap) band = Math.sign(gap) * 2.4;
  r._ai.targetMul = 1 + band * K.aiBand;

  if(r.air){
    if(!r.trick && r._ai.plan !== 'done'){
      const gy = groundYAt(r.x, r.z);
      const tAir = (r.vy + Math.sqrt(Math.max(0, r.vy*r.vy + 2*K.grav*Math.max(0.01, r.y - gy)))) / K.grav;
      const margen = 1.18 - skill * 0.16;
      let best = null;
      for(const k in TRICKS) if(TRICKS[k].dur*margen <= tAir && (!best || TRICKS[k].pts > TRICKS[best].pts)) best = k;
      if(best && skill > 0.7) o.trick = best;
      r._ai.plan = 'done';
    }
    /* en el aire endereza el board: aterrizar de lado te tumba */
    o.ax = clamp(-r.yaw * 2.2, -1, 1);
    return o;
  }
  r._ai.plan = null;

  const hw = hwAt(r.z) - 10;
  const ahead = nearObst(r.z - K.aiLook/2, K.aiLook);
  let danger = null, dz = 1e9, tx = clamp(r._ai.tx, -hw, hw);

  /* En un abanico abierto no vale comparar la roca con MI X DE AHORA: para
     cuando llegue estaré en otro sitio. Se compara con la x PREVISTA. */
  const vz = Math.max(12, Math.abs(r.vz));
  for(const ob of ahead){
    const d = r.z - ob.z;
    if(d < 2 || d > K.aiLook || ob.type === 'ramp' || ob.type === 'pick') continue;
    const px = r.x + r.vx * (d / vz);
    if(Math.abs(ob.x - px) > ob.r + 3.4) continue;
    if(d < dz){ dz = d; danger = ob; }
  }
  if(danger){
    tx = danger.x + (r.x >= danger.x ? 1 : -1) * (danger.r + 7);
  } else {
    let best = null, bd = 1e9;
    for(const ob of ahead){
      if(ob.type !== 'ramp') continue;
      const d = r.z - ob.z;
      if(d > 6 && d < K.aiLook && d < bd){ bd = d; best = ob; }
    }
    if(best && skill > 0.78) tx = best.x;
    else if(Math.abs(r.x) > hw * 0.72) tx = r.x * 0.55;   // solo si se sale
    else tx = r.x;                    // MANTENER LA LÍNEA: barrer la ladera en
                                      // diagonal cuesta velocidad de verdad
                                      // (medido: la IA bajaba a 21 u/s con la
                                      // física dando 40)
  }
  /* rivales: son obstáculos que se mueven. Sin esto, 16 choques por carrera. */
  for(const q of DESC.racers){
    if(q === r || q.done) continue;
    const d = r.z - q.z;
    if(d < 1 || d > 30) continue;
    if(Math.abs(q.x - r.x) < 5.5) tx = r.x + (r.x >= q.x ? 6.5 : -6.5);
  }
  tx = clamp(tx, -hw, hw);
  r._ai.tx = tx;

  /* yaw deseado para llegar a tx dentro de la distancia de anticipación.
     Si va lento, lo único sensato es apuntar cuesta abajo y coger velocidad. */
  const wantYaw = r.spd < 13 ? 0
                : clamp(Math.atan2(tx - r.x, Math.max(20, K.aiLook * 0.7)), -1.1, 1.1);
  /* sin bajar la ganancia (y sin zona muerta) la IA sobregira, derrapa y se
     frena sola: la corrección constante es lo que la dejaba a media velocidad */
  const err = wantYaw - r.yaw;
  o.ax = Math.abs(err) < 0.045 ? 0 : clamp(err * (1.1 + skill * 0.5), -1, 1);

  const s = surfaceAt(r.x, r.z);
  if(s.ramp && skill > 0.75) o.jump = true;                 // carga el ollie en la rampa
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
/* `por` no es decoración: sin contar POR QUÉ se choca, afinar es adivinar.
   DESC._why lo dice en cualquier momento (roca / aterrizaje / plancha / borde / rival). */
function crash(r, por){
  if(r.fall > 0 || r.crash > 0) return;
  DESC._why[por || 'otro'] = (DESC._why[por || 'otro'] || 0) + 1;
  r.crashes++;
  r.crashN = (DESC.t - r.crashT < K.crashWindow) ? r.crashN + 1 : 1;
  r.crashT = DESC.t;
  if(r.crashN >= K.crashChain){ fall(r); return; }
  r.crash = K.crashTime;
  r.vx *= K.crashMul; r.vz *= K.crashMul;
  spray(r, 22, 3.2);
}
function fall(r){
  if(r.fall > 0) return;
  r.falls++; r.fall = K.fallTime;
  r.vx = 0; r.vz = 0; r.vy = 0; r.air = false; r.charge = 0;
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
   SIMULACIÓN — paso fijo (K.fixed)
   ===================================================================== */
const _srf = { y:0, nx:0, ny:1, nz:0, ramp:null };

function stepRacer(r, dt){
  if(r.done) return;
  const inp = r._inp || { ax:0, jump:false, turbo:false, atk:false, grab:false, item:false, trick:null };

  /* --- caído: se desliza sin control --- */
  if(r.fall > 0){
    r.fall -= dt;
    r.body.rotation.set(-1.35, 0, Math.sin(DESC.t*7)*0.12);
    r.x += r.vx*dt; r.z += r.vz*dt;
    r.vx *= 0.94; r.vz *= 0.94;
    r.y = groundYAt(r.x, r.z);
    r.spd = Math.hypot(r.vx, r.vz);
    r.gfx.position.set(r.x, r.y, r.z);
    r.gfx.rotation.y = -r.yaw;
    r.shadow.position.set(r.x, r.y + 0.07, r.z);
    if(r.fall <= 0) r.body.rotation.set(0,0,0);
    return;
  }

  if(r.crash > 0){
    r.crash -= dt;
    inp.ax = 0; inp.turbo = false; inp.trick = null;
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

  /* ---------- GIRO DEL BOARD ----------
     El giro es del BOARD, no de la velocidad: la velocidad le sigue (o no)
     según el agarre. Y el board no puede apuntar cuesta arriba: ±88° es el
     límite de 180° de la pista. */
  const kSpd = clamp(r.spd / 90, 0, 1);
  const turn = (r.air ? K.airTurn : lerp(K.turnLow, K.turnHigh, kSpd));
  r.yaw = clamp(r.yaw + inp.ax * turn * dt, -K.yawLimit, K.yawLimit);
  const fx = Math.sin(r.yaw), fz = -Math.cos(r.yaw);       // eje largo del board
  const rx = Math.cos(r.yaw), rz = Math.sin(r.yaw);        // eje transversal

  const hard = hardnessAt(r.x, r.z);
  const srf  = surfaceAt(r.x, r.z, _srf);

  if(!r.air){
    /* ---------- GRAVEDAD PROYECTADA EN EL PLANO ----------
       G - (G·n)n. De aquí sale todo: la velocidad terminal, que una
       hondonada acelere y que atravesar la ladera te pare. */
    let ax = K.grav * srf.ny * srf.nx;
    let az = K.grav * srf.ny * srf.nz;

    /* ---------- MODELO DE CANTO ----------
       Descompongo la velocidad en el eje del board y en el transversal.
       Lo transversal se lo come el canto... hasta el tope de agarre. */
    const vF =  r.vx*fx + r.vz*fz;
    const vR =  r.vx*rx + r.vz*rz;
    r.slip = Math.abs(vR);

    /* el canto solo agarra si hay velocidad: es lo que impide quedarse
       clavado en diagonal y lo que hace que se pueda "derrapar de lado" */
    const gripFade = clamp(r.spd / K.gripLowV, K.gripLowMin, 1);
    const gripMax = K.grip * r.nForce * lerp(K.gripSoft, 1, hard) * gripFade;
    const need    = Math.abs(vR) / dt;                    // lo que haría falta para no derrapar
    const aR      = -Math.sign(vR) * Math.min(need, gripMax);
    r.skid = Math.max(0, need - gripMax) * dt;            // cuánto se escapa: eso es derrapar

    ax += aR * rx; az += aR * rz;

    /* ---------- ROZAMIENTOS (siempre CONTRA la velocidad, no contra el
       eje del board: si no, a poca velocidad el signo baila y tiembla) ----------
       aerodinámico (v²) + seco del material + el precio de tallar (la fuerza
       de canto cuesta energía) + el raspón del derrape. */
    const dragMul = K.dragSoft + (K.dragHard - K.dragSoft) * hard;
    let aFric = K.dragC * r.spd * r.spd * dragMul
              + K.muBase * r.nForce * (1.6 - hard)
              + Math.abs(aR) * K.carveDrag
              + (r.skid / dt) * K.skidDrag;
    if(r.grabbed > 0) aFric += 8;
    const vm = Math.hypot(r.vx, r.vz);
    if(vm > 0.01){
      const f = Math.min(aFric, vm / dt) / vm;          // nunca te empuja hacia atrás
      ax -= r.vx * f; az -= r.vz * f;
    }
    /* el empuje del turbo sí va por el eje del board */
    let push = r.turbo ? K.turboThrust : 0;
    push *= (r._ai.targetMul || 1);
    ax += push * fx; az += push * fz;
    /* goma elástica de la IA: sobre la gravedad, no sobre el rozamiento */
    if(r._ai.targetMul && r._ai.targetMul !== 1 && !r.human){
      const g = (r._ai.targetMul - 1) * 9;
      ax += g * fx; az += g * fz;
    }

    r.vx += ax * dt; r.vz += az * dt;
    if(vF < 0){ r.vx *= 0.94; r.vz *= 0.94; }           // marcha atrás: no interesa
  } else {
    /* en el aire NO hay canto ni material, pero SÍ hay aire: a 100 u/s es la
       fuerza que manda. Se aplica a los tres ejes contra el vector velocidad. */
    const v3 = Math.hypot(r.vx, r.vy, r.vz);
    if(v3 > 0.01){
      const f = K.dragC * K.dragAir * v3;
      r.vx -= r.vx * f * dt; r.vz -= r.vz * f * dt; r.vy -= r.vy * f * dt;
    }
    r.vy -= K.grav * dt;
    r.y  += r.vy * dt;
  }

  /* GIRO POR GRAVEDAD: a poca velocidad el morro cae solo hacia la línea de
     máxima pendiente (el peso tira de la punta). Es la salida natural del
     callejón de arriba y además hace que arrancar se sienta bien. */
  if(!r.air && r.fall <= 0){
    const w = 1 - clamp(r.spd / 25, 0, 1);
    r.yaw -= Math.sin(r.yaw) * K.fallTurn * w * dt;
  }

  r.x += r.vx * dt; r.z += r.vz * dt;
  r.spd = Math.hypot(r.vx, r.vz);

  /* ---------- SEGUIR EL SUELO / DESPEGAR SOLO ----------
     vT = velocidad vertical que exige el terreno bajo mis pies. Si el terreno
     cae MÁS rápido de lo que la gravedad me puede bajar, despego. Es lo que
     hace que un lomo o el labio de una rampa lancen sin impulso escrito. */
  if(!r.air){
    const gy = padY(r.x, r.z, fx, fz);
    const vT = (gy - r.y) / dt;
    /* PRIMER paso tras tocar suelo: no hay _vT anterior con el que comparar.
       Dejarlo a 0 hacía que aT saliera -5.000 y te RELANZABA al frame
       siguiente: medido, se pasaba el 69% de la bajada volando. */
    const primero = !isFinite(r._vT);
    const aT = primero ? 0 : (vT - r._vT) / dt;
    /* la normal se suaviza: en crudo pega saltos de ±300 con cualquier grano
       del terreno y el agarre parpadearía */
    r.nForce = lerp(r.nForce, clamp((K.grav + aT) / K.grav, 0, K.nMax), 0.25);
    if(!primero && aT < -K.grav * K.airThr && vT < -K.airMin){
      r.air = true;
      r.vy = r._vT + (r.charge > 0 ? K.olliePop * (r.charge / K.ollieChg) : 0);
      r.airVy0 = r.vy; r.charge = 0;
      if(r.vy > 3) spray(r, 8, 2.4);
    } else {
      r.y = gy;
      r._vT = vT;
    }
  }

  /* ---------- OLLIE: mantener carga, soltar salta ---------- */
  if(!r.air && r.crash <= 0){
    if(inp.jump){ r.charge = Math.min(K.ollieChg, r.charge + dt); }
    else if(r.charge > 0){
      r.air = true;
      r.vy = lerp(K.ollieMin, K.ollieMax, r.charge / K.ollieChg);
      r.airVy0 = r.vy; r.charge = 0;
      spray(r, 8, 2.2);
    }
  }

  /* ataque */
  r.atkCd = Math.max(0, r.atkCd - dt);
  if(inp.atk && r.atkCd <= 0 && r.crash <= 0 && r.atk <= 0){
    r.atk = K.atkTime; r.atkCd = K.atkCd; addSpeed(r, K.atkSpeed); r.meteor.visible = true;
  }
  if(r.atk > 0){
    r.atk -= dt;
    const k = Math.max(0, r.atk / K.atkTime);
    r.meteor.material.opacity = 0.20 + 0.55*k;
    r.meteor.scale.setScalar(1 + (1-k)*0.8);
    if(Math.random() < 0.5) emit(r.x + (Math.random()-0.5)*1.6, r.y + 1 + Math.random()*1.6, r.z + 1.5,
                                 (Math.random()-0.5)*6, Math.random()*5, 14 + Math.random()*10, 0.3);
    for(const q of DESC.racers){
      if(q === r || q.done || q.fall > 0) continue;
      if(Math.abs(q.z-r.z) < 4.5 && Math.abs(q.x-r.x) < 4.5){
        const s = Math.sign(q.x - r.x || 1);
        q.vx += s * K.atkPush; crash(q, 'rival'); r.pts += K.atkPts;
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

  /* ---------- LÍMITE DEL ABANICO ----------
     No hay muro: el cuenco ya te empuja al centro. Esto es solo el tope duro. */
  const lim = hwAt(r.z) - 1.5;
  if(Math.abs(r.x) > lim){
    r.x = Math.sign(r.x) * lim;
    const vn = r.vx;
    r.vx = -vn * 0.25;
    if(Math.abs(vn) > 12) crash(r, 'borde');
  }

  /* ---------- AIRE: trucos y ATERRIZAJE POR ABSORCIÓN ---------- */
  if(r.air){
    /* los saltitos de chatter (medio metro sobre un lomo) NO son un salto:
       si dejas encadenar trucos ahí, el aterrizaje a medias te tumba sin que
       el jugador entienda por qué */
    if(inp.trick && !r.trick && TRICKS[inp.trick] && r.airVy0 > 5){ r.trick = inp.trick; r.trickT = 0; }
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
    const gy = padY(r.x, r.z, fx, fz);
    if(r.y <= gy){
      r.y = gy;
      r.air = false;
      const sf = surfaceAt(r.x, r.z, _srf);
      /* velocidad 3D contra la normal: solo se pierde la componente NORMAL.
         Caer en plano seca; caer en una pared de 40° casi no cuesta. */
      const vdotn = r.vx*sf.nx + r.vy*sf.ny + r.vz*sf.nz;
      const impacto = Math.abs(Math.min(0, vdotn));
      r.vx -= vdotn * sf.nx;
      r.vz -= vdotn * sf.nz;
      r.vy = 0;
      r._vT = NaN;                       // sin referencia previa: ver `primero`
      r.spd = Math.hypot(r.vx, r.vz);
      /* desalineación board/velocidad al tocar */
      const vAng = r.spd > 4 ? Math.abs(Math.atan2(r.vx*Math.cos(r.yaw) + r.vz*Math.sin(r.yaw),
                                                    r.vx*Math.sin(r.yaw) - r.vz*Math.cos(r.yaw))) : 0;
      spray(r, 6 + Math.round(impacto*0.5), 2.0 + impacto*0.08);
      if(r.trick) fall(r);
      else if(impacto > K.landHard) crash(r, 'aterrizaje');
      else if(vAng > K.landSlip && r.spd > 26) crash(r, 'plancha');
      else r.combo = 0;
    }
  }

  /* ---------- rastro y polvo en el suelo ---------- */
  if(!r.air && r.fall <= 0){
    const carve = clamp(r.slip / 16, 0, 1);
    r._trailAcc += r.spd * dt;
    if(r._trailAcc >= K.trailEvery){
      r._trailAcc = 0;
      dropTrail(r.x, r.z, r.yaw, 1.7 + carve*1.8);
    }
    if(Math.random() < 0.10 + carve*0.9 + (r.spd/90)*0.3){
      const s2 = Math.sign(r.vx*Math.cos(r.yaw) + r.vz*Math.sin(r.yaw)) || 1;
      emit(r.x - Math.cos(r.yaw)*s2*0.9, r.y + 0.25, r.z - Math.sin(r.yaw)*s2*0.9,
           -r.vx*0.15 + (Math.random()-0.5)*3, 1.5 + Math.random()*3.5 + carve*7,
           -r.vz*0.15 + (Math.random()-0.5)*3, 0.16 + Math.random()*0.22 + carve*0.26);
    }
  }

  /* obstáculos */
  if(r.crash <= 0 && r.fall <= 0){
    for(const o of nearObst(r.z, 18)){
      if(o.type === 'rock'){
        if(r.y > (o.baseY||0) + o.r*1.05) continue;
        if(Math.abs(o.z-r.z) < o.r+1.6 && Math.abs(o.x-r.x) < o.r+1.2) crash(r, 'roca');
      } else if(o.type === 'pick' && !o.taken){
        if(Math.abs(o.z-r.z) < 3.4 && Math.abs(o.x-r.x) < 3.4 && r.y - terrainY(r.x,r.z) < 4.6){
          o.taken = true; if(o._m) o._m.visible = false;
          r.item = ITEM_KEYS[(Math.random()*ITEM_KEYS.length)|0];
        }
      }
    }
    for(const q of DESC.racers){
      if(q === r || q.done || q.fall > 0) continue;
      if(Math.abs(q.z-r.z) < 2.6 && Math.abs(q.x-r.x) < 2.2 && Math.abs(q.y-r.y) < 2){
        const s = Math.sign(r.x - q.x || 1);
        r.vx += s*10; q.vx -= s*10; crash(r, 'rival'); crash(q, 'rival');
      }
    }
  }

  if(r.z <= -K.len && !r.done){
    r.done = true; r.time = DESC.t;
    DESC.finishOrder.push(r); r.place = DESC.finishOrder.length;
    r.pts += K.ptsPos[Math.min(K.ptsPos.length-1, r.place-1)];
  }

  /* ---------- gráficos ---------- */
  r.sink = r.air ? 0 : K.sinkMax * (1 - hard) * (0.5 + clamp(r.slip/16,0,1)*0.5) * clamp(r.nForce,0.4,2);
  r.gfx.position.set(r.x, r.y - r.sink + (r.charge>0 ? -0.25*(r.charge/K.ollieChg) : 0), r.z);
  r.gfx.rotation.y = -r.yaw;
  if(r.crash <= 0 && r.fall <= 0 && !r.trick){
    /* el cuerpo se alinea con la pendiente en el eje del board y se tumba
       hacia dentro de la curva tanto como fuerza esté haciendo el canto */
    const pitch = Math.asin(clamp(-(srf.nx*fx + srf.nz*fz), -1, 1));
    const roll  = clamp((r.vx*rx + r.vz*rz) / 18, -1, 1);
    /* el signo: `pitch` sale NEGATIVO cuesta abajo, y restarlo levantaba el
       morro 28° — la tabla se veía de canto detrás del muñeco. */
    r.body.rotation.set((r.air ? -0.14 : 0.04) + pitch*0.8, 0, -roll*0.7);
  }
  const gyS = groundYAt(r.x, r.z);
  r.shadow.position.set(r.x, gyS + 0.07, r.z);
  const h = Math.max(0, r.y - gyS);
  r.shadow.material.opacity = 0.30 / (1 + h*0.11);
  r.shadow.scale.setScalar(1 / (1 + h*0.045));
  if(r._lastTrickT > 0) r._lastTrickT -= dt;
}

function leash(){
  const hum = DESC.racers.filter(r => r.human && !r.done);
  if(hum.length < 2) return;
  let anchor = 0; for(const r of hum) anchor += r.z; anchor /= hum.length;
  for(const r of hum){
    if(r.z > anchor + K.leash){ r.z = anchor + K.leash; }
    if(r.z < anchor - K.leash) r.z = anchor - K.leash;
  }
}

/* =====================================================================
   CÁMARA — detrás del BOARD, orbitable
   ===================================================================== */
const _camPos = new THREE.Vector3(), _camLook = new THREE.Vector3();
let _camInit = false;

function orbitInput(dt){
  const o = DESC.orb, kk = GAME_KEYS() || {};
  let dy = 0, dp = 0, tocado = false;
  if(kk['KeyQ']) dy -= 1;
  if(kk['KeyE']) dy += 1;
  if(navigator.getGamepads){
    const gp = navigator.getGamepads(), pad = gp && gp[0];
    if(pad){
      const rx = pad.axes[2] || 0, ry = pad.axes[3] || 0;
      if(Math.abs(rx) > 0.2) dy += rx;
      if(Math.abs(ry) > 0.2) dp += ry;
    }
  }
  if(dy || dp) tocado = true;
  o.yaw   += dy * K.orbSpeed * dt;
  o.pitch += dp * K.orbSpeed * 0.6 * dt;
  if(o.mx || o.my){                        // arrastre de ratón acumulado
    o.yaw   += o.mx * K.orbMouse;
    o.pitch -= o.my * K.orbMouse;
    o.mx = o.my = 0; tocado = true;
  }
  o.idle = tocado ? 0 : o.idle + dt;
  if(o.idle > K.orbHold){                  // vuelve sola detrás
    const k = Math.min(1, K.orbBack * dt);
    o.yaw   -= o.yaw * k;
    o.pitch -= o.pitch * k;
  }
  o.yaw = ((o.yaw + Math.PI) % TAU + TAU) % TAU - Math.PI;
  o.pitch = clamp(o.pitch, K.orbPitchMin, K.orbPitchMax);
}

function stepCamera(dt){
  const hum = DESC.racers.filter(r => r.human);
  const r = hum[0] || DESC.racers[0];
  if(!r) return;
  orbitInput(dt);

  let fast = r.spd;
  for(const q of hum) fast = Math.max(fast, q.spd);
  const k = clamp((fast - 22) / 62, 0, 1);
  DESC._spdK = k;

  /* mira por delante en la dirección DEL BOARD (no del eje Z) */
  const rfx = Math.sin(r.yaw), rfz = -Math.cos(r.yaw);
  const lx = r.x + rfx * K.camLookAhead, lz = r.z + rfz * K.camLookAhead;
  _camLook.set(lx, lerp(r.y, groundYAt(lx, lz), K.camLookMix) + K.camLookY, lz);

  const o = DESC.orb;
  const yawW = r.yaw + o.yaw;
  const fx = Math.sin(yawW), fz = -Math.cos(yawW);
  /* el picado hereda la pendiente MEDIA de lo que viene (no la del bache que
     pisas), con tope: la órbita del jugador se suma DESPUÉS del tope. */
  const B = K.camSlopeBase;
  const sl = Math.atan2(groundYAt(r.x, r.z) - groundYAt(r.x + rfx*B, r.z + rfz*B), B);
  const p = clamp(K.camPitch * RAD + sl * K.camSlopeK, K.camPitchMin, K.camPitchMax) + o.pitch;
  const dist = K.camDist + K.camDistFast * k;
  const set = d => _camPos.set(_camLook.x - fx * Math.cos(p) * d,
                               _camLook.y + Math.sin(p) * d,
                               _camLook.z - fz * Math.cos(p) * d);
  set(dist);
  /* En una pared de 42° la cámara "detrás" cae DENTRO de la montaña. Antes de
     subirla (que la vuelve cenital), se ACERCA: encuadra mejor y es lo que
     hacen los juegos de tabla en terreno vertical. */
  let gmin = groundYAt(_camPos.x, _camPos.z) + K.camMinH;
  if(_camPos.y < gmin){ set(dist * 0.62); gmin = groundYAt(_camPos.x, _camPos.z) + K.camMinH; }
  if(_camPos.y < gmin) _camPos.y = gmin;

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
    '<div id="dZone" style="position:absolute;top:44px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;letter-spacing:1px;opacity:0"></div>' +
    '<div id="dLeft" style="position:absolute;top:14px;left:16px;background:rgba(6,10,20,.5);padding:9px 13px;border-radius:9px"></div>' +
    '<div id="dRight" style="position:absolute;top:14px;right:16px;background:rgba(6,10,20,.5);padding:9px 13px;border-radius:9px;text-align:right"></div>' +
    '<div id="dTrick" style="position:absolute;top:31%;left:50%;transform:translate(-50%,-50%);font-size:34px;font-weight:900;opacity:0;color:#ffe14d"></div>' +
    '<div id="dBig" style="position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);font-size:84px;font-weight:900;letter-spacing:-2px"></div>' +
    '<div id="dBar" style="position:absolute;left:50%;bottom:22px;transform:translateX(-50%);width:min(620px,72vw);height:9px;background:rgba(0,0,0,.42);border-radius:6px;overflow:hidden">' +
      '<div id="dFill" style="height:100%;width:0;background:#fff;border-radius:6px"></div></div>' +
    '<div id="dHelp" style="position:absolute;left:16px;bottom:14px;opacity:.5;font-size:11px;line-height:1.5">' +
      'A/D girar · ESPACIO mantener=cargar ollie, soltar=saltar · SHIFT turbo · J meteorito · L agarrar/contra · U objeto<br>' +
      'CÁMARA: stick derecho / Q / E / arrastrar ratón · TRUCOS: 1 Indy · 2 mortal atrás · 3 adelante · 4 360 · 5 DOBLE · 6 Superman<br>' +
      'R reiniciar · T semilla nueva · <b>DESC.K</b></div>';
  document.body.appendChild(d);
  DESC.hud = { root:d, top:d.querySelector('#dTop'), left:d.querySelector('#dLeft'),
    right:d.querySelector('#dRight'), big:d.querySelector('#dBig'), fill:d.querySelector('#dFill'),
    vig:d.querySelector('#dVig'), trick:d.querySelector('#dTrick'), zone:d.querySelector('#dZone') };
}

function updateHud(dt){
  const h = DESC.hud; if(!h) return;
  const me = DESC.racers[0];
  const order = DESC.racers.slice().sort((a,b) => a.z - b.z);
  const place = order.indexOf(me) + 1;
  const k = DESC._spdK || 0;
  const hard = hardnessAt(me.x, me.z);

  /* aviso de zona: aparece al ENTRAR en una banda nueva */
  const zn = zoneAt(me.z);
  if(zn !== DESC._zn){ DESC._zn = zn; DESC._znT = 2.2; }
  if(DESC._znT > 0){
    DESC._znT -= dt;
    h.zone.textContent = zn.nombre;
    h.zone.style.color = '#' + zn.col.toString(16).padStart(6,'0');
    h.zone.style.webkitTextStroke = '1px rgba(255,255,255,.55)';
    h.zone.style.opacity = Math.min(1, DESC._znT).toFixed(2);
  } else h.zone.style.opacity = 0;

  h.vig.style.opacity = (k*0.8).toFixed(2);

  const tb = Math.ceil(me.dash / K.dashMax * 6);
  const ch = Math.round(me.charge / K.ollieChg * 6);
  h.left.innerHTML =
    '<div style="font-size:26px;font-weight:900;line-height:1">' + place + 'º</div>' +
    '<div style="font-size:18px;font-weight:800;color:' + (me.turbo ? '#ffd23f' : '#fff') + '">' +
      Math.round(me.spd*2.6) + ' km/h</div>' +
    '<div style="opacity:.8">turbo ' + '▮'.repeat(tb) + '▯'.repeat(6-tb) + '</div>' +
    (me.charge > 0 ? '<div style="color:#7bf06a">ollie ' + '▮'.repeat(ch) + '▯'.repeat(6-ch) + '</div>' : '') +
    '<div style="opacity:.7">suelo ' + (hard > 0.62 ? '<b style="color:#7bf06a">DURO</b>'
      : hard < 0.38 ? '<b style="color:#ff8a3d">PROFUNDO</b>' : 'normal') +
      (me.skid > 0.02 ? ' · <b style="color:#ff8a3d">DERRAPE</b>' : '') + '</div>' +
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
  DESC.finishOrder = []; _camInit = false; DESC._acc = 0; DESC._why = {};
  DESC.orb.yaw = DESC.orb.pitch = 0; DESC.orb.idle = 9;
  DESC._zn = null; DESC._znT = 0;
  console.log('[descenso] semilla=' + seed + ' · ' + DESC.obst.length + ' props · piel=' + SKIN +
              ' · ' + BANDS.length + ' bandas · ' + Math.round(K.len) + ' u · desnivel ' +
              Math.round(-baseY(-K.len)) + ' u');
}
DESC._start = start;

DESC.tick = function(dt){
  if(!DESC.scene) return;
  dt = Math.min(0.05, dt);

  if(DESC.phase === 'countdown'){
    DESC.count -= dt;
    if(DESC.count <= 0) DESC.phase = 'race';
  } else if(DESC.phase === 'race'){
    /* input UNA vez por frame (leer el gamepad 120 veces sería absurdo) */
    for(const r of DESC.racers) r._inp = (r.human && !r.aiDrive) ? readDesc(r) : aiInput(r, dt);

    /* PASO FIJO: estabilidad del modelo de canto y determinismo para el online */
    DESC._acc += dt;
    let guard = 0;
    while(DESC._acc >= K.fixed && guard++ < 12){
      DESC._acc -= K.fixed;
      DESC.t += K.fixed;
      for(const r of DESC.racers) stepRacer(r, K.fixed);
      leash();
    }
    if(guard >= 12) DESC._acc = 0;

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
  updateHud(dt);
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
/* ratón: arrastrar = orbitar la cámara */
addEventListener('mousedown', () => { if(DESC.on) DESC.orb.down = true; });
addEventListener('mouseup',   () => { DESC.orb.down = false; });
addEventListener('mousemove', e => {
  if(!DESC.on || !DESC.orb.down) return;
  DESC.orb.mx += e.movementX || 0;
  DESC.orb.my += e.movementY || 0;
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
