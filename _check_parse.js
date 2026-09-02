/* Chequeo de sintaxis de TODOS los <script> inline del HTML (el principal son ~43k lineas: un parentesis o un
   comentario a mitad de linea lo deja entero muerto y el juego arranca sin nada). Uso: node _check_parse.js
   Sale con codigo 1 si algun bloque no parsea. Ejecutar SIEMPRE antes de commitear el HTML. */
'use strict';
const fs = require('fs');
const s = fs.readFileSync(__dirname + '/rumble_arena_cinta_v4.html', 'utf8');
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
let m, i = 0, bad = 0;
while ((m = re.exec(s))) {
  i++; const code = m[1]; if (code.trim().length < 20) continue;
  const line = s.slice(0, m.index).split('\n').length;
  try { new Function(code); }
  catch (e) {
    if (/await is only valid/.test(e.message)) continue;          // bloque con await de nivel superior (modulo)
    bad++; console.log('ROTO bloque ' + i + ' (linea ' + line + '): ' + e.message);
  }
}
console.log(bad ? 'PARSE ROTO' : 'PARSE OK (' + i + ' bloques)');
process.exit(bad ? 1 : 0);
