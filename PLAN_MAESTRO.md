# PLAN MAESTRO — lo que queda para completar el juego

Consolidado el 02/09/2026 entre las dos sesiones (a9 + 7f) a petición de Toni. Fuente de diseño:
`DISENO_PROGRESION.md` (cerrado al completo). Regla de convivencia: **las dos sesiones en
`repack-glb`, nadie cambia de rama sin avisar** (una carpeta = un HEAD). Mientras dure el bloque B,
**solo la sesión 7f edita `rumble_arena_cinta_v4.html`**; la a9 hace probes, mediciones y ficheros
aparte.

Orden acordado: A hosting → B progresión → C gira entera (V1) → D resto de gira → E online →
F OBJ fase 2 → G logos. Cada bloque se commitea por hitos con humo headless (http://8181, nunca
file://).

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

## E. ONLINE · reparto: +N cliente (7f, es código de simulación) · prueba 2 PCs (a9 + Toni)

1. **+N flotantes en el cliente**: credit()/vigilante viven en el host — enviar eventos de puntos
   o derivar deltas de p.sc en applySnap.
2. **Prueba entre DOS PCs reales (NAT)** — solo probado en localhost. Necesita a Toni y la URL
   del bloque A. Anotar conexión, Hz, latencia percibida.
3. Playtest online propio antes de enseñarlo en grupo (V3 del plan alfa).

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
