#!/usr/bin/env node
/* Hook PreToolUse (Claude Code): bloquea las lecturas que revientan el contexto.
   - Read del HTML grande (>20k líneas) sin offset/limit, o con limit > 400.
   - Bash con cat/less/more/head -n grande/sed -n rango grande sobre ficheros pesados
     (rumble_arena_cinta_v4.html, *_model.js, models.js, *clips.js, descenso.js, campfire.js).
   - Bash con git diff/show sin --stat sobre esos ficheros.
   Salida: exit 2 + motivo en stderr → Claude ve el motivo y busca otra forma (grep con -n y
   límite, Read con offset/limit, subagente Explore). */
const fs = require('fs');
let raw = '';
process.stdin.on('data', d => raw += d);
process.stdin.on('end', () => {
  let inp; try { inp = JSON.parse(raw); } catch { process.exit(0); }
  const tool = inp.tool_name || '', ti = inp.tool_input || {};
  const PESADOS = /(rumble_arena_cinta_v4\.html|models\.js|_model\.js|clips\.js|descenso\.js|campfire\.js|grass_patch\.js|arrow_model\.js)/;
  const deny = (m) => { process.stderr.write('GUARDIA_TOKENS: ' + m + '\n'); process.exit(2); };
  if (tool === 'Read') {
    const p = String(ti.file_path || '');
    if (PESADOS.test(p)) {
      const lim = ti.limit;
      if (lim == null || lim > 400) deny('Fichero pesado: lee con offset+limit (máx 400 líneas por lectura) o localiza primero con Grep -n.');
    }
    return process.exit(0);
  }
  if (tool === 'Bash') {
    const c = String(ti.command || '');
    if (!PESADOS.test(c)) return process.exit(0);
    if (/\b(cat|less|more|tac)\b/.test(c) && !/\|\s*(grep|rg|head|wc|sed|awk|tail|node|python)/.test(c))
      deny('No vuelques ficheros pesados enteros: usa grep -n con límite o sed -n "a,bp" (≤400 líneas).');
    const h = c.match(/\bhead\s+-n?\s*(\d+)/); if (h && +h[1] > 400) deny('head con más de 400 líneas sobre fichero pesado.');
    const s = c.match(/sed\s+-n\s+['"]?(\d+),(\d+)p/); if (s && (+s[2] - +s[1]) > 400) deny('sed -n con rango > 400 líneas sobre fichero pesado.');
    if (/\bgit\s+(diff|show)\b/.test(c) && !/--stat|--name-only|--shortstat/.test(c) && !/\|\s*(head|grep|wc)/.test(c))
      deny('git diff/show del HTML grande sin --stat ni | head: acota la salida.');
    if (/\bgrep\b|\brg\b/.test(c) && !/\|\s*head|-m\s*\d|--max-count|-c\b|-l\b/.test(c))
      deny('grep sobre fichero pesado sin límite: añade -m N, -c, -l o | head -n N.');
  }
  process.exit(0);
});
