/* Servidor local NO-CACHE para BLOCKOUT — mata la caché de file://.
   Uso: doble clic en JUGAR.bat (o `node _serve.js`). Sirve la carpeta en http://localhost:8181
   con Cache-Control: no-store → CADA recarga trae lo último del disco, garantizado. */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname, PORT = 8181;
const TYPES = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript',
  '.css':'text/css', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.gif':'image/gif',
  '.svg':'image/svg+xml', '.mp3':'audio/mpeg', '.wav':'audio/wav', '.ogg':'audio/ogg', '.woff2':'font/woff2', '.woff':'font/woff',
  '.mp4':'video/mp4', '.webm':'video/webm',                                        // ►CHARUI: vídeos de ataque del selector
  '.glb':'model/gltf-binary', '.gltf':'model/gltf+json', '.fbx':'application/octet-stream',
  '.obj':'text/plain', '.mtl':'text/plain', '.json':'application/json', '.ico':'image/x-icon', '.txt':'text/plain' };
const isVideo = fp => /\.(mp4|webm)$/i.test(fp);   // ►CHARUI: los vídeos SÍ se cachean (ver abajo)
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (p === '/' || p === '') p = '/rumble_arena_cinta_v4.html';
  const fp = path.join(ROOT, p);
  if (!fp.startsWith(ROOT)) { res.writeHead(403); res.end('403'); return; }   // no salir de la carpeta
  fs.readFile(fp, (e, data) => {
    if (e) { res.writeHead(404, {'Content-Type':'text/plain'}); res.end('404: ' + p); return; }
    /* ►CHARUI: el `no-store` existe para matar el CÓDIGO stale, no los medios. Aplicado a los
       vídeos hacía que CADA hover del selector se los re-descargara entero (y con
       application/octet-stream Chrome puede negarse hasta a hacer Range/seek). Son inmutables:
       se cachean. Los dos arreglos van juntos — con uno solo, el prefetch es papel mojado. */
    res.writeHead(200, Object.assign(
      { 'Content-Type': TYPES[path.extname(fp).toLowerCase()] || 'application/octet-stream' },
      isVideo(fp) ? { 'Cache-Control': 'public, max-age=31536000, immutable' }
                  : { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                      'Pragma': 'no-cache', 'Expires': '0' }
    ));
    res.end(data);
  });
}).listen(PORT, () => {
  console.log('\n  BLOCKOUT servido SIN CACHE en:  http://localhost:' + PORT + '/rumble_arena_cinta_v4.html');
  console.log('  (deja esta ventana abierta mientras juegas · Ctrl+C para parar)\n');
});
