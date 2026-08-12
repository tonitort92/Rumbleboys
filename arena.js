/* =====================================================================
   ►ARENA — el minijuego de PELEA sobre un disco que se deshace  ·  v1

   Se entra con:  rumble_arena_cinta_v4.html?arena
   Sin esa query, este fichero sale en su primera linea (coste cero).

   ---------------------------------------------------------------------
   QUE ES (encargo de Toni)
   Un disco gigante de tematica JAPON flotando en el decorado del stage 3.
   Cada pocos segundos se cae una SECCION del borde — una porcion de tarta
   del anillo exterior — asi que el sitio para pelear se encoge. Dos
   minutos. No gana el ultimo en pie: gana EL QUE MAS RIVALES TIRA.

   TRES DECISIONES DE DISENO, y las tres tienen su porque:

   1) REAPARICION Y PUNTOS POR DERRIBO, no vida unica. En un "ultimo en
      pie" de 2 minutos el primero que cae se pasa la mitad del minijuego
      mirando. Aqui caerse cuesta puntos y tiempo, no la partida.

   2) EL DISCO NO SE CIERRA DEL TODO. La reduccion para en `Rmin`: cuando
      quedan cuatro baldosas ya no decide la habilidad, decide el azar.
      El nucleo no cae nunca y, si se agota el tiempo, manda el marcador.

   3) LAS SECCIONES CAEN POR SECTORES ENTEROS, de fuera adentro. Es lo que
      separa este minijuego de [[cuadrimania]], donde lo que desaparece son
      losetas sueltas: alli se gana con agilidad, aqui a empujones.

   ---------------------------------------------------------------------
   POR QUE ES UN STAGE Y NO OTRO descenso.js

   Igual que cuadrimania: esto NO es un mundo aparte, es una PARTIDA DE
   RUMBLEBOYS en un escenario nuevo (STAGE 14, fuera de CAMPAIGN_STAGES).
   Asi el combate, el empujon, el % de dano, los esqueletos y la IA salen
   gratis del motor — que es justo lo que hace falta en un minijuego cuya
   gracia es pegarse.

   LA REJILLA ES CUADRADA aunque el disco sea redondo, y esa es la leccion
   heredada de cuadrimania: las plataformas del juego son AABB, asi que
   una loseta cuadrada ES su caja de colision. Un sector de corona
   circular obligaria a ensenarle poligonos a groundAt. El borde queda
   escalonado y a cambio no se toca ni una linea de la colision.

   ---------------------------------------------------------------------
   AFINADO EN VIVO:  ARENA.K   (y ARENA.rebuild() para reconstruir)
   ===================================================================== */
(function(){
'use strict';
if(!/[?&]arena(=|&|$)/.test(location.search)) return;

const _qs  = new URLSearchParams(location.search);
const _num = (k, d)=>{ const v = parseFloat(_qs.get(k)); return isFinite(v) ? v : d; };

/* ---------------------------------------------------------------------
   K — todos los numeros del minijuego en un sitio (afinable en consola)
   --------------------------------------------------------------------- */
const K = {
  /* --- el disco --- */
  R:        36,      // radio del disco al empezar
  Rmin:     13,      // ►el nucleo NO cae nunca (ver decision 2)
  cell:     3.6,     // lado de la loseta
  solape:   0.06,    // se solapan un pelo: sin esto se ve la costura entre vecinas
  h:        2.2,     // grosor
  y:        0,       // altura del disco

  /* --- ►KOTH · el PODIO del centro: el nucleo sube en dos escalones --- */
  Rcima:    6.8,     // radio de la CIMA (el sitio que se disputa)
  altoMedio:2.4,     // escalon intermedio; con JUMP=19/GRAV=-36 un salto sube ~5 u
  altoCima: 4.6,     // la cima: dos saltos, o uno desde el escalon
  kothPts:  8,      // puntos por segundo mandando SOLO en la cima
  kothPop:  2.0,     // cada cuanto sale el "+N" (no hay marcador: el popup es el aviso)

  /* --- ►BOMBA · el objeto que se agarra y se lanza --- */
  bombaCada:8.0,     // s entre bombas (la primera, a la mitad)
  mecha:    5.2,     // s de mecha: da para cogerla y buscarle dueno
  bombaR:   5.8,     // radio de la explosion
  bombaDmg: 12,      // dano moderado: la gracia es el EMPUJON, no matar a golpes
  bombaKb:  18,      // ...y el empujon es enorme (esto es un juego de tirar gente)
  bombaRompe:4.6,    // radio en el que la explosion ADEMAS tira las losetas
  bombaV:   17,      // velocidad del lanzamiento
  bombaVy:  7,       // ...y su componente vertical (parabola)

  /* --- como se deshace --- */
  sectores: 10,      // porciones de tarta
  aviso:    1.5,     // s temblando antes de caerse (se ve venir)
  gravedad: 34,      // caida de los cascotes
  vidaCasc: 2.6,     // s hasta que el cascote desaparece

  /* --- reglas --- */
  dur:      120,     // 2 minutos (Toni)
  ptsTirar: 100,     // puntos por rival tirado
  ptsCaer:  -40,     // ...y lo que cuesta caerse
  respawn:  1.4,     // s de reaparicion

  /* --- recinto --- */
  muroR:    52,      // ►MURO INVISIBLE: el disco llega a 36, esto deja aire para el empujon
};

const T = {
  built:false, group:null, inst:null, tiles:[], plats:[], cascotes:[],
  t:0, over:false, proxCaida:0, caidos:0, orden:[], pts:new Map(), kills:new Map(),
  /* ►BOMBA / ►KOTH / ►TRASTOS: lo nuevo */
  bombas:[], proxBomba:0, trastos:[], reloj:null, rey:null, reyT:0, aro:null,
};

/* ---------------------------------------------------------------------
   HELPERS de three reutilizados (uno por tipo, no uno por loseta)
   --------------------------------------------------------------------- */
const _v3 = new THREE.Vector3(), _q4 = new THREE.Quaternion(),
      _s3 = new THREE.Vector3(1,1,1), _sc = new THREE.Vector3(1,1,1),
      _m4 = new THREE.Matrix4(),
      _e3 = new THREE.Euler(), _col = new THREE.Color();

/* ►SJLOOK · los tintes son AHORA MULTIPLICADORES sobre la textura magenta del
   jardin (instanceColor multiplica al material), no colores absolutos: por eso
   rondan el 1. Con los valores viejos (0,5-0,7 grises) el disco salia sucio. */
const TINTES = [[1.00,1.00,1.00], [0.94,0.95,0.97], [1.06,1.04,1.05], [0.90,0.93,0.96]];
/* el ANILLO EXTERIOR vivo se enciende en ROJO: es el aviso de "esto es lo siguiente" */
const TINTE_BORDE = [1.55, 0.62, 0.52];
/* ►KOTH: el podio, mas claro segun sube — la altura se lee sin salirse de la paleta */
const TINTE_CIMA = [1.75, 1.62, 1.70], TINTE_MEDIO = [1.34, 1.25, 1.31];

/* ►SJLOOK · materiales del disco: los MISMOS del jardin japones (tapa magenta
   sakura multitono + cuerpo de piedra gris), en el orden de grupos que trae una
   BoxGeometry: [+X, -X, +Y(tapa), -Y, +Z, -Z]. */
let _MATS = null;
function _matsDisco(){
  if(_MATS) return _MATS;
  if(typeof _buildSJMats === 'function') _buildSJMats();
  const M = (typeof SJMATS !== 'undefined' && SJMATS) ? SJMATS : null;
  const tapa   = M ? M.sakura.top : new THREE.MeshStandardMaterial({ color:0xe86bad, roughness:0.93, metalness:0 });
  const cuerpo = M ? M.body       : new THREE.MeshStandardMaterial({ color:0x8e9298, roughness:0.93, metalness:0 });
  _MATS = [cuerpo, cuerpo, tapa, cuerpo, cuerpo, cuerpo];
  return _MATS;
}

/* el motor cachea las plataformas sueltas en un índice; tocar `platforms` sin
   avisar deja losetas fantasma que se pueden pisar. `indiceSucio` NO es del
   motor: cuadrimania.js declara la suya y aquí hace falta la propia. */
function indiceSucio(){ if(typeof _looseDirty !== 'undefined') _looseDirty = true; }

function clear(){
  /* los cacharros estan registrados en las listas de PELIGROS del motor
     (bouncers / _sjBells / _sjDarumas): si se van del grupo sin desregistrar,
     siguen golpeando desde el mas alla en la siguiente partida */
  for(const tr of T.trastos){ tr.cae = false; tiraTrasto(tr); }
  T.trastos.length = 0;
  if(typeof players !== 'undefined') for(const p of players) p._arBomb = null;
  T.bombas.length = 0; T.aro = null; T.rey = null;
  if(T.reloj && T.reloj.parentNode) T.reloj.parentNode.removeChild(T.reloj);
  T.reloj = null;
  const ch = document.getElementById('chaos'); if(ch) ch.style.display = '';   // se lo devolvemos al resto del juego
  if(T.group && typeof scene !== 'undefined'){ scene.remove(T.group); }
  if(typeof platforms !== 'undefined' && T.plats.length){
    for(const p of T.plats){ const i = platforms.indexOf(p); if(i >= 0) platforms.splice(i, 1); }
    if(typeof indiceSucio === 'function') indiceSucio();
  }
  T.group = null; T.inst = null; T.mapa = null;
  T.tiles.length = 0; T.plats.length = 0; T.cascotes.length = 0;
  T.pts.clear(); T.kills.clear();
  T.built = false; T.over = false; T.caidos = 0;
}

/* anillo (0 = el de fuera) y sector de una loseta por su centro. El nucleo
   devuelve anillo -1 y no entra en el sorteo de caidas. */
function celda(cx, cz){
  const r = Math.hypot(cx, cz);
  if(r < K.Rmin) return { anillo:-1, sector:0 };
  const paso = (K.R - K.Rmin) / K.anillos;
  const anillo = Math.min(K.anillos - 1, Math.floor((K.R - r) / paso));   // 0 = el mas exterior
  let a = Math.atan2(cz, cx); if(a < 0) a += Math.PI * 2;
  const sector = Math.min(K.sectores - 1, Math.floor(a / (Math.PI * 2) * K.sectores));
  return { anillo, sector };
}

/* ►KOTH · ALTURA de una loseta por su radio: el nucleo deja de ser una losa lisa
   y sube en dos escalones. Un salto normal cubre ~5 u, asi que cada escalon se
   sube de un brinco y la cima obliga a encadenar dos (o a subir por el de al
   lado): pelearse ARRIBA cuesta, que es justo lo que la hace disputada. */
function alturaDe(cx, cz){
  const r = Math.hypot(cx, cz);
  if(r < K.Rcima) return K.altoCima;
  if(r < K.Rmin)  return K.altoMedio;
  return 0;
}

/* ---------------------------------------------------------------------
   CONSTRUCCION
   --------------------------------------------------------------------- */
function build(){
  clear();
  T.group = new THREE.Group();
  T.group.userData.noOcc = true;
  scene.add(T.group);

  /* cuantos anillos caben con losetas de `cell` entre Rmin y R */
  K.anillos = Math.max(2, Math.round((K.R - K.Rmin) / (K.cell * 2.4)));

  /* --- la rejilla, recortada en circulo --- */
  const n = Math.ceil(K.R / K.cell);
  const celdas = [];
  for(let ix = -n; ix <= n; ix++) for(let iz = -n; iz <= n; iz++){
    const cx = ix * K.cell, cz = iz * K.cell;
    /* se mide por el CENTRO: asi el borde queda escalonado pero ninguna
       loseta sobresale mas de media celda del radio nominal */
    if(Math.hypot(cx, cz) > K.R) continue;
    celdas.push([cx, cz]);
  }

  const geo = new THREE.BoxGeometry(K.cell + K.solape * 2, K.h, K.cell + K.solape * 2);
  /* ►SIN `vertexColors`: el disco salió NEGRO en la primera captura. Con
     `vertexColors:true` el shader espera un atributo `color` en la geometría, y
     una BoxGeometry no lo trae: entrega (0,0,0) y por mucho `setColorAt` que se
     haga, negro por negro sigue siendo negro. El color por loseta lo pone el
     instanceColor, que multiplica al `color` del material. (cuadrimania sí usa
     vertexColors porque su geometría se construye a mano CON su atributo.)

     ►SJLOOK (pedido de Toni: "la arena magenta del mismo estilo que las
     plataformas del stage Japón"). Las plataformas del jardín NO son un color
     plano: son `_s2mat(paleta)`, un material con una TEXTURA DE CAMPO que mezcla
     media docena de tonos DENTRO de cada losa. Aquí se usan sus mismas paletas y
     su mismo constructor — nada de inventar un magenta a ojo.
     Y como una BoxGeometry viene con SUS SEIS GRUPOS, se le pasa un ARRAY de
     materiales: la tapa en magenta sakura y los laterales/fondo en la piedra
     gris que el stage usa para el cuerpo de sus plataformas (es lo que le da
     lectura de volumen; con la tapa por los seis lados el disco se aplana). */
  const mat = _matsDisco();
  const inst = new THREE.InstancedMesh(geo, mat, celdas.length);
  inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  inst.userData.noOcc = true;
  inst.castShadow = inst.receiveShadow = true;
  inst.frustumCulled = false;
  inst.position.set(0, K.y, 0);
  T.inst = inst; T.geo = geo; T.mat = mat;

  const half = K.cell * 0.5 + K.solape;
  for(let i = 0; i < celdas.length; i++){
    const cx = celdas[i][0], cz = celdas[i][1];
    const c = celda(cx, cz);
    const alt = alturaDe(cx, cz);
    /* ►SUELO A LA ALTURA QUE SE PISA: la caja va CENTRADA en su geometria, asi que
       para que su CARA DE ARRIBA coincida con topY el centro tiene que estar medio
       grosor por debajo. Sin esto los luchadores andaban hundidos hasta la rodilla
       (1,1 u de loseta por encima del suelo de colision).
       Y la loseta ELEVADA se ESTIRA hacia abajo hasta la base del disco: el podio
       queda macizo en vez de dos anillos flotando. */
    const sy = (K.h + alt) / K.h;
    const y0 = K.y + alt - (K.h * sy) * 0.5;
    /* ►la rejilla va ALINEADA A LOS EJES: el AABB ES la loseta (ver cabecera) */
    const plat = { minX:cx-half, maxX:cx+half, minZ:cz-half, maxZ:cz+half,
                   topY:K.y + alt, baseY:K.y - K.h - 0.1, solid:true };
    const jt = 0.96 + Math.random() * 0.08;   // ►SJLOOK: jitter CORTO — la variedad la pone ya la textura de campo
    let tinte = TINTES[(Math.abs(Math.round(cx/K.cell) * 3 + Math.round(cz/K.cell) * 7)) % TINTES.length];
    if(alt > 0) tinte = (alt === K.altoCima) ? TINTE_CIMA : TINTE_MEDIO;   // el podio se lee de un vistazo
    const tile = { i, cx, cz, y0, alt, sy, plat, anillo:c.anillo, sector:c.sector,
                   state:'idle', t:0, vy:0, rot:0,
                   r:tinte[0]*jt, g:tinte[1]*jt, b:tinte[2]*jt };
    plat._arena = tile;
    platforms.push(plat); T.plats.push(plat); T.tiles.push(tile);

    _e3.set(0,0,0); _q4.setFromEuler(_e3); _v3.set(cx, y0, cz); _sc.set(1, sy, 1);
    _m4.compose(_v3, _q4, _sc);
    inst.setMatrixAt(i, _m4);
    _col.setRGB(tile.r, tile.g, tile.b);
    inst.setColorAt(i, _col);
  }
  inst.instanceMatrix.needsUpdate = true;
  if(inst.instanceColor) inst.instanceColor.needsUpdate = true;
  T.group.add(inst);

  /* --- el ORDEN en que se cae todo: de fuera adentro, sector a sector ---
     se baraja DENTRO de cada anillo para que no se deshaga como un reloj */
  T.orden = [];
  for(let a = 0; a < K.anillos; a++){
    const secs = [];
    for(let s = 0; s < K.sectores; s++) secs.push(s);
    for(let k = secs.length - 1; k > 0; k--){ const j = (Math.random()*(k+1))|0; const t2 = secs[k]; secs[k] = secs[j]; secs[j] = t2; }
    for(const s of secs) T.orden.push({ anillo:a, sector:s });
  }
  /* el reloj de caidas reparte TODAS las secciones en el 85% del tiempo:
     el 15% final se pelea ya en el nucleo, sin suelo desapareciendo */
  T.caeCada = (K.dur * 0.85) / Math.max(1, T.orden.length);

  /* indice de la rejilla: quien pregunta "¿queda suelo aqui?" (los cacharros que
     se caen con su sector) no tiene que barrer las 300 losetas */
  T.mapa = new Map();
  for(const t of T.tiles) T.mapa.set(Math.round(t.cx/K.cell) + ',' + Math.round(t.cz/K.cell), t);

  buildDecor();
  pintaBorde();
  indiceSucio();                       // los cacharros se apoyan con platformTopAt: el indice va antes
  buildTrastos();
  creaAro();
  creaReloj();
  if(typeof enableWeather === 'function') enableWeather(false);

  T.built = true; T.t = 0; T.over = false; T.proxCaida = 6; T.caidos = 0;
  T.proxBomba = K.bombaCada * 0.5; T.rey = null; T.reyT = 0;
  T.pts.clear(); T.kills.clear();
  if(typeof _ctrlBarKey !== 'undefined') _ctrlBarKey = null;
  console.log('[ARENA] disco montado: ' + T.tiles.length + ' losetas · ' +
              K.anillos + ' anillos × ' + K.sectores + ' sectores · una seccion cada ' +
              T.caeCada.toFixed(1) + ' s');
}

/* el anillo exterior VIVO se tine de rojo: dice "por aqui viene la siguiente" */
function pintaBorde(){
  if(!T.inst) return;
  let borde = -1;
  for(const t of T.tiles) if(t.state === 'idle' && t.anillo >= 0 && (borde < 0 || t.anillo < borde)) borde = t.anillo;
  for(const t of T.tiles){
    if(t.state !== 'idle') continue;
    const rojo = (t.anillo === borde);
    _col.setRGB(rojo ? TINTE_BORDE[0] : t.r, rojo ? TINTE_BORDE[1] : t.g, rojo ? TINTE_BORDE[2] : t.b);
    T.inst.setColorAt(t.i, _col);
  }
  if(T.inst.instanceColor) T.inst.instanceColor.needsUpdate = true;
}

/* ---------------------------------------------------------------------
   DECORADO — el del jardin japones y NADA MAS

   Mismo criterio que en cuadrimania: antes de inventar un fondo, mirar si
   el stage ya lo tiene. `enableSJScenery(true)` monta el mar de nubes, el
   Fuji y los toriis del jardin.

   ►(12/08, Toni) FUERA las plataformas flotantes del fondo. Llevaban props
   del jardin y quedaban vistosas, pero en un minijuego donde lo que se lee
   es "que suelo me queda" son ruido: islas a las que no se puede llegar,
   a la altura de la mirada y con la misma silueta que el disco. El fondo
   lejano (nubes, montanas, Fuji) ya da profundidad de sobra.
   --------------------------------------------------------------------- */
function buildDecor(){
  if(typeof enableSJScenery === 'function') enableSJScenery(true);
}

/* ---------------------------------------------------------------------
   MURO INVISIBLE — el mismo patron que los muros laterales del juego
   (rebote posicional + velocidad hacia dentro). No impide CAER por el
   agujero, que es la unica forma de morir aqui.
   --------------------------------------------------------------------- */
function muro(a){
  const d = Math.hypot(a.pos.x, a.pos.z);
  if(d <= K.muroR || d < 0.001) return;
  const nx = a.pos.x / d, nz = a.pos.z / d;
  a.pos.x = nx * K.muroR; a.pos.z = nz * K.muroR;
  const vn = a.vel.x * nx + a.vel.z * nz;
  if(vn > 0){ a.vel.x -= vn * nx * 1.2; a.vel.z -= vn * nz * 1.2; }
}
function recinto(){
  if(typeof players !== 'undefined') for(const p of players){ if(!p.out) muro(p); }
  if(typeof minions !== 'undefined') for(const mn of minions){ if(!mn.dead) muro(mn); }
}

/* ---------------------------------------------------------------------
   CAIDA DE SECCIONES
   --------------------------------------------------------------------- */
function tiraSeccion(){
  if(T.caidos >= T.orden.length) return;
  const s = T.orden[T.caidos++];
  let n = 0;
  for(const t of T.tiles){
    if(t.state !== 'idle' || t.anillo !== s.anillo || t.sector !== s.sector) continue;
    t.state = 'aviso'; t.t = 0; n++;
  }
  if(n && typeof sfx !== 'undefined' && sfx.deny) try{ sfx.deny(); }catch(e){}
  pintaBorde();
}

function sueltaTile(t){
  t.state = 'cae'; t.t = 0; t.vy = 0;
  t.rot = (Math.random()-0.5) * 1.6;
  const i = platforms.indexOf(t.plat);
  if(i >= 0){ platforms.splice(i, 1); indiceSucio(); }   // deja de ser suelo EN EL MISMO frame
}

/* ---------------------------------------------------------------------
   PUNTOS — se leen del propio motor, sin tocarlo

   `ko()` ya le apunta la baja a `lastHitBy` (sc.kills). Aqui solo se mira
   el INCREMENTO de ese contador por jugador: quien tira, puntua; quien se
   cae, paga. Cero parches en el motor.
   --------------------------------------------------------------------- */
function puntos(){
  if(typeof players === 'undefined') return;
  for(const p of players){
    const k0 = T.kills.get(p) || 0;
    const k1 = (p.sc && p.sc.kills) || 0;
    if(k1 > k0){
      const suma = (k1 - k0) * K.ptsTirar;
      T.pts.set(p, (T.pts.get(p) || 0) + suma);
      if(typeof showCombo === 'function') showCombo(p, '+' + suma);
      T.kills.set(p, k1);
    }
    const d0 = T.caidasVistas || (T.caidasVistas = new Map());
    const c0 = d0.get(p) || 0;
    const c1 = (p.sc && p.sc.deaths) || 0;
    if(c1 > c0){
      T.pts.set(p, (T.pts.get(p) || 0) + (c1 - c0) * K.ptsCaer);
      d0.set(p, c1);
    }
  }
}

/* REAPARICION SIN FIN: se le repone la vida antes de que el motor lo
   declare fuera. En este minijuego caerse cuesta puntos, no la partida. */
function reponVidas(){
  if(typeof players === 'undefined') return;
  for(const p of players){ if(p.stocks < 2) p.stocks = 2; if(p.out) p.out = false; }
}

/* =====================================================================
   ►TRASTOS — los CACHARROS del jardin japones, dentro del disco

   El stage 3 ya tiene una caja de juguetes hecha y probada: el TAMBOR
   TAIKO que te dispara al cielo, el GONG pendular que barre a la altura
   del pecho y el DARUMA rodante que arrolla. Aqui no se inventa ninguno:
   se colocan los del jardin y se deja que los anime `updateStageJapan`
   (que sale por su guarda si el stage no es el suyo — por eso el HTML
   tiene un enganche de una linea para el 14, como los otros cinco).

   DONDE va cada uno, y por que:
   · GONGS en la CIMA. El nucleo no cae nunca, asi que no hay que
     gestionar su desaparicion... y ademas barren justo el sitio que se
     disputa: quedarse quieto siendo rey no sale gratis.
   · TAIKOS y DARUMAS en el anillo de fuera, que SI se cae. Cuando la
     loseta que los sostiene desaparece se van con ella (y dejan de
     golpear en el mismo frame: primero se desregistran, luego caen).
   ===================================================================== */

/* ¿queda loseta VIVA bajo este punto? (rejilla regular → indice directo) */
function hayLoseta(x, z){
  const ix = Math.round(x / K.cell), iz = Math.round(z / K.cell);
  const t = T.mapa && T.mapa.get(ix + ',' + iz);
  return !!(t && t.state === 'idle');
}

/* una loseta VIVA al azar dentro de una banda de radio (para sembrar cosas) */
function losetaEn(rmin, rmax){
  const cand = [];
  for(const t of T.tiles){
    if(t.state !== 'idle') continue;
    const r = Math.hypot(t.cx, t.cz);
    if(r >= rmin && r <= rmax) cand.push(t);
  }
  return cand.length ? cand[(Math.random()*cand.length)|0] : null;
}

function apunta(tr){ T.trastos.push(tr); return tr; }

function buildTrastos(){
  /* --- 2 GONGS: uno BARRE LA CIMA y el otro guarda la subida ---
     ►el gong es un objeto ESTRECHO (disco de radio 1,15 y prueba de golpe de
     1,65): colgado a un lado del podio pasaba de largo y no tocaba a nadie —
     medido, 0 golpes en 4 s con un tio quieto en la cima. Tiene que pendular
     POR ENCIMA del punto que se disputa, no cerca. */
  if(typeof sjBell === 'function'){
    const sitios = [
      { x:0, z:0,                        y:K.y + K.altoCima, ax:'x', ph:0 },              // cruza la cima de lado a lado
      { x:0, z:(K.Rcima + K.Rmin) * 0.5, y:K.y + K.altoMedio, ax:'x', ph:Math.PI },       // ...y otro barriendo el escalon
    ];
    for(const s of sitios){
      const g = sjBell(s.x, s.z, s.y, s.ax, 0.9, 0.85, s.ph);
      if(g) apunta({ g, kind:'bell', reg:_sjBells, ent:_sjBells[_sjBells.length-1], fijo:true });
    }
  }
  /* --- 4 TAIKOS en el anillo de fuera: el trampolin para volver --- */
  if(typeof sjTaiko === 'function'){
    for(let i = 0; i < 4; i++){
      const t = losetaEn(K.Rmin + 5, K.R - 5); if(!t) continue;
      const g = sjTaiko(t.cx, t.cz, K.y, 1.05);
      if(g) apunta({ g, kind:'taiko', x:t.cx, z:t.cz,
                     reg:bouncers, ent:bouncers[bouncers.length-1],
                     reg2:_sjTaikos, ent2:_sjTaikos[_sjTaikos.length-1] });
    }
  }
  /* --- 2 DARUMAS rodando por carriles opuestos --- */
  if(typeof sjDaruma === 'function'){
    const carriles = [ { x:0, z:K.Rmin + 7, ax:'x' }, { x:-(K.Rmin + 7), z:0, ax:'z' } ];
    for(const c of carriles){
      const g = sjDaruma(c.x, c.z, K.y, c.ax, K.R * 0.42, 0.5, 1.35);
      if(g) apunta({ g, kind:'daruma', reg:_sjDarumas, ent:_sjDarumas[_sjDarumas.length-1] });
    }
  }
  /* los cacharros se cuelgan del grupo del minijuego: asi `clear()` los barre de
     una vez. El grupo esta en el origen, asi que las coordenadas no cambian. */
  for(const tr of T.trastos) if(tr.g && tr.g.parent === scene){ scene.remove(tr.g); T.group.add(tr.g); }
}

/* deja de ser un peligro AHORA (desregistro) y se va cayendo */
function tiraTrasto(tr){
  if(tr.cae) return;
  tr.cae = true; tr.vy = 0; tr.t = 0;
  for(const par of [[tr.reg, tr.ent], [tr.reg2, tr.ent2]]){
    if(!par[0] || !par[1]) continue;
    const i = par[0].indexOf(par[1]); if(i >= 0) par[0].splice(i, 1);
  }
}

function trastosTick(dt){
  for(let i = T.trastos.length - 1; i >= 0; i--){
    const tr = T.trastos[i];
    if(!tr.cae){
      if(tr.fijo) continue;                               // los de la cima no se caen nunca
      const x = tr.g.position.x, z = tr.g.position.z;     // el daruma se mueve: se mira DONDE esta ahora
      if(!hayLoseta(x, z)) tiraTrasto(tr);
      continue;
    }
    tr.t += dt; tr.vy -= K.gravedad * dt;
    tr.g.position.y += tr.vy * dt;
    tr.g.rotation.z += dt * 1.4;
    if(tr.t > 3.2){ T.group.remove(tr.g); T.trastos.splice(i, 1); }
  }
}

/* =====================================================================
   ►BOMBA — el objeto que se agarra, se lleva y se LANZA

   Pedido de Toni: "bombas que se pueden agarrar y lanzar antes que
   exploten". Toda la gracia esta en que la MECHA no se para nunca: la
   bomba es un problema que se pasa de mano en mano, no un arma.

   No es un arma del motor (`WEAPON_DEFS`) a proposito: un arma se
   equipa, dispara y se gasta, y esto es justo lo contrario — un trasto
   que quema en las manos. Vive entera aqui, y el motor solo aporta el
   enganche de UNA linea que convierte el boton de ataque en "lanzar"
   mientras la llevas encima.

   El credito de la baja lo lleva `lastHitBy`, como todo lo demas: si
   revientas a alguien con la bomba y se cae, el motor ya te apunta el
   derribo y el marcador del minijuego lo cobra solo.
   ===================================================================== */
function _bombaMesh(){
  let m = (typeof getModel === 'function' && typeof DECOR_DEFS4 !== 'undefined')
            ? getModel('s4_bomb', DECOR_DEFS4) : null;
  if(!m){                                     // ...y si el asset no esta, una bomba de dibujos
    m = new THREE.Group();
    const cuerpo = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 10),
      new THREE.MeshStandardMaterial({ color:0x15161a, roughness:0.55, metalness:0.35 }));
    const cuello = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.26, 8),
      new THREE.MeshStandardMaterial({ color:0x5a4a34, roughness:0.9 }));
    cuello.position.y = 0.58; m.add(cuerpo); m.add(cuello);
  }
  const chispa = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6),
    new THREE.MeshBasicMaterial({ color:0xffd15a }));
  chispa.position.y = 0.82; m.add(chispa);
  m.userData.chispa = chispa;
  return m;
}

function sueltaBomba(){
  const t = losetaEn(0, K.R); if(!t) return;
  const m = _bombaMesh();
  m.position.set(t.cx, K.y + t.alt + 22, t.cz);
  T.group.add(m);
  T.bombas.push({ m, pos:m.position, vel:new THREE.Vector3(0, 0, 0),
                  state:'cae', mecha:K.mecha, owner:null, port:null });
  if(typeof ring === 'function') ring(new THREE.Vector3(t.cx, K.y + t.alt + 0.15, t.cz), 0xff8a2a, 14, .5);
  if(typeof showBanner === 'function' && T.bombas.length === 1) showBanner('¡BOMBAS!', 1.2);
}

function cogeBomba(p, b){
  b.state = 'mano'; b.port = p; p._arBomb = b;
  if(typeof sfx !== 'undefined' && sfx.weaponGet) try{ sfx.weaponGet(); }catch(e){}
}

/* el enganche del HTML entra por aqui: devuelve true si el ataque se ha
   convertido en un LANZAMIENTO (y entonces el motor no saca el martillo) */
function lanza(p, yaw){
  const b = p && p._arBomb; if(!b) return false;
  if(p.dead || p.hitstun > 0 || p.stun > 0 || p.hang) return false;
  if(yaw !== undefined) p.yaw = yaw;
  const fx = Math.sin(p.yaw), fz = Math.cos(p.yaw);
  b.state = 'vuela'; b.port = null; b.owner = p; p._arBomb = null;
  b.pos.set(p.pos.x + fx * 0.9, p.pos.y + 1.7, p.pos.z + fz * 0.9);
  b.vel.set(fx * K.bombaV, K.bombaVy, fz * K.bombaV);
  p.throwT = 0.24; p._animKick = (p._animKick || 0) + 1;   // ►WPNANIM: redispara el clip de lanzar
  if(typeof sfx !== 'undefined' && sfx.throwS) try{ sfx.throwS(); }catch(e){}
  return true;
}

/* la CPU no pasa por la cadena de ataque del humano: se le pilota aqui.
   Lanza a quien tenga mas cerca, y si la mecha se acaba la suelta a la
   desesperada (mejor lejos que en la mano). */
function iaBombas(dt){
  for(const p of players){
    if(!p.isAI || !p._arBomb || p.dead || p.out) continue;
    const b = p._arBomb;
    p._arThrow = Math.max(0, (p._arThrow || 0) - dt);
    let mejor = null, dm = 1e9;
    for(const q of players){
      if(q === p || q.dead || q.out) continue;
      const d = Math.hypot(q.pos.x - p.pos.x, q.pos.z - p.pos.z);
      if(d < dm){ dm = d; mejor = q; }
    }
    const apura = b.mecha < 1.5;                       // se le acaba: fuera como sea
    if((mejor && dm < 15 && p._arThrow <= 0) || apura){
      const yaw = mejor ? Math.atan2(mejor.pos.x - p.pos.x, mejor.pos.z - p.pos.z) : Math.random() * 6.283;
      if(lanza(p, yaw)) p._arThrow = 0.6;
    }
  }
}

function estalla(b){
  const c = b.pos.clone();
  if(typeof burst === 'function'){ burst(c, 0xff7a18, 26, 9, 7, 1.3); burst(c, 0x222222, 10, 6, 4, 1); }
  if(typeof ring === 'function') ring(c, 0xff8a2a, 28, .6);
  if(typeof shake !== 'undefined') shake = Math.max(shake, .8);
  if(typeof fovKick !== 'undefined') fovKick = Math.max(fovKick, .85);
  if(typeof sfx !== 'undefined' && sfx.bazooka) try{ sfx.bazooka(); }catch(e){}
  const R = K.bombaR;
  for(const p of players){
    if(p.dead || p.invuln > 0) continue;
    const dx = p.pos.x - c.x, dz = p.pos.z - c.z, dy = (p.pos.y + 1) - c.y;
    const d = Math.hypot(dx, dz, dy); if(d > R) continue;
    const k = 1 - d / R, propia = (p === b.owner || p === b.port);
    let ux = dx, uz = dz, l = Math.hypot(ux, uz);
    if(l < 0.01){ const a = Math.random() * 6.283; ux = Math.cos(a); uz = Math.sin(a); l = 1; }
    ux /= l; uz /= l;
    const dmg = K.bombaDmg * k * (propia ? 0.6 : 1) * (typeof defMul === 'function' ? defMul(p) : 1);
    p.damage += dmg;
    /* ►el credito: quien la lanzo se lleva el derribo si el otro se cae */
    if(!propia && b.owner && b.owner !== p){ p.lastHitBy = b.owner; if(typeof credit === 'function') credit(b.owner, dmg); }
    const kb = (K.bombaKb + p.damage * 0.14) * k * (propia ? 0.75 : 1);
    p.vel.set(ux * kb, 8 * k + 3.5, uz * kb);
    p.hitstun = Math.max(p.hitstun, .4); p.onGround = false; p.hang = null; p.hitFlash = .22; p.comboWindow = 0;
    if(typeof jiggle === 'function') jiggle(p, 18);
    if(p._arBomb && p._arBomb !== b){ p._arBomb.state = 'vuela'; p._arBomb.port = null; p._arBomb = null; }   // te vuela la que llevabas
  }
  for(const mn of (typeof minions !== 'undefined' ? minions : [])){
    if(mn.dead || mn.invuln > 0) continue;
    const d = Math.hypot(mn.pos.x - c.x, mn.pos.z - c.z, (mn.pos.y + mn.scale) - c.y);
    if(d > R) continue;
    if(typeof hurtEnemy === 'function') hurtEnemy(mn, 30 * (1 - d / R), false);
  }
  /* ►y ABRE UN AGUJERO: las losetas de alrededor se van con la explosion. Esto
     convierte la bomba en la unica forma de quitarle el suelo a alguien a mano
     (el reloj de secciones va a lo suyo, de fuera adentro). El PODIO no: es el
     unico terreno que la partida garantiza hasta el final. */
  for(const t of T.tiles){
    if(t.state !== 'idle' || t.anillo < 0) continue;
    if(Math.hypot(t.cx - c.x, t.cz - c.z) > K.bombaRompe) continue;
    sueltaTile(t);
  }
  pintaBorde();
  matarBomba(b);
}

function matarBomba(b){
  if(b.port) b.port._arBomb = null;
  T.group.remove(b.m);
  const i = T.bombas.indexOf(b); if(i >= 0) T.bombas.splice(i, 1);
}

function updateBombas(dt){
  if(!T.over){
    T.proxBomba -= dt;
    if(T.proxBomba <= 0){ sueltaBomba(); T.proxBomba = K.bombaCada; }
  }
  for(let i = T.bombas.length - 1; i >= 0; i--){
    const b = T.bombas[i];
    b.mecha -= dt;                                  // ►la mecha NO se para NUNCA
    if(b.state === 'mano'){
      const p = b.port;
      if(!p || p.dead || p.out){ b.state = 'vuela'; b.port = null; if(p) p._arBomb = null; }
      else { b.pos.set(p.pos.x, p.pos.y + 2.45, p.pos.z); b.m.rotation.y += dt * 2; }
    }
    if(b.state !== 'mano'){
      b.vel.y -= 30 * dt;
      b.pos.x += b.vel.x * dt; b.pos.y += b.vel.y * dt; b.pos.z += b.vel.z * dt;
      b.m.rotation.x += dt * 3; b.m.rotation.z += dt * 2;
      const suelo = (typeof platformTopAt === 'function') ? platformTopAt(b.pos.x, b.pos.z, 0.3) : null;
      if(suelo !== null && b.pos.y <= suelo + 0.55 && b.vel.y <= 0){
        b.pos.y = suelo + 0.55;
        b.vel.y = (Math.abs(b.vel.y) > 4) ? -b.vel.y * 0.32 : 0;   // un bote y a rodar
        b.vel.x *= 0.62; b.vel.z *= 0.62;
        if(b.state === 'cae' && typeof sfx !== 'undefined' && sfx.capLand) try{ sfx.capLand(); }catch(e){}
        b.state = 'suelo';
      }
      if(b.pos.y < K.y - 40){ matarBomba(b); continue; }           // se la trago el vacio
    }
    /* la chispa acelera segun se acaba la mecha (el aviso, sin numeros) */
    const urg = 1 - Math.max(0, b.mecha) / K.mecha;
    const ch = b.m.userData.chispa;
    if(ch){ const s = 1 + 0.7 * Math.abs(Math.sin(b.mecha * (4 + urg * 22))); ch.scale.setScalar(s); }
    if(Math.random() < dt * (6 + urg * 26) && typeof burst === 'function')
      burst(_v3.set(b.pos.x, b.pos.y + 0.85, b.pos.z), urg > 0.6 ? 0xff5a1a : 0xffd15a, 2, 3, 3.5, .35);
    if(b.mecha <= 0){ estalla(b); continue; }
    /* recogerla: basta pasar por encima con las manos libres */
    if(b.state === 'suelo'){
      for(const p of players){
        if(p.dead || p.out || p._arBomb) continue;
        if(Math.hypot(p.pos.x - b.pos.x, p.pos.z - b.pos.z) > 1.5) continue;
        if(Math.abs(p.pos.y - b.pos.y) > 2.6) continue;
        cogeBomba(p, b); break;
      }
    }
  }
  iaBombas(dt);
}

/* =====================================================================
   ►KOTH — el rey de la colina

   El podio no puntua por estar: puntua por estar SOLO. En cuanto sube un
   segundo el reloj se para, y lo que decide ya es a empujones — que es
   de lo que va el minijuego. No hay marcador en pantalla (decision de
   Toni): el aviso es el aro encendido y el "+N" que sale del que manda.
   ===================================================================== */
function creaAro(){
  const g = new THREE.Mesh(new THREE.TorusGeometry(K.Rcima * 0.92, 0.16, 8, 40),
    new THREE.MeshBasicMaterial({ color:0xffd15a, transparent:true, opacity:0.0 }));
  g.rotation.x = Math.PI / 2;
  g.position.set(0, K.y + K.altoCima + 0.12, 0);
  T.group.add(g); T.aro = g;
}

function koth(dt){
  let rey = null, empate = false;
  for(const p of players){
    if(p.dead || p.out) continue;
    if(Math.hypot(p.pos.x, p.pos.z) > K.Rcima + 0.5) continue;
    if(Math.abs(p.pos.y - (K.y + K.altoCima)) > 2.4) continue;     // ARRIBA, no debajo del podio
    if(rey) empate = true; else rey = p;
  }
  if(empate) rey = null;
  T.rey = rey;
  if(rey){
    T.pts.set(rey, (T.pts.get(rey) || 0) + K.kothPts * dt);
    T.reyT += dt;
    rey._arKothPop = (rey._arKothPop || 0) + K.kothPts * dt;
    if(T.reyT >= K.kothPop){
      T.reyT = 0;
      if(typeof showCombo === 'function') showCombo(rey, '+' + Math.round(rey._arKothPop));
      rey._arKothPop = 0;
    }
  } else T.reyT = 0;
  if(T.aro){
    const m = T.aro.material;
    m.opacity += ((rey ? 0.85 : 0.22) - m.opacity) * Math.min(1, dt * 4);
    if(rey && rey.color !== undefined) m.color.set(rey.color);
    else m.color.set(0xffd15a);
    T.aro.scale.setScalar(1 + (rey ? 0.03 * Math.sin(T.t * 7) : 0));
  }
}

/* =====================================================================
   ►RELOJ — lo unico que se anade al HUD (Toni: nada de marcadores)
   ===================================================================== */
function creaReloj(){
  /* el caos no sube en el disco (guarda en el HTML) → su contador sobra en el HUD */
  const ch = document.getElementById('chaos'); if(ch) ch.style.display = 'none';
  let d = document.getElementById('arenaReloj');
  if(!d){
    d = document.createElement('div');
    d.id = 'arenaReloj';
    d.style.cssText = 'position:absolute;top:6px;left:50%;transform:translateX(-50%);' +
      'font:900 34px/1 system-ui,sans-serif;color:#fff;letter-spacing:2px;' +
      'text-shadow:0 3px 0 rgba(0,0,0,.55),0 0 18px rgba(0,0,0,.4);pointer-events:none;z-index:6';
    (document.getElementById('hud') || document.body).appendChild(d);
  }
  T.reloj = d;
}
function pintaReloj(){
  if(!T.reloj) return;
  const q = Math.max(0, K.dur - T.t);
  const mm = Math.floor(q / 60), ss = Math.floor(q % 60);
  T.reloj.textContent = mm + ':' + (ss < 10 ? '0' : '') + ss;
  const poco = q <= 15;
  T.reloj.style.color = poco ? (Math.floor(q * 4) % 2 ? '#ff5a4a' : '#fff') : '#fff';
  T.reloj.style.fontSize = poco ? '44px' : '34px';
}

/* ---------------------------------------------------------------------
   TICK
   --------------------------------------------------------------------- */
function tick(dt){
  if(!T.built) return;
  T.t += dt;

  /* --- 1. el disco se deshace --- */
  if(!T.over && T.t >= T.proxCaida && T.caidos < T.orden.length){
    tiraSeccion();
    T.proxCaida = T.t + T.caeCada;
  }

  let dirtyM = false;
  for(const t of T.tiles){
    if(t.state === 'idle') continue;
    t.t += dt;
    _sc.set(1, t.sy, 1);
    if(t.state === 'aviso'){
      /* tiembla en el sitio: se ve venir (y da tiempo a salir) */
      const s = Math.sin(t.t * 46) * 0.10;
      _v3.set(t.cx + s, t.y0 + Math.sin(t.t * 37) * 0.06, t.cz - s);
      _e3.set(0, 0, 0); _q4.setFromEuler(_e3);
      _m4.compose(_v3, _q4, _sc);
      T.inst.setMatrixAt(t.i, _m4); dirtyM = true;
      if(t.t >= K.aviso) sueltaTile(t);
    } else if(t.state === 'cae'){
      t.vy -= K.gravedad * dt;
      t.dy = (t.dy || 0) + t.vy * dt;
      _e3.set(t.rot * t.t, 0, t.rot * t.t * 0.7); _q4.setFromEuler(_e3);
      _v3.set(t.cx, t.y0 + t.dy, t.cz);
      _m4.compose(_v3, _q4, _sc);
      T.inst.setMatrixAt(t.i, _m4); dirtyM = true;
      if(t.t >= K.vidaCasc){
        t.state = 'ido';
        _m4.makeScale(0.0001, 0.0001, 0.0001);
        T.inst.setMatrixAt(t.i, _m4);
      }
    }
  }
  if(dirtyM) T.inst.instanceMatrix.needsUpdate = true;

  /* --- 2. los cacharros del jardin, las bombas y el podio ---
     `updateStageJapan` es el animador del stage 3 (taiko/gong/daruma): sale por
     su propia guarda si el STAGE no es el suyo, y el HTML la abre tambien al 14. */
  if(typeof updateStageJapan === 'function') updateStageJapan(dt);
  trastosTick(dt);
  updateBombas(dt);
  koth(dt);
  pintaReloj();

  /* --- 3. recinto, vidas y marcador --- */
  recinto();
  reponVidas();
  puntos();

  /* --- 4. el reloj --- */
  if(!T.over && T.t >= K.dur){
    T.over = true;
    let mejor = null, max = -1e9;
    if(typeof players !== 'undefined') for(const p of players){
      const v = T.pts.get(p) || 0;
      if(v > max){ max = v; mejor = p; }
    }
    if(typeof showBanner === 'function')
      showBanner(mejor ? ('¡' + (mejor.label || '') + ' CAMPEÓN!  ' + Math.round(max) + ' pts') : '¡SE ACABÓ EL TIEMPO!', 2.6);
    if(typeof crowdCheer === 'function') crowdCheer(.8);
    setTimeout(()=>{ if(typeof endGame === 'function' && !gameOver) endGame(); }, 1600);
  }
}

/* ---------------------------------------------------------------------
   PUNTOS DE APARICION — repartidos en el nucleo, que es lo que no cae
   --------------------------------------------------------------------- */
function spawnPoint(idx, total){
  const n = Math.max(1, total || 4);
  const a = (idx / n) * Math.PI * 2 + 0.4;
  /* en el ESCALON, no en la cima: reaparecer no puede regalar el podio */
  const r = (K.Rcima + K.Rmin) * 0.5;
  return { x: Math.cos(a) * r, y: K.y + K.altoMedio + 2.2, z: Math.sin(a) * r };
}

/* ---------------------------------------------------------------------
   TEMA — el del jardin japones, tal cual
   --------------------------------------------------------------------- */
function applyTheme(){
  /* el tema del jardín es `_applySJTheme` (SJ = el bloque de Japón), NO
     "_applyS3Theme": el stage 3 se llama S3 en la numeración vieja pero su
     código vive con el prefijo SJ */
  if(typeof _applySJTheme === 'function') _applySJTheme();
  if(typeof VISUAL !== 'undefined'){
    VISUAL.fog.far = 240;              // el disco flota: se tiene que ver el fondo lejano
    VISUAL.exposure = 0.72;
    /* ►los COSTADOS del disco y del podio son caras verticales grandes mirando en
       contra del sol: sin relleno salen casi negras y el podio se lee como una
       mancha. No es sombra, es falta de ambiente (ver luz-caras-verticales-fill). */
    if(VISUAL.fill){ VISUAL.fill.color = 0xd8c6e0; VISUAL.fill.intensity = 0.40; }
  }
}

const ARENA = {
  on:false, K, T,
  segBuilders: [ ()=>{}, ()=>{}, ()=>{}, ()=>{}, ()=>{}, ()=>{} ],   // la cinta no construye: el disco es suelto
  applyTheme, tick, spawnPoint, build, clear,
  lanza,                       // ►BOMBA: lo llama el enganche del boton de ataque
  get suelo(){ return K.y; },
  rebuild(){ build(); },
  bomba(){ sueltaBomba(); },   // para probarla a mano desde consola
  marcador(){
    const out = [];
    if(typeof players !== 'undefined') for(const p of players)
      out.push({ quien:p.label || '', pts:Math.round(T.pts.get(p) || 0), tirados:(p.sc && p.sc.kills) || 0, caidas:(p.sc && p.sc.deaths) || 0 });
    return out.sort((a,b) => b.pts - a.pts);
  },
};
window.ARENA = ARENA;

function boot(){
  if(ARENA.on) return;
  if(typeof THREE === 'undefined') return;
  if(typeof launchMatch !== 'function' || typeof platforms === 'undefined' || typeof players === 'undefined') return;
  if(typeof _charTpls === 'undefined' || !_charTpls || !Object.keys(_charTpls).length) return;
  ARENA.on = true;
  MATCH.mode = 'solo';
  MATCH.cpus = Math.max(0, Math.min(5, _num('cpus', 3)));
  MENU_STAGE = 14;
  launchMatch();
}
const _bt = setInterval(()=>{ boot(); if(ARENA.on) clearInterval(_bt); }, 80);
boot();

})();
