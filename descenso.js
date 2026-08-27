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
     Stick ←/→ · A/D ....... GIRAR. Es un VOLANTE, no un mando de ángulo: gira
                             mientras lo empujas y al soltar SE QUEDA donde
                             apunta (ver ►VOLANTE NATURAL en K)
     LB / RB   · Q/E ....... CLAVAR CANTO izquierda / derecha: el giro bestia
     A         · Espacio ... OLLIE: mantén para cargar, suelta para saltar
     RT        · Shift ..... TURBO (3 s de depósito, 6 s de espera)
     LT        · S ......... frenar
     Stick der.· ratón ..... girar la CÁMARA (vuelve sola detrás)

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

/* ►SE DEFINE SIEMPRE, PERO NO ARRANCA SOLO. Antes salia en su primera linea
   sin `?descenso` en la URL, asi que desde el juego no habia nada que llamar.
   Dos puertas: `?descenso` (desarrollo) y `DESC.lanzar({piel, alAcabar})`, que
   es por donde entra la RUTA de la campana. */
const Q = location.search;
const SUELTO = /[?&]descenso(=|&|$)/.test(Q);

const _qs    = new URLSearchParams(Q);
const HUMANS = Math.max(1, Math.min(4, parseInt(_qs.get('humanos')||'1', 10) || 1));
/* PIEL: `?descenso&piel=nieve` y también, más corto, `?descenso=nieve`. El
   valor de `descenso=` ya viaja en la URL de entrada, así que aprovecharlo
   ahorra un parámetro y es lo primero que se teclea para probar una piel. */
const _pielQS = (_qs.get('piel') || _qs.get('descenso') || '').toLowerCase();
let SKIN     = /^(arena|nieve|mar)$/.test(_pielQS) ? _pielQS : 'arena';
/* ►KITE: la piel de mar no es surf a secas, es KITESURF — el rider va colgado de
   una barra y tira de una vela. Vive aquí arriba (y no junto a su bloque) porque
   `montaPersonaje` lo consulta: un `const` más abajo también valdría, pero este
   fichero ya se ha comido una TDZ y no merece la pena arriesgar otra.
   `?kite=0` lo apaga y el mar vuelve a ser el surf de antes. */
let KITE_ON = (SKIN === 'mar') && _qs.get('kite') !== '0';
/* MAR vive aquí arriba porque lo consultan cosas que se evalúan al cargar el
   módulo (el PLAN de la travesía, las zonas): más abajo sería una TDZ. */
let MAR = (SKIN === 'mar');
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

  /* ►VOLANTE NATURAL — el stick manda VELOCIDAD DE GIRO, y al soltar el board
     SE QUEDA DONDE APUNTA (Toni: "cuando giras el personaje que no se enderece;
     si gira de lado, de lado se queda hasta que lo corriges tú, y si se tiene
     que frenar porque ahí hay pendiente, pues se frena").

     TRES MODELOS Y POR QUÉ ESTE. El primero integraba el ángulo pero SIN tope
     ni ayudas: mantener a la derecha te cruzaba la ladera entera. Se cambió a
     "el stick pide un ÁNGULO absoluto y al soltar vuelve solo" (steerBack), y
     eso arregló la línea a costa de un autopiloto: el morro se iba a la máxima
     pendiente aunque no tocaras nada. Lo que fallaba en el primero NO era
     integrar: era que integrar sin límite y sin coste no tiene tacto.
     Hoy el límite y el coste ya existen y son físicos — K.yawLimit corta a ±88°
     y cruzado la gravedad proyectada te frena sola (el coseno del ángulo) —,
     así que el integrador vuelve, ahora sí con la montaña haciendo de freno.

     De paso se cae el crédito artificial de "sostener el giro lo amplía"
     (steerHold/steerHoldT): en un integrador, aguantar YA abre el ángulo. A
     turnHigh (1,25 rad/s) llegar a los 72° que daba el crédito cuesta ~1,0 s,
     prácticamente los steerHoldT=1,10 de antes → el tacto de MANTENER es el
     mismo, y encima un toque corto ahora corrige de verdad en vez de saltar al
     ángulo absoluto que tocara.

     El CANTO (Q/E) y el FRENO (S) siguen pidiendo un ángulo: no son volante,
     son gestos puntuales — clavas la tabla ahí y se acabó. */
  steerMax:   38 * RAD,// ángulo de referencia. Ya NO lo usa el stick: es la
                       // escala con que la IA convierte "me falta este ángulo"
                       // en eje (ver aiInput) y el umbral con que decide canto
  cantoYaw:   80 * RAD,// ángulo que clava un canto (Q/E)
  cantoTurn:  4.6,     // rad/s con que lo clava: esto es lo "bestia"
  turnLow:    2.0,     // rad/s de giro del stick a fondo, a poca velocidad
  turnHigh:   1.25,    // ...y a tope (Toni: "que no sea tan abrupto")
  airTurn:    2.6,     // en el aire se gira mucho: deja encarar la caída
  turboThrust:22,
  /* ►TURBO CON FONDO. Toni: "no puede ser infinito: 3 segundos seguidos y 6
     en poder volver a usarse". Se gasta mientras lo mantienes; al agotarse
     empieza la espera y solo al acabarla se recarga ENTERO. No hay regen
     mientras te queda: si no, a base de toquecitos volvería a ser infinito. */
  dashMax:    3.0,
  turboCd:    6.0,
  /* ►TOPE DE VELOCIDAD (Toni: "no quiero velocidades no realistas" — se
     llegaba a 104 u/s). Doble freno: uno SUAVE progresivo desde velSuave (el
     aire a esa velocidad es un muro que crece) y un clamp duro en velMax. */
  velSuave:   62,
  velCapK:    0.055,
  velMax:     84,
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

  /* =====================================================================
     ►CANTOS: por qué no puedes ir recto a tope y quedarte tan ancho

     Toni: "puedo ir recto a súper velocidad sin caerme, y al no derrapar ni
     poner la tabla de lado de vez en cuando se siente raro. ¿Qué se haría en
     un juego profesional?".

     Lo que se hace es lo que pasa en la realidad: ir con la tabla PLANA (sin
     canto clavado) a mucha velocidad y sobre terreno picado es INESTABLE. La
     tabla castañetea, y al final enganchas canto y te vas al suelo. Por eso un
     rider real va siempre de canto a canto: no es estética, es control.

     Aquí se modela con un medidor de CASTAÑETEO que sube cuando vas plano,
     rápido y por terreno rugoso, y que baja en cuanto clavas canto (o sea, en
     cuanto giras). Si se llena, enganchas y te caes. Consecuencias:
       · la línea recta a tope deja de ser gratis,
       · hay que trazar de canto a canto, que es justo lo que se echaba en falta,
       · y la zona lisa (verde) perdona mucho más que el fuera pista.
     Va con aviso en pantalla y temblor de tabla y cámara: nunca te cae encima
     sin haberte avisado. */
  chatVel:    45,      // velocidad a partir de la cual empieza a importar
  chatSube:   0.95,    // /s yendo totalmente plano en terreno malo. Medido: a
                       // 0,62 solo enganchaba una vez cada 100 s de recta, que
                       // no llega a ser una presión.
  chatBaja:   1.9,     // /s clavando canto
  chatCanto:  0.30,    // a partir de qué carve se considera "canto clavado"
  chatAviso:  0.55,    // cuándo se avisa en pantalla
  chatFreno:  0.16,    // cuánto frena ir castañeteando (rebotas, no deslizas)

  /* ►DERRAPE CON BOTÓN (S / ↓ / LB): clavar cantos de través para frenar en
     seco levantando una cortina de material. Es el movimiento que faltaba. */
  frenoYaw:   72 * RAD,// ángulo al que se pone la tabla al frenar
  frenoFuerza:34,      // u/s² de frenada
  frenoSpray: 3.2,

  /* --- ►GRINDING sobre raíles ---
     Se engancha SOLO con caer encima (no hay botón). Una vez arriba, el raíl
     te lleva y tú peleas el equilibrio con el mismo stick que gira: se va
     torciendo solo y hay que corregir. Si se te va, te caes. */
  grindSnapX: 3.6,     // margen lateral para engancharse
  grindIman:  8,       // ►IMÁN (Toni: "solo saltar cerca ya te imanta"): en el
                       // aire, cayendo cerca de un raíl, te ATRAE hacia él
  grindImanF: 9,       // fuerza de la atracción (1/s)
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

  /* (ATAQUE METEORITO y AGARRE retirados a petición de Toni: el descenso va de
     bajar bien y de coger globos, no de pelearse.) */

  /* PREMIO POR PUESTO. Toni: "quedar el primero te da un extra de puntos,
     segundo un poco menos y tercero un poco menos; debajo de tercero no te dan
     nada extra". El 4º ya no cobra: llegar el último no es un logro. */
  ptsPos:     [400, 240, 110, 0],
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
  camAlto:    2.5,     // altura SOBRE LA LADERA (no sobre el horizonte)
  camYawSigue:0,       // ►CÁMARA FIJA (Toni, v12: "cuando giras NO te siga;
                       // estática, fija detrás"). A 0 la cámara mira SIEMPRE la
                       // línea de máxima pendiente y la tabla gira debajo —
                       // el encuadre no rota nunca. (0,55 era el término medio
                       // anterior; se deja el knob por si cambia de idea.)
  camYawLag:  3.2,     // rad/s con que persigue ese ángulo: suaviza el barrido
  camPitch:   7,       // picado propio SOBRE la pendiente local
  camSlopeK:  0.94,    // ►CUÁNTO de la pendiente local hereda el picado.
                       // Contraintuitivo: hay que heredar CASI TODA. Si heredas
                       // poco, en una ladera de 42° la cámara "de detrás" cae
                       // dentro del monte, el barrido la empuja arriba y acabas
                       // en vista de dron (medido: 16 u por encima del jinete).
                       // Heredando casi toda, la cámara va PARALELA a la ladera
                       // y se queda al hombro. El picado propio es el pequeño.
  camSlopeBase:30,     // sobre cuántas unidades se mide esa pendiente. Con 3 (la
                       // que usa la IA) un lomo la disparaba y en el fuera pista
                       // la cámara se iba a cenital.
  camPitchMin:9 * RAD,
  camPitchMax:50 * RAD,   // en fuera pista (42°) tiene que poder acompañar
  camDist:    13,      // ← al hombro, "un pelín" más lejos (Toni, v12).
                       // La rueda del ratón sigue moviendo esto.
  camDistMin: 6,
  camDistMax: 20,
  camDistFast:3.2,     // ►PERSPECTIVA CON LA VELOCIDAD (Toni, 9/08): "contra más
                       // velocidad más se aleja la cámara, pero tampoco
                       // demasiado". 13 → 16,2 u a tope: un 25%, se nota y no
                       // te deja al jinete de miniatura. En la v12 estaba a 0
                       // porque el que alejaba de verdad era el FOV (+28°); ese
                       // ya está en +7, así que ahora el trabajo lo hace la
                       // distancia, que es lo que da perspectiva de verdad.
  camAireY:   0.55,    // cuánto sigue la MIRA al jinete cuando VUELA
  camAireMax: 12,      // tope de subida. Con 26 y aplicándolo también a la
                       // POSICIÓN de la cámara, un lomo cualquiera la mandaba
                       // 16 u hacia arriba: medido, 25 u sobre el jinete y el
                       // personaje fuera de cuadro por abajo. La cámara se
                       // queda donde está y lo que sube es la MIRA.
  camAireLag: 3.5,     // suavizado (rad/s): sin él, cada bache da un tirón
  camLookAhead: 5.5,   // a cámara corta hay que mirar MENOS lejos o el jinete
                       // se va al borde inferior del encuadre (medido: con 9
                       // salía cortado por abajo)
  camLookY:   1.3,     // mira más bajo que la cámara ⇒ "un poco picada"
  camLookMix: 0.5,     // el punto de mira se queda a media altura entre yo y el
                       // suelo de allí; apuntar al suelo de una pared de 42°
                       // manda la cámara a mirarse los pies
  camLag:     11.0,    // más pegada = "te sigue" de verdad
  fovBase:    58,
  fovSpeed:   7,       // era 28: el "zoom out" que se sentía al correr
  shakeSpeed: 0.10,    // Toni: "no quiero que todo vibre tantísimo". Era 0,55
                       // y a tope de velocidad la imagen no paraba quieta.
  leash:      70,
  orbitaOn:   false,   // ►SIN ÓRBITA (Toni, v12: "que no puedas rotarla").
                       // Ratón y stick derecho quedan muertos; la RUEDA (zoom) vive.
  orbSpeed:   2.3,     // rad/s del stick derecho (con orbitaOn). Q/E ya no: son los CANTOS
  orbMouse:   0.0042,  // rad por píxel de ratón (con orbitaOn)
  orbLibre:   true,    // el ratón rota SIN arrastrar (con orbitaOn)
  orbYawMax:  75 * RAD,// cuánto se puede girar la vista a cada lado
  zoomPaso:   2.2,     // unidades por muesca de rueda
  orbPitchMin:-24 * RAD,
  orbPitchMax: 48 * RAD,
  /* ►GOLPE DE CÁMARA. La mitad de la sensación de un juego de tabla está en
     que la cámara ACUSA el aterrizaje: se hunde de golpe y rebota. Sin esto,
     caer de una rampa grande y de un bordillo se ven exactamente igual. */
  kickLand:   0.09,    // hundimiento por unidad de impacto normal
  kickMax:    1.9,     // tope del hundimiento
  kickCrash:  1.4,     // el que mete un choque
  kickSpring: 150,     // rigidez del muelle que la devuelve
  kickDamp:   13,      // amortiguación (por debajo del crítico = rebota una vez)
  kickFov:    3.0,     // tirón de FOV al aterrizar fuerte

  orbHold:    1.2,     // s parado antes de volver sola detrás
  orbBack:    2.4,     // velocidad de recentrado
  camMinH:    2.2,     // la cámara nunca baja de esto sobre el suelo (ni ella
                       // ni NINGÚN punto entre ella y el jugador)

  /* --- efecto de velocidad --- */
  streakN:    150,    // Con 340 se leían como arañazos blancos sobre el cielo
  streakFrom: 0.45,   // liso; y arrancaban demasiado pronto.
  /* ►POLVO AMBIENTE (Toni: "me falta más polvo en el aire o ambiente").
     Motas que derivan con el viento alrededor de la cámara, SIEMPRE — no solo
     al carvear. Baratas: 1 InstancedMesh, reciclado por caja envolvente. */
  polvoN:     240,    // Toni: "sensación de tormenta de arena, no tan fuerte"
  polvoOp:    0.17,
  polvoCaja:  70,     // radio de la caja de reciclado alrededor de la cámara
  polvoViento:16,     // u/s de deriva lateral
  polvoCae:   1.1,    // u/s de caída. En arena es casi 0 (el polvo FLOTA); la
                      // piel de nieve lo sube a 7 y las mismas motas pasan a
                      // ser una nevada. Ver el bloque de K por piel.
  polvoTam:   [0.05, 0.18],   // radio mín/máx de la mota
  rafagasN:   26,     // VELOS de arena: láminas largas translúcidas cruzando
  rafagasOp:  0.085,
  /* ►TÚNEL. Toni pidió "más efecto túnel donde se blurrea lo que tienes
     alrededor" y MENOS vibración. Las dos cosas van juntas: la sensación de
     velocidad la da el desenfoque de la periferia, no zarandear la cámara.
     Se hace con una capa DOM sobre el canvas (backdrop-filter + máscara
     radial): cuesta 0 en el pipeline 3D y desenfoca de verdad. */
  blurMax:    7.0,    // px de desenfoque en el borde a tope de velocidad
  blurDesde:  0.30,   // fracción de velocidad a la que empieza
  blurCentro: 0.34,   // radio del "ojo" limpio (0..1 de la pantalla)

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
  /* ►POSTURA AL CRUZAR LA TABLA. Toni: "cuando se gira mucho debe cambiar la
     animación y ponerse de lado con la tabla como si frenase". No hay clip de
     carve, pero no hace falta: lo que hace un rider de verdad es dejar que la
     TABLA se cruce mientras el TORSO sigue mirando cuesta abajo. Eso se compone
     girando el modelo en contra del board, y se lee exactamente como un
     frenazo. Se suma agacharse y tumbarse hacia dentro de la curva. */
  crouchYaw: -Math.PI/2,  // ►corrección de los clips de crouch (ver ►EL CROUCH
                          // VENÍA GIRADO 90° en la postura procedural)
  torsoSigue: 0.80,    // cuánto se queda el torso mirando la bajada (0..1)
  torsoDesde: 0.22,    // rad de giro a partir del cual empieza a notarse
  agachaMax:  0.34,    // cuánto se agacha en el cruce máximo
  tumbaMax:   0.42,    // cuánto se tumba hacia dentro
  wipeMin:    0.9,     // lo que dura como poco la caída antes de levantarse

  /* --- ►CALIDAD ---
     Las sombras y la densidad de decorado son lo caro. Se pueden apagar en
     caliente (DESC.K.sombras = false) y se apagan SOLAS si el juego está en
     calidad Baja. Medido: la escena con todo puesto son ~447 draw calls y
     1,5 M de triángulos, y el mapa de sombras vuelve a dibujar la escena. */
  sombras:    true,
  densRoca:   1.0,     // multiplicador de densidad del pedregal
  densDeco:   1.0,     // ...y del decorado (plantas)
  sombraMap:  1024,

  /* --- sonido --- */
  vol:        0.55,   // volumen maestro del minijuego (0 = mudo)

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
/* ►MAR PLANO. Las zonas del mar tienen `deg:0` — y con eso el mar es plano DE
   VERDAD, sin tocar `baseY`: el perfil de altura es la integral de la pendiente
   de cada banda, así que a pendiente cero la superficie es horizontal y lo
   único que la mueve es el oleaje. Lo que distingue una banda de otra ya no es
   lo inclinada que está sino lo PICADA (bump) y lo ancha que es. */
const ZONA_MAR = {
  calma:     { deg:0, nombre:'MAR EN CALMA', col:0x4fc4e0, hard:0.95, bump:0.8, rock:0.35, ramp:1.15 },
  brisa:     { deg:0, nombre:'BRISA',        col:0x3fb2d8, hard:0.92, bump:1.6, rock:0.55, ramp:1.05 },
  marejada:  { deg:0, nombre:'MAREJADA',     col:0x2f9fc4, hard:0.88, bump:2.6, rock:0.75, ramp:0.95 },
  temporal:  { deg:0, nombre:'TEMPORAL',     col:0x1f7fa4, hard:0.84, bump:3.8, rock:0.95, ramp:0.80 },
};
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
/* ►LA TRAVESÍA DEL MAR SE SORTEA EN CADA PARTIDA. En las pieles de tierra el
   PLAN es una tabla escrita a mano: los mismos tramos, los mismos anchos y los
   mismos raíles siempre (lo aleatorio eran sólo las rocas y las rampas). Toni:
   "randomiza que no sea la misma pantalla". Aquí se sortean el número de
   tramos, su largo, su anchura, el estado de la mar y dónde caen los raíles,
   con la MISMA semilla que ya usa todo lo demás — así dos clientes con la misma
   semilla siguen viendo el mismo mar, que es lo que hará falta para el online.
   La pista sale al DOBLE de ancha que la de tierra (140-400 de semianchura).
   Sin `pipe` ni `parte`: los half-pipes y los espolones son roca, y esto es
   agua abierta. */
const SEED0 = parseInt(_qs.get('semilla') || '', 10) || ((Math.random() * 1e9) | 0);
function planMar(){
  const rng = mulberry32(SEED0 ^ 0x3a17);
  const pick = a => a[(rng() * a.length) | 0];
  const out = [];
  const tramos = 16 + ((rng() * 5) | 0);
  /* se empieza suave y se acaba bravo, pero con altibajos sorteados */
  for(let i = 0; i < tramos; i++){
    const t = i / (tramos - 1);
    const dureza = clamp(t + (rng() - 0.5) * 0.45, 0, 1);
    const z = dureza < 0.28 ? 'calma' : dureza < 0.55 ? 'brisa'
            : dureza < 0.82 ? 'marejada' : 'temporal';
    const b = { z, len: 220 + ((rng() * 160) | 0), hw: 140 + ((rng() * 260) | 0) };
    if(rng() < 0.34) b.rail = { x: ((rng() * 2 - 1) * 40) | 0, largo: 100 + ((rng() * 60) | 0) };
    out.push(b);
  }
  /* el último tramo, ancho y en calma: la meta se ve venir */
  out.push({ z:'calma', len:260, hw:340 });
  return out;
}
const PLAN_TIERRA = [
  /* HUECOS Y TÚNELES RETIRADOS a peticion de Toni ("quita los precipicios y
     los túneles de momento"). El código de ambos sigue vivo y probado: basta
     volver a poner `hueco:N` o `tunel:true` en un tramo para recuperarlos. */
  { z:'verde', len:260, hw:70  },
  { z:'azul',  len:240, hw:88,  rail:{ x:0,   largo:110 } },
  { z:'azul',  len:200, hw:120, pipe:'full' },                 // HALF-PIPE
  { z:'roja',  len:280, hw:150, rail:{ x:-14, largo:120 } },
  { z:'roja',  len:240, hw:60  },                              // embudo
  { z:'negra', len:300, hw:110, parte:{ largo:230, alto:26 } }, // dos rutas
  { z:'negra', len:260, hw:150, pipe:'right' },                // QUARTER dcho
  { z:'verde', len:220, hw:170, rail:{ x:8, largo:110 } },     // respiro
  { z:'fuera', len:340, hw:200 },
  { z:'fuera', len:260, hw:130, rail:{ x:-22, largo:120 } },
  { z:'roja',  len:280, hw:70  },                              // pasillo de giro
  { z:'roja',  len:260, hw:150, rail:{ x:20, largo:120 } },
  { z:'negra', len:320, hw:120, parte:{ largo:250, alto:30 } },
  { z:'negra', len:280, hw:170, pipe:'left' },                 // QUARTER izdo
  { z:'azul',  len:240, hw:74,  pipe:'full' },                 // HALF-PIPE estrecho
  { z:'azul',  len:260, hw:90,  rail:{ x:16, largo:130 } },
  { z:'roja',  len:300, hw:150, rail:{ x:-18, largo:130 } },
  { z:'roja',  len:260, hw:80  },                              // último pasillo
  { z:'negra', len:300, hw:140 },
  { z:'verde', len:280, hw:190 },
  { z:'verde', len:220, hw:210 },
];

let PLAN = MAR ? planMar() : PLAN_TIERRA;
const BANDS = [], HUECOS = [], PARTES = [], TUNELES = [], RAILES = [], PIPES = [];
/* ►EL TRAZADO SE REGENERA AL CAMBIAR DE PIEL. Antes esto era un bloque suelto
   que corria UNA vez al cargar el fichero, porque la piel venia de la URL y no
   cambiaba nunca. En la campana el descenso aparece TRES veces (sandboard,
   surf y snowboard), asi que hay que poder rehacerlo. Los arrays son los MISMOS
   objetos (medio fichero los tiene capturados por referencia): se vacian y se
   rellenan, nunca se sustituyen. */
function construyePlan(){
  BANDS.length = HUECOS.length = PARTES.length = TUNELES.length = RAILES.length = PIPES.length = 0;
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
    /* ►HALF-PIPES Y QUARTER-PIPES: no son props, son TERRENO. Los muros
       curvos se suman a terrainY, así que la física (gravedad proyectada,
       normales, carve subiendo la pared y volviendo) sale GRATIS del modelo
       que ya existe — igual que las hondonadas. `full` = canal con dos muros;
       `left`/`right` = un solo muro (quarter). */
    if(t.pipe) PIPES.push({ tipo: t.pipe,
                            z0: z - t.len*0.14, z1: z - t.len*0.86,
                            W: clamp(t.hw * 0.62, 32, 78), D: 13 });
    z -= t.len;
  }
  K.len = -z;
}
construyePlan();

function bandIdx(z){
  if(z >= 0) return 0;
  let i = 0;
  while(i < BANDS.length - 1 && z <= BANDS[i].z1) i++;
  return i;
}
/* Propiedad de zona en z, con las transiciones suavizadas en K.zoneBlend.
   En el borde exacto sale la media de las dos bandas: continuo pero corto. */
let ZN = MAR ? ZONA_MAR : ZONA;   // ►MAR: las bandas del mar son estados de la mar, no pendientes
function zoneProp(z, key){
  const i = bandIdx(z), b = BANDS[i], B = K.zoneBlend;
  let v = ZN[b.tipo][key];
  if(i < BANDS.length - 1){
    const d = z - b.z1;
    if(d < B){ const t = 0.5 + 0.5 * smooth(Math.max(0, d) / B); return lerp(ZN[BANDS[i+1].tipo][key], v, t); }
  }
  if(i > 0){
    const d = b.z0 - z;
    if(d < B){ const t = 0.5 + 0.5 * smooth(Math.max(0, d) / B); return lerp(ZN[BANDS[i-1].tipo][key], v, t); }
  }
  return v;
}
function zoneAt(z){ return ZN[BANDS[bandIdx(z)].tipo]; }

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
  if(f <= 0) return (z - HZ0) * Math.tan(ZN[BANDS[0].tipo].deg * RAD);
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
/* Todo lo que aquí es un campo de PAL estaba antes ESCRITO A FUEGO en beige
   dentro de buildScene (la luz de relleno, los tres halos del sol, el tinte de
   atardecer de las nubes, el labio del kicker, los jalones, la meta). Con una
   sola piel no molestaba; con dos, cada uno de ellos es un cuerpo extraño en la
   otra — un labio marrón chocolate sobre nieve, o una meta BLANCA sobre nieve,
   que directamente desaparece. Los valores de `arena` son exactamente los que
   había, así que esta piel no cambia ni un píxel. */
const SKINS = {
  /* ►HORA DORADA. El diagnóstico era "beige sobre beige": luz de mediodía
     sin carácter. Misma escena, sol BAJO y cálido: cielo naranja→azul, niebla
     cálida, sombras largas. Es UNA decisión de dirección de arte, no assets. */
  arena: { sky:0xffc98c, sky2:0x7ea6d8, fog:0xf0be84,
           soft:0xf2d5a2, hard:0xb8854a, wall:0xc08a52, wall2:0x936741,
           rock:0x8f6f48, ramp:0xb06e2e, part:0xe8c896, trail:0xb8905c,
           valley:0xe0b47e, ridge:0xcf9f6d, sun:0xffc37a, hemi:0xffd9b0, zmix:0.0,
           fogNear:190, fogFar:700,
           sunInt:1.3, sunPos:[-85, 42, 30], hemiBajo:0x4a4e66, hemiInt:0.42,
           fill:0xffe0c0, fillInt:0.28,
           solDir:[-0.62, 0.20, -0.76], csol:[0xfff2d0, 0xffce8e, 0xffb870],
           nubeCal:[0.985, 0.96, 0.09, 0.22],   // [verde, azul] base y cuánto se tiñen de naranja las BAJAS
           lip:0x33302c, jalon:0xff8a3d, meta:0xffffff,
           rail:0xd8dee8, railPoste:0x8a94a4,
           picos:null, rocasLejos:null, tinteRoca:null, tintePico:null, relieve:1.0 },

  /* ►DESCENSO NEVADO. La piel de arena vende su carácter con la HORA (sol bajo
     y cálido); la de nieve NO puede hacer lo mismo, porque un sol rasante sobre
     una superficie de albedo ~0,9 lo satura todo a blanco y la montaña deja de
     tener forma. Aquí el carácter lo pone lo contrario: MAÑANA ALTA Y FRÍA, con
     el sol menos dominante (1,3 → 1,05) y el hemisférico MUY subido (0,42 →
     0,72), que es el rebote real de la nieve — la luz que te llega en una pista
     de verdad viene del suelo tanto como del sol. Y con el suelo casi blanco,
     lo que dibuja el relieve ya no puede ser el albedo: son las SOMBRAS AZULES
     (el suelo del hemisférico, 0x2f4a72, bastante más saturado que el de
     arena), que es exactamente como se lee la nieve a ojo. */
  nieve: { sky:0xeaf4ff, sky2:0x5f9fda, fog:0xd8e9f7,
           soft:0xffffff, hard:0xa9c6de, wall:0x8496a8, wall2:0x5d6d7d,
           rock:0x74879a, ramp:0xdcecf8, part:0xffffff, trail:0xbcd6ea,
           valley:0xc6dced, ridge:0xa4bcd2, sun:0xfff6e8, hemi:0xdcecff, zmix:0.0,
           /* la niebla entra ANTES y llega más lejos: la calima de una montaña
              nevada come el fondo mucho antes que el aire seco del desierto, y
              es lo que despega la pista de las cumbres del telón */
           fogNear:150, fogFar:820,
           sunInt:1.05, sunPos:[-70, 78, 40], hemiBajo:0x2f4a72, hemiInt:0.72,
           fill:0xdcecff, fillInt:0.34,
           solDir:[-0.50, 0.42, -0.76], csol:[0xffffff, 0xeaf4ff, 0xcfe4f7],
           nubeCal:[1.0, 1.02, 0.0, 0.0],       // nubes FRÍAS: azul por encima del rojo y sin viraje cálido
           lip:0x2b4a63, jalon:0xff8a3d, meta:0xd8452f,
           rail:0xd8dee8, railPoste:0x8a94a4,
           /* ►TELÓN DE CUMBRES y ►SEGUNDA FILA: los assets de montaña del mapa
              de hielo (s6_peak/s6_peak2), usados como los usa el juego. */
           picos:['s6_peak', 's6_peak2'],
           rocasLejos:['s6_peak', 's6_peak2'],
           /* las rocas del juego vienen horneadas en color ARENA: sin retintar,
              una pista nevada sale con peñascos ocre. Ver `opts.tinte`. */
           tinteRoca:0x8ea2b4, tintePico:0xe6f0f8, relieve:1.6 },

  mar:   { sky:0xa8e8f5, sky2:0x4fb0d8, fog:0x76cde2,
           soft:0x4fc4e0, hard:0x14647f, wall:0x4a6b78, wall2:0x37525d,
           rock:0x40606d, ramp:0xcdf6ff, part:0xeafcff, trail:0x8fe0f0,
           valley:0x2f9fc4, ridge:0x4a8fa8, sun:0xfffbe8, hemi:0xbfeef8, zmix:0.0,
           fogNear:190, fogFar:700,
           sunInt:1.3, sunPos:[-85, 42, 30], hemiBajo:0x4a4e66, hemiInt:0.42,
           fill:0xffe0c0, fillInt:0.28,
           solDir:[-0.62, 0.20, -0.76], csol:[0xfff2d0, 0xffce8e, 0xffb870],
           nubeCal:[0.985, 0.96, 0.09, 0.22],
           lip:0x33302c, jalon:0xff8a3d, meta:0xffffff,
           rail:0xd8dee8, railPoste:0x8a94a4,
           picos:null, rocasLejos:null, tinteRoca:null, tintePico:null, relieve:1.0 },
};
let PAL = SKINS[SKIN] || SKINS.arena;

/* =====================================================================
   ►OLA — EL MAR ES MAR, no una ladera pintada de azul

   Toni: "el agua está en forma de montañas; haz un mar con oleaje que afecte a
   los jugadores con la física del oleaje, espuma, movimientos más resistidos
   por la fricción del agua".

   La pieza que lo hace posible es que en este juego TODO el terreno es
   analítico: `terrainY(x,z)` es la única fuente de verdad y de ella cuelgan la
   normal (`surfaceAt`), la huella de la tabla (`padY`), el despegue y la fuerza
   normal. Así que basta con que en la piel de mar los lomos de RUIDO (que son
   las "montañas") los sustituya una suma de olas que VIAJAN con el tiempo:
     · subes y bajas con la ola porque el suelo sube y baja,
     · la cara de la ola te acelera o te frena porque la normal se inclina,
     · una ola que se va de debajo de la tabla te LANZA — eso ya lo hacía el
       terreno cuando "cae más rápido de lo que la gravedad te baja",
     · y pesas más en el valle y menos en la cresta (`nForce`), que es
       exactamente lo que hace una ola de verdad.
   Nada de eso hay que programarlo aparte: sale de mover el suelo.

   La misma fórmula va en el VERTEX SHADER de la malla (ver oleGLSL) para que lo
   que se ve y lo que se pisa sean lo mismo. Los números viven aquí y se
   inyectan al GLSL: hay dos implementaciones, pero UNA sola tabla de valores.
   ===================================================================== */
/* cada ola: amplitud, longitud de onda, dirección (dx,dz normalizada) y
   velocidad de avance. La dominante viaja hacia +z, o sea DE CARA al rider (que
   baja hacia -z): es la que se surfea. Las otras dos cruzan para que el mar no
   sea un acordeón de líneas rectas. */
/* ►LAS OLAS SE MIDEN POR SU CURVATURA, NO POR SU ALTURA. Primera tirada con
   longitudes de 96/57/34/17 u: el rider se pasaba el **66% del tiempo volando**
   (medido), que es justo la "cama elástica" que este juego ya sufrió una vez
   (ver K.airThr). La culpa no era la altura sino las olas CORTAS: al cruzar un
   campo de olas a 57 u/s, la aceleración vertical que te exige el suelo es
   v²·(A·k²), y con k grande eso se dispara — la de 17 u sola pedía 156 u/s²
   contra los 135 del umbral de despegue. Con olas largas y el rizado bajito la
   suma queda en ~50 u/s² a velocidad de crucero: el mar te mece, y sólo te
   lanza cuando varias crestas se alinean o vas muy rápido. Que es lo suyo. */
/* ►EL SENTIDO DE LA OLA DOMINANTE SE MIDIÓ TAMBIÉN. Viajando DE CARA (+z) el
   rider se pasa la vida subiendo caras y la velocidad media se quedó en 24 u/s
   contra los 57 de la piel de arena: remar contra el mar es realista y un peñazo.
   Viajando HACIA -z, o sea EN TU MISMA DIRECCIÓN y más despacio que tú, la
   alcanzas y bajas por su cara delantera: eso es surfear una ola. Las cruzadas
   sí vienen de costado, que es lo que impide que el mar sea un tobogán liso. */
const OLAS = [
  { amp: 1.15, lon: 250, dx:  0.00, dz: -1.00, vel: 20 },   // mar de fondo, va contigo: la que se surfea
  { amp: 0.60, lon: 140, dx:  0.52, dz:  0.85, vel: 16 },   // cruzada, de cara
  { amp: 0.24, lon: 110, dx: -0.70, dz:  0.71, vel: 12 },   // cruzada al otro lado
  { amp: 0.05, lon:  55, dx:  0.30, dz:  0.95, vel:  8 },   // rizado
  /* ►BACHES (Toni: "sensible al aire por el mero hecho de coger baches y de
     golpe tener un cambio de rasante"). Sin estas dos, MEDIDO: la velocidad
     vertical del suelo bajo la tabla iba de -1,9 a +12 — o sea, el mar sólo
     empujaba hacia arriba y no había un solo cambio de rasante en toda la
     bajada, por bajo que pusiera el umbral de despegue. Son cortas y bajitas: lo
     que aportan es CURVATURA (que es lo que despega), no altura. */
  { amp: 0.16, lon:  60, dx: -0.45, dz:  0.89, vel: 10 },
  { amp: 0.10, lon:  34, dx:  0.62, dz:  0.78, vel:  7 },
  /* NO HAY OLAS MÁS CORTAS, y esto se decidió con dos números. Probé un rizado
     de 26 y 15 u para dar textura de agua: (1) NO SE VE — la malla tiene ~8,5 u
     por fila y no puede representar una onda de 15; y (2) el término v²·A·k²
     que decide si despegas es proporcional a k², así que esas dos aportaban más
     curvatura ellas solas que las cuatro grandes juntas: el rider volvía a
     pasarse el 44% del tiempo por los aires. La textura fina del agua, si hace
     falta, va por color en el fragment, no por geometría. */
];
const OLA = {
  alto:    3.6,    // AMPLITUD GENERAL (u). Sube esto y el mar se pica entero
  /* con el mar PLANO la cámara lo mira casi de canto y las crestas se apilan
     unas sobre otras: con espumaK 0,95 el mar de media distancia salía lechoso,
     como si hubiera niebla. Menos espuma y sólo en lo alto de la cresta. */
  cresta:  0.60,   // por encima de esta fracción de la cresta hay ESPUMA
  espumaK: 0.55,   // cuánta espuma (0 = nada, 1 = crestas blancas del todo)
};
/* altura del oleaje en (x,z) en el instante t. `zoneProp(z,'bump')` ya decía
   cuánto relieve toca en cada banda de la pista: aquí eso pasa a ser LO PICADO
   que está el mar en esa zona, así que el mar se encrespa en las bandas duras
   igual que la nieve se hacía rugosa. */
/* ►SETS — LAS OLAS GRANDES QUE SE SURFEAN (Toni: "que de vez en cuando se
   generen olas en dirección a la marcha del jugador para subirse"). Son crestas
   MUCHO más altas que el oleaje de fondo, largas y separadas, que viajan hacia
   -z igual que tú pero más despacio: las alcanzas por detrás, subes por su cara
   trasera y sales lanzado por la cresta. Cada una es una campana en z, así que
   entre set y set el mar sigue siendo el de siempre.
   `SET.sep` es la distancia entre olas y `SET.vel` lo que corren: con vel menor
   que tu velocidad de crucero (~48) siempre acabas alcanzándolas. */
/* MEDIDO: con alto 5,2 y ancho 46 la ola grande existía (el perfil iba de -4,4
   a +6,5) pero su cara tenía 9,6° — una loma, no una ola: ni se sube ni lanza.
   Estrechándola a 18 la cara sube a ~20°, que ya se surfea y, a velocidad de
   crucero, te despide por la cresta. */
const SET = { alto: 7.0, ancho: 18, sep: 560, vel: 26, fase: 0.37 };
function setY(z, t){
  /* posición de la cresta más cercana: las olas están cada `sep` y todas se
     desplazan a la vez (un tren), así que basta con el resto de la división */
  const d = ((z + SET.vel * t + SET.fase * SET.sep) % SET.sep + SET.sep) % SET.sep;
  const u = (d - SET.sep * 0.5) / SET.ancho;          // 0 en la cresta
  if(u < -1.6 || u > 1.6) return 0;
  const c = Math.cos(u * (Math.PI / 2 / 1.6));
  return SET.alto * c * c * c;                        // campana con faldas suaves
}
function olaY(x, z, t){
  let y = 0;
  for(let i = 0; i < OLAS.length; i++){
    const o = OLAS[i], k = TAU / o.lon;
    y += o.amp * Math.sin(k * (x * o.dx + z * o.dz) - k * o.vel * t);
  }
  return y * OLA.alto + setY(z, t);
}
/* Para la espuma NO vale la cresta teórica (la suma de todas las amplitudes):
   esa altura exige que las cuatro olas se alineen y casi nunca pasa, así que
   normalizando por ella la espuma no aparecía. La cresta TÍPICA de una suma de
   senos independientes es la RMS. */
const OLA_AMP = Math.sqrt(OLAS.reduce((s, o) => s + o.amp * o.amp, 0)) * OLA.alto;
/* EL MISMO oleaje, en GLSL, generado desde la MISMA tabla: la malla se desplaza
   en el vertex shader (coste 0 en CPU sobre ~73.000 vértices) y la física lo
   evalúa en CPU sólo en los cuatro riders. Si esto se toca, se toca la tabla
   OLAS, no el texto del shader. Escribe `_ola` (altura) y `_dx`/`_dz` (las
   derivadas, para la normal analítica). */
function olaGLSL(fuenteP){
  let s = '';
  for(const o of OLAS){
    const k = (TAU / o.lon).toFixed(6);
    s += `{ float f = ${k} * (P.x * ${o.dx.toFixed(4)} + P.z * ${o.dz.toFixed(4)}) - ${(TAU / o.lon * o.vel).toFixed(6)} * uTime;
           _ola += ${o.amp.toFixed(4)} * sin(f);
           _dx  += ${o.amp.toFixed(4)} * ${k} * ${o.dx.toFixed(4)} * cos(f);
           _dz  += ${o.amp.toFixed(4)} * ${k} * ${o.dz.toFixed(4)} * cos(f); }\n`;
  }
  /* el SET (la ola grande que se surfea) va aparte porque ya viene en unidades
     de mundo: se le aplica `aOla` pero NO la amplitud general del oleaje */
  const kU = (Math.PI / 2 / 1.6).toFixed(6);
  return `float _ola = 0.0, _dx = 0.0, _dz = 0.0, _set = 0.0, _setD = 0.0;
          { vec3 P = ${fuenteP || 'position'};
          ${s}
            float d = mod(P.z + ${SET.vel.toFixed(3)} * uTime + ${(SET.fase * SET.sep).toFixed(3)}, ${SET.sep.toFixed(1)});
            float u = (d - ${(SET.sep * 0.5).toFixed(2)}) / ${SET.ancho.toFixed(2)};
            if(abs(u) < 1.6){
              float c = cos(u * ${kU});
              _set  = ${SET.alto.toFixed(3)} * c * c * c;
              _setD = -3.0 * ${SET.alto.toFixed(3)} * c * c * sin(u * ${kU}) * ${kU} / ${SET.ancho.toFixed(2)};
            }
          }
          _ola = (_ola * ${OLA.alto.toFixed(4)} + _set) * aOla;
          _dx  *= ${OLA.alto.toFixed(4)} * aOla;
          _dz  = (_dz * ${OLA.alto.toFixed(4)} + _setD) * aOla;`;
}
const OLA_U = { uTime: { value: 0 } };   // el reloj del mar, compartido por los materiales de agua

/* Parche del material del mar: desplaza los vértices con el oleaje, rehace la
   normal ANALÍTICAMENTE (con diferencias finitas en el shader habría que
   muestrear tres veces) y pinta ESPUMA en las crestas.
   La normal se compone en el terreno del GRADIENTE, no de la normal: una altura
   h(x,z) tiene normal (-dh/dx, 1, -dh/dz), así que se pasa la normal horneada
   de la malla a gradiente, se le SUMA el de la ola y se vuelve a normalizar.
   Sumar normales sin más habría aplanado la pendiente de la pista. */
/* `ancla` = el objeto FLOTA ENTERO con la ola de un punto fijo (su amarre) en
   vez de deformarse con la ola de cada vértice. Es lo que necesitan los kickers:
   su física ya se movía con la ola (rampSurfaceY llama a terrainY, que es
   dinámico) mientras su malla se había horneado una vez — de ahí que Toni
   "pasara por debajo de los kickers". Con el ancla, malla y física vuelven a ser
   lo mismo. */
function aplicaOlaShader(mat, ancla){
  mat.onBeforeCompile = sh => {
    sh.uniforms.uTime = OLA_U.uTime;
    sh.vertexShader = `attribute float aOla;
      ${ancla ? 'attribute vec2 aAncla;' : ''}
      uniform float uTime;
      varying float vEspuma;
      ` + sh.vertexShader.replace('#include <beginnormal_vertex>', `
      #include <beginnormal_vertex>
      ${olaGLSL(ancla ? 'vec3(aAncla.x, 0.0, aAncla.y)' : 'position')}
      ${ancla ? '' : `{
        float ny = max(0.0001, objectNormal.y);
        float gx = -objectNormal.x / ny + _dx;
        float gz = -objectNormal.z / ny + _dz;
        objectNormal = normalize(vec3(-gx, 1.0, -gz));
      }`}`).replace('#include <begin_vertex>', `
      #include <begin_vertex>
      transformed.y += _ola;
      /* ESPUMA: en la cresta (la ola alta) y donde la cara se empina, que es
         donde el agua rompe de verdad */
      /* ►LA ESPUMA SE MIDE CONTRA LA OLA DE SU ZONA, no contra la mayor del
         mapa. Normalizando por la amplitud global, en la pista (donde aOla ≈
         0,55) el numerador ya venía multiplicado por aOla y la espuma salía
         prácticamente nula: se comprobó pintándola de verde y sólo teñía las
         laderas. Dividiendo por aOla, "estar en la cresta" significa lo mismo
         en mar picado que en mar calmo. */
      ${ancla ? 'vEspuma = 0.0;' : `float _rel  = (_ola / max(0.15, aOla)) / ${OLA_AMP.toFixed(4)};
      float _pend = clamp(length(vec2(_dx, _dz)) * 5.5, 0.0, 1.0);
      vEspuma = clamp(smoothstep(${OLA.cresta.toFixed(3)}, 1.05, _rel) * 0.9 + _pend * _pend * 0.55, 0.0, 1.0)
                * ${OLA.espumaK.toFixed(3)};`}`);
    sh.fragmentShader = 'varying float vEspuma;\n' + sh.fragmentShader
      .replace('#include <color_fragment>', `#include <color_fragment>
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 1.0, 1.0), vEspuma);`);
  };
  /* dos materiales con el mismo parche comparten programa; los DOS MODOS tienen
     firmas distintas o three les daría el mismo programa compilado */
  mat.customProgramCacheKey = () => (ancla ? 'descOlaAncla1' : 'descOla1');
}

/* ►AJUSTES DE K POR PIEL. El polvo de arena y la nevada son el MISMO sistema
   (motas recicladas por caja alrededor de la cámara); lo que cambia es cómo se
   mueven, y eso son tres números. Una mota de arena flota y deriva con el
   viento; un copo CAE. Los velos largos ("ráfagas") también valen tal cual:
   sobre nieve leen como ventisca a ras de suelo, que es justo lo que hay en una
   pista. Se suben en número y se bajan en opacidad. */
/* ►OLA · EL AGUA FRENA. Toni: "movimientos más resistidos por la fricción del
   agua". No es un multiplicador global (eso solo haría el mar lento y aburrido):
   es que en el agua lo que se paga es MOVERSE DE LADO. La tabla se desliza casi
   igual hacia delante y en cambio el derrape y el canto tienen que empujar
   agua, y a poca velocidad el casco se hunde y te para.
     · dragC algo mayor: el agua opone más que el aire a igualdad de velocidad.
     · muBase el doble: es el rozamiento que se lleva la velocidad residual.
     · skidDrag arriba: cruzarte en el agua te clava, no te desliza.
     · grip un poco menor: el canto en agua agarra menos que en nieve prensada.
   Todo esto se MIDE después (velocidad de equilibrio y tiempo de bajada), que
   es como se calibró la piel original. */
function _tweaksMar(){
  /* CALIBRADO CONTRA LA PIEL DE ARENA, no a ojo: con dragC 0,0056 y muBase 2,2
     la media se quedaba en 24 u/s contra 57 (menos de la mitad) y el mar era
     un barrizal. Estos valores buscan un mar ~15% más lento que la arena. */
  K.dragC     = 0.0048;
  K.muBase    = 1.5;
  K.skidDrag  = (K.skidDrag || 0.5) * 1.45;
  K.grip      = 112;
  K.dragSoft  = 1.35;    // el "material" del mar apenas varía: no hay nieve profunda
  K.dragHard  = 0.75;
  K.chatSube  = (K.chatSube || 0) * 0.5;   // el castañeteo es de tabla dura sobre hielo, no de agua
  /* UNA TABLA SOBRE AGUA PLANEA. En la zona rápida (equilibrio 59 u/s) el rider
     salía despedido en el 60% de los frames: cruzar un campo de olas a esa
     velocidad exige al suelo una aceleración v²·(A·k²) que se come el umbral de
     despegue. Que en agua cueste más despegar no es un parche: es lo que hace
     la sustentación de una tabla planeando. */
  /* ►SENSIBLE AL AIRE (Toni): "más flotabilidad por el mero hecho de coger
     baches y de golpe tener un cambio de rasante". El umbral de despegue es
     justo eso: cuánto tiene que caer el suelo bajo la tabla para que te vayas
     al aire. 4,2 (mar con pendiente) y 2,9 lo hacían tan difícil que la bajada
     entera salía con 0% de vuelo; a 1,5 —POR DEBAJO del 2,6 de la nieve, porque
     aquí tiras de una vela que te sostiene— cualquier rasante te despega. */
  K.airThr    = 0.55;
  K.airMin    = 0.5;   // ...y basta menos velocidad vertical para que cuente como vuelo
  /* ►MAR PLANO: sin pendiente no hay cuenco que te devuelva (el límite lo
     marcan los arrecifes de los lados, decisión de Toni) y tampoco hace falta
     la inclinación falsa: ahora quien empuja es el VIENTO. */
  K.bowl      = 0;
  K.tilt      = 0;
}

/* ►VIENTO — EL MOTOR DEL MAR (decisión de Toni: "te hace avanzar el viento que
   mueve el kite"). En las pieles de tierra lo que te mueve es la gravedad
   proyectada en la pendiente; aquí el suelo es horizontal, así que el empuje lo
   pone la vela: tira en el eje del board, a tope cuando apuntas a donde sopla y
   dejando lo justo cuando vas ceñido. Además el kite te SOSTIENE: en el aire
   pesas menos y al despegar tira un poco hacia arriba. */
const VIENTO = {
  fuerza:  16,     // u/s² con el board alineado con el viento (equilibrio ~48 u/s con el roce del agua)
  cenida:  0.34,   // fracción del empuje que queda yendo de través
  /* ►FLOTABILIDAD (Toni). Colgado de una vela no se cae como una piedra: la
     gravedad en el aire se queda en un tercio, y encima el kite tira hacia
     arriba durante el primer tramo del vuelo. Con 0,55 los saltos duraban un
     suspiro y "pasabas por debajo de los kickers" en vez de volar por encima. */
  flota:   0.34,   // gravedad en el aire mientras la vela tira
  subida:  13.0,   // u/s² extra hacia arriba justo tras despegar
  subidaT: 0.80,   // ...durante este tiempo
};

function _tweaksNieve(){
  K.polvoN     = 420;    // más motas: es nevada, no bruma
  K.polvoOp    = 0.55;   // y un copo SE VE (una mota de polvo, no)
  K.polvoCae   = 7.0;    // u/s de caída — lo que separa un copo de una mota
  K.polvoViento= 9;      // ...y menos deriva lateral que el polvo del desierto
  K.polvoTam   = [0.10, 0.16];
  K.rafagasN   = 34;
  K.rafagasOp  = 0.055;
}

/* =====================================================================
   ►APLICAR UNA PIEL EN CALIENTE

   Nacio con la piel FIJA: venia de la URL y se horneaba en consts al cargar el
   fichero. En la campana el descenso aparece TRES veces (sandboard, surf y
   snowboard), asi que hay que poder cambiarla sin recargar la pagina.

   Lo unico delicado son los retoques de K: son MUTACIONES, no una tabla, y no
   se deshacen solas — pasar de nieve a arena dejaria la nevada puesta. Por eso
   se guarda una foto de K ANTES de cualquier retoque y cada cambio de piel
   RESTAURA y vuelve a aplicar. Es exactamente lo que hace `applyStageTheme` del
   juego con `_restoreS1Theme()`, y por el mismo motivo.
   ===================================================================== */
const _K_PIEL = ['airMin','airThr','chatSube','dragC','dragHard','dragSoft','grip','muBase',
                 'skidDrag','tilt','polvoCae','polvoN','polvoOp','polvoTam','polvoViento',
                 'rafagasN','rafagasOp'];
const _KBASE = {};
for(const k of _K_PIEL) _KBASE[k] = Array.isArray(K[k]) ? K[k].slice() : K[k];

function aplicaPiel(p){
  if(!/^(arena|nieve|mar)$/.test(p)) p = 'arena';
  SKIN = p;
  MAR  = (p === 'mar');
  KITE_ON = MAR && _qs.get('kite') !== '0';
  PAL  = SKINS[p] || SKINS.arena;
  ZN   = MAR ? ZONA_MAR : ZONA;
  PLAN = MAR ? planMar() : PLAN_TIERRA;
  construyePlan();      // BANDS/HUECOS/RAILES/PIPES… y K.len
  buildHeights();       // la tabla de alturas cuelga de las bandas nuevas
  for(const k in _KBASE) K[k] = Array.isArray(_KBASE[k]) ? _KBASE[k].slice() : _KBASE[k];
  if(MAR){ _tweaksMar(); K.tilt = 7; }
  else if(p === 'nieve') _tweaksNieve();
}
/* la piel inicial (la de la URL) se aplica ya: hasta ahora estos retoques
   corrian sueltos al cargar el fichero */
aplicaPiel(SKIN);

/* Color de respaldo por hueco. El color BUENO de un corredor es el de su CLASE
   (ver `colorDe` más abajo): es el mismo identificativo que usa el juego para el
   contorno, el puntero y la barra de aguante, así que aquí tiene que ser ese y
   no uno inventado por slot. Esto solo cubre el caso de que la clase no tenga
   color asignado. */
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
/* ►COLOR DE UN CORREDOR = EL DE SU CLASE. El contorno salía con el color del
   HUECO (P1 cian sobre el samurái morado, y así los cuatro): en el juego el
   anillo lo pinta `classColor(p)`, que es la marca de la clase, y esto tenía
   que ser lo mismo. Se lee del juego cuando está disponible (una sola fuente de
   verdad) y si no, del mapa local. */
function colorDe(clase, i){
  if(typeof CLASS_COLOR !== 'undefined' && CLASS_COLOR[clase] != null) return CLASS_COLOR[clase];
  if(CLASE_COL[clase] != null) return CLASE_COL[clase];
  return RACER_COL[i % RACER_COL.length];
}

/* ►PERSONAJE (Toni 27/08): el corredor HUMANO lleva TU personaje, no el samurai de siempre.
   Antes esto era `CLASES[i % CLASES.length]`, y como el humano es el corredor 0 y el samurai
   encabeza la lista, jugabas de samurai hicieras lo que hicieras en la home.
   La clase elegida llega en `opt.clase` (la RUTA la saca de MATCH.cls). Los demas se reparten las
   restantes SIN repetir, el mismo criterio que usa el corro de personajes de la portada.
   Entrando suelto (?descenso, ?tubo) no hay clase: se queda el orden de siempre. */
function claseDe(i){
  const mia = (DESC._clase && CLASES.indexOf(DESC._clase) >= 0) ? DESC._clase : null;
  const orden = mia ? [mia].concat(CLASES.filter(c => c !== mia)) : CLASES;
  return orden[i % orden.length];
}

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
    o.castShadow = true; o.frustumCulled = false;
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
   ►ROCAS Y DECORADO: los assets REALES del juego, multitono

   Toni: "las piedras se ven bastante mal, yo que tú usaría las rocks del
   stage 3 y 4, del western y el desierto" + "haz multitono todos los assets".
   Y tenía razón dos veces: primero eran todas el mismo dodecaedro, y luego mis
   cinco siluetas talladas seguían siendo geometría inventada teniendo el juego
   rocas de desierto hechas (s3_rock, s3_rock2, s3_rock3, s3_rockbig,
   s3_boulder). Aquí no se modela nada: se cogen esas.

   MULTITONO: cada copia recibe un desplazamiento propio de tono, saturación y
   luminosidad SOBRE el color horneado del asset, y además un gradiente vertical
   por vértice (la base más oscura que la cima). Sin eso, veinte copias del
   mismo modelo se leen como veinte calcomanías.
   ===================================================================== */
/* Las rocas de CERCA (borde de la pista y obstáculos). En nieve NO van los
   s6_peak: el juego los usa "SOLO horizonte y abismo, nunca zona jugable" y
   tiene razón — son montañas, y a 6 u de alto se leen como conos de plástico.
   Van las rocas de siempre RETINTADAS en frío (PAL.tinteRoca), que es lo que
   hay debajo de la nieve en una ladera de verdad. Las cumbres se usan donde les
   toca: en la segunda fila (lejos y grandes) y en el telón. */
const ROCAS_POR_PIEL = {
  arena: ['s3_rock', 's3_rock2', 's3_rock3', 's3_rockbig', 's3_boulder'],
  nieve: ['s3_rock', 's3_rock2', 's3_rock3', 's3_boulder'],
  mar:   ['s3_rock', 's3_rock2', 's3_boulder'],
};
/* DECORADO. SOLO cosas que tienen sentido en un desierto: plantas, cactus,
   palmeras y rocas. Nada de alfombras, cofres ni props de interior — el juego
   tiene s3_carpet/s3_rug/s3_rugoriental y NO se usan aquí a propósito.
   `mata` = va también EN MEDIO de la pista (no estorba, se atraviesa);
   `borde`  = solo a los lados, porque es grande y taparía. */
/* `hito` (opcional) = TERCERA capa, rara y a los lados: props con historia que
   aparecen cada mucho y que uno se queda mirando al pasar. En nieve son los tres
   de "encanto" del mapa de hielo (iglú, muñeco, trineo). No van en `borde`
   porque a la densidad de `borde` un muñeco de nieve cada 40 u deja de ser un
   hallazgo y pasa a ser papel pintado. */
const DECOR = {
  arena: { mata:  ['s3_agave', 's3_aloe', 's3_cactusbarrel', 's3_bloom'],
           /* s3_pillar FUERA: Toni lo lee como "atalaya de tierra" y no pega */
           borde: ['s3_cactus', 's3_cactus3', 's3_datepalm', 's3_palm', 's3_palm2',
                   's3_palm3', 's3_palm4', 's3_palm5'] },
  /* SOLO cosas que tienen sentido en una montaña nevada, y todas del mapa de
     hielo: pinos, árboles secos, matojos asomando y cristales de hielo. */
  nieve: { mata:  ['s6_bush', 's6_crystal', 's6_crystal2'],
           borde: ['s6_pine', 's6_deadtrees', 's6_crystal2'],
           hito:  ['s6_igloo', 's6_snowman', 's6_sled'] },
  /* ►MAR · FUERA EL DESIERTO (Toni: "quita las palmeras y las cosas del
     desierto del medio de la pista"). En mar abierto no hay matas: el agua no
     lleva nada plantado, así que `mata` va vacío y la pista queda limpia. A los
     lados, lo que puede haber flotando de verdad: los barcos, botes y muelles
     del stage 12 (los `pq_*` de piratas) y roca de arrecife. */
  mar:   { mata:  [],
           borde: ['s3_rock', 's3_rock2', 's3_boulder'],
           hito:  ['pq_shipsm', 'pq_boat', 'pq_port2', 'pq_port3'] },
};
/* Los cristales del mapa de hielo llevan brillo frío EN EL JUEGO (getModel les
   clona el material y les pone emissive). Aquí se replica: sin él, un cristal
   de hielo sobre nieve blanca es una silueta gris que no se distingue del
   suelo. La clave está en el modelo, no en la piel. */
const EMISIVO = { s6_crystal:[0x16324a, 0.55], s6_crystal2:[0x16324a, 0.55] };

/* Instancia un modelo del juego. Usa el mismo parseo y la misma caché que el
   resto del proyecto: no se inventa un cargador. */
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

/* Mide un modelo para poder apoyarlo en el suelo y escalarlo por altura.
   OJO: la medida que usa `siembra` se calcula AHÍ, sobre la geometría ya
   horneada y RECENTRADA (ver el bloque ►PALMERAS VOLANDO), porque esta de aquí
   devuelve `minY` en el espacio del fichero del modelo y hay props cuya malla
   vive a 280 u de su origen. */
function mideProp(o){
  o.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(o);
  const sz = new THREE.Vector3(); b.getSize(sz);
  return { alto: sz.y || 1, minY: b.min.y, radio: Math.max(sz.x, sz.z) * 0.5 || 1 };
}

/* ►APOYAR UN PROP EN UNA LADERA SIN QUE FLOTE.
   Toni: "las rocas de los laterales no están hundidas en la arena, muchas
   flotan por la inclinación". Exacto, y la causa era apoyarlas en UN SOLO
   punto (el centro): en una pendiente de 26-42° el punto bajo de su huella
   queda muy por debajo del centro, así que medio prop se queda en el aire.
   Aquí se muestrea el terreno en el CENTRO Y EN OCHO PUNTOS de su huella y se
   usa el MÁS BAJO — y encima se hunde una fracción de su tamaño, porque una
   roca de verdad está enterrada, no posada. */
const _OCHO = [[1,0],[0.71,0.71],[0,1],[-0.71,0.71],[-1,0],[-0.71,-0.71],[0,-1],[0.71,-0.71]];
function apoyaEnLadera(x, z, radio, hundir){
  let y = terrainY(x, z);
  for(let i = 0; i < 8; i++){
    const yy = terrainY(x + _OCHO[i][0] * radio, z + _OCHO[i][1] * radio);
    if(yy < y) y = yy;
  }
  return y - (hundir || 0);
}

/* ►MULTITONO SIN PAGARLO EN DRAW CALLS.
   Primer intento: un clon con material propio por roca. Resultado MEDIDO: 912
   rocas = 2.882 draw calls y 1,16 M de triángulos. Injugable.
   La forma correcta es InstancedMesh con `instanceColor`: da un tono distinto
   POR COPIA con UNA sola llamada de dibujo por malla. El multitono queda igual
   de vivo y el coste baja dos órdenes de magnitud.
   Encima se hornea un gradiente vertical en el color de vértice de la
   geometría (compartido): base en sombra, cima al sol. Los dos se multiplican.

   OJO r128 (ya mordió en este proyecto): `instanceColor` NACE con el tamaño de
   `this.count`, así que el InstancedMesh se crea con el cupo TOTAL y solo
   después se recorta `count` a lo realmente usado. */

/* ►TONO POR COPIA (el "multitono"), BIEN HECHO.
   `instanceColor` MULTIPLICA el color del material, así que lo que hay que
   generar es un FACTOR alrededor de 1. Lo que había era
   `setRGB(1,1,1).offsetHSL(dh, ds, dl)` y eso está roto de dos maneras:
     · el blanco tiene luminosidad 1, así que TODO el desplazamiento hacia
       arriba se recorta y la mitad de las copias salían EXACTAMENTE iguales;
     · su saturación es 0, luego su tono es el rojo — subir saturación no
       variaba el color, lo teñía de rojo.
   Por eso Toni no veía multitono por ningún lado aunque el código lo dijera.
   Aquí se hace en RGB directo: luminosidad ±f y temperatura (rojo contra azul,
   en oposición), que es lo que da piedras cálidas y frías en la misma ladera. */
function _tono(rng, out, f){
  f = (f == null) ? 1 : f;
  const l = 1 + (rng() - 0.5) * 0.46 * f;
  const t = (rng() - 0.5) * 0.20 * f;
  out.setRGB(l * (1 + t), l, l * (1 - t));
  return out;
}

/* ►LOSETAS DE TONO EN LA PROPIA MALLA (el "multitile").
   El tono por copia distingue una roca de la de al lado, pero cada roca seguía
   siendo de un color plano. Aquí se hornea en el color de vértice:
     · GRADIENTE vertical: base en sombra, cima al sol.
     · LOSETAS: se cuantiza la posición del vértice a una rejilla y el tono sale
       de un hash de esa celda, así que los vértices de una misma celda comparten
       valor y aparecen CARAS/manchas de distinto tono en vez de un degradado
       suave. Coste 0 en ejecución y NO añade vértices — la alternativa
       (toNonIndexed para tener color por triángulo) multiplicaba por 4 el coste
       de vértice de ~900 rocas instanciadas.
   Y lo importante: si el modelo YA trae color de vértice (los del juego lo
   traen), se MULTIPLICA sobre él. La versión anterior se RENDÍA en ese caso
   (`if(g.attributes.color) return`), que es justo por qué los assets del juego
   no tenían ni degradado ni losetas. */
function _hashCelda(a, b, c){
  const s = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function _pintaGeo(g, opts){
  if(!g || !g.attributes.position) return;
  opts = opts || {};
  const grad = opts.grad != null ? opts.grad : 0.42;
  const tile = opts.tile != null ? opts.tile : 0.26;
  const pos = g.attributes.position;
  if(!g.boundingBox) g.computeBoundingBox();
  const bb = g.boundingBox;
  const y0 = bb.min.y, alto = (bb.max.y - y0) || 1;
  const dim = Math.max(bb.max.x - bb.min.x, alto, bb.max.z - bb.min.z) || 1;
  const celda = dim * (opts.celda || 0.22);
  const prev = g.attributes.color;
  /* un color de vértice de GLB puede venir normalizado en enteros: getX()
     devuelve el valor CRUDO (0..255), y multiplicar por eso reventaría a
     blanco. Se desnormaliza a mano. */
  let esc = 1;
  if(prev && prev.normalized){
    esc = (prev.array instanceof Uint8Array || prev.array instanceof Int8Array) ? 1/255 : 1/65535;
  }
  /* ►RETINTE POR LUMINANCIA — Y POR QUÉ VA AQUÍ Y NO EN EL MATERIAL.
     MEDIDO por CDP sobre la escena montada: en los props del juego el color NO
     está en el material, está en el COLOR DE VÉRTICE. `s3_rock` tiene el
     material en blanco puro (1,1,1) y los vértices en (0,30 0,15 0,06) — marrón
     de desierto. Retintar el material, que es lo que parecía obvio, no cambiaba
     nada: el marrón seguía saliendo del vértice y la pista nevada seguía con
     peñascos ocre. (Y de paso: con el material a blanco, `0,6 + L` daba 1,5 en
     TODOS los assets, así que la parte de "luminancia" tampoco medía nada.)
     Aquí sí hay de dónde: se conserva la luminancia RELATIVA de cada vértice
     (el claroscuro horneado del modelo, que es lo único que le da volumen) y se
     sustituye el tono. `mul` pliega dentro el color del material, para los
     modelos que sí lo lleven; quien pida tinte deja el material en blanco.

     AVISO r128 al depurar esto: `Color.getHex()` NO clampa, así que un canal
     por encima de 1 se desborda al byte de al lado y `getHexString` MIENTE
     (#d5f2ff se lee como #d5f20e). Mide r/g/b crudos, no el hex. */
  const tinte = opts.tinte != null ? new THREE.Color(opts.tinte) : null;
  const mul = opts.mul || null;
  const relMax = tinte ? 1.05 / Math.max(0.05, tinte.r, tinte.g, tinte.b) : 1;
  const contraste = opts.contraste != null ? opts.contraste : 1;
  let Lref = 1;
  if(tinte){
    let suma = 0;
    for(let i = 0; i < pos.count; i++){
      let r = prev ? prev.getX(i) * esc : 1, gg = prev ? prev.getY(i) * esc : 1,
          b = prev ? prev.getZ(i) * esc : 1;
      if(mul){ r *= mul.r; gg *= mul.g; b *= mul.b; }
      suma += 0.30*r + 0.59*gg + 0.11*b;
    }
    Lref = Math.max(0.02, suma / Math.max(1, pos.count));
  }
  const col = new Float32Array(pos.count * 3);
  for(let i = 0; i < pos.count; i++){
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const k = (1 - grad * 0.5) + grad * ((y - y0) / alto);
    const t = 1 + (_hashCelda(Math.floor(x / celda), Math.floor(y / celda),
                              Math.floor(z / celda)) - 0.5) * tile;
    const f = k * t;
    let r = prev ? prev.getX(i) * esc : 1, gg = prev ? prev.getY(i) * esc : 1,
        b = prev ? prev.getZ(i) * esc : 1;
    if(tinte){
      if(mul){ r *= mul.r; gg *= mul.g; b *= mul.b; }
      /* TOPE atado al propio tinte, no un número suelto: el canal más alto del
         tinte no debe pasar de ~1, o los vértices claros del modelo revientan a
         blanco y el pico pierde la forma. Medido sin tope: s6_peak2 llegaba a
         2,11 en su canal azul (y con Lambert, todo lo que pase de 1 es el mismo
         blanco). Lo que queda por encima de 1 es solo la variación de
         relieve/loseta, que es la misma que lleva cualquier otro prop. */
      /* `contraste` < 1 COMPRIME el claroscuro del modelo hacia su media. Es lo
         que pide la perspectiva aérea: una cumbre a 2.000 u no se ve con el
         mismo contraste roca-nieve que la que tienes al lado — se aplana y se
         va hacia el color del aire. Sin esto, el telón salía como manchas
         OSCURAS recortadas contra el cielo (visto en captura), que es
         exactamente lo contrario de lo que hace la distancia. */
      let rel = Math.min(relMax, (0.30*r + 0.59*gg + 0.11*b) / Lref);
      if(contraste !== 1) rel = 1 + (rel - 1) * contraste;
      r = tinte.r * rel; gg = tinte.g * rel; b = tinte.b * rel;
    }
    col[i*3] = f * r; col[i*3+1] = f * gg; col[i*3+2] = f * b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
}

/* ►VALLAS Y JALONES A BANDAS (el multitile de una caja).
   Un jalón era UNA caja de UN color plano: veinte de ellos se leen como veinte
   calcomanías del mismo sticker. Aquí la caja se corta en bandas horizontales y
   cada banda lleva su tono horneado en el color de vértice. La geometría se
   comparte entre TODAS las copias (una sola, instanciada), así que las bandas
   salen gratis; el tono POR copia lo pone `instanceColor` encima.
   Va sin índices a propósito: con vértices compartidos las bandas serían un
   degradado suave y lo que se busca es el corte. */
function _cajaBandas(n, oscura, brillo){
  const g = new THREE.BoxGeometry(1, 1, 1, 1, n, 1).toNonIndexed();
  const pos = g.attributes.position, col = new Float32Array(pos.count * 3);
  for(let t = 0; t < pos.count; t += 3){
    const ym = (pos.getY(t) + pos.getY(t+1) + pos.getY(t+2)) / 3;
    const b = Math.floor((ym + 0.5) * n);
    /* `brillo` > 1 a propósito: un poste es TODO caras verticales y con el sol
       rasante de la hora dorada solo le llega el hemisférico — sin compensar en
       el albedo se leen como palos NEGROS (comprobado en captura). */
    const f = ((b % 2 === 0) ? 1.0 : (oscura != null ? oscura : 0.62))
            * (brillo != null ? brillo : 1)
            * (0.94 + 0.12 * _hashCelda(b, 1, 1));
    for(let k = 0; k < 3; k++){ col[(t+k)*3] = f; col[(t+k)*3+1] = f; col[(t+k)*3+2] = f; }
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}

/* Siembra instanciada de un modelo del juego.
   `plazas` = función que rellena {pos, rotY, esc, tono} para cada copia. */
function siembra(world, clave, n, rng, hazPlaza, opts){
  opts = opts || {};
  const tpl = propDelJuego(clave);
  if(!tpl) return 0;
  tpl.updateMatrixWorld(true);

  /* ►PALMERAS VOLANDO — LA CAUSA, medida.
     Varios modelos del juego traen su malla MUY LEJOS del origen de su fichero
     (medido aquí: s3_palm5 a 284/275 u, s3_palm2 a 92/175, s3_palm3 a -153 en z).
     Hornear la jerarquía con `applyMatrix4(matrixWorld)` es correcto, pero
     CONSERVA ese desplazamiento: la copia acaba a 100-280 u de donde se plantó,
     y allí el terreno tiene OTRA altura. En una pista que baja entre 11° y 42°
     eso son decenas de unidades de aire: `terrainY` en la plaza pedida daba
     -111,8 y en el sitio donde de verdad caía la palmera, +443,9.
     Ni apoyaEnLadera ni hundeFrac podían arreglarlo: medían el punto correcto,
     el que se movía era el modelo. Por eso solo volaban las palmeras — cactus,
     rocas y matojos tienen su malla en el origen (desfase medido: 0,0).
     Solución: RECENTRAR la geometría horneada sobre su propia huella y apoyar
     su base en y=0. Así el origen de la instancia ES el pie del prop, que es lo
     que toda la colocación da por supuesto (y de paso `rotY` gira sobre su
     propio eje y no describe una órbita de 280 u). */
  const _geos = [];
  tpl.traverse(q => {
    if(!q.isMesh) return;
    const g = q.geometry.clone();
    g.applyMatrix4(q.matrixWorld);            // hornea la jerarquía del modelo
    g.computeBoundingBox();
    _geos.push({ g, q });
  });
  if(!_geos.length) return 0;
  const _bAll = new THREE.Box3();
  for(const it of _geos) _bAll.union(it.g.boundingBox);
  const _cx = (_bAll.min.x + _bAll.max.x) / 2, _cz = (_bAll.min.z + _bAll.max.z) / 2;
  const med = { alto: (_bAll.max.y - _bAll.min.y) || 1, minY: 0,
                radio: Math.max(_bAll.max.x - _bAll.min.x, _bAll.max.z - _bAll.min.z) * 0.5 || 1 };

  /* una InstancedMesh por submalla del modelo */
  const partes = [];
  for(const it of _geos){
    const g = it.g;
    g.translate(-_cx, -_bAll.min.y, -_cz);    // pie en y=0, centrado en XZ (ver arriba)
    const m0 = Array.isArray(it.q.material) ? it.q.material[0] : it.q.material;
    const base = (m0 && m0.color) ? m0.color.clone() : new THREE.Color(0xffffff);
    /* ►RETINTE POR LUMINANCIA (`opts.tinte`). Las rocas del juego vienen
       HORNEADAS en color arena, así que en una piel de nieve una pista blanca
       sale con peñascos ocre. El retinte NO va aquí sino dentro de `_pintaGeo`,
       y la razón está medida y explicada ahí: en estos assets el color vive en
       el VÉRTICE, no en el material. Con tinte, el material se queda en blanco
       y todo el color lo pone el vértice. */
    _pintaGeo(g, { grad: opts.grad, tile: opts.tile, celda: opts.celda,
                   tinte: opts.tinte, contraste: opts.contraste,
                   mul: opts.tinte != null ? base : null });
    const mat = new THREE.MeshLambertMaterial({
      color: opts.tinte != null ? 0xffffff : base,
      vertexColors: true, flatShading: !!opts.plano });
    /* brillo frío del hielo, con la MISMA tabla para todas las capas: la lleva
       el modelo (EMISIVO[clave]), no quien lo siembra */
    const em = EMISIVO[clave];
    if(em){ mat.emissive.setHex(em[0]); mat.emissiveIntensity = em[1]; }
    /* el telón vive a 1.500-2.300 u, muchísimo más lejos que fog.far: con
       niebla saldría como una silueta plana del color de la bruma. Su
       perspectiva aérea va HORNEADA por copia (ver telonDeCumbres). */
    if(opts.sinNiebla) mat.fog = false;
    const im = new THREE.InstancedMesh(g, mat, n);
    im.castShadow = !!opts.sombra; im.receiveShadow = !opts.sinNiebla;
    /* r128 no tiene esfera envolvente de InstancedMesh: el culleo usa la del
       MODELO en el origen del grupo. Para un telón pegado a la cámara eso es
       la diferencia entre verlo y no verlo. */
    if(opts.sinCull) im.frustumCulled = false;
    /* NO tocar `count` todavía: en r128 `instanceColor` se crea en el primer
       setColorAt CON EL TAMAÑO DE this.count. Poniéndolo a 0 antes, el buffer
       de color nace vacío y todas las copias salen NEGRAS. (Ya me pasó con las
       losas del stage 5 y está anotado; y he vuelto a caer.) Se recorta al
       final, cuando ya está lleno. */
    partes.push(im);
  }

  const m4 = new THREE.Matrix4(), qt = new THREE.Quaternion(),
        v3 = new THREE.Vector3(), sc = new THREE.Vector3(), col = new THREE.Color();
  let puestos = 0, wi = 0;
  for(let i = 0; i < n; i++){
    const pl = hazPlaza(i, med);
    if(!pl) continue;
    /* si la plaza no fija `y`, se calcula apoyando en la ladera y hundiendo */
    if(pl.y == null){
      const rad = med.radio * Math.max(pl.ex, pl.ez);
      const alt = med.alto * pl.ey;
      pl.y = apoyaEnLadera(pl.x, pl.z, rad * 0.8, alt * (pl.hundeFrac != null ? pl.hundeFrac : 0.16))
             - med.minY * pl.ey;
    }
    v3.set(pl.x, pl.y, pl.z);
    qt.setFromEuler(new THREE.Euler(pl.rx || 0, pl.rotY || 0, pl.rz || 0));
    sc.set(pl.ex, pl.ey, pl.ez);
    m4.compose(v3, qt, sc);
    /* tono por COPIA: es el multitono, y sale gratis. Una plaza puede traer el
       suyo (`pl.tono`) cuando el tinte no es aleatorio sino que CODIFICA algo —
       en el telón, la distancia a la que está esa cumbre. */
    if(pl.tono) col.copy(pl.tono); else _tono(rng, col, opts.fuerza);
    for(const im of partes){ im.setMatrixAt(wi, m4); im.setColorAt(wi, col); }
    wi++; puestos++;
  }
  for(const im of partes){
    im.count = wi;                                   // ← ahora sí: recortar
    im.instanceMatrix.needsUpdate = true;
    if(im.instanceColor) im.instanceColor.needsUpdate = true;
    /* ETIQUETA: "creo que hay palmeras flotando" se convierte en un número por
       clave desde una sonda. Cuesta nada y ya ha ahorrado rondas enteras. */
    im.userData._descProp = clave; im.userData._descTag = opts.tag || '?';
    if(wi > 0) world.add(im);
  }
  return puestos;
}

/* =====================================================================
   ►TELÓN DE CUMBRES — el horizonte de la piel de nieve

   Toni, sobre la primera versión del fondo de arena: "el cielo se ve como un
   parche para simular el fondo en línea recta". Tenía razón y la lección quedó
   escrita: un telón tiene que ser un ANILLO DE 360°, no un plano delante. Aquí
   se cumple por construcción — el grupo `cielo` se re-pega a la posición de la
   cámara cada frame, así que el anillo acompaña los 6.200 u de bajada y las
   cumbres nunca se quedan atrás ni cambian de tamaño.

   Los picos son los del MAPA DE HIELO del juego (s6_peak / s6_peak2), usados
   igual que los usa el juego en el horizonte del jefe de hielo: nada modelado
   aquí. Y tres cosas que no son decorativas:

     · PERSPECTIVA AÉREA HORNEADA. El telón está a 1.500-2.300 u y fog.far vale
       820, así que con niebla saldría como una silueta plana del color de la
       bruma. Va con `mat.fog = false` y el desvanecido se mete a mano en el
       tono POR COPIA: cuanto más lejos la cumbre, más se va hacia el color de
       la niebla. Es lo mismo que hace ►DEPTH en el juego, pero por instancia.
     · ANILLO COMPLETO, con la CIMA MAYOR justo a la espalda de la salida: es
       lo que se ve en el travelling de presentación y en cada mirada atrás.
     · MAR DE NUBES al pie, que es lo que hace que las cumbres se lean como
       LEJOS y no como rocas grandes: sin él, el pie de cada montaña acaba en un
       corte limpio contra el cielo y la escala se viene abajo.
   ===================================================================== */
function telonDeCumbres(cielo, rng){
  const CLAVES = PAL.picos;
  const cFog = new THREE.Color(PAL.fog);
  /* tonos nevados: los mismos seis del horizonte ártico del juego */
  const SNOW = [0xffffff, 0xeef3f8, 0xdde6ee, 0xccd7e0, 0xbac7d2, 0xa9b7c4];

  /* La cima grande a +Z (a la espalda de la salida) y el resto repartido por
     todo el anillo con un hueco relativo delante-abajo, por donde se baja. */
  const CUMBRES = [];
  const N = 15;
  for(let i = 0; i < N; i++){
    const a = (i / N) * TAU + (rng() - 0.5) * 0.16;
    /* delante (−Z, hacia donde se baja) las cumbres se alejan y encogen: si no,
       tapan la lectura de la pista y parece que bajas hacia una pared */
    const frente = clamp((Math.cos(a - Math.PI/2) + 1) / 2, 0, 1);   // 1 mirando a −Z
    const rad = 1500 + rng() * 500 + frente * 320;
    const alto = (300 + rng() * 240) * (1 - frente * 0.42);
    CUMBRES.push({ a, rad, alto });
  }
  CUMBRES.push({ a: Math.PI/2, rad: 1620, alto: 780 });    // LA cima, a +Z

  const _t = new THREE.Color();
  let puestas = 0;
  CLAVES.forEach((clave, ci) => {
    const mias = CUMBRES.filter((_, i) => (i % CLAVES.length) === ci);
    puestas += siembra(cielo, clave, mias.length, rng, (i, med) => {
      const d = mias[i];
      const e = d.alto / med.alto;
      /* HAZE: 0 en la cumbre más cercana, 1 en la más lejana. Se mezcla el tono
         nevado con el de la niebla y se sube un pelo el brillo, porque el
         material del telón no recibe la direccional principal de lleno. */
      const haze = clamp((d.rad - 1500) / 900, 0, 1) * 0.62;
      _t.setHex(SNOW[(rng() * SNOW.length) | 0]).lerp(cFog, haze).multiplyScalar(1.18);
      return { x: Math.cos(d.a) * d.rad, y: -260 - rng() * 60, z: Math.sin(d.a) * d.rad,
               rotY: rng() * TAU, ex: e * (0.85 + rng() * 0.45), ey: e, ez: e * (0.85 + rng() * 0.45),
               tono: _t.clone() };
    }, { sombra:false, plano:true, sinNiebla:true, sinCull:true,
         /* nevadas y con el claroscuro comprimido: son cumbres a 2 km, no rocas
            grandes. Con su contraste horneado salían como manchas oscuras. */
         tinte: PAL.tintePico, contraste: 0.42, grad: 0.30, tag:'telon' });
  });

  /* MAR DE NUBES al pie de las cumbres: banda de esferas achatadas, sin
     iluminar (misma razón que las nubes de arriba: una nube estilizada es una
     mancha clara, no un objeto sombreado — con Lambert se ven siempre por su
     cara en sombra y salen gris plomo). */
  {
    const N2 = 130;
    const im = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 5),
      new THREE.MeshBasicMaterial({ color:0xffffff, transparent:true, opacity:0.72, fog:false }), N2);
    im.frustumCulled = false;
    const mm = new THREE.Matrix4(), qq = new THREE.Quaternion(),
          pp = new THREE.Vector3(), ss = new THREE.Vector3(), cc = new THREE.Color();
    for(let i = 0; i < N2; i++){
      const a = rng() * TAU, rad = 1080 + rng() * 900;
      const esc = 150 + rng() * 190;
      pp.set(Math.cos(a) * rad, -230 + (rng() - 0.5) * 90, Math.sin(a) * rad);
      qq.identity();
      ss.set(esc, esc * (0.16 + rng() * 0.12), esc * (0.6 + rng() * 0.5));
      mm.compose(pp, qq, ss);
      im.setMatrixAt(i, mm);
      const g2 = 0.90 + rng() * 0.10;
      cc.setRGB(g2 * 0.98, g2, g2 * 1.02);        // frías: azul por encima del rojo
      im.setColorAt(i, cc);
    }
    im.instanceMatrix.needsUpdate = true;
    if(im.instanceColor) im.instanceColor.needsUpdate = true;
    cielo.add(im);
  }
  console.log('[descenso] telón: ' + puestas + ' cumbres de ' + CLAVES.join('/') + ' + mar de nubes');
}

function GAME_RENDERER(){ return (typeof renderer !== 'undefined') ? renderer : null; }
function GAME_KEYS(){ return (typeof keys !== 'undefined') ? keys : null; }

const DESC = window.DESC = {
  on:false, K, TRICKS, ZONA, BANDS, HUECOS, PARTES, TUNELES, RAILES, PIPES,
  scene:null, cam:null, world:null, backdrop:null,
  seed:0, rng:null, noise:null, noiseH:null,
  racers:[], obst:[], buckets:null, picks:null,
  t:0, phase:'intro', introT:0,   // ►DESCINTRO: intro → race → finish
  finishOrder:[], hud:null, _built:false, _why:{},
  orb:{ yaw:0, pitch:0, idle:9, mx:0, my:0, down:false, wheel:0 },
  kick:{ y:0, v:0 },
  /* ►OLA a mano desde la consola: DESC.ola.OLA.alto (hay que reconstruir para
     que el shader lo vea: el tamaño va horneado en el GLSL), DESC.ola.U.uTime
     para congelar/adelantar el mar, y DESC.ola.y(x,z,t) para preguntarle la
     altura a la misma función que usa la física */
  ola: { OLA, OLAS, U:OLA_U, y:olaY },
};

const BUCKET = 60;

/* =====================================================================
   TERRENO
   ===================================================================== */
/* muro(s) de pipe en (x,z): altura añadida y máscara 0..1 (para amortiguar
   el relieve dentro — un half-pipe con lomos dentro no se puede surfear) */
function pipeAt(x, z){
  for(let i = 0; i < PIPES.length; i++){
    const P = PIPES[i];
    if(z > P.z0 || z < P.z1) continue;
    /* entrada y salida en 45 u: el muro CRECE, no aparece de golpe */
    const dz = Math.min(P.z0 - z, z - P.z1);
    const mz = smooth(clamp(dz / 45, 0, 1));
    if(mz <= 0) continue;
    const lado = P.tipo === 'left' ? -1 : 1;
    const xx = P.tipo === 'full' ? Math.abs(x) : x * lado;
    if(xx < 0) return { add: 0, mask: mz * 0.4 };        // lado plano del quarter
    const u2 = clamp(xx / P.W, 0, 1);
    return { add: P.D * u2 * u2 * mz, mask: mz };
  }
  return null;
}

/* ►CUÁNTO OLEAJE LE TOCA A UN PUNTO. Vive en una función porque lo consultan
   tres sitios que TIENEN que coincidir: terrainY (la física), el horneado del
   atributo `aOla` de la malla del mar, y lo que flota encima (los kickers).
   `damp` es el amortiguado del half-pipe, que el llamante ya suele tener. */
function olaFacAt(z, damp){
  return (0.55 + 0.45 * clamp(zoneProp(z, 'bump') / 3.2, 0, 1.4)) * (damp === undefined ? 1 : damp);
}
/* el mar EN CALMA en ese punto: lo que habría debajo si no hubiera oleaje. Con
   esto se construyen las cosas que FLOTAN, y luego el shader les suma la ola de
   su ancla — así suben y bajan enteras en vez de deformarse. */
function marCalma(x, z){ return terrainY(x, z) - olaY(x, z, DESC.t) * olaFacAt(z); }
function terrainY(x, z){
  const n = DESC.noise; if(!n) return 0;
  const hw  = hwAt(z);
  const u   = x / hw;
  const cuenco = K.bowl * u * u;                         // los bordes suben
  const P = PIPES.length ? pipeAt(x, z) : null;
  const damp = P ? (1 - P.mask * 0.78) : 1;              // dentro del pipe, liso
  /* ►OLA · EN EL MAR NO HAY LOMOS DE RUIDO: hay OLEAJE. Los `big`/`sml` de
     ruido son justo lo que Toni ve como "montañas de agua" — un relieve fijo,
     que ni se mueve ni tiene cara de ola. Se cambian por olas que viajan; todo
     lo demás (cuenco, pipes, espolones, bandas) se queda igual. */
  if(MAR){
    return baseY(z) + cuenco + olaY(x, z, DESC.t) * olaFacAt(z, damp)
                    + parteAt(x, z) + (P ? P.add : 0);
  }
  const big = n(x * K.bumpFreqB, z * K.bumpFreqB) * zoneProp(z, 'bump') * damp;
  const sml = n(x * K.bumpFreqS, z * K.bumpFreqS) * K.bumpSmall * damp;
  return baseY(z) + cuenco + big + sml + parteAt(x, z) + (P ? P.add : 0);
}
/* DUREZA 0..1: base de la zona (el fuera pista es nieve profunda) + ruido. */
function hardnessAt(x, z){
  const n = DESC.noiseH; if(!n) return 0.5;
  return clamp(zoneProp(z, 'hard') + n(x * K.hardFreq, z * K.hardFreq) * 0.22, 0, 1);
}
DESC._ty = terrainY;
DESC._hard = hardnessAt;
DESC._hwAt = hwAt;

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
      /* ►MAR: el doble de kickers, porque la pista es el DOBLE de ancha y con la
         densidad de tierra pasabas de largo sin encontrarte ninguno */
      const n = (1 + (rng() < 0.5 ? 1 : 0)) * (MAR ? 2 : 1);
      for(let k = 0; k < n; k++){
        const r = rng();
        /* 'xl' = KICKER de salto grande (Toni: "añade kickers de salto").
           No necesita impulso propio: desde la v5 las rampas lanzan por
           CURVATURA (el suelo se acaba y sales con tu velocidad). */
        const size = r < 0.38 ? 's' : (r < 0.72 ? 'm' : (r < 0.90 ? 'l' : 'xl'));
        const dim  = size === 's' ? { w:7.0, len:11, h:2.4 }
                   : size === 'm' ? { w:8.4, len:15, h:3.8 }
                   : size === 'l' ? { w:10.5, len:21, h:6.2 }
                   :                { w:16, len:26, h:8.4 };
        obst.push({ type:'ramp', size, x:(rng()*2-1)*hw, z:z + (rng()-0.5)*20, ...dim });
      }
    }

    /* rocas: el fuera pista está sembrado, la verde casi limpia */
    const nr = Math.floor(rng() * 1.4 + zn.rock * 1.5) * (MAR ? 2 : 1);
    for(let k = 0; k < nr; k++){
      /* ►MAR · ARRECIFES A LOS LADOS, NO EN MEDIO. En el mar la roca ya no es un
         obstáculo suelto por la pista: es lo que marca el límite (Toni), porque
         al no haber cuenco no hay nada más que te devuelva al centro. Se siembra
         en la franja exterior, del 72% de la semianchura para afuera. */
      const rx2 = MAR ? (rng() < 0.5 ? -1 : 1) * hw * (0.72 + rng() * 0.30)
                      : (rng()*2-1)*hw;
      const rz2 = z + (rng()-0.5)*26;
      if(parteAt(rx2, rz2) > 1.5) continue;      // no sembrar sobre el espolón
      obst.push({ type:'rock', x:rx2, z:rz2, r: 2.2 + rng()*1.6 + zn.rock * 1.1 });
    }

    /* ►GLOBOS. Sustituyen a las cápsulas de objeto (petición de Toni: fuera los
       objetos). Lo que decide el color es LA ALTURA a la que cuelgan, porque es
       lo que decide lo que cuesta cogerlo:
         VERDE   a ras: te lo llevas rodando, es la línea buena.
         ROJO    a media altura: hace falta un ollie, o pillar un lomo.
         AMARILLO arriba del todo: solo se llega volando desde una rampa — por
                  eso se siembran DETRÁS de las rampas grandes (ver abajo), no
                  al azar, o serían puntos imposibles y no un reto.

       VAN EN CADENA, no sueltos. Medido con uno suelto por sitio: de ~90
       globos por los que se pasaba solo se cogían 6 (7%), porque a 150 km/h en
       un abanico de 200 u de ancho aciertas un punto por casualidad. Una
       cadena no es "más globos": es una LÍNEA que se lee desde lejos y que
       puedes decidir seguir — que es de lo que va el juego. */
    if(rng() < 0.34) cadena(obst, 'verde', (rng()*2-1)*hw*0.85, z - 12, 3 + ((rng()*3)|0), rng);
    if(rng() < 0.20) cadena(obst, 'rojo',  (rng()*2-1)*hw*0.75, z - 20, 3 + ((rng()*2)|0), rng);
    z -= 26 + rng() * 16;
  }

  /* AMARILLOS: en la trayectoria de las rampas grandes. En fila y SUBIENDO
     (más lejos = más alto) para que premien el salto LARGO, no el de rebote; y
     en la x de la rampa, que es por donde vas a salir. */
  for(const rp of obst.filter(o => o.type === 'ramp' && (o.size === 'l' || o.size === 'xl'))){
    const n = rp.size === 'xl' ? 3 : 2;
    for(let k = 0; k < n; k++){
      obst.push({ type:'globo', tier:'amarillo', x: rp.x + (rng()-0.5)*3, z: rp.z - (20 + k * 11),
                  dy: GLOBO.amarillo.alto + k * 2.2, taken:false });
    }
  }
  return obst;
}

/* una cadena de globos que se curva suavemente: invita a trazar, no a ir recto */
function cadena(obst, tier, x0, z0, n, rng){
  const curva = (rng() - 0.5) * 0.9;      // deriva lateral por eslabón
  for(let k = 0; k < n; k++){
    obst.push({ type:'globo', tier, x: x0 + curva * k * 7, z: z0 - k * 8,
                dy: GLOBO[tier].alto, taken:false });
  }
}

/* ►GLOBOS: los tres niveles. `alto` es sobre el suelo, y es lo que hace que uno
   sea fácil y otro difícil; los puntos van con eso. */
const GLOBO = {
  verde:    { col:0x35d861, pts:30,  alto:2.0,  nombre:'GLOBO' },
  rojo:     { col:0xff4d3d, pts:80,  alto:6.0,  nombre:'GLOBO ALTO' },   // 6,0 = al alcance de un ollie CARGADO (vy 23 → 5,1 u), no de un toque seco
  amarillo: { col:0xffd23f, pts:180, alto:15.0, nombre:'¡GLOBO DE ORO!' },
};

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
DESC._hw = hwAt;

/* HUELLA DE LA TABLA: un board mide 4,6 unidades y no cabe en un punto.
   Promediar tres puntos a lo largo de su eje es lo que impide que el rizado
   fino (13 u de longitud de onda) te esté lanzando por los aires a 60 u/s:
   la tabla PUENTEA los baches pequeños, exactamente como en la realidad.
   Sin esto, la detección de despegue por curvatura es una traca. */
function padY(x, z, fx, fz){
  /* ►OLA: en el mar la huella se alarga. Una tabla de kite/surf apoya sobre más
     agua que un snowboard sobre nieve, y ese promedio más largo es justo lo que
     filtra el rizado corto que lanzaba al rider por los aires. */
  const L = MAR ? 2.6 : 2.3;   // (3,6 se comía los baches: el promedio los alisaba antes de que llegaran a la física)
  const a = groundYAt(x - fx*L, z - fz*L);
  const b = groundYAt(x, z);
  const c = groundYAt(x + fx*L, z + fz*L);
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
  sc.fog = new THREE.Fog(PAL.fog, PAL.fogNear, PAL.fogFar);

  /* 0,9 + 1,25 = 2,15 de luz: TODO saturaba a blanco y el color de zona no se
     leía (medido en captura: la pista roja salía color arena). */
  /* hemisferio BAJO + sol FUERTE = contraste; el ambiente azulado del
     hemisferio inferior enfría las sombras (complementario del sol cálido) */
  sc.add(new THREE.HemisphereLight(PAL.hemi, PAL.hemiBajo, PAL.hemiInt));
  /* ►SOMBRAS REALES. Es lo que más levanta una escena plana: sin ellas, nada
     toca el suelo. La caja de sombra es PEQUEÑA y VIAJA con el jugador (100×100
     unidades): una que cubriera los 5.600 u de pista daría texels del tamaño de
     un coche. Solo proyectan los personajes y las rocas cercanas; el terreno
     únicamente las recibe. */
  const sun = new THREE.DirectionalLight(PAL.sun, PAL.sunInt);
  sun.position.set(PAL.sunPos[0], PAL.sunPos[1], PAL.sunPos[2]);   // arena: BAJO (sombras largas de atardecer); nieve: ALTO
  sun.castShadow = !!K.sombras;
  const S = 52;
  sun.shadow.camera.left = -S; sun.shadow.camera.right = S;
  sun.shadow.camera.top = S;   sun.shadow.camera.bottom = -S;
  sun.shadow.camera.near = 1;  sun.shadow.camera.far = 320;
  sun.shadow.mapSize.set(K.sombraMap, K.sombraMap);
  sun.shadow.bias = -0.0016;
  sun.shadow.normalBias = 0.9;
  sc.add(sun);
  sc.add(sun.target);
  DESC.sun = sun;
  /* relleno DESDE LA CÁMARA: sin él, los personajes (MeshStandard) se ven de
     frente en sombra mientras el terreno (Lambert) ya está bien expuesto */
  const fill = new THREE.DirectionalLight(PAL.fill, PAL.fillInt);
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
    const dirSol = new THREE.Vector3(PAL.solDir[0], PAL.solDir[1], PAL.solDir[2]).normalize();
    const CSOL = PAL.csol;        // arena: núcleo blanco → halo naranja. nieve: blanco → azul pálido
    let iSol = 0;
    for(const [r2, op] of [[130, 1.0], [300, 0.30], [580, 0.12]]){
      const disco = new THREE.Mesh(new THREE.CircleGeometry(r2, 26),
        new THREE.MeshBasicMaterial({ color: CSOL[iSol++], transparent:true, opacity:op,
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
        /* atardecer: las bajas se tiñen de naranja, las altas casi blancas.
           En nieve el viraje va a CERO (PAL.nubeCal): una nube cálida sobre un
           cielo frío se lee como una mancha sucia, no como atardecer. */
        const w = 1 - clamp((alt - 240) / 620, 0, 1);
        const NC = PAL.nubeCal;   // [verde base, azul base, viraje verde, viraje azul]
        cc.setRGB(g2, g2 * (NC[0] - NC[2]*w), g2 * (NC[1] - NC[3]*w));
        imN.setColorAt(ni, cc);
        ni++;
      }
    }
    imN.instanceMatrix.needsUpdate = true;
    if(imN.instanceColor) imN.instanceColor.needsUpdate = true;
    cielo.add(imN);

    /* ►TELÓN DE CUMBRES (piel de nieve). Va AQUÍ, dentro del grupo `cielo`, y
       eso no es un detalle: el grupo se re-pega a la cámara cada frame, así que
       las cumbres son un telón de 360° de verdad y no un decorado que se queda
       atrás — el error literal que Toni ya cazó una vez ("el cielo se ve como un
       parche para simular el fondo en línea recta"). */
    if(PAL.picos) telonDeCumbres(cielo, mulberry32(DESC.seed ^ 0x51c0));

    sc.add(cielo);
    DESC.cielo = cielo;
  }

  const world = new THREE.Group();
  world.rotation.x = -K.tilt * RAD;
  sc.add(world);
  DESC.world = world;

  const rng = mulberry32(DESC.seed ^ 0x5a17);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(),
        p = new THREE.Vector3(), s2 = new THREE.Vector3(), c = new THREE.Color();

  /* --- TERRENO: malla en ABANICO (sigue la semianchura, así que la
         resolución cae donde hace falta y no se malgastan vértices) --- */
  {
    /* la resolución se ata al LARGO, no a un número fijo: con la pista de 2
       minutos, 380 filas dejaban 17 u por fila y los lomos se veían facetados */
    const zTop = 160, zBot = -(K.len + 240);
    const COLS = 72, ROWS = Math.min(1000, Math.round((zTop - zBot) / 8.5));
    const OUT = 1.16;                    // se pinta un poco más allá del límite
    /* ►FALDÓN. La malla acababa en 1,16×hw pero la 2ª fila de rocas se coloca
       en hw+26..hw+60: se apoyaban en un terrainY() que existe matemáticamente
       pero NO SE DIBUJA — por eso Toni veía palmeras y peñascos flotando, y una
       banda vacía entre la pista y el horizonte. El faldón extiende la malla
       85 u más por cada lado; el CUENCO (K.bowl·u², que ya vive en terrainY)
       hace que esa franja SUBA sola en forma de flanco de cañón — a hw+85 son
       ~100 u de alza — así que sirve de suelo para el decorado Y de muro
       visual coherente con el tope físico. COLS sube 58→72 para no robarle
       resolución a la pista. */
    const FALDA = 85, FALDA_ALZA = 12;
    const nv = (COLS + 1) * (ROWS + 1);
    const pos = new Float32Array(nv * 3), col = new Float32Array(nv * 3);
    /* ►OLA · cuánto oleaje le toca a ESTE vértice (picado de la banda × el
       amortiguado del pipe). Se calcula aquí, donde ya se conocen x y z, y el
       shader sólo multiplica: así la ola que se DIBUJA es la misma que la que
       se PISA, sin repetir en GLSL la lógica de bandas ni de half-pipes. */
    const olaFac = new Float32Array(nv);
    const idx = new Uint32Array(COLS * ROWS * 6);
    const cSoft = new THREE.Color(PAL.soft), cHard = new THREE.Color(PAL.hard), cz = new THREE.Color();
    const _cFalda = new THREE.Color(PAL.wall);
    let vi = 0;
    for(let ri = 0; ri <= ROWS; ri++){
      const z  = zTop + (zBot - zTop) * (ri / ROWS);
      const hwPista = hwAt(z);
      const hw = hwPista * OUT + FALDA;
      /* zoneProp interpola NÚMEROS y un color en hex NO se puede interpolar
         así (0x22222c entre 0x3fbe63 daría un color que no existe): el tinte
         se toma de la banda dominante y el corte se ve, que es lo que se busca. */
      cz.setHex(zoneAt(z).col);
      for(let ci = 0; ci <= COLS; ci++){
        const u = -1 + 2 * (ci / COLS);
        /* muestreo NO uniforme: u² concentra columnas en la pista y deja las
           largas para el faldón, donde el detalle no se aprecia */
        const x = Math.sign(u) * Math.pow(Math.abs(u), 1.35) * hw;
        const faldaT = clamp((Math.abs(x) - hwPista * OUT) / FALDA, 0, 1);
        let y = terrainY(x, z) + smooth(faldaT) * FALDA_ALZA;
        if(MAR){
          /* la malla se guarda con el mar EN CALMA y el oleaje entero lo pone el
             shader; si no, la ola de t=0 quedaría horneada y sumada dos veces */
          const P2 = PIPES.length ? pipeAt(x, z) : null;
          /* EXACTAMENTE el mismo factor que usa terrainY (por eso vive en una
             función compartida). Tenía aquí además un atenuado por el faldón,
             que quedaba más bonito pero metía una divergencia entre lo que se ve
             y lo que se pisa: no compensa. */
          const fac = olaFacAt(z, P2 ? (1 - P2.mask * 0.78) : 1);
          olaFac[vi] = fac;
          y -= olaY(x, z, DESC.t) * fac;
        }
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
        /* los PIPES se leen como arena PRENSADA con banding multitono
           (petición expresa de multitono también en los half-pipes) */
        const pInfo = PIPES.length ? pipeAt(x, z) : null;
        if(pInfo && pInfo.mask > 0){
          c.lerp(cHard, pInfo.mask * 0.30);
          const banda = 0.96 + 0.08 * Math.sin(x * 0.55 + z * 0.13);
          c.multiplyScalar(1 - pInfo.mask * (1 - banda));
        }
        const fuera = Math.abs(x) > hwPista ? 0.62 : 1;      // fuera del límite: apagado
        /* el faldón vira hacia el color de la roca del cañón y se oscurece */
        if(faldaT > 0) c.lerp(_cFalda, faldaT * 0.55);
        /* ►RELIEVE POR PIEL. En arena el volumen lo dan DOS cosas: el sombreado
           por pendiente y el propio color (la dureza va de 0xf2d5a2 a 0xb8854a,
           un salto grande). En nieve el color casi no varía —la nieve es blanca
           esté suelta o prensada—, así que si el sombreado no compensa, la
           ladera entera es una sábana. `relieve` sube la pendiente y la cavidad
           un 60% en nieve; es el mismo cálculo, con más peso. */
        const shade = (0.88 + 0.12 * h + (pend * 0.42 + cav) * PAL.relieve)
                    * fuera * (1 - faldaT * 0.18);
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
    const matSuelo = new THREE.MeshLambertMaterial({ vertexColors:true });
    if(MAR){
      geo.setAttribute('aOla', new THREE.BufferAttribute(olaFac, 1));
      aplicaOlaShader(matSuelo);
    }
    const mesh = new THREE.Mesh(geo, matSuelo);
    mesh.receiveShadow = true;
    if(MAR){
      mesh.frustumCulled = false;              // el desplazamiento del shader se sale de la caja original
      mesh.userData._olaMode = 'vertice';      // ►el pase del contorno necesita saber que ESTE se mueve
    }
    world.add(mesh);
    DESC.terrain = mesh;
    if(MAR){ DESC.olaza = creaOlaza(); world.add(DESC.olaza); }   // ►OLAZA: la pared de agua de atrás
    DESC._quadsHueco = saltados;
  }

  /* --- PAREDES Y FONDO DEL PRECIPICIO ---
     Sin esto el agujero se ve como una ventana al cielo y no da ningún vértigo.
     Un labio claro que marca el borde de salto, paredes verticales y un fondo
     oscuro muy abajo. */
  for(const h of HUECOS){
    const zc = (h.z0 + h.z1) / 2;
    const hw = hwAt(zc) * 1.2;
    const prof = 210;
    const yTop = terrainY(0, h.z0), yBot = terrainY(0, h.z1);

    /* ►CAÑÓN, NO AGUJERO EN LA NADA.
       Toni: "no me gusta que se vean precipicios cuyo corte luego baja sin una
       pared que acompañe, parece que te caigas al infinito del sistema de
       juego". Exacto: había dos planos sueltos y un fondo negro flotando, así
       que por los lados se veía el vacío. Ahora el hueco es una CAJA CERRADA:
       las cuatro paredes (las dos del corte y las dos laterales), con estratos
       de roca de distinto tono para que se lea la profundidad, y un fondo
       oscuro con niebla propia. Se ve un cañón, no un fallo de render. */
    const ESTRATOS = 7;
    const paredes = new THREE.Group();
    const cBase = new THREE.Color(PAL.wall2);
    for(let e = 0; e < ESTRATOS; e++){
      const t0 = e / ESTRATOS, t1 = (e + 1) / ESTRATOS;
      const alto = prof * (t1 - t0);
      const yMid = -prof * (t0 + t1) / 2;
      /* cada estrato, un tono: más abajo, más oscuro y más frío */
      const cc2 = cBase.clone().offsetHSL(0.01 * e, -0.05 * t0, -0.30 * t0 + 0.06);
      const mat = new THREE.MeshLambertMaterial({ color: cc2, side: THREE.DoubleSide, flatShading:true });
      /* un pelín de resalte por estrato: sin esto es una pared lisa */
      const sal = 1 + 0.035 * Math.sin(e * 2.1);
      for(const [zz, yy] of [[h.z0, yTop], [h.z1, yBot]]){
        const pa = new THREE.Mesh(new THREE.PlaneGeometry(hw * 2 * sal, alto), mat);
        pa.position.set(0, yy + yMid, zz);
        paredes.add(pa);
      }
      for(const lado of [-1, 1]){
        const pl = new THREE.Mesh(new THREE.PlaneGeometry(Math.abs(h.z0 - h.z1) + 4, alto), mat);
        pl.rotation.y = Math.PI / 2;
        pl.position.set(lado * hw * sal, (yTop + yBot) / 2 + yMid, zc);
        paredes.add(pl);
      }
    }
    world.add(paredes);

    /* fondo: oscuro y con bruma, para que no se vea "el final del mundo" */
    const fondo = new THREE.Mesh(new THREE.PlaneGeometry(hw*2.2, Math.abs(h.z0-h.z1)+10),
      new THREE.MeshBasicMaterial({ color:0x2b2530, fog:false }));
    fondo.rotation.x = -Math.PI/2;
    fondo.position.set(0, (yTop + yBot)/2 - prof, zc);
    world.add(fondo);
    const bruma = new THREE.Mesh(new THREE.PlaneGeometry(hw*2.2, Math.abs(h.z0-h.z1)+10),
      new THREE.MeshBasicMaterial({ color:PAL.fog, transparent:true, opacity:0.55,
                                    depthWrite:false, fog:false }));
    bruma.rotation.x = -Math.PI/2;
    bruma.position.set(0, (yTop + yBot)/2 - prof*0.55, zc);
    world.add(bruma);

    /* LABIO de salida: naranja y ancho, para que se vea desde lejos */
    const labio = new THREE.Mesh(new THREE.BoxGeometry(hw*2, 1.0, 2.4),
      new THREE.MeshLambertMaterial({ color: h.grande ? 0xff4d3d : 0xff9a3d }));
    labio.position.set(0, yTop + 0.5, h.z0 + 1);
    world.add(labio);
    /* y una cornisa de roca real asomando por el borde, que remata el corte */
    siembra(world, (ROCAS_POR_PIEL[SKIN] || ROCAS_POR_PIEL.arena)[0], 9, rng, (k, med) => {
      const e2 = (5 + rng()*7) / med.alto;
      const x2 = -hw*0.92 + (hw*1.84) * (k / 8) + (rng()-0.5)*8;
      return { x:x2, y: terrainY(x2, h.z0 + 3) - med.minY*e2 - 1.2, z: h.z0 + 3,
               rotY: rng() * TAU, ex:e2, ey:e2, ez:e2 };
    }, { sombra:true, plano:true });
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
      new THREE.MeshLambertMaterial({ color:PAL.rail }));
    barra.position.set(R.x, (y0 + y1) / 2, (R.z0 + R.z1) / 2);
    barra.rotation.x = Math.atan2(y0 - y1, largo) * -1;
    world.add(barra);
    /* postes del raíl: bandas en la propia caja + tinte por poste, y apoyados
       en el punto más bajo de su pie (si no, en cuesta uno de cada dos flota) */
    const nPost = Math.max(2, Math.round(largo / 12));
    const imP = new THREE.InstancedMesh(_cajaBandas(5, 0.55, 1.45),
      new THREE.MeshLambertMaterial({ color:PAL.railPoste, vertexColors:true, flatShading:true }),
      nPost + 1);
    for(let i = 0; i <= nPost; i++){
      const zz = R.z0 + (R.z1 - R.z0) * (i / nPost);
      const yy = Math.min(terrainY(R.x, zz), terrainY(R.x, zz - 1), terrainY(R.x, zz + 1)) - 0.3;
      p.set(R.x, yy + R.alto/2, zz); q.identity(); s2.set(0.34, R.alto, 0.34);
      m.compose(p, q, s2); imP.setMatrixAt(i, m);
      _tono(rng, c, 0.5); imP.setColorAt(i, c);
    }
    imP.instanceMatrix.needsUpdate = true;
    if(imP.instanceColor) imP.instanceColor.needsUpdate = true;
    world.add(imP);
  }

  /* --- BORDE DEL ABANICO: rocas siguiendo la semianchura --- */
  {
    /* ►BORDE DE LA GARGANTA con las rocas de desierto del juego, instanciadas.
       Se reparten las plazas entre las claves disponibles y cada clave monta
       su propia InstancedMesh: 5 modelos ⇒ un puñado de draw calls para ~900
       rocas, en vez de 900. */
    const CLAVES_ROCA = (K.densRoca > 0.01 ? (ROCAS_POR_PIEL[SKIN] || ROCAS_POR_PIEL.arena) : []);
    const PASO = Math.round(13 / clamp(K.densRoca, 0.2, 2));
    const filas = [];
    for(let z = 120; z > -(K.len + 200); z -= PASO){
      const hw = hwAt(z);
      for(const lado of [-1, 1]) filas.push({ z, hw, lado });
    }
    let nRocas = 0;
    CLAVES_ROCA.forEach((clave, ci) => {
      const mias = filas.filter((_, i) => (i % CLAVES_ROCA.length) === ci);
      nRocas += siembra(world, clave, mias.length, rng, (i, med) => {
        const f = mias[i];
        const alto = 5.5 + rng() * 9;
        const e = alto / med.alto;
        const x = f.lado * (f.hw + med.radio * e * 0.5 + rng() * 5);
        const zz = f.z + (rng() - 0.5) * 9;
        return { x, y: null, z: zz, hundeFrac: 0.20 + rng()*0.14,
                 rotY: rng() * TAU, rx:(rng()-0.5)*0.14, rz:(rng()-0.5)*0.14,
                 ex: e * (0.8 + rng()*0.5), ey: e, ez: e * (0.8 + rng()*0.5) };
      }, { sombra:true, plano:true, tinte:PAL.tinteRoca, tag:'rocaBorde1' });
    });

    /* segunda fila, más lejos y más grande: da masa a la ladera (sin sombra).
       En nieve esta fila cambia de MODELO (PAL.rocasLejos = s6_peak/s6_peak2):
       a 16-42 u de alto y fuera de la pista, las cumbres del mapa de hielo son
       exactamente lo que el juego usa para "montaña que no se pisa", y hacen
       que la garganta se lea como un valle entre picos y no como una zanja. */
    const CLAVES_LEJOS = CLAVES_ROCA.length ? (PAL.rocasLejos || CLAVES_ROCA) : [];
    const filas2 = [];
    for(let z = 120; z > -(K.len + 200); z -= 42){
      const hw = hwAt(z);
      for(const lado of [-1, 1]) if(rng() < 0.8 * K.densRoca) filas2.push({ z, hw, lado });
    }
    CLAVES_LEJOS.forEach((clave, ci) => {
      const mias = filas2.filter((_, i) => (i % CLAVES_LEJOS.length) === ci);
      siembra(world, clave, mias.length, rng, (i, med) => {
        const f = mias[i];
        const alto = 16 + rng() * 26;
        const e = alto / med.alto;
        /* offset RELATIVO al ancho: con +26..60 ABSOLUTO, en los tramos
           estrechos (hw=60) acababan a 1,7-2,0×hw = 45-55 u de ALTURA en el
           cuenco, siluetadas contra el cielo (medido con el audit). */
        const x = f.lado * (f.hw * (1.18 + rng() * 0.22));
        const zz = f.z + (rng() - 0.5) * 16;
        return { x, y: null, z: zz, hundeFrac: 0.24 + rng()*0.16,
                 rotY: rng() * TAU, rx:(rng()-0.5)*0.10, rz:(rng()-0.5)*0.10,
                 ex: e * (0.85 + rng()*0.5), ey: e, ez: e * (0.85 + rng()*0.5) };
      }, { sombra:false, plano:true,
           /* las cumbres del mapa de hielo ya vienen nevadas: se les da el
              tinte SUAVE del telón, no el frío de las rocas de arena */
           tinte: PAL.rocasLejos ? PAL.tintePico : PAL.tinteRoca, tag:'rocaBorde2' });
    });
    console.log('[descenso] borde: ' + nRocas + ' rocas de ' + CLAVES_ROCA.join('/') +
                ' + 2ª fila de ' + CLAVES_LEJOS.join('/'));
  }

  /* --- JALONES DEL LÍMITE: cada 46 u a los dos lados, para que se LEA dónde
         acaba la pista sin necesidad de muro --- */
  {
    const step = 46, n = Math.floor((K.len + 60) / step) * 2;
    /* MULTITONO + MULTITILE: bandas naranja/oscuro en el propio poste y tinte
       por copia. Antes era una caja lisa naranja repetida n veces. */
    const im = new THREE.InstancedMesh(_cajaBandas(6, 0.52, 1.55),
      new THREE.MeshLambertMaterial({ color:PAL.jalon, vertexColors:true, flatShading:true }), n);
    let i = 0;
    for(let k = 0; k < n / 2; k++){
      const z = 20 - k * step, hw = hwAt(z);
      for(const side of [-1, 1]){
        const x = side * hw;
        /* apoyado en el punto MÁS BAJO de su pie: en una ladera de 26-42° un
           poste plantado por su centro deja una pata en el aire */
        const yPie = Math.min(terrainY(x, z), terrainY(x, z - 1.2), terrainY(x, z + 1.2),
                              terrainY(x - 1.2, z), terrainY(x + 1.2, z));
        p.set(x, yPie + 1.5, z); q.identity(); s2.set(0.26, 3.4, 0.26);
        m.compose(p, q, s2); im.setMatrixAt(i, m);
        _tono(rng, c, 0.7); im.setColorAt(i, c); i++;
      }
    }
    im.instanceMatrix.needsUpdate = true;
    if(im.instanceColor) im.instanceColor.needsUpdate = true;
    world.add(im);
  }

  /* --- SEÑALIZACIÓN DE ZONA: en cada cambio de banda, una hilera de jalones
         del color de lo que VIENE, de lado a lado. Es la lectura de "de golpe
         entras en negra". --- */
  {
    const filas = [];
    for(let i = 1; i < BANDS.length; i++) filas.push({ z: BANDS[i].z0, col: ZN[BANDS[i].tipo].col });
    const perFila = 15;
    const im = new THREE.InstancedMesh(_cajaBandas(7, 0.52, 1.45),
      new THREE.MeshLambertMaterial({ color:0xffffff, vertexColors:true, flatShading:true }),
      filas.length * perFila);
    let i = 0;
    const _cz = new THREE.Color();
    for(const f of filas){
      const hw = hwAt(f.z);
      _cz.setHex(f.col);
      for(let k = 0; k < perFila; k++){
        const x = -hw + (2 * hw) * (k / (perFila - 1));
        const yPie = Math.min(terrainY(x, f.z), terrainY(x - 1.5, f.z), terrainY(x + 1.5, f.z));
        p.set(x, yPie + 2.1, f.z); q.identity(); s2.set(0.34, 4.6, 0.34);
        m.compose(p, q, s2); im.setMatrixAt(i, m);
        /* el color de la banda que viene, pero con su variación por poste:
           una hilera de 15 clones idénticos delata el copia-pega */
        _tono(rng, c, 0.6); c.multiply(_cz);
        im.setColorAt(i, c); i++;
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
    const CL = ROCAS_POR_PIEL[SKIN] || ROCAS_POR_PIEL.arena;
    rocks.forEach(o2 => { o2.baseY = terrainY(o2.x, o2.z); });
    CL.forEach((clave, ci) => {
      const mios = rocks.filter((_, i) => (i % CL.length) === ci);
      siembra(world, clave, mios.length, rng, (i, med) => {
        const o2 = mios[i];
        const e = (o2.r * 2.1) / med.alto;
        return { x:o2.x, y:null, z:o2.z, hundeFrac: 0.12 + rng()*0.08,
                 rotY: rng() * TAU, rx:(rng()-0.5)*0.12, rz:(rng()-0.5)*0.12,
                 ex: e * (0.85 + rng()*0.35), ey: e * (0.8 + rng()*0.45), ez: e * (0.85 + rng()*0.35) };
      }, { sombra:true, plano:true, tinte:PAL.tinteRoca, tag:'rocaObst' });
    });
  }

  /* --- RAMPAS / KICKERS ---
     ►RESTAURADO Y AVISO: este bloque (rampas + recogidas + meta) se BORRÓ sin
     querer en la v9 por una edición por índices que se comió el tramo entre
     dos anclajes — tres versiones con rampas INVISIBLES que sí lanzaban (la
     física usa rampAt, no la malla). Recuperado de git (v8) y ahora MULTITONO:
     cada rampa recibe su tono por instancia (instanceColor multiplica el color
     del material del cuerpo). */
  if(ramps.length){
    /* ►KICKERS QUE PISAN LA TIERRA. Toni: "los kickers por detrás no se apoyan
       en la tierra, los tienes flotando una parte por detrás". Literal, y la
       causa es geométrica: la cuña era UNA malla instanciada con la base PLANA
       a la altura del centro (baseY) y escalada por (w, h, len). Pero el
       terreno de esta pista baja entre 11° y 42°, así que en el extremo alto
       —el de salida, el que se ve por detrás al pasar— el suelo ya ha caído
       len/2·tan(pendiente): entre 3 y 15 unidades. Ahí no había nada: aire.
       Instanciar una caja rígida NO puede resolverlo, porque cada rampa cae
       sobre un trozo de ladera distinto.
       Ahora cada kicker se construye con su propia geometría y todas se funden
       en UNA malla (sigue siendo un draw call, sin instancing):
         · la CARA de subida usa la misma fórmula que la física (rampSurfaceY),
           y se levanta hasta el terreno si el terreno va por encima — así la
           entrada se funde con la ladera en vez de quedar enterrada;
         · del PERÍMETRO cuelga un FALDÓN que baja al terreno REAL muestreado
           en ese punto y se hunde 2,5 u más. Por detrás, por los lados y por
           delante: ya no hay hueco por ninguna cara;
         · la cara se subdivide en LOSETAS con tono propio (multitile) y cada
           kicker recibe además su tinte (multitono).

       ►SEGUNDA PASADA (y esto lo enseñó la captura, no el razonamiento): al
       rellenar el hueco aparecía un BLOQUE marrón oscuro de hasta 17 u — el
       labio de un kicker de 6 u sobre una ladera de 35° está de verdad a 14 u
       del suelo, así que esa masa es real y no se puede quitar sin tocar la
       física del salto (que es la que Toni acaba de dar por buena). Lo que sí
       se puede es hacer que se LEA como lo que sería en un desierto: un
       terraplén de arena prensada. Por eso el faldón:
         · va en el color de la ARENA COMPACTA (PAL.hard), no en marrón de
           madera, y así se funde con la duna;
         · se abre hacia abajo (talud) por los lados y por detrás — NUNCA por
           delante: justo debajo del labio es donde se aterriza, y un talud ahí
           te haría caer DENTRO de la malla;
         · se corta en ESTRATOS horizontales con tono propio, que es lo que
           impide que 17 u de pared se lean como una plancha lisa. */
    const NX = 4, NZ = 6, NB = 4, HUNDE = 2.5;
    const vPos = [], vCol = [];
    /* ►MAR · EL KICKER FLOTA. Se hornea con el mar EN CALMA y cada vértice se
       lleva el AMARRE de su kicker (aAncla) y su factor de oleaje: el shader los
       sube y baja enteros con la ola de ese punto. Así la malla vuelve a estar
       donde la física dice que está — que es lo que Toni notaba como "paso por
       debajo de los kickers". */
    const vAnc = [], vFac = [];
    let _anc = [0, 0], _fac = 1;
    const cCara = new THREE.Color(PAL.ramp);
    const cFalda = new THREE.Color(PAL.hard);
    const _t = new THREE.Color();
    const tri3 = (ax,ay,az, bx,by,bz, cx,cy,cz, cc) => {
      vPos.push(ax,ay,az, bx,by,bz, cx,cy,cz);
      for(let k = 0; k < 3; k++){
        vCol.push(cc.r, cc.g, cc.b);
        if(MAR){ vAnc.push(_anc[0], _anc[1]); vFac.push(_fac); }
      }
    };

    for(const o of ramps){
      if(MAR){ _anc = [o.x, o.z]; _fac = olaFacAt(o.z); }
      /* en el mar se hornea SIN oleaje (lo pone el shader con el ancla); en
         tierra, el terreno de siempre */
      const suelo = MAR ? marCalma : terrainY;
      o.baseY = suelo(o.x, o.z);
      const x0 = o.x - o.w/2, zBack = o.z + o.len/2, zFront = o.z - o.len/2;
      /* cara de subida = LA DE LA FÍSICA (rampSurfaceY), sin inventar nada */
      const cara = (x, z) => Math.max(o.baseY + ((zBack - z) / o.len) * o.h,
                                      suelo(x, z) + 0.06);
      /* base del faldón: el terreno de ahí mismo, hundido; nunca por encima
         de la cara (si no, el faldón asomaría por la pista) */
      const pie = (x, z, yTop) => Math.min(suelo(x, z) - HUNDE, yTop - 0.4);
      _tono(rng, _t, 0.9);
      const cc = new THREE.Color();

      /* --- cara superior en losetas --- */
      for(let j = 0; j < NZ; j++){
        for(let i = 0; i < NX; i++){
          const xa = x0 + o.w * (i / NX), xb = x0 + o.w * ((i+1) / NX);
          const za = zBack - o.len * (j / NZ), zb = zBack - o.len * ((j+1) / NZ);
          /* loseta: tono propio + un pelo más claro cuanto más arriba, que es
             lo que hace que se lea la rampa como rampa y no como mancha */
          const lt = 0.90 + 0.20 * _hashCelda(i * 7.3, j * 3.1, o.z * 0.13)
                   + 0.10 * (j / NZ);
          cc.copy(cCara).multiply(_t).multiplyScalar(lt);
          const A = cara(xa, za), B = cara(xb, za), C = cara(xb, zb), D = cara(xa, zb);
          tri3(xa,A,za, xb,B,za, xa,D,zb, cc);
          tri3(xb,B,za, xb,C,zb, xa,D,zb, cc);
        }
      }

      /* --- FALDÓN: recorrido del perímetro con talud y estratos ---
         El perímetro se recorre como una lista de puntos con su vector de
         apertura: hacia fuera en X por los lados, hacia atrás en Z por la
         trasera, y CERO por delante (zona de aterrizaje). */
      const per = [];
      const meteP = (x, z) => {
        const ox = clamp((x - o.x) / (o.w/2), -1, 1);
        const oz = Math.max(0, (z - o.z) / (o.len/2));
        per.push({ x, z, ax: ox * o.w * 0.16, az: oz * o.len * 0.20 });
      };
      for(let i = 0; i <= NX; i++) meteP(x0 + o.w * (i / NX), zBack);          // trasera
      for(let j = 1; j <= NZ; j++) meteP(x0 + o.w, zBack - o.len * (j / NZ));  // lado +x
      for(let i = NX - 1; i >= 0; i--) meteP(x0 + o.w * (i / NX), zFront);     // frente
      for(let j = NZ - 1; j >= 1; j--) meteP(x0, zBack - o.len * (j / NZ));    // lado -x
      per.push(per[0]);                                                        // cerrar
      for(let k = 0; k < per.length - 1; k++){
        const A = per[k], B = per[k+1];
        const tA = cara(A.x, A.z), tB = cara(B.x, B.z);
        const pA = pie(A.x, A.z, tA), pB = pie(B.x, B.z, tB);
        for(let b = 0; b < NB; b++){
          const u0 = b / NB, u1 = (b + 1) / NB;
          /* MEDIDO por CDP: con factor ~1, el píxel del faldón salía 92 sobre
             una arena de 210 — una losa oscura pegada a una duna clarísima.
             Estas caras son casi verticales y con este sol rasante solo les
             llega el hemisférico, así que el albedo tiene que compensar (el
             color de vértice MULTIPLICA, puede pasar de 1 sin problema). */
          const est = 1.62 + 0.16 * _hashCelda(k * 3.7, b * 9.1, o.z * 0.11) - 0.42 * u1;
          cc.copy(cFalda).multiply(_t).multiplyScalar(est);
          /* el talud crece con la profundidad: arriba pega al canto, abajo se
             abre y muere en la duna */
          const P = (pt, yTop, yPie, u) => [ pt.x + pt.ax * u, yTop + (yPie - yTop) * u,
                                             pt.z + pt.az * u ];
          const a0 = P(A, tA, pA, u0), a1 = P(A, tA, pA, u1);
          const b0 = P(B, tB, pB, u0), b1 = P(B, tB, pB, u1);
          tri3(a0[0],a0[1],a0[2], a1[0],a1[1],a1[2], b1[0],b1[1],b1[2], cc);
          tri3(a0[0],a0[1],a0[2], b1[0],b1[1],b1[2], b0[0],b0[1],b0[2], cc);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vPos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(vCol, 3));
    geo.computeVertexNormals();
    /* DoubleSide a propósito: el faldón se genera cara a cara sobre una ladera
       y con la cámara orbitable no hay un "fuera" fiable para todas ellas.
       En r128 el material de dos caras ya invierte la normal en la cara de
       atrás, así que la luz sigue siendo correcta. */
    const matRampa = new THREE.MeshLambertMaterial({
      vertexColors:true, flatShading:true, side:THREE.DoubleSide });
    if(MAR){
      geo.setAttribute('aAncla', new THREE.Float32BufferAttribute(vAnc, 2));
      geo.setAttribute('aOla',   new THREE.Float32BufferAttribute(vFac, 1));
      aplicaOlaShader(matRampa, true);     // ►flota entero con la ola de su amarre
    }
    const malla = new THREE.Mesh(geo, matRampa);
    malla.castShadow = true; malla.receiveShadow = true;
    if(MAR){ malla.frustumCulled = false; malla.userData._olaMode = 'ancla'; }   // el shader lo mueve fuera de su caja
    malla.userData._kickers = ramps.length;      // etiqueta para poder CONTAR en la sonda
    world.add(malla);

    /* LABIO oscuro + jalones: a distancia lo legible es el CANTO. */
    const lip = new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),
      new THREE.MeshLambertMaterial({ color:PAL.lip }), ramps.length);
    ramps.forEach((o, i) => {
      p.set(o.x, o.baseY + o.h, o.z - o.len/2 + 0.5); q.identity(); s2.set(o.w*1.03, 0.55, 1.1);
      m.compose(p, q, s2); lip.setMatrixAt(i, m);
      _tono(rng, c, 0.7);
      lip.setColorAt(i, c);
    });
    lip.instanceMatrix.needsUpdate = true;
    if(lip.instanceColor) lip.instanceColor.needsUpdate = true;
    world.add(lip);

    const post = new THREE.InstancedMesh(_cajaBandas(5, 0.62, 1.45),
      new THREE.MeshLambertMaterial({ color:PAL.jalon, vertexColors:true, flatShading:true }),
      ramps.length*2);
    let pi = 0;
    ramps.forEach(o => { for(const side of [-1,1]){
      p.set(o.x + side*o.w/2, o.baseY + o.h + 1.6, o.z - o.len/2 + 0.5);
      q.identity(); s2.set(0.5, 3.2, 0.5);
      m.compose(p, q, s2); post.setMatrixAt(pi, m);
      _tono(rng, c, 0.55); post.setColorAt(pi, c); pi++;
    }});
    post.instanceMatrix.needsUpdate = true;
    if(post.instanceColor) post.instanceColor.needsUpdate = true;
    world.add(post);
  }

  /* --- ►GLOBOS ---
     UNA InstancedMesh por color: 3 draw calls para los ~250 globos de la pista.
     La forma sale de UNA LatheGeometry (perfil de globo, del nudo a la copa):
     una esfera + un cono serían dos mallas y dos llamadas, y aquí el perfil
     torneado da la silueta buena —panza, hombro y nudo— con una sola.
     El cordel va en la MISMA malla: los últimos puntos del perfil bajan a un
     radio casi cero por debajo del nudo, así que se lee como hilo sin costar
     otra geometría. */
  {
    const perfil = [
      [0.00, 0.00], [0.055, 0.02], [0.055, 0.62],      // el hilo (radio casi 0)
      [0.14, 0.74], [0.34, 0.90],                       // el nudo
      [0.66, 1.20], [0.86, 1.62], [0.90, 2.06],         // la panza
      [0.80, 2.48], [0.52, 2.82], [0.00, 3.00],         // el hombro y la copa
    ].map(p => new THREE.Vector2(p[0], p[1]));
    const geo = new THREE.LatheGeometry(perfil, 12);
    geo.computeVertexNormals();
    const globos = DESC.obst.filter(o => o.type === 'globo');
    DESC.globos = { lista: globos, ims: {}, t: 0 };
    for(const tier in GLOBO){
      const mios = globos.filter(o => o.tier === tier);
      if(!mios.length) continue;
      const g = GLOBO[tier];
      /* emissive suave: un globo tiene que VERSE contra la arena a contraluz,
         pero sin bloom ni material propio (aquí se pinta en Lambert como todo) */
      const mat = new THREE.MeshLambertMaterial({ color: g.col, emissive: g.col, emissiveIntensity: 0.34 });
      const im = new THREE.InstancedMesh(geo, mat, mios.length);
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      im.frustumCulled = false;
      im.castShadow = false; im.receiveShadow = false;
      for(let i = 0; i < mios.length; i++){
        const o = mios[i];
        o._im = im; o._i = i;
        o.y = terrainY(o.x, o.z) + o.dy;
        o.fase = Math.random() * TAU;
        /* ►r128: DARLES instanceColor NO ES DECORATIVO, ES OBLIGATORIO AQUÍ.
           En esta versión la clave de caché de programa NO incluye
           `instancingColor`, así que dos MeshLambertMaterial con los mismos
           PARÁMETROS (los colores son uniforms, no defines) comparten programa
           — y el confeti de globo sí lleva instanceColor. Los globos heredaban
           su programa compilado con USE_INSTANCING_COLOR y three les pedía un
           atributo que era null: `Cannot read properties of null (reading
           'isInterleavedBufferAttribute')` y el frame entero sin pintar.
           Verificado: dárselo lo arregla en el acto.
           Y ya puestos, sirve para el multitono por copia. */
        _c3.setHex(g.col).offsetHSL(0, 0, (Math.random() - 0.5) * 0.10);
        im.setColorAt(i, _c3);
      }
      if(im.instanceColor) im.instanceColor.needsUpdate = true;
      DESC.globos.ims[tier] = im;
      world.add(im);
    }
    DESC.picks = null;
  }

  /* --- META: cruza TODO el abanico ---
     El color sale de la piel y no es un capricho: en arena una meta BLANCA
     recorta perfectamente contra la duna, y en nieve la misma meta blanca
     sobre nieve blanca deja de existir. En nieve va en rojo. */
  {
    const g = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: PAL.meta });
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

  /* --- DECORADO CON PROPS DEL JUEGO (nada inventado), instanciado ---
     Dos capas: LOS LADOS con lo grande (palmeras, cactus columnares) y EL
     MEDIO DE LA PISTA con matojos bajos. Toni: "tampoco hay cactus u otras
     cosas en medio de la pista". Los del medio son pequeños y NO son
     obstáculos: se atraviesan, están para que la pista no sea una sábana. */
  {
    const D = K.densDeco > 0.01 ? (DECOR[SKIN] || DECOR.arena) : { mata:[], borde:[] };

    /* ---- lados: lo alto ---- */
    const sitios = [];
    for(let z2 = -50; z2 > -(K.len - 30); z2 -= (34 + rng() * 30) / clamp(K.densDeco, 0.2, 2)){
      for(const lado of [-1, 1]) if(rng() < 0.62) sitios.push({ z:z2, lado, hw:hwAt(z2) });
    }
    let nBorde = 0;
    D.borde.forEach((clave, ci) => {
      const mios = sitios.filter((_, i) => (i % D.borde.length) === ci);
      nBorde += siembra(world, clave, mios.length, rng, (i, med) => {
        const f = mios[i];
        /* PEGADAS A PISTA (0,70-0,88·hw). A 1,04·hw el cuenco ya las subía
           ~22 u y con las altas (palmeras) se leían FLOTANDO contra el cielo.
           (Aquello, además, tenía OTRA causa detrás: ver ►PALMERAS VOLANDO en
           `siembra` — la malla del modelo caía a 100-280 u de aquí. Se deja el
           margen conservador porque ya está validado.) */
        const x2 = f.lado * (f.hw * (0.70 + rng() * 0.18));
        const zz = f.z + (rng() - 0.5) * 18;
        /* esta capa es "lo grande": a 3,4-8,6 u una palmera se leía como un
           matojo (ahora que caen donde toca, se ven de verdad) */
        const e2 = (7 + rng() * 9) / med.alto;
        return { x:x2, y:null, z:zz, hundeFrac:0.05, rotY: rng() * TAU, ex:e2, ey:e2, ez:e2 };
      }, { sombra:true, tag:'borde' });
    });

    /* ---- EN MEDIO DE LA PISTA: matojos bajos, repartidos por todo el ancho ---- */
    const medio = [];
    for(let z2 = -70; z2 > -(K.len - 30); z2 -= (26 + rng() * 26) / clamp(K.densDeco, 0.2, 2)){
      const hw2 = hwAt(z2);
      const cuantos = 1 + ((rng() * 2.4) | 0);
      for(let k = 0; k < cuantos; k++)
        medio.push({ z: z2 + (rng()-0.5)*12, x: (rng()*2 - 1) * hw2 * 0.94 });
    }
    let nMedio = 0;
    D.mata.forEach((clave, ci) => {
      const mios = medio.filter((_, i) => (i % D.mata.length) === ci);
      nMedio += siembra(world, clave, mios.length, rng, (i, med) => {
        const f = mios[i];
        if(parteAt(f.x, f.z) > 1.5) return null;        // no sobre el espolón
        const pp = pipeAt(f.x, f.z);
        if(pp && pp.mask > 0.25) return null;           // ni dentro de un pipe
        const e2 = (1.1 + rng() * 1.5) / med.alto;      // BAJOS: no tapan la vista
        return { x:f.x, y:null, z:f.z, hundeFrac:0.10, rotY: rng() * TAU, ex:e2, ey:e2, ez:e2 };
      }, { sombra:true, tag:'mata' });
    });

    /* ---- HITOS: raros, grandes y siempre a un lado ----
       Iglú, muñeco de nieve y trineo. Van cada ~400 u y solo uno por sitio: son
       para levantar la vista un momento al pasar, no para poblar la ladera. Con
       la densidad de `borde` dejarían de sorprender a la tercera vez. */
    let nHito = 0;
    if(D.hito && D.hito.length){
      const hitos = [];
      for(let z2 = -220; z2 > -(K.len - 120); z2 -= (330 + rng() * 220) / clamp(K.densDeco, 0.3, 2))
        hitos.push({ z:z2, lado: rng() < 0.5 ? -1 : 1, hw:hwAt(z2) });
      D.hito.forEach((clave, ci) => {
        const mios = hitos.filter((_, i) => (i % D.hito.length) === ci);
        nHito += siembra(world, clave, mios.length, rng, (i, med) => {
          const f = mios[i];
          const x2 = f.lado * (f.hw * (0.78 + rng() * 0.14));
          const e2 = (3.4 + rng() * 2.2) / med.alto;
          return { x:x2, y:null, z:f.z + (rng()-0.5)*20, hundeFrac:0.08,
                   rotY: rng() * TAU, ex:e2, ey:e2, ez:e2 };
        }, { sombra:true, fuerza:0.45, tag:'hito' });
      });
    }
    console.log('[descenso] decorado: ' + nBorde + ' a los lados (' + D.borde.join('/') +
                ') + ' + nMedio + ' en pista (' + D.mata.join('/') + ')' +
                (nHito ? ' + ' + nHito + ' hitos (' + D.hito.join('/') + ')' : ''));
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

  /* --- CONFETI DE GLOBO (pool propio: el color ES la información) --- */
  {
    const N = 96;
    const im = new THREE.InstancedMesh(new THREE.TetrahedronGeometry(1, 0),
      new THREE.MeshLambertMaterial({ vertexColors:false, emissiveIntensity:0.5 }), N);
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    im.frustumCulled = false;
    /* r128: instanceColor NACE con el tamaño de this.count → hay que sembrarlo
       con el cupo COMPLETO antes de tocar nada, o las copias salen negras */
    for(let i = 0; i < N; i++){ im.setColorAt(i, _c3.setHex(0xffffff)); _m4.makeScale(0,0,0); im.setMatrixAt(i, _m4); }
    im.instanceColor.needsUpdate = true; im.instanceMatrix.needsUpdate = true;
    world.add(im);
    DESC.pop = { im, N, i:0,
      x:new Float32Array(N), y:new Float32Array(N), z:new Float32Array(N),
      vx:new Float32Array(N), vy:new Float32Array(N), vz:new Float32Array(N),
      life:new Float32Array(N), col:new Uint32Array(N), _on:new Uint8Array(N) };
  }

  /* --- RASTRO DE LA TABLA --- */
  {
    const N = K.trailN;
    const im2 = new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),
      /* 0,5 de opacidad se leía como CRISTAL con la cámara baja del hombro y
         el sol rasante: el surco debe insinuarse, no brillar */
      new THREE.MeshBasicMaterial({ color:PAL.trail, transparent:true, opacity:0.28, depthWrite:false }), N);
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

  /* --- RÁFAGAS DE ARENA (tormenta suave) ---
     Láminas MUY alargadas y casi transparentes que cruzan en la dirección del
     viento a distinta altura: es lo que da la lectura de "tormenta de arena"
     sin comerse la visibilidad (Toni: "como el stage del desierto, no tan
     fuerte"). Mismo patrón de reciclado por caja que el polvo. */
  {
    const N = Math.round(K.rafagasN * clamp(K.densDeco, 0, 1.5));
    if(N > 0){
      const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.05, 0.16),
        new THREE.MeshBasicMaterial({ color: PAL.part, transparent:true,
                                      opacity: K.rafagasOp, depthWrite:false }), N);
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      im.frustumCulled = false;
      im.renderOrder = 2;
      sc.add(im);
      const R = { im, N,
        x:new Float32Array(N), y:new Float32Array(N), z:new Float32Array(N),
        l:new Float32Array(N), f:new Float32Array(N) };
      const rr2 = mulberry32(DESC.seed ^ 0x7a44);
      for(let i = 0; i < N; i++){
        R.x[i] = (rr2()*2-1) * 90; R.y[i] = 2 + rr2() * 26; R.z[i] = (rr2()*2-1) * 90;
        R.l[i] = 22 + rr2() * 38; R.f[i] = rr2() * TAU;
      }
      DESC.rafagas = R;
    } else DESC.rafagas = null;
  }

  /* --- POLVO AMBIENTE --- */
  {
    const N = Math.round(K.polvoN * clamp(K.densDeco, 0, 1.5));
    if(N > 0){
      const im2 = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 5, 4),
        new THREE.MeshBasicMaterial({ color: PAL.part, transparent:true,
                                      opacity: K.polvoOp, depthWrite:false }), N);
      im2.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      im2.frustumCulled = false;
      im2.renderOrder = 2;
      sc.add(im2);                       // en la ESCENA: vive alrededor de la cámara
      const P = { im: im2, N,
        x:new Float32Array(N), y:new Float32Array(N), z:new Float32Array(N),
        s:new Float32Array(N), f:new Float32Array(N) };
      const rp = mulberry32(DESC.seed ^ 0x9d05);
      for(let i = 0; i < N; i++){
        P.x[i] = (rp()*2-1) * K.polvoCaja;
        P.y[i] = (rp()*2-1) * K.polvoCaja * 0.4;
        P.z[i] = (rp()*2-1) * K.polvoCaja;
        /* motas PEQUEÑAS: en arena es bruma, no pedrisco. En nieve suben algo
           (K.polvoTam) porque un copo tiene que verse, pero poco: un copo
           grande a 3 u de la cámara se lee como una bola de nieve flotando. */
        P.s[i] = K.polvoTam[0] + rp() * (K.polvoTam[1] - K.polvoTam[0]);
        P.f[i] = rp() * TAU;             // fase para la ondulación
      }
      DESC.polvo = P;
    } else DESC.polvo = null;
  }

  DESC.scene = sc;
  DESC.cam = new THREE.PerspectiveCamera(K.fovBase, innerWidth / innerHeight, 0.5, 5000);
  return sc;
}

/* =====================================================================
   ►SONIDO — sintetizado con WebAudio, SIN assets

   El minijuego era MUDO, y en un juego de velocidad el sonido es la mitad de
   la sensación: el viento que crece con la velocidad dice "voy rápido" mejor
   que cualquier blur. Todo se sintetiza (ruido filtrado + osciladores):
     · VIENTO en dos capas: grave (lowpass, siempre) + silbido (bandpass, solo
       a mucha velocidad).
     · CARVE: ruido medio cuya ganancia sigue la fuerza de canto — se OYE
       cuánto estás apretando.
     · GRIND: zumbido metálico mientras vas en el raíl.
     · Golpes (aterrizaje/choque), ding de truco que SUBE con el combo,
       swoosh de salto/turbo y bips de salida.
   Solo suena el JUGADOR HUMANO. Master en K.vol (0 = mudo).
   ===================================================================== */
const SND = { ctx:null, on:false };
function sndInit(){
  if(SND.ctx || !K.vol) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return;
    const ctx = new AC();
    const master = ctx.createGain(); master.gain.value = K.vol; master.connect(ctx.destination);
    /* búfer de ruido blanco de 2 s, compartido por todos los lazos */
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for(let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    function lazo(tipo, f0, q){
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const fil = ctx.createBiquadFilter(); fil.type = tipo; fil.frequency.value = f0; fil.Q.value = q;
      const g = ctx.createGain(); g.gain.value = 0;
      src.connect(fil); fil.connect(g); g.connect(master); src.start();
      return { fil, g };
    }
    SND.wind  = lazo('lowpass', 220, 0.6);
    SND.silb  = lazo('bandpass', 1700, 0.9);
    SND.carve = lazo('bandpass', 520, 1.1);
    SND.grind = lazo('bandpass', 2300, 7);
    SND.ctx = ctx; SND.master = master; SND.buf = buf; SND.on = true;
  } catch(e){ /* sin audio no se rompe nada */ }
}
/* golpe sordo: seno que cae + ráfaga de ruido grave */
function sndThump(fuerza){
  if(!SND.on) return;
  const c = SND.ctx, t = c.currentTime, v = clamp(fuerza, 0.1, 1);
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(110, t);
  o.frequency.exponentialRampToValueAtTime(38, t + 0.16);
  g.gain.setValueAtTime(0.7 * v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  o.connect(g); g.connect(SND.master); o.start(t); o.stop(t + 0.22);
  sndRafagaSnd(300, 0.14, 0.5 * v);
}
function sndRafagaSnd(freq, dur, vol){
  if(!SND.on) return;
  const c = SND.ctx, t = c.currentTime;
  const src = c.createBufferSource(); src.buffer = SND.buf;
  const fil = c.createBiquadFilter(); fil.type = 'lowpass'; fil.frequency.value = freq;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(fil); fil.connect(g); g.connect(SND.master);
  src.start(t); src.stop(t + dur + 0.02);
}
/* ding de truco: dos senos en quinta; el combo sube el tono */
function sndDing(combo){
  if(!SND.on) return;
  const c = SND.ctx, t = c.currentTime;
  const base = 660 * Math.pow(1.19, Math.min(combo || 0, 5));
  [[base, 0], [base * 1.5, 0.07]].forEach(par => {
    const f = par[0], dt2 = par[1];
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.28, t + dt2);
    g.gain.exponentialRampToValueAtTime(0.001, t + dt2 + 0.30);
    o.connect(g); g.connect(SND.master); o.start(t + dt2); o.stop(t + dt2 + 0.32);
  });
}
function sndSwoosh(){ sndRafagaSnd(1400, 0.24, 0.30); }
function sndBip(f, dur, vol){
  if(!SND.on) return;
  const c = SND.ctx, t = c.currentTime;
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'square'; o.frequency.value = f;
  g.gain.setValueAtTime(vol || 0.16, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + (dur || 0.12));
  o.connect(g); g.connect(SND.master); o.start(t); o.stop(t + (dur || 0.12) + 0.02);
}
/* lazos continuos: se ajustan cada frame con el estado del humano */
function updateAudio(dt){
  if(!SND.on) return;
  const r = DESC.racers[0]; if(!r) return;
  const k = clamp(r.spd / K.velMax, 0, 1);
  const st = (x, v, tc) => x.setTargetAtTime(v, SND.ctx.currentTime, tc || 0.08);
  st(SND.wind.fil.frequency, 200 + 950 * k);
  st(SND.wind.g.gain, DESC.phase === 'race' ? 0.06 + 0.46 * Math.pow(k, 1.6) : 0.03);
  st(SND.silb.g.gain, Math.max(0, k - 0.62) * 0.9);
  const tallando = (!r.air && !r.grind && r.fall <= 0)
    ? clamp((r._carveF || 0) / 70 + r.skid * 0.12, 0, 0.55) * clamp(r.spd / 30, 0, 1) : 0;
  st(SND.carve.g.gain, tallando, 0.05);
  st(SND.grind.g.gain, r.grind ? 0.4 : 0, 0.03);
  /* eventos por FLANCO (comparando con el frame anterior) */
  const S = DESC._snd || (DESC._snd = { air:false, turbo:false, grind:false, trickT:0, fase:'', cuenta:9 });
  if(r.air && !S.air && r.vy > 6) sndSwoosh();
  if(!r.air && S.air) sndThump(clamp((DESC._impacto || 8) / 30, 0.15, 1));
  if(r.turbo && !S.turbo) sndRafagaSnd(2400, 0.3, 0.22);
  if(r.grind && !S.grind){ sndBip(2100, 0.06, 0.2); sndBip(2600, 0.06, 0.14); }
  if((r._lastTrickT || 0) > S.trickT + 0.5) sndDing(r.combo);
  /* ►DESCINTRO: el bip de la cuenta cuelga de lo que QUEDA de presentación (el
     mismo reloj que los números y el travelling), no de un contador propio */
  if(DESC.phase === 'intro' && DESC._introGo){
    const n = Math.ceil(INTRO.dur - DESC.introT);
    if(n !== S.cuenta && n > 0 && n <= 3){ sndBip(560, 0.11); S.cuenta = n; }
  }
  if(DESC.phase === 'finish' && S.fase === 'race'){ sndDing(0); sndDing(2); }
  S.air = r.air; S.turbo = r.turbo; S.grind = !!r.grind;
  S.trickT = r._lastTrickT || 0; S.fase = DESC.phase;
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
      _v3 = new THREE.Vector3(), _sc3 = new THREE.Vector3(), _eu = new THREE.Euler(),
      _c3 = new THREE.Color();

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

/* ►GLOBOS: flotar y reventar.
   Los globos NO se ocultan poniéndoles visible=false uno a uno (van todos en
   una InstancedMesh): el cogido se escala a 0 en su matriz, que es la forma de
   apagar una copia. */
function updateGlobos(dt){
  const G = DESC.globos; if(!G) return;
  G.t += dt;
  const zc = DESC.racers && DESC.racers[0] ? DESC.racers[0].z : 0;
  let toca = false;
  for(const o of G.lista){
    if(!o._im) continue;
    /* fuera de la ventana visible (o ya cogido) se ESCALA A 0: son ~480 globos
       y la InstancedMesh no se puede frustum-cullear por copia, así que sin
       esto se rasterizarían los 480 en cada frame. Escalados a 0 son
       triángulos degenerados: el rasterizador los descarta. */
    const fuera = o.taken || Math.abs(o.z - zc) > 300;
    if(fuera){
      if(!o._off){ o._off = true; _m4.makeScale(0,0,0); o._im.setMatrixAt(o._i, _m4); toca = true; }
      continue;
    }
    o._off = false;
    const b = Math.sin(G.t * 1.7 + o.fase);
    _v3.set(o.x + b * 0.35, o.y + b * 0.55, o.z);
    _qt.setFromEuler(_eu.set(b * 0.09, G.t * 0.5 + o.fase, b * 0.13));
    _sc3.setScalar(o.tier === 'amarillo' ? 1.5 : o.tier === 'rojo' ? 1.3 : 1.15);
    _m4.compose(_v3, _qt, _sc3);
    o._im.setMatrixAt(o._i, _m4);
    toca = true;
  }
  if(toca) for(const t in G.ims) G.ims[t].instanceMatrix.needsUpdate = true;
}

/* pinchazo: confeti DEL COLOR DEL GLOBO. Pool propio con instanceColor porque
   el de arena tiene un único color de material y aquí el color ES la
   información (qué globo has cogido). */
function popGlobo(o){
  const P = DESC.pop; if(!P) return;
  const col = GLOBO[o.tier].col;
  for(let k = 0; k < 12; k++){
    const i = P.i = (P.i + 1) % P.N;
    const a = Math.random() * TAU, e = Math.random() * 1.6 - 0.2;
    P.x[i]=o.x; P.y[i]=o.y; P.z[i]=o.z;
    P.vx[i]=Math.cos(a)*(3+Math.random()*7); P.vy[i]=4+e*5; P.vz[i]=Math.sin(a)*(3+Math.random()*7);
    P.life[i]=0.5+Math.random()*0.4; P.col[i]=col;
    _c3.setHex(col); P.im.setColorAt(i, _c3);
  }
  if(P.im.instanceColor) P.im.instanceColor.needsUpdate = true;
}
function updatePop(dt){
  const P = DESC.pop; if(!P) return;
  let vivo = false;
  for(let i = 0; i < P.N; i++){
    if(P.life[i] <= 0){ if(P._on[i]){ P._on[i]=0; _m4.makeScale(0,0,0); P.im.setMatrixAt(i, _m4); vivo = true; } continue; }
    P._on[i] = 1; vivo = true;
    P.life[i] -= dt;
    P.vy[i] -= K.grav * 0.5 * dt;
    P.x[i] += P.vx[i]*dt; P.y[i] += P.vy[i]*dt; P.z[i] += P.vz[i]*dt;
    _v3.set(P.x[i], P.y[i], P.z[i]);
    _qt.setFromEuler(_eu.set(P.x[i], P.y[i]*2, P.z[i]));
    _sc3.setScalar(0.42 * clamp(P.life[i] * 2.4, 0, 1));
    _m4.compose(_v3, _qt, _sc3);
    P.im.setMatrixAt(i, _m4);
  }
  if(vivo) P.im.instanceMatrix.needsUpdate = true;
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

/* POLVO AMBIENTE: deriva con viento lateral + caída lenta, en coordenadas
   RELATIVAS a la cámara con reciclado por caja envolvente (la mota que sale
   por un lado entra por el contrario: nunca se ve nacer ni morir). */
function updateRafagas(dt){
  const R = DESC.rafagas; if(!R || !DESC.cam) return;
  const C = 90;
  for(let i = 0; i < R.N; i++){
    R.x[i] += (K.polvoViento * 2.6 + Math.sin(DESC.t * 0.6 + R.f[i]) * 6) * dt;
    R.z[i] += (K.polvoViento * 1.4) * dt;
    if(R.x[i] > C) R.x[i] -= 2*C; if(R.z[i] > C) R.z[i] -= 2*C;
    if(R.x[i] < -C) R.x[i] += 2*C; if(R.z[i] < -C) R.z[i] += 2*C;
    _v3.set(DESC.cam.position.x + R.x[i], DESC.cam.position.y + R.y[i] - 8, DESC.cam.position.z + R.z[i]);
    /* orientada con el viento (diagonal fija + ondulación leve) */
    _qt.setFromEuler(_eu.set(0, -0.5 + Math.sin(DESC.t * 0.4 + R.f[i]) * 0.12, 0));
    _sc3.set(R.l[i], 1, 1);
    _m4.compose(_v3, _qt, _sc3);
    R.im.setMatrixAt(i, _m4);
  }
  R.im.instanceMatrix.needsUpdate = true;
}

function updatePolvo(dt){
  const P = DESC.polvo; if(!P || !DESC.cam) return;
  const C = K.polvoCaja;
  const t = DESC.t;
  for(let i = 0; i < P.N; i++){
    P.x[i] += (K.polvoViento * 0.6 + Math.sin(t * 0.7 + P.f[i]) * 3.5) * dt;
    /* ►NEVADA. La única diferencia entre el polvo del desierto y una nevada es
       CUÁNTO CAE la mota: en arena K.polvoCae vale 1,1 (flota y deriva) y en
       nieve 7 (cae, y el bamboleo se lee como copo dando tumbos). Mismo pool,
       mismo reciclado, mismo coste. */
    P.y[i] += (-K.polvoCae + Math.cos(t * 0.9 + P.f[i]) * 0.8) * dt;
    P.z[i] += (K.polvoViento + Math.sin(t * 0.5 + P.f[i] * 2) * 2.5) * dt;
    if(P.x[i] >  C) P.x[i] -= 2*C; if(P.x[i] < -C) P.x[i] += 2*C;
    if(P.z[i] >  C) P.z[i] -= 2*C; if(P.z[i] < -C) P.z[i] += 2*C;
    const CY = C * 0.4;
    if(P.y[i] >  CY) P.y[i] -= 2*CY; if(P.y[i] < -CY) P.y[i] += 2*CY;
    _v3.set(DESC.cam.position.x + P.x[i], DESC.cam.position.y + P.y[i], DESC.cam.position.z + P.z[i]);
    _qt.identity();
    _sc3.setScalar(P.s[i]);
    _m4.compose(_v3, _qt, _sc3);
    P.im.setMatrixAt(i, _m4);
  }
  P.im.instanceMatrix.needsUpdate = true;
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
    o.frustumCulled = false; o.castShadow = true; o.receiveShadow = true;
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

  /* --- clips ---
     board/wipeout/getup/turbo/carve vienen inyectados por merge.js para el
     descenso; 'jump' es EL DEL JUEGO NORMAL (ya vivía en el GLB de cada clase
     — petición de Toni: reutilizarlo para el salto). */
  r.mixer = new THREE.AnimationMixer(model);
  r.acts = {};
  for(const nom of ['board', 'wipeout', 'getup', 'turbo', 'carve', 'carveM', 'jump']){
    const c = (tpl.animations || []).find(a => a.name === nom);
    if(c){ const a = r.mixer.clipAction(c); a.enabled = true; r.acts[nom] = a; r.dur = r.dur || {}; r.dur[nom] = c.duration; }
  }
  if(r.acts.wipeout){ r.acts.wipeout.setLoop(THREE.LoopOnce, 1); r.acts.wipeout.clampWhenFinished = true; }
  if(r.acts.getup){   r.acts.getup.setLoop(THREE.LoopOnce, 1);   r.acts.getup.clampWhenFinished = true; }
  /* el salto se queda clavado en su último frame hasta aterrizar */
  if(r.acts.jump){    r.acts.jump.setLoop(THREE.LoopOnce, 1);    r.acts.jump.clampWhenFinished = true; }
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

  if(KITE_ON) kiteMonta(r);   // ►KITE: barra + vela + líneas (solo en la piel de mar)
}

/* Cambia de clip con fundido. Los de una sola pasada se reinician al entrar. */
function animA(r, nom){
  if(!r.acts || !r.acts[nom] || r.animCur === nom) return;
  const nuevo = r.acts[nom], viejo = r.acts[r.animCur];
  nuevo.reset(); nuevo.enabled = true; nuevo.setEffectiveWeight(1); nuevo.play();
  if(viejo && viejo !== nuevo) viejo.crossFadeTo(nuevo, K.animFade, false);
  r.animCur = nom;
}

/* ►MÁQUINA DE ESTADOS DE ANIMACIÓN (una decisión por frame, en orden de
   prioridad). La caída NO se decide aquí: fall() y su cadena wipeout→getup
   mandan mientras r.fall > 0. El salto usa el clip 'jump' DEL JUEGO NORMAL
   (petición de Toni), turbo y carve son los Crouch de Mixamo.
   ►AIRPOSE (petición de Toni): en SANDBOARD y SNOWBOARD el aire NO cambia de
   pose — se sigue surfeando con la misma animación que en el suelo. El corte a
   'jump' se veía como un cambio sin motivo cada vez que despegabas de un lomo.
   El surf (piel de mar) se queda con el clip de salto, que ahí sí es un salto. */
function animEstado(r){
  if(!r.montado || r.fall > 0) return;
  /* con KITE el aire tampoco cambia de pose: vas colgado de la barra, no
     saltando. Sin kite (`?kite=0`), el mar conserva su clip de salto. */
  if(r.air && SKIN === 'mar' && !KITE_ON) animA(r, 'jump');  // animA ya reinicia al entrar
  else if(r.grind)          animA(r, 'board');
  else if(r.turbo)          animA(r, 'turbo');
  /* ►EL CLIP DE GIRO Y SU LADO — CERRADO CON UNA MEDIDA, no con un argumento.
     Toni lo ha pedido TRES veces ("la de la izquierda va a la derecha").
     Medido leyendo el hueso de la cabeza en el espacio de la TABLA (r.body),
     donde +X es la derecha de la pantalla yendo recto, y restando la postura
     de 'board' (+0,07..+0,16):
         carve   → cabeza en -0,31 / -0,25 / -0,20  ⇒ se inclina a la IZQUIERDA
         carveM  → cabeza en +0,31 / +0,25 / +0,20  ⇒ se inclina a la DERECHA
     Y yaw>0 es girar a la DERECHA (ax=+1 → wantYaw=+steerMax → fx=sin(yaw)>0).
     O sea que "inclinarse hacia dentro del giro" daba carveM a la derecha, que
     es lo que había y lo que Toni ve MAL: con la postura procedural encima
     (model.rotation.y contra-gira el torso y body.rotation.z ya tumba hacia el
     lado del giro) el clip que LEE bien es el del lado contrario. Manda lo que
     se ve. Si algún día se vuelve a tocar: mídelo así, no lo razones. */
  /* CANTO CLAVADO (Q/E) o giro MUY pronunciado: los dos piden el crouch
     (Toni). El canto manda sobre `_cruce` porque se nota antes de que la tabla
     llegue a cruzarse del todo — que es justo la sensación de clavar canto. */
  else if(r._canto)               animA(r, r._canto > 0 ? 'carve' : 'carveM');
  else if((r._cruce || 0) > 0.45) animA(r, r.yaw >= 0 ? 'carve' : 'carveM');
  else                      animA(r, 'board');
}

/* =====================================================================
   ►KITE — KITESURF en la piel de MAR

   La idea es de Toni: en el mar, el rider lleva una BARRA cogida con las dos
   manos y de ahí salen las líneas de una vela.

   NO se tocan los clips. Los clips board/turbo/carve son los MISMOS que usan
   sandboard y snowboard (se inyectaron por nombre de hueso en las 6 clases);
   duplicarlos para el mar significaría rehacer el pipeline de Blender entero
   por dos brazos. En su lugar, DESPUÉS de `mixer.update` se sobrescriben los
   cuatro huesos de los brazos con un IK de dos eslabones que lleva las manos a
   la barra. El resto de la pose (torso, piernas, el crouch del turbo, el carve)
   sigue saliendo del clip, intacta.

   Esto se puede hacer porque:
     · los clips del descenso son SOLO canales de rotación → escribir el
       quaternion de un hueso no pelea con nada,
     · cada corredor tiene su propio esqueleto (SkeletonUtils.clone), así que
       escribir huesos no contamina la plantilla del juego,
     · las 6 clases comparten rig Mixamo (medido: 41 huesos, mismos nombres).

   Nada de números por clase: la barra se coloca a partir de los huesos MEDIDOS
   de cada modelo al montarlo (alcance de brazo 0,69-0,76 u según la clase), y
   el lado de cada mano se decide comparando sus coordenadas, no suponiéndolo.
   ===================================================================== */
const KITE = {
  alto:      8.6,    // altura de la vela sobre el rider
  dist:      4.6,    // cuánto se adelanta (va hacia -Z, que es "delante")
  ladeo:     4.2,    // cuánto se va la vela hacia el lado del giro
  altoAire:  2.2,    // ...y cuánto sube cuando estás en el aire (te levanta)
  /* TAMAÑO: un kite real anda por 4-6 veces la envergadura de quien lo lleva.
     Con R 3,1 la vela medía 5,7 u contra un rider de 2 y parecía una cometa de
     playa; con 4,6 salen ~8,5 u de punta a punta, que es la proporción buena. */
  R:         4.6,    // radio del arco de la vela
  arco:      3.0,    // apertura del arco, en radianes (con 2,5 leía como un cilindro; a 3 las puntas ya caen hacia el rider)
  cuerda:    2.6,    // fondo de la vela (borde de ataque → borde de fuga)
  barraAdel: 0.62,   // separación de la barra al pecho, en ALCANCES de brazo
  barraBaja: 0.20,   // ...y cuánto cuelga por debajo de la línea de hombros
  barraAncho:0.85,   // ancho de la barra, TAMBIÉN en alcances de brazo (ver kiteMonta)
  fade:      7,      // velocidad con la que se coge/suelta la barra
  /* postura de la vela (ver updateKite): va DE PIE, no mirando al rider */
  pitch:    -0.72,   // cuánto se inclina el arco HACIA DELANTE (Toni pidió más)
  yawLadeo:  0.55,   // cuánto gira en horizontal hacia el lado del giro
  rollLadeo: 0.35,   // ...y cuánto se tumba con él
};

/* --- la vela: arco tipo "C" con panza, franjas del color de la clase --- */
function kiteVela(col){
  /* ►TILES CUADRADOS, SIN DEGRADADO (Toni). Antes la vela era una rejilla con
     vértices COMPARTIDOS: el color se interpolaba entre franjas y salía un
     degradado. Ahora cada casilla lleva sus cuatro vértices propios y un color
     plano, en tablero de ajedrez entre el color de la clase y el blanco. Con
     `flatShading` tampoco la luz mete gradientes dentro de la casilla. */
  const NU = 16, NV = 4, pos = [], color = [];
  const c1 = new THREE.Color(col), c2 = new THREE.Color(0xf2f6ff);
  /* ►LA VELA IBA AL REVÉS (Toni). El arco estaba en el plano frontal y la cuerda
     salía recta hacia atrás: eso es un cilindro cortado, no un kite. Un kite se
     ARQUEA HACIA EL RIDER — las puntas se vienen hacia ti. Ese arqueo es el
     término en z. El -0,72·R centra el arco en el origen del grupo. */
  const P = (u, v) => {
    const ang = (u - 0.5) * KITE.arco;
    const ch = KITE.cuerda * (0.45 + 0.55 * Math.cos(ang * 0.85));
    return [KITE.R * Math.sin(ang),
            KITE.R * Math.cos(ang) - KITE.R * 0.72 - ch * v * v * 0.30,
            ch * v + KITE.R * (1 - Math.cos(ang)) * 0.62];
  };
  for(let iu = 0; iu < NU; iu++) for(let iv = 0; iv < NV; iv++){
    const u0 = iu / NU, u1 = (iu + 1) / NU, v0 = iv / NV, v1 = (iv + 1) / NV;
    const A = P(u0, v0), B = P(u1, v0), C = P(u1, v1), D = P(u0, v1);
    const cc = ((iu + iv) % 2 === 0) ? c1 : c2;
    for(const t of [A, B, D, B, C, D]){
      pos.push(t[0], t[1], t[2]);
      color.push(cc.r, cc.g, cc.b);
    }
  }
  const puntosBorde = [];
  for(let iu = 0; iu <= NU; iu++) puntosBorde.push(P(iu / NU, 0));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color',    new THREE.Float32BufferAttribute(color, 3));
  g.computeVertexNormals();
  const vela = new THREE.Mesh(g, new THREE.MeshLambertMaterial({
    vertexColors:true, side:THREE.DoubleSide, flatShading:true }));
  vela.frustumCulled = false;

  /* borde de ataque inflado: es lo que hace que se lea como un kite y no como
     un trozo de tela. Va sobre la fila v=0 de la propia vela, no inventado. */
  const puntos = puntosBorde.map(t => new THREE.Vector3(t[0], t[1], t[2]));
  const tubo = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(puntos), 24, 0.14, 6, false),
    new THREE.MeshLambertMaterial({ color: col }));
  tubo.frustumCulled = false;
  const g2 = new THREE.Group();
  g2.add(vela); g2.add(tubo);
  /* ANCLAS de las líneas, en local: la punta de cada lado y un punto algo más
     adentro (un kite lleva cuatro líneas, no dos) */
  g2.userData.puntas = [[puntos[0].clone(), puntos[3].clone()],
                        [puntos[NU].clone(), puntos[NU - 3].clone()]];
  return g2;
}

/* --- montaje: mide el rig del modelo y cuelga barra, vela y líneas --- */
function kiteMonta(r){
  const B = {};
  r.model.traverse(o => { if(o.isBone) B[o.name] = o; });
  const hI = B.mixamorigLeftArm,  fI = B.mixamorigLeftForeArm,  mI = B.mixamorigLeftHand;
  const hD = B.mixamorigRightArm, fD = B.mixamorigRightForeArm, mD = B.mixamorigRightHand;
  if(!hI || !fI || !mI || !hD || !fD || !mD){ console.warn('[kite] rig sin brazos:', r.clase); return; }

  r.gfx.updateMatrixWorld(true);
  /* ►LA BARRA CUELGA DEL `body`, NO DEL MODELO. Primero la colgué del modelo
     dando por hecho que "delante = +Z" (los chars del juego miran a +Z). MEDIDO:
     no vale para todos los GLB — con esa suposición el hombro derecho del
     voxelhero quedaba a 1,019 u de su agarre con 0,690 de alcance (y el del
     caballero a 0,964 con 0,763), o sea el brazo no llegaba ni estirado,
     mientras samurái y arquera clavaban 0,000. Cada GLB trae su propia
     orientación interna; el `body` es común a todos. */
  const local = o => r.body.worldToLocal(o.getWorldPosition(new THREE.Vector3()));
  const pI = local(hI), pD = local(hD), pcI = local(fI), pmI = local(mI);
  const alcance = pI.distanceTo(pcI) + pcI.distanceTo(pmI);   // brazo estirado

  /* ►LA BASE DEL PECHO SALE DEL RIG, no de los ejes del body, y se recalcula
     CADA FRAME (ver kiteSitúaBarra). Tres medidas lo obligaron:
       · el ANCHO no puede venir de la separación de hombros: el clip 'board'
         los abre, y salía una barra de 1,25 u (el brazo mide 0,69) con los
         agarres tan separados que las manos no llegaban;
       · "delante" tampoco es -Z del body: el torso va girado respecto al board
         (charYaw + el contragiro al cruzar), así que empujar la barra en -Z la
         acercaba a un hombro y la alejaba del otro;
       · y sobre todo: colocarla UNA VEZ al montar no vale. `kiteMonta` corre
         con el modelo en bind pose, y en cuanto suena 'board' el torso se pone
         de lado sobre la tabla: un hombro se iba a 0,90 del agarre (alcance
         0,69) y el otro se quedaba a 0,32. Por eso la barra sigue a los
         hombros: es donde el cuerpo la sostiene, no un punto fijo del body. */
  const ancho = alcance * KITE.barraAncho;             // la barra se mide en BRAZOS

  const barra = new THREE.Group();
  barra.rotation.order = 'YXZ';
  const tubo = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, ancho, 8),
                              new THREE.MeshLambertMaterial({ color:0x2b3038 }));
  tubo.rotation.z = Math.PI / 2;                     // a lo largo de X
  barra.add(tubo);
  const gomaMat = new THREE.MeshLambertMaterial({ color:0x11151b });
  for(const s of [-1, 1]){
    const puno = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, ancho * 0.30, 8), gomaMat);
    puno.rotation.z = Math.PI / 2; puno.position.x = s * ancho * 0.34;
    barra.add(puno);
  }
  r.body.add(barra);

  /* el +X de la barra se alinea con el eje hombro-izquierdo→hombro-derecho (lo
     hace kiteSitúaBarra), así que el agarre de +X es el de la mano derecha: no
     hay nada que adivinar sobre la orientación del GLB */
  const agarreI = new THREE.Object3D(), agarreD = new THREE.Object3D();
  agarreD.position.x =  ancho * 0.34;
  agarreI.position.x = -ancho * 0.34;
  barra.add(agarreI); barra.add(agarreD);

  const vela = kiteVela(colorDe(r.clase, r.i));
  r.gfx.add(vela);

  /* 4 líneas (2 por lado): de cada agarre a cada punta de la vela */
  const lgeo = new THREE.BufferGeometry();
  lgeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(8 * 3), 3));
  /* OSCURAS a propósito: en WebGL una línea es de 1 px pase lo que pase
     (linewidth no hace nada), así que lo único que las salva contra un cielo
     claro es el contraste — en claro no se veían en la captura. */
  const lineas = new THREE.LineSegments(lgeo, new THREE.LineBasicMaterial({ color:0x1b2026 }));
  lineas.frustumCulled = false;
  /* ►A LA ESCENA, NO AL `world`. Los vértices se escriben en coordenadas de
     MUNDO, y `DESC.world` está ROTADO -7° (la pendiente de la pista): metidas
     ahí, las líneas se reinterpretan como locales y a 2.000 u de la salida eso
     las manda a cientos de unidades de distancia. Se veían perfectas en los
     números (el vértice 0 coincidía con la mano) y no aparecían en la captura:
     el que mentía era el padre. La escena sí es identidad. */
  DESC.scene.add(lineas);

  r.kite = { barra, agarreI, agarreD, vela, lineas, alcance, ancho, peso:0, lat:0,
             brazoI:[hI, fI, mI], brazoD:[hD, fD, mD] };
}

/* --- IK de DOS ESLABONES (ley del coseno) ---------------------------------
   Se resuelve en el espacio del PADRE del hombro: ahí las longitudes locales
   de los huesos y el objetivo comparten escala, así que no hay que pelearse
   con la escala del modelo. `peso` mezcla con lo que puso el clip (slerp), que
   es lo que evita el tirón al coger y soltar la barra. */
const _kv = [0,0,0,0,0,0,0].map(() => new THREE.Vector3());
const _kq = new THREE.Quaternion(), _kq2 = new THREE.Quaternion();
function ikBrazo(h1, h2, h3, objetivoMundo, poloMundo, peso){
  const P = h1.parent; if(!P) return;
  P.updateWorldMatrix(true, false);
  const t    = P.worldToLocal(_kv[0].copy(objetivoMundo));
  const polo = P.worldToLocal(_kv[1].copy(poloMundo));
  const org  = h1.position;
  const dir  = _kv[2].subVectors(t, org);
  const L1 = h2.position.length(), L2 = h3.position.length();
  let d = dir.length(); if(d < 1e-5) return;
  d = clamp(d, Math.abs(L1 - L2) + 1e-4, L1 + L2 - 1e-4);
  dir.normalize();
  const a1 = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  /* eje de flexión = perpendicular al plano (dirección al objetivo, polo) */
  const haciaPolo = _kv[3].subVectors(polo, org);
  const eje = _kv[4].crossVectors(haciaPolo, dir);
  if(eje.lengthSq() < 1e-8) return;
  eje.normalize();
  /* el SIGNO no se razona: se prueban los dos y gana el que deja el codo del
     lado del polo (con el otro, el brazo se dobla al revés) */
  const cA = _kv[5].copy(dir).applyAxisAngle(eje,  a1);
  const cB = _kv[6].copy(dir).applyAxisAngle(eje, -a1);
  const perp = haciaPolo.addScaledVector(dir, -haciaPolo.dot(dir));
  const dirUpper = (cA.dot(perp) >= cB.dot(perp)) ? cA : cB;

  /* OJO con los temporales: `t` (_kv[0]) tiene que sobrevivir hasta el
     antebrazo, así que el eje del hueso se arma en _kv[3] (perp ya no hace
     falta) y no en _kv[0]. */
  _kq.setFromUnitVectors(_kv[3].copy(h2.position).normalize(), dirUpper);
  h1.quaternion.slerp(_kq, peso);

  /* antebrazo: apunta del codo al objetivo, expresado en el espacio del hombro */
  const codo = _kv[1].copy(org).addScaledVector(dirUpper, L1);
  const dirLower = _kv[2].subVectors(t, codo).normalize()
                    .applyQuaternion(_kq2.copy(h1.quaternion).invert());
  _kq.setFromUnitVectors(_kv[3].copy(h3.position).normalize(), dirLower);
  h2.quaternion.slerp(_kq, peso);
}

/* =====================================================================
   ►OLAZA — la pared de agua que va DETRÁS del grupo (petición de Toni: "una ola
   como la del stage de los piratas, pero quieta").

   No ondula ni rompe: es una masa de agua fija que acompaña al pelotón a una
   distancia constante. Sirve de telón y de referencia de "por aquí no se vuelve"
   sin necesidad de un muro invisible ni de un temporizador. Se construye una
   vez, cubre todo el ancho de la travesía y se recoloca cada frame detrás del
   corredor más atrasado.
   ===================================================================== */
/* `tras` tiene que dejar sitio a la CÁMARA, que va por detrás del rider: con 50
   y un fondo de 40 la ola llegaba hasta 10 u del corredor y la cámara se metía
   DENTRO — la pantalla se llenaba de blanco. */
const OLAZA = { alto: 22, fondo: 26, tras: 96, ancho: 900, crestas: 7, rizo: 2.6 };
function creaOlaza(){
  const NU = 64, NV = 12, pos = [], col = [], idx = [];
  /* el azul OSCURO del fondo del mar (PAL.hard) la dejaba como una loma negra en
     el horizonte: va en el azul CLARO del agua, con la mitad de arriba en espuma */
  const cAgua = new THREE.Color(PAL.soft), cCresta = new THREE.Color(0xffffff), c = new THREE.Color();
  for(let iu = 0; iu <= NU; iu++){
    const u = iu / NU;
    /* MEDIDO A OJO EN CAPTURA: con 26 u de alto y sin relieve esto salía como un
       MURO gris de lado a lado. Una ola se lee por su CRESTA: aquí la línea de
       arriba ondula (varias crestas a lo largo del ancho) y la pared cae a los
       lados, así que ya no es un tabique. */
    const perfilX = Math.cos((u - 0.5) * Math.PI * 0.88);
    const rizo = Math.sin(u * Math.PI * 2 * OLAZA.crestas) * OLAZA.rizo
               + Math.sin(u * Math.PI * 2 * OLAZA.crestas * 0.37 + 1.2) * OLAZA.rizo * 0.7;
    for(let iv = 0; iv <= NV; iv++){
      const v = iv / NV;                            // 0 = pie de la ola · 1 = cresta
      /* la cara se echa hacia delante conforme sube: una ola a punto de romper */
      const y = (OLAZA.alto + rizo) * Math.pow(v, 1.35) * (0.30 + 0.70 * perfilX);
      const z = OLAZA.fondo * (1 - v) - OLAZA.fondo * 0.34 * Math.pow(v, 2.2);
      pos.push((u - 0.5) * OLAZA.ancho, y, z);
      /* espuma: toda la mitad de arriba, que es lo que hace que se lea como agua
         y no como una pared pintada */
      c.copy(cAgua).lerp(cCresta, clamp((v - 0.35) / 0.5, 0, 1));
      col.push(c.r, c.g, c.b);
    }
  }
  for(let iu = 0; iu < NU; iu++) for(let iv = 0; iv < NV; iv++){
    const a = iu * (NV + 1) + iv, b = a + NV + 1;
    idx.push(a, b, a + 1, a + 1, b, b + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  /* EMISIVA a propósito: la cara que ve el jugador es la de ATRÁS de la ola, o
     sea la que está a contraluz — con Lambert puro salía como una loma negra en
     el horizonte por mucho que se le pusiera color claro. */
  const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({
    vertexColors:true, side:THREE.DoubleSide,
    emissive:0xffffff, emissiveIntensity:0.55 }));
  m.frustumCulled = false;
  return m;
}
function updateOlaza(){
  if(!DESC.olaza) return;
  /* ►DETRÁS DEL JUGADOR, no del pelotón. Al principio la colgué del corredor más
     atrasado para no adelantar a nadie, y con el grupo estirado la ola se
     quedaba a 800 u del líder: nunca se veía. Lo que Toni quiere es una pared
     de agua pisándole los talones a ÉL, así que sigue al humano (y si va el
     último, pues igual). */
  const r = DESC.racers.find(x => x.human) || DESC.racers[0];
  if(!r) return;
  DESC.olaza.position.set(0, 0, r.z + OLAZA.tras);
}

/* --- la barra va DONDE ESTÁ EL PECHO, frame a frame -----------------------
   Se lee la línea de hombros que ha dejado el clip y se planta la barra
   perpendicular a ella, un poco por delante y por debajo. Amortiguado, porque
   el carve zarandea el torso y una barra clavada al hueso tiembla. */
const _kb = [0,1,2,3].map(() => new THREE.Vector3());
function kiteSituaBarra(r, dt){
  const K2 = r.kite, b = K2.barra;
  const pI = r.body.worldToLocal(K2.brazoI[0].getWorldPosition(_kb[0]));
  const pD = r.body.worldToLocal(K2.brazoD[0].getWorldPosition(_kb[1]));
  const lateral = _kb[2].subVectors(pD, pI).normalize();
  const delante = _kb[3].set(-lateral.z, 0, lateral.x).normalize();
  if(delante.z > 0) delante.negate();                  // el board avanza hacia -Z
  const cx = (pI.x + pD.x) * 0.5, cy = (pI.y + pD.y) * 0.5, cz = (pI.z + pD.z) * 0.5;
  const k = Math.min(1, dt * 12);
  b.position.set(
    lerp(b.position.x, cx + delante.x * K2.alcance * KITE.barraAdel, k),
    lerp(b.position.y, cy - K2.alcance * KITE.barraBaja,             k),
    lerp(b.position.z, cz + delante.z * K2.alcance * KITE.barraAdel, k));
  /* el ángulo se interpola por el camino corto: sin esto, un paso por ±π da un
     latigazo de la barra entera */
  const obj = Math.atan2(-lateral.z, lateral.x);
  let d = obj - b.rotation.y;
  while(d >  Math.PI) d -= TAU;
  while(d < -Math.PI) d += TAU;
  b.rotation.y += d * k;
}

/* --- por frame: mueve la vela, engancha las manos y tensa las líneas --- */
const _kw = [0,1,2,3,4].map(() => new THREE.Vector3());
function updateKite(r, dt){
  const K2 = r.kite; if(!K2) return;
  /* ORDEN, que aquí importa: el mixer acaba de mover los huesos, así que
     primero se refresca la rama entera (gfx → body → modelo → huesos y barra),
     luego se planta la barra sobre los hombros nuevos, y sólo entonces se leen
     los agarres en mundo para el IK. */
  r.gfx.updateMatrixWorld(true);
  kiteSituaBarra(r, dt);
  K2.barra.updateMatrixWorld(true);

  /* se suelta la barra al caerse (wipeout/getup) y se recoge al levantarse */
  const quiere = (r.fall > 0 || r.crash > 0) ? 0 : 1;
  K2.peso = lerp(K2.peso, quiere, Math.min(1, dt * KITE.fade));

  /* la vela se va hacia el lado del giro y sube en el aire */
  K2.lat = lerp(K2.lat, clamp(r.yaw * 1.1, -1, 1), Math.min(1, dt * 3));
  K2.vela.position.set(K2.lat * KITE.ladeo,
                       KITE.alto + (r.air ? KITE.altoAire : 0),
                       -KITE.dist);
  /* ►ORIENTACIÓN DE LA VELA — SIN `lookAt`. Con lookAt hacia la barra, y estando
     la vela 8 u por encima del rider, su eje de mirada apuntaba hacia ABAJO: eso
     tumbaba el plano del arco hasta dejarlo casi horizontal y la vela se leía
     como un paraguas visto desde abajo (Toni, dos veces: "la has puesto mal
     igual, debías rotarla horizontalmente"). Una vela de kite va DE PIE, girada
     en horizontal hacia donde tira y sólo un poco inclinada. Así que la
     orientación se compone a mano: yaw = hacia donde va el rider más el ladeo
     del kite, y un pitch fijo. Nada de mirar al rider. */
  K2.vela.rotation.order = 'YXZ';
  K2.vela.rotation.set(KITE.pitch, K2.lat * KITE.yawLadeo, -K2.lat * KITE.rollLadeo);
  K2.vela.updateMatrixWorld(true);

  if(K2.peso > 0.01){
    K2.agarreI.getWorldPosition(_kw[1]);
    K2.agarreD.getWorldPosition(_kw[2]);
    /* polo = hacia dónde apunta el codo: abajo, hacia fuera y hacia atrás
       (+Z del body es atrás, ver kiteMonta) */
    const polo = sx => r.body.localToWorld(
      _kw[3].set(sx * K2.alcance * 1.4, -K2.alcance * 1.5, K2.alcance * 0.4));
    ikBrazo(K2.brazoI[0], K2.brazoI[1], K2.brazoI[2], _kw[1], polo(-1), K2.peso);
    ikBrazo(K2.brazoD[0], K2.brazoD[1], K2.brazoD[2], _kw[2], polo( 1), K2.peso);
  }

  /* líneas: viven en el mundo, así que se reescriben con posiciones de mundo.
     Qué punta le toca a qué mano NO se supone (la vela gira con lookAt y el
     lado cambia): se mide cuál cae más cerca, o salen cruzadas en aspa. */
  const p = K2.lineas.geometry.attributes.position;
  K2.agarreI.getWorldPosition(_kw[1]);
  K2.agarreD.getWorldPosition(_kw[2]);
  const pu = K2.vela.userData.puntas;
  const ladoI = K2.vela.localToWorld(_kw[3].copy(pu[0][0])).distanceToSquared(_kw[1]) <=
                K2.vela.localToWorld(_kw[4].copy(pu[1][0])).distanceToSquared(_kw[1]) ? 0 : 1;
  for(let s = 0; s < 2; s++){
    const mano = s === 0 ? _kw[1] : _kw[2];
    const anclas = pu[s === 0 ? ladoI : 1 - ladoI];
    for(let l = 0; l < 2; l++){
      const punta = K2.vela.localToWorld(_kw[4].copy(anclas[l]));
      const k = (s * 2 + l) * 6;
      p.array[k]     = mano.x;  p.array[k + 1] = mano.y;  p.array[k + 2] = mano.z;
      p.array[k + 3] = punta.x; p.array[k + 4] = punta.y; p.array[k + 5] = punta.z;
    }
  }
  p.needsUpdate = true;
}

function makeRacer(i, human){
  const g = new THREE.Group();
  g.rotation.order = 'YXZ';
  const clase = claseDe(i);
  const col = colorDe(clase, i);          // ►el color de la CLASE, como en el juego (ver colorDe)
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

  const sh = new THREE.Mesh(new THREE.CircleGeometry(1.5, 16),
    new THREE.MeshBasicMaterial({ color:0x000000, transparent:true, opacity:0.3, depthWrite:false }));
  sh.rotation.x = -Math.PI / 2;

  DESC.world.add(g); DESC.world.add(sh);

  /* SEPARACIÓN EN LA PARRILLA (Toni: "que salgan más separados"). En el mar,
     además, la pista es el doble de ancha: caben de sobra. */
  const x0 = (i - 1.5) * (MAR ? 26 : 16);
  /* ►DESCINTRO: COLOCARLOS YA EN LA PARRILLA. r.gfx solo se movía dentro de
     stepRacer, y stepRacer no corre hasta que empieza la carrera → durante toda
     la presentación los cuatro estaban APILADOS en el origen. No se notaba con
     una cuenta atrás de 3 s mirando al jugador; con un travelling que pasa por
     delante de la línea de salida, se nota mucho. */
  const y0 = terrainY(x0, 0);
  g.position.set(x0, y0, 0);
  sh.position.set(x0, y0 + 0.07, 0);
  return {
    i, human, col,
    name: human ? ('P' + (i + 1)) : ('CPU-' + 'ABC'[Math.max(0, i - HUMANS)]),
    gfx:g, body, capsula, board, shadow:sh,
    clase, montado:false, model:null, mixer:null,
    acts:null, animCur:null, tabla:null, kite:null,
    padIndex: human ? (HUMANS === 1 ? 0 : i) : -1,
    kb: human && i === 0,
    x:x0, y:terrainY(x0, 0), z:0,
    /* velocidad VECTORIAL en el plano + vertical */
    vx:0, vz:0, vy:0, spd:0,
    yaw:0,                       // hacia dónde apunta el board (0 = máxima pendiente)
    slip:0, skid:0, nForce:1, sink:0, _trailAcc:0, _vT:NaN,
    air:false, airVy0:0, fall:0, crash:0, crashN:0, crashT:0, charge:0,
    grind:null, gBal:0, voids:0, chat:0,
    trick:null, trickT:0, combo:0,
    dash:K.dashMax, turboCd:0, turbo:false,
    pts:0, tricks:0, falls:0, crashes:0, globos:0, vmax:0,
    done:false, parado:false, rollT:0, place:0, time:0,
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
  const o = { ax:0, canto:0, jump:false, turbo:false, trick:null, freno:false };
  if(!r.human) return o;
  const kk = GAME_KEYS() || {};
  if(r.kb){
    if(kk['KeyD'] || kk['ArrowRight']) o.ax += 1;
    if(kk['KeyA'] || kk['ArrowLeft'])  o.ax -= 1;
    /* ►CANTOS: Q izquierda, E derecha (Toni). Pulsar los dos se anula solo. */
    if(kk['KeyQ']) o.canto -= 1;
    if(kk['KeyE']) o.canto += 1;
    o.freno = !!(kk['KeyS'] || kk['ArrowDown']);
    o.jump = !!kk['Space']; o.turbo = !!(kk['ShiftLeft']||kk['ShiftRight']);
    for(const t in TRICK_KEYS) if(kk[TRICK_KEYS[t]]){ o.trick = t; break; }
  }
  if(r.padIndex >= 0 && navigator.getGamepads){
    const gp = navigator.getGamepads(), pad = gp && gp[r.padIndex];
    if(pad){
      const lx = pad.axes[0] || 0;
      if(Math.abs(lx) > 0.22) o.ax += lx;
      const B = i => !!(pad.buttons[i] && pad.buttons[i].pressed);
      o.jump = o.jump || B(0); o.turbo = o.turbo || B(7);
      /* LB/RB = cantos (simétricos, como Q/E) · LT = frenar (era el agarre,
         que ya no existe) · el truco 'flipF' se muda de LB a X, que lo ha
         dejado libre el meteorito. */
      if(B(4)) o.canto -= 1;
      if(B(5)) o.canto += 1;
      o.freno = o.freno || B(6);
      if(!o.trick){
        if(B(1)) o.trick='indy'; else if(B(3)) o.trick='flipB';
        else if(B(2)) o.trick='flipF'; else if(B(12)) o.trick='flipB2';
        else if(B(13)) o.trick='super'; else if(B(14)||B(15)) o.trick='spin';
      }
    }
  }
  o.ax = clamp(o.ax, -1, 1);
  o.canto = clamp(o.canto, -1, 1);
  return o;
}

/* IA: elige un objetivo lateral y GIRA hacia él (ya no empuja una x). */
function aiInput(r, dt){
  const o = { ax:0, canto:0, jump:false, turbo:false, trick:null };
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
    o.ax = clamp(((d < 34 ? 0 : wy) - r.yaw) / K.steerMax, -1, 1);   // ►VOLANTE NATURAL: el eje es RITMO de giro → se manda el ERROR de ángulo
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
    if(d < 2 || d > K.aiLook || ob.type === 'ramp' || ob.type === 'globo') continue;   // los globos no se esquivan: se cogen
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
    /* ►GLOBOS: la CPU también compite POR PUNTOS, si no el ranking de la
       izquierda lo gana el humano sin oponente. Solo desvía la línea si el
       globo está CERCA de ella (12 u): barrer la ladera para ir a por uno
       cuesta más velocidad de lo que vale. Los amarillos van por el aire, así
       que solo los persigue si ya está volando. */
    let glo = null, gd = 1e9;
    for(const ob of ahead){
      if(ob.type !== 'globo' || ob.taken) continue;
      if(ob.tier === 'amarillo' && !r.air) continue;
      const d = r.z - ob.z;
      if(d < 6 || d > K.aiLook) continue;
      const px = r.x + r.vx * (d / vz);
      if(Math.abs(ob.x - px) > 12) continue;
      const coste = d - GLOBO[ob.tier].pts * 0.05;        // uno gordo compensa más desvío
      if(coste < gd){ gd = coste; glo = ob; }
    }
    if(glo && skill > 0.6){ tx = glo.x;
      /* los rojos cuelgan a 6 u: hay que SALTAR. La CPU carga el ollie al
         acercarse, si no el ranking de puntos lo gana el humano sin rival. */
      if(glo.tier === 'rojo' && !r.air && (r.z - glo.z) < 26) o.jump = true;
    }
    else if(best && skill > 0.78) tx = best.x;
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
  /* la IA también castañetea si va recta: en cuanto se le llena a medias,
     traza de canto a canto. Sin esto se caerían solas en las rectas largas. */
  if(r.chat > 0.42){
    r._ai.canto = (r._ai.canto || 1) * (r.chat > 0.8 ? -1 : 1);
    tx = clamp(r.x + r._ai.canto * 26, -hw, hw);
  }
  r._ai.tx = tx;

  /* yaw deseado para llegar a tx dentro de la distancia de anticipación.
     Si va lento, lo único sensato es apuntar cuesta abajo y coger velocidad. */
  const wantYaw = r.spd < 13 ? 0
                : clamp(Math.atan2(tx - r.x, Math.max(20, K.aiLook * 0.7)), -1.1, 1.1);
  /* ►VOLANTE NATURAL: el eje ya no ES el ángulo, es el RITMO con que se gira.
     La IA manda el ERROR (lo que le falta para apuntar donde quiere) escalado
     por steerMax: a 38° de diferencia empuja a fondo y al llegar suelta sola.
     Con un lazo así el ángulo se sostiene igual que antes — pero por la misma
     vía que el jugador, sin volante propio. */
  o.ax = clamp((wantYaw - r.yaw) / K.steerMax, -1, 1);
  /* ►CANTO DE LA IA: si el ángulo que necesita se sale de lo que da el stick,
     clava canto — igual que tendrá que hacer el jugador con Q/E. Sin esto la
     CPU se queda corta en las curvas cerradas desde que el volante es más
     blando, y se sale por el borde. */
  if(!r.air && Math.abs(wantYaw) > K.steerMax * 1.15 && skill > 0.55) o.canto = Math.sign(wantYaw);

  const s = surfaceAt(r.x, r.z);
  if(s.ramp && skill > 0.75) o.jump = true;                 // carga el ollie en la rampa
  o.turbo = gap > 35 && skill > 0.82;
  return o;
}

/* =====================================================================
   CAÍDAS
   ===================================================================== */
/* `por` no es decoración: sin contar POR QUÉ se choca, afinar es adivinar.
   DESC._why lo dice en cualquier momento (roca / aterrizaje / plancha / borde / rival). */
function camKick(v){ DESC.kick.v -= v * 8; }

/* Tope duro del abanico. Extraído a helper porque el BUG que dejaba salirse
   por los lados (lo cazó Toni jugando) era exactamente este: la rama de CAÍDA
   hace early-return integrando x += vx·dt ANTES de llegar al clamp del flujo
   normal, así que caerte cerca del borde te sacaba de la pista deslizando. */
function topeLateral(r, conCrash){
  const lim = hwAt(r.z) - 1.5;
  if(Math.abs(r.x) > lim){
    r.x = Math.sign(r.x) * lim;
    const vn = r.vx;
    r.vx = -vn * 0.25;
    if(conCrash && Math.abs(vn) > 12) crash(r, 'borde');
  }
}

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
  if(r.human){ camKick(K.kickCrash); sndRafagaSnd(240, 0.28, 0.5); }
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
  if(r.parado) return;                              // ►META: ya rodó hasta pararse (ver el final de esta función)
  r.turboCd = Math.max(0, (r.turboCd || 0) - dt);   // la espera del turbo corre SIEMPRE, también caído
  const inp = r._inp || { ax:0, canto:0, jump:false, turbo:false, trick:null, freno:false };

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
    topeLateral(r, false);            // caído también hay borde (sin re-crash)
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

  /* ►TURBO CON FONDO (3 s de uso / 6 s de espera). Ver K.dashMax/K.turboCd.
     El reloj de la espera corre ARRIBA DEL TODO (ver stepRacer): si se
     descontara aquí, una caída lo congelaría — el fall hace return antes. */
  r.turbo = inp.turbo && r.dash > 0 && r.turboCd <= 0 && r.crash <= 0;
  if(r.turbo){
    r.dash -= dt;
    if(r.dash <= 0){ r.dash = 0; r.turboCd = K.turboCd; }   // agotado → a esperar
  } else if(r.turboCd <= 0 && r.dash <= 0){
    r.dash = K.dashMax;                                      // cumplida la espera, depósito lleno
  }

  /* ---------- GIRO DEL BOARD ----------
     El giro es del BOARD, no de la velocidad: la velocidad le sigue (o no)
     según el agarre. Y el board no puede apuntar cuesta arriba: ±88° es el
     límite de 180° de la pista. */
  const kSpd = clamp(r.spd / 90, 0, 1);
  const turn = (r.air ? K.airTurn : lerp(K.turnLow, K.turnHigh, kSpd));
  /* ►CANTO (Q/E) y ►FRENO (S): los dos ÚNICOS que piden un ángulo absoluto.
     Son gestos, no volante: clavas la tabla en ese ángulo y ahí se queda.
     El canto manda sobre el stick y no se puede clavar en el aire. */
  r._canto = (!r.air && r.fall <= 0) ? (inp.canto || 0) : 0;
  let wantYaw = null, vel = 0;
  if(r._canto){
    wantYaw = r._canto * K.cantoYaw;
    vel = K.cantoTurn;
    r._ladoFreno = r._canto;
  } else if(inp.freno && !r.air && r.fall <= 0){
    /* con FRENO se pide un ángulo mucho mayor: la tabla se pone de través y
       raspa. Si no tocas el stick, derrapa hacia el último lado usado. */
    const lado = Math.abs(inp.ax) > 0.05 ? Math.sign(inp.ax) : (r._ladoFreno || 1);
    r._ladoFreno = lado;
    wantYaw = lado * K.frenoYaw;
    vel = turn;
  }
  if(wantYaw !== null){
    const dYaw = wantYaw - r.yaw;
    r.yaw = clamp(r.yaw + clamp(dYaw, -vel * dt, vel * dt), -K.yawLimit, K.yawLimit);
  } else {
    /* ►VOLANTE NATURAL (ver K): el stick INTEGRA ángulo mientras lo empujas y
       al soltarlo NO pasa nada — el board se queda apuntando donde apunta. El
       freno de ir cruzado no lo pone un muelle inventado: lo pone la gravedad
       proyectada, que ahí abajo empuja por el coseno del ángulo. */
    r.yaw = clamp(r.yaw + inp.ax * turn * dt, -K.yawLimit, K.yawLimit);
  }
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
    /* tope suave: pasado velSuave el aire crece al cuadrado del exceso */
    const exceso = Math.max(0, r.spd - K.velSuave);
    aFric += K.velCapK * exceso * exceso;
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
    if(r.spd < piso && r.fall <= 0 && !r.done){   // ►META: al que ya ha llegado no se le vuelve a empujar
      const k2 = (piso - r.spd) / piso;
      ax += K.floorPush * k2 * fx; az += K.floorPush * k2 * fz;
    }

    /* ---------- ►CASTAÑETEO POR IR PLANO ----------
       Sube con velocidad × lo plano que vas × lo rugoso del terreno. Baja en
       cuanto clavas canto. Si se llena: enganchas y al suelo. */
    const canto = clamp(Math.abs(r.yaw) / K.chatCanto, 0, 1);
    const rugoso = clamp(zoneProp(r.z, 'bump') / 3.2, 0.25, 1.4);
    const vFac = clamp((r.spd - K.chatVel) / 30, 0, 1.4);
    if(r.fall <= 0 && r.crash <= 0){
      if(canto > 0.55 || inp.freno) r.chat = Math.max(0, r.chat - K.chatBaja * dt);
      else r.chat = clamp(r.chat + K.chatSube * vFac * rugoso * (1 - canto) * dt, 0, 1.2);
      if(r.chat >= 1){ r.chat = 0; crash(r, 'canto'); if(r.human) camKick(1.8); }
    }
    if(r.chat > 0.25){                       // castañetear frena: rebotas, no deslizas
      const f2 = r.chat * K.chatFreno * r.spd;
      const vm2 = Math.max(0.01, Math.hypot(r.vx, r.vz));
      ax -= (r.vx / vm2) * f2; az -= (r.vz / vm2) * f2;
    }

    /* ---------- ►FRENADA DE CANTOS (S / ↓ / LB) ---------- */
    if(inp.freno && r.fall <= 0){
      const vm3 = Math.max(0.01, Math.hypot(r.vx, r.vz));
      const fr = Math.min(K.frenoFuerza, vm3 / dt);
      ax -= (r.vx / vm3) * fr; az -= (r.vz / vm3) * fr;
      if(Math.random() < 0.9)
        emit(r.x + (Math.random()-0.5)*2.4, r.y + 0.2, r.z + (Math.random()-0.5)*2.4,
             -Math.sign(r.yaw || 1) * (2 + Math.random()*7), 2 + Math.random()*5 + r.spd*0.05,
             (Math.random()-0.5)*5, 0.06 + Math.random()*0.10);
    }

    /* ►VIENTO: el empuje de la vela. Va por el eje del board igual que el
       turbo, y se cobra por apuntar mal, no por ir de lado. */
    if(MAR && KITE_ON && r.fall <= 0 && r.crash <= 0){
      const cos = -fz;                       // fz = -cos(yaw): recto (yaw 0) = a favor del viento
      const emp = VIENTO.fuerza * (VIENTO.cenida + (1 - VIENTO.cenida) * Math.max(0, cos));
      ax += emp * fx; az += emp * fz;
      r._viento = emp;                       // el HUD y la IA lo pueden mirar
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
    r.chat = Math.max(0, r.chat - dt * 0.8);          // en el aire no castañeteas
    /* en el aire NO hay canto ni material, pero SÍ hay aire: a 100 u/s es la
       fuerza que manda. Se aplica a los tres ejes contra el vector velocidad. */
    const v3 = Math.hypot(r.vx, r.vy, r.vz);
    if(v3 > 0.01){
      const f = K.dragC * K.dragAir * v3;
      r.vx -= r.vx * f * dt; r.vz -= r.vz * f * dt; r.vy -= r.vy * f * dt;
    }
    /* ►VIENTO EN EL AIRE (Toni): "un poco de flotabilidad al caer por el viento
       y una leve subida tras saltar". La vela sigue tirando mientras vuelas: se
       cae más despacio, y en el primer medio segundo del salto el kite te
       levanta un poco más. */
    if(MAR && KITE_ON){
      r.vy -= K.grav * VIENTO.flota * dt;
      if(r._kiteLift > 0){ r.vy += VIENTO.subida * dt; r._kiteLift -= dt; }
      /* la vela empuja hacia delante también en el aire, si no el salto frena */
      const emp = VIENTO.fuerza * 0.45;
      r.vx += emp * fx * dt; r.vz += emp * fz * dt;
    } else r.vy -= K.grav * dt;
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
  if(r.spd > r.vmax) r.vmax = r.spd;                  // ►DESCFIN: "punta" de la tabla final
  /* clamp duro: nada por encima de velMax, ni con turbo ni cayendo de un salto */
  if(r.spd > K.velMax){ const fcap = K.velMax / r.spd; r.vx *= fcap; r.vz *= fcap; r.spd = K.velMax; }

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
      r._kiteLift = VIENTO.subidaT;                     // ►VIENTO: la vela levanta al salir de la ola
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
      r._kiteLift = VIENTO.subidaT;                     // ►VIENTO: leve subida tras saltar
      r._noLand = true;                  // ← ver la nota en el bloque de AIRE
      r.y += 0.06;
      spray(r, 8, 2.2);
    }
  }

  /* (OBJETOS, METEORITO y AGARRE retirados a petición de Toni. Lo que hay que
     recoger son GLOBOS, y dan puntos en el momento; y contra los rivales solo
     queda el choque, que ya existe.) */

  /* ---------- LÍMITE DEL ABANICO ----------
     No hay muro: el cuenco ya te empuja al centro. Esto es solo el tope duro. */
  topeLateral(r, true);

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
    /* ►PUNTOS ENTEROS. Sumar `K.grindPts * dt` dejaba cosas como
       "1697.0500000000015 pts" en el HUD y en el ranking. Se acumula la
       fracción aparte y solo pasan enteros a r.pts. */
    r._ptsAcc = (r._ptsAcc || 0) + K.grindPts * dt;
    if(r._ptsAcc >= 1){ const n = Math.floor(r._ptsAcc); r.pts += n; r._ptsAcc -= n; }
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
    /* ►IMÁN: cayendo CERCA de un raíl (no encima), te atrae lateralmente.
       Toni: "que solo saltar cerca de una barandilla te imantes". Sin esto
       había que clavar el aterrizaje a ±2,6 u, que a 60 u/s es una lotería. */
    const R = railAt(r.z);
    if(R){
      const dxR = R.x - r.x;
      if(Math.abs(dxR) < K.grindIman && Math.abs(dxR) >= K.grindSnapX){
        r.x += dxR * Math.min(1, K.grindImanF * dt);
        r.vx += dxR * 2.2 * dt;
      }
    }
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
    /* Toni: "en el aire no siempre deja hacer trucos". El umbral por vy0
       bloqueaba los despegues POR RELIEVE (vy inicial pequeña aunque el vuelo
       sea largo). Ahora vale despegar con impulso O estar ya claramente
       separado del suelo. El chatter (saltitos de 20 cm) sigue fuera. */
    if(inp.trick && !r.trick && TRICKS[inp.trick] &&
       (r.airVy0 > 3.5 || (r.y - groundYAt(r.x, r.z)) > 1.6)){ r.trick = inp.trick; r.trickT = 0; }
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
      if(r.human){ camKick(Math.min(K.kickMax, impacto * K.kickLand)); DESC._impacto = impacto; }
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

  /* obstáculos.
     ►LAS ROCAS SON SÓLIDAS. Antes la colisión solo llamaba crash() sin tocar
     la posición, y mientras r.crash>0 este bloque entero se saltaba: durante
     los 0,55 s del choque PLANEABAS A TRAVÉS de la roca (lo cazó Toni). Ahora
     la resolución de penetración corre SIEMPRE (también chocado y caído):
     se empuja al jugador fuera del radio y se refleja la velocidad entrante.
     Solo el crash() nuevo respeta el cooldown. */
  for(const o of nearObst(r.z, 18)){
    if(o.type !== 'rock') continue;
    if(r.y > (o.baseY||0) + o.r*1.05) continue;
    const dx = r.x - o.x, dz = r.z - o.z;
    const rad = o.r + 1.4;
    const d2 = Math.hypot(dx, dz);
    if(d2 >= rad) continue;
    /* empujar fuera por la normal (y si estás clavado en el centro, de lado) */
    const nx2 = d2 > 0.01 ? dx / d2 : 1, nz2 = d2 > 0.01 ? dz / d2 : 0;
    r.x = o.x + nx2 * rad;
    r.z = o.z + nz2 * rad;
    /* reflejar SOLO la componente que entra en la roca */
    const ven = r.vx * nx2 + r.vz * nz2;
    if(ven < 0){ r.vx -= 1.6 * ven * nx2; r.vz -= 1.6 * ven * nz2; }
    if(r.crash <= 0 && r.fall <= 0) crash(r, 'roca');
  }
  if(r.crash <= 0 && r.fall <= 0){
    /* ►GLOBOS: se cogen ATRAVESÁNDOLOS, y eso incluye la ALTURA — es lo único
       que separa un globo verde de uno amarillo, así que la Y cuenta igual que
       la X y la Z. El radio es generoso (3,2) porque a 150 km/h pedir puntería
       de píxel no es un reto, es una lotería. */
    for(const o of nearObst(r.z, 22)){
      if(o.type !== 'globo' || o.taken) continue;
      const dx = o.x - r.x, dz = o.z - r.z, dy = o.y - (r.y + 1.2);
      if(dx*dx + dz*dz + dy*dy > 3.2*3.2) continue;
      o.taken = true;
      const g = GLOBO[o.tier];
      r.pts += g.pts; r.globos++;   // ►DESCFIN: los globos son columna propia en la tabla final
      popGlobo(o);
      if(r.human){ r._lastTrick = g.nombre + ' +' + g.pts; r._lastTrickT = 1.0; }
      sndDing(o.tier === 'amarillo' ? 3 : o.tier === 'rojo' ? 1 : 0);
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
    r.done = true; r.time = DESC.t; r.rollT = 0;
    DESC.finishOrder.push(r); r.place = DESC.finishOrder.length;
    r.pts += K.ptsPos[Math.min(K.ptsPos.length-1, r.place-1)];
    metaCruzada(r);
  }
  /* ►META SIN FRENAZO (Toni: "que no acabe abruptamente"). Cruzar la línea te
     quita el CONTROL, no la inercia: sigues rodando y frenas de cantos hasta
     pararte, como cualquiera que cruza una meta. Antes `done` hacía return en
     la primera línea de stepRacer y el jinete se quedaba CLAVADO a mitad de
     zancada, que es justo lo abrupto.
     La frenada la hace `inp.freno` (ver arriba: pone la tabla de través y
     aplica frenoFuerza) — no hay una frenada nueva que mantener. Se le suma
     este rozamiento para garantizar el cero: frenoFuerza (34) le gana a la
     gravedad de la banda negra (≈21) pero no por mucho, y esto lo cierra. */
  if(r.done){
    r.rollT = (r.rollT || 0) + dt;
    const fr = Math.pow(0.55, dt);
    r.vx *= fr; r.vz *= fr;
    if(r.rollT > 0.9 && r.spd < 2.5){ r.parado = true; r.vx = r.vz = 0; r.spd = 0; }
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
       morro 28° — la tabla se veía de canto detrás del muñeco.
       Y el CASTAÑETEO se VE: la tabla vibra antes de engancharte. Un medidor
       invisible sería una tomadura de pelo (ya cometí ese error con la dureza
       del suelo en la v3). */
    /* Toni (v11): "no quiero que los muñecos vibren tanto" — el temblor del
       castañeteo baja a menos de la mitad; sigue AVISANDO, ya no zarandea */
    const tmb = r.chat > 0.2 ? (r.chat - 0.2) * 0.07 : 0;
    /* ►DE LADO AL CRUZAR: el board va donde va (r.gfx.rotation.y) y el TORSO se
       queda mirando la bajada. `cruce` es 0 recto y 1 con la tabla de través. */
    const cruce = clamp((Math.abs(r.yaw) - K.torsoDesde) / (K.frenoYaw - K.torsoDesde), 0, 1);
    r._cruce = lerp(r._cruce || 0, r.air ? 0 : cruce, Math.min(1, dt * 9));
    const lado = Math.sign(r.yaw) || 1;
    /* con el clip 'carve' sonando, la postura procedural se ATENÚA al 60%:
       el clip ya pone el cuerpo; lo procedural solo orienta y remata */
    const enCanto = (r.animCur === 'carve' || r.animCur === 'carveM');
    const pf = enCanto ? 0.6 : 1;
    /* ►EL CROUCH VENÍA GIRADO 90°, y por eso "los pies se salen de la tabla".
       MEDIDO leyendo los huesos de los pies en el espacio de la tabla (que va
       a lo largo de Z, media anchura 0,24):
         board  → pieI z=-0,29 · pieD z=+0,24 · |x|<0,07   = de lado, BIEN
         carve  → pieI x=-0,31 · pieD x=+0,41 · z≈0        = de frente, MAL
       Los clips de crouch son Mixamo de PIE MIRANDO AL FRENTE: no traen la
       postura de tabla que sí trae 'board', así que el muñeco quedaba a
       horcajadas sobre el board con un pie fuera. Con -90° los pies vuelven a
       caer a lo largo de la tabla y dentro de su ancho (comprobado: pieI
       z=-0,31 x=0,11 · pieD z=+0,41 x=0,06) y el pie izquierdo delante, igual
       que en 'board'. Se mezcla con `_cq` para que no pegue un tirón al
       entrar/salir del clip. */
    r._cq = lerp(r._cq || 0, enCanto ? 1 : 0, Math.min(1, dt * 7));
    if(r.model) r.model.rotation.y = K.charYaw + K.crouchYaw * r._cq
                                   - r.yaw * K.torsoSigue * r._cruce * pf;
    r.body.rotation.set((r.air ? -0.14 : 0.04) + pitch*0.8 + (Math.random()-0.5)*tmb,
                        (Math.random()-0.5)*tmb*0.6,
                        -roll*0.7 - lado * K.tumbaMax * r._cruce * pf + (Math.random()-0.5)*tmb*1.1);
    r.body.position.y = -K.agachaMax * r._cruce * pf;
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
const _srfCam = { y:0, nx:0, ny:1, nz:0, ramp:null };
let _camInit = false;

function orbitInput(dt){
  const o = DESC.orb, kk = GAME_KEYS() || {};
  /* órbita apagada: solo se atiende la rueda (zoom) y los ángulos van a 0 */
  if(!K.orbitaOn){
    if(o.wheel){
      K.camDist = clamp(K.camDist + o.wheel * K.zoomPaso, K.camDistMin, K.camDistMax);
      o.wheel = 0;
    }
    o.yaw = 0; o.pitch = 0; o.mx = o.my = 0;
    return;
  }
  let dy = 0, dp = 0, tocado = false;
  /* la rueda acerca y aleja (Toni: "alejarte y acercarte un poquito") */
  if(o.wheel){
    K.camDist = clamp(K.camDist + o.wheel * K.zoomPaso, K.camDistMin, K.camDistMax);
    o.wheel = 0;
  }
  /* Q/E YA NO GIRAN LA CÁMARA: desde que son los CANTOS, cada canto giraba
     también la vista y el jinete se te iba de plano justo cuando más falta
     hace verlo. La cámara se orbita con el RATÓN y con el stick derecho. */
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

  /* =====================================================================
     ►CÁMARA EN EL MARCO DE LA LADERA (no en el del mundo)

     Aquí me equivoqué dos veces seguidas mezclando la vertical del MUNDO con
     la pendiente: la cámara acababa 6, 9 y hasta 16 unidades por encima del
     jinete (vista de dron) precisamente en las zonas empinadas, que son las
     que más se disfrutan. Ajustar el "picado" era pelearse con el síntoma.

     La forma correcta es construirla en el marco del TERRENO:
        n = normal de la ladera
        f = dirección de la vista PROYECTADA en la ladera
        cámara = jinete + n·alto − f·distancia
     Así "alto" es alto SOBRE LA NIEVE, no sobre el horizonte, y sale al hombro
     tanto en una verde de 11° como en un fuera pista de 42° sin tocar nada.
     El "poco picada" sale de mirar un pelín más bajo que donde está la cámara
     (camLookY < camAlto), no de rotar nada.
     ===================================================================== */
  const o = DESC.orb;

  /* ►LA CÁMARA NO GIRA TODO LO QUE GIRA LA TABLA, y lo poco que gira lo hace
     con retardo. Antes seguía el yaw del board al 100% e instantáneamente: en
     cada curva el paisaje barría la pantalla de lado a lado y marea. */
  const yawObj = r.yaw * K.camYawSigue;
  if(DESC._camYaw == null) DESC._camYaw = yawObj;
  DESC._camYaw += clamp(yawObj - DESC._camYaw, -K.camYawLag * dt, K.camYawLag * dt);
  const yawW = DESC._camYaw + o.yaw;

  /* --- marco de la ladera --- */
  const srf = surfaceAt(r.x, r.z, _srfCam);
  let nx = srf.nx, ny = srf.ny, nz = srf.nz;
  /* suavizado: la normal de un bache no debe zarandear la cámara */
  if(DESC._nSuave == null) DESC._nSuave = { x:nx, y:ny, z:nz };
  const kn = Math.min(1, dt * 4.5);
  DESC._nSuave.x += (nx - DESC._nSuave.x) * kn;
  DESC._nSuave.y += (ny - DESC._nSuave.y) * kn;
  DESC._nSuave.z += (nz - DESC._nSuave.z) * kn;
  const nl = Math.hypot(DESC._nSuave.x, DESC._nSuave.y, DESC._nSuave.z) || 1;
  nx = DESC._nSuave.x / nl; ny = DESC._nSuave.y / nl; nz = DESC._nSuave.z / nl;

  /* f = dirección de vista proyectada en el plano de la ladera */
  let fx = Math.sin(yawW), fy = 0, fz = -Math.cos(yawW);
  const dotf = fx*nx + fy*ny + fz*nz;
  fx -= nx*dotf; fy -= ny*dotf; fz -= nz*dotf;
  const fl = Math.hypot(fx, fy, fz) || 1;
  fx /= fl; fy /= fl; fz /= fl;
  /* lateral = f × n  (para el desplazamiento al hombro) */
  const lax = fy*nz - fz*ny, lay = fz*nx - fx*nz, laz = fx*ny - fy*nx;

  /* la órbita vertical del ratón inclina DENTRO del marco: sube o baja el alto */
  const altoCam  = Math.max(0.4, K.camAlto  + o.pitch * 9);
  const altoMira = Math.max(0.2, K.camLookY - o.pitch * 3);

  /* en el aire la MIRA sube con el jinete (Toni: "que la cámara no te pierda").
     Suavizado, y con el suelo medido bajo el jinete: en un bache r.y - suelo da
     saltos, y sin filtro eso es un tirón de cámara por cada lomo. */
  /* SOLO cuenta si de verdad estás en el aire. Comparar r.y con el suelo exacto
     daba "vuelo" permanente en terreno picado, porque r.y viene de padY (media
     de tres puntos de la tabla) y en un lomo eso está por encima del centro:
     medido, la cámara acababa 10 u sobre el jinete sin haber saltado. */
  const vueloObj = r.air ? clamp(r.y - groundYAt(r.x, r.z), 0, K.camAireMax) : 0;
  if(DESC._vuelo == null) DESC._vuelo = 0;
  DESC._vuelo += (vueloObj - DESC._vuelo) * Math.min(1, K.camAireLag * dt);
  const vuelo = DESC._vuelo;

  _camLook.set(r.x + fx * K.camLookAhead + lax * K.camHombro * 0.5,
               r.y + fy * K.camLookAhead + ny * altoMira + vuelo * K.camAireY,
               r.z + fz * K.camLookAhead + laz * K.camHombro * 0.5);

  const dist = K.camDist + K.camDistFast * k;
  /* la cámara NO sube con el vuelo: se queda al hombro y es la mira la que
     acompaña. Solo se le da una fracción mínima para que un salto enorme no
     saque al jinete del cuadro por arriba. */
  const set = d => _camPos.set(r.x - fx * d + nx * altoCam + lax * K.camHombro,
                               r.y - fy * d + ny * altoCam + vuelo * 0.22,
                               r.z - fz * d + nz * altoCam + laz * K.camHombro);

  /* ---------- LA CÁMARA NO SE METE EN LA MONTAÑA ----------
     Con el marco de la ladera esto casi no salta, pero un lomo entre jinete y
     cámara todavía puede cruzarse: se barre el segmento y se ACORTA (acercarse
     encuadra mejor que subir, que es lo que la volvía cenital). */
  let d = dist;
  for(let intento = 0; intento < 5; intento++){
    set(d);
    let libre = true;
    for(let j = 1; j <= 5; j++){
      const f2 = j / 5;
      const sx = lerp(_camLook.x, _camPos.x, f2);
      const sy = lerp(_camLook.y, _camPos.y, f2);
      const sz = lerp(_camLook.z, _camPos.z, f2);
      if(sy < groundYAt(sx, sz) + K.camMinH){ libre = false; break; }
    }
    if(libre) break;
    d *= 0.78;
    if(d < K.camDistMin){ set(K.camDistMin); break; }
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

  /* la caja de sombra SIGUE al jugador (si no, o es gigante y borrosa, o el
     jugador se sale de ella y las sombras desaparecen a mitad de bajada) */
  if(DESC.sun){
    const rr2 = DESC.racers[0];
    if(rr2){
      DESC.sun.target.position.set(rr2.x, rr2.y, rr2.z);
      DESC.sun.position.set(rr2.x - 85, rr2.y + 42, rr2.z + 30);   // sol bajo
      DESC.sun.target.updateMatrixWorld();
    }
  }
  if(DESC.backdrop) DESC.backdrop.position.set(DESC.cam.position.x, DESC.cam.position.y, DESC.cam.position.z);
  if(DESC.sky) DESC.sky.position.copy(DESC.cam.position);
  if(DESC.cielo) DESC.cielo.position.copy(DESC.cam.position);

  const want = K.fovBase + K.fovSpeed * k * k - KK.y * K.kickFov;
  DESC.cam.fov += (want - DESC.cam.fov) * Math.min(1, 5*dt);
  DESC.cam.updateProjectionMatrix();
}

/* =====================================================================
   ►DESCINTRO — la presentación del minijuego, hecha CON LO DEL JUEGO

   Toni: "presentación de stage como siempre, con la voz en off, el mismo tipo
   de letras y contador antes de empezar", "que los personajes ya estén
   renderizados", "un travelling de cámara pasando por delante de todos los
   personajes que están listos en la salida, con 2 o 3 planos distintos" y "un
   pop-up como en otros stages".

   Nada de esto se inventa aquí: el juego YA lo tiene y sus declaraciones de
   nivel superior son visibles POR NOMBRE desde este fichero (son const/función
   de un <script> clásico → ámbito léxico global, aunque NO estén en window; es
   el mismo truco por el que este fichero puede leer `renderer` y `keys`).
     · voz ....... voiceStart = narrator/starting-match.mp3, el MISMO clip con
                   que el juego presenta cada stage (ver narrateStageStart)
     · letras .... #banner (84 px itálica) y #count321 (150 px) con showCount()
     · pop-up .... #stageCaution, el aviso de peligro de los stages

   ►TRAMPA CAZADA Y CERRADA: los tres nodos viven DENTRO de #hud... y boot()
   oculta #hud cada 250 ms durante los primeros 30 s. La presentación se
   ejecutaba entera sin que se viera NADA. Por eso buildHud() se los TRAE al
   HUD del descenso (ver ►DESCINTRO-DOM): los tres son position:absolute y
   #descHud es position:fixed;inset:0, así que caen exactamente en el mismo
   sitio de la pantalla.

   ►Y LA VOZ PUEDE NO SONAR, y da igual: con ?descenso no hay clic previo en la
   home, así que el navegador puede rechazar el play() por autoplay. El reloj de
   la presentación NO cuelga del audio (igual que stageIntroT en el juego): si
   la voz no suena, el travelling y la cuenta van igual de sincronizados.
   ===================================================================== */
/* ►ENTRADA: el SELLO del juego (el nombre troceado en golpes). Mismo patron que GAME_VOZ():
   son declaraciones de nivel superior del script grande, visibles POR NOMBRE desde aqui. El
   #stageStamp vive en #hud, que este modulo esconde, asi que buildHud se lo trae a su HUD igual
   que hace con #banner y #count321 —sin eso el sello se compone dentro de un HUD oculto y NO SE
   VE, la misma trampa que ya cazo este fichero dos veces. */
function GAME_SELLO(){
  try {
    if(typeof showStageStamp !== 'function') return null;
    return {
      show: showStageStamp,
      hide: (typeof hideStageStamp === 'function') ? hideStageStamp : function(){},
      ms:   (typeof stampDuracionMs === 'function') ? stampDuracionMs : function(){ return 500; },
      hold: (typeof STAMP_HOLD_MS !== 'undefined') ? STAMP_HOLD_MS : 2000
    };
  } catch(e){ return null; }
}
const INTRO = {
  pre:   0,       // ►ENTRADA: segundos de SELLO + respiro por delante de la voz (se calcula al vuelo)
  dur:   6.5,     // se ajusta a la duración REAL del clip (12,5 s) en cuanto la conoce
  mudo:  6.5,     // ...pero si el navegador RECHAZA el audio, se acorta: ver introGo()
  espera:12.0,    // tope esperando a que carguen los cuatro GLB (►PARRILLA LISTA)
  titulo:2.2,     // segundos del rótulo de cabecera
  popMs: 3400,    // lo mismo que STAGE_CAUTION_MS del juego
};
/* rótulo y frase por PIEL. La de arena es literal de Toni. */
const INTRO_TXT = {
  arena: { titulo:'DESCENSO DE ARENA', frase:'Hora de surfear la arena, ¡hazlo lo mejor que puedas!', ico:'🏄' },
  nieve: { titulo:'DESCENSO NEVADO',   frase:'Hora de bajar la montaña, ¡hazlo lo mejor que puedas!', ico:'🏂' },
  mar:   { titulo:'SURF',              frase:'Hora de surfear las olas, ¡hazlo lo mejor que puedas!', ico:'🏄' },
};
function introTxt(){
  const t = INTRO_TXT[SKIN] || INTRO_TXT.arena;
  /* ►NOMBRES: dentro de la campania manda el rotulo OFICIAL del eslabon, que lo pasa lanzarMini
     en `opt.nombre`. El literal de arriba se queda de RESPALDO para cuando se entra suelto con
     ?descenso, que no pasa por la RUTA y no tiene eslabon del que sacarlo. */
  return DESC._nombre ? Object.assign({}, t, { titulo: DESC._nombre }) : t;
}

/* accesos al script del juego, con el mismo patrón que GAME_RENDERER(). En
   try/catch porque `typeof` sobre un const en zona muerta temporal NO devuelve
   'undefined': lanza (aquí no puede pasar — este fichero carga después de que
   el script grande haya terminado —, pero un guard de una línea no se discute). */
function GAME_VOZ(){ try { return (typeof voiceStart !== 'undefined') ? voiceStart : null; } catch(e){ return null; } }
function GAME_SHOWCOUNT(){ try { return (typeof showCount === 'function') ? showCount : null; } catch(e){ return null; } }

/* ►LETRAS: el #banner del juego. NO se usa showBanner() porque su temporizador
   (bannerT) lo descuenta frame(), y frame() sale antes de tiempo cuando corre
   el descenso → el rótulo se quedaría clavado en pantalla para siempre. */
let _bannerT = null;
function descBanner(txt, segs){
  const b = document.getElementById('banner'); if(!b) return;
  if(_bannerT) clearTimeout(_bannerT);
  b.textContent = txt; b.classList.add('show');
  _bannerT = setTimeout(() => { b.classList.remove('show'); _bannerT = null; }, segs * 1000);
}
/* ►POP-UP: el #stageCaution del juego, con el icono y el texto del minijuego.
   Dos líneas (rótulo + frase) dentro del mismo .cauTxt: la caja es flex-column
   y centra igual, y así no se toca el CSS del juego. */
let _popT = null;
function descPopup(){
  const el = document.getElementById('stageCaution'); if(!el) return;
  const t = introTxt();
  const ico = el.querySelector('.cauIco'), tx = el.querySelector('.cauTxt');
  if(ico) ico.textContent = t.ico;
  if(tx) tx.innerHTML = 'MINIJUEGO<br><span style="font-size:.56em;letter-spacing:1px;text-transform:none;font-style:italic">' +
                        t.frase + '</span>';
  el.classList.add('show');
  if(_popT) clearTimeout(_popT);
  _popT = setTimeout(descPopupOff, INTRO.popMs);
}
function descPopupOff(){
  const el = document.getElementById('stageCaution'); if(el) el.classList.remove('show');
  if(_popT){ clearTimeout(_popT); _popT = null; }
  const sello = GAME_SELLO(); if(sello) sello.hide();
}

/* arranca la presentación: solo cuando los cuatro están montados (Toni: "que
   los personajes ya estén renderizados"), o al agotarse el tope de espera */
function introGo(){
  DESC._introGo = true;
  DESC._introVoz = false;
  DESC.introT = 0;
  const v = GAME_VOZ();
  const voz = (v && isFinite(v.duration) && v.duration > 3) ? v.duration : INTRO.mudo;
  /* ►ENTRADA: el mismo orden que en los mundos —sello troceado, respiro, y SOLO entonces cartel
     y voz—. Cuanto dura el sello lo dice el juego, que es quien decide en cuantos trozos parte el
     nombre. Si por lo que sea no esta disponible, pre=0 y esto se comporta como antes. */
  const sello = GAME_SELLO();
  INTRO.pre = sello ? (sello.ms(introTxt().titulo) + sello.hold) / 1000 : 0;
  INTRO.dur = INTRO.pre + voz;
  if(sello) sello.show(introTxt().titulo);
}
/* segunda mitad de la presentacion: rotulo, pop-up y voz, ya con el nombre compuesto en pantalla */
function introVoz(){
  DESC._introVoz = true;
  descBanner(introTxt().titulo, INTRO.titulo);
  descPopup();
  const v = GAME_VOZ();
  if(v){
    try {
      v.onended = null;              // que NO reentre en la cadena del intro del juego
      v.pause(); v.currentTime = 0;
      const p = v.play();
      if(p && p.catch) p.catch(() => {});
    } catch(e){}
  }
}
/* ►SI LA VOZ NO SUENA, LA PRESENTACIÓN SE ACORTA. El clip dura 12,5 s y la
   presentación se mide con él — eso es lo que la hace "como en el juego" —,
   pero entrando por ?descenso no hay un clic previo en la home, así que el
   navegador puede rechazar el play() por autoplay: y 12,5 s de travelling MUDO
   son una eternidad.
   Se comprueba MIRANDO EL AUDIO, no la promesa de play(): esa promesa resuelve
   bien en casos en los que el clip luego no avanza, y encima llega en otro tick
   (con la presentación ya empezada). A los 0,6 s el reloj del audio dice la
   verdad, y recortar ahí es indoloro: la cuenta 3·2·1 cuelga de lo que QUEDA. */
function introVozCheck(){
  if(DESC._vozVista || DESC.introT < INTRO.pre + 0.6) return;   // ►ENTRADA: 0,6 s DESDE LA VOZ
  DESC._vozVista = true;
  const v = GAME_VOZ();
  if(!v || v.paused || v.currentTime < 0.05) INTRO.dur = Math.min(INTRO.dur, INTRO.pre + INTRO.mudo);
}
/* cuenta 3·2·1 con los MISMOS números y colores del juego, gobernada por lo que
   queda de presentación (mismo reloj que el travelling: no se desincronizan) */
function introCue(){
  const queda = INTRO.dur - DESC.introT;
  const n = queda <= 0 ? 0 : queda <= 0.8 ? 1 : queda <= 1.7 ? 2 : queda <= 2.6 ? 3 : -1;
  if(n === DESC._introN) return;
  DESC._introN = n;
  const sc = GAME_SHOWCOUNT(); if(!sc) return;
  if(n === 3) sc('3', '#ffd84f');
  else if(n === 2) sc('2', '#ff9100');
  else if(n === 1) sc('1', '#ff3b3b');
}
function raceGo(){
  DESC.phase = 'race';
  /* ►ARRANCAR PISANDO EL SUELO (Toni: "en casi todos los ?descensos empiezas
     cayendo y volando desde muy arriba; no siempre, pero a menudo").
     La altura de salida se fija en `makeRacer`, que corre ANTES de que existan
     rampas y raíles y —en el mar— con el oleaje en otro instante; entre eso y
     los segundos de presentación, el suelo de debajo ya no es el mismo y el
     primer frame de carrera te encuentra en el aire. Aquí se reasienta a cada
     corredor sobre el suelo REAL del momento de arrancar, con `_vT` a NaN para
     que el detector de despegue no crea que el terreno se le escapa. */
  for(const r of DESC.racers){
    const gy = groundYAt(r.x, r.z);
    if(gy > VACIO){ r.y = gy; r.vy = 0; r.air = false; r._vT = NaN; r.sink = 0; }
  }
  descPopupOff();
  descBanner('¡YA!', 1.0);
  try { sndBip(880, 0.20, 0.5); } catch(e){}
  if(DESC.hud && DESC.hud.root) DESC.hud.root.classList.remove('cine');
}

/* ---------------------------------------------------------------------
   ►TRAVELLING · TRES PLANOS con corte seco entre ellos (un fundido entre
   posiciones de cámara no es un plano nuevo: es un viaje, y se ve caro y
   lento). Las alturas van SOBRE EL SUELO de ese punto, no sobre el horizonte
   — la salida está en una ladera, y con Y absolutas el plano 2 acababa
   enterrado en cuanto cambiaba la pendiente de la primera banda.

   El plano 3 no termina en una pose inventada: se FUNDE a la cámara de juego
   (que stepCamera ya deja convergida detrás del jinete), así que el corte a
   "carrera" no existe — la grúa aterriza justo donde vas a jugar.
   --------------------------------------------------------------------- */
const _ciP = new THREE.Vector3(), _ciL = new THREE.Vector3();
function introCam(dt){
  const me = DESC.racers[0]; if(!me) return;
  /* ►ENTRADA: la grua se queda QUIETA durante el preroll (sello + respiro) y arranca con la voz,
     como el travelling de los mundos. El tramo que recorre es el mismo, solo empieza mas tarde. */
  const u = clamp((DESC.introT - INTRO.pre) / Math.max(0.1, INTRO.dur - INTRO.pre), 0, 1);
  let px, pz, py, lx, lz, ly, w = 1;

  if(u < 0.34){
    /* 1 · TRAVELLING LATERAL por delante de la parrilla, a ras de suelo: la
       cámara barre la línea de salida y la mirada va con ella. */
    const s = smooth(u / 0.34);
    px = lerp(-32, 32, s); pz = -13; py = 2.4;
    lx = clamp(px * 0.62, -14, 14); lz = 0.6; ly = 1.9;
  } else if(u < 0.68){
    /* 2 · CONTRAPICADO desde abajo, empujando: los cuatro recortados contra el
       cielo en lo alto de la bajada. */
    const s = smooth((u - 0.34) / 0.34);
    px = lerp(17, 7, s); pz = lerp(-56, -32, s); py = 2.8;
    lx = 0; lz = 0; ly = 2.3;
  } else {
    /* 3 · GRÚA por detrás que baja al hombro del jugador y se funde con la
       cámara de juego en el último tercio del plano. */
    const s = smooth((u - 0.68) / 0.32);
    px = me.x + lerp(9, K.camHombro, s);
    pz = me.z + lerp(44, K.camDist, s);
    py = lerp(23, K.camAlto, s);
    lx = me.x; lz = me.z - 3; ly = 1.8;
    w = 1 - smooth(clamp((s - 0.62) / 0.38, 0, 1));
  }

  _ciP.set(px, groundYAt(px, pz) + py, pz);
  _ciL.set(lx, groundYAt(lx, lz) + ly, lz);
  if(DESC.world && K.tilt){                    // el surf inclina el mundo entero
    DESC.world.updateMatrixWorld();
    DESC.world.localToWorld(_ciP); DESC.world.localToWorld(_ciL);
  }
  if(w <= 0.001) return;                       // ya es la cámara de juego: no tocar

  DESC.cam.position.lerp(_ciP, w);
  _camLook.lerp(_ciL, w);
  DESC.cam.lookAt(_camLook);
  DESC.cam.updateMatrixWorld();
  /* el cielo y el telón de fondo van PEGADOS a la cámara (stepCamera los
     coloca); moverla después sin re-sincronizarlos deja ver el borde del mundo */
  if(DESC.backdrop) DESC.backdrop.position.copy(DESC.cam.position);
  if(DESC.sky)      DESC.sky.position.copy(DESC.cam.position);
  if(DESC.cielo)    DESC.cielo.position.copy(DESC.cam.position);
}

/* =====================================================================
   ►DESCFIN — el final de carrera, que ya no es un corte seco

   Toni: "cuando se termine la carrera que no acabe abruptamente: al pasar la
   línea de meta ya no controlas al personaje, salta confeti, y te sale la tabla
   finish y el leaderboard adaptado a este minijuego".

   Tres tiempos, y ese ORDEN es el punto:
     1. cruzas   → se te quita el control (no la inercia: ver ►META SIN FRENAZO
                   en stepRacer) + confeti + rótulo con el puesto
     2. ruedas   → frenas de cantos hasta parar, con la cámara siguiéndote
     3. paras    → y SOLO entonces aparece la tabla, con todos ya quietos

   El aspecto sale entero de las clases del juego (.overlay/.lb/.confetti/.btn):
   aquí no se inventa una pantalla de resultados nueva, se usa la que ya hay.

   ►PENDIENTE (Toni: "lo de la tienda anótalo pero no lo pongas aún"): entre el
   descenso y el stage siguiente irá una TIENDA. Cuando toque, no se hace otra:
   el juego ya tiene la de entre stages (RUN_PERKS + openShop, ►PERKS/►SHOP en
   el HTML) con su cartera por jugador; lo que hará falta es convertir los
   PUNTOS del descenso en EXP de esa cartera y abrirla desde aquí.
   ===================================================================== */
/* nota D-…S+ con las etiquetas y los colores del juego, pero con los umbrales
   de ESTE minijuego: aquí una bajada buena ronda los 2.000 puntos (400 del
   puesto + globos + trucos), no los 3.200 de una partida de lucha. */
const DESC_NOTAS = [
  [2400,'S+'],[2000,'S'],[1700,'A+'],[1450,'A'],[1250,'A-'],
  [1050,'B+'],[880,'B'],[730,'B-'],[590,'C+'],[460,'C'],[340,'C-'],[200,'D+'],[110,'D'],
];
function notaDe(pts){
  for(const t of DESC_NOTAS) if(pts >= t[0]) return { label:t[1], color:notaColor(t[1]) };
  return { label:'D-', color:'#ff8d8d' };
}
function notaColor(label){
  try { if(typeof gradeColorOf === 'function') return gradeColorOf(label); } catch(e){}
  return label[0] === 'S' ? '#ffd84f' : label[0] === 'A' ? '#7affc8'
       : label[0] === 'B' ? '#6fa8ff' : label[0] === 'C' ? '#c299ff' : '#ff8d8d';
}
function hexDe(r){ return '#' + r.col.toString(16).padStart(6, '0'); }

/* ---- confeti: el mismo componente del juego (.confetti + sus animaciones CSS
   ya definidas), en una capa propia por ENCIMA del 3D. La del juego va a
   z-index −1 porque vive dentro de un overlay; aquí cuelga del body y detrás
   está el canvas, así que necesita subir. ---- */
let _confEl = null;
function descConfeti(){
  if(_confEl){ _confEl.style.display = ''; return; }
  const d = document.createElement('div');
  d.className = 'confetti'; d.id = 'descConf';
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

/* PASO 1 · alguien cruza la línea */
function metaCruzada(r){
  if(!r.human) return;                       // el confeti y el rótulo son del que juega
  descConfeti();
  descBanner(r.place === 1 ? '¡PRIMERO!' : r.place + 'º', 2.0);
  try { sndDing(3); } catch(e){}
}

/* PASO 3 · la tabla, con todos ya parados */
let _finEl = null;
function descFin(){
  if(DESC._finShown) return;
  DESC._finShown = true;
  descConfeti();
  /* el HUD de carrera se aparta: debajo de la tabla se seguirían viendo el
     velocímetro y los botones a medio tapar por el desenfoque del overlay */
  if(DESC.hud && DESC.hud.root) DESC.hud.root.classList.add('cine');
  const orden = DESC.finishOrder.slice();
  for(const r of DESC.racers) if(!orden.includes(r)) orden.push(r);
  const me = DESC.racers[0];
  const mio = notaDe(me.pts);

  if(!_finEl){
    _finEl = document.createElement('div');
    _finEl.className = 'overlay';
    _finEl.id = 'descFin';
    _finEl.style.cssText = 'z-index:122;pointer-events:auto';
    document.body.appendChild(_finEl);
  }
  /* CLASIFICACIÓN por PUESTO (quien llega antes), y la columna de PUNTOS aparte:
     en este minijuego se puede llegar el último y ser el que más puntúa, y esa
     tensión es justo lo que hace que merezca la pena reventar globos. */
  let tab = '<table class="lb"><tr><th class="nm">#</th><th class="nm">Corredor</th>' +
            '<th class="pts">Puntos</th><th>Nota</th><th>Tiempo</th>' +
            '<th>Trucos</th><th>Globos</th><th>Caídas</th><th>Máx.</th></tr>';
  orden.forEach((r, i) => {
    const g = notaDe(r.pts);
    tab += '<tr class="' + (r.human && r.i === 0 ? 'me ' : '') + (i === 0 ? 'top' : '') + '">' +
      '<td>' + (i === 0 ? '👑' : (i + 1)) + '</td>' +
      '<td class="nm"><span class="dot" style="color:' + hexDe(r) + '"></span>' + r.name + '</td>' +
      '<td class="pts">' + r.pts + '</td>' +
      '<td class="gr" style="color:' + g.color + '">' + g.label + '</td>' +
      '<td>' + r.time.toFixed(1) + 's</td>' +
      '<td>' + r.tricks + '</td><td>' + (r.globos || 0) + '</td><td>' + r.falls + '</td>' +
      '<td>' + Math.round((r.vmax || 0) * 1.6) + '</td></tr>';
  });
  tab += '</table>';

  const puesto = (DESC.finishOrder.indexOf(me) + 1) || DESC.racers.length;
  _finEl.innerHTML =
    '<h2 id="dFinT" style="margin-bottom:6px">META</h2>' +
    '<div style="font-size:19px;font-weight:900;font-style:italic;letter-spacing:2px;margin-bottom:2px;color:' + hexDe(me) + '">' +
      puesto + 'º · ' + me.name + '</div>' +
    '<div style="font-size:15px;opacity:.85;margin-bottom:10px">' + me.pts + ' puntos · nota ' +
      '<b style="color:' + mio.color + ';font-style:italic">' + mio.label + '</b></div>' +
    '<div class="endPanel" style="opacity:1">' + tab + '</div>' +
    /* ►EN CAMPANA no hay "otra vez": hay CONTINUAR, y la run sigue donde iba */
    (DESC._campana
      ? '<button class="btn" id="dFinGo">CONTINUAR <span style="opacity:.55;font-size:13px;font-weight:700">(ESPACIO)</span></button>'
      : '<button class="btn" id="dFinR">OTRA VEZ <span style="opacity:.55;font-size:13px;font-weight:700">(R)</span></button>' +
        '<button class="btn" id="dFinT2" style="margin-top:8px">OTRA PISTA <span style="opacity:.55;font-size:13px;font-weight:700">(T)</span></button>');
  _finEl.style.display = 'flex';
  const bR = _finEl.querySelector('#dFinR'), bT = _finEl.querySelector('#dFinT2'), bG = _finEl.querySelector('#dFinGo');
  if(bR) bR.onclick = () => start(DESC.seed);
  if(bT) bT.onclick = () => start((Math.random() * 1e9) | 0);
  if(bG) bG.onclick = () => salirDesc();
}

/* =====================================================================
   ►SALIR — devolverle el frame al juego, y devolverselo ENTERO

   Todo lo que este modulo toco FUERA de su escena hay que deshacerlo:
     · #banner / #count321 / #stageCaution los MOVIO a su HUD (buildHud lo hace
       porque boot() del juego esconde #hud). Sin devolverlos, el juego presenta
       el stage siguiente dentro de un HUD oculto y el rotulo NO SE VE.
     · el shadowMap del renderer.
     · su HUD y su tabla, que si no se quedan tapando la partida.
   ===================================================================== */
function salirDesc(){
  const cb = DESC._alAcabar;
  const me = DESC.racers[0];
  const res = { puntos: (me && me.pts) || 0, puesto: (me && me.place) || 0, piel: SKIN };
  DESC.on = false;
  DESC._alAcabar = null;
  descFinOff();
  try { descPopupOff(); } catch(e){}
  if(DESC.hud && DESC.hud.root) DESC.hud.root.style.display = 'none';
  const hud = document.getElementById('hud');
  if(hud) for(const id of ['count321', 'banner', 'stageCaution', 'stageStamp', 'stageStampRing']){
    const el = document.getElementById(id);
    if(el && el.parentNode !== hud) hud.appendChild(el);
  }
  const rr = GAME_RENDERER();
  if(rr && DESC._rrPrev){ rr.shadowMap.enabled = DESC._rrPrev.sh; rr.shadowMap.needsUpdate = true; DESC._shadowOn = null; }
  if(hud) hud.style.display = '';
  try { if(SND.wind) SND.wind.g.gain.value = 0; if(SND.silb) SND.silb.g.gain.value = 0;
        if(SND.carve) SND.carve.g.gain.value = 0; if(SND.grind) SND.grind.g.gain.value = 0; } catch(e){}
  if(typeof cb === 'function'){ try { cb(res); } catch(e){ console.warn('[descenso] alAcabar', e); } }
}

/* ►LA PUERTA DE ENTRADA DESDE LA CAMPANA (la usa `lanzarMini` de la RUTA).
   `piel` cambia sandboard / surf / snowboard en caliente: ver aplicaPiel. */
/* piel actual, o cambiarla: `DESC.piel('nieve')`. Tambien es el knob para
   probar las tres desde consola sin recargar. */
DESC.piel  = p => { if(p) aplicaPiel(p); return SKIN; };
DESC.esMar = () => MAR;
DESC.salir = () => salirDesc();

DESC.lanzar = function(opt){
  opt = opt || {};
  DESC._campana = opt.campana !== false;
  DESC._nombre = opt.nombre || null;          // ►NOMBRES: rotulo oficial del eslabon de la RUTA
  DESC._clase  = opt.clase  || null;          // ►PERSONAJE: el que llevas en la campania
  DESC._alAcabar = opt.alAcabar || null;
  if(opt.piel && opt.piel !== SKIN) aplicaPiel(opt.piel);
  const rr = GAME_RENDERER();
  if(rr) DESC._rrPrev = { sh: rr.shadowMap.enabled };
  if(!DESC._built){ DESC._built = true; buildHud(); }
  if(DESC.hud && DESC.hud.root) DESC.hud.root.style.display = '';
  if(DESC.hud && DESC.hud.root) for(const id of ['count321', 'banner', 'stageCaution', 'stageStamp', 'stageStampRing']){
    const el = document.getElementById(id);
    if(el && el.parentNode !== DESC.hud.root) DESC.hud.root.appendChild(el);
  }
  const hud = document.getElementById('hud');
  if(hud) hud.style.display = 'none';
  start(opt.semilla || ((Math.random() * 1e9) | 0));
  DESC.on = true;
  return true;
};
function descFinOff(){
  DESC._finShown = false; DESC._finT = 0;
  if(_finEl) _finEl.style.display = 'none';
  if(_confEl) _confEl.style.display = 'none';
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
    /* ►TÚNEL: desenfoque de la periferia. La máscara radial deja el centro
       nítido y difumina hacia los bordes; el `will-change` evita que Chromium
       recomponga la capa entera en cada cambio de filtro. */
    '<div id="dBlur" style="position:absolute;inset:0;opacity:0;backdrop-filter:blur(0px);' +
      '-webkit-backdrop-filter:blur(0px);will-change:backdrop-filter;' +
      'mask-image:radial-gradient(ellipse 62% 62% at 50% 54%,rgba(0,0,0,0) 40%,#000 100%);' +
      '-webkit-mask-image:radial-gradient(ellipse 62% 62% at 50% 54%,rgba(0,0,0,0) 40%,#000 100%)"></div>' +
    '<div id="dVig" style="position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 42%,rgba(0,0,0,.5) 100%)"></div>' +
    '<div id="dTop" style="position:absolute;top:14px;left:50%;transform:translateX(-50%);text-align:center;font-size:15px;font-weight:700"></div>' +
    '<div id="dZone" style="position:absolute;top:44px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;letter-spacing:1px;opacity:0"></div>' +
    '<div id="dLeft" style="position:absolute;top:14px;left:16px;background:rgba(6,10,20,.5);padding:9px 13px;border-radius:9px"></div>' +
    '<div id="dRight" style="position:absolute;top:14px;right:16px;background:rgba(6,10,20,.5);padding:9px 13px;border-radius:9px;text-align:right"></div>' +
    '<div id="dTrick" style="position:absolute;top:31%;left:50%;transform:translate(-50%,-50%);font-size:34px;font-weight:900;opacity:0;color:#ffe14d"></div>' +
    '<div id="dSalta" style="position:absolute;top:22%;left:50%;transform:translate(-50%,-50%);font-size:44px;font-weight:900;opacity:0;color:#ff5a3d;letter-spacing:1px"></div>' +
    /* la chuleta de trucos sube por encima de la fila de botones (antes se
       solapaban: ►BOTHUD ocupa los 90 px de abajo) */
    '<div id="dAire" style="position:absolute;left:50%;bottom:158px;transform:translateX(-50%);opacity:0;' +
      'background:rgba(6,10,20,.72);padding:10px 16px;border-radius:12px;font-size:15px;line-height:1.7;white-space:nowrap"></div>' +
    '<div id="dBig" style="position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);font-size:84px;font-weight:900;letter-spacing:-2px"></div>' +
    '<div id="dBar" style="position:absolute;left:50%;bottom:22px;transform:translateX(-50%);width:min(620px,72vw);height:9px;background:rgba(0,0,0,.42);border-radius:6px;overflow:hidden">' +
      '<div id="dFill" style="height:100%;width:0;background:#fff;border-radius:6px"></div></div>' +
    /* ►RANKPTS: el ranking de PUNTOS, a la izquierda y deslizante — el mismo
       componente que el de EXP del juego (clases .rkRow/.rkPos/.rkDot/...).
       Id propio (#dRank, no #rank) porque pollMoveSheet() oculta el del juego
       cuando `running` es false, y aquí siempre lo es. */
    '<div id="dRank"></div>' +
    /* ►CONTROLES ABAJO-CENTRO, como la fila de botones del juego. Se reutilizan
       sus clases (.hbtn/.hDisc/.hFill/.hInner/.hKey/.hPad/.hName): aquí no se
       inventa un HUD nuevo, se usa el que ya existe. Todos van con el anillo
       tenue de .util porque en el descenso no hay enfriamientos (Toni). */
    '<div id="dAtk"></div>' +
    '<div id="dHelp" style="position:absolute;left:50%;bottom:8px;transform:translateX(-50%);opacity:.45;font-size:10px;white-space:nowrap">' +
      'RUEDA / stick derecho: cámara · R reiniciar · T semilla nueva</div>';
  document.body.appendChild(d);
  /* posicionamiento propio de los dos contenedores nuevos (el ASPECTO lo ponen
     las clases del juego; esto solo dice DÓNDE van) */
  const st = document.createElement('style');
  st.textContent =
    '#dRank{position:absolute;left:16px;top:50%;width:186px;transform:translateY(-50%) scale(var(--hudScale,1));' +
      'transform-origin:left center;pointer-events:none;font-family:"Segoe UI",system-ui,sans-serif;text-shadow:none}' +
    '#dAtk{position:absolute;left:50%;bottom:26px;transform:translateX(-50%) scale(var(--hudScale,1));' +
      'transform-origin:bottom center;display:flex;align-items:flex-start;justify-content:center;gap:9px;' +
      'pointer-events:none;font-family:"Segoe UI",system-ui,sans-serif;text-shadow:none;max-width:96vw;flex-wrap:wrap}' +
    /* la barra de progreso de la bajada se sube para no chocar con los botones */
    '#dBar{bottom:104px !important}' +
    /* ►DESCINTRO: durante la presentación el HUD se aparta — un travelling con
       velocímetro y botones encima no es una cinemática, es una pausa */
    '#descHud #dTop,#descHud #dLeft,#descHud #dRight,#descHud #dBar,#descHud #dRank,' +
      '#descHud #dAtk,#descHud #dHelp{transition:opacity .4s ease}' +
    '#descHud.cine #dTop,#descHud.cine #dLeft,#descHud.cine #dRight,#descHud.cine #dBar,' +
      '#descHud.cine #dRank,#descHud.cine #dAtk,#descHud.cine #dHelp,' +
      '#descHud.cine #dZone,#descHud.cine #dSalta,#descHud.cine #dAire,#descHud.cine #dTrick{opacity:0 !important}';
  document.head.appendChild(st);
  /* ►DESCINTRO-DOM: los nodos de presentación del juego (#count321, #banner y
     #stageCaution) viven dentro de #hud, y boot() oculta #hud cada 250 ms
     durante los primeros 30 s → la presentación corría sin verse. Se los trae
     aquí: son position:absolute y #descHud es position:fixed;inset:0, así que
     caen en el mismo punto de la pantalla. Las referencias del juego (el const
     count321, los getElementById) siguen valiendo: el nodo es el mismo. */
  for(const id of ['count321', 'banner', 'stageCaution', 'stageStamp', 'stageStampRing']){
    const el = document.getElementById(id);
    if(el && el.parentNode !== d) d.appendChild(el);
  }
  DESC.hud = { root:d, top:d.querySelector('#dTop'), left:d.querySelector('#dLeft'),
    right:d.querySelector('#dRight'), big:d.querySelector('#dBig'), fill:d.querySelector('#dFill'),
    vig:d.querySelector('#dVig'), blur:d.querySelector('#dBlur'),
    trick:d.querySelector('#dTrick'), zone:d.querySelector('#dZone'),
    salta:d.querySelector('#dSalta'), aire:d.querySelector('#dAire'),
    rank:d.querySelector('#dRank'), atk:d.querySelector('#dAtk') };
  buildAtkBar();
}

/* ►CONTROLES (abajo-centro). Un disco por acción con la TECLA grande y el
   BOTÓN DE MANDO debajo, en el color del mando — igual que en el juego. Aquí
   NO hay enfriamiento, así que todos llevan el anillo tenue fijo (.util).
   Los códigos de mando son los que lee readDesc(): A=0, X=2, LB=4, LT=6, RT=7. */
const DESC_CTRL = [
  { key:'Q',     pad:'LB', name:'Canto izq.', col:'#c299ff' },
  { key:'A / D', pad:'⇆',  name:'Girar',      col:'#7affc8' },
  { key:'E',     pad:'RB', name:'Canto dcha.',col:'#c299ff' },
  { key:'ESP',   pad:'A',  name:'Saltar',     col:'#3ad06a' },
  { key:'SHIFT', pad:'RT', name:'Turbo',      col:'#ff9f6b', id:'turbo' },
  { key:'S',     pad:'LT', name:'Frenar',     col:'#7fd0ff' },
  { key:'1..6',  pad:'B/Y',name:'Trucos',     col:'#ffd84f' },
];
function buildAtkBar(){
  const el = DESC.hud && DESC.hud.atk; if(!el) return;
  el.innerHTML = DESC_CTRL.map(c =>
    '<div class="hbtn util" style="--pc:' + c.col + '">' +
      '<div class="hDisc">' +
        '<i class="hFill"></i>' +
        '<span class="hLab"' + (c.id ? ' id="dctl_' + c.id + '"' : '') + '></span>' +
        '<div class="hInner">' +
          '<div class="hPad' + (/^[ABXY]$/.test(c.pad) ? ' round' : '') + '">' + c.pad + '</div>' +
          '<span class="hKey">' + c.key + '</span>' +
        '</div>' +
      '</div>' +
      '<span class="hName">' + c.name + '</span>' +
    '</div>').join('');
  /* el TURBO es lo único con espera: no lleva anillo (Toni no quiere anillos de
     enfriamiento aquí), se APAGA mientras se recarga y enseña los segundos */
  DESC.hud.bTurbo = el.querySelector('#dctl_turbo') ? el.querySelector('#dctl_turbo').closest('.hbtn') : null;
  DESC.hud.bTurboLab = el.querySelector('#dctl_turbo');
}

/* ►RANKPTS: una fila por corredor, colocada en absoluto y movida con transform
   → al adelantar, la fila SE DESLIZA a su puesto en vez de saltar. Es
   exactamente el patrón del ranking de EXP del juego. */
function updateRank(){
  const h = DESC.hud; if(!h || !h.rank) return;
  const rs = DESC.racers; if(!rs || !rs.length) return;
  if(!h._rkRows || h._rkRows.length !== rs.length){
    h.rank.innerHTML = '';
    h._rkRows = rs.map(r => {
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
  /* orden por PUNTOS; a igualdad, va delante quien está más abajo en la pista */
  const orden = rs.slice().sort((a, b) => (b.pts - a.pts) || (a.z - b.z));
  for(let p = 0; p < orden.length; p++){
    const r = orden[p], w = h._rkRows[r.i];
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

  h.vig.style.opacity = (k*0.62).toFixed(2);

  /* ►TÚNEL: el desenfoque periférico crece con la velocidad. El centro se
     mantiene nítido siempre (si no, no ves por dónde vas). */
  if(h.blur){
    const kb = Math.max(0, (k - K.blurDesde) / (1 - K.blurDesde));
    const px = (K.blurMax * kb * kb).toFixed(2);
    if(h._blurPx !== px){
      h._blurPx = px;
      h.blur.style.backdropFilter = 'blur(' + px + 'px)';
      h.blur.style.webkitBackdropFilter = 'blur(' + px + 'px)';
      h.blur.style.opacity = kb > 0.01 ? 1 : 0;
      /* el ojo limpio se ESTRECHA al correr: es lo que da el túnel */
      const r0 = (K.blurCentro * 100 * (1 - 0.35 * kb)).toFixed(0);
      const mk = 'radial-gradient(ellipse 62% 62% at 50% 54%,rgba(0,0,0,0) ' + r0 + '%,#000 100%)';
      h.blur.style.maskImage = mk; h.blur.style.webkitMaskImage = mk;
    }
  }

  /* ►AVISO DE CANTO: se enciende ANTES de que te enganche, y parpadea al final */
  if(me.chat > K.chatAviso && !me.air){
    const t2 = (me.chat - K.chatAviso) / (1 - K.chatAviso);
    h.salta.textContent = '¡CLAVA CANTOS!';
    h.salta.style.color = t2 > 0.55 ? '#ff3d2e' : '#ffd23f';
    h.salta.style.opacity = (0.55 + 0.45 * Math.abs(Math.sin(DESC.t * (6 + t2*14)))).toFixed(2);
    h._cantoOn = true;
  } else if(h._cantoOn){ h.salta.style.opacity = 0; h._cantoOn = false; }

  const tb = Math.ceil(me.dash / K.dashMax * 6);
  const ch = Math.round(me.charge / K.ollieChg * 6);
  h.left.innerHTML =
    '<div style="font-size:26px;font-weight:900;line-height:1">' + place + 'º</div>' +
    '<div style="font-size:18px;font-weight:800;color:' + (me.turbo ? '#ffd23f' : '#fff') + '">' +
      Math.round(me.spd*1.6) + ' km/h</div>' +
    '<div style="opacity:.8">turbo ' + ((me.turboCd||0) > 0
        ? '<b style="color:#ff8a3d">recargando ' + me.turboCd.toFixed(1) + 's</b>'
        : '▮'.repeat(tb) + '▯'.repeat(6-tb)) + '</div>' +
    (me._canto ? '<div style="color:#c299ff;font-weight:800">◄ CANTO ' + (me._canto < 0 ? 'IZQ' : 'DCHA') + ' ►</div>' : '') +
    (me._pump > 1.5 ? '<div style="color:#7bf06a;font-weight:800">◄ TALLANDO +' +
        Math.round(me._pump) + ' ►</div>' : '') +
    (me.charge > 0 ? '<div style="color:#7bf06a">ollie ' + '▮'.repeat(ch) + '▯'.repeat(6-ch) + '</div>' : '') +
    '<div style="opacity:.7">suelo ' + (hard > 0.62 ? '<b style="color:#7bf06a">DURO</b>'
      : hard < 0.38 ? '<b style="color:#ff8a3d">PROFUNDO</b>' : 'normal') +
      (me.skid > 0.02 ? ' · <b style="color:#ff8a3d">DERRAPE</b>' : '') + '</div>' +
    '';

  h.right.innerHTML =
    '<div style="font-size:20px;font-weight:800">' + me.pts + ' pts</div>' +
    '<div style="opacity:.8">' + me.tricks + ' trucos · ' + me.falls + ' caídas</div>' +
    '<div style="opacity:.8">' + DESC.t.toFixed(1) + ' s</div>';

  /* ►RANKPTS: quién va primero EN PUNTOS, a la izquierda */
  updateRank();
  /* el TURBO, lo único con espera: el botón se apaga mientras se recarga y
     enseña los segundos que faltan (sin anillo — aquí no los hay) */
  if(h.bTurbo){
    const esperando = (me.turboCd || 0) > 0;
    h.bTurbo.style.opacity = esperando ? '.42' : '';
    if(h.bTurboLab) h.bTurboLab.textContent = esperando ? Math.ceil(me.turboCd) : '';
  }

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
  if(avisoZ < 105 && !me.air && !h._cantoOn){
    h.salta.textContent = avisoZ < 42 ? '¡SALTA!' : 'PRECIPICIO';
    h.salta.style.opacity = (avisoZ < 42 ? 1 : 0.72).toFixed(2);
    h.salta.style.color = avisoZ < 42 ? '#ff3d2e' : '#ffb03d';
  } else h.salta.style.opacity = 0;

  h.top.innerHTML = order.map(r => '<span style="color:#' + r.col.toString(16).padStart(6,'0') + ';margin:0 7px">' + r.name + '</span>').join('');
  h.trick.style.opacity = (me._lastTrickT > 0) ? Math.min(1, me._lastTrickT) : 0;
  if(me._lastTrickT > 0) h.trick.textContent = me._lastTrick || '';
  h.fill.style.width = Math.min(100, (-me.z/K.len)*100) + '%';

  /* el numerón del centro ya no lo pinta el descenso: la cuenta atrás la lleva
     el #count321 del juego (►DESCINTRO) y el resultado, la tabla (►DESCFIN) */
  h.big.style.opacity = 0;
}

/* =====================================================================
   ARRANQUE
   ===================================================================== */
function start(seed){
  try{ if(window.showMiniObjective) showMiniObjective('QUEDA EL PRIMERO EN PUNTOS Y GANA EL TROFEO'); }catch(e){}   // ►OBJTXT (Toni 24/08)
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
  /* ►DESCINTRO: la partida arranca en PRESENTACIÓN (voz + travelling + 3·2·1),
     no en una cuenta atrás pelada */
  DESC.t = 0; DESC.phase = 'intro';
  DESC.introT = 0; DESC._introGo = false; DESC._introVoz = false; DESC._introN = -1; DESC._vozVista = false;
  descPopupOff(); descFinOff();
  if(DESC.hud && DESC.hud.root) DESC.hud.root.classList.add('cine');
  DESC.finishOrder = []; _camInit = false; DESC._acc = 0; DESC._why = {};
  DESC.kick.y = DESC.kick.v = 0;
  DESC.orb.yaw = DESC.orb.pitch = 0; DESC.orb.idle = 9; DESC._camYaw = null; DESC._espera = 0; DESC._nSuave = null; DESC._vuelo = 0;
  DESC._zn = null; DESC._znT = 0;
  console.log('[descenso] semilla=' + seed + ' · ' + DESC.obst.length + ' props · piel=' + SKIN +
              ' · ' + BANDS.length + ' bandas · ' + Math.round(K.len) + ' u · desnivel ' +
              Math.round(-baseY(-K.len)) + ' u');
}
DESC._start = start;

DESC.tick = function(dt){
  if(!DESC.scene) return;
  dt = Math.min(0.05, dt);

  if(DESC.phase === 'intro'){
    /* ►PARRILLA LISTA. Toni: "cuando se inicia la partida deben estar ya
       preparados los personajes". Los GLB son 12 MB y llegan async, así que la
       presentación podía acabar con cápsulas grises en la línea — y ahora,
       además, el travelling pasa por delante de ellos. La presentación ESPERA a
       que los cuatro estén montados (con tope, para que un fallo de carga no
       cuelgue la salida) y solo entonces arranca la voz y el reloj. */
    const listos = DESC.racers.length && DESC.racers.every(r => r.montado);
    DESC._espera = (DESC._espera || 0) + dt;
    if(!DESC._introGo && (listos || DESC._espera > INTRO.espera)) introGo();
    if(DESC._introGo){
      DESC.introT += dt;
      if(!DESC._introVoz && DESC.introT >= INTRO.pre) introVoz();
      introVozCheck();
      introCue();
      if(DESC.introT >= INTRO.dur) raceGo();
    }
  } else if(DESC.phase === 'race' || DESC.phase === 'finish'){
    /* input UNA vez por frame (leer el gamepad 120 veces sería absurdo).
       ►META: al que ya ha cruzado se le da un input NEUTRO con el freno puesto
       — sigue simulándose (rueda y frena de cantos) pero ya no lo maneja nadie,
       ni el jugador ni la IA. La fase 'finish' sigue pisando el bucle para que
       el ÚLTIMO en llegar también ruede en vez de congelarse en el aire. */
    for(const r of DESC.racers){
      r._inp = r.done ? { ax:0, canto:0, jump:false, turbo:false, trick:null, freno:true }
             : (r.human && !r.aiDrive) ? readDesc(r) : aiInput(r, dt);
    }

    /* PASO FIJO: estabilidad del modelo de canto y determinismo para el online */
    DESC._acc += dt;
    let guard = 0;
    while(DESC._acc >= K.fixed && guard++ < 12){
      DESC._acc -= K.fixed;
      DESC.t += K.fixed;
      /* ►OLA: el reloj del mar va DENTRO del paso fijo y con el mismo valor que
         usa terrainY, o la ola que se dibuja iría medio frame por delante de la
         que se pisa */
      if(MAR) OLA_U.uTime.value = DESC.t;
      for(const r of DESC.racers) stepRacer(r, K.fixed);
      leash();
    }
    if(guard >= 12) DESC._acc = 0;

    if(DESC.racers.every(r => r.done)) DESC.phase = 'finish';
    /* al rezagado no se le espera eternamente: 8 s después del primero se le da
       la carrera por terminada donde esté (y desde ahí también rueda) */
    if(DESC.finishOrder.length && DESC.t - DESC.finishOrder[0].time > 8){
      for(const r of DESC.racers) if(!r.done){
        r.done = true; r.time = DESC.t; r.rollT = 0; DESC.finishOrder.push(r);
        r.place = DESC.finishOrder.length;
        r.pts += K.ptsPos[Math.min(K.ptsPos.length-1, r.place-1)];
      }
      DESC.phase = 'finish';
    }
    /* ►DESCFIN: la tabla no salta en el mismo fotograma que la meta — primero
       se ve al jinete rodar y frenar, y con TODOS parados aparece el resultado */
    if(DESC.phase === 'finish'){
      DESC._finT = (DESC._finT || 0) + dt;
      /* el backstop no es paranoia: quien cruza la meta CAÍDO entra por la rama
         de `fall`, que sale de stepRacer antes de poder marcarse `parado` */
      if(DESC.racers.every(r => r.parado) || DESC._finT > 6) descFin();
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
    animEstado(r);
    if(r.mixer) r.mixer.update(dt);
    /* ►KITE: DESPUÉS del mixer — el IK de los brazos pisa lo que puso el clip */
    if(r.kite) updateKite(r, dt);
  }

  updateGlobos(dt);
  updatePop(dt);
  updateOlaza();          // ►OLAZA: se recoloca detrás del pelotón
  stepCamera(dt);
  /* ►DESCINTRO: la cinemática va DESPUÉS de la cámara de juego, no en su lugar
     — así stepCamera converge por debajo y el último plano puede fundirse con
     ella sin corte (ver introCam) */
  if(DESC.phase === 'intro') introCam(dt);
  updateParts(dt);
  updateTrail(dt);
  updateStreaks(dt, DESC._spdK || 0);
  updatePolvo(dt);
  updateRafagas(dt);
  updateAudio(dt);
  updateHud(dt);
};

/* =====================================================================
   ►DESCINK — el CONTORNO del juego normal, aquí

   El descenso pinta DIRECTO a pantalla (no pasa por el composer del juego),
   así que no heredaba NADA de su postproceso: ni el anillo de color de los
   personajes ni la tinta del mundo. Esto lo reproduce sin tocar el render que
   ya funciona:

     · NO se re-renderiza la escena a un render-target para filtrarla. Ese blit
       se come el MSAA (el descenso sí lo tiene: pinta a la pantalla) y obliga a
       replicar a mano tonemapeo y encoding.
     · Los dos efectos del juego son `mix(fondo, color, a)`: el anillo va POR
       FUERA de la silueta y la tinta es una línea oscura. O sea, alfa-blending
       puro → basta con pintar ENCIMA un quad que solo tenga alpha en el borde;
       el resultado es idéntico y el píxel de dentro ni se toca.

   Sus dos entradas van en UN target auxiliar a media resolución:
     1) la PROFUNDIDAD de lo sólido. Los transparentes se OCULTAN: con
        overrideMaterial three los sigue dibujando (el bucket lo decide su
        material real), y las rayas de velocidad o el polvo escribirían depth
        delante de todo → bordes de tinta inventados a media pantalla. Los
        riders también se ocultan: un overrideMaterial con skinning:true PETA
        en r128 en cuanto toca una malla sin esqueleto (getMaxBones lee
        object.skeleton), y sin skinning escribirían su pose-T. No hace falta,
        sus píxeles los tapa la silueta de (2).
     2) encima, y SIN borrar la profundidad, los riders en SU COLOR (capa
        DINK_LAYER y material plano por malla — ahí sí con skinning si toca).
   ===================================================================== */
const DINK = {
  chars:  true,      // anillo de color por fuera del rider
  mundo:  true,      // tinta oscura en los bordes del escenario
  grosor: 0.0035,    // = thickness del contorno del juego. Fracción de ALTURA de pantalla → mismo borde a cualquier resolución
  fuerza: 1.0,
  tinta:  0.45,      // = strength del inkPass del juego
  umbral: 0.030,     // curvatura relativa que ya cuenta como borde (ver el shader: es adimensional)
  limGrow:0.0006,    // ...y cuánto sube ese umbral con la distancia (poda el ruido del fondo)
  color:  0x0a0c16,
  /* ►GROSOR DE LA TINTA = RESOLUCIÓN DEL PASE. La línea de un detector de
     bordes mide 1-2 TÉXELES, así que a 0,5 salía del doble de gruesa que la del
     juego (que va a resolución completa en el composer) y, peor, ROTA: a media
     resolución un borde casi horizontal cae dentro o fuera del téxel según la
     fila y la línea se queda a trozos. Toni: "el outline del decorado debe ser
     fino como en los stages de rumbleboys... y evita que las líneas se rompan".
     Full-res para el pase de tinta; el ahorro se busca en calidad Media/Baja
     (ver aplicaCalidad), no degradando el look por defecto. */
  escala: 1.0
};
const DINK_LAYER = 5;
DESC.ink = DINK;   // los knobs, tocables en vivo desde consola (todo lo demás vive dentro del IIFE)
let _dkRT = null, _dkSc = null, _dkCam = null, _dkU = null, _dkDepth = null;
const _dkSil = {}, _dkHid = [], _dkSwap = [];
/* material de PROFUNDIDAD para lo que flota con la ola, uno por modo. Va sobre
   Lambert y no sobre Basic a propósito: el parche de la ola se engancha en
   `beginnormal_vertex`, y el vertex de MeshBasicMaterial sólo lo incluye si hay
   envMap — con Basic el reemplazo no encontraría su ancla y el shader saldría
   sin compilar. `colorWrite:false` deja el pase igual de barato. */
const _dkProf = {};
function _matProfOla(modo){
  if(!_dkProf[modo]){
    const m = new THREE.MeshLambertMaterial({ colorWrite:false });
    aplicaOlaShader(m, modo === 'ancla');
    _dkProf[modo] = m;
  }
  return _dkProf[modo];
}
let _dkTmpC = null, _dkTmpV = null;

function dinkBuild(rr){
  if(DINK._ko) return false;
  if(!_dkTmpV) _dkTmpV = new THREE.Vector2();
  if(!_dkTmpC) _dkTmpC = new THREE.Color();
  const ds = rr.getDrawingBufferSize(_dkTmpV);
  const w = Math.max(2, Math.round(ds.x * DINK.escala)), h = Math.max(2, Math.round(ds.y * DINK.escala));
  if(_dkRT && _dkRT.width === w && _dkRT.height === h) return true;
  try {
    if(!(rr.capabilities.isWebGL2 || rr.extensions.get('WEBGL_depth_texture'))) throw new Error('sin depth texture');
    if(_dkRT){ if(_dkRT.depthTexture) _dkRT.depthTexture.dispose(); _dkRT.dispose(); }
    _dkRT = new THREE.WebGLRenderTarget(w, h, { minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter,
                                                format:THREE.RGBAFormat, depthBuffer:true, stencilBuffer:false });
    /* 24 bits: con near=0.5 / far=5000, un depth de 16 bits deja el umbral de
       borde POR DEBAJO del ruido de cuantización y la tinta hierve. */
    const dt = new THREE.DepthTexture(w, h);
    dt.type = THREE.UnsignedIntType;
    _dkRT.depthTexture = dt;
  } catch(e){ console.warn('[descenso] contorno desactivado:', e.message); DINK._ko = true; return false; }

  if(!_dkSc){
    _dkU = {
      tSil:{ value:null }, tDepth:{ value:null },
      texel:{ value:new THREE.Vector2(1/w, 1/h) },
      grosor:{ value:DINK.grosor }, fuerza:{ value:DINK.fuerza },
      near:{ value:0.5 }, far:{ value:5000 },
      tinta:{ value:DINK.tinta }, umbral:{ value:DINK.umbral }, limGrow:{ value:DINK.limGrow },
      fogNear:{ value:190 }, fogFar:{ value:700 },
      inkCol:{ value:new THREE.Color(DINK.color) }
    };
    const mat = new THREE.ShaderMaterial({ uniforms:_dkU, transparent:true, depthTest:false, depthWrite:false, fog:false,
      vertexShader:'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader:[
        '#include <packing>',
        'uniform sampler2D tSil; uniform sampler2D tDepth;',
        'uniform vec2 texel; uniform float grosor, fuerza, near, far, tinta, umbral, limGrow, fogNear, fogFar;',
        'uniform vec3 inkCol; varying vec2 vUv;',
        /* w = 1/z. Para CUALQUIER plano, 1/z es AFÍN en coordenadas de pantalla
           (la profundidad del z-buffer también, por eso interpola bien), así que
           su segunda diferencia vale 0 mires el plano de frente o de canto. Con
           la primera derivada —lo que hace el pase del juego— una ladera vista
           casi de perfil dispara el umbral en TODOS sus píxeles: la primera
           versión de esto llenó el descenso de manchones oscuros barriendo la
           duna. La curvatura solo salta donde el plano se ROMPE: siluetas y
           aristas, que es justo lo que se quiere dibujar. */
        'float wz(vec2 uv){ return 1.0 / max(1e-4, -perspectiveDepthToViewZ(texture2D(tDepth,uv).x, near, far)); }',
        'void main(){',
        '  vec4 cur = texture2D(tSil, vUv);',
        '  if(cur.a > 0.4) discard;',                       // DENTRO del rider: ni anillo ni tinta (la línea va por fuera)
        '  vec2 o = vec2(texel.x/texel.y, 1.0) * grosor;',  // radio isótropo en fracción de altura
        '  vec3 oc = vec3(0.0); float found = 0.0;',
        '  for(int i=0;i<16;i++){',                         // 16 direcciones: si hay un rider a <= grosor, borde con SU color
        '    float a = float(i)*0.392699;',                 // 2*PI/16
        '    vec2 d = vec2(cos(a), sin(a));',
        '    vec4 s = texture2D(tSil, vUv + d*o);',
        '    if(s.a > 0.85){ oc = s.rgb; found = 1.0; }',
        '  }',
        '  if(found > 0.0){ gl_FragColor = vec4(oc, found*fuerza); return; }',
        '  if(tinta <= 0.0) discard;',
        '  float wc = wz(vUv); float z = 1.0/wc;',
        '  if(z > far*0.95) discard;',                      // cielo / target sin escribir (el pase recorta el plano lejano a la niebla)
        '  vec2 ex = vec2(texel.x, 0.0), ey = vec2(0.0, texel.y);',
        '  float kx = abs(wz(vUv+ex) + wz(vUv-ex) - 2.0*wc);',
        '  float ky = abs(wz(vUv+ey) + wz(vUv-ey) - 2.0*wc);',
        /* ►LÍNEAS QUE NO SE ROMPEN. Con solo los dos ejes, un borde que corre
           casi paralelo a uno de ellos cae dentro o fuera del téxel según la
           fila y la línea sale a trazos. Las DIAGONALES cruzan ese mismo borde
           en ángulo, así que responden donde los ejes fallan. Van a la mitad de
           peso porque su paso es sqrt(2) téxeles y la segunda diferencia crece
           con el cuadrado del paso: sin normalizar, cualquier borde diagonal
           saldría el doble de fuerte. */
        '  vec2 d1 = vec2(texel.x, texel.y), d2 = vec2(texel.x, -texel.y);',
        '  float ka = abs(wz(vUv+d1) + wz(vUv-d1) - 2.0*wc) * 0.5;',
        '  float kb = abs(wz(vUv+d2) + wz(vUv-d2) - 2.0*wc) * 0.5;',
        /* ×z lo vuelve ADIMENSIONAL: una silueta da ~1 esté a 10 u o a 300, así
           que el umbral no necesita crecer con la distancia (limGrow se queda
           como retoque fino, no como muleta). */
        '  float rel = max(kx + ky, ka + kb) * z;',
        /* la tinta se DISUELVE con la niebla, igual que el objeto que contornea:
           si no, quedan líneas oscuras flotando en un horizonte ya lavado. */
        '  float fogT = smoothstep(fogNear, fogFar, z);',
        '  float lim = umbral*(1.0 + z*limGrow);',
        /* ►ANTIALIASING SIN PAGARLO. El descenso pinta a pantalla con MSAA, pero
           esto es un quad transparente ENCIMA: el MSAA no suaviza su borde. La
           rampa ES el suavizado — un tramo ancho (0,7·lim → 2,2·lim) convierte
           la respuesta parcial de un píxel a medio borde en alfa parcial en vez
           de en un sí/no dentado. Coste cero: es el mismo smoothstep. */
        '  float ink = smoothstep(lim*0.7, lim*2.2, rel) * tinta * (1.0 - fogT);',
        '  if(ink <= 0.004) discard;',
        '  gl_FragColor = vec4(inkCol, ink);',
        '}'].join('\n')
    });
    const q = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    q.frustumCulled = false;
    _dkSc = new THREE.Scene(); _dkSc.add(q);
    _dkCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }
  _dkU.texel.value.set(1/w, 1/h);
  return true;
}

function dinkDraw(rr){
  if((!DINK.chars && !DINK.mundo) || !DESC.scene || !DESC.cam || !DESC.racers) return;
  if(!dinkBuild(rr)) return;
  const sc = DESC.scene, cam = DESC.cam;

  /* --- estado del renderer / de la escena que hay que devolver TAL CUAL --- */
  const pMask = cam.layers.mask, pAuto = rr.autoClear, pBg = sc.background, pOv = sc.overrideMaterial;
  const pSA = rr.shadowMap.autoUpdate, pSN = rr.shadowMap.needsUpdate;
  const pcC = (rr.getClearColor(_dkTmpC) || _dkTmpC).getHex(), pcA = rr.getClearAlpha();
  rr.shadowMap.autoUpdate = false; rr.shadowMap.needsUpdate = false;   // este pase extra NO re-renderiza sombras
  sc.background = null;              // si no, el fondo rellena el target con alfa 1 y la silueta no se distingue del vacío
  rr.setClearColor(0x000000, 0);
  /* PLANO LEJANO RECORTADO a la niebla mientras dura el pase. La tinta ya se
     disuelve en `fogFar`, así que todo lo que hay detrás se dibujaba para
     nada: con far=5000 el pase extra DOBLABA los triángulos del frame (827k →
     1,6M). Recortarlo lo deja en un sobrecoste pequeño, y de paso el depth de
     24 bits gana precisión. El shader tiene que leer ESTE near/far, no los de
     la cámara, o la linealización sale mal. */
  const pFar = cam.far;
  const fFar = sc.fog ? Math.min(cam.far, sc.fog.far * 1.06) : cam.far;
  if(fFar < cam.far){ cam.far = fFar; cam.updateProjectionMatrix(); }
  rr.setRenderTarget(_dkRT);
  rr.clear(true, true, false);

  /* 1) PROFUNDIDAD del mundo sólido. Se hace SIEMPRE, aunque la tinta esté
     apagada: es también lo que hace que la silueta de (2) quede OCULTA cuando
     el rider pasa por detrás de una roca. Sin ella, el anillo flota sobre la
     duna que lo tapa. */
  _dkHid.length = 0;
  {
    for(const r of DESC.racers) if(r.body && r.body.visible){ r.body.visible = false; _dkHid.push(r.body); }
    sc.traverse(o => {
      if(!o.visible) return;
      if(o.isSprite || o.isPoints || o.isLine){ o.visible = false; _dkHid.push(o); return; }
      if(!o.isMesh) return;
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      if(m && (m.transparent === true || m.depthWrite === false)){ o.visible = false; _dkHid.push(o); }
    });
    if(!_dkDepth) _dkDepth = new THREE.MeshBasicMaterial({ colorWrite:false });   // solo depth: sin skinning (ver cabecera)
    /* ►EL CONTORNO NO FLOTABA (Toni: "hay el outline que no flota y el contenido
       sí"). Este pase dibuja TODA la escena con un overrideMaterial para sacar
       la profundidad, y ese material no lleva el desplazamiento de la ola: el
       mapa de profundidad se quedaba con el mar y los kickers en calma mientras
       el render de verdad los subía y bajaba, así que el borde entintado se
       despegaba de su objeto. En el mar, las mallas que flotan se dibujan con SU
       material de profundidad —el mismo parche de ola, en su modo— en lugar del
       override general. */
    const swapD = [];
    if(MAR){
      sc.traverse(o => {
        const modo = o.isMesh && o.userData && o.userData._olaMode;
        if(!modo) return;
        swapD.push(o, o.material);
        o.material = _matProfOla(modo);
      });
      for(let i = 0; i < swapD.length; i += 2) swapD[i].visible = true;
    }
    sc.overrideMaterial = _dkDepth;
    if(swapD.length){                       // los que flotan se pintan aparte, sin override
      for(let i = 0; i < swapD.length; i += 2) swapD[i].visible = false;
      rr.render(sc, cam);
      sc.overrideMaterial = pOv;
      for(let i = 0; i < swapD.length; i += 2) swapD[i].visible = true;
      /* segundo pase, sólo para lo que flota: conserva su propio vertex shader */
      const ocultos = [];
      sc.traverse(o => {
        if(o.isMesh && !(o.userData && o.userData._olaMode) && o.visible){ o.visible = false; ocultos.push(o); }
      });
      rr.render(sc, cam);
      for(const o of ocultos) o.visible = true;
      for(let i = 0; i < swapD.length; i += 2) swapD[i].material = swapD[i+1];
    } else {
      rr.render(sc, cam);
      sc.overrideMaterial = pOv;
    }
    for(const o of _dkHid) o.visible = true;
    _dkHid.length = 0;
  }

  /* 2) SILUETA de los riders en su color, encima y sin borrar la profundidad */
  _dkSwap.length = 0;
  if(DINK.chars){
    for(const r of DESC.racers){
      const b = r.body; if(!b || !b.visible) continue;
      const hex = r.col || 0xffffff;
      b.traverse(o => {
        if(!o.isMesh || !o.material) return;
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        if(m && m.depthWrite === false) return;          // ayudas translúcidas: no forman silueta
        o.layers.enable(DINK_LAYER);                     // se re-marca cada frame: los GLB llegan async
        const key = hex + (o.isSkinnedMesh ? 's' : 'r');
        let sm = _dkSil[key];
        if(!sm){ sm = new THREE.MeshBasicMaterial({ color:hex, fog:false, skinning:!!o.isSkinnedMesh }); _dkSil[key] = sm; }
        _dkSwap.push(o, o.material); o.material = sm;
      });
    }
    if(_dkSwap.length){
      cam.layers.set(DINK_LAYER);
      rr.autoClear = false;
      rr.render(sc, cam);
      for(let i = 0; i < _dkSwap.length; i += 2) _dkSwap[i].material = _dkSwap[i+1];
      _dkSwap.length = 0;
    }
  }

  /* --- devolver el estado y pintar el borde ENCIMA de lo ya renderizado --- */
  cam.layers.mask = pMask; sc.background = pBg;
  rr.shadowMap.autoUpdate = pSA; rr.shadowMap.needsUpdate = pSN;
  rr.setClearColor(pcC, pcA);
  _dkU.tSil.value   = _dkRT.texture;
  _dkU.tDepth.value = _dkRT.depthTexture;
  _dkU.near.value = cam.near; _dkU.far.value = fFar;   // los del PASE, no los de la cámara (ver arriba)
  if(cam.far !== pFar){ cam.far = pFar; cam.updateProjectionMatrix(); }
  _dkU.grosor.value = DINK.grosor; _dkU.fuerza.value = DINK.fuerza;
  _dkU.tinta.value = DINK.mundo ? DINK.tinta : 0;
  _dkU.umbral.value = DINK.umbral; _dkU.limGrow.value = DINK.limGrow;
  if(sc.fog){ _dkU.fogNear.value = sc.fog.near; _dkU.fogFar.value = sc.fog.far; }
  rr.setRenderTarget(null);
  rr.autoClear = false;
  rr.render(_dkSc, _dkCam);
  rr.autoClear = pAuto;
}

DESC.render = function(){
  if(!DESC.scene) return;
  const rr = GAME_RENDERER(); if(!rr) return;
  /* el juego puede venir con el shadowMap apagado; aquí lo queremos SÍ o SÍ.
     Se toca una vez y se restaura al salir. */
  if(DESC._shadowOn !== K.sombras){
    rr.shadowMap.enabled = !!K.sombras;
    rr.shadowMap.type = THREE.PCFSoftShadowMap;
    if(DESC.sun) DESC.sun.castShadow = !!K.sombras;
    rr.shadowMap.needsUpdate = true;
    DESC._shadowOn = !!K.sombras;
  }
  rr.setRenderTarget(null);
  rr.render(DESC.scene, DESC.cam);
  dinkDraw(rr);
};

addEventListener('keydown', e => {
  if(!DESC.on) return;
  sndInit(); if(SND.ctx && SND.ctx.state === 'suspended') SND.ctx.resume();
  if(DESC._campana){   // en campana: ESPACIO cierra la tabla y sigue la run
    if(DESC._finShown && (e.code === 'Space' || e.code === 'Enter')){ salirDesc(); e.preventDefault(); }
    return;
  }
  if(e.code === 'KeyR'){ start(DESC.seed); e.preventDefault(); }
  if(e.code === 'KeyT'){ start((Math.random()*1e9)|0); e.preventDefault(); }
});
addEventListener('resize', () => {
  if(DESC.cam){ DESC.cam.aspect = innerWidth/innerHeight; DESC.cam.updateProjectionMatrix(); }
});
/* ratón: MOVERLO rota la vista (sin tener que arrastrar) y la RUEDA acerca o
   aleja. Con orbLibre=false vuelve al comportamiento de arrastrar. */
addEventListener('mousedown', () => { if(DESC.on){ DESC.orb.down = true;
  sndInit(); if(SND.ctx && SND.ctx.state === 'suspended') SND.ctx.resume(); } });
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
  if(DESC._built || !SUELTO) return;
  /* CALIDAD: manda `?calidad=baja|media|alta` de la URL y, si no viene, el
     selector del juego. La Baja apaga sombras y aligera decorado: no se degrada
     a todo el mundo, solo a quien lo pide (o a quien no puede con más). */
  let cal = (_qs.get('calidad') || '').toLowerCase();
  if(!cal){
    try {
      const q = (typeof QUALITY !== 'undefined') ? QUALITY
              : (typeof _qualityTier !== 'undefined') ? _qualityTier : '';
      cal = String(q || '').toLowerCase();
    } catch(e){}
  }
  /* el CONTORNO cuesta un pase de geometría extra (la profundidad del mundo);
     el anillo de los personajes NO (son 4 riders), así que en calidad baja se
     cae solo la tinta del mundo y en pelada el efecto entero. */
  if(/pelad|min|none/.test(cal)){ K.sombras = false; K.densRoca = 0; K.densDeco = 0; K.streakN = 40; DINK.chars = false; DINK.mundo = false; }
  else if(/baj|low/.test(cal)){ K.sombras = false; K.densRoca = 0.5;  K.densDeco = 0.45; K.streakN = 60; DINK.mundo = false; DINK.escala = 0.5; }
  /* en Media el pase de tinta baja a media resolución: es donde estaba el
     ahorro que antes se cobraba a TODO el mundo (línea gorda y a trozos) */
  else if(/med/.test(cal)){ K.sombras = false; K.densRoca = 0.75; K.densDeco = 0.7; DINK.escala = 0.5; }
  if(cal) console.log('[descenso] calidad=' + cal + ' · sombras=' + K.sombras);
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
/* el sondeo de arranque solo existe en modo suelto: en campana el modulo
   duerme hasta que la RUTA lo llame */
if(SUELTO){
  const _bootT = setInterval(() => { boot(); if(DESC._built) clearInterval(_bootT); }, 60);
  boot();
}

})();
