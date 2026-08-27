/* =====================================================================
   ►ARENA — el minijuego de REY DE LA COLINA sobre 5 pagodas  ·  v3

   Se entra con:  rumble_arena_cinta_v4.html?arena
   Sin esa query, este fichero sale en su primera linea (coste cero).

   ---------------------------------------------------------------------
   QUE ES (encargo de Toni, 12/08/2026)

   Cinco plataformas escalonadas puestas como el CINCO DE UN DADO —una en
   cada esquina y otra en el centro—, muy separadas entre si y unidas por
   puentes colgantes de los que no te puedes caer por los lados.

   Solo se puntua de UNA manera: estando en el PICO de la plataforma que
   toque. Y la colina CAMBIA de plataforma cada 30 s, asi que cada medio
   minuto todo el mundo tiene que cruzar el mapa otra vez.

   TRES DECISIONES, y las tres tienen su porque:

   1) PUNTUA SOLO EL PICO, y solo si estas SOLO en el. Con un pico de una
      losa de ancho, eso convierte cada turno en una pelea por un metro
      cuadrado en vez de en una carrera de golpes por el mapa.

   2) LA COLINA SE MUEVE. Sin eso, quien gana el pico lo defiende cuesta
      abajo contra todo el que sube, y el minijuego se acaba a los 20 s.
      Moviendola, la ventaja caduca: a los 30 s hay que bajar y cruzar.

   3) LOS PUENTES TIENEN CARRIL. Un puente colgante sin paredes es un
      pasillo de la muerte donde el primer empujon decide el turno; con
      carril, cruzar es seguro y lo que se pelea es el pico.

   ---------------------------------------------------------------------
   POR QUE ES UN STAGE Y NO OTRO descenso.js

   Igual que cuadrimania: esto NO es un mundo aparte, es una PARTIDA DE
   RUMBLEBOYS en un escenario nuevo (STAGE 14, fuera de CAMPAIGN_STAGES).
   Asi el combate, el empujon, el % de dano, los esqueletos y la IA salen
   gratis del motor — que es justo lo que hace falta en un minijuego cuya
   gracia es pegarse.

   Y LAS PLATAFORMAS LAS CONSTRUYE EL JUEGO, no este fichero: cada piso es
   un `s2Floor`, el mismo constructor de las plataformas del jardin
   japones (tapa redondeada con su bisel, labio y tierra colgante, todo
   con las texturas multitono del stage). Para que elija los materiales de
   Japon se construye con `STAGE` puesto a 3 un momento — es lo que mira
   ese constructor para decidir paleta y vestido.

   ---------------------------------------------------------------------
   AFINADO EN VIVO:  ARENA.K   (y ARENA.rebuild() para reconstruir)
   ===================================================================== */
(function(){
'use strict';
/* ►SE DEFINE SIEMPRE, PERO NO ARRANCA SOLO.
   Antes salia aqui mismo sin `?arena` en la URL, y eso rompia el STAGE 14
   dentro de la campana: `applyStageTheme(14)` llama a `ARENA.applyTheme()`, que
   no existia, la excepcion se comia el resto del tema y el mapa salia a medias
   ("carga lo que le sale de la polla", dixit Toni). Ahora el modulo se define
   siempre y lo unico que cuelga del parametro es el ARRANQUE AUTOMATICO. */
const SUELTO = /[?&]arena(=|&|$)/.test(location.search);

const _qs  = new URLSearchParams(location.search);
const _num = (k, d)=>{ const v = parseFloat(_qs.get(k)); return isFinite(v) ? v : d; };

/* ---------------------------------------------------------------------
   K — todos los numeros del minijuego en un sitio (afinable en consola)
   --------------------------------------------------------------------- */
const K = {
  /* --- las 5 plataformas (el cinco del dado) --- */
  sep:      46,      // ►distancia del centro a cada esquina (en los dos ejes)
  pisos:    5,       // escalones de cada pagoda (el de arriba es el PICO)
  paso:     3.0,     // lo que sube cada escalon; el salto del juego cubre 5,01
  picoLado: 6,       // lado de la losa del PICO — la zona que puntua
  ancho:    5,       // cuanto crece cada escalon al bajar (6 → 11 → 16 → 21 → 26)

  /* --- puentes colgantes --- */
  puenteW:  4.2,     // ancho del tablero
  puenteSag:1.6,     // comba
  carril:   0.55,    // margen del carril invisible respecto al borde
  /* ►cuanto se meten los extremos DENTRO de la losa (1 = justo en su arista).
     OJO al margen: el piso de abajo solo deja un ANILLO pisable entre el escalon
     de arriba y su borde (aqui, de 10,5 a 13 de semilado). Con 0,70 el extremo
     caia a 9,1, o sea DEBAJO del escalon siguiente: el puente nacia enterrado.
     0,88 lo deja a 11,4 — dentro del anillo y a 1,6 de la esquina, que es lo que
     hace falta para que la esquina redondeada de la tapa no lo deje al aire. */
  anclaje:  0.88,

  /* --- rey de la colina --- */
  turno:    30,      // s que la colina se queda en un pico
  aviso:    4,       // s de antelacion con que se anuncia el cambio
  kothPts:  20,      // puntos por segundo mandando SOLO en el pico
  kothPop:  2.0,     // cada cuanto sale el "+N" (no hay marcador)

  /* --- bombas (se quedan: son lo que saca a alguien de un pico) --- */
  bombaCada:8.0, mecha:5.2, bombaR:5.8, bombaDmg:12, bombaKb:18,
  bombaV:17, bombaVy:7,

  /* --- reglas --- */
  caos:     7,       // nivel de CAOS clavado (solo se usa para el tamaño de la horda)
  dur:      120,     // 2 minutos (Toni) = 4 turnos de colina
  respawn:  1.4,
  y:        0,       // cota base (el suelo de las plataformas arranca aqui)
};

const T = {
  built:false, group:null, plats:[], torres:[], puentes:[],
  t:0, over:false, pts:new Map(),
  bombas:[], proxBomba:0,
  colina:0, proxTurno:0, avisado:false, rey:null, reyT:0, aro:null, haz:null,
  reloj:null,
};

const _v3 = new THREE.Vector3();

/* ---------------------------------------------------------------------
   El motor cachea las plataformas sueltas en un indice; tocar `platforms`
   sin avisar deja suelo fantasma. `indiceSucio` NO es del motor:
   cuadrimania.js declara la suya y aqui hace falta la propia.
   --------------------------------------------------------------------- */
function indiceSucio(){ if(typeof _looseDirty !== 'undefined') _looseDirty = true; }

function clear(){
  if(typeof players !== 'undefined') for(const p of players) p._arBomb = null;
  T.bombas.length = 0;
  if(T.group && typeof scene !== 'undefined') scene.remove(T.group);
  if(typeof platforms !== 'undefined' && T.plats.length){
    for(const p of T.plats){ const i = platforms.indexOf(p); if(i >= 0) platforms.splice(i, 1); }
    indiceSucio();
  }
  T.group = null; T.aro = null; T.haz = null;
  T.plats.length = 0; T.torres.length = 0; T.puentes.length = 0;
  T.pts.clear();
  if(T.reloj && T.reloj.parentNode) T.reloj.parentNode.removeChild(T.reloj);
  T.reloj = null;
  const ch = document.getElementById('chaos'); if(ch) ch.style.display = '';
  if(typeof _boundaryWalls !== 'undefined') for(const w of _boundaryWalls) w.visible = true;   // se lo devolvemos al resto del juego
  T.built = false; T.over = false;
}

/* ---------------------------------------------------------------------
   ►ESTILO DEL STAGE — construir "como si" fuese el jardin japones

   `s2Floor` (y su vestido `dressTopSakura`) eligen paleta y decoracion
   MIRANDO `STAGE`. Con el 14 caerian en los materiales del desierto. Se
   cambia un instante durante la construccion, que es sincrona: nadie mas
   lee `STAGE` en ese hueco. Y `_CAP` es la guarda de "estoy construyendo
   un segmento": sin ella `s2Floor` se sale por su primera linea.
   --------------------------------------------------------------------- */
function conEstiloJapon(fn){
  const stPrev = STAGE, capPrev = (typeof _CAP !== 'undefined') ? _CAP : false;
  const p0 = platforms.length, c0 = scene.children.length;
  STAGE = 3;
  if(typeof _CAP !== 'undefined') _CAP = true;
  try { fn(); }
  catch(e){ console.warn('[ARENA] construccion:', e); }
  finally {
    STAGE = stPrev;
    if(typeof _CAP !== 'undefined') _CAP = capPrev;
  }
  /* lo construido se APUNTA (para poder desmontarlo) y se cuelga del grupo
     del minijuego, que es lo unico que hay que quitar al terminar */
  for(let i = p0; i < platforms.length; i++) T.plats.push(platforms[i]);
  const nuevos = scene.children.slice(c0);
  for(const o of nuevos){ scene.remove(o); T.group.add(o); }
  indiceSucio();
}

/* ---------------------------------------------------------------------
   UNA PAGODA — pisos cuadrados que encogen, con la tapa redondeada del
   stage. Devuelve la ficha con la cota y el ancho de su PICO.
   --------------------------------------------------------------------- */
function pagoda(cx, cz){
  const n = K.pisos;
  const p0 = T.plats.length;
  conEstiloJapon(()=>{
    for(let i = 0; i < n; i++){
      const lado = K.picoLado + K.ancho * i;          // i=0 es el PICO
      const topY = K.y + K.paso * (n - i);
      /* el pico en 'sakura' (el magenta intenso del stage) y los escalones en
         'moss' (su magenta frio): la silueta se lee desde la otra punta del mapa */
      s2Floor(cx, cz, lado, lado, topY, i === 0 ? 'sakura' : 'moss');
    }
  });
  /* ►MACIZA HASTA ABAJO. `s2Floor` le da a cada losa un cuerpo de 4,5 de alto
     (`baseY = topY − 4.5`), que es lo que necesita una plataforma suelta de la
     cinta. Apiladas en pagoda deja HUECOS: por debajo de esa banda el AABB deja
     de existir, y quien entra ahi —cayendo pegado al costado, o de un empujon
     fuerte— se cuela DENTRO de la piramide y sale por el otro lado. Medido: un
     lanzamiento a 45 u/s contra el costado acababa dentro y 5 u por debajo.
     Bajando el `baseY` de todas sus losas a la peana, la pagoda es un bloque
     solido a cualquier altura y `collideWalls` la trata como muro siempre. */
  for(let i = p0; i < T.plats.length; i++) T.plats[i].baseY = K.y - 3;

  const t = { cx, cz, picoY:K.y + K.paso * n, picoLado:K.picoLado,
              baseY:K.y + K.paso, baseLado:K.picoLado + K.ancho * (n - 1) };
  T.torres.push(t);
  return t;
}

/* ---------------------------------------------------------------------
   ►PUENTE COLGANTE con CARRIL

   `addRopeBridge` (el del juego) solo sabe de ejes: decide `alongX` y usa
   el punto medio para la otra coordenada, asi que una diagonal le sale
   RECTA y en el sitio equivocado. Aqui hacen falta diagonales (del centro
   a las esquinas), asi que este monta el mismo lenguaje —tablones con
   comba, dos cuerdas y postes— en cualquier direccion.

   La colision es un AABB CUADRADO por tablon, mas ancho que el tablon a
   proposito: en diagonal, dos cuadrados centrados a la distancia del paso
   dejarian muescas por las que se cuela un pie. El carril lateral (abajo)
   se encarga de que ese sobre-ancho no se note.
   --------------------------------------------------------------------- */
function puente(ax, az, bx, bz, y, pa, pb){
  const dx = bx - ax, dz = bz - az, len = Math.hypot(dx, dz);
  if(len < 4) return null;
  const ux = dx / len, uz = dz / len;                 // a lo largo
  const px = -uz, pz = ux;                            // perpendicular
  const n = Math.max(6, Math.round(len / 2.0));
  const segL = len / n;
  /* el AABB tiene que cubrir el ANCHO del tablero ademas del paso: si se queda
     mas estrecho que el carril, el carril te deja de pie sobre el vacio */
  const half = Math.max(segL * 0.75, K.puenteW * 0.5);
  const g = new THREE.Group(); g.userData.noOcc = true;
  const yaw = Math.atan2(ux, uz);
  const comba = t => -K.puenteSag * Math.sin(Math.PI * t);

  const madera = (typeof _facetMat === 'function' && typeof S2_WOODP_PAL !== 'undefined')
    ? null : new THREE.MeshStandardMaterial({ color:0x8a5a34, roughness:0.9 });

  for(let i = 0; i < n; i++){
    const tc = (i + 0.5) / n;
    const cx = ax + dx * tc, cz = az + dz * tc, cy = y + comba(tc);
    let plank;
    if(typeof _facetBox === 'function' && typeof S2_WOODP_PAL !== 'undefined'){
      const pal = [S2_WOODP_PAL[i % S2_WOODP_PAL.length], S2_WOODP_PAL[(i + 2) % S2_WOODP_PAL.length]];
      plank = _facetBox(segL * 0.86, 0.18, K.puenteW, pal, 0.10);       // ►los tablones del juego, no una caja lisa
    } else {
      plank = new THREE.Mesh(new THREE.BoxGeometry(segL * 0.86, 0.18, K.puenteW), madera);
    }
    plank.position.set(cx, cy, cz); plank.rotation.y = yaw + Math.PI / 2;
    plank.castShadow = plank.receiveShadow = true; g.add(plank);
    const pl = { minX:cx - half, maxX:cx + half, minZ:cz - half, maxZ:cz + half,
                 topY:cy + 0.10, baseY:cy - 0.6, float:true, step:0.7 };   // step: la comba no te descuelga
    platforms.push(pl); T.plats.push(pl);
  }
  /* dos cuerdas a los lados (siguen la comba) + postes en los extremos */
  const cuerdaMat = new THREE.MeshStandardMaterial({ color:0x3a2a1e, roughness:0.95 });
  for(const s of [-1, 1]) for(let i = 0; i < n; i++){
    const tc = (i + 0.5) / n;
    const cx = ax + dx * tc + px * s * K.puenteW * 0.5;
    const cz = az + dz * tc + pz * s * K.puenteW * 0.5;
    const r = new THREE.Mesh(new THREE.BoxGeometry(segL, 0.10, 0.10), cuerdaMat);
    r.position.set(cx, y + 1.0 + comba(tc) * 0.85, cz); r.rotation.y = yaw + Math.PI / 2;
    g.add(r);
  }
  for(const e of [[ax, az], [bx, bz]]) for(const s of [-1, 1]){
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 1.8, 6), cuerdaMat);
    post.position.set(e[0] + px * s * K.puenteW * 0.5, y + 0.7, e[1] + pz * s * K.puenteW * 0.5);
    post.castShadow = true; g.add(post);
  }
  T.group.add(g);
  T.puentes.push({ ax, az, bx, bz, y, ux, uz, px, pz, len, pa, pb });   // pa/pb: que pagodas une (ruta de la CPU)
  indiceSucio();
  return g;
}

/* ►CARRIL: mientras estas sobre un puente no puedes salirte por el lado.
   Se proyecta la posicion sobre el vano y se pega el desvio lateral al
   ancho del tablero (y se mata la velocidad que te sacaba).

   ►Y NO ACTUA SI TIENES SUELO SOLIDO BAJO LOS PIES. Los puentes ANCLAN dentro
   de las pagodas, asi que sus extremos pasan por encima de la plataforma: sin
   esta guarda, pasear por esa zona de la losa te arrastraba de lado hacia el
   carril en cada frame — un tiron constante en un sitio donde no hay puente
   que valga. Es la misma familia de fallo que el muro del motor. */
function carriles(){
  const lim = K.puenteW * 0.5 - K.carril;
  const uno = a => {
    const sol = (typeof platformTopAt === 'function') ? platformTopAt(a.pos.x, a.pos.z, 0.3) : null;
    if(sol !== null && Math.abs(a.pos.y - sol) < 0.8) return;      // de pie en una pagoda: el carril no pinta nada
    for(const b of T.puentes){
      const rx = a.pos.x - b.ax, rz = a.pos.z - b.az;
      const t = rx * b.ux + rz * b.uz;
      if(t < -0.5 || t > b.len + 0.5) continue;
      const u = t / b.len, yb = b.y - K.puenteSag * Math.sin(Math.PI * u);
      if(a.pos.y < yb - 1.6 || a.pos.y > yb + 4.5) continue;
      const lat = rx * b.px + rz * b.pz;
      if(Math.abs(lat) <= lim) return;                 // dentro del carril: nada que hacer
      if(Math.abs(lat) > lim + 3.5) continue;          // muy fuera: no es este puente
      const s = lat > 0 ? 1 : -1;
      a.pos.x -= (lat - s * lim) * b.px;
      a.pos.z -= (lat - s * lim) * b.pz;
      const vn = a.vel.x * b.px + a.vel.z * b.pz;
      if(vn * s > 0){ a.vel.x -= vn * b.px; a.vel.z -= vn * b.pz; }
      return;
    }
  };
  if(typeof players !== 'undefined') for(const p of players) if(!p.out && !p.dead) uno(p);
  if(typeof minions !== 'undefined') for(const mn of minions) if(!mn.dead) uno(mn);
}

/* ---------------------------------------------------------------------
   CONSTRUCCION
   --------------------------------------------------------------------- */
function build(){
  clear();
  T.group = new THREE.Group();
  T.group.userData.noOcc = true;
  scene.add(T.group);

  if(typeof enableSJScenery === 'function') enableSJScenery(true);   // el fondo del jardin (nubes, montanas, Fuji)
  /* ►y FUERA el campo de fuerza translucido: son dos paneles con barras clavados
     en ±WALL_X (42), o sea CRUZANDO las pagodas de las esquinas. Marcaban un
     limite que en este stage ya no existe (ver el recinto desactivado). */
  if(typeof _boundaryWalls !== 'undefined') for(const w of _boundaryWalls) w.visible = false;

  /* --- las cinco, como el cinco de un dado --- */
  const S = K.sep;
  const centro = pagoda(0, 0);
  for(const q of [[-S, -S], [S, -S], [-S, S], [S, S]]) pagoda(q[0], q[1]);

  /* --- los puentes: el centro es el cruce (4 diagonales) y las esquinas
         se tocan entre si por el perimetro (4 mas). Sin el perimetro, ir de
         una esquina a la de al lado obliga a pasar SIEMPRE por el centro. */
  const yB = centro.baseY;                       // los puentes enganchan al escalon de abajo
  /* ►ANCLAJE: los extremos entran DENTRO de la losa, no se paran en su borde.
     Puestos justo en la arista —y peor en la ESQUINA, que es por donde salen las
     diagonales— quedaban al aire: la tapa del stage tiene las esquinas
     redondeadas (radio ~1,9), asi que la esquina geometrica del AABB no existe
     en el dibujo. Metiendolos, los ultimos tablones se apoyan sobre la piedra. */
  const h = centro.baseLado * 0.5 * K.anclaje;
  const idxDe = (x, z) => T.torres.findIndex(t => Math.abs(t.cx - x) < 0.01 && Math.abs(t.cz - z) < 0.01);
  for(let i = 1; i < T.torres.length; i++){
    const q = T.torres[i], sx = Math.sign(q.cx), sz = Math.sign(q.cz);
    puente(sx * h, sz * h, q.cx - sx * h, q.cz - sz * h, yB, 0, i);     // diagonal centro → esquina
  }
  for(const par of [[[-S,-S],[S,-S]], [[-S,S],[S,S]], [[-S,-S],[-S,S]], [[S,-S],[S,S]]]){
    const a = par[0], b = par[1];
    const ux = Math.sign(b[0] - a[0]), uz = Math.sign(b[1] - a[1]);
    puente(a[0] + ux * h, a[1] + uz * h, b[0] - ux * h, b[1] - uz * h, yB, idxDe(a[0], a[1]), idxDe(b[0], b[1]));   // perimetro
  }
  tejeRutas();

  creaAro();
  creaReloj();
  if(typeof enableWeather === 'function') enableWeather(false);

  /* ►HORDA A CAOS 7 (pedido de Toni): el caos no sube solo en este stage, asi que
     se clava aqui. `maxMinions()` lo lee → ~22 minions molestando en los puentes
     y en el pico. El contador del HUD sigue oculto: el numero no significa nada
     para el jugador, es solo el dial de la horda. */
  if(typeof chaosLvl !== 'undefined') chaosLvl = K.caos;

  T.built = true; T.t = 0; T.over = false;
  T.proxBomba = K.bombaCada * 0.5;
  T.colina = 0; T.proxTurno = K.turno; T.avisado = false; T.rey = null; T.reyT = 0;
  T.pts.clear();
  mueveAro();
  if(typeof _ctrlBarKey !== 'undefined') _ctrlBarKey = null;
  console.log('[ARENA] ' + T.torres.length + ' pagodas de ' + K.pisos + ' pisos · ' +
              T.puentes.length + ' puentes · colina cada ' + K.turno + ' s');
}

/* ---------------------------------------------------------------------
   ►KOTH — la colina, que va saltando de pico en pico

   El aro y el haz de luz son TODO el HUD que hay (Toni: nada de
   marcadores): el haz se ve desde cualquier punto del mapa, que es lo que
   hace falta cuando el sitio que puntua esta a 60 u de distancia.
   --------------------------------------------------------------------- */
function creaAro(){
  const aro = new THREE.Mesh(new THREE.TorusGeometry(K.picoLado * 0.42, 0.18, 8, 36),
    new THREE.MeshBasicMaterial({ color:0xffd15a, transparent:true, opacity:0.85 }));
  aro.rotation.x = Math.PI / 2;
  T.group.add(aro); T.aro = aro;

  /* ►el haz es un SEÑALIZADOR, no una lampara: a 40 de alto y aditivo se comia
     media pantalla en la primera captura. Corto y flojo — se ve desde la otra
     punta del mapa igual, que es todo lo que tiene que hacer. */
  const haz = new THREE.Mesh(new THREE.CylinderGeometry(K.picoLado * 0.34, K.picoLado * 0.40, 16, 14, 1, true),
    new THREE.MeshBasicMaterial({ color:0xffd15a, transparent:true, opacity:0.075,
                                  side:THREE.DoubleSide, depthWrite:false, blending:THREE.AdditiveBlending }));
  T.group.add(haz); T.haz = haz;
}

function torreColina(){ return T.torres[T.colina] || T.torres[0]; }

function mueveAro(){
  const t = torreColina(); if(!t || !T.aro) return;
  T.aro.position.set(t.cx, t.picoY + 0.14, t.cz);
  T.haz.position.set(t.cx, t.picoY + 8, t.cz);
}

function cambiaColina(){
  let i = T.colina;
  while(i === T.colina) i = (Math.random() * T.torres.length) | 0;   // nunca repite seguida
  T.colina = i; T.avisado = false;
  mueveAro();
  if(typeof showBanner === 'function') showBanner('¡LA COLINA SE MUEVE!', 1.6);
  if(typeof sfx !== 'undefined' && sfx.chaos) try{ sfx.chaos(); }catch(e){}
  if(typeof ring === 'function'){ const t = torreColina(); ring(_v3.set(t.cx, t.picoY + 0.3, t.cz), 0xffd15a, 26, .7); }
}

function koth(dt){
  /* el turno */
  if(!T.over){
    if(!T.avisado && T.t >= T.proxTurno - K.aviso){
      T.avisado = true;
      if(typeof showBanner === 'function') showBanner('LA COLINA CAMBIA EN ' + K.aviso + '…', 1.2);
    }
    if(T.t >= T.proxTurno){ cambiaColina(); T.proxTurno = T.t + K.turno; }
  }
  const t = torreColina();
  /* quien manda: uno SOLO en el pico */
  let rey = null, empate = false;
  const lim = K.picoLado * 0.5 + 0.6;
  for(const p of players){
    if(p.dead || p.out) continue;
    if(Math.abs(p.pos.x - t.cx) > lim || Math.abs(p.pos.z - t.cz) > lim) continue;
    if(Math.abs(p.pos.y - t.picoY) > 2.4) continue;                  // ARRIBA, no al pie
    if(rey) empate = true; else rey = p;
  }
  if(empate) rey = null;
  T.rey = rey;
  if(rey){
    T.pts.set(rey, (T.pts.get(rey) || 0) + K.kothPts * dt);
    rey._arKothPop = (rey._arKothPop || 0) + K.kothPts * dt;
    T.reyT += dt;
    if(T.reyT >= K.kothPop){
      T.reyT = 0;
      if(typeof showCombo === 'function') showCombo(rey, '+' + Math.round(rey._arKothPop));
      rey._arKothPop = 0;
    }
  } else T.reyT = 0;
  /* el aro/haz laten y toman el color del que manda */
  if(T.aro){
    const c = (rey && rey.color !== undefined) ? rey.color : 0xffd15a;
    T.aro.material.color.set(c); T.haz.material.color.set(c);
    const k = 1 + 0.05 * Math.sin(T.t * (rey ? 7 : 3));
    T.aro.scale.setScalar(k);
    T.haz.material.opacity = (rey ? 0.12 : 0.075) + (T.avisado ? 0.05 * Math.abs(Math.sin(T.t * 6)) : 0);
  }
}

/* ►HORDA: un sitio donde soltar un minion. Sesgado a la pagoda de la COLINA —
   que es donde esta la gente— pero repartido: molestar es el trabajo, y en un
   pico de 6 de lado tres goblins son un problema de verdad. Siempre sobre losa
   solida (nada de nacer en el aire y caerse). */
function spotMinion(){
  if(!T.torres.length) return null;
  for(let i = 0; i < 12; i++){
    const t = (Math.random() < 0.45) ? torreColina() : T.torres[(Math.random() * T.torres.length) | 0];
    const r = t.baseLado * 0.5 * (0.25 + Math.random() * 0.7);
    const a = Math.random() * Math.PI * 2;
    const x = t.cx + Math.cos(a) * r, z = t.cz + Math.sin(a) * r;
    const top = (typeof platformTopAt === 'function') ? platformTopAt(x, z, 0.4) : null;
    if(top !== null) return { x, z, y0:top };
  }
  return null;
}

/* =====================================================================
   ►IACOLINA — la CPU juega el minijuego

   La IA del juego persigue rivales, que en un rey de la colina es perder el
   tiempo: aqui lo que da puntos es ESTAR ARRIBA. Esta capa decide SOLO el
   rumbo — a donde ir y cuando saltar — y devuelve `null` en cuanto toca
   pelear, para que siga mandando la IA de combate de siempre (que es la que
   sabe encadenar golpes, escudarse y usar la clase).

   Navegar hace falta de verdad: con las pagodas a 46 y solo puentes entre
   ellas, "andar hacia el objetivo" es andar hacia el vacio. Se enruta por el
   grafo de puentes (5 nodos, 8 aristas, como mucho 2 saltos).
   ===================================================================== */
/* ►RUTAS: para cada par de pagodas, por que puente se sale. 5 nodos y 8
   aristas — con dos saltos se llega a todo, asi que basta con mirar los
   vecinos y luego los vecinos de los vecinos (nada de Dijkstra para esto). */
function tejeRutas(){
  const n = T.torres.length;
  T.pasos = [];
  for(let i = 0; i < n; i++){ T.pasos[i] = []; }
  const tramo = (b, desde) => (b.pa === desde)
    ? { near:{ x:b.ax, z:b.az }, far:{ x:b.bx, z:b.bz }, otro:b.pb }
    : { near:{ x:b.bx, z:b.bz }, far:{ x:b.ax, z:b.az }, otro:b.pa };
  for(const b of T.puentes){
    if(b.pa === undefined || b.pb === undefined || b.pa < 0 || b.pb < 0) continue;
    T.pasos[b.pa][b.pb] = tramo(b, b.pa);
    T.pasos[b.pb][b.pa] = tramo(b, b.pb);
  }
  for(let i = 0; i < n; i++) for(let j = 0; j < n; j++){
    if(i === j || T.pasos[i][j]) continue;
    for(let k = 0; k < n; k++) if(T.pasos[i][k] && T.pasos[k][j]){ T.pasos[i][j] = T.pasos[i][k]; break; }
  }
}

function plataformaDe(x, z){
  for(let i = 0; i < T.torres.length; i++){
    const t = T.torres[i], h = t.baseLado * 0.5 + 1.5;
    if(Math.abs(x - t.cx) <= h && Math.abs(z - t.cz) <= h) return i;
  }
  return -1;
}

/* siguiente sitio al que ir para acabar en el pico de la colina */
function rumboColina(me){
  const meta = T.colina, t = T.torres[meta];
  const mia = plataformaDe(me.pos.x, me.pos.z);
  if(mia === meta) return { x:t.cx, z:t.cz };                 // ya estoy en su pagoda: al pico
  if(mia >= 0){
    const paso = T.pasos[mia] && T.pasos[mia][meta];
    /* primero la BOCA del puente (en mi losa) y, ya encarado, el otro extremo:
       apuntar de una al extremo lejano hace que se cruce en diagonal por fuera
       del tablero — o sea, andar al vacio */
    if(paso){
      const d = Math.hypot(me.pos.x - paso.near.x, me.pos.z - paso.near.z);
      return d > 3.5 ? paso.near : paso.far;
    }
  }
  /* en un puente (o en el aire): sigo hasta su extremo mas util */
  let mejor = null, dm = 1e9;
  for(const b of T.puentes){
    for(const e of [[b.ax, b.az, b.pa], [b.bx, b.bz, b.pb]]){
      const d = Math.hypot(me.pos.x - e[0], me.pos.z - e[1]) + (e[2] === meta ? -26 : 0);
      if(d < dm){ dm = d; mejor = { x:e[0], z:e[1] }; }
    }
  }
  return mejor || { x:t.cx, z:t.cz };
}

function iaColina(me, ai, dt){
  if(!T.built || T.over) return null;
  const t = torreColina();
  const lim = K.picoLado * 0.5 + 0.6;
  const enPico = Math.abs(me.pos.x - t.cx) <= lim && Math.abs(me.pos.z - t.cz) <= lim
                 && Math.abs(me.pos.y - t.picoY) <= 2.4;
  let cerca = null, dc = 1e9;
  for(const q of players){
    if(q === me || q.dead || q.out) continue;
    const d = Math.hypot(q.pos.x - me.pos.x, q.pos.z - me.pos.z, (q.pos.y - me.pos.y) * 0.6);
    if(d < dc){ dc = d; cerca = q; }
  }
  if(enPico){
    /* ►DEFENDER: si hay alguien al alcance, que pelee la IA de combate — es lo
       que echa al que sube. Si no hay nadie, QUIETO: moverse solo puede sacarte
       de la casilla que esta puntuando. */
    if(cerca && dc < 8) return null;
    return ai.dir.set(0, 0, 0);
  }
  /* subiendo por su pagoda y con un rival pegado: pelear (le estoy disputando el pico) */
  if(cerca && dc < 4.5 && plataformaDe(me.pos.x, me.pos.z) === T.colina) return null;

  const w = rumboColina(me);
  ai.dir.set(w.x - me.pos.x, 0, w.z - me.pos.z);
  if(ai.dir.lengthSq() > 1e-6) ai.dir.normalize(); else return ai.dir.set(0, 0, 0);

  /* saltar por dos motivos: no hay suelo delante (hueco/puente) o hay ESCALON.
     El test de hueco va con `overAnyPlatform`, que SI ve los tablones flotantes
     de los puentes; el del escalon con `_s2AnyFloorAt`, por lo mismo. */
  if(me.onGround){
    const nx = me.pos.x + ai.dir.x * 2.4, nz = me.pos.z + ai.dir.z * 2.4;
    if(typeof overAnyPlatform === 'function' && !overAnyPlatform(nx, nz)){
      if(typeof aiJump === 'function') aiJump(me);
    } else if(typeof _s2AnyFloorAt === 'function'
              && _s2AnyFloorAt(nx, nz, me.pos.y + 0.6, me.pos.y + K.paso + 1.2) !== null){
      if(typeof aiJump === 'function') aiJump(me);          // el escalon de la pagoda
    }
  }
  return ai.dir;
}

/* =====================================================================
   ►BOMBA — el objeto que se agarra, se lleva y se LANZA

   Se queda de la version anterior porque es justo lo que hace falta aqui:
   la unica forma limpia de sacar a alguien de un pico de 6 de lado sin
   subirte tu a pelearlo. La mecha NO se para nunca: es un problema que se
   pasa de mano en mano, no un arma.
   ===================================================================== */
function _bombaMesh(){
  let m = (typeof getModel === 'function' && typeof DECOR_DEFS4 !== 'undefined')
            ? getModel('s4_bomb', DECOR_DEFS4) : null;
  if(!m){
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

/* caen sobre una pagoda al azar — con preferencia por la que tiene la colina */
function sueltaBomba(){
  const t = (Math.random() < 0.5) ? torreColina() : T.torres[(Math.random() * T.torres.length) | 0];
  if(!t) return;
  const R = t.baseLado * 0.4;
  const x = t.cx + (Math.random() - 0.5) * R * 2, z = t.cz + (Math.random() - 0.5) * R * 2;
  const m = _bombaMesh();
  m.position.set(x, t.picoY + 16, z);
  T.group.add(m);
  T.bombas.push({ m, pos:m.position, vel:new THREE.Vector3(0, 0, 0),
                  state:'cae', mecha:K.mecha, owner:null, port:null });
  if(typeof ring === 'function') ring(new THREE.Vector3(x, t.baseY + 0.2, z), 0xff8a2a, 14, .5);
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

/* la CPU no pasa por la cadena de ataque del humano: se le pilota aqui */
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
    const apura = b.mecha < 1.5;
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
    if(!propia && b.owner && b.owner !== p){ p.lastHitBy = b.owner; if(typeof credit === 'function') credit(b.owner, dmg); }
    const kb = (K.bombaKb + p.damage * 0.14) * k * (propia ? 0.75 : 1);
    p.vel.set(ux * kb, 8 * k + 3.5, uz * kb);
    p.hitstun = Math.max(p.hitstun, .4); p.onGround = false; p.hang = null; p.hitFlash = .22; p.comboWindow = 0;
    if(typeof jiggle === 'function') jiggle(p, 18);
    if(p._arBomb && p._arBomb !== b){ p._arBomb.state = 'vuela'; p._arBomb.port = null; p._arBomb = null; }
  }
  for(const mn of (typeof minions !== 'undefined' ? minions : [])){
    if(mn.dead || mn.invuln > 0) continue;
    const d = Math.hypot(mn.pos.x - c.x, mn.pos.z - c.z, (mn.pos.y + mn.scale) - c.y);
    if(d > R) continue;
    if(typeof hurtEnemy === 'function') hurtEnemy(mn, 30 * (1 - d / R), false);
  }
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
      /* ►el suelo se busca con `_s2AnyFloorAt`, NO con `platformTopAt`: ese solo
         ve plataformas SOLIDAS y los tablones de puente son flotantes, asi que
         una bomba que cayera sobre un puente lo atravesaria como si no estuviera
         (ver la trampa documentada de platformTopAt). */
      const suelo = (typeof _s2AnyFloorAt === 'function')
        ? _s2AnyFloorAt(b.pos.x, b.pos.z, b.pos.y - 4, b.pos.y + 0.8)
        : ((typeof platformTopAt === 'function') ? platformTopAt(b.pos.x, b.pos.z, 0.3) : null);
      if(suelo !== null && b.pos.y <= suelo + 0.55 && b.vel.y <= 0){
        b.pos.y = suelo + 0.55;
        b.vel.y = (Math.abs(b.vel.y) > 4) ? -b.vel.y * 0.32 : 0;
        b.vel.x *= 0.62; b.vel.z *= 0.62;
        if(b.state === 'cae' && typeof sfx !== 'undefined' && sfx.capLand) try{ sfx.capLand(); }catch(e){}
        b.state = 'suelo';
      }
      if(b.pos.y < K.y - 40){ matarBomba(b); continue; }
    }
    const urg = 1 - Math.max(0, b.mecha) / K.mecha;
    const ch = b.m.userData.chispa;
    if(ch){ const s = 1 + 0.7 * Math.abs(Math.sin(b.mecha * (4 + urg * 22))); ch.scale.setScalar(s); }
    if(Math.random() < dt * (6 + urg * 26) && typeof burst === 'function')
      burst(_v3.set(b.pos.x, b.pos.y + 0.85, b.pos.z), urg > 0.6 ? 0xff5a1a : 0xffd15a, 2, 3, 3.5, .35);
    if(b.mecha <= 0){ estalla(b); continue; }
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

/* ►SIN MURO INVISIBLE (12/08, Toni: "quita los putos muros invisibles").
   Aqui no hay recinto de ningun tipo: si te mandan volando fuera del mapa no
   rebotas contra nada, caes — y caer ya cuesta el tiempo de volver. Los del
   motor (±WALL_X y las lineas de muerte en Z) tambien estan desactivados para
   este stage: caian dentro de las pagodas de las esquinas. */

/* REAPARICION SIN FIN: caerse cuesta TIEMPO (y el tiempo son puntos de la
   colina que no estas haciendo), no la partida. */
function reponVidas(){
  if(typeof players === 'undefined') return;
  for(const p of players){ if(p.stocks < 2) p.stocks = 2; if(p.out) p.out = false; }
}

/* ---------------------------------------------------------------------
   RELOJ — lo unico que se anade al HUD (Toni: nada de marcadores)
   --------------------------------------------------------------------- */
function creaReloj(){
  const ch = document.getElementById('chaos'); if(ch) ch.style.display = 'none';   // el caos no sube aqui
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

  if(typeof updateStageJapan === 'function') updateStageJapan(dt);   // anima el fondo del jardin
  updateBombas(dt);
  koth(dt);
  carriles();
  reponVidas();
  pintaReloj();

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
    /* ►RUTA: dentro de la campaña esto NO es el fin de la partida, es un
       eslabon mas del line-up (Toni, 12/08: "todo unificado"). Suelto
       (?arena) se comporta como siempre. */
    setTimeout(()=>{
      if(gameOver) return;
      /* ►16 PARADAS: aqui el ganador es el que MAS PUNTOS DE PICO acumulo (`mejor`), que es la
         mecanica de este minijuego. Se lo pasamos a la ruta para el trofeo. */
      if(window.rutaEnCampana && window.rutaEnCampana()){ window.rutaFinMini(mejor || null); return; }
      if(typeof endGame === 'function') endGame();
    }, 1600);
  }
}

/* ---------------------------------------------------------------------
   PUNTOS DE APARICION — uno por pagoda de esquina, en su escalon de abajo
   --------------------------------------------------------------------- */
function spawnPoint(idx, total){
  const t = T.torres.length ? T.torres[1 + (idx % Math.max(1, T.torres.length - 1))] : null;
  if(!t) return { x:0, y:K.y + 4, z:0 };
  const s = t.baseLado * 0.30;
  return { x: t.cx - Math.sign(t.cx) * s, y: t.baseY + 2.2, z: t.cz - Math.sign(t.cz) * s };
}

/* ---------------------------------------------------------------------
   TEMA — el del jardin japones
   --------------------------------------------------------------------- */
function applyTheme(){
  /* el tema del jardín es `_applySJTheme` (SJ = el bloque de Japón), NO
     "_applyS3Theme": el stage 3 se llama S3 en la numeración vieja pero su
     código vive con el prefijo SJ */
  if(typeof _applySJTheme === 'function') _applySJTheme();
  if(typeof VISUAL !== 'undefined'){
    VISUAL.fog.far = 320;              // el mapa mide ~120 de punta a punta: la niebla no puede comerse las esquinas
    VISUAL.exposure = 0.72;
    /* los costados de los escalones son caras verticales grandes a contraluz:
       sin relleno salen casi negras (ver luz-caras-verticales-fill) */
    if(VISUAL.fill){ VISUAL.fill.color = 0xd8c6e0; VISUAL.fill.intensity = 0.40; }
  }
}

const ARENA = {
  on:false, K, T,
  segBuilders: [ ()=>{}, ()=>{}, ()=>{}, ()=>{}, ()=>{}, ()=>{} ],   // la cinta no construye: la estructura es suelta
  applyTheme, tick, spawnPoint, build, clear,
  lanza,                       // ►BOMBA: lo llama el enganche del boton de ataque
  iaColina,                    // ►IA: lo llama aiThink (rumbo; null = que pelee la de siempre)
  spotMinion,                  // ►HORDA: dónde cae cada minion (lo llama minionDropSpot)
  pts(p){ return Math.round(T.pts.get(p) || 0); },   // ►el marcador del juego lo lee de aqui (scoreTotal)
  get suelo(){ return K.y; },
  rebuild(){ build(); },
  bomba(){ sueltaBomba(); },
  colina(i){ if(i !== undefined){ T.colina = i % T.torres.length; mueveAro(); } return T.colina; },
  marcador(){
    const out = [];
    if(typeof players !== 'undefined') for(const p of players)
      out.push({ quien:p.label || '', pts:Math.round(T.pts.get(p) || 0) });
    return out.sort((a, b) => b.pts - a.pts);
  },
};
window.ARENA = ARENA;

/* arranque SUELTO (?arena): monta una partida entera en el stage 14. En campana
   no se pasa por aqui — se llega con goToStage14(), como a cualquier mundo. */
function boot(){
  if(ARENA.on || !SUELTO) return;
  if(typeof THREE === 'undefined') return;
  if(typeof launchMatch !== 'function' || typeof platforms === 'undefined' || typeof players === 'undefined') return;
  if(typeof _charTpls === 'undefined' || !_charTpls || !Object.keys(_charTpls).length) return;
  ARENA.on = true;
  MATCH.mode = 'solo';
  MATCH.cpus = Math.max(0, Math.min(5, _num('cpus', 3)));
  MENU_STAGE = 14;
  launchMatch();
}
if(SUELTO){
  const _bt = setInterval(()=>{ boot(); if(ARENA.on) clearInterval(_bt); }, 80);
  boot();
}

})();
