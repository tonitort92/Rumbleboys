/* =====================================================================
   ►DESCENSO — carrera de transición entre stages  ·  v5 (ARCADE)

   VEREDICTO DE TONI SOBRE LA v4: "las físicas son muy duras, no da placer
   bajar como un juego pro de PlayStation". Tenía razón, y lo que hacía falta
   NO era tocar números: era cambiar la INTENCIÓN. La v4 simulaba, y simular
   castiga. Un SSX/Steep premia. Ver el bloque ►ARCADE en K.

   LOS DOS FALLOS DE FONDO QUE HABÍA DEBAJO (los dos, de modelo, no de ajuste):

   1. EL VOLANTE ERA UN INTEGRADOR. Mantener el stick SUMABA ángulo, así que
      sostener una línea obligaba a contra-girar sin parar: te peleabas con el
      volante, no con la montaña. Ahora el stick PIDE UN ÁNGULO y al soltar
      vuelve solo. Medido antes del cambio: tallar tardaba 245 s contra 38 s
      yendo recto.
   2. EL CANTO MATABA LA VELOCIDAD LATERAL EN VEZ DE GIRARLA. Eso borra
      energía: tallar costaba el 47% de la velocidad. Un canto real ejerce una
      fuerza centrípeta, que NO hace trabajo — gira el vector, no lo encoge.
      Ahora se rota el vector conservando el módulo y lo único que se paga al
      tallar es lo honesto: apuntando de lado, la gravedad empuja menos.
      Medido después: se conserva el 92% de la velocidad (objetivo del
      género: ≥75%).

   LA MÉTRICA CORRECTA, que también estaba mal: "¿tallar llega antes?" es la
   pregunta equivocada — en un SSX la línea recta TAMBIÉN es la más rápida. Lo
   que define el placer es cuánta VELOCIDAD CONSERVAS al tallar.

   =====================================================================
   ►DESCENSO  ·  v4 (la base: pista, zonas y física de tabla)

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
  dragC:      0.0043,  // rozamiento aerodinámico (∝ v²). Calibrado para que la
                       // velocidad de equilibrio salga 45/56/63/68/58 u/s por
                       // zona (verde/azul/roja/negra/fuera): ver la cabecera.
  dragAir:    0.85,    // el MISMO rozamiento vale en el aire. Sin esto la
                       // bajada limpia se iba a 196 u/s: medido — volando el
                       // 60% del tiempo, el rozamiento solo actuaba el 40%.
  dragSoft:   2.0,     // multiplicador en el material MÁS suelto
  dragHard:   0.60,    // ...y en el más prensado
  muBase:     1.1,     // rozamiento seco del material (u/s², escala con la normal)
  grip:       130,     // TOPE de agarre lateral (u/s² con N=1). Pasado esto, DERRAPAS.
                       // ARCADE: el doble que en la v4. Un juego de tabla de
                       // consola te deja tallar fuerte y solo te suelta si te
                       // pasas MUCHO; el agarre honesto se sentía "duro".
  gripSoft:   0.72,    // el agarre que queda en material suelto
  gripLowV:   10,      // por debajo de esta velocidad el canto NO agarra: parado
                       // y cruzado se derrapa ladera abajo, como en la realidad
  gripLowMin: 0.22,
  fallTurn:   0.75,    // rad/s con que el morro cae hacia la máxima pendiente a
                       // poca velocidad. Sin esto, cruzarse a 0 km/h es un
                       // callejón sin salida: medido, la IA se plantó 200 s.
                       // Solo por debajo de fallTurnV: por encima mandas tú.
  fallTurnV:  18,
  /* ►ARCADE — EL CAMBIO DE INTENCIÓN
     Toni, sobre la v4: "las físicas son muy duras, no da placer bajar como un
     juego pro de PlayStation". Tenía razón y el problema NO eran los números,
     era la intención: la v4 simulaba y por tanto CASTIGABA. Un SSX/Steep
     premia. Cuatro reglas invertidas, en orden de importancia:

     1. TALLAR ACELERA. Es LA regla del género: la curva es la recompensa, no
        el peaje. La fuerza de canto se convierte en empuje hacia delante
        (bombear), con un techo para que no sea barra libre.
     2. EL DERRAPE SE RECUPERA SOLO. Si te sueltas, el board vuelve a alinearse
        con la velocidad en 0,25 s: se ve espectacular y no te arruina.
     3. ATERRIZAR REGALA VELOCIDAD si caes alineado con la pendiente; solo te
        tumba el planchazo de verdad.
     4. HAY SUELO DE VELOCIDAD por zona: nunca te quedas muerto en la nieve. */
  carveBoost: 0.115,   // u/s² de empuje por unidad de fuerza de canto ←(1)
  carveCap:   135,     // techo de velocidad alcanzable BOMBEANDO (el turbo lo pasa)
  skidRecov:  0.25,    // s en que el board vuelve solo a la velocidad ←(2)
  skidDrag:   0.22,    // lo que raspa el derrape (era 0,65: castigaba demasiado)
  landBoost:  0.30,    // fracción del impacto que se DEVUELVE como velocidad ←(3)
  landAlign:  0.55,    // cuánto se endereza el board al tocar (perdona el ángulo)
  floorFrac:  0.52,    // suelo de velocidad = esta fracción del equilibrio ←(4)
  floorPush:  16,      // con cuánta fuerza se empuja hacia ese suelo

  /* ►VOLANTE POR OBJETIVO, no por integración. EL cambio de tacto.
     Hasta aquí el stick SUMABA ángulo: mantener a la derecha te cruzaba la
     ladera entera y había que contra-girar sin parar para sostener una línea.
     Eso es lo que se sentía "duro" — estabas peleándote con el volante, no
     con la montaña. Medido: tallando se tardaba 245 s contra 38 s yendo recto.
     Ahora el stick PIDE UN ÁNGULO: a fondo = K.steerMax respecto de la línea
     de máxima pendiente, y al soltar vuelve solo. Apuntas y se queda. */
  steerMax:   58 * RAD,// ángulo que pide el stick a fondo
  steerBack:  0.55,    // rad/s con que vuelve a la línea al soltar. Toni: "la
                       // vuelta es brusca, tiende a la línea recta él solo".
                       // Con 2,0 se enderezaba en medio segundo y parecía que
                       // el juego te quitaba el volante de las manos.
  turnLow:    5.0,     // rad/s con que PERSIGUE ese ángulo, a poca velocidad
  turnHigh:   3.0,     // ...y a tope
  airTurn:    3.4,     // en el aire se gira MUCHO: deja encarar la caída y sale
                       // gratis en diversión
  turboThrust:22,
  dashMax:    2.4,
  dashRegen:  0.34,
  nMax:       3.0,     // tope de la fuerza normal (compresiones)

  /* --- SALTO / AIRE / ATERRIZAJE --- */
  ollieMin:   14,      // impulso del ollie sin cargar. ARCADE: el toque seco ya
                       // salta bien; cargar es para el truco largo, no un peaje
  ollieMax:   23,      // ...y con la carga llena
  ollieChg:   0.40,    // segundos de carga
  olliePop:   9,       // pop extra si sales por un labio con la carga puesta
  landHard:   52,      // componente NORMAL de impacto que te tumba (era 34)
  landSlip:   105 * RAD,// desalineación board/velocidad que te tumba al caer
  airMin:     1.2,     // vy mínima para dar por bueno un despegue por relieve
  airThr:     2.6,     // margen sobre la gravedad para despegar de verdad. Es la
                       // "suspensión": las piernas absorben lo que no llega.
                       // Con 1,35 y la velocidad alta se volaba el 63% de la
                       // bajada: eso es una cama elástica, no un descenso.

  /* --- HUNDIMIENTO Y RASTRO --- */
  sinkMax:    0.55,
  trailEvery: 1.9,
  trailLife:  7.0,
  trailN:     760,

  /* --- CHOQUES Y CAÍDAS --- */
  /* Toni: "cuando te caes o chocas debes arrastrar algo de la velocidad que
     llevabas". Hasta aquí caerse te dejaba CLAVADO (velocidad a 0), y eso es
     lo que más rompe el ritmo: pierdes el error Y el impulso. */
  crashMul:   0.74,
  fallMul:    0.46,    // lo que CONSERVAS al caerte: sigues deslizando
  fallDrag:   0.72,    // ...y a qué ritmo se te va mientras estás por el suelo
  crashTime:  0.55,
  crashChain: 3,
  crashWindow:3.0,
  /* La caída dura lo que tardan los clips reales (wipeout 2,40 s + getup
     2,37 s). Se ACELERAN con timeScale para caber en su ventana, igual que se
     hizo con el clip 'climb' de la partida: 4,8 s tirado en el suelo en una
     carrera de 100 s sería insufrible. */
  fallTime:   2.7,
  wipeFrac:   0.56,    // qué parte de la ventana es el batacazo; el resto, levantarse

  /* --- ►GRINDING sobre raíles ---
     Se engancha SOLO con caer encima (no hay botón). Una vez arriba, el raíl
     te lleva y tú peleas el equilibrio con el mismo stick que gira: se va
     torciendo solo y hay que corregir. Si se te va, te caes. */
  grindSnapX: 2.6,     // margen lateral para engancharse
  grindSnapY: 2.2,     // ...y vertical (hay que venir de arriba)
  grindMinV:  14,      // por debajo de esto no engancha
  grindDrift: 1.5,     // a qué ritmo se te tuerce el equilibrio solo
  grindFix:   2.3,     // cuánto lo corriges con el stick a fondo
  grindFric:  0.999,   // el raíl casi no frena: es la recompensa. OJO, es POR
                       // 1/60 s: 0,985 parecía inofensivo y dejaba el 40% de la
                       // velocidad al cabo de UN segundo — el grind se cortaba
                       // solo a los 2 s por el corte de velocidad mínima.
  grindPts:   26,      // puntos por segundo aguantando
  grindOut:   11,      // impulso vertical al salir del raíl

  /* --- ataque / agarre --- */
  atkSpeed:   30, atkTime:0.55, atkCd:4.2, atkPush:30, atkPts:45,
  grabRange:  7.0, grabTime:0.5, grabSlow:0.55, grabCd:1.2, grabPts:60, counterPts:120,

  ptsPos:     [300, 200, 120, 60],
  comboMul:   [1, 1.5, 2, 2.5],

  /* --- cámara --- */
  tilt:       0,       // inclinación FALSA. 0: ya hay pendiente real. Para el surf.
  /* ►CÁMARA AL HOMBRO (petición de Toni: "mucho más cámara al hombro, un poco
     picada, y que con el ratón puedas rotar un poco y alejarte/acercarte").
     Antes iba a 34 unidades y casi cenital: los personajes salían del tamaño
     de una hormiga y la pendiente no se leía. Ahora va pegada y por encima del
     hombro, con el jinete descentrado — que es lo que da sensación de tercera
     persona en vez de vista de dron. */
  camHombro:  2.3,     // desplazamiento lateral (el jinete queda descentrado)
  camAlto:    1.7,     // altura sobre el jinete
  camPitch:   11,      // picado SOBRE la pendiente local (era 16 y muy alto)
  camSlopeK:  0.62,    // cuánto de la pendiente local hereda el picado. A
                       // cámara corta heredar casi toda la clava en el suelo y
                       // el cielo desaparece del encuadre.
  camSlopeBase:30,     // sobre cuántas unidades se mide esa pendiente. Con 3 (la
                       // que usa la IA) un lomo la disparaba y en el fuera pista
                       // la cámara se iba a cenital.
  camPitchMin:10 * RAD,
  camPitchMax:36 * RAD,
  camDist:    15.5,    // ← al hombro. La rueda del ratón mueve esto.
  camDistMin: 7,
  camDistMax: 26,
  camDistFast:-2.2,    // se acerca un poco más a tope de velocidad
  camLookAhead: 5.5,   // a cámara corta hay que mirar MENOS lejos o el jinete
                       // se va al borde inferior del encuadre (medido: con 9
                       // salía cortado por abajo)
  camLookY:   3.4,
  camLookMix: 0.5,     // el punto de mira se queda a media altura entre yo y el
                       // suelo de allí; apuntar al suelo de una pared de 42°
                       // manda la cámara a mirarse los pies
  camLag:     8.0,
  fovBase:    56,
  fovSpeed:   28,
  shakeSpeed: 0.55,
  leash:      70,
  orbSpeed:   2.3,     // rad/s del stick derecho / Q / E
  orbMouse:   0.0042,  // rad por píxel de ratón
  orbLibre:   true,    // el ratón rota SIN tener que arrastrar (como un shooter)
  orbYawMax:  75 * RAD,// cuánto se puede girar la vista a cada lado
  zoomPaso:   2.2,     // unidades por muesca de rueda
  orbPitchMin:-24 * RAD,
  orbPitchMax: 48 * RAD,
  /* ►GOLPE DE CÁMARA. La mitad de la sensación de un juego de tabla está en
     que la cámara ACUSA el aterrizaje: se hunde de golpe y rebota. Sin esto,
     caer de una rampa grande y de un bordillo se ven exactamente igual. */
  kickLand:   0.16,    // hundimiento por unidad de impacto normal
  kickMax:    3.4,     // tope del hundimiento
  kickCrash:  2.6,     // el que mete un choque
  kickSpring: 150,     // rigidez del muelle que la devuelve
  kickDamp:   13,      // amortiguación (por debajo del crítico = rebota una vez)
  kickFov:    5.5,     // tirón de FOV al aterrizar fuerte

  orbHold:    1.2,     // s parado antes de volver sola detrás
  orbBack:    2.4,     // velocidad de recentrado
  camMinH:    2.2,     // la cámara nunca baja de esto sobre el suelo (ni ella
                       // ni NINGÚN punto entre ella y el jugador)

  /* --- efecto de velocidad --- */
  streakN:    150,    // Con 340 se leían como arañazos blancos sobre el cielo
  streakFrom: 0.45,   // liso; y arrancaban demasiado pronto.

  /* --- IA --- */
  aiBand: 0.14, aiMaxGap: 170, aiLook: 55, aiSkill: [0.93, 0.87, 0.81],

  /* --- ►PERSONAJES (tunables en vivo con DESC.K) --- */
  charScale:  1.55,    // multiplicador sobre CHAR_TARGET_H: la escala del juego
                       // es para una arena, aquí la cámara está más lejos
  charYaw:    Math.PI, // los chars del juego miran a +Z y aquí se avanza a -Z
  tablaEsc:   0.56,    // la tabla mide 4,53 u de fábrica y el jinete 2,4: a
                       // escala 1 la tabla salía del DOBLE de largo que el
                       // personaje. Una tabla real mide como su dueño.
  tablaYaw:   0,
  animFade:   0.18,
  wipeMin:    0.9,     // lo que dura como poco la caída antes de levantarse

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

/* =====================================================================
   EL RECORRIDO — cambiar esta lista es cambiar la montaña entera

   Cada tramo dice su ZONA (que fija pendiente, material y color), su LARGO,
   su SEMIANCHURA al empezar, y opcionalmente una PIEZA:

     hueco:N .... PRECIPICIO de N unidades. Corta la montaña de lado a lado y
                  hay que SALTARLO. Con N pequeño (14-20) basta un ollie seco;
                  con N grande (45-70) hace falta llegar lanzado y usar el
                  kicker que se planta solo delante.
     parte:{...}. BIFURCACIÓN: un espolón de roca parte el corredor en dos
                  rutas que se vuelven a juntar. Sirve para despegarse del
                  grupo (o para perderlos de vista y reencontrarlos).
     tunel ...... TÚNEL DE NIEVE sobre un corredor estrecho.
     rail:{...}.. RAÍL para hacer grinding: se salta encima y se aguanta el
                  equilibrio con el stick.

   Largo total ≈ 6.200 u ⇒ unos DOS MINUTOS a la velocidad media medida.
   ===================================================================== */
const PLAN = [
  { z:'verde', len:260, hw:70  },
  { z:'azul',  len:240, hw:88,  rail:{ x:0,   largo:110 } },
  { z:'azul',  len:200, hw:120 },
  { z:'roja',  len:280, hw:150, hueco:16 },                    // salto corto: ollie
  { z:'roja',  len:240, hw:60,  tunel:true },                  // estrechamiento + túnel
  { z:'negra', len:300, hw:110, parte:{ largo:230, alto:26 } }, // dos rutas
  { z:'negra', len:260, hw:150, hueco:44 },                    // GRAN precipicio
  { z:'verde', len:220, hw:170 },                              // respiro
  { z:'fuera', len:340, hw:200 },
  { z:'fuera', len:260, hw:130, rail:{ x:-22, largo:120 } },
  { z:'roja',  len:280, hw:70  },                              // pasillo de giro
  { z:'roja',  len:260, hw:150, hueco:18 },
  { z:'negra', len:320, hw:120, parte:{ largo:250, alto:30 } },
  { z:'negra', len:280, hw:170, hueco:54 },                    // el más grande
  { z:'azul',  len:240, hw:74,  tunel:true },
  { z:'azul',  len:260, hw:90,  rail:{ x:16, largo:130 } },
  { z:'roja',  len:300, hw:150 },
  { z:'roja',  len:260, hw:80  },                              // último pasillo
  { z:'negra', len:300, hw:140, hueco:20 },
  { z:'verde', len:280, hw:190 },
  { z:'verde', len:220, hw:210 },
];

const BANDS = [], HUECOS = [], PARTES = [], TUNELES = [], RAILES = [];
{
  let z = 0;
  for(const t of PLAN){
    const b = { tipo:t.z, z0:z, z1:z - t.len, hw:t.hw };
    BANDS.push(b);

    /* el hueco va centrado en el tramo, con sitio antes para coger carrerilla */
    if(t.hueco){
      const zc = z - t.len * 0.62;
      HUECOS.push({ z0: zc + t.hueco/2, z1: zc - t.hueco/2, largo: t.hueco,
                    grande: t.hueco >= 34 });
    }
    if(t.parte) PARTES.push({ z0: z - (t.len - t.parte.largo)/2,
                              z1: z - (t.len + t.parte.largo)/2, alto: t.parte.alto });
    if(t.tunel) TUNELES.push({ z0: z - t.len*0.25, z1: z - t.len*0.75 });
    if(t.rail)  RAILES.push({ x: t.rail.x, z0: z - t.len*0.3,
                              z1: z - t.len*0.3 - t.rail.largo, alto: 3.2 });
    z -= t.len;
  }
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

/* --- SEMIANCHURA: perfil por tramos, no un abanico que solo se abre ---
   Toni pidió "zonas más estrechas que otras y pasillos de giro". La anchura
   la manda ahora el PLAN: se interpola entre la de cada tramo y la del
   siguiente, así que un embudo de 150 a 60 se lee como un estrechamiento. */
function hwAt(z){
  const i = bandIdx(z), b = BANDS[i];
  const nx = BANDS[i + 1];
  const t = clamp((b.z0 - z) / Math.max(1, b.z0 - b.z1), 0, 1);
  return lerp(b.hw, nx ? nx.hw : b.hw, smooth(t));
}

/* --- PRECIPICIOS ---
   Dentro de un hueco NO HAY SUELO. Se sale por el aire o se cae al vacío (y
   del vacío se vuelve, que esto es una transición y no puede acabarte la run). */
function huecoAt(z){
  for(let i = 0; i < HUECOS.length; i++){
    const h = HUECOS[i];
    if(z < h.z0 && z > h.z1) return h;
  }
  return null;
}
/* borde de salida más cercano por detrás (para reponer al que se cae) */
function bordeDe(h){ return h.z0 + 5; }

/* --- BIFURCACIONES: un espolón en el centro que parte el corredor --- */
function parteAt(x, z){
  for(let i = 0; i < PARTES.length; i++){
    const p = PARTES[i];
    if(z > p.z0 || z < p.z1) continue;
    /* se levanta y se hunde suavemente por los extremos: si apareciera de
       golpe sería un muro invisible en mitad de la bajada */
    const L = p.z0 - p.z1, d = Math.min(p.z0 - z, z - p.z1);
    const fz = smooth(clamp(d / (L * 0.16), 0, 1));
    const w = 26;
    const fx = Math.max(0, 1 - (x * x) / (w * w));
    return p.alto * fz * fx * fx;
  }
  return 0;
}

/* --- RAÍLES --- */
function railAt(z){
  for(let i = 0; i < RAILES.length; i++){
    const r = RAILES[i];
    if(z < r.z0 && z > r.z1) return r;
  }
  return null;
}

/* PIELES. `soft`/`hard` son los dos colores entre los que se interpola el
   terreno según la dureza; encima se mezcla el color de la ZONA. */
/* PIELES.
   `zmix` = cuánto del color de la ZONA se mezclaba en el suelo. Va a CERO:
   Toni, viendo la pista verde: "la arena la pones de colorinchis en lugar de
   arena normal". Tenía razón — la arena es arena y la nieve es nieve. La
   dificultad de la zona se lee por las BANDERAS del cambio de tramo y por el
   HUD, no pintando el desierto de verde. El relieve del terreno lo da ahora el
   sombreado por dureza y por pendiente, no un tinte plano. */
const SKINS = {
  arena: { sky:0xf3d6a4, sky2:0xbfd8ea, fog:0xe8c187,
           soft:0xf0d3a0, hard:0xb07f42, wall:0xb8834f, wall2:0x8a6039,
           rock:0x8a6f4d, ramp:0xa8672c, part:0xdcc094, trail:0xb08a55,
           valley:0xd8ae72, ridge:0xc09a68, sun:0xfff0d0, hemi:0xffe4bc, zmix:0.0 },
  nieve: { sky:0xe8f4ff, sky2:0x9dc4e8, fog:0xd6e7f4,
           soft:0xffffff, hard:0x9fbdd8, wall:0x93a9bb, wall2:0x6f8496,
           rock:0x6d7f8e, ramp:0x7fa8cc, part:0xffffff, trail:0x9fb8cc,
           valley:0xc6dced, ridge:0xa4bcd2, sun:0xffffff, hemi:0xdcecff, zmix:0.0 },
  mar:   { sky:0xa8e8f5, sky2:0x4fb0d8, fog:0x76cde2,
           soft:0x4fc4e0, hard:0x14647f, wall:0x4a6b78, wall2:0x37525d,
           rock:0x40606d, ramp:0xcdf6ff, part:0xeafcff, trail:0x8fe0f0,
           valley:0x2f9fc4, ridge:0x4a8fa8, sun:0xfffbe8, hemi:0xbfeef8, zmix:0.0 },
};
const PAL = SKINS[SKIN] || SKINS.arena;
if(SKIN === 'mar') K.tilt = 7;

const RACER_COL = [0x35c9ff, 0xff5a52, 0x7bf06a, 0xffd23f];

/* =====================================================================
   ►PERSONAJES REALES — los 6 GLB del juego, no cápsulas

   Se reutiliza TODO lo que ya existe: las plantillas `_charTpls` que carga el
   juego, el RECOLOR DE MARCA (`recolorAtlas`) y el aclarado del caballero.
   Aquí no se inventa ni un cargador ni un tinte propios.

   Los tres clips (board / wipeout / getup) se inyectaron por NOMBRE DE HUESO
   en `chars_models.js` con el pipeline de siempre (Blender → GLB → merge de
   canales de ROTACIÓN). 41 huesos casados en las 6 clases, 0 sin casar.
   ===================================================================== */
const CLASES = ['samurai', 'voxelhero', 'archer', 'knight', 'nun', 'link'];
/* color del DECK de la tabla por clase (el mismo criterio que CLASS_COLOR) */
const CLASE_COL = { voxelhero:0xff3b30, samurai:0x9b2bff, archer:0xffd84f,
                    link:0x3ad06a, knight:0xe8edf5, nun:0x2563eb };

const CHAR = { tpls:null, tabla:null, pedido:false };

/* La tabla es un GLB propio (snowboard_model.js). Se parsea UNA vez y se
   clona por corredor tintando solo el deck. */
function pideTabla(){
  if(CHAR.tabla || CHAR.pedido || !window.SNOWBOARD_GLB_B64 || !THREE.GLTFLoader) return;
  CHAR.pedido = true;
  const bin = atob(window.SNOWBOARD_GLB_B64);
  const u = new Uint8Array(bin.length);
  for(let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  new THREE.GLTFLoader().parse(u.buffer, '', g => {
    CHAR.tabla = g.scene;
    console.log('[descenso] tabla de snowboard lista');
  }, e => console.warn('[descenso] la tabla no cargó', e));
}

function tplDe(k){
  const t = (typeof _charTpls !== 'undefined') ? _charTpls : null;
  return (t && t[k]) ? t[k] : null;
}

/* Clona la tabla y le pone el color de la clase en el DECK (Material.001);
   la base y las fijaciones (Material.002) se quedan oscuras. */
function tablaDe(clase){
  if(!CHAR.tabla) return null;
  const g = CHAR.tabla.clone(true);
  /* la tabla también clona compartiendo geometría con su plantilla */
  g.traverse(o => { o.userData = o.userData || {}; o.userData._compartido = true; });
  const col = CLASE_COL[clase] || 0xdddddd;
  g.traverse(o => {
    if(!o.isMesh) return;
    o.castShadow = false; o.frustumCulled = false;
    const ms = Array.isArray(o.material) ? o.material : [o.material];
    o.material = ms.map(m => {
      if(!m) return m;
      const c = m.clone();
      /* Se tiñen LOS DOS materiales: el que va arriba con el color de la clase
         y el otro con una versión oscura. Distinguirlos por luminancia falló
         (el que yo daba por "deck" resultó ser el canto: la tabla salía negra
         por arriba con el filo de color). */
      const lum = c.color ? (c.color.r + c.color.g + c.color.b) / 3 : 1;
      if(c.color){
        c.color.setHex(col);
        if(lum > 0.12) c.color.multiplyScalar(0.30);     // el claro pasa a ser el canto oscuro
      }
      if('metalness' in c) c.metalness = 0.0;
      if('roughness' in c) c.roughness = 0.55;
      if(c.emissive){ c.emissive.setHex(col); c.emissiveIntensity = 0.12; }
      c.needsUpdate = true;
      return c;
    });
    if(o.material.length === 1) o.material = o.material[0];
  });
  return g;
}

/* =====================================================================
   ►ROCAS: una FAMILIA, no el mismo dodecaedro mil veces

   Toni: "siempre usas el mismo asset mierdoso como piedras". Era literal —
   `DodecahedronGeometry(1,0)` para el borde, para los peñascos del fondo y
   para los obstáculos. Ahora hay cinco siluetas distintas, todas talladas
   deformando los vértices de un poliedro con una semilla propia, y cada
   instancia coge una al azar. Se generan UNA vez y se comparten.
   ===================================================================== */
function tallaRoca(base, semilla, rugosidad, achatado){
  const g = base.clone();
  const rng = mulberry32(semilla);
  const pos = g.attributes.position;
  const v = new THREE.Vector3();
  /* los vértices de estos poliedros vienen SIN indexar y repetidos por cara;
     se deforman por POSICIÓN redondeada para que las caras sigan casando y no
     se abra la malla en costuras */
  const cache = new Map();
  for(let i = 0; i < pos.count; i++){
    v.fromBufferAttribute(pos, i);
    const k = v.x.toFixed(3) + '|' + v.y.toFixed(3) + '|' + v.z.toFixed(3);
    let d = cache.get(k);
    if(d === undefined){ d = 1 + (mulberry32(semilla ^ (i * 2654435761))() - 0.5) * rugosidad; cache.set(k, d); }
    v.multiplyScalar(d);
    v.y *= achatado;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}
let _ROCAS = null;
function geoRocas(){
  if(_ROCAS) return _ROCAS;
  const ico = new THREE.IcosahedronGeometry(1, 0);
  const dod = new THREE.DodecahedronGeometry(1, 0);
  const oct = new THREE.OctahedronGeometry(1, 1);
  _ROCAS = [
    tallaRoca(dod, 0x51a1, 0.55, 0.86),   // canto rodado
    tallaRoca(ico, 0x7b33, 0.75, 0.62),   // laja tumbada
    tallaRoca(oct, 0x2c19, 0.50, 1.15),   // punta
    tallaRoca(ico, 0x9f07, 0.95, 0.95),   // peñasco irregular
    tallaRoca(dod, 0x3e55, 0.35, 0.48),   // losa plana
  ];
  return _ROCAS;
}

/* props REALES del juego para decorar los lados (nada inventado): plantas del
   desierto para la piel de arena, pinos y árboles muertos para la de nieve */
const DECOR = {
  arena: ['s3_agave', 's3_aloe', 's3_cactusbarrel'],
  nieve: ['s6_pine', 's6_deadtrees', 's6_bush'],
  mar:   ['s3_agave', 's6_bush'],
};
function propDelJuego(key){
  try {
    if(typeof _parseRaw !== 'function' || !window.GAME_MODELS || !window.GAME_MODELS[key]) return null;
    if(typeof MODEL_CACHE !== 'undefined'){
      if(!MODEL_CACHE[key]) MODEL_CACHE[key] = _parseRaw(key);
      return MODEL_CACHE[key] ? MODEL_CACHE[key].clone(true) : null;
    }
    const o = _parseRaw(key);
    return o ? o.clone(true) : null;
  } catch(e){ return null; }
}

function GAME_RENDERER(){ return (typeof renderer !== 'undefined') ? renderer : null; }
function GAME_KEYS(){ return (typeof keys !== 'undefined') ? keys : null; }

const DESC = window.DESC = {
  on:false, K, TRICKS, ZONA, BANDS, HUECOS, PARTES, TUNELES, RAILES,
  scene:null, cam:null, world:null, backdrop:null,
  seed:0, rng:null, noise:null, noiseH:null,
  racers:[], obst:[], buckets:null, picks:null,
  t:0, phase:'countdown', count:3.2,
  finishOrder:[], hud:null, _built:false, _why:{},
  orb:{ yaw:0, pitch:0, idle:9, mx:0, my:0, down:false, wheel:0 },
  kick:{ y:0, v:0 },
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
  return baseY(z) + cuenco + big + sml + parteAt(x, z);
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

  /* KICKERS DE LOS PRECIPICIOS GRANDES: una rampa ancha justo antes del labio.
     Va PRIMERO y a mano — si la dejara al azar, el hueco de 62 u sería
     injusto la mitad de las partidas. */
  for(const h of HUECOS){
    if(!h.grande) continue;
    obst.push({ type:'ramp', size:'l', x:0, z:h.z0 + 16, w:34, len:26, h:7.4, kicker:true });
  }

  let z = -120;
  let sinceRamp = 0;
  while(z > -(K.len - 70)){
    /* ni rocas ni rampas DENTRO de un hueco (no hay suelo donde apoyarlas), ni
       en los 26 u previos: ahí se necesita pista limpia para coger carrerilla */
    if(huecoAt(z) || huecoAt(z - 26) || huecoAt(z + 12)){ z -= 26; continue; }
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
      const rx2 = (rng()*2-1)*hw, rz2 = z + (rng()-0.5)*26;
      if(parteAt(rx2, rz2) > 1.5) continue;      // no sembrar sobre el espolón
      obst.push({ type:'rock', x:rx2, z:rz2, r: 2.2 + rng()*1.6 + zn.rock * 1.1 });
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
/* SIN SUELO: lo que devuelve groundYAt dentro de un precipicio. No es
   -Infinity porque eso envenena de NaN cualquier resta; es un número muy bajo
   pero finito, y `enVacio()` es quien decide que te has caído. */
const VACIO = -100000;
function groundYAt(x, z){
  if(huecoAt(z)) return VACIO;
  const t = terrainY(x, z);
  const o = rampAt(x, z);
  return o ? Math.max(t, rampSurfaceY(o, z)) : t;
}
function enVacio(y, z){ return y < baseY(z) - 55; }
DESC._gy = groundYAt;

/* HUELLA DE LA TABLA: un board mide 4,6 unidades y no cabe en un punto.
   Promediar tres puntos a lo largo de su eje es lo que impide que el rizado
   fino (13 u de longitud de onda) te esté lanzando por los aires a 60 u/s:
   la tabla PUENTEA los baches pequeños, exactamente como en la realidad.
   Sin esto, la detección de despegue por curvatura es una traca. */
function padY(x, z, fx, fz){
  const a = groundYAt(x - fx*2.3, z - fz*2.3);
  const b = groundYAt(x, z);
  const c = groundYAt(x + fx*2.3, z + fz*2.3);
  /* si CUALQUIER punto de la tabla está sobre el vacío, no hay apoyo: promediar
     -100000 con dos alturas normales daría un suelo fantasma a mitad del abismo */
  if(a <= VACIO || b <= VACIO || c <= VACIO) return VACIO;
  return 0.25*a + 0.50*b + 0.25*c;
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
  if(a <= VACIO || b <= VACIO) return zoneProp(z, 'deg') * RAD;   // sobre un hueco
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
  sc.add(new THREE.HemisphereLight(PAL.hemi, 0x40404e, 0.62));
  const sun = new THREE.DirectionalLight(PAL.sun, 0.85);
  sun.position.set(-50, 90, 30);
  sc.add(sun);
  /* relleno DESDE LA CÁMARA: sin él, los personajes (MeshStandard) se ven de
     frente en sombra mientras el terreno (Lambert) ya está bien expuesto */
  const fill = new THREE.DirectionalLight(PAL.sun, 0.42);
  fill.position.set(30, 40, 80);
  sc.add(fill);

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

    /* ►CIELO CON ALGO DENTRO. Toni: "nada en el cielo". Era una esfera con un
       degradado y punto: sin sol, sin nubes y sin ninguna referencia, así que
       la mitad superior de la pantalla era una pared de color. Todo esto va
       en el grupo del telón (se mueve con la cámara) y sin fog. */
    const cielo = new THREE.Group();
    cielo.renderOrder = -1;

    /* SOL: disco + dos halos concéntricos que se funden */
    const dirSol = new THREE.Vector3(-0.45, 0.42, -0.79).normalize();
    for(const [r2, op] of [[95, 1.0], [210, 0.26], [430, 0.11]]){
      const disco = new THREE.Mesh(new THREE.CircleGeometry(r2, 26),
        new THREE.MeshBasicMaterial({ color: PAL.sun, transparent:true, opacity:op,
                                      depthWrite:false, fog:false, side:THREE.DoubleSide }));
      disco.position.copy(dirSol).multiplyScalar(2150);
      disco.lookAt(0, 0, 0);
      cielo.add(disco);
    }

    /* NUBES: cúmulos de esferas achatadas en dos bandas de altura. Se generan
       con la semilla, así que el cielo es el mismo para todos los clientes. */
    const rngC = mulberry32(DESC.seed ^ 0xc10d);
    /* SIN ILUMINAR (MeshBasic). Con Lambert se ven desde ABAJO, o sea siempre
       por su cara en sombra: salían gris plomo en un cielo de desierto. Una
       nube estilizada es una mancha clara, no un objeto sombreado. */
    const matNube = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent:true,
                                                  opacity:0.95, fog:false });
    const geoNube = new THREE.SphereGeometry(1, 8, 6);
    const nubes = 42, porNube = 6;
    const imN = new THREE.InstancedMesh(geoNube, matNube, nubes * porNube);
    let ni = 0;
    const mm = new THREE.Matrix4(), qq = new THREE.Quaternion(),
          pp = new THREE.Vector3(), ss = new THREE.Vector3(), cc = new THREE.Color();
    for(let k = 0; k < nubes; k++){
      const ang = rngC() * TAU;
      const rad = 850 + rngC() * 1100;
      const alt = 240 + rngC() * 620;
      const cx = Math.cos(ang) * rad, cz = Math.sin(ang) * rad;
      const esc = 55 + rngC() * 75;
      for(let b = 0; b < porNube; b++){
        pp.set(cx + (rngC()-0.5)*esc*2.6, alt + (rngC()-0.5)*esc*0.5, cz + (rngC()-0.5)*esc*1.6);
        qq.identity();
        const rr = esc * (0.5 + rngC()*0.6);
        ss.set(rr, rr * (0.42 + rngC()*0.2), rr);
        mm.compose(pp, qq, ss);
        imN.setMatrixAt(ni, mm);
        /* las de abajo, un punto más grises: da profundidad al banco de nubes */
        const g2 = 0.90 + 0.10 * clamp((alt - 240) / 620, 0, 1);
        cc.setRGB(g2, g2 * 0.985, g2 * 0.96);
        imN.setColorAt(ni, cc);
        ni++;
      }
    }
    imN.instanceMatrix.needsUpdate = true;
    if(imN.instanceColor) imN.instanceColor.needsUpdate = true;
    cielo.add(imN);

    sc.add(cielo);
    DESC.cielo = cielo;
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
    /* la resolución se ata al LARGO, no a un número fijo: con la pista de 2
       minutos, 380 filas dejaban 17 u por fila y los lomos se veían facetados */
    const zTop = 160, zBot = -(K.len + 240);
    const COLS = 58, ROWS = Math.min(1000, Math.round((zTop - zBot) / 8.5));
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
        c.copy(cSoft).lerp(cHard, h);
        if(PAL.zmix > 0) c.lerp(cz, PAL.zmix);
        /* ►RELIEVE. Sin tinte de zona el suelo sería una plancha lisa (Toni:
           "todo super plano, sin casi efectos de luz"). El volumen se pinta en
           el vértice, que es gratis:
             · PENDIENTE LOCAL: las caras que miran al sol se aclaran y las
               contrapendientes se oscurecen. Es lo que dibuja los lomos.
             · CAVIDAD: los valles se hunden en sombra y las lomas se realzan,
               comparando la altura con la media de alrededor. Oclusión pobre
               pero legible, y a coste cero en tiempo de ejecución. */
        const e2 = 6;
        const hx = terrainY(x + e2, z) - terrainY(x - e2, z);
        const hz = terrainY(x, z + e2) - terrainY(x, z - e2);
        const pend = clamp((hz / (2*e2)) * 0.9 + (hx / (2*e2)) * 0.55, -0.5, 0.5);
        const media = 0.25 * (terrainY(x+14, z) + terrainY(x-14, z) +
                              terrainY(x, z+14) + terrainY(x, z-14));
        const cav = clamp((y - media) * 0.10, -0.30, 0.22);
        const fuera = Math.abs(u) > 1 / OUT ? 0.62 : 1;      // fuera del límite: apagado
        const shade = (0.88 + 0.12 * h + pend * 0.42 + cav) * fuera;
        col[vi*3] = c.r * shade; col[vi*3+1] = c.g * shade; col[vi*3+2] = c.b * shade;
        vi++;
      }
    }
    /* NO SE EMITEN LOS QUADS QUE CAEN DENTRO DE UN PRECIPICIO: ese es el
       agujero. Se cuenta cuántos se saltan para poder afirmar que el hueco
       existe de verdad y no solo en la física. */
    let ii = 0, saltados = 0;
    for(let ri = 0; ri < ROWS; ri++) for(let ci = 0; ci < COLS; ci++){
      /* OJO AL DEVANADO: con las filas yendo hacia -z y las columnas hacia +x,
         el orden (a,d,b) da la normal MIRANDO AL SUELO → el terreno entero se
         culleaba y la escena parecía "props flotando sobre el telón de fondo".
         Se cazó con un raycast por el centro de pantalla: impactaba a 2.400 u. */
      const zq = zTop + (zBot - zTop) * ((ri + 0.5) / ROWS);
      if(huecoAt(zq)){ saltados++; continue; }
      const a = ri * (COLS + 1) + ci, b = a + 1, d = a + (COLS + 1), e = d + 1;
      idx[ii++] = a; idx[ii++] = b; idx[ii++] = d;
      idx[ii++] = b; idx[ii++] = e; idx[ii++] = d;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setIndex(new THREE.BufferAttribute(idx.subarray(0, ii), 1));
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors:true }));
    world.add(mesh);
    DESC.terrain = mesh;
    DESC._quadsHueco = saltados;
  }

  /* --- PAREDES Y FONDO DEL PRECIPICIO ---
     Sin esto el agujero se ve como una ventana al cielo y no da ningún vértigo.
     Un labio claro que marca el borde de salto, paredes verticales y un fondo
     oscuro muy abajo. */
  for(const h of HUECOS){
    const hw = hwAt((h.z0 + h.z1) / 2) * 1.16;
    const prof = 150;
    const paredMat = new THREE.MeshLambertMaterial({ color: PAL.wall2, side:THREE.DoubleSide });
    for(const zz of [h.z0, h.z1]){
      const g2 = new THREE.PlaneGeometry(hw * 2, prof);
      const pared = new THREE.Mesh(g2, paredMat);
      pared.position.set(0, terrainY(0, zz) - prof/2, zz);
      world.add(pared);
    }
    const fondo = new THREE.Mesh(new THREE.PlaneGeometry(hw*2, Math.abs(h.z0-h.z1)+8),
      new THREE.MeshBasicMaterial({ color:0x1a1620, fog:false }));
    fondo.rotation.x = -Math.PI/2;
    fondo.position.set(0, terrainY(0, h.z0) - prof, (h.z0 + h.z1)/2);
    world.add(fondo);
    /* LABIO de salida: naranja y ancho, para que se vea desde lejos */
    const labio = new THREE.Mesh(new THREE.BoxGeometry(hw*2, 1.0, 2.4),
      new THREE.MeshLambertMaterial({ color: h.grande ? 0xff4d3d : 0xff9a3d }));
    labio.position.set(0, terrainY(0, h.z0) + 0.5, h.z0 + 1);
    world.add(labio);
  }

  /* --- TÚNELES DE NIEVE ---
     DOS COSAS QUE SALIERON MAL Y ESTÁN RESUELTAS AQUÍ:
     · Encadenar rotation.z y rotation.y para tumbar un cilindro es pedir un
       error: con el orden Euler por defecto acabó tapando media pantalla en
       vez de arquearse por encima. Se alinea con setFromUnitVectors, que no
       tiene ambigüedad.
     · Un tubo RECTO sobre un terreno que baja 26° queda enterrado por un
       extremo y flotando por el otro. Tiene que seguir la pendiente: se
       orienta con el vector que une sus dos bocas.
     · El interior de un BackSide no le llega la luz direccional: sin emissive
       el túnel es una cueva negra. */
  for(const tn of TUNELES){
    const y0 = terrainY(0, tn.z0), y1 = terrainY(0, tn.z1);
    const dz = tn.z1 - tn.z0, dy = y1 - y0;
    const largo = Math.hypot(dy, dz);
    /* EL RADIO ES EL DEL PASILLO, no uno inventado: un tubo más estrecho que
       el corredor deja que vayas por fuera mientras la cámara va por dentro, y
       lo que se ve es una pared crema tapando media pantalla. Por eso los
       tramos con túnel son SIEMPRE estrechos. */
    const rad = Math.min(78, hwAt((tn.z0 + tn.z1) / 2) + 4);
    const g2 = new THREE.CylinderGeometry(rad, rad, largo, 20, 1, true);
    const tun = new THREE.Mesh(g2, new THREE.MeshLambertMaterial({
      color: PAL.soft, emissive: PAL.hemi, emissiveIntensity: 0.34,
      side: THREE.BackSide, flatShading: true }));
    tun.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, dy, dz).normalize());
    tun.position.set(0, (y0 + y1) / 2 + rad * 0.10, (tn.z0 + tn.z1) / 2);
    world.add(tun);

    /* BOCAS: un aro oscuro en cada extremo, para que se vea la entrada desde
       lejos y no parezca que la nieve se abre sola */
    for(const [zz, yy] of [[tn.z0, y0], [tn.z1, y1]]){
      const aro = new THREE.Mesh(new THREE.TorusGeometry(rad, 1.1, 6, 20),
        new THREE.MeshLambertMaterial({ color: PAL.wall2 }));
      aro.position.set(0, yy + rad * 0.10, zz);
      world.add(aro);
    }
  }

  /* --- RAÍLES --- */
  for(const R of RAILES){
    const largo = Math.abs(R.z0 - R.z1);
    const y0 = terrainY(R.x, R.z0) + R.alto, y1 = terrainY(R.x, R.z1) + R.alto;
    const barra = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, largo),
      new THREE.MeshLambertMaterial({ color:0xd8dee8 }));
    barra.position.set(R.x, (y0 + y1) / 2, (R.z0 + R.z1) / 2);
    barra.rotation.x = Math.atan2(y0 - y1, largo) * -1;
    world.add(barra);
    const nPost = Math.max(2, Math.round(largo / 12));
    for(let i = 0; i <= nPost; i++){
      const zz = R.z0 + (R.z1 - R.z0) * (i / nPost);
      const yy = terrainY(R.x, zz);
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.34, R.alto, 0.34),
        new THREE.MeshLambertMaterial({ color:0x8a94a4 }));
      post.position.set(R.x, yy + R.alto/2, zz);
      world.add(post);
    }
  }

  /* --- BORDE DEL ABANICO: rocas siguiendo la semianchura --- */
  {
    /* Una InstancedMesh POR SILUETA: cinco formas distintas repartidas a lo
       largo del borde en vez del mismo canto repetido mil veces. */
    const FORMAS = geoRocas();
    const step = 11, n1 = Math.floor((K.len + 300) / step) * 2;
    const porForma = Math.ceil(n1 / FORMAS.length) + 2;
    const ims = FORMAS.map(g2 => { const im2 = new THREE.InstancedMesh(g2,
        new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading:true }), porForma);
      im2.count = 0; return im2; });
    const base = new THREE.Color(PAL.wall);
    for(let k = 0; k < n1 / 2; k++){
      const z = 120 - k * step, hw = hwAt(z);
      for(const side of [-1, 1]){
        const f = (rng() * FORMAS.length) | 0;
        const im2 = ims[f];
        const i2 = im2.count;
        if(i2 >= porForma) continue;
        const r  = 3.4 + rng() * 4.6;
        const x  = side * (hw + r * 0.45 + rng() * 3);
        p.set(x, terrainY(x, z) + r * 0.18 + rng() * 1.4, z + (rng() - 0.5) * 8);
        q.setFromEuler(new THREE.Euler(rng()*3, rng()*3, rng()*3));
        s.set(r * (0.8 + rng()*0.5), r * (0.7 + rng() * 0.7), r * (0.8 + rng()*0.5));
        m.compose(p, q, s); im2.setMatrixAt(i2, m);
        c.copy(base).offsetHSL((rng()-0.5)*0.04, (rng()-0.5)*0.14, (rng()-0.5)*0.20);
        im2.setColorAt(i2, c);
        im2.count = i2 + 1;
      }
    }
    /* OJO r128: instanceColor NACE con el tamaño de this.count. Se crea a
       `porForma` (arriba) y solo DESPUÉS se recorta el count al usado. */
    ims.forEach(im2 => { im2.instanceMatrix.needsUpdate = true;
      if(im2.instanceColor) im2.instanceColor.needsUpdate = true; world.add(im2); });

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
    const FORMAS2 = geoRocas();
    const cupo = rocks.length + 2;
    const ims2 = FORMAS2.map(g2 => { const im2 = new THREE.InstancedMesh(g2,
        new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading:true }), cupo);
      im2.count = 0; return im2; });
    const base = new THREE.Color(PAL.rock);
    rocks.forEach(o => {
      o.baseY = terrainY(o.x, o.z);
      const im2 = ims2[(rng() * FORMAS2.length) | 0];
      const i2 = im2.count;
      p.set(o.x, o.baseY + o.r * 0.42, o.z);
      q.setFromEuler(new THREE.Euler(o.r, o.x, o.z));
      s.set(o.r * (0.85 + rng()*0.4), o.r * (0.7 + rng()*0.45), o.r * (0.85 + rng()*0.4));
      m.compose(p, q, s); im2.setMatrixAt(i2, m);
      c.copy(base).offsetHSL((rng()-0.5)*0.04, (rng()-0.5)*0.12, (rng()-0.5)*0.18);
      im2.setColorAt(i2, c);
      im2.count = i2 + 1;
    });
    ims2.forEach(im2 => { im2.instanceMatrix.needsUpdate = true;
      if(im2.instanceColor) im2.instanceColor.needsUpdate = true; world.add(im2); });
  }

  /* --- DECORADO CON PROPS DEL JUEGO (nada inventado) ---
     Agaves, aloes y barriles de cactus del stage 3 salpicando los lados de la
     pista. Se colocan FUERA del corredor útil para no estorbar. */
  {
    const claves = DECOR[SKIN] || DECOR.arena;
    const plantillas = claves.map(propDelJuego).filter(Boolean);
    if(plantillas.length){
      let puestos = 0;
      for(let z2 = -60; z2 > -(K.len - 40); z2 -= 34 + rng() * 40){
        if(huecoAt(z2)) continue;
        const hw2 = hwAt(z2);
        for(const lado of [-1, 1]){
          if(rng() > 0.55) continue;
          const tpl = plantillas[(rng() * plantillas.length) | 0];
          const o = tpl.clone(true);
          const x2 = lado * (hw2 * (0.80 + rng() * 0.28));
          const e2 = 1.6 + rng() * 1.8;
          o.scale.setScalar(e2);
          o.position.set(x2, terrainY(x2, z2), z2 + (rng() - 0.5) * 20);
          o.rotation.y = rng() * TAU;
          o.traverse(q2 => { if(q2.isMesh){ q2.castShadow = false; q2.frustumCulled = true; } });
          world.add(o); puestos++;
        }
      }
      console.log('[descenso] decorado: ' + puestos + ' props de ' + claves.join('/'));
    } else console.warn('[descenso] sin props del juego para la piel ' + SKIN);
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
    /* Toni: "el suelo desprende partículas triangulares en lugar de
       circulares". Eran tetraedros de 4 caras y a esta escala se leían como
       triángulos de papel. Ahora son granos ESFÉRICOS de 2 anillos: siguen
       siendo baratísimos (48 triángulos) y ruedan bien. */
    const im = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 6, 4),
      new THREE.MeshLambertMaterial({ color: PAL.part, transparent:true, opacity:0.82 }), N);
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
    const largo = (0.9 + 11 * k * k) * Math.min(1, rad / 26);
    const gordo = 0.7 + 1.3 * Math.min(1, rad / 30);
    _v3.set(S.x[i], S.y[i], S.z[i]).applyMatrix4(cam.matrixWorld);
    _qt.copy(cam.quaternion);
    _sc3.set(gordo, gordo, largo);
    _m4.compose(_v3, _qt, _sc3);
    S.im.setMatrixAt(i, _m4);
  }
  S.im.instanceMatrix.needsUpdate = true;
  S.im.material.opacity = 0.03 + 0.17 * k;
}

/* =====================================================================
   CORREDORES
   ===================================================================== */
/* ---------------------------------------------------------------------
   MONTAR EL PERSONAJE DE VERDAD
   Se llama en cuanto la plantilla de su clase existe (los GLB cargan async,
   así que se reintenta cada frame hasta que llega). Sustituye la cápsula.
   --------------------------------------------------------------------- */
function montaPersonaje(r){
  const tpl = tplDe(r.clase);
  if(!tpl || r.montado) return;
  const SKU = THREE.SkeletonUtils;
  const model = SKU ? SKU.clone(tpl.scene) : tpl.scene.clone(true);

  /* --- RECOLOR DE MARCA: el MISMO del juego, no uno nuevo --- */
  model.traverse(o => {
    if(!o.isMesh && !o.isSkinnedMesh) return;
    o.frustumCulled = false; o.castShadow = false;
    const clona = m => (m ? m.clone() : m);
    o.material = Array.isArray(o.material) ? o.material.map(clona) : clona(o.material);
    const ms = Array.isArray(o.material) ? o.material : [o.material];
    if(typeof BRAND_HUE !== 'undefined' && BRAND_HUE[r.clase] != null && typeof recolorAtlas === 'function'){
      ms.forEach(m => { if(m && m.map){ const t = recolorAtlas(m.map, r.clase);
        if(t){ m.map = t; if(m.color) m.color.setRGB(1,1,1); m.needsUpdate = true; }
        else r._recolorPend = true; } });      // la textura aún no decodificó: se reintenta
    }
    /* ►METALNESS A CERO. La escena del descenso NO tiene scene.environment, y
       un MeshStandardMaterial con metalness>0 y sin mapa de entorno se dibuja
       NEGRO (está documentado en este proyecto: es lo que desbloqueó ►ENVMAP).
       Los personajes SÍ se dibujaban — se veían como una silueta oscura sobre
       la nieve y parecía que faltaban. Se perdieron varias rondas buscando un
       fallo de render que no existía. */
    ms.forEach(m => { if(!m) return;
      if('metalness' in m) m.metalness = 0.0;
      if('roughness' in m) m.roughness = Math.max(0.55, m.roughness != null ? m.roughness : 0.7);
      if(m.emissive && r.clase !== 'knight'){ m.emissive.copy(m.color || new THREE.Color(0xffffff)); m.emissiveIntensity = 0.10; }
      m.needsUpdate = true; });
    if(r.clase === 'knight' && typeof KNIGHT_LIGHTEN !== 'undefined'){
      ms.forEach(m => { if(!m || !m.emissive) return;
        m.emissive.setHex(KNIGHT_LIGHTEN); m.emissiveIntensity = KNIGHT_LIGHTEN_I;
        if('metalness' in m) m.metalness = 0.0; if('roughness' in m) m.roughness = 0.65;
        m.needsUpdate = true; });
    }
  });

  /* --- escala y apoyo: mismo criterio que el juego (altura objetivo) --- */
  model.updateMatrixWorld(true);
  const caja = (typeof charModelBox === 'function') ? charModelBox(model)
                                                   : new THREE.Box3().setFromObject(model);
  const sz = new THREE.Vector3(); caja.getSize(sz);
  const alto = (typeof CHAR_TARGET_H !== 'undefined' ? CHAR_TARGET_H : 2.0) * K.charScale;
  const e = alto / (sz.y || 1);
  model.scale.setScalar(e);
  model.position.y = -caja.min.y * e;
  /* los chars del juego miran a +Z y aquí el board avanza hacia -Z */
  model.rotation.y = K.charYaw;

  /* marcar TODO el clon como compartido: su geometría y sus texturas son las
     de la plantilla del juego y no se pueden disponer (ver start()) */
  model.traverse(o => { o.userData = o.userData || {}; o.userData._compartido = true; });
  r.body.remove(r.capsula);
  r.body.add(model);
  r.model = model;
  r.montado = true;

  /* --- clips --- */
  r.mixer = new THREE.AnimationMixer(model);
  r.acts = {};
  for(const nom of ['board', 'wipeout', 'getup']){
    const c = (tpl.animations || []).find(a => a.name === nom);
    if(c){ const a = r.mixer.clipAction(c); a.enabled = true; r.acts[nom] = a; r.dur = r.dur || {}; r.dur[nom] = c.duration; }
  }
  if(r.acts.wipeout){ r.acts.wipeout.setLoop(THREE.LoopOnce, 1); r.acts.wipeout.clampWhenFinished = true; }
  if(r.acts.getup){   r.acts.getup.setLoop(THREE.LoopOnce, 1);   r.acts.getup.clampWhenFinished = true; }
  if(r.acts.board) r.acts.board.play();
  r.animCur = 'board';

  /* --- la tabla, con el color de su clase --- */
  const tb = tablaDe(r.clase);
  if(tb){
    if(r.tabla) r.body.remove(r.tabla);
    tb.scale.setScalar(K.tablaEsc);
    tb.position.y = 0.02;
    tb.rotation.y = K.tablaYaw;
    r.body.add(tb);
    r.tabla = tb;
  }
}

/* Cambia de clip con fundido. Los de una sola pasada se reinician al entrar. */
function animA(r, nom){
  if(!r.acts || !r.acts[nom] || r.animCur === nom) return;
  const nuevo = r.acts[nom], viejo = r.acts[r.animCur];
  nuevo.reset(); nuevo.enabled = true; nuevo.setEffectiveWeight(1); nuevo.play();
  if(viejo && viejo !== nuevo) viejo.crossFadeTo(nuevo, K.animFade, false);
  r.animCur = nom;
}

function makeRacer(i, human){
  const g = new THREE.Group();
  g.rotation.order = 'YXZ';
  const col = RACER_COL[i];
  const mat = new THREE.MeshLambertMaterial({ color: col });

  const body = new THREE.Group();
  /* CÁPSULA DE RESPALDO: se ve solo hasta que su GLB termina de cargar (son
     12 MB y llegan async). Sin esto, la salida es una pista vacía. */
  const capsula = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.24, 4.6),
                               new THREE.MeshLambertMaterial({ color: 0x22262e }));
  board.position.y = 0.12; capsula.add(board);
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.74, 1.7, 12), mat);
  torso.position.y = 1.4; capsula.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.64, 14, 10), mat);
  head.position.y = 2.6; capsula.add(head);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.95),
                              new THREE.MeshLambertMaterial({ color: 0x101418 }));
  nose.position.set(0, 2.6, -0.66); capsula.add(nose);
  body.add(capsula);
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
    gfx:g, body, capsula, board, meteor, shadow:sh,
    clase: CLASES[i % CLASES.length], montado:false, model:null, mixer:null,
    acts:null, animCur:null, tabla:null,
    padIndex: human ? (HUMANS === 1 ? 0 : i) : -1,
    kb: human && i === 0,
    x:x0, y:terrainY(x0, 0), z:0,
    /* velocidad VECTORIAL en el plano + vertical */
    vx:0, vz:0, vy:0, spd:0,
    yaw:0,                       // hacia dónde apunta el board (0 = máxima pendiente)
    slip:0, skid:0, nForce:1, sink:0, _trailAcc:0, _vT:NaN,
    air:false, airVy0:0, fall:0, crash:0, crashN:0, crashT:0, charge:0,
    grind:null, gBal:0, voids:0,
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

  /* ---------- LA IA VE LOS PRECIPICIOS ----------
     Sin esto se caen los cuatro al primer hueco y la carrera es una broma.
     Al detectar uno delante: apunta al centro (donde está el kicker), endereza
     el board (cruzado no se cruza nada) y mete turbo para llegar lanzada. */
  let hAhead = null;
  for(const g of HUECOS){
    const d = r.z - g.z0;
    if(d > 0 && d < 150 && (!hAhead || d < r.z - hAhead.z0)) hAhead = g;
  }
  if(hAhead){
    const d = r.z - hAhead.z0;
    o.turbo = d < 110 && r.spd < 90;
    /* el ancho del hueco decide si hace falta el kicker del centro */
    const tx0 = hAhead.grande ? 0 : r.x * 0.5;
    const wy = clamp(Math.atan2(tx0 - r.x, Math.max(24, d)), -0.7, 0.7);
    o.ax = clamp((d < 34 ? 0 : wy) / K.steerMax, -1, 1);
    if(!hAhead.grande && d < 5 && !r.air) o.jump = true;   // los cortos, a ollie
    r._ai.tx = tx0;
    return o;
  }

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
  /* con el volante POR OBJETIVO, el eje ES el ángulo: la IA pide directamente
     el que quiere en vez de perseguirlo a base de correcciones (que era lo que
     la dejaba derrapando a media velocidad). */
  o.ax = clamp(wantYaw / K.steerMax, -1, 1);

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
function camKick(v){ DESC.kick.v -= v * 8; }

/* Sacar del abismo a quien no llegó al otro lado. Se le devuelve por DETRÁS del
   hueco, con pista por delante para volver a coger carrerilla.

   TRAMPA CAÍDA: reponer justo en el labio (h.z0 + 5) es un BUCLE INFINITO —
   con 5 unidades no se coge velocidad para cruzar, así que se vuelve a caer.
   Medido: 48 reposiciones en una carrera y el corredor no pasó del 17%.
   Por eso hay (a) carrerilla proporcional al ancho del hueco y (b) un seguro:
   al tercer intento se pasa al otro lado. Esto es una transición entre stages;
   no puede atascar a nadie. */
function reponer(r){
  let h = null, mejor = -1e9;
  for(const g of HUECOS) if(r.z <= g.z0 + 2 && g.z1 > mejor){ h = g; mejor = g.z1; }
  r.voids = (r.voids || 0) + 1;
  DESC._why.vacio = (DESC._why.vacio || 0) + 1;

  if(h){
    r._vh = (r._vh === h) ? r._vh : h;
    r._vn = (r._vhLast === h ? (r._vn || 0) + 1 : 1);
    r._vhLast = h;
    if(r._vn >= 3){                                  // seguro anti-atasco
      r.z = h.z1 - 8; r.x = 0;
      r.y = terrainY(0, r.z);
      r.vx = 0; r.vz = -26; r.yaw = 0;
      r._vn = 0;
    } else {
      const carrerilla = clamp(70 + h.largo * 1.6, 70, 150);
      r.z = h.z0 + carrerilla;
      r.x = clamp(r.x, -hwAt(r.z) + 12, hwAt(r.z) - 12);
      r.y = terrainY(r.x, r.z);
      r.vx = 0; r.vz = -18; r.yaw = 0;                // encarado y con algo de impulso
    }
  } else { r.vx *= 0.15; r.vz *= 0.15; }

  r.vy = 0; r.air = false; r._vT = NaN; r.grind = null;
  r.crash = K.crashTime; r.crashN = 0;
  if(r.human){ camKick(K.kickCrash); r._lastTrick = '¡AL VACÍO!'; r._lastTrickT = 1.4; }
  spray(r, 26, 3.4);
}

function crash(r, por){
  if(r.fall > 0 || r.crash > 0) return;
  if(r.human) camKick(K.kickCrash);
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
  if(r.montado && r.acts && r.acts.wipeout){
    const w = K.fallTime * K.wipeFrac;
    r.acts.wipeout.timeScale = (r.dur.wipeout || 2.4) / w;
    animA(r, 'wipeout');
  }
  /* NO se para en seco: sigue deslizando con parte de lo que llevaba */
  r.vx *= K.fallMul; r.vz *= K.fallMul; r.vy = 0; r.air = false; r.charge = 0;
  r.trick = null; r.combo = 0; r.crashN = 0;
  r.meteor.visible = false; r.atk = 0;
  spray(r, 40, 4.2);
}
function spray(r, n, force){
  const gy = groundYAt(r.x, r.z);
  for(let i = 0; i < n; i++){
    emit(r.x + (Math.random()-0.5)*2.2, gy + 0.3 + Math.random()*0.6, r.z + (Math.random()-0.5)*2.2,
         (Math.random()-0.5)*force*2.2, Math.random()*force*1.5, (Math.random()*0.4+0.5)*force,
         0.055 + Math.random()*0.085);
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
    const antes = r.fall;
    r.fall -= dt;
    if(r.montado){
      /* con clips de verdad NO se tumba la cápsula a mano: se encadena
         batacazo → levantarse, y el cuerpo se queda derecho (el clip manda) */
      const corte = K.fallTime * (1 - K.wipeFrac);
      if(antes > corte && r.fall <= corte && r.acts && r.acts.getup){
        r.acts.getup.timeScale = (r.dur.getup || 2.4) / Math.max(0.25, corte);
        animA(r, 'getup');
      }
      r.body.rotation.set(0, 0, 0);
    } else {
      r.body.rotation.set(-1.35, 0, Math.sin(DESC.t*7)*0.12);
    }
    r.x += r.vx*dt; r.z += r.vz*dt;
    const fd = Math.pow(K.fallDrag, dt);
    r.vx *= fd; r.vz *= fd;
    r.y = groundYAt(r.x, r.z);
    r.spd = Math.hypot(r.vx, r.vz);
    r.gfx.position.set(r.x, r.y, r.z);
    r.gfx.rotation.y = -r.yaw;
    r.shadow.position.set(r.x, r.y + 0.07, r.z);
    if(r.fall <= 0){ r.body.rotation.set(0,0,0); animA(r, 'board'); }
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
  /* el stick pide un ÁNGULO (no suma ángulo): a fondo, K.steerMax respecto de
     la línea de máxima pendiente. Al soltar, vuelve solo. */
  const wantYaw = inp.ax * K.steerMax;
  const dYaw = wantYaw - r.yaw;
  const vel = (Math.abs(inp.ax) > 0.05 ? turn : K.steerBack);
  r.yaw = clamp(r.yaw + clamp(dYaw, -vel * dt, vel * dt), -K.yawLimit, K.yawLimit);
  const fx = Math.sin(r.yaw), fz = -Math.cos(r.yaw);       // eje largo del board
  const rx = Math.cos(r.yaw), rz = Math.sin(r.yaw);        // eje transversal

  const hard = hardnessAt(r.x, r.z);
  const srf  = surfaceAt(r.x, r.z, _srf);

  if(!r.air && !r.grind){
    /* ---------- GRAVEDAD PROYECTADA EN EL PLANO ----------
       G - (G·n)n. De aquí sale todo: la velocidad terminal, que una
       hondonada acelere y que atravesar la ladera te pare. */
    let ax = K.grav * srf.ny * srf.nx;
    let az = K.grav * srf.ny * srf.nz;

    /* ---------- MODELO DE CANTO: ROTAR, NO MATAR ----------
       ESTE era el fallo de fondo del "se siente duro". Antes el canto MATABA la
       componente lateral de la velocidad — y eso borra energía: tallar costaba
       el 47% de la velocidad (medido, 72 → 38 u/s). Un canto de verdad no
       frena la velocidad: la GIRA. La fuerza es centrípeta y no hace trabajo.

       Así que ahora el canto ROTA el vector velocidad hacia el eje del board,
       conservando su módulo, a la velocidad angular que da el agarre
       (a = v·ω ⇒ ω_max = agarre/v). Lo que NO alcanza a girar es derrape, y
       ESO sí raspa. Lo único que se pierde al tallar pasa a ser lo honesto:
       que apuntando de lado la gravedad empuja menos (cos del ángulo). */
    const vF =  r.vx*fx + r.vz*fz;
    const vR =  r.vx*rx + r.vz*rz;
    r.slip = Math.abs(vR);

    const gripFade = clamp(r.spd / K.gripLowV, K.gripLowMin, 1);
    const gripMax  = K.grip * r.nForce * lerp(K.gripSoft, 1, hard) * gripFade;

    if(r.spd > 2 && vF > 0){
      const vYaw = Math.atan2(r.vx, -r.vz);
      let dv = r.yaw - vYaw;                              // lo que falta por girar
      while(dv >  Math.PI) dv -= TAU;
      while(dv < -Math.PI) dv += TAU;
      const wMax = (gripMax / r.spd) * dt;                // ω que da el agarre
      const w    = clamp(dv, -wMax, wMax);
      /* OJO AL SIGNO: con la rotación al revés el canto giraba la velocidad
         EN SENTIDO CONTRARIO y se estabilizaba de lado — se bajaba de costado
         a 2 u/s con el board recto. Comprobación: v=(0,-1) (θ=0) con w>0 debe
         dar θ=+w. */
      const cw = Math.cos(w), sw = Math.sin(w);           // rotación PURA: |v| intacto
      const nvx = r.vx*cw - r.vz*sw;
      const nvz = r.vx*sw + r.vz*cw;
      r.vx = nvx; r.vz = nvz;
      r.skid = Math.max(0, Math.abs(dv) - wMax) * r.spd;  // lo que no se pudo girar
      r._carveF = Math.abs(w / dt) * r.spd;               // fuerza de canto (para el bombeo)
    } else { r.skid = 0; r._carveF = 0; }
    const aR = r._carveF;

    /* ---------- ROZAMIENTOS (siempre CONTRA la velocidad, no contra el
       eje del board: si no, a poca velocidad el signo baila y tiembla) ----------
       aerodinámico (v²) + seco del material + el raspón del derrape.
       Ya NO se cobra por tallar: tallar paga (ver el empuje de abajo). */
    const dragMul = K.dragSoft + (K.dragHard - K.dragSoft) * hard;
    let aFric = K.dragC * r.spd * r.spd * dragMul
              + K.muBase * r.nForce * (1.6 - hard)
              + r.skid * K.skidDrag;
    if(r.grabbed > 0) aFric += 8;
    const vm = Math.hypot(r.vx, r.vz);
    if(vm > 0.01){
      const f = Math.min(aFric, vm / dt) / vm;          // nunca te empuja hacia atrás
      ax -= r.vx * f; az -= r.vz * f;
    }

    /* ---------- ►ARCADE (1): TALLAR ACELERA ----------
       La fuerza que el canto hace contra el terreno se devuelve como empuje
       hacia delante — es "bombear" la curva. Se desvanece al acercarse a
       K.carveCap para que no sea barra libre, y solo cuenta si NO estás
       derrapando (si te sueltas, no bombeas: raspas). */
    if(r.crash <= 0){
      const techo = clamp((K.carveCap - r.spd) / 22, 0, 1);
      const limpio = 1 - clamp(r.skid / 8, 0, 1);
      const pump = aR * K.carveBoost * techo * limpio;
      ax += pump * fx; az += pump * fz;
      r._pump = pump;                                   // el HUD lo pinta
    } else r._pump = 0;

    /* ---------- ►ARCADE (4): SUELO DE VELOCIDAD ----------
       En nieve profunda o tras un choque te quedabas muerto y eso no da placer.
       Por debajo de una fracción del equilibrio de ESTA zona, empuja. */
    const eq = 26 + zoneProp(r.z, 'deg') * 1.5;         // aproximación del equilibrio
    const piso = eq * K.floorFrac;
    if(r.spd < piso && r.fall <= 0){
      const k2 = (piso - r.spd) / piso;
      ax += K.floorPush * k2 * fx; az += K.floorPush * k2 * fz;
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

  /* ---------- ►ARCADE (2): EL DERRAPE SE RECUPERA SOLO ----------
     Si te has soltado, el board vuelve a alinearse con la velocidad. Derrapar
     pasa de "castigo del que no ha calculado" a recurso vistoso del que se
     recupera solo. Es la diferencia entre pelearse con el juego y lucirse. */
  if(!r.air && !r.grind && r.skid > 0.0001 && r.spd > 6 && r.fall <= 0){
    const vYaw = Math.atan2(r.vx, -r.vz);
    let d = vYaw - r.yaw;
    while(d >  Math.PI) d -= TAU;
    while(d < -Math.PI) d += TAU;
    r.yaw = clamp(r.yaw + d * Math.min(1, dt / K.skidRecov), -K.yawLimit, K.yawLimit);
  }

  /* GIRO POR GRAVEDAD: a poca velocidad el morro cae solo hacia la línea de
     máxima pendiente (el peso tira de la punta). Es la salida natural del
     callejón de arriba y además hace que arrancar se sienta bien. */
  if(!r.air && !r.grind && r.fall <= 0){
    const w = 1 - clamp(r.spd / K.fallTurnV, 0, 1);
    if(w > 0) r.yaw -= Math.sin(r.yaw) * K.fallTurn * w * dt;
  }

  r.x += r.vx * dt; r.z += r.vz * dt;
  r.spd = Math.hypot(r.vx, r.vz);

  /* ---------- SEGUIR EL SUELO / DESPEGAR SOLO ----------
     vT = velocidad vertical que exige el terreno bajo mis pies. Si el terreno
     cae MÁS rápido de lo que la gravedad me puede bajar, despego. Es lo que
     hace que un lomo o el labio de una rampa lancen sin impulso escrito. */
  /* ---------- PRECIPICIO: pisar el aire ----------
     Al pasar el labio de un hueco simplemente dejas de tener suelo. No hay
     impulso ni animación: te vas con la velocidad que llevaras, que es
     exactamente lo que decide si lo cruzas o no. */
  if(!r.air && !r.grind && huecoAt(r.z)){
    r.air = true; r.vy = Math.min(0, r._vT || 0); r.airVy0 = 0; r._vT = NaN;
  }
  /* ---------- CAERSE AL VACÍO ----------
     No puede matarte ni acabarte la run (esto es una transición): te repone en
     el borde de salida habiendo perdido tiempo y casi toda la velocidad. */
  if(enVacio(r.y, r.z)) reponer(r);

  if(!r.air && !r.grind){
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
      r.airVy0 = r.vy; r.charge = 0; r._noLand = true;
      if(r.vy > 3) spray(r, 8, 2.4);
    } else {
      r.y = gy;
      r._vT = vT;
    }
  }

  /* ---------- OLLIE ----------
     ARCADE: soltar el botón salta, pero si lo sueltas rápido saltas IGUAL de
     bien (K.ollieMin ya es un salto de verdad). Cargar es para el truco largo.
     La v4 obligaba a cargar para despegar y eso se sentía a peaje. */
  if(!r.air && !r.grind && r.crash <= 0){
    if(inp.jump){ r.charge = Math.min(K.ollieChg, r.charge + dt); }
    else if(r.charge > 0){
      r.air = true;
      r.vy = lerp(K.ollieMin, K.ollieMax, r.charge / K.ollieChg);
      r.airVy0 = r.vy; r.charge = 0;
      r._noLand = true;                  // ← ver la nota en el bloque de AIRE
      r.y += 0.06;
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

  /* ---------- ►GRINDING ---------- */
  if(r.grind){
    const R = r.grind;
    r.x = R.x;                                   // el raíl manda en el lateral
    r.y = terrainY(R.x, r.z) + R.alto;
    r.air = false; r.vy = 0; r.vx = 0;
    r.vz *= Math.pow(K.grindFric, dt * 60);
    r.spd = Math.abs(r.vz);
    /* el equilibrio se tuerce solo y se corrige con el stick */
    r.gBal += (R.dir * K.grindDrift + inp.ax * K.grindFix) * dt;
    r.pts += K.grindPts * dt;
    r._grindT = (r._grindT || 0) + dt;
    if(Math.random() < 0.5) emit(r.x + (Math.random()-0.5)*0.8, r.y + 0.2, r.z + 1.2,
        (Math.random()-0.5)*5, 1 + Math.random()*3, 4 + Math.random()*6, 0.13);
    const salir = inp.jump && !r._jumpHeld;
    if(Math.abs(r.gBal) > 1 || r.z <= R.z1 || r.spd < 5 || salir){
      const perdido = Math.abs(r.gBal) > 1;
      r.grind = null;
      r.air = true; r.vy = salir ? K.grindOut + 4 : K.grindOut;
      r.airVy0 = r.vy;
      if(perdido){ fall(r); }
      else {
        r.pts += Math.round(60 * (r._grindT || 0));
        r._lastTrick = 'GRIND ' + (r._grindT||0).toFixed(1) + 's'; r._lastTrickT = 1.2;
      }
      r._grindT = 0;
    }
    r._jumpHeld = inp.jump;
  } else if(r.air && r.vy < 0 && r.spd > K.grindMinV && !r.trick){
    /* ¿estoy cayendo justo encima de un raíl? */
    const R = railAt(r.z);
    if(R && Math.abs(r.x - R.x) < K.grindSnapX){
      const ry = terrainY(R.x, r.z) + R.alto;
      if(r.y > ry - 0.6 && r.y < ry + K.grindSnapY){
        r.grind = R; r.gBal = 0; r._grindT = 0;
        r.vz = -Math.hypot(r.vx, r.vz);            // toda la velocidad al raíl
        r.vx = 0; r.y = ry; r.air = false; r.vy = 0;
        R.dir = R.dir || (Math.random() < 0.5 ? -1 : 1);
        r._lastTrick = '¡GRIND!'; r._lastTrickT = 0.8;
        if(r.human) camKick(0.9);
      }
    }
  }

  /* ---------- AIRE: trucos y ATERRIZAJE POR ABSORCIÓN ---------- */
  if(r.air && !r.grind){
    /* los saltitos de chatter (medio metro sobre un lomo) NO son un salto:
       si dejas encadenar trucos ahí, el aterrizaje a medias te tumba sin que
       el jugador entienda por qué */
    if(inp.trick && !r.trick && TRICKS[inp.trick] && r.airVy0 > 7){ r.trick = inp.trick; r.trickT = 0; }
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
    /* ►EL BUG QUE MATABA EL SALTO (lo cazó Toni jugando: "ya no puedo saltar").
       El ollie pone air=true unas líneas más arriba, en ESTE MISMO frame, y en
       ese instante r.y sigue valiendo exactamente la altura del suelo — porque
       el bloque de seguimiento del terreno se la acaba de asignar. Así que la
       comprobación de aterrizaje se cumplía al vuelo y te aterrizaba en el
       frame cero: nunca despegabas, sin error ni aviso. El frame del despegue
       NO se comprueba; a partir del siguiente ya hay integración de vy. */
    const gy = padY(r.x, r.z, fx, fz);
    if(r._noLand){ r._noLand = false; }
    else if(r.y <= gy){
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
      /* ►ARCADE (3): ATERRIZAR REGALA VELOCIDAD. Parte del impacto vuelve como
         empuje en el eje del board. Cuanto mejor encares la pendiente, menos
         impacto hay y más se conserva: caer bien pasa a ser rentable, no solo
         "no ser castigado". Y el board se endereza un poco solo. */
      if(r.human) camKick(Math.min(K.kickMax, impacto * K.kickLand));
      if(impacto > 4 && !r.trick){
        const b = impacto * K.landBoost;
        r.vx += fx * b; r.vz += fz * b;
        r._lastTrick = 'ATERRIZAJE +' + Math.round(b); r._lastTrickT = 0.7;
      }
      r._vT = NaN;                       // sin referencia previa: ver `primero`
      r.spd = Math.hypot(r.vx, r.vz);
      /* desalineación board/velocidad al tocar */
      const vAng = r.spd > 4 ? Math.abs(Math.atan2(r.vx*Math.cos(r.yaw) + r.vz*Math.sin(r.yaw),
                                                    r.vx*Math.sin(r.yaw) - r.vz*Math.cos(r.yaw))) : 0;
      /* endereza el board hacia la velocidad al tocar: perdona el ángulo */
      if(r.spd > 6 && !r.trick){
        const vYaw2 = Math.atan2(r.vx, -r.vz);
        let d2 = vYaw2 - r.yaw;
        while(d2 >  Math.PI) d2 -= TAU;
        while(d2 < -Math.PI) d2 += TAU;
        r.yaw = clamp(r.yaw + d2 * K.landAlign, -K.yawLimit, K.yawLimit);
      }
      spray(r, 6 + Math.round(impacto*0.5), 2.0 + impacto*0.08);
      if(r.trick) fall(r);
      else if(impacto > K.landHard) crash(r, 'aterrizaje');
      else if(vAng > K.landSlip && r.spd > 26) crash(r, 'plancha');
      else r.combo = 0;
    }
  }

  /* ---------- rastro y polvo en el suelo ---------- */
  if(!r.air && !r.grind && r.fall <= 0){
    const carve = clamp(r.slip / 16, 0, 1);
    r._trailAcc += r.spd * dt;
    if(r._trailAcc >= K.trailEvery){
      r._trailAcc = 0;
      dropTrail(r.x, r.z, r.yaw, 1.7 + carve*1.8);
    }
    if(Math.random() < 0.06 + carve*0.55 + (r.spd/90)*0.2){
      const s2 = Math.sign(r.vx*Math.cos(r.yaw) + r.vz*Math.sin(r.yaw)) || 1;
      emit(r.x - Math.cos(r.yaw)*s2*0.9, r.y + 0.25, r.z - Math.sin(r.yaw)*s2*0.9,
           -r.vx*0.15 + (Math.random()-0.5)*3, 1.5 + Math.random()*3.5 + carve*7,
           -r.vz*0.15 + (Math.random()-0.5)*3, 0.045 + Math.random()*0.06 + carve*0.075);
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
  /* la rueda acerca y aleja (Toni: "alejarte y acercarte un poquito") */
  if(o.wheel){
    K.camDist = clamp(K.camDist + o.wheel * K.zoomPaso, K.camDistMin, K.camDistMax);
    o.wheel = 0;
  }
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
  if(o.mx || o.my){                        // movimiento de ratón acumulado
    o.yaw   += o.mx * K.orbMouse;
    o.pitch -= o.my * K.orbMouse;
    o.mx = o.my = 0; tocado = true;
  }
  o.yaw = clamp(o.yaw, -K.orbYawMax, K.orbYawMax);   // no se puede dar la vuelta entera
  o.idle = tocado ? 0 : o.idle + dt;
  if(o.idle > K.orbHold){                  // vuelve sola detrás
    const k = Math.min(1, K.orbBack * dt);
    o.yaw   -= o.yaw * k;
    o.pitch -= o.pitch * k;
  }
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
  /* AL HOMBRO: además de ir detrás, se desplaza de lado y sube, y el punto de
     mira se desplaza con ella. Es lo que separa "tercera persona" de "dron". */
  const lax = Math.cos(yawW), laz = Math.sin(yawW);        // eje lateral de la vista
  _camLook.x += lax * K.camHombro * 0.55;
  _camLook.z += laz * K.camHombro * 0.55;
  const set = d => _camPos.set(_camLook.x - fx * Math.cos(p) * d + lax * K.camHombro,
                               _camLook.y + Math.sin(p) * d + K.camAlto,
                               _camLook.z - fz * Math.cos(p) * d + laz * K.camHombro);
  /* ---------- LA CÁMARA NO SE METE EN LA MONTAÑA ----------
     Mirar solo el suelo BAJO la cámara no basta: en una ladera de 42° el
     terreno se cruza ENTRE el jugador y la cámara, y lo que se ve es un
     pegote oscuro tapando media pantalla (cazado con un raycast: era el
     propio terreno a 15 u). Hay que barrer el segmento y acortar la
     distancia hasta que el camino esté libre. Acercarse encuadra mucho
     mejor que subir, que deja la cámara cenital. */
  let d = dist;
  for(let intento = 0; intento < 5; intento++){
    set(d);
    let libre = true;
    for(let k = 1; k <= 5; k++){
      const f2 = k / 5;
      const sx = lerp(_camLook.x, _camPos.x, f2);
      const sy = lerp(_camLook.y, _camPos.y, f2);
      const sz = lerp(_camLook.z, _camPos.z, f2);
      if(sy < groundYAt(sx, sz) + K.camMinH){ libre = false; break; }
    }
    if(libre) break;
    d *= 0.72;
    if(d < 7){ set(d); break; }
  }
  const gmin = groundYAt(_camPos.x, _camPos.z) + K.camMinH;
  if(_camPos.y < gmin) _camPos.y = gmin;

  if(DESC.world && K.tilt){
    DESC.world.updateMatrixWorld();
    DESC.world.localToWorld(_camLook); DESC.world.localToWorld(_camPos);
  }

  if(!_camInit){ DESC.cam.position.copy(_camPos); _camInit = true; }
  else DESC.cam.position.lerp(_camPos, Math.min(1, K.camLag*dt));

  /* muelle del golpe de cámara: se hunde de golpe y vuelve rebotando */
  const KK = DESC.kick;
  KK.v += (-K.kickSpring * KK.y - K.kickDamp * KK.v) * dt;
  KK.y += KK.v * dt;
  if(Math.abs(KK.y) < 0.002 && Math.abs(KK.v) < 0.02){ KK.y = 0; KK.v = 0; }

  const sh = k * K.shakeSpeed;
  DESC.cam.position.x += (Math.random()-0.5)*sh;
  DESC.cam.position.y += (Math.random()-0.5)*sh + KK.y;
  DESC.cam.lookAt(_camLook);
  DESC.cam.updateMatrixWorld();

  if(DESC.backdrop) DESC.backdrop.position.set(DESC.cam.position.x, DESC.cam.position.y, DESC.cam.position.z);
  if(DESC.sky) DESC.sky.position.copy(DESC.cam.position);
  if(DESC.cielo) DESC.cielo.position.copy(DESC.cam.position);

  const want = K.fovBase + K.fovSpeed * k * k - KK.y * K.kickFov;
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
    '<div id="dSalta" style="position:absolute;top:22%;left:50%;transform:translate(-50%,-50%);font-size:44px;font-weight:900;opacity:0;color:#ff5a3d;letter-spacing:1px"></div>' +
    '<div id="dAire" style="position:absolute;left:50%;bottom:74px;transform:translateX(-50%);opacity:0;' +
      'background:rgba(6,10,20,.72);padding:10px 16px;border-radius:12px;font-size:15px;line-height:1.7;white-space:nowrap"></div>' +
    '<div id="dBig" style="position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);font-size:84px;font-weight:900;letter-spacing:-2px"></div>' +
    '<div id="dBar" style="position:absolute;left:50%;bottom:22px;transform:translateX(-50%);width:min(620px,72vw);height:9px;background:rgba(0,0,0,.42);border-radius:6px;overflow:hidden">' +
      '<div id="dFill" style="height:100%;width:0;background:#fff;border-radius:6px"></div></div>' +
    '<div id="dHelp" style="position:absolute;left:16px;bottom:14px;opacity:.5;font-size:11px;line-height:1.5">' +
      '<b>A/D</b> girar · <b>ESPACIO</b> saltar (mantener = salto más alto) · <b>SHIFT</b> turbo<br>' +
      '<b>RATÓN</b> mira alrededor · <b>RUEDA</b> acerca/aleja · <b>J</b> meteorito · <b>L</b> agarrar · <b>U</b> objeto<br>' +
      '<b>EN EL AIRE: 1..6 = TRUCOS</b> (te los recuerda en pantalla) · R reiniciar · T semilla</div>';
  document.body.appendChild(d);
  DESC.hud = { root:d, top:d.querySelector('#dTop'), left:d.querySelector('#dLeft'),
    right:d.querySelector('#dRight'), big:d.querySelector('#dBig'), fill:d.querySelector('#dFill'),
    vig:d.querySelector('#dVig'), trick:d.querySelector('#dTrick'), zone:d.querySelector('#dZone'),
    salta:d.querySelector('#dSalta'), aire:d.querySelector('#dAire') };
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
    (me._pump > 1.5 ? '<div style="color:#7bf06a;font-weight:800">◄ TALLANDO +' +
        Math.round(me._pump) + ' ►</div>' : '') +
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

  /* ►CHULETA DE TRUCOS EN EL AIRE. Toni: "soy incapaz de lanzar trucos, no sé
     qué botones son". Estaban en una línea de ayuda de 11 px abajo a la
     izquierda, que nadie lee mientras baja a 200 km/h. Ahora aparecen GRANDES
     justo cuando sirven — en el aire — y el que ya has hecho se marca. */
  if(me.air && !me.grind && me.fall <= 0){
    if(!h._aireHtml){
      h._aireHtml = '<b style="color:#ffe14d">TRUCOS</b> &nbsp;' +
        [['1','Indy'],['2','Mortal atrás'],['3','Mortal adelante'],
         ['4','360'],['5','DOBLE mortal'],['6','Superman']]
        .map(([k2, n]) => '<span style="display:inline-block;margin:0 7px">' +
             '<b style="background:#fff;color:#111;border-radius:5px;padding:1px 7px">' + k2 + '</b> ' + n + '</span>').join('');
      h.aire.innerHTML = h._aireHtml;
    }
    h.aire.style.opacity = me.trick ? 0.45 : 1;
  } else h.aire.style.opacity = 0;

  /* ►AVISO DE PRECIPICIO: un hueco no se ve venir hasta que lo tienes encima */
  let avisoZ = 1e9;
  for(const g of DESC.HUECOS){ const d = me.z - g.z0; if(d > 0 && d < avisoZ) avisoZ = d; }
  if(avisoZ < 105 && !me.air){
    h.salta.textContent = avisoZ < 42 ? '¡SALTA!' : 'PRECIPICIO';
    h.salta.style.opacity = (avisoZ < 42 ? 1 : 0.72).toFixed(2);
    h.salta.style.color = avisoZ < 42 ? '#ff3d2e' : '#ffb03d';
  } else h.salta.style.opacity = 0;

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
    /* ►NO DISPONER LO COMPARTIDO.
       SkeletonUtils.clone() COMPARTE geometría y texturas con la plantilla de
       `_charTpls`. Este bucle las destruía al reiniciar (tecla R, tecla T o
       cualquier `_start`), y con ellas se llevaba por delante los personajes
       del descenso Y LOS DE LA PARTIDA — la plantilla es la misma. El síntoma
       era desconcertante: los corredores existían, con su esqueleto colocado
       y a la altura correcta, pero su material nunca llegaba a compilarse
       (`material.program` a null) porque su geometría ya no estaba en la GPU.
       La home ya tenía esta guarda (`_sharedGeo`); aquí faltaba. */
    DESC.scene.traverse(o => {
      if(o.userData && o.userData._compartido) return;
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
  DESC.kick.y = DESC.kick.v = 0;
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

  /* ►PERSONAJES: los GLB llegan async, así que se intenta montar cada frame
     hasta que su plantilla existe. Y el recolor puede quedar PENDIENTE si la
     textura aún no había decodificado — se reintenta igual. */
  pideTabla();
  for(const r of DESC.racers){
    if(!r.montado) montaPersonaje(r);
    else if(r._recolorPend && typeof recolorAtlas === 'function' && r.model){
      r._recolorPend = false;
      r.model.traverse(o => {
        if(!o.isMesh && !o.isSkinnedMesh) return;
        (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
          if(m && m.map){ const t = recolorAtlas(m.map, r.clase);
            if(t){ m.map = t; if(m.color) m.color.setRGB(1,1,1); m.needsUpdate = true; }
            else r._recolorPend = true; }
        });
      });
    }
    if(!r.tabla && r.montado && CHAR.tabla){
      const tb = tablaDe(r.clase);
      if(tb){ tb.scale.setScalar(K.tablaEsc); tb.position.y = 0.02;
              tb.rotation.y = K.tablaYaw; r.body.add(tb); r.tabla = tb; }
    }
    if(r.mixer) r.mixer.update(dt);
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
/* ratón: MOVERLO rota la vista (sin tener que arrastrar) y la RUEDA acerca o
   aleja. Con orbLibre=false vuelve al comportamiento de arrastrar. */
addEventListener('mousedown', () => { if(DESC.on) DESC.orb.down = true; });
addEventListener('mouseup',   () => { DESC.orb.down = false; });
addEventListener('mousemove', e => {
  if(!DESC.on) return;
  if(!K.orbLibre && !DESC.orb.down) return;
  DESC.orb.mx += e.movementX || 0;
  DESC.orb.my += e.movementY || 0;
});
addEventListener('wheel', e => {
  if(!DESC.on) return;
  DESC.orb.wheel = (DESC.orb.wheel || 0) + Math.sign(e.deltaY);
  e.preventDefault();
}, { passive:false });

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
