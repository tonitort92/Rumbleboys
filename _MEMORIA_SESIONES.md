# MEMORIA DE SESIONES (Claude) — copiada al repo para migrar de PC

> La memoria de Claude Code vive en `~/.claude/projects/<ruta>/memory/` y NO viaja con la
> carpeta. Este fichero es la copia portátil (16/08/2026). En el PC nuevo, cualquier sesión
> puede reconstruir su memoria desde aquí. Docs hermanos: `_MASTERMIND.md`, `_CHARLA_DISEÑO.md`,
> `_PLAN.md`.

---

## 1 · Validación headless (Chrome + CDP) — la receta que funciona

Para dar por buena una mecánica o mejora visual hay que **medirla**, no razonarla:

1. `node _serve.js` → http://localhost:8181 . Arrancarlo **en background del harness**
   (`run_in_background`); lanzado con `(... &)` muere al salir el shell y el navegador carga
   `chrome-error://chromewebdata/`.
2. Chrome (en el Mac viejo NO había Edge, decía lo contrario un CLAUDE.md antiguo):
   `--headless=new --remote-debugging-port=N --disable-gpu-sandbox --use-gl=swiftshader
   --enable-unsafe-swiftshader --disable-background-timer-throttling --disable-renderer-backgrounding`
3. CDP por WebSocket: Node ≥24 trae `WebSocket` global, sin librerías.

**Las cuatro trampas** (todas pasaron de verdad):
- **El rAF va estrangulado** en headless (~32 frames por prueba). No esperar N frames: **llamar
  a las funciones a mano** con dt fijo, y red de seguridad con `setTimeout` en los helpers o el
  `Runtime.evaluate` se cuelga.
- **La carga tarda >30 s** con caché fría (95 MB de .js embebidos). No dormir fijo: **polling**
  de `typeof players !== "undefined" && players.length > 0`.
- **La página headless no alcanza el CDN** (three.js de cdnjs). El juego arranca igual, pero una
  página de prueba propia con CDN se queda sin THREE.
- **Salida bufferizada**: escribir el log a fichero con `appendFileSync`, no canalizar a `tail`.

Jugadores recién reaparecidos llevan `respDrop`/`spawnPad`: resetearlos en tests que los excluyan.

## 2 · La otra sesión se lleva mis cambios (pasó el 14/08/2026)

Con dos sesiones de Claude sobre esta carpeta: una hizo `git commit -a` y **arrastró el trabajo
sin commitear de la otra** (commit `031a81e`, mensaje engañoso). Una carpeta = un árbol = un índice.
- **Commitea en cuanto un bloque funcione**, no al final. La exposición es el rato entre editar
  y commitear.
- Antes de cerrar, mirar `git log` además de `git status`: un commit ajeno puede llevar tu trabajo.
- Para separar sin pisar: nada de `git reset` — partir el diff por hunks, reconstruir, y rehacer
  commits con `git commit-tree` + `GIT_INDEX_FILE` temporal + `git update-ref`. Red: `git tag backup-X`.

## 3 · Export a Mixamo: orientación (chars_models.js)

6 personajes en `chars_models.js` (`window.CHAR_MODELS_B64`); claves: `voxelhero`=bárbaro,
`link`=mago; resto coinciden. 1 malla/1 primitiva con skin/41 huesos Mixamo.
- **Mixamo no acepta .glb** → GLB→OBJ+MTL+PNG en Node y zip. En primitiva con skin, la bind pose
  es el `POSITION` crudo (no aplicar matriz del nodo).
- **4 de 6 miran a +X** (bárbaro, caballero, mago, arquera); samurái y monja bien.
- **El Left/Right del rig está ESPEJADO** en esos 4 → alinear por hombros los deja DE ESPALDAS.
  Lo que funciona: hombros para el EJE + media de los DOS pies (tobillo→punta) para el SENTIDO,
  y comprobar con un render.
- Bind poses mezcladas (2 en T, 4 en A): Mixamo traga ambas, no re-posear.
- Solo 3 texturas distintas de 6: atlas compartido + `recolorAtlas` por clase.
- **⚠ MIGRACIÓN: los exports estaban en `~/Desktop/RUMBLEBOYS_ANIMS/` (GLB) y
  `~/Desktop/RUMBLEBOYS_ANIMS/mixamo/` (zips) — FUERA de esta carpeta. Copiarlos aparte.**

## 4 · Clips de agarre pendientes (►CARRY2, commit cbb0a99)

El agarre levantar-y-lanzar está terminado en código, faltan 3 clips de Mixamo:
- `carry` (LOOP 1-2 s, anda con brazos en alto) · `carried` (LOOP 1-1,5 s, patalea boca arriba,
  flota a `HOLD_OVER_Y=1.95` mirando al portador) · `toss` (ONE-SHOT ~0,45 s).
- **Sin tocar JS**: `_carryToken()` cae a `kicked`+pose procedural si el clip no está. Nombres
  exactos en minúscula. Clips por nombre de hueso (`mixamorig:*`) → vale cualquier personaje.
  Descargar FBX **"Without Skin"**.

## 5 · Jefe sin portal: PELIGRO

Toni (16/08/2026): quitar el portal del jefe **ya se intentó y hubo "efectos muy extraños"**.
La arena del jefe es una arena EN EL CIELO (BOSS_ARENA_Y, ►PORTAL-BOSS) y medio motor la asume:
kill-planes (blastDownY), respawn (aplat), cámaras, flecha-guía ►PORTALFIX, clamp de esquirlas
en ko(). Si se reintenta: por capas (primero SOLO presentación, sin mover la arena), validando
cada capa en headless, y preguntando antes qué pasó en el intento anterior.
