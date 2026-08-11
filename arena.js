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

  /* --- recinto y decorado --- */
  muroR:    52,      // ►MURO INVISIBLE: el disco llega a 36, esto deja aire para el empujon
  decorN:   16,      // plataformas de fondo (SOLO VISUALES)
  decorRmin:78,      // muy por fuera del muro: imposible llegar
  decorRmax:150,
  decorSep: 5,
};

const T = {
  built:false, group:null, inst:null, tiles:[], plats:[], cascotes:[],
  t:0, over:false, proxCaida:0, caidos:0, orden:[], pts:new Map(), kills:new Map(),
};

/* ---------------------------------------------------------------------
   HELPERS de three reutilizados (uno por tipo, no uno por loseta)
   --------------------------------------------------------------------- */
const _v3 = new THREE.Vector3(), _q4 = new THREE.Quaternion(),
      _s3 = new THREE.Vector3(1,1,1), _m4 = new THREE.Matrix4(),
      _e3 = new THREE.Euler(), _col = new THREE.Color();

/* tonos de la piedra del jardin japones: gris con matices, nada de arcoiris */
const TINTES = [[0.62,0.64,0.68], [0.58,0.60,0.65], [0.66,0.67,0.70], [0.54,0.57,0.62]];
/* el ANILLO EXTERIOR vivo se tine de rojo torii: es el aviso de "esto es lo siguiente" */
const TINTE_BORDE = [0.72, 0.30, 0.26];

/* el motor cachea las plataformas sueltas en un índice; tocar `platforms` sin
   avisar deja losetas fantasma que se pueden pisar. `indiceSucio` NO es del
   motor: cuadrimania.js declara la suya y aquí hace falta la propia. */
function indiceSucio(){ if(typeof _looseDirty !== 'undefined') _looseDirty = true; }

function clear(){
  if(T.group && typeof scene !== 'undefined'){ scene.remove(T.group); }
  if(typeof platforms !== 'undefined' && T.plats.length){
    for(const p of T.plats){ const i = platforms.indexOf(p); if(i >= 0) platforms.splice(i, 1); }
    if(typeof indiceSucio === 'function') indiceSucio();
  }
  T.group = null; T.inst = null;
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
     instanceColor, que multiplica al `color` del material — así que el material
     va blanco y a secas. (cuadrimania sí usa vertexColors porque su geometría se
     construye a mano CON su atributo de color.) */
  const mat = new THREE.MeshStandardMaterial({ color:0xffffff,
                                               roughness:0.93, metalness:0, flatShading:true });
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
    /* ►la rejilla va ALINEADA A LOS EJES: el AABB ES la loseta (ver cabecera) */
    const plat = { minX:cx-half, maxX:cx+half, minZ:cz-half, maxZ:cz+half,
                   topY:K.y, baseY:K.y - K.h - 0.1, solid:true };
    const jt = 0.93 + Math.random() * 0.14;
    const tinte = TINTES[(Math.abs(Math.round(cx/K.cell) * 3 + Math.round(cz/K.cell) * 7)) % TINTES.length];
    const tile = { i, cx, cz, plat, anillo:c.anillo, sector:c.sector,
                   state:'idle', t:0, vy:0, rot:0,
                   r:tinte[0]*jt, g:tinte[1]*jt, b:tinte[2]*jt };
    plat._arena = tile;
    platforms.push(plat); T.plats.push(plat); T.tiles.push(tile);

    _e3.set(0,0,0); _q4.setFromEuler(_e3); _v3.set(cx, 0, cz);
    _m4.compose(_v3, _q4, _s3);
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

  buildDecor();
  pintaBorde();
  indiceSucio();
  if(typeof enableWeather === 'function') enableWeather(false);

  T.built = true; T.t = 0; T.over = false; T.proxCaida = 6; T.caidos = 0;
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
   DECORADO — el del jardin japones, tal cual, y plataformas al fondo

   Mismo criterio que en cuadrimania: antes de inventar un fondo, mirar si
   el stage ya lo tiene. `enableSJScenery(true)` monta el mar de nubes, el
   Fuji y los toriis del jardin; encima van plataformas flotando MUY por
   fuera del muro invisible, hechas con el `s3Slab` del propio juego y
   vestidas con sus props. Son SOLO VISUALES.
   --------------------------------------------------------------------- */
function soloDecor(fn){
  const p0 = platforms.length, c0 = scene.children.length;
  const capPrev = (typeof _CAP !== 'undefined') ? _CAP : false;
  if(typeof _CAP !== 'undefined') _CAP = true;      // s2Floor/getModel salen de vacio si no
  try { fn(); } catch(e){ console.warn('[ARENA] decorado:', e); }
  if(typeof _CAP !== 'undefined') _CAP = capPrev;
  if(platforms.length > p0){ platforms.splice(p0, platforms.length - p0); indiceSucio(); }
  const nuevos = scene.children.slice(c0);
  for(const o of nuevos){ scene.remove(o); T.group.add(o); }
  return nuevos;
}

function buildDecor(){
  if(typeof enableSJScenery === 'function') enableSJScenery(true);

  const props = ['sj_torii','sj_lantern','sj_lamp','sj_maple1','sj_maple2','sj_maple3',
                 'sj_maple4','sj_maple5','sj_bamboo','sj_bamboo2','sj_statue','sj_door',
                 'sj_flowers','sj_grass','sj_path'];
  const puestas = [];
  for(let i = 0; i < K.decorN; i++){
    const sx = 9 + Math.random()*13, sz = 9 + Math.random()*13;
    let x = 0, z = 0, y = 0, sitio = false;
    for(let intento = 0; intento < 40 && !sitio; intento++){
      const a  = (i / K.decorN) * Math.PI * 2 + (Math.random()-0.5) * 0.9;
      const rr = K.decorRmin + Math.random() * (K.decorRmax - K.decorRmin);
      x = Math.cos(a) * rr; z = Math.sin(a) * rr;
      y = K.y - 26 + Math.random() * 52;
      sitio = true;
      for(const q of puestas){
        const dxz = Math.hypot(x - q.x, z - q.z), dy = Math.abs(y - q.y);
        if(dxz < (sx + q.sx) * 0.5 + K.decorSep && dy < 10){ sitio = false; break; }
      }
    }
    if(!sitio) continue;
    puestas.push({ x, z, y, sx, sz });
    soloDecor(()=>{
      if(typeof s3Slab === 'function') s3Slab(x, z, sx, sz, y, 'rose');
      if(typeof getModel === 'function' && typeof DECOR_DEFSJ !== 'undefined'){
        const nP = 2 + ((Math.random()*3)|0), colocados = [];
        for(let k = 0; k < nP; k++){
          const key = props[(Math.random()*props.length)|0];
          const m = getModel(key, DECOR_DEFSJ); if(!m) continue;
          const sc = 0.9 + Math.random()*0.7;
          const rad = ((DECOR_DEFSJ[key] && DECOR_DEFSJ[key].size) || 2) * sc * 0.5;
          let px = 0, pz = 0, ok = false;
          for(let it = 0; it < 20 && !ok; it++){
            px = x + (Math.random()-0.5) * Math.max(1, sx - rad*2 - 1);
            pz = z + (Math.random()-0.5) * Math.max(1, sz - rad*2 - 1);
            ok = true;
            for(const c of colocados) if(Math.hypot(px-c.x, pz-c.z) < rad + c.r + 0.6){ ok = false; break; }
          }
          if(!ok) continue;
          colocados.push({ x:px, z:pz, r:rad });
          m.scale.multiplyScalar(sc);
          m.position.set(px, y, pz);
          m.rotation.y = Math.random() * Math.PI * 2;
          scene.add(m);
        }
      }
    });
  }
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
    if(t.state === 'aviso'){
      /* tiembla en el sitio: se ve venir (y da tiempo a salir) */
      const s = Math.sin(t.t * 46) * 0.10;
      _v3.set(t.cx + s, Math.sin(t.t * 37) * 0.06, t.cz - s);
      _e3.set(0, 0, 0); _q4.setFromEuler(_e3);
      _m4.compose(_v3, _q4, _s3);
      T.inst.setMatrixAt(t.i, _m4); dirtyM = true;
      if(t.t >= K.aviso) sueltaTile(t);
    } else if(t.state === 'cae'){
      t.vy -= K.gravedad * dt;
      t.dy = (t.dy || 0) + t.vy * dt;
      _e3.set(t.rot * t.t, 0, t.rot * t.t * 0.7); _q4.setFromEuler(_e3);
      _v3.set(t.cx, t.dy, t.cz);
      _m4.compose(_v3, _q4, _s3);
      T.inst.setMatrixAt(t.i, _m4); dirtyM = true;
      if(t.t >= K.vidaCasc){
        t.state = 'ido';
        _m4.makeScale(0.0001, 0.0001, 0.0001);
        T.inst.setMatrixAt(t.i, _m4);
      }
    }
  }
  if(dirtyM) T.inst.instanceMatrix.needsUpdate = true;

  /* --- 2. recinto, vidas y marcador --- */
  recinto();
  reponVidas();
  puntos();

  /* --- 3. el reloj --- */
  if(!T.over && T.t >= K.dur){
    T.over = true;
    let mejor = null, max = -1e9;
    if(typeof players !== 'undefined') for(const p of players){
      const v = T.pts.get(p) || 0;
      if(v > max){ max = v; mejor = p; }
    }
    if(typeof showBanner === 'function')
      showBanner(mejor ? ('¡' + (mejor.label || '') + ' CAMPEÓN!  ' + max + ' pts') : '¡SE ACABÓ EL TIEMPO!', 2.6);
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
  const r = K.Rmin * 0.62;
  return { x: Math.cos(a) * r, y: K.y + 2.2, z: Math.sin(a) * r };
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
  }
}

const ARENA = {
  on:false, K, T,
  segBuilders: [ ()=>{}, ()=>{}, ()=>{}, ()=>{}, ()=>{}, ()=>{} ],   // la cinta no construye: el disco es suelto
  applyTheme, tick, spawnPoint, build, clear,
  get suelo(){ return K.y; },
  rebuild(){ build(); },
  marcador(){
    const out = [];
    if(typeof players !== 'undefined') for(const p of players)
      out.push({ quien:p.label || '', pts:T.pts.get(p) || 0, tirados:(p.sc && p.sc.kills) || 0, caidas:(p.sc && p.sc.deaths) || 0 });
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
