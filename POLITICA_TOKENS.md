# POLÍTICA DE TOKENS (Claude Code) — RUMBLEBOYS

Fijada el 19/09/2026 por la sesión PM de la nube tras archivar Coordinación (390k), VFX (374k),
Home (418k) e IA (309k). Ninguna se "agotó": el problema es que **cada turno reenvía todo el
contexto acumulado**; con 400k de contexto, cada mensaje cuesta 400k aunque solo pidas una línea.
Objetivo: que una sesión viva semanas sin pasar de ~150k, sin abrir PMs nuevos.

## 1 · Cómo se instala (una vez por carpeta, en el Mac)
Copiar a la carpeta de Pre-Beta (y a cada worktree `rb-wt/*`):
- `.claude/settings.json` + `.claude/hooks/guardia_tokens.js` → hook PreToolUse que bloquea
  las lecturas caras (cat/Read sin límite del HTML de 47k líneas, grep sin límite, git diff
  sin --stat). Claude ve el motivo y busca otra forma. Probado con 10 casos.
- Este fichero y el bloque "TOKENS" de `CLAUDE.md`.

## 2 · Reglas de sesión (las cumple Claude; el hook fuerza las de lectura)
1. **Estado a fichero, no a memoria de chat.** Cada frente tiene su `*_ESTADO.md` (VFX ya lo hace:
   `VFX_ESTADO.md`). Se actualiza al cerrar cada hito: qué está hecho, commit, qué queda, cómo
   validar. Es lo único que necesita la sesión siguiente — nunca el transcript.
2. **`/compact` en vez de sesión nueva.** Cuando la barra de contexto pase del 40 %:
   `/compact conserva: rama, commits, decisiones de Toni, pendientes y cómo validar; descarta:
   volcados de ficheros, salidas de tests y capturas`. Antes del compact, actualizar el
   `*_ESTADO.md`. Después, seguir en la misma sesión.
3. **`/clear` al cambiar de frente** (de VFX a IA, por ejemplo) — y arrancar con "lee X_ESTADO.md".
4. **El HTML de 47.000 líneas nunca se lee entero.** Localizar con `grep -n -m 20`, leer el tramo
   con `sed -n a,bp` o Read con offset/limit (≤ 400 líneas). Búsquedas amplias → subagente
   Explore (su contexto se tira; el nuestro no crece).
5. **Salidas largas a fichero.** Tests, mediciones headless y logs → `> _out/xxx.log` y luego
   `tail -n 30` o `grep`. Nunca `| tail -f` ni volcar 300 líneas de tests a la conversación.
6. **Diffs acotados.** `git diff --stat` primero; el diff completo solo del hunk que se revisa.
7. **Un mensaje = una tarea cerrada.** No pedir "mira si hay algo raro" sobre el fichero grande:
   eso obliga a leerlo. Pedir "busca dónde se aplica el hitstop y súbelo a 80 ms".
8. **Effort medium** por defecto (ya está). High solo para diseño/arquitectura, y volver a medium.
9. **Sin PM permanente.** La coordinación cabe en `PLAN_MAESTRO.md` + los `*_ESTADO.md`. Un PM
   se abre solo para decidir prioridades, hace su trabajo en < 30k tokens y se cierra.

## 3 · Mensajes de arranque (copiar y pegar en la sesión fresca)

**PM** (carpeta principal de Pre-Beta):
> Continúa como project manager. Lee solo PLAN_MAESTRO.md, POLITICA_TOKENS.md y los *_ESTADO.md
> (VFX_ESTADO.md, HOME_ESTADO.md, IA_ESTADO.md si existen). No leas el HTML. Dime en 15 líneas:
> qué hay en cada rama (vfx-upgrades, home-directo, horde-ai, elites-fix), qué está listo para
> fusionar en main y qué orden propones. Aplica la política de tokens.

**VFX** (worktree `rb-wt/vfx`, rama `vfx-upgrades`):
> Lee VFX_ESTADO.md y POLITICA_TOKENS.md y sigue por el siguiente hito. No leas el HTML entero:
> grep + tramos. Al cerrar el hito: `node _check_parse.js`, commit, actualiza VFX_ESTADO.md.

**Home** (rama `home-directo`):
> Lee POLITICA_TOKENS.md. La rama home-directo está terminada y medida (56,7 fps vs 37,6; carga
> 6,26 s). Escribe HOME_ESTADO.md con: qué cambió, cómo se midió, riesgos al fusionar en main.
> Luego prepara la fusión (rebase o merge de main según convenga) y valida por http://8181.

**IA** (rama `horde-ai`, base `elites-fix`):
> Lee POLITICA_TOKENS.md. horde-ai (64cfdeb) tiene 9 correcciones y 307/307 tests. Escribe
> IA_ESTADO.md y arranca la fase 2: pánico, envalentonar y huida del muro. Un commit por
> comportamiento, medido en headless (caídas/min y muertes en combate/min como en la fase 1).

## 4 · Qué NO hacer
- Abrir una sesión nueva "para ahorrar": la nueva relee todo lo que la vieja ya sabía.
- Pegar capturas o logs enteros en el chat "por si acaso".
- Pedir a Claude un resumen de la sesión: eso es el `*_ESTADO.md`, y se escribe a fichero.
