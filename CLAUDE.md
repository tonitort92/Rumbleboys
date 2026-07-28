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

## Assets 3D: usa la convención actual

Los modelos van **embebidos en ficheros `.js`** (73 de ellos, ~95 MB en total) que el HTML carga con
`<script src>`: base64 para GLB/FBX, texto plano para OBJ. Es lento (obliga a parsear 95 MB de
JavaScript en el hilo principal al arrancar) y **está previsto reempaquetarlo entero a `.glb`
comprimidos con carga por stage**.

**Mientras tanto, añade tus assets nuevos IGUAL que los existentes.** No inventes un formato ni un
cargador propio "mejor": el reempaquetado se hará de una sola pasada sobre todos, y un caso especial
solo añade trabajo. Si tu stage necesita assets, mete su `.js` como los demás y su `<script src>`
junto a los otros.

## Cómo se valida aquí

Hay navegador headless disponible (Edge + CDP desde Node): se puede arrancar el juego de verdad,
capturar el canvas y comparar A/B. Antes de dar por buena una mejora visual o de rendimiento,
**mídela** — en esta sesión eso ha desmontado tres hipótesis que parecían obvias. La receta está en
la memoria del proyecto (`headless-validation-edge-cdp`).
