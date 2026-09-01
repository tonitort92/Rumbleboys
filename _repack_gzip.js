/* REPACK fase 1b: comprime los binarios de assets/ (.bin -> .bin.gz, gzip -9), borra el .bin y marca
   gz:1 en manifest.json. El cargador RB_ASSETS pide NOMBRE.bin.gz y lo descomprime en el navegador con
   DecompressionStream (asi funciona en cualquier hosting, aunque no comprima octet-stream). Idempotente:
   los .bin.gz ya existentes se saltan. Uso: node _repack_gzip.js */
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const OUT = path.join(__dirname, 'assets');
const MANIFEST_PATH = path.join(OUT, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
let nIn = 0, nOut = 0, files = 0;
function gz(fp) {
  const g = fp + '.gz';
  if (fs.existsSync(g) && !fs.existsSync(fp)) return;
  const buf = fs.readFileSync(fp);
  const out = zlib.gzipSync(buf, { level: 9 });
  fs.writeFileSync(g, out);
  fs.unlinkSync(fp);
  nIn += buf.length; nOut += out.length; files++;
}
for (const [name, e] of Object.entries(manifest)) {
  if (e.f) { gz(path.join(OUT, e.f)); e.gz = 1; }
  else if (e.d) { for (const k of e.keys) gz(path.join(OUT, e.d, k + '.bin')); e.gz = 1; }
}
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 1));
console.log(files + ' ficheros: ' + (nIn >> 20) + ' MB -> ' + (nOut >> 20) + ' MB gz');
