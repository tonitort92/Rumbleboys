# PLAN MAESTRO — lo que queda para completar el juego

Consolidado el 02/09/2026 entre las dos sesiones (a9 + 7f) a petición de Toni. Fuente de diseño:
`DISENO_PROGRESION.md` (cerrado al completo). Regla de convivencia: **las dos sesiones en
`repack-glb`, nadie cambia de rama sin avisar** (una carpeta = un HEAD). Mientras dure el bloque B,
**solo la sesión 7f edita `rumble_arena_cinta_v4.html`**; la a9 hace probes, mediciones y ficheros
aparte.

Orden acordado: A hosting → B progresión → C gira entera (V1) → D resto de gira → E online →
F OBJ fase 2 → G logos. Cada bloque se commitea por hitos con humo headless (http://8181, nunca
file://).

**ESTADO (02/09/2026, noche):** A ✅ (repo público + Pages: https://tonitort92.github.io/Rumbleboys/;
publicar avances = fast-forward de main). B ✅ (B1-B5) + **NIVELES V2** ✅ (PLAN_NIVELES_V2.md,
H1-H5: 20 niveles, cartas 1/2 sin pausa, HUD LoL, suelo temporal) + E1 ✅ (+N en cliente); todo
publicado hasta cb73036. D: PROPUESTAS_GIRA.md espera los OK/NO de Toni. Quedan: H6 playtest de
calibración (Toni), C gira entera, E2 online 2 PCs (con Toni), F OBJ fase 2, G logos.

## MODOS (decidido por Toni con 7f el 02/09 noche; pendiente ratificación formal por escrito)

El juego se parte en DOS MODOS con dos UIs (la gira entera medía ~2 h):
- **CAMPAÑA (offline, 16 mundos)**: oleadas → jefe → respiro ~3 s (slow-mo, ¡JEFE ABATIDO!) →
  aro. Nota personal = medalla por puntos. SIN showdown/corona (la sombra se retira del juego).
  **Checkpoint al ENTRAR en la parada 8 de la ruta (RUTA_I 7, Pirámide)** — guarda mundo,
  monedas, perks de run y corazones; morir de la 8 en adelante ofrece CONTINUAR (también botón
  en la home, JUGAR con gira guardada pide segunda pulsación); morir antes → al mundo 1;
  terminar la gira borra el checkpoint. La puntuación se conserva al continuar.
- **ARENA (online, ~45-50 min)**: 6 rondas M·M·mini·M·mini·M; ALEATORIO (semilla del anfitrión,
  determinista) o PERSONALIZADO (el anfitrión elige, el invitado lo ve en vivo). Showdown real
  entre vivos tras cada jefe SOLO aquí (un vivo = corona directa). Gana quien más coronas;
  empate → puntos. Trofeos/coronas viven en Arena; la vitrina de campaña pasa a medallas.
- Red: 2 jugadores en la alfa; 4 después (bloque E futuro).
- Implementación: C1-C3 ✅ (cc8080a, 51a9a3e) · A1-A2 ✅ (2bcac3e) · A3 ✅ (a0ca227: lobby con
  aleatorio/otra-tirada/personalizado sincronizado en &lt;100 ms, EMPEZAR del anfitrión, invitado
  solo mira; el online ya NO arranca al conectar). Verificado con humo doble (7f + a9, sala real
  de 2 Edge) y publicado. Pendientes menores: rótulo RONDA i/6 en partida, recortar paso 4 del
  asistente; y red a 4 jugadores (bloque E futuro).
- DECIDIDO (Toni 04/09): el invitado del lobby PERSONALIZADO solo mira. Y el MODO ESPECTADOR (eliminado)
  también solo mira: fuera los 20 disparos + bomba y el "si echas a uno, vuelves"; lo único que hace es
  CAMBIAR DE JUGADOR al que sigue la cámara (A/D · ◀ ▶ · J · stick/botón A). Corre en host y cliente
  (specTick desde updateCamera). Verificado en headless (cámara sigue al elegido, D/A rotan, barra se oculta).
- **UX de dos ejes (03/09, petición de Toni a 7f)**: la GIRA también se juega online. Asistente:
  paso 1 "¿Qué jugamos?" GIRA / ARENA / ENTRENAMIENTO; paso final "¿Con quién?" SOLO (CPUs) /
  ONLINE (lobby). Fuera el conmutador OFFLINE/ONLINE de la home; JUGAR siempre abre el asistente;
  "CAMPAÑA"/"MODO CARRERA" pasan a llamarse GIRA solo en textos (MATCH.plan sigue 'campaign').
  Gira online: 16 paradas desde la 1, sin checkpoint en la alfa; acción de red 'stg' sincroniza
  el cambio de mundo. LÍMITE anotado para el bloque E: el invitado no ve minions/objetos del
  anfitrión (solo posiciones) — la gira online es de menú a menú hasta resolver eso. Portada y
  claim intactos; el tour tenía un paso huérfano (OFFLINE U ONLINE → #hdMode retirado), en
  arreglo. Implementación 4869dbe, en verificación con sala real antes de publicar.

## A. HOSTING · sesión a9 · ⚠️ decisión de Toni · BLOQUEANTE para repartir enlaces

El github.io actual da 404; por file:// el fetch de assets no funciona. Propuesta: GitHub Pages
del propio repo (sirve estáticos y ya comprime; los .bin.gz van pre-comprimidos, 39 MB).
1. Toni decide: ¿GitHub Pages sobre este repo (público) u otro hosting?
2. Activar Pages (rama main o /docs), probar la URL real en un navegador limpio: arranque, barra
   de carga, lote crítico, un mundo jugable.
3. Anotar la URL oficial en el repo y en la portada si procede.

## B. PROGRESIÓN (implementar DISENO_PROGRESION.md entero) · sesión 7f · el barrido grande

En serie, commit por hito, humo headless en cada uno. Hitos:
1. **Nivel por mundo**: exp=puntos, reset al cambiar de mundo; umbrales n2 ataque / n3 pasiva /
   n4 especial; level-up fogonazo (flash+sonido+icono grande). Nada de +3%.
2. **Minions que explotan monedas**: monedas físicas por valor del minion, se desvanecen,
   robables. Estreno visual en el mundo 1 (esto cubre el "rasgo propio" del Prado — no diseñar
   dos cosas).
3. **Economía 3 capas**: puntos=exp+records (ya no compran); tienda entre stages pasa a monedas
   y vende permanentes de run; tienda home = mejoras leves permanentes + loadout de ataques
   pre-run.
4. **Victoria**: medallas bronce/plata/oro por umbrales de puntos del mundo; showdown tras el
   boss (vivos se pelean con su kit, último en pie = corona; en solo, sombra de ti mismo un poco
   nerfeada — sin corona si pierdes); gira = más coronas de 16.
5. **Reauditar objetos**: solapes/huecos contra pasivas de nivel y monedas.
Calibraciones al implementar: umbrales por mundo, nerf de la sombra, monedas del boss (no inflar
la tienda de run).

## C. V1 — GIRA ENTERA · sesión a9 (medición, sin editar) · tras B o en paralelo por tramos

Jugar/observar los 16 mundos y anotar: dónde se desinfla el ritmo, si el final es clímax, tiempos
por mundo. Idealmente Toni cronometrando una pasada real (el arnés acelera timers). Mejor con B
puesto para no medir dos veces. Salida: lista corta de ajustes por mundo.

## D. RESTO DE GIRA (Paso 5) · diseño en doc por a9, implementación según carga

Con los datos de C: diferenciar snowboard (13) del sandboard; hazard para jungla (2) y western
(5); jefes propios western y Vía (16); corona visible al líder; dramaturgia (finales pesan más);
cámara por defecto más cerca; revisar goteo 0,5/s. Primero doc corto con propuestas → decisión
de Toni → implementar.

## E. ONLINE/RED · sesión 7f (único editor del HTML) · EN CURSO desde 03/09 ("aplica los cambios")

1. ✅ +N flotantes en el cliente (cb73036).
2. ✅ E-A replicación del mundo host→cliente (3cf88f7 + 04764cd, que además arregla la horda
   invisible del REPACK — gobLoadKinds sin reintento). ✅ E-A2 (372e9bf): proyectiles de jugador
   y minion, cristales, minas, orbes, FX de impacto (65 ms) y tipo de ataque/combo al cliente.
   Anotado para después: láser del dron, rayo/torbellino del jefe, Leviatán (STAGE 12), poses
   por timers de clase.
3. ✅ E-B 4 jugadores por sala (51772eb + bae85f7, HUD del cliente con SU clase; verificado con
   3 Edge: inputs por par, desconexión limpia a los 7 s, 17 Hz / 29 ms).
4. **E-C**: prueba entre PCs reales (NAT) — a9 + Toni, con la URL pública, ya con 3-4 jugadores.
5. ✅ E-VOZ (2866926 + 4ee4aad): chat de voz por PROXIMIDAD en gira y arena — volumen por
   distancia (NEAR=8/FAR=28, constantes calibrables), 100% en lobby/tablero/tienda, estéreo L/R,
   mute con M + botón, 🎤 sobre el hablante, muertos entre sí, sin micro se juega igual.
   Verificado con stream real entre 2 Edge (fórmula de volumen exacta, RMS, mute). La voz HUMANA
   solo se valida en E-C: que Toni diga si los radios 8/28 cuadran.
- JEFES (Toni 04/09, 3 cambios, verificados en headless con tick bombeado): (1) SIN ruptura de guardia
  ("stagger"/derrumbe) en NINGÚN jefe — BOSS_BREAK_ON=false, barra de guardia oculta; (2) SIN ronquido del
  jefe dormido (bossSnoreSet(false)); (3) JEFE 2 (jungla): fuera los mini-jefes aleatorios (bruteHorde) →
  AQUELARRE: 10 brujas quietas, bastón en alto (clip attack congelado al 45 %), hilo de magia lila al
  jefe; cada bruja viva le cura 0,4 %/s y le quita un 8,5 % del daño (10 vivas → recibe el 15 %); respawn
  de 1 en 1 cada 5 s. Constantes en STAGE_BOSSES[2].coven. Pendiente que Toni lo VEA (pose del brazo y
  ritmo de la cura) — el cliente online no ve los hilos (solo las brujas replicadas).
- JEFE 1 (prado, gólem) · RUNA EN LA ESPALDA (Toni 04/09, verificado en headless): solo se le daña por
  detrás (cono trasero ~145°, BOSS1_RUNE_DOT); de frente o de lado entra el 4 % (BOSS1_RUNE_FRONT) y sale
  "¡POR LA ESPALDA!". Runa magenta (halo + anillo) recolocada cada frame tras el jefe; cartel de pista al
  empezar. Se decide por la POSICIÓN del que pega (mn.lastHitBy), también con proyectiles. Anotado: el rig
  del gólem no tiene hueso Spine → la runa va a altura fija (3 u) tras el root, no sigue las flexiones;
  los BOTS no saben rodearlo (pegan al 4 %); el cliente online no ve la runa.
Pendientes menores APARCADOS hasta después del playtest de Toni: rótulo RONDA i/6, recortar el
paso sobrante del asistente, OBJ fase 2 (bloque F), rasgo escaparate del mundo 1.

**Carril de Toni ahora mismo**: (1) playtest H6 — 2-3 mundos: ¿cuándo llega la R, algún build
roto, cartas legibles en 5 s, HUD?; probar el checkpoint (llegar al 8, morir en el 9, CONTINUAR);
(2) decidir si reparte YA la alfa en solitario a 8-10 personas con el enlace público;
(3) OK/NO a PROPUESTAS_GIRA.md.

## H. OBJETOS2 + AGARRE + JEFES + CURVA · sesión objetos-agarre (04-05/09) · EN MAIN y PUBLICADO (32af617, alfa-10)

Plan aprobado por Toni (`~/.claude/plans/vale-perfecto-pues-preparemos-greedy-hennessy.md`). HECHO y medido en headless:
- AGARRE ►CARRY4 (85185a2): minions no lo rompen; 1,5 s de armadura al enganchar (×2 daño); cargado = piñata; alcance 3,2;
  forcejeo acorta 4→2 s; enganchar cuesta 2 s de aguante (sin recarga cargando); el jefe sí rompe; holding/heldBy por red.
- OBJETOS (baa44a9, 8bd48d4, 7c222bb): fuera pinchos/electricidad/imán/minas (código incluido; las minas son el PLÁTANO);
  ESTRELLA (arcoíris = invulnerable sin parpadeo + daña al tocar; el ×5/×10 es del frenesí del bárbaro, `_frenzyT`);
  tintPlayer: aura en CUALQUIER skin (estrella HSL / frenesí rojo / metal); SÚPER por cápsulas doradas con pity 18 %/5 %:
  martillo 10 s (golpe automático ×2.5/×2, martillo dorado), metal 15 s (empuje ÷4, retroceso al atacante), sandalias 30 s
  (suelo virtual), capa 60 s (caída lenta + tela), seta 10 s (×1.8), rayo al líder (sube 1,5 s y cae sobre el líder, se
  esquiva saltando); en mano: ancla (1 uso, 8 s anclado) y plátano (3 usos); temporizador 10/15/15/60. HUD, IA y guía.
- JEFES: presa fija 5 s con robo por daño (6 % de vida en ~2 s) y marcador rojo; cámara vuelve a mirar al jefe con bounce
  back de la órbita; giro ×2 en el windup del melee. GUÍA de la home 2 con los objetos RENDERIZADOS en 3D (no emojis).
- JEFES (2ª pasada, 04/09 noche): jefe 1 MEDIDO (quieto 26 %, 10/13 golpes tocan); robot MEDIDO por estados (quieto 38 %, la
  mitad es el láser telegrafiado, 7/7 patadas tocan → se deja). PRESA y RUNA replicadas en el invitado (B.py/B.rh en W.B).
  IA contra el jefe 1: los bots RODEAN hasta la espalda (rama _runeFront, punto trasero a 4 u o al alcance de tiro), los de
  distancia también; el brinco de esquiva solo cuando el golpe va a caer (antes brincaban sin parar: 69 % en el aire). El gólem
  con runa gira a BOSS1_RUNE_TURN=1.0 rad/s (a 4 los humanos tampoco le ganaban la espalda). Medido con 2 bots 25 s: detrás
  30 %/39 %, daño al jefe 0,2 % → 1,6 % (×8, sigue siendo poco: la presa nunca ataca y la monja dispara poco). Toni decide.
- CURVA DE GIRA (Toni 05/09: "en piratas vas sobradísimo"; tienda intacta por decisión suya): minions con vida ×(1+0,07·parada) y
  daño ×(1+0,06·parada) (RUTA_I), el jefe pega ×(1+0,7·(1/0,9^defensa−1)); vidas TOPE 5 en total (+2 VIDAS → +1 VIDA, máx 1;
  +CORAZÓN no se ofrece al tope). Medido: con compras típicas un goblin grande aguanta 10-12 golpes en TODA la gira (antes 10 al
  principio y 5 en piratas) y su golpe se queda en 7-12. Palancas: WORLD_HP_K, WORLD_DMG_K, BOSS_POWER_DEF_SCALE, LIVES_MAX.
PENDIENTE: prueba real host + 2 Edge en red (objetos/agarre/auras/presa/runa en el invitado); afinar HAND_FITS de ancla/plátano/rayo;
que Toni juegue 2 mundos y el jefe 1 con bots y diga qué números ajustar (BOSS1_RUNE_TURN, BOSS_PREY_STEAL).

## I. PLAYTEST CIEGO 05/09 (alfa-10) · casual 4,5 · crítico 4 · potencial 7,5 · informes en docs_playtest_2026-09-05_*.md

Bajan del 5,5 del 31/08 porque NINGUNO llegó al jefe. Arreglado el mismo día: JUGAR cortado en ventanas < 780 px (►FITHOME) y
"¡TE HAN SACADO!" al caerte solo. Sesgos del arnés: ventana de 500×450 en el crítico e input a ráfagas (el humano casi siempre
parado). DECISIONES PARA TONI (consenso 2/2): (1) muerte sin causa: "eliminado por X" + flash letal + explicar el %; (2) CPUs
a 100× puntos (10248 vs 85) y catarata de "+N" sin dueño → la carrera está decidida a los 30 s; (3) escudo y agarre sin
feedback visible; (4) tecla de USO junto al objeto en mano (3 plátanos sin usar); (5) cámara lejos + popups + cartas tapan al
personaje; (6) 6 decisiones + tour de 8 pasos hasta jugar, home con botones de MANDO en teclado, "Agarrar" vs "EMPUJÓN";
(7) "¡NUEVO RÉCORD!" tras quedar último; (8) ENTRENAR debe gritar que no es la partida real.

## F. OBJ FASE 2 (GAME_MODELS) · sesión a9 · SOLO cuando 7f no esté tocando los <script src>

Ya no es peso de descarga (45→12 MB gz con hosting), solo parse-time: prioridad baja. Migrar los
~30 .js de OBJ texto a assets/ + manifest como la fase 1; avisar a 7f antes de tocar el HTML.

## G. LOGOS · decisión menor de Toni

El skip total ya existe (1ª tecla). Decidir si se acortan los holds en visitas repetidas. Último.

## Dependencias de Toni (lo único que bloquea)
- A1: elegir hosting (recomendado: GitHub Pages de este repo) + decidir visibilidad: el repo es
  PRIVADO y Pages gratis exige público.
- B3-loadout: los ataques de la tienda home (slots C/X: dash/égida/bomba…) se compran pero no
  tienen ejecución en partida — decidir si se implementan como ataques reales o se retira esa
  tienda (detectado por 7f al cerrar B3).
- C: una pasada de gira cronometrada real.
- D: aprobar el doc de propuestas de gira.
- E2: prestarse a la prueba online desde otro PC.
- G: decisión de logos.
