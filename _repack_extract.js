/* ►REPACK 4b · Fase 1: extrae los ficheros de assets *_B64 (JS con base64 embebido) a binarios en
   assets/ + assets/manifest.json. Ejecuta cada .js en un vm con un window falso — sin regex frágiles.
   Uso: node --max-old-space-size=4096 _repack_extract.js fichero1.js fichero2.js ...
   Informa por fichero QUÉ globales define y de qué tipo; solo es seguro quitar el <script> de un
   fichero si TODO lo suyo quedó extraído (el informe lo dice). */
const fs = require('fs'), path = require('path'), vm = require('vm');
const OUT = 'assets';
fs.mkdirSync(OUT, { recursive: true });
const MANIFEST_PATH = path.join(OUT, 'manifest.json');
const manifest = fs.existsSync(MANIFEST_PATH) ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) : {};
const okB64 = s => typeof s === 'string' && s.length > 64 && /^[A-Za-z0-9+/=\s]+$/.test(s.slice(0, 256));
const magic = b => b.slice(0, 4).toString() === 'glTF' ? 'glb' : b.slice(0, 18).toString().startsWith('Kaydara') ? 'fbx' : '???';
let totalIn = 0, totalOut = 0;
for (const file of process.argv.slice(2)) {
  const code = fs.readFileSync(file, 'utf8');
  totalIn += code.length;
  const w = {};
  try { vm.runInNewContext(code, { window: w }, { filename: file, timeout: 120000 }); }
  catch (e) { console.log('ERR ejecutando ' + file + ': ' + e.message); continue; }
  const report = [];
  let clean = true;
  for (const [name, val] of Object.entries(w)) {
    if (typeof val === 'string' && okB64(val)) {
      const buf = Buffer.from(val.replace(/\s+/g, ''), 'base64');
      fs.writeFileSync(path.join(OUT, name + '.bin'), buf);
      manifest[name] = { f: name + '.bin', n: buf.length };
      totalOut += buf.length;
      report.push(name + ' -> ' + name + '.bin (' + magic(buf) + ', ' + (buf.length >> 10) + ' KB)');
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      const keys = Object.keys(val), good = keys.filter(k => okB64(val[k]));
      if (good.length === keys.length && keys.length > 0) {
        const dir = path.join(OUT, name);
        fs.mkdirSync(dir, { recursive: true });
        let bytes = 0, mg = '';
        for (const k of keys) {
          const buf = Buffer.from(val[k].replace(/\s+/g, ''), 'base64');
          fs.writeFileSync(path.join(dir, k + '.bin'), buf);
          bytes += buf.length; mg = magic(buf);
        }
        manifest[name] = { d: name, keys: keys, n: bytes };
        totalOut += bytes;
        report.push(name + ' -> ' + name + '/{' + keys.length + ' claves} (' + mg + ', ' + (bytes >> 10) + ' KB)');
      } else {
        clean = false;
        report.push('MIXTO ' + name + ': ' + keys.length + ' claves, ' + good.length + ' b64 — NO extraído');
      }
    } else {
      clean = false;
      report.push('RARO ' + name + ' (' + typeof val + ') — NO extraído');
    }
  }
  console.log((clean ? 'LIMPIO  ' : 'REVISAR ') + file + '  |  ' + report.join('  |  '));
}
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 1));
console.log('manifest: ' + Object.keys(manifest).length + ' entradas · in ' + (totalIn >> 20) + ' MB js -> out ' + (totalOut >> 20) + ' MB bin');
