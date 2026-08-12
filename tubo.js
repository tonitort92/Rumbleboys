/* =====================================================================
   ►TUBO — EL TUBO DE LAS ESTRELLAS  ·  v1

   Minijuego de transición que va DESPUÉS DEL STAGE DE LA FORJA (stage 8).
   Idea de Toni, 11-12/08/2026, literal:

     "Se genera un tubo gigantesco donde todos los jugadores juegan. El color
      es como el stage de las estrellas multicolor arcoíris. Todos los
      jugadores corren a la misma velocidad y solo pueden imantarse y moverse
      alrededor del tubo y saltar (1 solo salto). Para ganar debes no caerte
      nunca. El tubo aumenta su velocidad con el tiempo haciéndolo más difícil
      y el jugador debe recoger el máximo de puntos, evitar las bombas, saltar
      los obstáculos o vallas, saltar los agujeros que existan. Si el jugador
      se golpea contra una valla rota sobre sí mismo como en el snowboard
      ?descenso. Si cae en el agujero tarda unos segundos en volver a aparecer
      parpadeante y la cámara no le sigue, siempre le espera en el mismo plano
      por detrás. Gana el que termina la carrera con más puntos y terminar el
      primero te da más puntos."

   ---------------------------------------------------------------------
   ENTRADA
        rumble_arena_cinta_v4.html?tubo
        ...&humanos=2      ...&semilla=1234      ...&calidad=baja|media|pelada

   CONTROLES  (son TODOS los que hay: Toni pidió justo esto y nada más)
     A / D · ←/→ · stick izq. ... MOVERSE ALREDEDOR DEL TUBO
     ESPACIO · A ................ SALTAR (uno solo; no hay doble salto)
     R reiniciar · T pista nueva · afinado en vivo: TUBO.K

   =====================================================================
   POR QUÉ ES UN MÓDULO PROPIO Y NO UN STAGE DEL MOTOR

   Los otros dos minijuegos (►CUADRIMANIA stage 13, ►ARENA stage 14) conducen
   el motor del juego para heredar combate, empujón, daño y minions. Aquí eso
   no sirve: en un tubo **la gravedad es RADIAL** (corres por dentro, también
   por el techo) y el motor tiene gravedad hacia -Y con plataformas AABB. No
   hay forma de doblar eso sin tocar el corazón del juego.

   Y tampoco hace falta: esto es una CARRERA sin combate, exactamente el género
   del ►DESCENSO. Así que se copia su arquitectura, que ya está probada:
   escena/cámara propias, se queda el frame entero (UNA línea en el HTML) y
   reutiliza del juego lo que ya existe — los GLB de las 6 clases y sus clips,
   el recolor de marca, la voz de presentación, #banner / #count321 /
   #stageCaution, y las clases CSS del HUD y de la tabla final.

   =====================================================================
   EL MARCO DEL TUBO (todo el fichero piensa en estas tres coordenadas)

     s ... distancia recorrida por el tubo. Crece. El mundo va hacia -Z, o sea
           z = -s. La meta está en s = K.largo.
     a ... ángulo alrededor del tubo, 0 = SUELO (abajo del todo), creciendo
           hacia la derecha de la pantalla. Se normaliza siempre a [0, 2π).
     h ... altura SOBRE la pared, hacia el eje. 0 = pisando. El salto sube h.

     u(a) = (sin a, -cos a, 0)   ... el "hacia fuera" (de los pies)
     n(a) = -u(a)                ... el "arriba" del corredor
     posición = u(a)·(R − h) + (0,0,−s)

   El grupo de cada corredor se orienta con makeBasis(x, n, (0,0,−1)): su +Z
   local ES la dirección de avance, así que el modelo (que en este juego mira a
   +Z) queda mirando adelante SIN yaw extra — al revés que en el descenso, que
   necesita charYaw = π porque allí el grupo no rota.

   =====================================================================
   LAS CINCO DECISIONES DE DISEÑO (y por qué)

   1. UNA SOLA FUENTE DE VERDAD PARA LOS AGUJEROS. El tubo se dibuja por
      CELDAS (24 sectores × tramos de 6 u) y un agujero es un conjunto de
      celdas en un Set. La malla se salta esas celdas y `agujeroEn()` consulta
      ese mismo Set. No hay "hueco dibujado" y "hueco físico" que puedan
      separarse: es el fallo que en el descenso costó tres versiones de rampas
      invisibles que sí lanzaban.

   2. LA CADENA DE ESTRELLAS ES EL TUTORIAL DEL CAMINO. Se genera primero un
      "hilo" (el ángulo seguro, que serpentea) y los peligros se colocan
      RESPECTO a él; las estrellas se siembran justo encima. Así la línea de
      puntos dibuja literalmente por dónde se pasa, y la IA que persigue
      estrellas juega bien sin saber nada más. En el descenso se aprendió que
      los coleccionables sueltos no se cogen (6 de 90) y en cadena sí.

   3. EL HILO NO PUEDE PEDIR IMPOSIBLES. Cada compás mueve el hilo como mucho
      lo que se puede recorrer de pared en ese tramo A LA VELOCIDAD DE ESE
      TRAMO (con un 30% de margen). Como el tubo acelera, el mismo ángulo que
      es cómodo al principio sería imposible al final.

   4. TODOS A LA MISMA VELOCIDAD, PERO CON REBUFO. Toni: "todos corren a la
      misma velocidad". Con eso, un fallo te deja atrás PARA SIEMPRE y ya no
      hay carrera: no existe ninguna acción con la que recuperar. Se añade un
      rebufo (hasta +17% para el que va detrás, y solo para el que va detrás):
      un error sigue costando puesto y puntos, pero la carrera se mantiene
      viva. Es el único punto donde me he salido de lo que dijo, y va en un
      knob (`K.rebufo = 0` lo deja exactamente como lo pidió).

   5. LA CÁMARA VIVE EN SU PROPIO PLANO. No cuelga del jugador: sigue una
      "línea de carrera" (`TUBO.camS`) que, cuando el jugador está fuera por un
      agujero, SIGUE AVANZANDO sola a la velocidad del tubo. Eso es exactamente
      lo que pidió ("la cámara no le sigue, siempre le espera en el mismo plano
      por detrás") y además da gratis el punto de reaparición: se reaparece en
      el plano donde la cámara está esperando.

   =====================================================================
   LO QUE FALTA POR DECIDIR CON TONI (no me lo he inventado a lo grande)
     · La BOMBA: aquí revienta = voltereta + empujón hacia atrás + resta
       puntos. Es lo único de los tres peligros cuyo efecto no dijo.
     · Cuánto dura: la pista está calibrada a ~80 s (K.largo / K.vel*).
     · Si puntúa para la run (como el descenso) o va aparte.
     · Integración en la campaña detrás del stage 8.
   ===================================================================== */
(function(){
'use strict';

const Q = location.search;
if(!/[?&]tubo(=|&|$)/.test(Q)) return;

const _qs    = new URLSearchParams(Q);
const HUMANS = Math.max(1, Math.min(4, parseInt(_qs.get('humanos')||'1', 10) || 1));

const TAU    = Math.PI * 2;
const clamp  = (v, a, b) => v < a ? a : (v > b ? b : v);
const lerp   = (a, b, t) => a + (b - a) * t;
const smooth = x => x * x * (3 - 2 * x);
/* ángulo normalizado a [0,2π) y diferencia angular corta con signo */
const norm   = a => { a %= TAU; return a < 0 ? a + TAU : a; };
const difA   = (a, b) => { let d = norm(a - b); return d > Math.PI ? d - TAU : d; };

function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* =====================================================================
   KNOBS — TUBO.K, tocables en vivo desde la consola
   ===================================================================== */
const K = {
  /* --- el tubo --- */
  /* ►RADIO. Empezó en 27 y en la primera captura el corredor era un punto: 3,1 u
     de alto contra 54 u de diámetro = el 6% de la pantalla. Con 15 pasa al 10% y
     el tubo se lee como un tubo por el que corre alguien, no como una catedral.
     De paso la vuelta entera baja de 7 s a 5, que es lo que hace que moverse sea
     una decisión y no una excursión. */
  R:          15,
  NSEC:       24,      // sectores angulares (15° cada uno). La rejilla del dibujo Y la de la física
  segZ:       6,       // longitud de una celda a lo largo del tubo
  largo:      4300,    // hasta la meta (≈80 s con la rampa de velocidad de abajo)
  salida:     115,     // tramo limpio antes del primer peligro
  meta:       190,     // tramo limpio DESPUÉS de la meta (hay que frenar en algún sitio)
  /* ►RANURA: con 0,5 u en un tubo sin trasdós, la primera captura salía como una
     REDECILLA — a contraluz rasante se ve el vacío entre celdas, no una junta.
     0,16 lee como llaga de baldosa y los agujeros de verdad siguen siendo obvios
     (ocupan la celda entera y llevan borde ámbar). */
  ranuraZ:    0.08,    // ranura entre celdas, SOLO en el dibujo (la física usa la celda entera)
  ranuraA:    0.0015,  // ...y la de los lados, en radianes
  anilloCada: 12,      // un anillo de neón cada N celdas (12 × 6 u = 72 u)

  /* --- velocidad: el tubo ACELERA con el tiempo (petición de Toni) --- */
  vel0:       34,      // u/s al arrancar
  vel1:       70,      // u/s al final de la rampa
  rampa:      78,      // segundos de rampa
  rebufo:     0.12,    // ►ver decisión 4: empuje MÁXIMO del que va detrás (0 = como lo pidió Toni). Con 0,17 una caída (≈150 u) se recuperaba en 18 s y los cuatro llegaban EMPATADOS; con 0,12 cuesta ~25 s y el error se paga
  rebufoGap:  70,      // ...a partir de esta distancia al líder ya es el empuje máximo

  /* --- moverse alrededor --- */
  lateral:    18,      // u/s de recorrido por la pared (la vuelta entera, 94 u, en 5,2 s)
  latAcel:    120,     // u/s²: el stick pide VELOCIDAD lateral, no un ángulo (con un integrador puro te peleas con el volante — lección del descenso)
  latAire:    0.55,    // fracción de control lateral en el aire

  /* --- saltar (UNO solo) --- */
  saltoV:     19,      // u/s iniciales
  grav:       52,      // u/s² hacia la pared → apex 3,47 u y 0,73 s de vuelo
  coyote:     0.10,    // margen de gracia tras salir de una celda
  bufer:      0.12,    // ...y al pulsar justo antes de aterrizar

  /* --- peligros --- */
  vallaAlto:  2.3,     // hay que saltarla: 2,3 < 3,47 de apex, con margen pero no regalado
  vallaZ:     1.6,     // grosor en z
  bombaR:     1.6,     // radio de la bomba (un sector mide 3,9 u: así queda sitio para pasar al lado)
  crashT:     1.15,    // lo que dura la voltereta contra una valla
  crashVel:   0.52,    // ...y a qué fracción de velocidad te deja (de ahí sale el perder puesto)
  crashInv:   0.65,    // invulnerabilidad después, para no encadenar la misma valla
  bombaEmpuje:14,      // u que te tira HACIA ATRÁS la explosión
  caidaT:     1.05,    // lo que tardas en salir despedido por un agujero
  reapT:      2.5,     // ...y en volver (Toni: "tarda unos segundos")
  parpT:      2.4,     // parpadeo al reaparecer (mientras dura, no te pueden dar)
  /* ►EL PRECIO DE CAERSE. Fuera del tubo se sigue avanzando, pero a esta
     fracción de la velocidad: es LO ÚNICO que hace que "no caerse nunca"
     signifique algo. Medido: 3,5 s al 40% son ~130 u perdidas ≈ 2,4 s de
     carrera y una docena de estrellas; el rebufo lo devuelve en ~20 s, así
     que cuesta puesto pero no te saca de la carrera. */
  velFuera:   0.40,

  /* --- puntos --- */
  ptsEstrella: 8,
  ptsGrande:   40,
  ptsBomba:   -80,
  ptsPos:     [400, 240, 110, 0],   // mismo reparto que el descenso: por debajo de 3º no se cobra

  /* --- cámara --- */
  camDist:    13,      // cuánto va por detrás
  camAlto:    4.2,     // ...y cuánto se separa de la pared HACIA EL EJE (la cabeza del corredor está a 3,1)
  camMira:    26,      // a qué distancia mira por delante
  camSigue:   6.0,     // rapidez con la que la cámara alcanza el ángulo del corredor (más bajo = más suave y más mareo-proof)
  fovBase:    62,
  fovSpeed:   9,       // el "se aleja al correr" NO es distancia, es FOV (lección del descenso: allí subía 28 y mareaba)

  /* --- sensación de velocidad --- */
  streakN:    170,
  blurMax:    7.5,     // px de desenfoque periférico a tope (capa DOM: no sale en capturas del canvas)
  blurDesde:  0.28,
  blurCentro: 0.34,

  /* --- IA --- */
  aiLook:     78,      // u que mira por delante para elegir carril
  aiSkill:    [0.94, 0.87, 0.80],
  aiRebusca:  0.55,    // cuánto le tira una estrella frente a la seguridad
  /* ►DESPISTES. Con el barrido de vallas arreglado, las cuatro IAs hacían la
     carrera PERFECTA: 0 caídas, 0 golpes y los cuatro empatados al segundo, o
     sea ninguna carrera. Una IA con conocimiento total del mapa no falla nunca
     por sí sola: hay que darle un error explícito. Cada tanto se distrae un
     momento (no gira y no salta), con frecuencia según su pericia. */
  aiDespiste: 0.40,    // probabilidad por segundo, multiplicada por (1 − pericia)

  /* --- varios --- */
  fixed:      1/120,
  charScale:  1.55,
  animFade:   0.16,
  vol:        0.55,
  exposicion: 1.0,     // ver TUBO.render: si no, se hereda la del último stage aplicado
  sombras:    false,   // dentro de un tubo no hay sol: la lectura la dan el neón y los anillos
  densDeco:   1,
};

/* =====================================================================
   PALETA — la del stage 10 (Vía Arcoíris), que es de donde Toni la pidió
   ===================================================================== */
const PAL = {
  /* los 7 del stage 10 (S10_RAINBOW en el HTML), en hex numérico */
  arco:   [0xff5a5a, 0xff9a40, 0xffd84f, 0x5ae07a, 0x4fc8ff, 0x7a6aff, 0xc05aff],
  fondo:  0x02030a,    // el mismo negro espacial de scene.background en _applyS10Theme
  niebla: 0x080618,    // violeta MUY oscuro: el fondo del tubo tiene que leerse como distancia, no como un agujero
  nieblaN: 70, nieblaF: 470,
  /* ►EL HEMISFÉRICO ESTABA LAVANDO EL ARCOÍRIS. Con 0,72 de rebote violeta
     encima de un Standard, la primera captura salía en tonos pastel de
     guardería: el color de la Vía Arcoíris es SATURADO. Menos ambiente y más
     luz principal — y la pared pasa a Lambert (ver buildTuboMalla). */
  /* ►Y CON LA LUZ EN EL EJE, SOBRABA POTENCIA. Una PointLight sin caída física
     entrega su intensidad ENTERA a 17 u (que es lo que hay de eje a pared), así
     que 2,6 lo quemaba todo a pastel de guardería — el mismo síntoma que antes,
     por el motivo contrario. 1,15 + 0,30 de ambiente deja el color del stage 10
     tal cual es. */
  hemiCielo: 0x5a4a8c, hemiSuelo: 0x8a7ab8, hemiInt: 0.30,
  keyCol: 0xfff4ff, keyInt: 1.15, keyDist: 300, keyDecay: 0.9, keyAdel: 34,
  /* ►BORDE DE AGUJERO = FRANJA DE PELIGRO amarillo/carbón, alternando por celda.
     Con el ámbar que había antes no se veía NADA: el naranja ya está en el
     arcoíris del propio tubo, así que el aviso se confundía con el suelo. Un
     aviso tiene que estar FUERA de la paleta con la que compite. */
  aviso:  0xffd400, aviso2: 0x14121e,
  anillo: 0xffffff,
  valla:  0xff3b5c, vallaTop: 0xfff2a8,
  bomba:  0x1a1020, bombaLuz: 0xff4a2a,
  meta:   0xffffff,
};

/* ►TODO COLOR QUE SE ESCRIBA A MANO PASA POR AQUÍ.
   El renderer del juego va con `outputEncoding = sRGBEncoding` + ACES, así que
   un color puesto con setHex se interpreta como LINEAL y al codificar la salida
   sale lavado: la 2ª y la 3ª captura del tubo eran pastel de guardería con el
   arcoíris saturado del stage 10 metido en el código. El propio juego ya hace
   esto en `_applyS10Theme` (`.set(S10_RAINBOW[i]).convertSRGBToLinear()`); aquí
   no se inventa otra cosa, se usa la misma. */
function sRGB(hex){ return new THREE.Color(hex).convertSRGBToLinear(); }
function aLin(c){ return c.convertSRGBToLinear(); }

/* =====================================================================
   ACCESOS AL JUEGO — por nombre léxico, igual que descenso.js
   ===================================================================== */
function GAME_RENDERER(){ try { return (typeof renderer !== 'undefined') ? renderer : null; } catch(e){ return null; } }
function GAME_KEYS(){ try { return (typeof keys !== 'undefined') ? keys : null; } catch(e){ return null; } }
function GAME_VOZ(){ try { return (typeof voiceStart !== 'undefined') ? voiceStart : null; } catch(e){ return null; } }
function GAME_SHOWCOUNT(){ try { return (typeof showCount === 'function') ? showCount : null; } catch(e){ return null; } }

const CLASES = ['samurai', 'voxelhero', 'archer', 'knight', 'nun', 'link'];
const CLASE_COL = { voxelhero:0xff3b30, samurai:0x9b2bff, archer:0xffd84f,
                    link:0x3ad06a, knight:0xe8edf5, nun:0x2563eb };
function colorDe(clase, i){
  try { if(typeof CLASS_COLOR !== 'undefined' && CLASS_COLOR[clase] != null) return CLASS_COLOR[clase]; } catch(e){}
  if(CLASE_COL[clase] != null) return CLASE_COL[clase];
  return [0x35c9ff, 0xff5a52, 0x7bf06a, 0xffd23f][i % 4];
}
function tplDe(k){
  try { const t = (typeof _charTpls !== 'undefined') ? _charTpls : null; return (t && t[k]) ? t[k] : null; }
  catch(e){ return null; }
}

const TUBO = window.TUBO = {
  on:false, K, PAL,
  scene:null, cam:null, world:null,
  seed:0, rng:null,
  racers:[], pista:null,
  t:0, phase:'intro', introT:0,
  camS:0, camA:0, camAV:0,
  finishOrder:[], hud:null, _built:false,
};

/* =====================================================================
   GEOMETRÍA DEL TUBO — las funciones que TODO el fichero usa para pasar
   de (a, s, h) a un punto del mundo. Aquí no se duplica ni un seno.
   ===================================================================== */
const _uTmp = new THREE.Vector3(), _nTmp = new THREE.Vector3(), _xTmp = new THREE.Vector3();
const _mTmp = new THREE.Matrix4(), _qTmp = new THREE.Quaternion(), _vTmp = new THREE.Vector3();
const _FWD  = new THREE.Vector3(0, 0, -1);   // el avance, constante

/* "hacia fuera": de los pies del corredor a la pared */
function fuera(a, out){ return (out || _uTmp).set(Math.sin(a), -Math.cos(a), 0); }
/* punto del mundo para (a, s, h) */
function punto(a, s, h, out){
  const r = K.R - (h || 0);
  return (out || _vTmp).set(Math.sin(a) * r, -Math.cos(a) * r, -s);
}
/* orienta un objeto para que quede DE PIE sobre la pared en el ángulo a,
   mirando hacia donde se avanza (ver el bloque EL MARCO DEL TUBO) */
function orienta(obj, a){
  _nTmp.set(-Math.sin(a), Math.cos(a), 0);              // arriba del corredor
  _xTmp.set(-Math.cos(a), -Math.sin(a), 0);             // su derecha (= n × avance)
  _mTmp.makeBasis(_xTmp, _nTmp, _FWD);
  obj.quaternion.setFromRotationMatrix(_mTmp);
}

const dSEC = () => TAU / K.NSEC;
const iSec = a => { const i = Math.floor(norm(a) / dSEC()); return i >= K.NSEC ? 0 : i; };
const jCel = s => Math.floor(s / K.segZ);
const NCEL = () => Math.ceil((K.largo + K.meta) / K.segZ);

/* velocidad del tubo en el instante t (la rampa que pidió Toni) */
function velTubo(t){ return lerp(K.vel0, K.vel1, clamp(t / K.rampa, 0, 1)); }

/* =====================================================================
   GENERACIÓN DE LA PISTA

   Un compás ("bar") a la vez. En cada uno: se mueve el HILO (el ángulo por
   el que se puede pasar) dentro de lo alcanzable, se elige un patrón que
   respeta ese hilo, y se siembran estrellas ENCIMA del hilo.

   La dificultad (`prog`, 0→1) acorta los compases, estrecha el hueco y sube
   la probabilidad de los patrones que obligan a saltar.
   ===================================================================== */
function genPista(rng){
  const NS = K.NSEC, NC = NCEL();
  const P = {
    agujeros: new Set(),     // clave j*NS+i — LA fuente de verdad (dibujo y física)
    vallas:   [],            // {s, i0, n, alto}
    bombas:   [],            // {s, a}
    estrellas:[],            // {s, a, big, cog} — cog = MÁSCARA DE BITS por corredor
    aviso:    new Set(),     // celdas que tocan un agujero (se pintan de ámbar)
    _vb:      null, _bb:null, _eb:null,   // buckets por celda
  };

  /* marca un rectángulo de celdas como agujero */
  const agujero = (j0, j1, i0, n) => {
    for(let j = j0; j <= j1; j++){
      if(j < 0 || j >= NC) continue;
      for(let k = 0; k < n; k++) P.agujeros.add(j * NS + ((i0 + k) % NS + NS) % NS);
    }
  };

  let hilo = 0;                 // ángulo seguro
  let s = K.salida;
  let t = s / K.vel0;           // reloj aproximado, para saber a qué velocidad se llega aquí
  const fin = K.largo - 90;
  let compas = 0;

  while(s < fin){
    const prog = clamp((s - K.salida) / (fin - K.salida), 0, 1);
    const paso = 66 - 20 * prog;                 // los compases se acortan
    const vel  = velTubo(t);
    /* ►DECISIÓN 3: el hilo no puede pedir un giro que no dé tiempo a hacer */
    const alcance = (paso / vel) * (K.lateral / K.R) * 0.70;
    const hilo0 = hilo;
    hilo = norm(hilo + (rng() * 2 - 1) * Math.min(alcance, 1.15));

    /* --- elegir patrón --- */
    const dado = rng();
    let patron;
    if(compas < 2)                       patron = 'recta';
    else if(dado < 0.30 - 0.14 * prog)   patron = 'recta';
    else if(dado < 0.55)                 patron = 'vallas';
    else if(dado < 0.76)                 patron = 'agujeros';
    else if(dado < 0.90)                 patron = 'bombas';
    else                                 patron = 'mixto';
    /* el anillo completo (obliga a saltar) solo aparece pasada la primera mitad */
    if(patron === 'vallas' && prog > 0.42 && rng() < 0.34) patron = 'anillo';

    const sEv = s + paso * 0.45;                 // el evento va a media altura del compás
    const iH  = iSec(hilo);

    if(patron === 'vallas'){
      /* vallas por todas partes MENOS un hueco centrado en el hilo. Se puede
         pasar por el hueco o saltar por encima: dos soluciones, y esa es la
         gracia (elegir cuesta menos que ejecutar). */
      const hueco = Math.max(3, Math.round(6 - 3 * prog));      // en SECTORES, no en radianes (rejilla cuadrada: lección de la ►ARENA)
      const i0 = ((iH - (hueco >> 1)) % NS + NS) % NS;
      P.vallas.push({ s:sEv, i0:(i0 + hueco) % NS, n:NS - hueco, alto:K.vallaAlto });
    } else if(patron === 'anillo'){
      P.vallas.push({ s:sEv, i0:0, n:NS, alto:K.vallaAlto });
      /* premio por saltarla: una estrella grande justo encima del labio */
      P.estrellas.push({ s:sEv + 3, a:hilo, big:true, cog:0 });
    } else if(patron === 'agujeros'){
      /* el vacío ocupa casi toda la vuelta menos una pasarela sobre el hilo */
      const largoC = 2 + Math.floor(rng() * 3);                  // 2..4 celdas = 12..24 u (saltables de sobra)
      const j0 = jCel(sEv), j1 = j0 + largoC - 1;
      const pasarela = Math.max(3, Math.round(7 - 3 * prog));
      const i0 = ((iH - (pasarela >> 1)) % NS + NS) % NS;
      agujero(j0, j1, i0 + pasarela, NS - pasarela);
    } else if(patron === 'bombas'){
      const n = 3 + Math.floor(rng() * (2 + prog * 3));
      for(let b = 0; b < n; b++){
        /* nunca sobre el hilo: la bomba castiga al que se sale de la línea */
        const off = (0.42 + rng() * 2.2) * (rng() < 0.5 ? -1 : 1);
        P.bombas.push({ s: sEv + (rng() * 2 - 1) * paso * 0.30, a: norm(hilo + off) });
      }
    } else if(patron === 'mixto'){
      const largoC = 2 + Math.floor(rng() * 2);
      const j0 = jCel(sEv), j1 = j0 + largoC - 1;
      const pasarela = Math.max(4, Math.round(8 - 3 * prog));
      const i0 = ((iH - (pasarela >> 1)) % NS + NS) % NS;
      agujero(j0, j1, i0 + pasarela, NS - pasarela);
      /* y una valla justo después, en la propia pasarela: saltas el agujero y
         te la comes si no encadenas — el único sitio donde el timing manda.
         16 u de separación NO es un número redondo: a 70 u/s son 0,23 s, que
         da para volver a saltar tras aterrizar (el búfer de salto son 0,12 s);
         con 9 u el aterrizaje y el despegue se solapaban y era injusto. */
      P.vallas.push({ s: (j1 + 1) * K.segZ + 16, i0: i0, n: pasarela, alto: K.vallaAlto });
    }

    /* --- ►DECISIÓN 2: estrellas SOBRE el hilo, interpolando del anterior --- */
    if(patron !== 'recta' || rng() < 0.75){
      const paso2 = 11;
      for(let d = 0; d < paso; d += paso2){
        const u = d / paso;
        const aa = norm(hilo0 + difA(hilo, hilo0) * smooth(u));
        const ss = s + d;
        if(ss >= fin + 40) break;
        /* no sembrar dentro de un agujero ni dentro de una valla */
        if(P.agujeros.has(jCel(ss) * NS + iSec(aa))) continue;
        P.estrellas.push({ s:ss, a:aa, big:false, cog:0 });
      }
    }

    t += paso / vel;
    s += paso;
    compas++;
  }

  /* --- celdas de AVISO: las que tocan un agujero se pintan de ámbar. Un
     agujero de frente, con la fuga del tubo, se ve tarde; el borde marcado
     se ve a 200 u. --- */
  for(const key of P.agujeros){
    const j = Math.floor(key / NS), i = key % NS;
    const vec = [ (j-1)*NS + i, (j+1)*NS + i, j*NS + ((i+1) % NS), j*NS + ((i+NS-1) % NS) ];
    for(const v of vec) if(!P.agujeros.has(v) && v >= 0) P.aviso.add(v);
  }

  /* --- buckets por celda: buscar en 40 vallas cada frame y por corredor es
     tontería, y con 900 celdas el índice es un array de listas --- */
  const bucket = (arr, key) => {
    const b = new Map();
    for(const o of arr){
      const j = jCel(key(o));
      for(let d = -1; d <= 1; d++){          // ±1 celda: un objeto puede asomar a la vecina
        const jj = j + d;
        if(!b.has(jj)) b.set(jj, []);
        b.get(jj).push(o);
      }
    }
    return b;
  };
  P._vb = bucket(P.vallas,    o => o.s);
  P._bb = bucket(P.bombas,    o => o.s);
  P._eb = bucket(P.estrellas, o => o.s);
  return P;
}

/* --- consultas (las MISMAS que usa el dibujo; ver ►DECISIÓN 1) --- */
function agujeroEn(a, s){
  const P = TUBO.pista; if(!P) return false;
  if(s < 0) return false;
  return P.agujeros.has(jCel(s) * K.NSEC + iSec(a));
}
function enCubo(map, s){ const l = map && map.get(jCel(s)); return l || null; }

/* =====================================================================
   ESCENA
   ===================================================================== */
function buildScene(){
  const sc = new THREE.Scene();
  sc.background = sRGB(PAL.fondo);
  sc.fog = new THREE.Fog(sRGB(PAL.niebla).getHex(), PAL.nieblaN, PAL.nieblaF);

  /* ►LA LUZ VA EN EL EJE DEL TUBO, y esto NO es un detalle: en un tubo TODAS
     las paredes miran al eje, así que una direccional apuntando hacia delante
     las coge de refilón y sale todo pardo — es exactamente la trampa de
     `luz-caras-verticales-fill` de este proyecto, con la geometría girada 90°.
     Una PointLight sobre el eje, un poco por delante de la cámara, le da a
     cada panel de frente; y con `distance`/`decay` la caída dibuja sola el
     túnel (cerca encendido, lejos apagándose) sin niebla extra. */
  sc.add(new THREE.HemisphereLight(PAL.hemiCielo, PAL.hemiSuelo, PAL.hemiInt));
  const key = new THREE.PointLight(PAL.keyCol, PAL.keyInt, PAL.keyDist, PAL.keyDecay);
  sc.add(key);
  TUBO.key = key;
  /* una segunda, más lejos y tenue, para que el fondo no sea un agujero negro */
  const key2 = new THREE.PointLight(PAL.keyCol, PAL.keyInt * 0.45, PAL.keyDist * 1.4, PAL.keyDecay);
  sc.add(key2);
  TUBO.key2 = key2;
  /* ►RELLENO DESDE LA CÁMARA, solo para los corredores: con la luz en el eje y
     por delante, los cuatro salían de espaldas a ella = siluetas grises sobre
     un tubo de colores. Es el knob `VISUAL.fill` del juego, aquí a mano. */
  const fill = new THREE.DirectionalLight(0xcfe0ff, 0.55);
  sc.add(fill); sc.add(fill.target);
  TUBO.fill = fill;

  const world = new THREE.Group();
  sc.add(world);
  TUBO.world = world;

  buildTuboMalla(world);
  buildVallas(world);
  buildBombas(world);
  buildEstrellas(world);
  buildMeta(world);
  buildEspacio(sc);
  buildStreaks(sc);
  buildPop(world);

  TUBO.scene = sc;
  TUBO.cam = new THREE.PerspectiveCamera(K.fovBase, innerWidth / innerHeight, 0.4, 4000);
  return sc;
}

/* --- LA PARED, por celdas y en trozos (un trozo = 64 celdas de largo, para
   que el frustum pueda tirar lo que queda detrás) --- */
function buildTuboMalla(world){
  const NS = K.NSEC, NC = NCEL(), dA = dSEC(), R = K.R;
  const P = TUBO.pista;
  const POR = 64;
  const cA = new THREE.Color(), cAviso = new THREE.Color(PAL.aviso);
  let celdas = 0;

  /* ►LAMBERT, no Standard. Este juego es ESTILIZADO, no PBR (y a esta cámara el
     PBR no se ve): un Standard con rugosidad reparte la energía y desatura, que
     es media culpa del look pastel de la primera captura. Lambert multiplica
     limpio el color del vértice y encima es más barato.
     DoubleSide a propósito: la cámara va DENTRO, y el devanado al revés es el
     error que en el descenso disfrazó el terreno de "telón". Con DoubleSide ese
     bug no puede existir y three ya voltea la normal de la cara de atrás. */
  const matPared = new THREE.MeshLambertMaterial({
    vertexColors:true, flatShading:true, side:THREE.DoubleSide });
  const matAnillo = new THREE.MeshBasicMaterial({ vertexColors:true, side:THREE.DoubleSide, fog:true });

  for(let c0 = 0; c0 < NC; c0 += POR){
    const c1 = Math.min(NC, c0 + POR);
    const pos = [], nor = [], col = [], idx = [];
    const pos2 = [], col2 = [], idx2 = [];
    let v = 0, v2 = 0;

    for(let j = c0; j < c1; j++){
      const z0 = -(j * K.segZ), z1 = -((j + 1) * K.segZ - K.ranuraZ);
      const anillo = (j % K.anilloCada) === 0;
      for(let i = 0; i < NS; i++){
        if(P.agujeros.has(j * NS + i)) continue;
        celdas++;
        const a0 = i * dA + K.ranuraA, a1 = (i + 1) * dA - K.ranuraA;
        /* ►ARCOÍRIS EN DIAGONAL: (i + j/2) hace una hélice lenta de color, que
           al correr barre la pantalla. Con el tono ligado solo a `i` salían
           franjas fijas y el tubo parecía quieto. */
        const idc = ((i + (j >> 1)) % PAL.arco.length + PAL.arco.length) % PAL.arco.length;
        const esAviso = P.aviso.has(j * NS + i);
        aLin(cA.setHex(esAviso ? ((i + j) & 1 ? PAL.aviso : PAL.aviso2) : PAL.arco[idc]));
        if(!esAviso && (j & 1)) cA.multiplyScalar(0.88);   // bandeado por tramos: da lectura de avance
        for(const [aa, zz] of [[a0, z0], [a1, z0], [a1, z1], [a0, z1]]){
          pos.push(Math.sin(aa) * R, -Math.cos(aa) * R, zz);
          nor.push(-Math.sin(aa), Math.cos(aa), 0);
          col.push(cA.r, cA.g, cA.b);
        }
        idx.push(v, v + 1, v + 2, v, v + 2, v + 3);
        v += 4;

        /* --- anillo de neón en el borde de la celda --- */
        if(anillo){
          const zr0 = z0 + 0.05, zr1 = z0 - 0.55, rr = R - 0.06;
          aLin(cA.setHex(PAL.arco[(idc + 3) % PAL.arco.length])).lerp(sRGB(0xffffff), 0.45);
          for(const [aa, zz] of [[a0, zr0], [a1, zr0], [a1, zr1], [a0, zr1]]){
            pos2.push(Math.sin(aa) * rr, -Math.cos(aa) * rr, zz);
            col2.push(cA.r, cA.g, cA.b);
          }
          idx2.push(v2, v2 + 1, v2 + 2, v2, v2 + 2, v2 + 3);
          v2 += 4;
        }
      }
    }
    if(v){
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal',   new THREE.Float32BufferAttribute(nor, 3));
      g.setAttribute('color',    new THREE.Float32BufferAttribute(col, 3));
      g.setIndex(idx);
      world.add(new THREE.Mesh(g, matPared));
    }
    if(v2){
      const g2 = new THREE.BufferGeometry();
      g2.setAttribute('position', new THREE.Float32BufferAttribute(pos2, 3));
      g2.setAttribute('color',    new THREE.Float32BufferAttribute(col2, 3));
      g2.setIndex(idx2);
      world.add(new THREE.Mesh(g2, matAnillo));
    }
  }
  console.log('[tubo] pared: ' + celdas + ' celdas de ' + (NC * NS) + ' · ' +
              TUBO.pista.agujeros.size + ' en agujeros · ' + Math.round(celdas * 2 / 1000) + 'k tris');
}

/* --- VALLAS: un muro curvo que sale de la pared hacia el eje. Cuerpo en
   rojo neón + labio claro arriba, porque un obstáculo hay que LEERLO a 150 u
   y una pieza de un solo color contra un tubo de colores no se lee. --- */
function buildVallas(world){
  const P = TUBO.pista; if(!P.vallas.length) return;
  const dA = dSEC(), R = K.R;
  const pos = [], nor = [], idx = [];
  const posT = [], idxT = [];
  let v = 0, vt = 0;
  const quad = (p, n, ix, arr, base) => {
    for(const q of arr){ p.push(q[0], q[1], q[2]); if(n) n.push(q[3], q[4], q[5]); }
    ix.push(base, base + 1, base + 2, base, base + 2, base + 3);
  };
  for(const F of P.vallas){
    const z0 = -F.s, z1 = -(F.s + K.vallaZ);
    for(let k = 0; k < F.n; k++){
      const i = (F.i0 + k) % K.NSEC;
      const a0 = i * dA, a1 = (i + 1) * dA;
      const rIn = R - F.alto, rOut = R;
      const p = (a, r, z) => [Math.sin(a) * r, -Math.cos(a) * r, z];
      const nz0 = [0, 0, 1], nz1 = [0, 0, -1];
      /* cara de delante (la que ves venir), cara de atrás y labio interior */
      quad(pos, nor, idx, [
        [...p(a0, rOut, z0), ...nz0], [...p(a1, rOut, z0), ...nz0],
        [...p(a1, rIn,  z0), ...nz0], [...p(a0, rIn,  z0), ...nz0]], v); v += 4;
      quad(pos, nor, idx, [
        [...p(a0, rIn,  z1), ...nz1], [...p(a1, rIn,  z1), ...nz1],
        [...p(a1, rOut, z1), ...nz1], [...p(a0, rOut, z1), ...nz1]], v); v += 4;
      /* el LABIO va sin normales: es MeshBasic (color plano brillante), que es
         justo lo que hace que se lea el canto a 150 u */
      quad(posT, null, idxT, [
        p(a0, rIn, z0), p(a1, rIn, z0), p(a1, rIn, z1), p(a0, rIn, z1)], vt); vt += 4;
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal',   new THREE.Float32BufferAttribute(nor, 3));
  g.setIndex(idx);
  world.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({
    color:sRGB(PAL.valla), emissive:sRGB(PAL.valla), emissiveIntensity:0.55, roughness:0.5,
    metalness:0.0, flatShading:true, side:THREE.DoubleSide })));

  const gt = new THREE.BufferGeometry();
  gt.setAttribute('position', new THREE.Float32BufferAttribute(posT, 3));
  gt.setIndex(idxT);
  world.add(new THREE.Mesh(gt, new THREE.MeshBasicMaterial({ color:sRGB(PAL.vallaTop), side:THREE.DoubleSide })));
}

/* --- BOMBAS: instanciadas. El parpadeo de la mecha va por instanceColor, y
   por eso la InstancedMesh se crea YA con su cuenta final: en r128
   instanceColor nace del tamaño de `count` en el momento de setColorAt (con 0
   sale todo negro). Ver la memoria three-r128-instancing-gotchas. --- */
function buildBombas(world){
  const P = TUBO.pista; const N = P.bombas.length;
  TUBO.bombas = null; if(!N) return;
  const geo = new THREE.IcosahedronGeometry(K.bombaR, 0);
  const mat = new THREE.MeshStandardMaterial({ color:0xffffff, vertexColors:false, roughness:0.45,
    metalness:0.1, flatShading:true, emissive:sRGB(PAL.bombaLuz), emissiveIntensity:0.95 });
  const im = new THREE.InstancedMesh(geo, mat, N);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  im.frustumCulled = false;
  const c = new THREE.Color();
  for(let i = 0; i < N; i++){ aLin(c.setHex(PAL.bomba)); im.setColorAt(i, c); }
  if(im.instanceColor) im.instanceColor.needsUpdate = true;
  world.add(im);
  TUBO.bombas = im;
}

/* --- ESTRELLAS: octaedros de neón, un color del arcoíris cada una. Van a
   1,4 u de la pared (a la altura del pecho): se cogen corriendo, no saltando,
   salvo las que se ponen a propósito encima de un anillo. --- */
function buildEstrellas(world){
  const P = TUBO.pista; const N = P.estrellas.length;
  TUBO.estrellas = null; if(!N) return;
  const geo = new THREE.OctahedronGeometry(0.85, 0);   // con 0,62 no se veían a 60 u, que es donde hay que decidir el carril
  const im = new THREE.InstancedMesh(geo,
    new THREE.MeshBasicMaterial({ toneMapped:false }), N);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  im.frustumCulled = false;
  const c = new THREE.Color();
  for(let i = 0; i < N; i++){
    const e = P.estrellas[i];
    aLin(c.setHex(e.big ? 0xffffff : PAL.arco[i % PAL.arco.length]));
    im.setColorAt(i, c);
  }
  if(im.instanceColor) im.instanceColor.needsUpdate = true;
  world.add(im);
  TUBO.estrellas = im;
  console.log('[tubo] ' + N + ' estrellas · ' + P.vallas.length + ' vallas · ' + P.bombas.length + ' bombas');
}

/* --- META: anillo blanco grueso + un aro de neón que gira --- */
function buildMeta(world){
  const g = new THREE.Group();
  const t = new THREE.Mesh(new THREE.TorusGeometry(K.R - 0.9, 0.9, 8, 40),
    new THREE.MeshBasicMaterial({ color:sRGB(PAL.meta) }));
  t.position.z = -K.largo;
  g.add(t);
  for(let k = 0; k < 3; k++){
    const t2 = new THREE.Mesh(new THREE.TorusGeometry(K.R - 2.4 - k * 2.2, 0.30, 6, 34),
      new THREE.MeshBasicMaterial({ color:sRGB(PAL.arco[(k * 2) % PAL.arco.length]), transparent:true, opacity:0.85 }));
    t2.position.z = -K.largo - 2 - k * 3;
    g.add(t2);
  }
  world.add(g);
  TUBO.metaG = g;
}

/* --- EL ESPACIO DE FUERA: solo se ve por los agujeros y más allá de la meta,
   y justamente por eso merece la pena — un agujero deja de ser "falta suelo"
   y pasa a ser "ahí fuera está el vacío". Estrellas + nebulosas con la misma
   receta del stage 10 (_s9NebulaTex). --- */
function buildEspacio(sc){
  const G = new THREE.Group();
  G.renderOrder = -1;
  {
    const N = 1400, pos = new Float32Array(N * 3);
    const rr = mulberry32(TUBO.seed ^ 0x51ee);
    for(let i = 0; i < N; i++){
      const a = rr() * TAU, e = (rr() * 1.9 - 0.95), R2 = 1200;
      pos[i*3] = Math.cos(a) * Math.cos(e) * R2;
      pos[i*3+1] = Math.sin(e) * R2;
      pos[i*3+2] = Math.sin(a) * Math.cos(e) * R2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ color:0xffffff, size:5.5,
      sizeAttenuation:true, transparent:true, opacity:0.95, blending:THREE.AdditiveBlending,
      depthWrite:false, fog:false }));
    pts.frustumCulled = false;
    G.add(pts);
  }
  {
    const tex = hex => {
      const cv = document.createElement('canvas'); cv.width = cv.height = 128;
      const ctx = cv.getContext('2d');
      const gr = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
      gr.addColorStop(0, hex + 'cc'); gr.addColorStop(0.5, hex + '44'); gr.addColorStop(1, hex + '00');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(cv);
    };
    const NEB = [['#7a4aff', -600, 260, -700, 460], ['#ff4a9a', 620, 170, -520, 380],
                 ['#3ac8ff', -260, 400, -860, 520], ['#ffb84a', 340, 110, -820, 300]];
    for(const d of NEB){
      const m = new THREE.Mesh(new THREE.PlaneGeometry(d[4], d[4]),
        new THREE.MeshBasicMaterial({ map:tex(d[0]), transparent:true, opacity:0.55,
          blending:THREE.AdditiveBlending, depthWrite:false, fog:false, side:THREE.DoubleSide }));
      m.position.set(d[1], d[2], d[3]);
      m.lookAt(0, 0, 0);
      G.add(m);
    }
  }
  sc.add(G);
  TUBO.espacio = G;   // se re-pega a la cámara cada frame (si no, se ve el borde del mundo)
}

/* --- rayas de velocidad: cajas alargadas recicladas alrededor de la cámara.
   Es lo que más vende la velocidad junto al desenfoque periférico. --- */
function buildStreaks(sc){
  const N = Math.round(K.streakN * clamp(K.densDeco, 0, 1.5));
  if(N <= 0){ TUBO.streaks = null; return; }
  const im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.07, 0.07, 1),
    new THREE.MeshBasicMaterial({ color:sRGB(0xbfd8ff), transparent:true, opacity:0.42,
      depthWrite:false, fog:false, blending:THREE.AdditiveBlending }), N);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  im.frustumCulled = false;
  im.renderOrder = 3;
  sc.add(im);
  const S = { im, N, x:new Float32Array(N), y:new Float32Array(N), z:new Float32Array(N), on:new Uint8Array(N) };
  TUBO.streaks = S;
}

/* --- chispas: un pool para estrellas cogidas, explosiones y caídas --- */
function buildPop(world){
  const N = 260;
  const im = new THREE.InstancedMesh(new THREE.TetrahedronGeometry(0.30, 0),
    new THREE.MeshBasicMaterial({ vertexColors:false, transparent:true, opacity:0.95,
      depthWrite:false, blending:THREE.AdditiveBlending }), N);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  im.frustumCulled = false;
  const c = new THREE.Color(0xffffff);
  for(let i = 0; i < N; i++) im.setColorAt(i, c);
  if(im.instanceColor) im.instanceColor.needsUpdate = true;
  world.add(im);
  TUBO.pop = { im, N, i:0, col:new THREE.Color(),
    x:new Float32Array(N), y:new Float32Array(N), z:new Float32Array(N),
    vx:new Float32Array(N), vy:new Float32Array(N), vz:new Float32Array(N),
    life:new Float32Array(N), size:new Float32Array(N) };
}
function chispa(x, y, z, vx, vy, vz, size, hex){
  const P = TUBO.pop; if(!P) return;
  const i = P.i = (P.i + 1) % P.N;
  P.x[i]=x; P.y[i]=y; P.z[i]=z; P.vx[i]=vx; P.vy[i]=vy; P.vz[i]=vz;
  P.life[i] = 0.42 + Math.random() * 0.4; P.size[i] = size;
  if(hex != null && P.im.instanceColor){ aLin(P.col.setHex(hex)); P.im.setColorAt(i, P.col); P.im.instanceColor.needsUpdate = true; }
}
function reventon(a, s, h, n, fuerza, hex){
  punto(a, s, h, _vTmp);
  for(let i = 0; i < n; i++){
    chispa(_vTmp.x, _vTmp.y, _vTmp.z,
      (Math.random()-0.5) * fuerza * 2, (Math.random()-0.5) * fuerza * 2,
      (Math.random()-0.3) * fuerza * 1.6, 0.5 + Math.random() * 0.8, hex);
  }
}

/* =====================================================================
   PERSONAJES — los GLB del juego, con su recolor de marca
   (mismo procedimiento que descenso.js: aquí no se inventa un cargador)
   ===================================================================== */
function montaPersonaje(r){
  const tpl = tplDe(r.clase);
  if(!tpl || r.montado) return;
  const SKU = THREE.SkeletonUtils;
  const model = SKU ? SKU.clone(tpl.scene) : tpl.scene.clone(true);

  model.traverse(o => {
    if(!o.isMesh && !o.isSkinnedMesh) return;
    o.frustumCulled = false;
    const clona = m => (m ? m.clone() : m);
    o.material = Array.isArray(o.material) ? o.material.map(clona) : clona(o.material);
    const ms = Array.isArray(o.material) ? o.material : [o.material];
    try {
      if(typeof BRAND_HUE !== 'undefined' && BRAND_HUE[r.clase] != null && typeof recolorAtlas === 'function'){
        ms.forEach(m => { if(m && m.map){ const t = recolorAtlas(m.map, r.clase);
          if(t){ m.map = t; if(m.color) m.color.setRGB(1,1,1); m.needsUpdate = true; }
          else r._recolorPend = true; } });
      }
    } catch(e){}
    /* metalness a 0: esta escena no tiene scene.environment y un Standard con
       metalness>0 sin mapa de entorno se pinta NEGRO (►ENVMAP) */
    ms.forEach(m => { if(!m) return;
      if('metalness' in m) m.metalness = 0.0;
      if('roughness' in m) m.roughness = Math.max(0.55, m.roughness != null ? m.roughness : 0.7);
      if(m.emissive && r.clase !== 'knight'){ m.emissive.copy(m.color || new THREE.Color(0xffffff)); m.emissiveIntensity = 0.12; }
      m.needsUpdate = true; });
    try {
      if(r.clase === 'knight' && typeof KNIGHT_LIGHTEN !== 'undefined'){
        ms.forEach(m => { if(!m || !m.emissive) return;
          m.emissive.setHex(KNIGHT_LIGHTEN); m.emissiveIntensity = KNIGHT_LIGHTEN_I;
          if('metalness' in m) m.metalness = 0.0; if('roughness' in m) m.roughness = 0.65;
          m.needsUpdate = true; });
      }
    } catch(e){}
  });

  model.updateMatrixWorld(true);
  let caja;
  try { caja = (typeof charModelBox === 'function') ? charModelBox(model) : new THREE.Box3().setFromObject(model); }
  catch(e){ caja = new THREE.Box3().setFromObject(model); }
  const sz = new THREE.Vector3(); caja.getSize(sz);
  let alto = 2.0;
  try { alto = (typeof CHAR_TARGET_H !== 'undefined' ? CHAR_TARGET_H : 2.0); } catch(e){}
  const e = (alto * K.charScale) / (sz.y || 1);
  model.scale.setScalar(e);
  model.position.y = -caja.min.y * e;
  /* ►SIN YAW: el +Z local del grupo YA es la dirección de avance (ver el
     bloque EL MARCO DEL TUBO). En el descenso hace falta π porque allí el
     grupo del corredor no rota; aquí sí. */
  model.rotation.y = 0;
  r.alto = alto * K.charScale;

  /* toda la geometría y las texturas son de la plantilla del juego: NO se
     pueden disponer al reiniciar (se llevaría por delante a los del juego) */
  model.traverse(o => { o.userData = o.userData || {}; o.userData._compartido = true; });
  r.body.remove(r.capsula);
  r.body.add(model);
  r.model = model;
  r.montado = true;

  /* clips: los del juego (fastrun/run/jump/fall/idle) + los que se inyectaron
     para el descenso (wipeout/getup), que son los que pidió Toni para la
     voltereta contra una valla */
  r.mixer = new THREE.AnimationMixer(model);
  r.acts = {}; r.dur = {};
  for(const nom of ['fastrun', 'run', 'idle', 'jump', 'fall', 'wipeout', 'getup']){
    const c = (tpl.animations || []).find(a => a.name === nom);
    if(c){ const act = r.mixer.clipAction(c); act.enabled = true; r.acts[nom] = act; r.dur[nom] = c.duration; }
  }
  for(const nom of ['jump', 'wipeout', 'getup']){
    if(r.acts[nom]){ r.acts[nom].setLoop(THREE.LoopOnce, 1); r.acts[nom].clampWhenFinished = true; }
  }
  r.correr = r.acts.fastrun ? 'fastrun' : (r.acts.run ? 'run' : 'idle');
  if(r.acts[r.correr]) r.acts[r.correr].play();
  r.animCur = r.correr;
}

function animA(r, nom){
  if(!r.acts || !r.acts[nom] || r.animCur === nom) return;
  const nuevo = r.acts[nom], viejo = r.acts[r.animCur];
  nuevo.reset(); nuevo.enabled = true; nuevo.setEffectiveWeight(1); nuevo.play();
  if(viejo && viejo !== nuevo) viejo.crossFadeTo(nuevo, K.animFade, false);
  r.animCur = nom;
}

/* máquina de estados, una decisión por frame y en orden de prioridad.
   La voltereta (crash) y la caída NO se deciden aquí: las lanzan choca() y
   caeAlVacio(), que sí saben con qué duración hay que estirar el clip. */
function animEstado(r){
  if(!r.montado) return;
  if(r.fuera > 0 || r.crash > 0) return;      // wipeout/getup/fall los manda quien los lanzó
  if(r.air) animA(r, r.acts.jump ? 'jump' : r.correr);
  else animA(r, r.correr);
  /* las piernas siguen la velocidad real: sin esto, a 70 u/s los pies patinan */
  const act = r.acts[r.correr];
  if(act) act.timeScale = clamp(r.vel / 42, 0.75, 2.1);
}

/* =====================================================================
   CORREDORES
   ===================================================================== */
function makeRacer(i, human){
  const g = new THREE.Group();
  const clase = CLASES[i % CLASES.length];
  const col = colorDe(clase, i);

  const body = new THREE.Group();
  /* cápsula de respaldo: los GLB son 12 MB y llegan async; sin esto la
     parrilla sale vacía durante la presentación */
  const capsula = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({ color: sRGB(col) });
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.7, 12), mat);
  torso.position.y = 1.15; capsula.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.52, 14, 10), mat);
  head.position.y = 2.28; capsula.add(head);
  body.add(capsula);
  g.add(body);

  /* ►IMÁN: el disco de neón bajo los pies. No es decoración — es lo que
     explica por qué este tío corre por el techo, y además hace de sombra
     falsa para saber dónde estás pisando cuando saltas. */
  const iman = new THREE.Mesh(new THREE.RingGeometry(0.55, 1.15, 20),
    new THREE.MeshBasicMaterial({ color:sRGB(col), transparent:true, opacity:0.55,
      depthWrite:false, side:THREE.DoubleSide, blending:THREE.AdditiveBlending }));
  iman.rotation.x = -Math.PI / 2;
  iman.position.y = 0.05;

  TUBO.world.add(g);
  TUBO.world.add(iman);

  const a0 = norm((i - 1.5) * 0.42);
  const r = {
    i, human, col, clase,
    name: human ? ('P' + (i + 1)) : ('CPU-' + 'ABC'[Math.max(0, i - HUMANS)]),
    gfx:g, body, capsula, iman,
    montado:false, model:null, mixer:null, acts:null, animCur:null, correr:'idle', alto:3.1,
    padIndex: human ? (HUMANS === 1 ? 0 : i) : -1,
    kb: human && i === 0,
    /* --- estado en el marco del tubo --- */
    s:0, a:a0, h:0, vh:0, vlat:0, vel:K.vel0,
    air:false, saltoUsado:false, _coy:0, _buf:0,
    crash:0, crashFase:0, fuera:0, fueraFase:0, parp:0, inv:0, rueda:0,
    /* --- marcador --- */
    pts:0, estrellas:0, golpes:0, caidas:0, bombas:0,
    done:false, parado:false, place:0, time:0,
    _inp:null, _ai:{ carril:a0, saltoT:0 },
  };
  ponEnPared(r);
  return r;
}

/* coloca el gráfico de un corredor a partir de (a, s, h) */
function ponEnPared(r){
  punto(r.a, r.s, r.h, _vTmp);
  r.gfx.position.copy(_vTmp);
  orienta(r.gfx, r.a);
  punto(r.a, r.s, 0, _vTmp);
  r.iman.position.copy(_vTmp);
  orienta(r.iman, r.a);
  r.iman.rotateX(-Math.PI / 2);
}

/* =====================================================================
   INPUT — lo que pidió Toni y nada más: moverse alrededor y saltar
   ===================================================================== */
function readTubo(r){
  const o = { ax:0, jump:false };
  if(!r.human) return o;
  const kk = GAME_KEYS() || {};
  if(r.kb){
    if(kk['KeyD'] || kk['ArrowRight']) o.ax += 1;
    if(kk['KeyA'] || kk['ArrowLeft'])  o.ax -= 1;
    o.jump = !!(kk['Space'] || kk['KeyW'] || kk['ArrowUp']);
  }
  if(r.padIndex >= 0 && navigator.getGamepads){
    const gp = navigator.getGamepads(), pad = gp && gp[r.padIndex];
    if(pad){
      const lx = pad.axes[0] || 0;
      if(Math.abs(lx) > 0.22) o.ax += lx;
      const B = i => !!(pad.buttons[i] && pad.buttons[i].pressed);
      o.jump = o.jump || B(0);
      if(B(14)) o.ax -= 1; if(B(15)) o.ax += 1;   // cruceta
    }
  }
  o.ax = clamp(o.ax, -1, 1);
  return o;
}

/* --- IA: elige CARRIL (el sector angular más barato de aquí a aiLook) y salta
   cuando lo que le viene de frente no se puede esquivar a tiempo.
   Mirar "qué hay en mi sector" es exactamente lo que hace un jugador, y sale
   gratis porque la pista ya está indexada por celda. --- */
function costeCarril(r, i, skill){
  const P = TUBO.pista;
  const dA = dSEC(), a = (i + 0.5) * dA;
  const look = K.aiLook * (0.6 + skill * 0.55);
  let coste = 0;
  /* agujeros: mirar celda a celda es barato y es LA fuente de verdad */
  for(let s = r.s + 6; s < r.s + look; s += K.segZ){
    if(P.agujeros.has(jCel(s) * K.NSEC + i)) coste += 40 * (1 - (s - r.s) / look);
  }
  for(let s = r.s; s < r.s + look; s += K.segZ){
    const bs = enCubo(P._bb, s);
    if(bs) for(const b of bs){
      if(b.s < r.s + 4 || b.s > r.s + look) continue;
      if(Math.abs(difA(b.a, a)) * K.R < 3.2) coste += 26 * (1 - (b.s - r.s) / look);
    }
    const es = enCubo(P._eb, s);
    if(es) for(const e of es){
      if((e.cog & (1 << r.i)) || e.s < r.s + 4 || e.s > r.s + look) continue;
      if(Math.abs(difA(e.a, a)) * K.R < 2.6) coste -= (e.big ? 9 : 3) * K.aiRebusca;
    }
  }
  return coste;
}
function aiInput(r, dt){
  const o = { ax:0, jump:false };
  const skill = K.aiSkill[Math.min(K.aiSkill.length - 1, Math.max(0, r.i - HUMANS))] || 0.85;
  const NS = K.NSEC, dA = dSEC();

  /* ►DESPISTE (ver K.aiDespiste): no salta y se VA DE LÍNEA. Que solo dejara de
     girar no bastaba — como ya estaba en un carril bueno, quedarse quieto era
     seguro y salían 0 caídas en 16 carreras. Un despistado DERIVA, y derivando
     sí se cae por un agujero, que es lo que hay que poder ver pasar. */
  if((r._ai.desp || 0) > 0){
    r._ai.desp -= dt;
    return { ax: r._ai.despAx, jump:false };
  }
  if(Math.random() < (1 - skill) * K.aiDespiste * dt){
    r._ai.desp = 0.40 + Math.random() * 0.65;
    r._ai.despAx = (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.5);
  }

  /* 1 · carril. Se re-decide cada 0,22 s (no cada frame: si no, tiembla) */
  r._ai.t = (r._ai.t || 0) - dt;
  if(r._ai.t <= 0){
    r._ai.t = 0.22;
    const iMe = iSec(r.a);
    let mejor = iMe, mc = 1e9;
    for(let d = -6; d <= 6; d++){
      const i = ((iMe + d) % NS + NS) % NS;
      /* cambiar de carril cuesta: sin esto la CPU zigzaguea buscando la
         estrella de al lado y se come todo lo que hay en medio */
      const c = costeCarril(r, i, skill) + Math.abs(d) * (1.6 + (1 - skill) * 3);
      if(c < mc){ mc = c; mejor = i; }
    }
    r._ai.carril = (mejor + 0.5) * dA;
  }
  const d = difA(r._ai.carril, r.a);
  o.ax = clamp(d * K.R / 6, -1, 1);
  /* torpeza: los peores no clavan la línea */
  o.ax *= 0.72 + skill * 0.3;

  /* 2 · saltar. Se calcula el TIEMPO al obstáculo y se compara con el vuelo:
     no "está cerca", sino "si salto ahora, ¿caigo al otro lado?".
     ►EL BARRIDO VA CELDA A CELDA. Antes se consultaba el índice solo en s+30 y
     s+60, y como cada cubeta cubre ±1 celda (±6 u), una valla a 10 u NO SE VEÍA
     NUNCA: medido, las cuatro IAs se comían casi todos los anillos (6-7 golpes
     por carrera, los mismos cuatro a la vez). Recorrer las cubetas es igual de
     barato y no tiene puntos ciegos. */
  if(!r.air && r.crash <= 0 && r.fuera <= 0){
    const vuelo = 2 * K.saltoV / K.grav;
    const iMe = iSec(r.a);
    let dist = 1e9;
    for(let s = r.s; s < r.s + 100; s += K.segZ){
      if(TUBO.pista.agujeros.has(jCel(s) * NS + iMe)){ dist = Math.min(dist, s - r.s); break; }
    }
    for(let s = r.s; s < r.s + 100; s += K.segZ){
      const vs = enCubo(TUBO.pista._vb, s);
      if(!vs) continue;
      for(const F of vs){
        if(F.s < r.s || F.s - r.s > dist) continue;
        const k = ((iMe - F.i0) % NS + NS) % NS;
        if(k < F.n) dist = F.s - r.s;
      }
    }
    if(dist < 1e8){
      const tI = dist / Math.max(1, r.vel);
      const err = (1 - skill) * 0.09;
      if(tI < vuelo * (0.46 + err) && tI > vuelo * 0.14) o.jump = true;
    }
  }
  r._ai.axUlt = o.ax;
  return o;
}

/* =====================================================================
   EVENTOS
   ===================================================================== */
/* voltereta contra una valla o una bomba. Toni: "rota sobre sí mismo como en
   el snowboard ?descenso" → el clip 'wipeout' del descenso, estirado para que
   dure justo lo que dura el castigo, y encima una vuelta de campana del
   cuerpo (el clip solo no lee como "rodar" a esta velocidad). */
function choca(r, por){
  if(r.crash > 0 || r.fuera > 0 || r.inv > 0) return;
  r.crash = K.crashT; r.crashFase = 0; r.rueda = 0;
  r.inv = K.crashT + K.crashInv;
  r.golpes++;
  r.air = false; r.h = 0; r.vh = 0; r.saltoUsado = false;
  if(r.montado && r.acts.wipeout){
    r.acts.wipeout.timeScale = (r.dur.wipeout || 2.2) / (K.crashT * 0.72);
    animA(r, 'wipeout');
  }
  reventon(r.a, r.s, 1.0, 16, 7, por === 'bomba' ? 0xff8a3d : 0xff5a5a);
  if(r.human){ sndRafaga(240, 0.3, 0.55); sacude(0.5); }
}
/* la bomba: además de la voltereta, te empuja HACIA ATRÁS y te quita puntos.
   ►Es lo único de los tres peligros cuyo efecto Toni no cerró. */
function explota(r){
  if(r.inv > 0 || r.fuera > 0) return;
  const yaChocado = r.crash > 0;
  choca(r, 'bomba');
  if(yaChocado) return;
  r.bombas++;
  r.s = Math.max(0, r.s - K.bombaEmpuje);
  r.pts = Math.max(0, r.pts + K.ptsBomba);
  reventon(r.a, r.s, 1.4, 30, 13, 0xffcc44);
  if(r.human){ sndBoom(); flash('¡BOMBA!', '#ff6a3d'); }
}
/* el agujero: sales despedido hacia FUERA del tubo, desapareces y vuelves unos
   segundos después parpadeando, en el plano donde la cámara te ha esperado */
function caeAlVacio(r){
  if(r.fuera > 0) return;
  r.fuera = K.caidaT + K.reapT;
  r.fueraFase = 0;
  r.caidas++;
  r.crash = 0;
  r.air = false; r.vh = 0; r.saltoUsado = false;
  if(r.montado && r.acts.fall) animA(r, 'fall');
  else if(r.montado && r.acts.wipeout){ r.acts.wipeout.timeScale = 1; animA(r, 'wipeout'); }
  reventon(r.a, r.s, 0.4, 22, 9, 0x8ad8ff);
  if(r.human){ sndCaida(); sacude(0.8); flash('¡AL VACÍO!', '#8ad8ff'); }
}
function reaparece(r){
  /* ►Vuelve DONDE ESTÁ, no donde está la cámara. Teletransportar al plano de la
     cámara (que es lo que hacía la v1) borraba el castigo entero: medido, 0
     distancia perdida al caerse, y encima a una CPU la adelantaba gratis hasta
     el plano del jugador. La cámara sigue esperándole en su plano porque el
     que cae SÍ avanza mientras está fuera, solo que al 40% (K.velFuera): al
     volver está justo por delante de ella, y los rivales se han ido.
     El ÁNGULO se busca: reaparecer sobre otro agujero es un bucle de muerte
     (la lección del labio del precipicio del descenso, 48 reposiciones). */
  let mejor = r.a, mc = 1e9;
  for(let d = 0; d < K.NSEC; d++){
    const i = (iSec(r.a) + d) % K.NSEC;
    const a = (i + 0.5) * dSEC();
    let c = Math.abs(difA(a, r.a)) * 2;
    for(let k = 0; k < 5; k++) if(agujeroEn(a, r.s + k * K.segZ)) c += 50;
    if(c < mc){ mc = c; mejor = a; }
  }
  r.a = mejor; r.h = 0; r.vh = 0; r.vlat = 0;
  r.air = false; r.saltoUsado = false;
  r.parp = K.parpT; r.inv = K.parpT;
  if(r.montado) animA(r, r.correr);
}
/* ►LAS ESTRELLAS SON DE CADA UNO, no del mapa. Con una marca única la cogía el
   primero que pasaba y a los demás no les quedaba nada: medido, P1 se llevaba
   235 de 386 y CPU-A terminaba con CERO en dos de tres carreras. Como todos
   corren a la misma velocidad, "quien llega antes se lo lleva todo" convierte
   la carrera en una lotería de la parrilla. Máscara de bits por corredor; lo
   que se DIBUJA es lo que le queda al jugador de la cámara (bit 0). */
function cogeEstrella(r, e){
  e.cog |= (1 << r.i);
  const p = e.big ? K.ptsGrande : K.ptsEstrella;
  r.pts += p; r.estrellas++;
  reventon(e.a, e.s, 1.4, e.big ? 14 : 6, e.big ? 7 : 4, e.big ? 0xffffff : 0xffe14d);
  if(r.human) sndDing(e.big ? 5 : Math.min(5, (r._chain = (r._chain || 0) + 1) >> 2));
  if(r.human && e.big) flash('+' + p, '#ffe14d');
}

/* =====================================================================
   PASO DE SIMULACIÓN (paso fijo — ver TUBO.tick)
   ===================================================================== */
function stepRacer(r, dt){
  const P = TUBO.pista;
  const inp = r._inp || { ax:0, jump:false };

  /* --- 1 · fuera de juego (agujero): ni corre ni controla --- */
  if(r.fuera > 0){
    r.fuera -= dt;
    r.fueraFase += dt;
    /* fuera del tubo se sigue avanzando, pero al 40%: ver K.velFuera */
    r.vel = velTubo(TUBO.t) * K.velFuera;
    r.s += r.vel * dt;
    /* sale despedido hacia FUERA del tubo (h negativa = atraviesa la pared) */
    if(r.fueraFase < K.caidaT){
      r.h -= (14 + r.fueraFase * 26) * dt;
      ponEnPared(r);
      r.gfx.visible = true; r.iman.visible = false;
    } else {
      r.gfx.visible = false; r.iman.visible = false;
    }
    if(r.fuera <= 0){ reaparece(r); r.gfx.visible = true; r.iman.visible = true; }
    return;
  }

  /* --- 2 · velocidad: la del tubo, más el rebufo del que va detrás --- */
  const vBase = velTubo(TUBO.t);
  let v = vBase;
  if(K.rebufo > 0 && !r.done){
    const lider = TUBO.lider || r;
    const gap = lider.s - r.s;
    if(gap > 4) v *= 1 + K.rebufo * clamp(gap / K.rebufoGap, 0, 1);
  }
  if(r.crash > 0) v *= K.crashVel;
  if(r.done) v *= Math.max(0, 1 - (TUBO.t - r.time) * 0.55);   // tras la meta, frena hasta parar
  r.vel = v;
  r.s += v * dt;

  /* --- 3 · la voltereta --- */
  if(r.crash > 0){
    r.crash -= dt;
    r.rueda += dt / K.crashT * TAU * 1.5;      // vuelta y media de campana
    if(r.crash <= 0){
      r.rueda = 0;
      if(r.montado && r.acts.getup){
        r.acts.getup.timeScale = (r.dur.getup || 2) / 0.55;
        animA(r, 'getup');
      }
    }
  }
  if(r.inv > 0) r.inv -= dt;
  if(r.parp > 0) r.parp -= dt;

  const puedeMandar = r.crash <= 0 && !r.done;

  /* --- 4 · moverse alrededor. El stick pide VELOCIDAD lateral y se llega a
     ella con aceleración: un integrador puro (mantener = sumar ángulo) es lo
     que hizo que el descenso se sintiera como pelearse con el volante. --- */
  const objetivo = (puedeMandar ? inp.ax : 0) * K.lateral * (r.air ? K.latAire : 1);
  const acel = K.latAcel * dt;
  r.vlat += clamp(objetivo - r.vlat, -acel, acel);
  r.a = norm(r.a + (r.vlat / K.R) * dt);

  /* --- 5 · saltar (UNO solo, con coyote y búfer: sin ellos un salto perdido
     por un frame se siente como un fallo del juego, no tuyo) --- */
  if(inp.jump && !r._jPrev) r._buf = K.bufer;
  r._jPrev = inp.jump;
  if(r._buf > 0) r._buf -= dt;
  if(r._coy > 0) r._coy -= dt;
  if(puedeMandar && r._buf > 0 && !r.saltoUsado && (!r.air || r._coy > 0)){
    r.vh = K.saltoV; r.air = true; r.saltoUsado = true; r._buf = 0; r._coy = 0;
    if(r.montado && r.acts.jump){ r.acts.jump.timeScale = 1.25; animA(r, 'jump'); }
    if(r.human) sndSwoosh();
  }
  if(r.air){
    r.vh -= K.grav * dt;
    r.h += r.vh * dt;
    if(r.h <= 0){
      r.h = 0; r.vh = 0; r.air = false; r.saltoUsado = false;
      if(r.human) sndThump(0.35);
    }
  }

  /* --- 6 · ¿hay suelo debajo? (agujeros) --- */
  const hayAgujero = agujeroEn(r.a, r.s);
  if(!r.air && r.h <= 0){
    if(hayAgujero && r.s < K.largo){ caeAlVacio(r); return; }
    r._coy = K.coyote;
  } else if(r.air && r.h <= 0.01 && hayAgujero){
    /* aterrizando sobre un agujero: te lo comes igual */
    caeAlVacio(r); return;
  }

  /* --- 7 · vallas --- */
  if(r.crash <= 0 && r.inv <= 0){
    const vs = enCubo(P._vb, r.s);
    if(vs) for(const F of vs){
      if(r.s < F.s - 0.4 || r.s > F.s + K.vallaZ + 0.4) continue;
      if(r.h >= F.alto) continue;
      const k = ((iSec(r.a) - F.i0) % K.NSEC + K.NSEC) % K.NSEC;
      if(k < F.n){ choca(r, 'valla'); break; }
    }
  }

  /* --- 8 · bombas --- */
  if(r.inv <= 0){
    const bs = enCubo(P._bb, r.s);
    if(bs) for(const b of bs){
      if(Math.abs(b.s - r.s) > K.bombaR + 1.0) continue;
      if(r.h > K.bombaR + 1.2) continue;
      if(Math.abs(difA(b.a, r.a)) * K.R > K.bombaR + 1.0) continue;
      explota(r); break;
    }
  }

  /* --- 9 · estrellas --- */
  {
    const es = enCubo(P._eb, r.s), bit = 1 << r.i;
    if(es) for(const e of es){
      if(e.cog & bit) continue;
      if(Math.abs(e.s - r.s) > 2.4) continue;
      if(Math.abs(difA(e.a, r.a)) * K.R > 2.4) continue;
      if(Math.abs((e.big ? 2.6 : 1.4) - r.h) > 2.6) continue;
      cogeEstrella(r, e);
    }
    if(!es || !es.length) r._chain = 0;
  }

  /* --- 10 · meta --- */
  if(!r.done && r.s >= K.largo){
    r.done = true; r.time = TUBO.t;
    TUBO.finishOrder.push(r);
    r.place = TUBO.finishOrder.length;
    r.pts += K.ptsPos[Math.min(K.ptsPos.length - 1, r.place - 1)];
    if(r.human) metaCruzada(r);
  }
  if(r.done && r.vel < 1.2) r.parado = true;

  ponEnPared(r);
}

/* =====================================================================
   VISUAL POR FRAME (lo que NO es física: postura, parpadeo, pools)
   ===================================================================== */
function pintaRacer(r, dt){
  /* la voltereta: vuelta de campana sobre el eje transversal */
  r.body.rotation.x = r.crash > 0 ? -r.rueda : lerp(r.body.rotation.x, 0, Math.min(1, 10 * dt));
  /* ►PARPADEO al reaparecer (Toni, literal) */
  if(r.parp > 0 && r.fuera <= 0) r.gfx.visible = (Math.sin(TUBO.t * 26) > -0.15);
  else if(r.fuera <= 0) r.gfx.visible = true;
  /* el imán late y se apaga en el aire: dice si estás pisando o no */
  const k = r.air ? 0.22 : 0.55 + 0.14 * Math.sin(TUBO.t * 7 + r.i);
  r.iman.material.opacity = r.gfx.visible ? k : 0;
  r.iman.visible = r.fuera <= 0;
  /* estela de velocidad por los talones */
  r._tr = (r._tr || 0) + dt;
  if(r._tr > 0.05 && !r.air && r.fuera <= 0 && TUBO.phase === 'race'){
    r._tr = 0;
    punto(r.a, r.s - 1.2, 0.15, _vTmp);
    chispa(_vTmp.x, _vTmp.y, _vTmp.z, 0, 0, 12, 0.35, r.col);
  }
}

function updatePop(dt){
  const P = TUBO.pop; if(!P) return;
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  for(let i = 0; i < P.N; i++){
    if(P.life[i] > 0){
      P.life[i] -= dt;
      P.x[i] += P.vx[i] * dt; P.y[i] += P.vy[i] * dt; P.z[i] += P.vz[i] * dt;
      P.vx[i] *= 0.94; P.vy[i] *= 0.94; P.vz[i] *= 0.97;
      const k = Math.max(0, P.life[i]);
      p.set(P.x[i], P.y[i], P.z[i]);
      q.setFromAxisAngle(_FWD, P.life[i] * 9);
      s.setScalar(P.size[i] * k);
      m.compose(p, q, s);
    } else m.makeScale(0, 0, 0);
    P.im.setMatrixAt(i, m);
  }
  P.im.instanceMatrix.needsUpdate = true;
}

function updateEstrellas(dt){
  const im = TUBO.estrellas; if(!im) return;
  const L = TUBO.pista.estrellas;
  const cam = TUBO.cam;
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  const zMin = -cam.position.z - 40, zMax = -cam.position.z + 480;   // solo las que se pueden ver
  for(let i = 0; i < L.length; i++){
    const e = L[i];
    if((e.cog & 1) || e.s < zMin || e.s > zMax){ m.makeScale(0, 0, 0); im.setMatrixAt(i, m); continue; }
    punto(e.a, e.s, e.big ? 2.6 : 1.4, p);
    q.setFromAxisAngle(_FWD, TUBO.t * 2.2 + i);
    const k = e.big ? 1.9 : 1;
    s.set(k, k * (1 + 0.12 * Math.sin(TUBO.t * 6 + i)), k);
    m.compose(p, q, s);
    im.setMatrixAt(i, m);
  }
  im.instanceMatrix.needsUpdate = true;
}

function updateBombas(dt){
  const im = TUBO.bombas; if(!im) return;
  const L = TUBO.pista.bombas;
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  const c = new THREE.Color(), base = sRGB(PAL.bomba), luz = sRGB(PAL.bombaLuz);
  const zMin = -TUBO.cam.position.z - 40, zMax = -TUBO.cam.position.z + 480;
  let toca = false;
  for(let i = 0; i < L.length; i++){
    const b = L[i];
    if(b.s < zMin || b.s > zMax){ m.makeScale(0, 0, 0); im.setMatrixAt(i, m); continue; }
    punto(b.a, b.s, K.bombaR * 0.75, p);
    q.setFromAxisAngle(_FWD, TUBO.t * 1.3 + i);
    s.setScalar(1 + 0.06 * Math.sin(TUBO.t * 9 + i));
    m.compose(p, q, s);
    im.setMatrixAt(i, m);
    /* ►LA MECHA: el parpadeo va por instanceColor. Sin él una bomba negra
       sobre un tubo oscuro no se ve hasta que la tienes encima. */
    if(im.instanceColor){
      c.copy(base).lerp(luz, 0.35 + 0.65 * Math.pow(Math.max(0, Math.sin(TUBO.t * 7 + i * 1.7)), 3));
      im.setColorAt(i, c); toca = true;
    }
  }
  im.instanceMatrix.needsUpdate = true;
  if(toca && im.instanceColor) im.instanceColor.needsUpdate = true;
}

function updateStreaks(dt){
  const S = TUBO.streaks; if(!S) return;
  const cam = TUBO.cam;
  const k = clamp((velTubo(TUBO.t) - K.vel0) / Math.max(1, K.vel1 - K.vel0), 0, 1);
  const act = Math.round(S.N * (0.25 + 0.75 * k));
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), p = new THREE.Vector3();
  for(let i = 0; i < S.N; i++){
    if(i >= act){ m.makeScale(0, 0, 0); S.im.setMatrixAt(i, m); continue; }
    if(!S.on[i]){
      const a = Math.random() * TAU, rr = 4 + Math.random() * (K.R - 6);
      S.x[i] = Math.sin(a) * rr; S.y[i] = -Math.cos(a) * rr;
      S.z[i] = cam.position.z - 40 - Math.random() * 260;
      S.on[i] = 1;
    }
    S.z[i] += (velTubo(TUBO.t) * 1.7) * dt;
    if(S.z[i] > cam.position.z + 12) S.on[i] = 0;
    p.set(S.x[i], S.y[i], S.z[i]);
    sc.set(1, 1, 7 + 26 * k);
    m.compose(p, q, sc);
    S.im.setMatrixAt(i, m);
  }
  S.im.instanceMatrix.needsUpdate = true;
}

/* =====================================================================
   CÁMARA — vive en SU plano (ver ►DECISIÓN 5)
   ===================================================================== */
const _cLook = new THREE.Vector3(), _cPos = new THREE.Vector3(), _cUp = new THREE.Vector3();
let _camInit = false;
function sacude(v){ TUBO._kick = Math.max(TUBO._kick || 0, v); }

function stepCamera(dt){
  const r = TUBO.racers[0]; if(!r) return;
  const cam = TUBO.cam;

  /* ►"LA CÁMARA NO LE SIGUE, LE ESPERA EN EL MISMO PLANO POR DETRÁS" (Toni).
     La cámara solo usa `s` y `a`: NUNCA `h`. Así que cuando el jugador sale
     despedido hacia fuera del tubo, ella se queda en su plano y no se va
     detrás de él por el agujero. Y como el caído sigue avanzando al 40%, la
     cámara se frena con él y se VE cómo los rivales se largan — que es el
     castigo, y es información. */
  TUBO.camS = lerp(TUBO.camS, r.s, Math.min(1, (r.fuera > 0 ? 3.5 : 9) * dt));
  if(TUBO.camS > K.largo + K.meta - 30) TUBO.camS = K.largo + K.meta - 30;

  /* el ángulo se persigue con retardo: al 100% e instantáneo el tubo entero
     barre la pantalla en cada movimiento y marea (lección del descenso) */
  if(!_camInit){ TUBO.camA = r.a; _camInit = true; }
  if(r.fuera <= 0) TUBO.camA = norm(TUBO.camA + difA(r.a, TUBO.camA) * Math.min(1, K.camSigue * dt));

  const k = clamp((velTubo(TUBO.t) - K.vel0) / Math.max(1, K.vel1 - K.vel0), 0, 1);
  punto(TUBO.camA, TUBO.camS - K.camDist, K.camAlto, _cPos);
  punto(TUBO.camA, TUBO.camS + K.camMira, K.camAlto * 0.35, _cLook);

  const kick = TUBO._kick || 0;
  if(kick > 0) TUBO._kick = Math.max(0, kick - dt * 2.6);
  if(kick > 0){
    _cPos.x += (Math.random() - 0.5) * kick * 1.6;
    _cPos.y += (Math.random() - 0.5) * kick * 1.6;
  }
  cam.position.copy(_cPos);
  _cUp.set(-Math.sin(TUBO.camA), Math.cos(TUBO.camA), 0);
  cam.up.copy(_cUp);
  cam.lookAt(_cLook);
  cam.updateMatrixWorld();

  const want = K.fovBase + K.fovSpeed * k * k;
  cam.fov += (want - cam.fov) * Math.min(1, 4 * dt);
  cam.updateProjectionMatrix();

  /* las dos luces van SOBRE EL EJE (x=y=0), no en la cámara: ver buildScene */
  if(TUBO.key)  TUBO.key.position.set(0, 0, -(TUBO.camS + K.camMira * 0.35));
  if(TUBO.key2) TUBO.key2.position.set(0, 0, -(TUBO.camS + PAL.keyAdel * 4.5));
  if(TUBO.fill){
    TUBO.fill.position.copy(cam.position);
    TUBO.fill.target.position.copy(r.gfx.position);
    TUBO.fill.target.updateMatrixWorld();
  }
  /* el espacio de fuera va PEGADO a la cámara o se ve el borde del mundo */
  if(TUBO.espacio) TUBO.espacio.position.set(0, 0, cam.position.z);
}

/* =====================================================================
   PRESENTACIÓN — la del juego (voz, #banner, #count321, #stageCaution),
   con el mismo procedimiento y las mismas trampas que ►DESCINTRO
   ===================================================================== */
const INTRO = { dur:6.5, mudo:6.5, espera:12.0, titulo:2.2, popMs:3400 };
const INTRO_TXT = { titulo:'EL TUBO DE LAS ESTRELLAS',
                    frase:'Corre por dentro del tubo, salta todo y no te caigas jamás.', ico:'🌈' };

let _bannerT = null;
function tuboBanner(txt, segs){
  const b = document.getElementById('banner'); if(!b) return;
  if(_bannerT) clearTimeout(_bannerT);
  b.textContent = txt; b.classList.add('show');
  _bannerT = setTimeout(() => { b.classList.remove('show'); _bannerT = null; }, segs * 1000);
}
let _popT = null;
function tuboPopup(){
  const el = document.getElementById('stageCaution'); if(!el) return;
  const ico = el.querySelector('.cauIco'), tx = el.querySelector('.cauTxt');
  if(ico) ico.textContent = INTRO_TXT.ico;
  if(tx) tx.innerHTML = 'MINIJUEGO<br><span style="font-size:.56em;letter-spacing:1px;text-transform:none;font-style:italic">' +
                        INTRO_TXT.frase + '</span>';
  el.classList.add('show');
  if(_popT) clearTimeout(_popT);
  _popT = setTimeout(tuboPopupOff, INTRO.popMs);
}
function tuboPopupOff(){
  const el = document.getElementById('stageCaution'); if(el) el.classList.remove('show');
  if(_popT){ clearTimeout(_popT); _popT = null; }
}
function introGo(){
  TUBO._introGo = true; TUBO.introT = 0;
  const v = GAME_VOZ();
  INTRO.dur = (v && isFinite(v.duration) && v.duration > 3) ? v.duration : INTRO.mudo;
  tuboBanner(INTRO_TXT.titulo, INTRO.titulo);
  tuboPopup();
  if(v){ try { v.onended = null; v.pause(); v.currentTime = 0;
    const p = v.play(); if(p && p.catch) p.catch(() => {}); } catch(e){} }
}
/* si el navegador rechaza el autoplay, la presentación se acorta. Se mira el
   AUDIO a los 0,6 s, no la promesa de play() (resuelve aunque el clip no
   avance, y encima llega en otro tick). */
function introVozCheck(){
  if(TUBO._vozVista || TUBO.introT < 0.6) return;
  TUBO._vozVista = true;
  const v = GAME_VOZ();
  if(!v || v.paused || v.currentTime < 0.05) INTRO.dur = Math.min(INTRO.dur, INTRO.mudo);
}
function introCue(){
  const queda = INTRO.dur - TUBO.introT;
  const n = queda <= 0 ? 0 : queda <= 0.8 ? 1 : queda <= 1.7 ? 2 : queda <= 2.6 ? 3 : -1;
  if(n === TUBO._introN) return;
  TUBO._introN = n;
  const sc = GAME_SHOWCOUNT(); if(!sc) return;
  if(n === 3) sc('3', '#ffd84f');
  else if(n === 2) sc('2', '#ff9100');
  else if(n === 1) sc('1', '#ff3b3b');
}
function raceGo(){
  TUBO.phase = 'race';
  tuboPopupOff();
  tuboBanner('¡YA!', 1.0);
  try { sndBip(880, 0.20, 0.5); } catch(e){}
  if(TUBO.hud && TUBO.hud.root) TUBO.hud.root.classList.remove('cine');
}
/* travelling de 3 planos con CORTE SECO, todos DENTRO del tubo (fuera no hay
   nada que ver: la pared es opaca). El tercero se funde con la cámara de juego
   ya convergida, así que al arrancar no hay corte. */
function introCam(dt){
  const me = TUBO.racers[0]; if(!me) return;
  const u = clamp(TUBO.introT / Math.max(0.1, INTRO.dur), 0, 1);
  let w = 1;
  if(u < 0.34){
    /* 1 · barrido alrededor de la parrilla, a la altura de la cintura */
    const t = smooth(u / 0.34);
    punto(norm(me.a + lerp(-1.5, 1.5, t)), me.s - 9, 7, _cPos);
    punto(me.a, me.s + 3, 1.6, _cLook);
  } else if(u < 0.68){
    /* 2 · desde DELANTE, mirando atrás: los cuatro recortados contra la fuga
       del tubo, que es la imagen que vende el minijuego */
    const t = smooth((u - 0.34) / 0.34);
    punto(norm(me.a + 0.5), me.s + lerp(46, 22, t), lerp(12, 6, t), _cPos);
    punto(me.a, me.s, 1.7, _cLook);
  } else {
    const t = smooth((u - 0.68) / 0.32);
    punto(me.a, me.s - lerp(40, K.camDist, t), lerp(17, K.camAlto, t), _cPos);
    punto(me.a, me.s + K.camMira * t, 1.8, _cLook);
    w = 1 - smooth(clamp((t - 0.62) / 0.38, 0, 1));
  }
  if(w <= 0.001) return;
  TUBO.cam.position.lerp(_cPos, w);
  _cUp.set(-Math.sin(me.a), Math.cos(me.a), 0);
  TUBO.cam.up.copy(_cUp);
  TUBO.cam.lookAt(_cLook);
  TUBO.cam.updateMatrixWorld();
  if(TUBO.espacio) TUBO.espacio.position.set(0, 0, TUBO.cam.position.z);
}

/* =====================================================================
   FINAL — mismos tres tiempos que el descenso (cruzas → ruedas → tabla)
   ===================================================================== */
/* Umbrales de ESTE minijuego, MEDIDOS (32 corredores en 8 pistas, todos con la
   IA al mando): 1.792 el peor, 2.232 la mediana, 2.648 el mejor. O sea que una
   carrera competente cae en A+, y la S+ hay que ganársela. */
const NOTAS = [[2600,'S+'],[2350,'S'],[2150,'A+'],[1950,'A'],[1750,'A-'],
               [1550,'B+'],[1350,'B'],[1150,'B-'],[950,'C+'],[750,'C'],[550,'C-'],[350,'D+'],[180,'D']];
function notaDe(pts){
  for(const t of NOTAS) if(pts >= t[0]) return { label:t[1], color:notaColor(t[1]) };
  return { label:'D-', color:'#ff8d8d' };
}
function notaColor(label){
  try { if(typeof gradeColorOf === 'function') return gradeColorOf(label); } catch(e){}
  return label[0] === 'S' ? '#ffd84f' : label[0] === 'A' ? '#7affc8'
       : label[0] === 'B' ? '#6fa8ff' : label[0] === 'C' ? '#c299ff' : '#ff8d8d';
}
function hexDe(r){ return '#' + r.col.toString(16).padStart(6, '0'); }

let _confEl = null;
function confeti(){
  if(_confEl){ _confEl.style.display = ''; return; }
  const d = document.createElement('div');
  d.className = 'confetti'; d.id = 'tuboConf';
  d.style.cssText = 'z-index:118;pointer-events:none';
  const n = 46;
  for(let i = 0; i < n; i++){
    const e = document.createElement('i');
    const hue = Math.round((i / n) * 360 + Math.random() * 22);
    const dur = 6 + Math.random() * 6, size = 7 + Math.random() * 10;
    e.style.left = (Math.random() * 100).toFixed(2) + '%';
    e.style.width = e.style.height = size.toFixed(1) + 'px';
    e.style.color = 'hsl(' + hue + ',92%,66%)';
    e.style.setProperty('--dur', dur.toFixed(2) + 's');
    e.style.setProperty('--delay', (-Math.random() * dur).toFixed(2) + 's');
    e.style.setProperty('--drift', (((Math.random() * 2 - 1) * 46) | 0) + 'px');
    e.style.setProperty('--tw', (1 + Math.random() * 1.6).toFixed(2) + 's');
    const m = i % 3; if(m === 0) e.className = 'dot'; else if(m === 1) e.className = 'star';
    d.appendChild(e);
  }
  document.body.appendChild(d);
  _confEl = d;
}
function metaCruzada(r){
  if(!r.human) return;
  confeti();
  tuboBanner(r.place === 1 ? '¡PRIMERO!' : r.place + 'º', 2.0);
  try { sndDing(5); } catch(e){}
}

let _finEl = null;
function tuboFin(){
  if(TUBO._finShown) return;
  TUBO._finShown = true;
  confeti();
  if(TUBO.hud && TUBO.hud.root) TUBO.hud.root.classList.add('cine');
  const orden = TUBO.finishOrder.slice();
  for(const r of TUBO.racers) if(!orden.includes(r)) orden.push(r);
  const me = TUBO.racers[0];
  const mio = notaDe(me.pts);

  if(!_finEl){
    _finEl = document.createElement('div');
    _finEl.className = 'overlay'; _finEl.id = 'tuboFin';
    _finEl.style.cssText = 'z-index:122;pointer-events:auto';
    document.body.appendChild(_finEl);
  }
  /* ►Gana el que MÁS PUNTOS hace (Toni), no el que llega antes: la tabla se
     ordena por puntos y el puesto de llegada va en su propia columna, que es
     donde se ve que llegar primero te ha dado 400. */
  const porPts = TUBO.racers.slice().sort((a, b) => (b.pts - a.pts) || (a.place || 9) - (b.place || 9));
  let tab = '<table class="lb"><tr><th class="nm">#</th><th class="nm">Corredor</th>' +
            '<th class="pts">Puntos</th><th>Nota</th><th>Llegada</th><th>Tiempo</th>' +
            '<th>Estrellas</th><th>Caídas</th><th>Golpes</th></tr>';
  porPts.forEach((r, i) => {
    const g = notaDe(r.pts);
    tab += '<tr class="' + (r.human && r.i === 0 ? 'me ' : '') + (i === 0 ? 'top' : '') + '">' +
      '<td>' + (i === 0 ? '👑' : (i + 1)) + '</td>' +
      '<td class="nm"><span class="dot" style="color:' + hexDe(r) + '"></span>' + r.name + '</td>' +
      '<td class="pts">' + r.pts + '</td>' +
      '<td class="gr" style="color:' + g.color + '">' + g.label + '</td>' +
      '<td>' + (r.place || '—') + 'º</td>' +
      '<td>' + (r.time ? r.time.toFixed(1) : '—') + 's</td>' +
      '<td>' + r.estrellas + '</td><td>' + r.caidas + '</td><td>' + r.golpes + '</td></tr>';
  });
  tab += '</table>';

  const puesto = porPts.indexOf(me) + 1;
  _finEl.innerHTML =
    '<h2 style="margin-bottom:6px">FIN DEL TUBO</h2>' +
    '<div style="font-size:19px;font-weight:900;font-style:italic;letter-spacing:2px;margin-bottom:2px;color:' + hexDe(me) + '">' +
      puesto + 'º · ' + me.name + '</div>' +
    '<div style="font-size:15px;opacity:.85;margin-bottom:10px">' + me.pts + ' puntos · nota ' +
      '<b style="color:' + mio.color + ';font-style:italic">' + mio.label + '</b></div>' +
    '<div class="endPanel" style="opacity:1">' + tab + '</div>' +
    '<button class="btn" id="tbR">OTRA VEZ <span style="opacity:.55;font-size:13px;font-weight:700">(R)</span></button>' +
    '<button class="btn" id="tbT" style="margin-top:8px">OTRO TUBO <span style="opacity:.55;font-size:13px;font-weight:700">(T)</span></button>';
  _finEl.style.display = 'flex';
  const bR = _finEl.querySelector('#tbR'), bT = _finEl.querySelector('#tbT');
  if(bR) bR.onclick = () => start(TUBO.seed);
  if(bT) bT.onclick = () => start((Math.random() * 1e9) | 0);
}
function tuboFinOff(){
  TUBO._finShown = false; TUBO._finT = 0;
  if(_finEl) _finEl.style.display = 'none';
  if(_confEl) _confEl.style.display = 'none';
}

/* =====================================================================
   HUD — las clases del juego (.rkRow/.hbtn/.hDisc/.hKey/.hPad), con ids
   propios porque pollMoveSheet() esconde los del juego cuando no corre
   ===================================================================== */
function buildHud(){
  const d = document.createElement('div');
  d.id = 'tuboHud';
  d.style.cssText = 'position:fixed;inset:0;z-index:120;pointer-events:none;' +
    'font:13px/1.45 ui-monospace,Consolas,monospace;color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.75)';
  d.innerHTML =
    '<div id="tBlur" style="position:absolute;inset:0;opacity:0;backdrop-filter:blur(0px);' +
      '-webkit-backdrop-filter:blur(0px);will-change:backdrop-filter;' +
      'mask-image:radial-gradient(ellipse 62% 62% at 50% 54%,rgba(0,0,0,0) 40%,#000 100%);' +
      '-webkit-mask-image:radial-gradient(ellipse 62% 62% at 50% 54%,rgba(0,0,0,0) 40%,#000 100%)"></div>' +
    '<div id="tVig" style="position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 42%,rgba(0,0,0,.55) 100%)"></div>' +
    '<div id="tTop" style="position:absolute;top:14px;left:50%;transform:translateX(-50%);text-align:center;font-size:15px;font-weight:700"></div>' +
    '<div id="tLeft" style="position:absolute;top:14px;left:16px;background:rgba(6,10,20,.5);padding:9px 13px;border-radius:9px"></div>' +
    '<div id="tRight" style="position:absolute;top:14px;right:16px;background:rgba(6,10,20,.5);padding:9px 13px;border-radius:9px;text-align:right"></div>' +
    '<div id="tFlash" style="position:absolute;top:30%;left:50%;transform:translate(-50%,-50%);font-size:38px;font-weight:900;opacity:0"></div>' +
    '<div id="tAviso" style="position:absolute;top:21%;left:50%;transform:translate(-50%,-50%);font-size:46px;font-weight:900;opacity:0;color:#ff5a3d;letter-spacing:1px"></div>' +
    '<div id="tBar" style="position:absolute;left:50%;bottom:104px;transform:translateX(-50%);width:min(620px,72vw);height:9px;background:rgba(0,0,0,.42);border-radius:6px;overflow:hidden">' +
      '<div id="tFill" style="height:100%;width:0;background:linear-gradient(90deg,#ff5a5a,#ffd84f,#5ae07a,#4fc8ff,#c05aff);border-radius:6px"></div></div>' +
    '<div id="tRank"></div><div id="tAtk"></div>' +
    '<div id="tHelp" style="position:absolute;left:50%;bottom:8px;transform:translateX(-50%);opacity:.45;font-size:10px;white-space:nowrap">' +
      'R reiniciar · T otro tubo</div>';
  document.body.appendChild(d);

  const st = document.createElement('style');
  st.textContent =
    '#tRank{position:absolute;left:16px;top:50%;width:186px;transform:translateY(-50%) scale(var(--hudScale,1));' +
      'transform-origin:left center;pointer-events:none;font-family:"Segoe UI",system-ui,sans-serif;text-shadow:none}' +
    '#tAtk{position:absolute;left:50%;bottom:26px;transform:translateX(-50%) scale(var(--hudScale,1));' +
      'transform-origin:bottom center;display:flex;align-items:flex-start;justify-content:center;gap:9px;' +
      'pointer-events:none;font-family:"Segoe UI",system-ui,sans-serif;text-shadow:none;max-width:96vw;flex-wrap:wrap}' +
    '#tuboHud #tTop,#tuboHud #tLeft,#tuboHud #tRight,#tuboHud #tBar,#tuboHud #tRank,' +
      '#tuboHud #tAtk,#tuboHud #tHelp{transition:opacity .4s ease}' +
    '#tuboHud.cine #tTop,#tuboHud.cine #tLeft,#tuboHud.cine #tRight,#tuboHud.cine #tBar,' +
      '#tuboHud.cine #tRank,#tuboHud.cine #tAtk,#tuboHud.cine #tHelp,#tuboHud.cine #tAviso{opacity:0 !important}';
  document.head.appendChild(st);

  /* ►los nodos de presentación del juego viven dentro de #hud, y boot() oculta
     #hud cada 250 ms durante 30 s: si no se traen aquí, la presentación corre
     ENTERA sin verse. Es la trampa que cazó el descenso. */
  for(const id of ['count321', 'banner', 'stageCaution']){
    const el = document.getElementById(id);
    if(el && el.parentNode !== d) d.appendChild(el);
  }
  TUBO.hud = { root:d, top:d.querySelector('#tTop'), left:d.querySelector('#tLeft'),
    right:d.querySelector('#tRight'), fill:d.querySelector('#tFill'),
    vig:d.querySelector('#tVig'), blur:d.querySelector('#tBlur'),
    flash:d.querySelector('#tFlash'), aviso:d.querySelector('#tAviso'),
    rank:d.querySelector('#tRank'), atk:d.querySelector('#tAtk') };
  buildAtkBar();
}
const CTRL = [
  { key:'A / D', pad:'⇆', name:'Alrededor', col:'#7affc8' },
  { key:'ESP',   pad:'A', name:'Saltar',    col:'#3ad06a' },
];
function buildAtkBar(){
  const el = TUBO.hud && TUBO.hud.atk; if(!el) return;
  el.innerHTML = CTRL.map(c =>
    '<div class="hbtn util" style="--pc:' + c.col + '">' +
      '<div class="hDisc"><i class="hFill"></i><span class="hLab"></span>' +
        '<div class="hInner"><div class="hPad' + (/^[ABXY]$/.test(c.pad) ? ' round' : '') + '">' + c.pad + '</div>' +
        '<span class="hKey">' + c.key + '</span></div></div>' +
      '<span class="hName">' + c.name + '</span></div>').join('');
}
let _flashT = 0;
function flash(txt, col){
  const h = TUBO.hud; if(!h) return;
  h.flash.textContent = txt; h.flash.style.color = col || '#ffe14d';
  _flashT = 1.1;
}
function updateRank(){
  const h = TUBO.hud; if(!h || !h.rank) return;
  const rs = TUBO.racers; if(!rs || !rs.length) return;
  if(!h._rk || h._rk.length !== rs.length){
    h.rank.innerHTML = '';
    h._rk = rs.map(r => {
      const row = document.createElement('div');
      row.className = 'rkRow' + (r.human && r.i === 0 ? ' me' : '');
      row.style.setProperty('--pc', '#' + r.col.toString(16).padStart(6, '0'));
      row.innerHTML = '<span class="rkPos"></span><i class="rkDot"></i>' +
                      '<span class="rkName">' + r.name + '</span><span class="rkXP"></span>';
      h.rank.appendChild(row);
      return { row, pos:row.querySelector('.rkPos'), pts:row.querySelector('.rkXP'), last:-1 };
    });
    h.rank.style.height = (rs.length * 31) + 'px';
  }
  const orden = rs.slice().sort((a, b) => (b.pts - a.pts) || (b.s - a.s));
  for(let p = 0; p < orden.length; p++){
    const r = orden[p], w = h._rk[r.i];
    w.row.style.transform = 'translateY(' + (p * 31) + 'px)';
    w.pos.textContent = (p + 1);
    w.row.classList.toggle('lead', p === 0);
    if(w.last !== r.pts){
      w.pts.textContent = r.pts;
      if(w.last >= 0){ w.pts.classList.remove('bump'); void w.pts.offsetWidth; w.pts.classList.add('bump'); }
      w.last = r.pts;
    }
  }
}
function updateHud(dt){
  const h = TUBO.hud; if(!h) return;
  const me = TUBO.racers[0]; if(!me) return;
  const k = clamp((velTubo(TUBO.t) - K.vel0) / Math.max(1, K.vel1 - K.vel0), 0, 1);
  const orden = TUBO.racers.slice().sort((a, b) => b.s - a.s);
  const place = orden.indexOf(me) + 1;

  h.vig.style.opacity = (k * 0.6).toFixed(2);
  if(h.blur){
    const kb = Math.max(0, (k - K.blurDesde) / (1 - K.blurDesde));
    const px = (K.blurMax * kb * kb).toFixed(2);
    if(h._blurPx !== px){
      h._blurPx = px;
      h.blur.style.backdropFilter = 'blur(' + px + 'px)';
      h.blur.style.webkitBackdropFilter = 'blur(' + px + 'px)';
      h.blur.style.opacity = kb > 0.01 ? 1 : 0;
      const r0 = (K.blurCentro * 100 * (1 - 0.35 * kb)).toFixed(0);
      const mk = 'radial-gradient(ellipse 62% 62% at 50% 54%,rgba(0,0,0,0) ' + r0 + '%,#000 100%)';
      h.blur.style.maskImage = mk; h.blur.style.webkitMaskImage = mk;
    }
  }

  h.left.innerHTML =
    '<div style="font-size:26px;font-weight:900;line-height:1">' + place + 'º</div>' +
    '<div style="font-size:18px;font-weight:800;color:' + (k > 0.75 ? '#ff8a3d' : '#fff') + '">' +
      Math.round(velTubo(TUBO.t) * 1.6) + ' km/h</div>' +
    '<div style="opacity:.75">el tubo acelera</div>' +
    (me.fuera > 0 ? '<div style="color:#8ad8ff;font-weight:800">volviendo…</div>' : '');
  h.right.innerHTML =
    '<div style="font-size:20px;font-weight:800">' + me.pts + ' pts</div>' +
    '<div style="opacity:.8">' + me.estrellas + ' ★ · ' + me.caidas + ' caídas</div>' +
    '<div style="opacity:.8">' + TUBO.t.toFixed(1) + ' s</div>';
  h.top.innerHTML = orden.map(r => '<span style="color:#' + r.col.toString(16).padStart(6,'0') +
    ';margin:0 7px' + (r.fuera > 0 ? ';opacity:.35' : '') + '">' + r.name + '</span>').join('');

  /* ►AVISO: un agujero en tu carril no se ve venir con la fuga del tubo */
  let dAg = 1e9;
  const iMe = iSec(me.a);
  for(let s = me.s + 3; s < me.s + 120; s += K.segZ){
    if(TUBO.pista.agujeros.has(jCel(s) * K.NSEC + iMe)){ dAg = s - me.s; break; }
  }
  if(dAg < 70 && me.fuera <= 0 && !me.air){
    h.aviso.textContent = dAg < 34 ? '¡SALTA!' : 'AGUJERO';
    h.aviso.style.color = dAg < 34 ? '#ff3d2e' : '#ffb03d';
    h.aviso.style.opacity = dAg < 34 ? 1 : 0.72;
  } else h.aviso.style.opacity = 0;

  if(_flashT > 0){ _flashT -= dt; h.flash.style.opacity = Math.min(1, _flashT * 1.6).toFixed(2); }
  else h.flash.style.opacity = 0;

  h.fill.style.width = Math.min(100, (me.s / K.largo) * 100) + '%';
  updateRank();
}

/* =====================================================================
   SONIDO — sintetizado, mismo patrón que el descenso (ni un asset nuevo)
   ===================================================================== */
const SND = { ctx:null, on:false };
function sndInit(){
  if(SND.ctx || !K.vol) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return;
    const ctx = new AC();
    const master = ctx.createGain(); master.gain.value = K.vol; master.connect(ctx.destination);
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for(let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const lazo = (tipo, f0, q) => {
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const fil = ctx.createBiquadFilter(); fil.type = tipo; fil.frequency.value = f0; fil.Q.value = q;
      const g = ctx.createGain(); g.gain.value = 0;
      src.connect(fil); fil.connect(g); g.connect(master); src.start();
      return { fil, g };
    };
    SND.wind = lazo('lowpass', 220, 0.6);
    SND.silb = lazo('bandpass', 1700, 0.9);
    SND.ctx = ctx; SND.master = master; SND.buf = buf; SND.on = true;
  } catch(e){}
}
function sndRafaga(freq, dur, vol){
  if(!SND.on) return;
  const c = SND.ctx, t = c.currentTime;
  const src = c.createBufferSource(); src.buffer = SND.buf;
  const fil = c.createBiquadFilter(); fil.type = 'lowpass'; fil.frequency.value = freq;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(fil); fil.connect(g); g.connect(SND.master);
  src.start(t); src.stop(t + dur + 0.02);
}
function sndThump(v){
  if(!SND.on) return;
  const c = SND.ctx, t = c.currentTime;
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(110, t);
  o.frequency.exponentialRampToValueAtTime(38, t + 0.16);
  g.gain.setValueAtTime(0.6 * v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  o.connect(g); g.connect(SND.master); o.start(t); o.stop(t + 0.22);
}
function sndDing(combo){
  if(!SND.on) return;
  const c = SND.ctx, t = c.currentTime;
  const base = 700 * Math.pow(1.17, Math.min(combo || 0, 6));
  [[base, 0], [base * 1.5, 0.06]].forEach(par => {
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = par[0];
    g.gain.setValueAtTime(0.22, t + par[1]);
    g.gain.exponentialRampToValueAtTime(0.001, t + par[1] + 0.26);
    o.connect(g); g.connect(SND.master); o.start(t + par[1]); o.stop(t + par[1] + 0.28);
  });
}
function sndSwoosh(){ sndRafaga(1400, 0.22, 0.26); }
function sndBoom(){
  sndRafaga(180, 0.5, 0.7);
  if(!SND.on) return;
  const c = SND.ctx, t = c.currentTime;
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(140, t);
  o.frequency.exponentialRampToValueAtTime(28, t + 0.42);
  g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
  o.connect(g); g.connect(SND.master); o.start(t); o.stop(t + 0.48);
}
function sndCaida(){
  if(!SND.on) return;
  const c = SND.ctx, t = c.currentTime;
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'triangle'; o.frequency.setValueAtTime(700, t);
  o.frequency.exponentialRampToValueAtTime(90, t + 0.85);
  g.gain.setValueAtTime(0.30, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
  o.connect(g); g.connect(SND.master); o.start(t); o.stop(t + 0.95);
}
function sndBip(f, dur, vol){
  if(!SND.on) return;
  const c = SND.ctx, t = c.currentTime;
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'square'; o.frequency.value = f;
  g.gain.setValueAtTime(vol || 0.16, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + (dur || 0.12));
  o.connect(g); g.connect(SND.master); o.start(t); o.stop(t + (dur || 0.12) + 0.02);
}
function updateAudio(dt){
  if(!SND.on) return;
  const k = clamp((velTubo(TUBO.t) - K.vel0) / Math.max(1, K.vel1 - K.vel0), 0, 1);
  const st = (x, v, tc) => x.setTargetAtTime(v, SND.ctx.currentTime, tc || 0.10);
  st(SND.wind.fil.frequency, 220 + 900 * k);
  st(SND.wind.g.gain, TUBO.phase === 'race' ? 0.08 + 0.42 * Math.pow(k, 1.5) : 0.03);
  st(SND.silb.g.gain, Math.max(0, k - 0.5) * 0.7);
  const S = TUBO._snd || (TUBO._snd = { cuenta:9, fase:'' });
  if(TUBO.phase === 'intro' && TUBO._introGo){
    const n = Math.ceil(INTRO.dur - TUBO.introT);
    if(n !== S.cuenta && n > 0 && n <= 3){ sndBip(560, 0.11); S.cuenta = n; }
  }
  if(TUBO.phase === 'finish' && S.fase === 'race'){ sndDing(0); sndDing(3); }
  S.fase = TUBO.phase;
}

/* =====================================================================
   ARRANQUE Y BUCLE
   ===================================================================== */
function start(seed){
  if(TUBO.scene){
    /* ►NO DISPONER LO COMPARTIDO: los clones de SkeletonUtils comparten
       geometría y texturas con `_charTpls`; disponerlas al reiniciar se lleva
       por delante también a los personajes del JUEGO. */
    TUBO.scene.traverse(o => {
      if(o.userData && o.userData._compartido) return;
      if(o.geometry) o.geometry.dispose();
      if(o.material){ const mm = Array.isArray(o.material) ? o.material : [o.material];
        mm.forEach(x => { if(x.map) x.map.dispose(); x.dispose(); }); }
    });
  }
  TUBO.seed = seed;
  TUBO.rng = mulberry32(seed);
  TUBO.pista = genPista(TUBO.rng);
  buildScene();
  TUBO.racers = [];
  for(let i = 0; i < 4; i++) TUBO.racers.push(makeRacer(i, i < HUMANS));
  TUBO.t = 0; TUBO.phase = 'intro';
  TUBO.introT = 0; TUBO._introGo = false; TUBO._introN = -1; TUBO._vozVista = false;
  TUBO._espera = 0; TUBO._acc = 0; TUBO._kick = 0; TUBO._finT = 0;
  TUBO.finishOrder = []; TUBO.camS = 0; TUBO.camA = TUBO.racers[0].a; _camInit = false;
  tuboPopupOff(); tuboFinOff();
  if(TUBO.hud && TUBO.hud.root) TUBO.hud.root.classList.add('cine');
  console.log('[tubo] semilla=' + seed + ' · ' + K.largo + ' u · R=' + K.R +
              ' · ' + TUBO.pista.estrellas.length + '★ · ' + TUBO.pista.vallas.length + ' vallas · ' +
              TUBO.pista.bombas.length + ' bombas · ' + TUBO.pista.agujeros.size + ' celdas de vacío');
}
TUBO._start = start;
TUBO.rebuild = () => start(TUBO.seed);

TUBO.tick = function(dt){
  if(!TUBO.scene) return;
  dt = Math.min(0.05, dt);

  if(TUBO.phase === 'intro'){
    /* la presentación ESPERA a que los cuatro GLB estén montados (12 MB, async):
       si no, el travelling pasa por delante de cuatro cápsulas grises */
    const listos = TUBO.racers.length && TUBO.racers.every(r => r.montado);
    TUBO._espera += dt;
    if(!TUBO._introGo && (listos || TUBO._espera > INTRO.espera)) introGo();
    if(TUBO._introGo){
      TUBO.introT += dt;
      introVozCheck();
      introCue();
      if(TUBO.introT >= INTRO.dur) raceGo();
    }
  } else if(TUBO.phase === 'race' || TUBO.phase === 'finish'){
    for(const r of TUBO.racers){
      r._inp = (r.done || r.fuera > 0) ? { ax:0, jump:false }
             : r.human ? readTubo(r) : aiInput(r, dt);
    }
    /* el líder se calcula UNA vez por frame: lo usan el rebufo de los cuatro */
    let lider = TUBO.racers[0];
    for(const r of TUBO.racers) if(r.s > lider.s) lider = r;
    TUBO.lider = lider;

    /* PASO FIJO: a 70 u/s un paso variable se salta vallas de 1,6 u de grosor */
    TUBO._acc += dt;
    let guard = 0;
    while(TUBO._acc >= K.fixed && guard++ < 10){
      TUBO._acc -= K.fixed;
      TUBO.t += K.fixed;
      for(const r of TUBO.racers) stepRacer(r, K.fixed);
    }
    if(guard >= 10) TUBO._acc = 0;

    if(TUBO.racers.every(r => r.done)) TUBO.phase = 'finish';
    /* al rezagado no se le espera eternamente */
    if(TUBO.finishOrder.length && TUBO.t - TUBO.finishOrder[0].time > 12){
      for(const r of TUBO.racers) if(!r.done){
        r.done = true; r.time = TUBO.t;
        TUBO.finishOrder.push(r); r.place = TUBO.finishOrder.length;
        r.pts += K.ptsPos[Math.min(K.ptsPos.length - 1, r.place - 1)];
      }
      TUBO.phase = 'finish';
    }
    if(TUBO.phase === 'finish'){
      TUBO._finT += dt;
      /* backstop: quien cruza CAÍDO no llega nunca a marcarse `parado` */
      if(TUBO.racers.every(r => r.parado) || TUBO._finT > 6) tuboFin();
    }
  }

  /* personajes: los GLB llegan async → se intenta montar cada frame */
  for(const r of TUBO.racers){
    if(!r.montado) montaPersonaje(r);
    else if(r._recolorPend){
      r._recolorPend = false;
      try {
        if(typeof recolorAtlas === 'function' && r.model) r.model.traverse(o => {
          if(!o.isMesh && !o.isSkinnedMesh) return;
          (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
            if(m && m.map){ const t = recolorAtlas(m.map, r.clase);
              if(t){ m.map = t; if(m.color) m.color.setRGB(1,1,1); m.needsUpdate = true; }
              else r._recolorPend = true; }
          });
        });
      } catch(e){}
    }
    animEstado(r);
    if(r.mixer) r.mixer.update(dt);
    pintaRacer(r, dt);
  }

  stepCamera(dt);
  if(TUBO.phase === 'intro') introCam(dt);
  updateEstrellas(dt);
  updateBombas(dt);
  updateStreaks(dt);
  updatePop(dt);
  updateAudio(dt);
  updateHud(dt);
};

TUBO.render = function(){
  if(!TUBO.scene) return;
  const rr = GAME_RENDERER(); if(!rr) return;
  if(TUBO._shadowOn !== K.sombras){
    rr.shadowMap.enabled = !!K.sombras;
    TUBO._shadowOn = !!K.sombras;
  }
  /* ►EXPOSICIÓN PROPIA: `renderer.toneMappingExposure` se queda con el valor del
     último stage que se haya aplicado (el 10 lo pone en 0,62). Si no se fija
     aquí, el mismo tubo sale con dos exposiciones distintas según por dónde
     hayas entrado. */
  if(rr.toneMappingExposure !== K.exposicion) rr.toneMappingExposure = K.exposicion;
  rr.setRenderTarget(null);
  rr.render(TUBO.scene, TUBO.cam);
};

addEventListener('keydown', e => {
  if(!TUBO.on) return;
  sndInit(); if(SND.ctx && SND.ctx.state === 'suspended') SND.ctx.resume();
  if(e.code === 'KeyR'){ start(TUBO.seed); e.preventDefault(); }
  if(e.code === 'KeyT'){ start((Math.random() * 1e9) | 0); e.preventDefault(); }
});
addEventListener('mousedown', () => { if(TUBO.on){ sndInit(); if(SND.ctx && SND.ctx.state === 'suspended') SND.ctx.resume(); } });
addEventListener('resize', () => {
  if(TUBO.cam){ TUBO.cam.aspect = innerWidth / innerHeight; TUBO.cam.updateProjectionMatrix(); }
});

function boot(){
  if(TUBO._built) return;
  let cal = (_qs.get('calidad') || '').toLowerCase();
  if(!cal){
    try {
      const q = (typeof QUALITY !== 'undefined') ? QUALITY
              : (typeof _qualityTier !== 'undefined') ? _qualityTier : '';
      cal = String(q || '').toLowerCase();
    } catch(e){}
  }
  if(/pelad|min|none/.test(cal)){ K.streakN = 0; K.densDeco = 0; }
  else if(/baj|low/.test(cal)){ K.streakN = 70; K.densDeco = 0.5; }
  if(typeof THREE === 'undefined' || !GAME_RENDERER()) return;
  TUBO._built = true;
  buildHud();
  start(parseInt(_qs.get('semilla') || '', 10) || ((Math.random() * 1e9) | 0));
  TUBO.on = true;
  /* el juego esconde su propio HUD/overlays durante los primeros 30 s: aquí
     hay que insistir igual que hace el descenso */
  let n = 0;
  const t = setInterval(() => {
    for(const id of ['startOverlay', 'hud', 'shopOverlay', 'scoreOverlay']){
      const el = document.getElementById(id); if(el) el.style.display = 'none';
    }
    if(++n > 120) clearInterval(t);
  }, 250);
}
const _bootT = setInterval(() => { boot(); if(TUBO._built) clearInterval(_bootT); }, 60);
boot();

})();
