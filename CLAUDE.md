# RUMBLEBOYS — normas de trabajo en este repo

## ⚠️ PUEDE HABER OTRA SESIÓN TRABAJANDO A LA VEZ

Toni abre varias sesiones de Claude Code sobre **esta misma carpeta**. Una carpeta = un árbol de
trabajo = **una sola rama activa**. Consecuencias que hay que respetar SIEMPRE:

1. **Trabaja en tu propia rama.** Al empezar algo largo: `git switch -c <nombre-corto>`.
2. **NUNCA hagas `git switch` / `git checkout` de rama si el árbol está sucio**, y compruébalo antes
   (`git status --short`): si hay cambios que no son tuyos, son de la otra sesión — no los toques, no
   los commitees y no cambies de rama (le cambiarías los ficheros por debajo mientras escribe).
3. **Commitea a menudo y deja el árbol limpio al terminar.** Un árbol sucio abandonado bloquea a la
   otra sesión.
4. Casi todo el juego vive en **UN fichero de 30.000 líneas** (`rumble_arena_cinta_v4.html`). Dos
   sesiones editándolo a la vez es la forma más fácil de perder trabajo: si vas a hacer un barrido
   grande sobre él, pregunta antes.

## Assets 3D: convención NUEVA desde el REPACK (01/09/2026, rama repack-glb)

Los assets **base64 (GLB/FBX)** ya NO van en `.js` embebidos: viven como binarios **gzip** en `assets/`
(`NOMBRE.bin.gz` o `NOMBRE/clave.bin.gz`, 39 MB en vez de 92) listados en `assets/manifest.json`
(`gz:1`), y los trae por fetch el cargador `RB_ASSETS` (script inline junto al BOOTBAR), que
descomprime con `DecompressionStream` (así no depende de que el hosting comprima octet-stream): lote
crítico primero (personajes, armas, goblins), el resto en segundo plano, y `RB_ASSETS.need('NOMBRE')`
adelanta en la cola lo que pida un stage. Los globales `window.X_B64` se rellenan con
**ArrayBuffers**; en el juego decodifica `_rbBuf()` (acepta b64 legado y buffer). Para añadir un
asset nuevo: `node _repack_extract.js fichero.js` (ya escribe el .gz y el manifest), o binario a mano
en `assets/` + `node _repack_gzip.js`; y consumidor con REINTENTO (el patrón de los jefes: need() +
comprobar window[NOMBRE] y volver a intentar).
OJO: por `file://` el fetch NO funciona — valida siempre por http://8181.

Los modelos **OBJ de texto** (`GAME_MODELS`, ~30 ficheros `.js` con `<script src>`) siguen con la
convención vieja — su fase 2 está pendiente; añade OBJ nuevos como los existentes.

## Cómo se valida aquí

**Antes de commitear el HTML: `node _check_parse.js`.** Parsea todos los `<script>` inline; un paréntesis
o un comentario `//` a mitad de línea deja muerto el script principal entero y el juego arranca sin
modelos, sin audio y sin entrada (pasó el 02/09/2026 y el 8181 lo sirvió en vivo). Nunca insertes
`// comentario` en medio de una línea de código: usa `/* */` o ponlo al final.


Hay navegador headless disponible (Edge + CDP desde Node): se puede arrancar el juego de verdad,
capturar el canvas y comparar A/B. Antes de dar por buena una mejora visual o de rendimiento,
**mídela** — en esta sesión eso ha desmontado tres hipótesis que parecían obvias. La receta está en
la memoria del proyecto (`headless-validation-edge-cdp`).
