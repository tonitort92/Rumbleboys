/* =====================================================================
   ►CUADRIMANIA — minijuego "Hexagonia" con losetas CUADRADAS  ·  v2

   Se entra con:  rumble_arena_cinta_v4.html?cuadrimania
   Sin esa query, este fichero sale en su primera linea (coste cero).

   ---------------------------------------------------------------------
   QUE ES
   Una TORRE vertical de losetas cuadradas en rejilla. Pisas una, blanquea,
   se hunde, REBOTA y cae a la lava — y no vuelve. Vas bajando de piso
   segun se te acaba el suelo. Gana el ultimo en pie.

   ---------------------------------------------------------------------
   POR QUE NO ES OTRO descenso.js

   descenso.js se queda el frame entero y monta ESCENA, CAMARA y
   corredores PROPIOS: aislamiento total, pero pierde el juego de verdad.
   Aqui Toni pidio justo lo contrario — que sigan contando el % de dano,
   el empujon, el ataque basico y los esqueletos. Asi que esto NO es un
   mundo aparte: es una PARTIDA DE RUMBLEBOYS en un escenario nuevo. Es el
   STAGE 13, fuera de CAMPAIGN_STAGES (suelto), y todo lo de
   combate/vidas/IA sale gratis del motor.

   El precedente ya estaba en el repo: EL POZO (stage 6) es un nivel
   VERTICAL con la cinta congelada, tubo y lava. Esto es el Pozo del
   reves: alli se trepa huyendo de la lava, aqui se desciende hacia ella.

   ---------------------------------------------------------------------
   v1 ERA "PENTAGONICO" Y SE CAYO. Las dos razones, que valen como reglas:

   1) LA FORMA. Se partia una rejilla hexagonal en 3 pentagonos en
      molinillo (correcto: el pentagono REGULAR no tesela el plano, 5x108
      no cierran los 360). Matematicamente bonito y a Toni le parecio
      "una basura" en pantalla. Su propuesta, que es la buena: CUADRADOS
      en rejilla. Se lee de un vistazo donde pisas y donde falta suelo,
      que es LO UNICO que hay que ver en este juego.

   2) EL FONDO. Le puse cuatro paredes de glifos formando una caja... que
      es EXACTAMENTE lo que el ya habia rechazado en el stage 5 real (ver
      el comentario S5FIX2 en el HTML: "el horizonte lo has hecho como una
      caja que encierra la cinta y no me gusta"). Ahora el decorado es
      literalmente el del stage: `enableS5Scenery(true)` monta la CAMARA
      de verdad — mar de lava + CILINDRO ADITIVO de glifos visto por
      dentro (sin paredes solidas) + luz de relleno + brasas + humo.
      Leccion: antes de inventar un fondo, mirar si el stage ya lo tiene.

   Ventaja tecnica de los cuadrados: la rejilla va alineada a los ejes, o
   sea que el AABB de la plataforma ES la loseta. El pentagono obligaba a
   ensenarle a groundAt un test de poligono (con AABB no habia manera:
   inscrito dejaba rendijas por las que te colabas andando, y envolvente
   se solapaba con la vecina y tapaba su agujero). Con cuadrados, cero
   parches en la colision del juego.

   ---------------------------------------------------------------------
   AFINADO EN VIVO:  CUAD.K   (y CUAD.rebuild() para reconstruir)
   ===================================================================== */
(function(){
'use strict';
/* ►SE DEFINE SIEMPRE, PERO NO ARRANCA SOLO. Mismo motivo que en arena.js: sin
   `?cuadrimania` no existia `window.CUAD`, y `applyStageTheme(13)` lo llama —
   la excepcion se comia el resto del tema y el STAGE 13 salia a medias dentro
   de la campana. Del parametro solo cuelga el ARRANQUE AUTOMATICO. */
const SUELTO = /[?&]cuadrimania(=|&|$)/.test(location.search);

const _qs = new URLSearchParams(location.search);
const _num = (k, d)=>{ const v = parseFloat(_qs.get(k)); return isFinite(v) ? v : d; };

/* ---------------------------------------------------------------------
   K — todos los numeros del minijuego en un sitio (afinable en consola)
   --------------------------------------------------------------------- */
const K = {
  /* --- la torre --- */
  floors:  8,        // pisos (el original tiene 8-9)
  cell:    3.5,      // lado de la loseta (+30% sobre la v2, pedido de Toni)
  gap:     0.26,     // ranura ENTRE losetas, SOLO en el dibujo — la colision es la celda entera.
                     //  Sin ella el suelo se lee como una masa y no ves en que loseta estas.
  solape:  0.07,     // ►la caja de colision se pasa un pelin de la celda hacia fuera, asi que las
                     //  vecinas se SOLAPAN y no existe la costura por la que colarse ("no quiero
                     //  que te puedas caer por los huecos entre cuadraditos"). Al caer una loseta,
                     //  la de al lado invade su agujero un 2% del lado: invisible.
  nTop:   128,       // losetas del piso de ARRIBA
  nBot:   296,       // losetas del piso de ABAJO — ►la torre se ENSANCHA hacia abajo, como el
                     //  original: es lo que hace que "bajar pronto al piso grande" sea una jugada
                     //  de verdad y no un suicidio.
                     //  ►v3: el DOBLE de losetas que la v2 (era 64/148) — el area de juego se
                     //  duplica y el radio crece un 41% (el piso de abajo pasa de ~24 a ~34).
  dH:      15,       // separacion vertical entre pisos. ►DEBE superar la altura de salto alcanzable
                     //  (salto triple: 13,8 u) o se podria volver a subir y esto deja de converger.
                     //  CUAD.medirSalto() lo comprueba.
  botY:    6,        // altura del piso de abajo

  /* --- la loseta --- */
  armT:    1.00,     // s desde que la pisas hasta que se suelta (Fall Guys: ~1 s)
  bounceAt:0.72,     // fraccion de armT en la que REBOTA hacia arriba: es el "tell" del original,
                     //  la senal con la que los expertos cronometran el salto
  sink:    0.26,     // cuanto se hunde antes de rebotar
  wob:     0.11,     // amplitud del tembleque al final
  gFall:   26,       // gravedad de la loseta al caer
  fadeT:   0.55,     // ►y se DESVANECE en este tiempo en vez de seguir cayendo. Toni: "cuando caen
                     //  deben desvanecerse, si no caen demasiado y molesta a los de abajo" — una
                     //  loseta del piso 2 atravesaba los seis pisos de abajo a la vista de todos.
  h:       0.62,     // grosor del prisma
  taper:   0.86,     // estrechamiento de la cara de abajo (lee a piedra tallada)
  hot:     2.15,     // cuanto se ACLARA la loseta armada (instanceColor multiplica: >1 es valido)

  /* --- instinto de conservacion de la IA (ver el bloque ►INSTINTO) --- */
  huida:   0.42,     // s que le quedan a tu loseta cuando la IA decide saltar a la de al lado
  hop:     10.5,     // impulso vertical de ese salto corto

  /* --- presion anti-atasco --- */
  lavaWait: 150,     // s antes de que la lava empiece a subir (el original usa 5 min ocultos;
                     //  aqui se VE venir, que es mejor que un reloj invisible)
  lavaRise: 0.35,    // u/s de subida

  /* --- los esqueletos --- */
  total:     20,     // participantes en juego = jugadores vivos + esqueletos (peticion de Toni)
  repobGoteo: 1.3,   // s entre altas normales ("van populando pero poquitos", no de golpe)
  repobKill: 13,     // s de espera si lo MATASTE — matar un esqueleto se paga en espacio, que es
                     //  la moneda de este juego; es la recompensa que pidio Toni
  repobFall:  5,     // s si simplemente se cayo (no lo mato nadie: no hay premio que dar)
  pctArquero: 0.25,  // proporcion de esqueletos ARQUEROS (el resto, de melee)

  /* --- recinto --- */
  muroR:   40,       // ►MURO INVISIBLE circular alrededor de la torre (el piso mas ancho llega a
                     //  ~34). Pedido de Toni: que nadie pueda llegar al decorado. Rebota como los
                     //  muros laterales del juego; no impide caer, que es la unica muerte de aqui.

  /* --- decorado de fondo --- */
  decorN:    34,     // plataformas de piramide flotando al fondo (solo VISUALES)
  decorRmin: 56,     // ►muy por fuera del muro (40): imposible llegar ni de milagro
  decorRmax: 108,
  decorSep:  4,      // separacion MINIMA entre dos plataformas de decorado ("que no se fusione")
};

/* paletas de la loseta: la cara que se pisa CLARA, el canto oscuro → se lee de un vistazo */
const PAL_TOP  = ['#c9a35f','#b8934f','#d2ad69','#ad8845','#c09a57'];
const PAL_SIDE = ['#7a5a34','#6a4c2b','#87663d','#5d4224','#71542f'];
/* 3 tintes que se alternan piso a piso (el original alterna amarillo/azul/morado) */
const FLOOR_TINTS = [[1.08, 1.00, 0.86], [0.86, 0.88, 1.04], [1.02, 0.90, 0.96]];

/* ---------------------------------------------------------------------
   GEOMETRIA: prisma de base CUADRADA con las facetas pintadas en el
   vertice (el color de los assets de este juego vive en el VERTICE, no
   en el material: retintar material.color no haria nada)
   --------------------------------------------------------------------- */
function tileGeo(){
  const s = (K.cell - K.gap)*0.5, h = K.h, tp = K.taper;
  const P = [[-s,-s], [s,-s], [s,s], [-s,s]];
  const pos = [], col = [];
  const c = new THREE.Color();
  const push = (x,y,z)=>{ pos.push(x,y,z); };
  const face = (pal, jit)=>{
    c.set(pal[(Math.random()*pal.length)|0]).convertSRGBToLinear();
    const j = 1 + (Math.random()-0.5)*(jit!=null?jit:0.24);
    for(let k=0;k<3;k++) col.push(Math.min(1,c.r*j), Math.min(1,c.g*j), Math.min(1,c.b*j));
  };
  /* tapa (2 triangulos) — y=0 es la cara PISABLE */
  push(P[0][0],0,P[0][1]); push(P[2][0],0,P[2][1]); push(P[1][0],0,P[1][1]); face(PAL_TOP, 0.16);
  push(P[0][0],0,P[0][1]); push(P[3][0],0,P[3][1]); push(P[2][0],0,P[2][1]); face(PAL_TOP, 0.16);
  /* costados */
  for(let i=0;i<4;i++){
    const a=P[i], b=P[(i+1)%4], a2=[a[0]*tp,a[1]*tp], b2=[b[0]*tp,b[1]*tp];
    push(a[0],0,a[1]); push(b[0],0,b[1]); push(b2[0],-h,b2[1]);  face(PAL_SIDE);
    push(a[0],0,a[1]); push(b2[0],-h,b2[1]); push(a2[0],-h,a2[1]); face(PAL_SIDE);
  }
  /* fondo (se ve al caer volteando y desde abajo de la torre) */
  const Q = P.map(p=>[p[0]*tp, p[1]*tp]);
  push(Q[0][0],-h,Q[0][1]); push(Q[1][0],-h,Q[1][1]); push(Q[2][0],-h,Q[2][1]); face(PAL_SIDE, 0.12);
  push(Q[0][0],-h,Q[0][1]); push(Q[2][0],-h,Q[2][1]); push(Q[3][0],-h,Q[3][1]); face(PAL_SIDE, 0.12);

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color',    new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

/* ---------------------------------------------------------------------
   ESTADO
   --------------------------------------------------------------------- */
const T = {
  built:  false,
  group:  null,      // todo lo visual cuelga de aqui → limpiar = quitar el grupo
  floors: [],        // [{ y, r, ox, oz, inst, tiles:[], cells:Map, dirtyM, dirtyC }]
  tiles:  [],
  plats:  [],        // las plataformas que hemos metido en platforms[] (para sacarlas al reconstruir)
  active: [],        // solo las losetas en 'armed'/'fall' — el resto no cuesta nada por frame
  mat:    null,
  geo:    null,
  lavaY:  -15,
  t:      0,
  over:   false,
  repobT: 3,
  mnSeen: new Map(),
};

const _m4  = (typeof THREE!=='undefined') ? new THREE.Matrix4()      : null;
const _q4  = (typeof THREE!=='undefined') ? new THREE.Quaternion()   : null;
const _e3  = (typeof THREE!=='undefined') ? new THREE.Euler()        : null;
const _v3  = (typeof THREE!=='undefined') ? new THREE.Vector3()      : null;
const _s3  = (typeof THREE!=='undefined') ? new THREE.Vector3(1,1,1) : null;
const _sc  = (typeof THREE!=='undefined') ? new THREE.Vector3(1,1,1) : null;
const _col = (typeof THREE!=='undefined') ? new THREE.Color()        : null;

/* ---------------------------------------------------------------------
   REJILLA: las N celdas mas cercanas al centro (asi el crecimiento entre
   pisos es ESTRICTO; pidiendo un RADIO, dos pisos seguidos salian con el
   mismo numero de losetas porque no entraba un anillo nuevo)
   --------------------------------------------------------------------- */
function gridCells(n, ox, oz){
  const c = K.cell, out = [];
  const lim = Math.ceil(Math.sqrt(n)) + 2;
  for(let i=-lim; i<=lim; i++) for(let j=-lim; j<=lim; j++){
    const x = i*c + ox, z = j*c + oz;
    out.push([x, z, x*x + z*z]);
  }
  out.sort((a,b)=> a[2]-b[2]);
  return out.slice(0, n);
}

const _CELLQ = 5.0;
const _ck = (x,z)=> (Math.floor(x/_CELLQ)) + ',' + (Math.floor(z/_CELLQ));

/* ---------------------------------------------------------------------
   CONSTRUCCION DE LA TORRE
   --------------------------------------------------------------------- */
function build(){
  clear();
  T.group = new THREE.Group();
  T.group.userData.noOcc = true;
  scene.add(T.group);

  T.geo = tileGeo();
  T.mat = new THREE.MeshStandardMaterial({ color:0xffffff, vertexColors:true, roughness:0.94, metalness:0, flatShading:true });

  for(let f=0; f<K.floors; f++){
    const y = K.botY + (K.floors-1-f)*K.dH;                        // f=0 es el de ARRIBA
    const n = Math.round(K.nTop + (K.nBot-K.nTop) * (f/(K.floors-1)));
    /* medio paso de desfase alternando piso a piso: las rejillas no se alinean en vertical, asi
       que los agujeros no se apilan y la torre no parece un bloque extruido */
    const ox = (f & 1) ? K.cell*0.5 : 0, oz = (f & 2) ? K.cell*0.5 : 0;
    const cells = gridCells(n, ox, oz);
    let r = 0; for(const c of cells) r = Math.max(r, Math.hypot(c[0], c[1]));
    r += K.cell*0.5;

    const tiles = [], hash = new Map();
    const inst = new THREE.InstancedMesh(T.geo, T.mat, n);
    inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    inst.userData.noOcc = true;                                    // fuera del sistema de oclusion
    inst.castShadow = inst.receiveShadow = true;
    inst.frustumCulled = false;                                    // la torre es alta: su bbox enganaba
    inst.position.set(0, y, 0);

    const tint = FLOOR_TINTS[f % FLOOR_TINTS.length];
    const half = K.cell*0.5 + K.solape;      // ►solape: sin costura entre vecinas

    for(let i=0;i<n;i++){
      const cx = cells[i][0], cz = cells[i][1];
      /* ►la rejilla va ALINEADA A LOS EJES, asi que el AABB ES la loseta: cero parches en groundAt */
      const plat = {
        minX:cx-half, maxX:cx+half, minZ:cz-half, maxZ:cz+half,
        topY:y, baseY:y - K.h - 0.1,
        solid:false, float:true, step:0.3,
      };
      const jt = 0.92 + Math.random()*0.16;                        // multitono: ninguna igual a su vecina
      const tile = { f, i, cx, cz, plat, state:'idle', t:0, vy:0, drop:0,
                     r:tint[0]*jt, g:tint[1]*jt, b:tint[2]*jt };
      plat._cuad = tile;
      platforms.push(plat); T.plats.push(plat);
      tiles.push(tile); T.tiles.push(tile);

      _e3.set(0,0,0); _q4.setFromEuler(_e3);
      _v3.set(cx, 0, cz);
      _m4.compose(_v3, _q4, _s3);
      inst.setMatrixAt(i, _m4);
      _col.setRGB(tile.r, tile.g, tile.b);
      inst.setColorAt(i, _col);

      /* ►la loseta entra en TODAS las celdas del hash que toca, no solo en la de su centro: con el
         lado a 3,5 y la celda a 5, una loseta a caballo de dos celdas no se habria encontrado nunca
         desde la mitad que cae fuera — y esa loseta no se armaria jamas al pisarla. */
      for(let gx=Math.floor((cx-half)/_CELLQ); gx<=Math.floor((cx+half)/_CELLQ); gx++)
        for(let gz=Math.floor((cz-half)/_CELLQ); gz<=Math.floor((cz+half)/_CELLQ); gz++){
          const key = gx+','+gz;
          let a = hash.get(key); if(!a){ a=[]; hash.set(key,a); }
          a.push(tile);
        }
    }
    inst.instanceMatrix.needsUpdate = true;
    if(inst.instanceColor) inst.instanceColor.needsUpdate = true;
    T.group.add(inst);
    T.floors.push({ y, r, ox, oz, inst, tiles, cells:hash, dirtyM:false, dirtyC:false });
  }

  buildDecor();
  indiceSucio();                    // ►imprescindible: ver el comentario de indiceSucio()
  /* resetMatch enciende el clima con MENU_STAGE>=2 y el 13 pasa el filtro: dentro de una piramide
     no llueve. Se apaga aqui, DESPUES de que resetMatch lo haya encendido. */
  if(typeof enableWeather === 'function') enableWeather(false);
  T.built = true; T.t = 0; T.over = false; T.repobT = 3;
  T.mnSeen.clear();
  if(typeof players !== 'undefined') for(const p of players) p._cuadPiso = null;   // el piso recordado es de ESTA partida
  if(typeof _ctrlBarKey !== 'undefined') _ctrlBarKey = null;   // repinta la fila de botones (sin los 4 especiales)
  console.log('[CUADRIMANIA] torre montada: ' + K.floors + ' pisos, ' + T.tiles.length + ' losetas' +
              ' (arriba ' + T.floors[0].tiles.length + ' / abajo ' + T.floors[K.floors-1].tiles.length + ')');
}

/* ►EL BUG GORDO DE LA v2, y por que hace falta esta linea en todas partes.

   `_platCandidates` (el indice por franja X de platforms[]) refresca sus cubetas SOLO cuando cambia
   `platforms.length` — o cuando alguien marca `_looseDirty`. Aqui la longitud vuelve al MISMO numero
   una y otra vez: al reconstruir la torre se quitan 800 losetas y se ponen otras 800, y `soloDecor`
   mete plataformas y las vuelve a sacar. El indice se quedaba con los objetos VIEJOS.

   Sintomas exactos que reporto Toni, los dos de la misma causa:
     · "quedan tiles invisibles que ya han caido y puedes caminar sobre ellos" → el indice servia
       losetas de la torre ANTERIOR, cuyas mallas ya no existen;
     · "nada mas respawnear se traspasan y caes hacia abajo" → las losetas NUEVAS no estaban en el
       indice, asi que groundAt no las veia.
   Marcar el indice sucio es exactamente el mecanismo previsto (lo usan los barcos del canal). */
function indiceSucio(){ if(typeof _looseDirty !== 'undefined') _looseDirty = true; }

function clear(){
  if(T.plats.length) for(const pl of T.plats){ const i = platforms.indexOf(pl); if(i>=0) platforms.splice(i,1); }
  if(T.group) scene.remove(T.group);
  if(T.geo) T.geo.dispose();
  T.plats.length = 0; T.tiles.length = 0; T.floors.length = 0; T.active.length = 0;
  T.group = null; T.geo = null; T.built = false;
  indiceSucio();
}

/* ---------------------------------------------------------------------
   DECORADO — el del stage 5 REAL, sin inventar nada

   `enableS5Scenery(true)` monta la CAMARA DE LA PIRAMIDE tal cual: mar de
   lava + CILINDRO ADITIVO de glifos visto por dentro (R=118, H=190, cubre
   de -26 a 164, o sea toda la torre) + luz de relleno + brasas + humo.
   No hay paredes solidas, que es justo lo que pidio Toni.

   Encima, PLATAFORMAS DE PIRAMIDE FLOTANDO AL FONDO, hechas con el mismo
   `s3Slab` que construye las del stage y vestidas con sus props: dan la
   sensacion de seguir dentro del mismo sitio. Son SOLO VISUALES.
   --------------------------------------------------------------------- */
/* corre fn() y se queda con lo VISUAL: le quita la colision que haya creado y mete sus mallas en
   nuestro grupo. Asi se pueden usar los constructores del juego como decorado sin efectos. */
function soloDecor(fn){
  const p0 = platforms.length, c0 = scene.children.length;
  const capPrev = (typeof _CAP !== 'undefined') ? _CAP : false;
  if(typeof _CAP !== 'undefined') _CAP = true;      // s2Floor/getModel salen de vacio si no
  try { fn(); } catch(e){ console.warn('[CUADRIMANIA] decorado:', e); }
  if(typeof _CAP !== 'undefined') _CAP = capPrev;
  if(platforms.length > p0){ platforms.splice(p0, platforms.length - p0); indiceSucio(); }   // ►sin colision: son fondo
  const nuevos = scene.children.slice(c0);
  for(const o of nuevos){ scene.remove(o); T.group.add(o); }
  return nuevos;
}

function buildDecor(){
  /* 1) la camara de la piramide, la de verdad */
  if(typeof enableS5Scenery === 'function') enableS5Scenery(true);
  if(typeof S5_SCENERY !== 'undefined' && S5_SCENERY.lava) T.lavaY = S5_SCENERY.lava.position.y;

  /* 2) plataformas de piramide flotando al fondo (inalcanzables: ver K.decorRmin y el muro) */
  const topY = K.botY + (K.floors-1)*K.dH;
  /* TODO el catalogo de la piramide, no cuatro cosas (peticion: "mas plataformas con mas assets") */
  const props = ['s5_pillar','s5_coffin1','s5_coffin2','s5_vase1','s5_vase2','s5_vase3',
                 's5_crys1','s5_crys2','s5_anubis','s5_chest','s5_coins','s5_bars','s5_grave','s5_tile'];
  const puestas = [];                       // ►"que la decoracion no se fusione": nada se toca
  for(let i=0;i<K.decorN;i++){
    const sx = 8 + Math.random()*11, sz = 8 + Math.random()*11;
    let x=0, z=0, y=0, sitio=false;
    for(let intento=0; intento<40 && !sitio; intento++){
      const a  = (i/K.decorN)*Math.PI*2 + (Math.random()-0.5)*0.9;
      const rr = K.decorRmin + Math.random()*(K.decorRmax-K.decorRmin);
      x = Math.cos(a)*rr; z = Math.sin(a)*rr - 6;
      y = T.lavaY + 8 + Math.random()*(topY - T.lavaY + 18);
      sitio = true;
      for(const q of puestas){
        const dxz = Math.hypot(x-q.x, z-q.z), dy = Math.abs(y-q.y);
        /* se "fusionan" si se solapan en planta Y estan a alturas parecidas */
        if(dxz < (sx+q.sx)*0.5 + K.decorSep && dy < 9){ sitio = false; break; }
      }
    }
    if(!sitio) continue;
    puestas.push({ x, z, y, sx, sz });
    soloDecor(()=>{
      if(typeof s3Slab === 'function') s3Slab(x, z, sx, sz, y, 'dune');
      /* 2-4 props de la piramide encima, con su tinte ocre y sin pisarse entre ellos */
      if(typeof getModel === 'function' && typeof DECOR_DEFS5 !== 'undefined'){
        const nP = 2 + ((Math.random()*3)|0), colocados = [];
        for(let k=0;k<nP;k++){
          const key = props[(Math.random()*props.length)|0];
          const m = getModel(key, DECOR_DEFS5); if(!m) continue;
          const sc = 0.9 + Math.random()*0.6;
          const rad = ((DECOR_DEFS5[key] && DECOR_DEFS5[key].size) || 2) * sc * 0.5;
          let px=0, pz=0, ok=false;
          for(let it=0; it<20 && !ok; it++){
            px = x + (Math.random()-0.5)*(sx-rad*2-1);
            pz = z + (Math.random()-0.5)*(sz-rad*2-1);
            ok = true;
            for(const c of colocados) if(Math.hypot(px-c.x, pz-c.z) < rad + c.r + 0.6){ ok = false; break; }
          }
          if(!ok) continue;
          colocados.push({ x:px, z:pz, r:rad });
          if(typeof _s5Ochre === 'function' && !(typeof _s5Texturizado==='function' && _s5Texturizado(m))) _s5Ochre(m);
          m.scale.setScalar(sc);
          m.position.set(px, y + (m.userData.halfH||0)*sc - 0.04, pz);
          m.rotation.y = Math.random()*Math.PI*2;
          scene.add(m);
        }
      }
    });
  }
  console.log('[CUADRIMANIA] decorado de fondo: ' + puestas.length + '/' + K.decorN + ' plataformas');
}

/* ---------------------------------------------------------------------
   BUSCAR LA LOSETA BAJO UN ACTOR
   --------------------------------------------------------------------- */
function pisoDe(y){ return Math.round((K.botY + (K.floors-1)*K.dH - y) / K.dH); }
/* pisa = true → cuenta tambien las ARMADAS: siguen siendo suelo hasta que se sueltan */
function tileUnder(x, y, z, pisa){
  if(!T.built) return null;
  const fi = pisoDe(y);
  if(fi < 0 || fi >= K.floors) return null;
  const f = T.floors[fi];
  if(Math.abs(y - f.y) > 1.4) return null;
  const a = f.cells.get(_ck(x, z));
  if(!a) return null;
  const h = K.cell*0.5 + K.solape;
  for(const t of a){
    if(t.state !== 'idle' && !(pisa && t.state === 'armed')) continue;
    if(x >= t.cx-h && x <= t.cx+h && z >= t.cz-h && z <= t.cz+h) return t;
  }
  return null;
}

function armTile(t){
  if(t.state !== 'idle') return;
  t.state = 'armed'; t.t = 0;
  T.active.push(t);
  if(typeof sfx!=='undefined' && sfx.hit) sfx.hit(4);
}

/* ---------------------------------------------------------------------
   ►INSTINTO — el salto al vecino cuando la loseta se te va

   MEDIDO en la v1 (sin esto): en 30 s TODOS —CPU y esqueletos— habian
   bajado los 8 pisos y estaban en la lava, y solo se habian gastado 134
   de 792 losetas. La IA del juego persigue jugadores: no sabe que el
   suelo se acaba, asi que anda en linea recta quemando un reguero hasta
   que se cae. Con eso una partida duraba 30 s y el humano ganaba por
   incomparecencia.

   Lo que hace un experto en Hexagonia es lo contrario de andar: se queda
   quieto y SALTA a la losa de al lado en el ultimo momento (1 losa por
   segundo en vez de una fila entera). Eso es lo unico que se les ensena,
   y SOLO en el momento de peligro, para no tener dos cerebros peleandose.
   --------------------------------------------------------------------- */
function vecinaViva(t, x, z){
  const f = T.floors[t.f];
  let best = null, bd = 1e9;
  const gx = Math.floor(x/_CELLQ), gz = Math.floor(z/_CELLQ);
  for(let a=gx-1; a<=gx+1; a++) for(let b=gz-1; b<=gz+1; b++){
    const arr = f.cells.get(a+','+b); if(!arr) continue;
    for(const c of arr){
      if(c === t || c.state !== 'idle') continue;
      const d = (c.cx-x)*(c.cx-x) + (c.cz-z)*(c.cz-z);
      if(d > 1.0 && d < bd){ bd = d; best = c; }
    }
  }
  return best;
}
function saltaAlVecino(a, vel){
  const t = tileUnder(a.pos.x, a.pos.y, a.pos.z, true);
  if(!t || t.state !== 'armed') return false;
  if(K.armT - t.t > K.huida) return false;              // aun hay tiempo: que siga a lo suyo
  const v = vecinaViva(t, a.pos.x, a.pos.z);
  if(!v) return false;
  const dx = v.cx - a.pos.x, dz = v.cz - a.pos.z;
  const d = Math.hypot(dx, dz) || 1;
  a.vel.x = dx/d * vel; a.vel.z = dz/d * vel;
  a.vel.y = K.hop;
  a.onGround = false;
  if(a.yaw !== undefined) a.yaw = Math.atan2(dx, dz);
  return true;
}
/* ►y la otra mitad: NO ANDAR HACIA EL VACIO desde el ULTIMO piso. Medido: los esqueletos morian en
   oleadas (10 → 2 de golpe) porque persiguen en linea recta y abajo del todo ya no hay otro piso
   que te recoja. Mas arriba caerse es JUGAR, asi que la regla solo aplica al ultimo. */
function noTeDespenes(a){
  if(pisoDe(a.pos.y) !== K.floors-1) return;
  const s = Math.hypot(a.vel.x, a.vel.z);
  if(s < 0.3) return;
  const ax = a.pos.x + (a.vel.x/s)*1.2, az = a.pos.z + (a.vel.z/s)*1.2;
  if(tileUnder(ax, a.pos.y, az, true)) return;
  a.vel.x = 0; a.vel.z = 0;
}
/* ►MURO INVISIBLE circular. Pedido de Toni: "que nadie pueda llegar a las plataformas de decorado".
   Se resuelve como los muros laterales del juego (rebote posicional + velocidad hacia dentro), no
   como una muerte: en la torre lo unico que mata es la lava. Se aplica a jugadores Y esqueletos. */
function muro(a){
  const d = Math.hypot(a.pos.x, a.pos.z);
  if(d <= K.muroR || d < 0.001) return;
  const nx = a.pos.x/d, nz = a.pos.z/d;
  a.pos.x = nx*K.muroR; a.pos.z = nz*K.muroR;
  const vn = a.vel.x*nx + a.vel.z*nz;                 // componente que sale hacia fuera
  if(vn > 0){ a.vel.x -= vn*nx*1.6; a.vel.z -= vn*nz*1.6; }   // la invierte con algo de rebote
}
function recinto(){
  if(typeof players !== 'undefined') for(const p of players){ if(!p.out) muro(p); }
  if(typeof minions !== 'undefined') for(const mn of minions){ if(!mn.dead) muro(mn); }
}

function instinto(){
  if(typeof players !== 'undefined') for(const p of players){
    if(p.dead || p.out || !p.onGround) continue;
    if(!p.isAI) continue;                                // al humano no se le juega la partida
    if(p.hitstun > 0 || (p.atk && p.atk.phase !== 'none')) continue;
    if(!saltaAlVecino(p, 9.0)) noTeDespenes(p);
  }
  if(typeof minions !== 'undefined') for(const mn of minions){
    if(mn.dead || !mn.onGround) continue;
    if(!saltaAlVecino(mn, 7.0)) noTeDespenes(mn);
  }
}

/* ---------------------------------------------------------------------
   LOS ESQUELETOS — aforo de 20 participantes
   El juego los sabe hacer solo: spawnMinionAt() los crea y updateMinion()
   les da IA, gravedad y salto de huecos, y como andan sobre platforms[]
   caminan por las losetas sin que haya que tocar nada. Aqui solo se
   decide CUANTOS, DONDE y CADA CUANTO.
   --------------------------------------------------------------------- */
function pisoConSuelo(){
  for(let f=0; f<K.floors; f++){
    const live = T.floors[f].tiles.filter(t=>t.state==='idle');
    if(live.length >= 8) return { fl:T.floors[f], live };
  }
  return null;
}
function sueltaEsqueleto(){
  const sitio = pisoConSuelo();
  if(!sitio) return false;
  let best = null, bd = -1;                              // lejos de los jugadores
  for(let k=0;k<10;k++){
    const t = sitio.live[(Math.random()*sitio.live.length)|0];
    let d = 1e9;
    for(const p of players){ if(p.dead||p.out) continue;
      d = Math.min(d, (p.pos.x-t.cx)*(p.pos.x-t.cx) + (p.pos.z-t.cz)*(p.pos.z-t.cz)); }
    if(d > bd){ bd = d; best = t; }
  }
  if(!best) return false;
  const arquero = Math.random() < K.pctArquero;
  return !!spawnMinionAt(best.cx, best.cz, sitio.fl.y,
                         arquero ? 'shooter' : 'small',
                         arquero ? 'skelshooter' : 'skeleton');
}
function repoblar(dt){
  if(typeof minions === 'undefined' || typeof spawnMinionAt !== 'function') return;
  /* ►BAJAS: si a un esqueleto lo MATARON (llego a su tope de dano), la reposicion tarda mucho mas
     que si solo se cayo. No se puede preguntar despues — updateMinions ya lo ha sacado del array
     cuando nos toca correr — asi que se guarda una foto por frame. */
  const seen = T.mnSeen;
  for(const mn of Array.from(seen.keys())){
    if(minions.indexOf(mn) >= 0) continue;
    const s = seen.get(mn); seen.delete(mn);
    T.repobT = Math.max(T.repobT, s.muerto ? K.repobKill : K.repobFall);
  }
  for(const mn of minions){
    const hp = (typeof minionHP==='function') ? minionHP(mn.type) : 14;
    seen.set(mn, { muerto: (mn.damage||0) >= hp });
  }

  T.repobT -= dt;
  const vivos = players.filter(p=>!p.out).length;
  if(K.total - vivos - minions.length > 0 && T.repobT <= 0){
    T.repobT = sueltaEsqueleto() ? K.repobGoteo : 1.5;
  }
}

/* ---------------------------------------------------------------------
   PUNTOS DE APARICION — arriba del todo, repartidos, sobre loseta viva
   (safeSpawn del juego exige plataformas anchas y topY<6: aqui no vale)
   --------------------------------------------------------------------- */
/* ►Vuelves donde estabas, no arriba del todo (peticion de Toni: "no vuelve a empezar desde arriba
   del todo sino desde el ultimo nivel que ha tocado"). Reaparecer en la cima seria ademas un premio
   por morir: el piso de arriba es el que menos gastado esta. Se guarda el ultimo piso PISADO en
   p._cuadPiso (lo escribe tick) y se busca desde ahi hacia arriba el primero con losetas de sobra
   —si el tuyo ya no tiene suelo, subes lo justo. */
function spawnPoint(idx, total){
  if(!T.built) return null;
  const p = (typeof players!=='undefined') ? players[idx] : null;
  const desde = (p && p._cuadPiso != null) ? Math.min(K.floors-1, p._cuadPiso) : 0;
  const orden = [];
  for(let f=desde; f>=0; f--) orden.push(f);            // tu piso primero, luego hacia ARRIBA
  for(let f=desde+1; f<K.floors; f++) orden.push(f);    // y si nada, hacia abajo
  for(const f of orden){
    const fl = T.floors[f];
    const live = fl.tiles.filter(t=>t.state==='idle');
    if(live.length < 6) continue;
    const a = (idx/Math.max(1,total))*Math.PI*2 + f*0.7;
    const rr = fl.r*0.62;
    const wx = Math.cos(a)*rr, wz = Math.sin(a)*rr;
    let best = null, bd = 1e9;
    for(const t of live){ const d=(t.cx-wx)*(t.cx-wx)+(t.cz-wz)*(t.cz-wz); if(d<bd){ bd=d; best=t; } }
    if(best) return { x:best.cx, y:fl.y + 9, z:best.cz };
  }
  return { x:0, y:K.botY + 9, z:0 };
}

/* ---------------------------------------------------------------------
   TICK
   --------------------------------------------------------------------- */
function setTile(t, dy, rx, rz, hide, esc){
  const f = T.floors[t.f];
  if(hide){ _m4.makeScale(0,0,0); }
  else {
    _e3.set(rx, 0, rz); _q4.setFromEuler(_e3);
    _v3.set(t.cx, dy, t.cz);
    if(esc !== undefined) _sc.set(esc, esc, esc); else _sc.set(1,1,1);
    _m4.compose(_v3, _q4, _sc);
  }
  f.inst.setMatrixAt(t.i, _m4);
  f.dirtyM = true;
}

function tick(dt){
  if(!T.built) return;
  T.t += dt;

  /* --- 1. quien esta pisando que --- */
  if(typeof players !== 'undefined') for(const p of players){
    if(p.dead || p.out || !p.onGround) continue;
    const pi = pisoDe(p.pos.y);                       // ►se recuerda el ultimo piso PISADO: es donde
    if(pi >= 0 && pi < K.floors) p._cuadPiso = pi;    //   reaparecera si pierde una vida (ver spawnPoint)
    const t = tileUnder(p.pos.x, p.pos.y, p.pos.z);
    if(t) armTile(t);
  }
  /* ►los esqueletos COMEN FICHAS igual que tu (peticion de Toni). En el stage 5 pasa lo contrario:
     alli s5HexPad solo deja que las arme un jugador, "los goblins no rompen la ruta". */
  if(typeof minions !== 'undefined') for(const mn of minions){
    if(mn.dead || !mn.onGround) continue;
    const t = tileUnder(mn.pos.x, mn.pos.y, mn.pos.z);
    if(t) armTile(t);
  }

  /* --- 2. maquinas de estado (solo las losetas activas) --- */
  for(let i=T.active.length-1; i>=0; i--){
    const t = T.active[i], f = T.floors[t.f];
    t.t += dt;

    if(t.state === 'armed'){
      const u = Math.min(1, t.t / K.armT), bA = K.bounceAt;
      /* HUNDIMIENTO + REBOTE: el "tell" del original. Se hunde poco a poco y, en el ultimo cuarto,
         vuelve arriba (con un pelin de pasada) justo antes de soltarse. */
      let s;
      if(u < bA) s = K.sink * (u/bA);
      else { const w = (u-bA)/(1-bA); s = K.sink*(1-w) - 0.45*K.sink*Math.sin(Math.PI*w); }
      const k = u*u;
      setTile(t, -s, Math.sin(T.t*31 + t.i)*K.wob*k, Math.cos(T.t*27 + t.i*1.7)*K.wob*k, false);
      t.plat.topY  = f.y - s;                    // ►dibujo = colision (si no, pisas donde no esta)
      t.plat.baseY = t.plat.topY - K.h - 0.1;

      _col.setRGB(t.r + (K.hot-t.r)*k, t.g + (K.hot*0.94-t.g)*k, t.b + (K.hot*0.80-t.b)*k);
      f.inst.setColorAt(t.i, _col); f.dirtyC = true;

      if(Math.random() < dt*6*(0.3+k) && typeof burst==='function')
        burst(new THREE.Vector3(t.cx + (Math.random()-0.5)*2, f.y-0.4, t.cz + (Math.random()-0.5)*2), 0x7a5a38, 2, 1.6, 0.6, .45);

      if(t.t >= K.armT){
        t.state='fall'; t.t=0; t.vy=0; t.drop=0;
        t.plat.topY = -999; t.plat.baseY = -1000; t.plat._fell = true;   // deja de ser suelo AL INSTANTE
        if(typeof sfx!=='undefined' && sfx.hit) sfx.hit(9);
        if(typeof burst==='function') burst(new THREE.Vector3(t.cx, f.y-0.3, t.cz), 0x8a6942, 8, 4, 1.5, .7);
      }
    } else if(t.state === 'fall'){
      /* ►cae POCO y se DESVANECE: antes se despenaba los 100 u de torre atravesando todos los pisos
         de abajo, y eso confundia a quien estaba jugando alli. Ahora cae ~4 u encogiendose. */
      t.vy -= K.gFall*dt; t.drop -= t.vy*dt;
      const k = Math.min(1, t.t / K.fadeT);
      if(k >= 1){ t.state='gone'; setTile(t, 0,0,0, true); T.active.splice(i,1); continue; }
      setTile(t, -t.drop, t.t*1.6, t.t*1.1, false, 1 - k*k);
    } else { T.active.splice(i,1); }
  }
  for(const f of T.floors){
    if(f.dirtyM){ f.inst.instanceMatrix.needsUpdate = true; f.dirtyM = false; }
    if(f.dirtyC && f.inst.instanceColor){ f.inst.instanceColor.needsUpdate = true; f.dirtyC = false; }
  }

  /* --- 3. presion: pasado un rato la lava SUBE (anti-atasco que SE VE) --- */
  if(T.t > K.lavaWait){
    T.lavaY += K.lavaRise*dt;
    if(typeof S5_SCENERY !== 'undefined'){
      if(S5_SCENERY.lava) S5_SCENERY.lava.position.y = T.lavaY;
      if(S5_SCENERY.fill) S5_SCENERY.fill.position.y = T.lavaY + 8;
    }
  }

  /* --- 4. recinto + instinto de la IA + aforo de esqueletos --- */
  recinto();
  instinto();
  repoblar(dt);

  /* --- 5. ULTIMO EN PIE ---
     El juego no tiene esta condicion: ko() solo llama a endGame() cuando NO queda NADIE
     ("la partida NO acaba con 1 en pie"). Aqui es al reves, asi que la contamos nosotros. */
  if(!T.over && typeof players !== 'undefined' && players.length > 1 &&
     typeof gameOver !== 'undefined' && !gameOver){
    const vivos = players.filter(q=>!q.out);
    if(vivos.length <= 1){
      T.over = true;
      if(vivos.length === 1 && typeof showBanner==='function') showBanner('¡' + (vivos[0].label||'') + ' AGUANTA EN PIE!', 2.4);
      if(typeof crowdCheer==='function') crowdCheer(.7);
      /* ►RUTA: en campana es un eslabon del line-up, no el fin de la partida.
         Suelto (?cuadrimania) acaba como siempre. */
      setTimeout(()=>{
        if(gameOver) return;
        if(window.rutaEnCampana && window.rutaEnCampana()){ window.rutaFinMini(); return; }
        if(typeof endGame==='function') endGame();
      }, 1400);
    }
  }
}

/* ---------------------------------------------------------------------
   API + ARRANQUE
   --------------------------------------------------------------------- */
const CUAD = {
  on: false, K, T,
  segBuilders: [ ()=>{}, ()=>{}, ()=>{}, ()=>{}, ()=>{}, ()=>{} ],   // el belt no construye: la torre es suelta
  applyTheme, tick, spawnPoint, build, clear,
  get lavaY(){ return T.lavaY; },
  rebuild(){ build(); },
  /* comprueba que dH supera la altura de salto REAL (si algun dia se toca el salto, esto avisa) */
  medirSalto(){
    const g = 36, j = 19, dj = 17.8;
    const n = (typeof airJumps==='function' && typeof P1!=='undefined') ? airJumps(P1) : 2;
    const h = j*j/(2*g) + n*(dj*dj/(2*g));
    return { saltos: n+1, alturaMax: h, dH: K.dH, seguro: K.dH > h };
  },
};

/* ---------------------------------------------------------------------
   TEMA — el del interior de la piramide, tal cual, con la lava mas cerca
   --------------------------------------------------------------------- */
function applyTheme(){
  if(typeof _applyS5Theme === 'function') _applyS5Theme();       // arenisca + cielo/niebla + la CAMARA real
  /* la niebla del stage llega a 128 y la torre mide 105 de alto: se abre para que los pisos de
     abajo no desaparezcan en gris al mirar desde arriba */
  VISUAL.fog.far = 190;
  VISUAL.exposure = 0.66;
  VISUAL.key.color = 0xffe0bc; VISUAL.key.intensity = 1.35; VISUAL.key.pos = [16, 70, 26];
  VISUAL.hemi.intensity = 0.62;                                   // la torre tiene MUCHO canto vertical
}

window.CUAD = CUAD;

/* arranque SUELTO (?cuadrimania). En campana se llega con goToStage13(). */
function boot(){
  if(CUAD.on || !SUELTO) return;
  if(typeof THREE === 'undefined') return;
  if(typeof launchMatch !== 'function' || typeof platforms === 'undefined' || typeof players === 'undefined') return;
  if(typeof _charTpls === 'undefined' || !_charTpls || !Object.keys(_charTpls).length) return;   // sin modelos saldrian capsulas
  CUAD.on = true;
  MATCH.mode = 'solo';
  MATCH.cpus = Math.max(0, Math.min(5, _num('cpus', 3)));
  MENU_STAGE = 13;
  launchMatch();
}
if(SUELTO){
  const _bt = setInterval(()=>{ boot(); if(CUAD.on) clearInterval(_bt); }, 80);
  boot();
}

})();
