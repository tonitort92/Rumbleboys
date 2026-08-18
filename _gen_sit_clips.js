/* ►HOGUERA · genera sit_clips.js: el clip 'sit' de cada personaje (6 FBX "Sitting*" de Mixamo) como
   pistas numéricas de texto plano, igual que carry_clips.js. Ni FBXLoader ni 10 MB de base64 en el
   arranque: el HTML reconstruye los AnimationClip con buildFbxClips().

   Uso:  node _gen_sit_clips.js [carpeta_con_node_modules] [carpeta_con_los_FBX]
   (por defecto: el scratchpad donde vive el toolchain de ►CARRY2, y C:/Users/tonit/Downloads)

   Necesita `three@0.128` y `fflate` (el FBXLoader de examples/js espera el THREE global).

   CADERA: su rotación de reposo difiere 90-120° entre el FBX de Mixamo y el GLB del juego (que salió
   por Blender y lleva esa corrección en el Armature). Sin arreglarlo el personaje sale TUMBADO.
   Corrección offline, solo en la raíz:  R = q_reposoGLB * inv(q_reposoFBX)  ·  q_final = R * q_fbx
   (misma receta que gen_clips_js.js de ►CARRY2 — si cambia una, cambia la otra).

   La Y de la cadera se conserva tal cual: en un clip SENTADO es la que baja el cuerpo hasta el
   suelo. Quien la congele verá a los seis flotando de pie sobre la hoguera. */
const fs = require('fs'), path = require('path'), vm = require('vm');

const LIB = process.argv[2] || 'C:/Users/tonit/AppData/Local/Temp/claude/C--Users-tonit-Downloads-RUMBLEBOYS-v1000-20260816T132014Z-1-001/8badb5a9-7783-40f2-a318-06bbdbef2bfc/scratchpad/fbx';
const FBXDIR = process.argv[3] || 'C:/Users/tonit/Downloads';
const REPO = __dirname;

global.window = { URL: { createObjectURL: () => 'blob:stub', revokeObjectURL: () => {} } };
global.document = { createElement: () => ({ style: {}, addEventListener(){}, removeEventListener(){}, setAttribute(){}, getContext: () => null }) };
global.document.createElementNS = global.document.createElement;
global.self = global.window;
global.THREE = require(path.join(LIB, 'node_modules/three'));
global.fflate = require(path.join(LIB, 'node_modules/fflate'));
const T = path.join(LIB, 'node_modules/three/examples/js');
for (const f of ['curves/NURBSUtils.js', 'curves/NURBSCurve.js', 'loaders/FBXLoader.js'])
  vm.runInThisContext(fs.readFileSync(path.join(T, f), 'utf8'), { filename: f });

const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
/* el reparto lo dio Toni: archer, barbarian, knight, mage, samurai y nun/priest "respectivamente" */
const ORDER = ['archer', 'voxelhero', 'knight', 'link', 'samurai', 'nun'];
const FILES = ['Sitting Rubbing Arm.fbx', 'Sitting Gun Motion.fbx', 'Sitting.fbx',
               'Sitting(1).fbx', 'Sitting Talking.fbx', 'Sitting Talking(1).fbx'];

// rotación de reposo de la cadera en cada GLB del juego (chars_models.js son GLB en base64)
const txt = fs.readFileSync(path.join(REPO, 'chars_models.js'), 'utf8');
const glbHips = {};
{ const re = /"([a-z0-9_]+)"\s*:\s*"([A-Za-z0-9+/=]+)"/gi; let m;
  while ((m = re.exec(txt))) {
    const buf = Buffer.from(m[2], 'base64');
    if (buf.slice(0, 4).toString('ascii') !== 'glTF') continue;
    const j = JSON.parse(buf.slice(20, 20 + buf.readUInt32LE(12)).toString('utf8'));
    for (const n of j.nodes) if (norm(n.name || '') === 'mixamorighips') glbHips[m[1]] = n.rotation || [0, 0, 0, 1];
  } }

const Q = v => +v.toFixed(3);      // 3 decimales: ~0.03°, imperceptible en un corro quieto
const P = v => +v.toFixed(2);
/* DIEZMADO a 1 de cada 2 claves (30 -> 15 fps). Los 6 clips son gente sentada moviéndose despacio y
   el mixer interpola: a ojo no se distingue, y sin esto el fichero se va a 3,2 MB (los dos "Sitting
   Talking" duran 44 s = 1.323 claves cada uno) sobre los ~95 MB de assets que ya se parsean al
   arrancar. Se conserva SIEMPRE la última clave, o el clip se acortaría y el bucle daría un salto. */
const STEP = 2;
const thin = (times, values, stride) => {
  const t = [], v = [], last = times.length - 1;
  for (let i = 0; i <= last; i += STEP) {
    t.push(times[i]); for (let k = 0; k < stride; k++) v.push(values[i * stride + k]);
  }
  if (t[t.length - 1] !== times[last]) {
    t.push(times[last]); for (let k = 0; k < stride; k++) v.push(values[last * stride + k]);
  }
  return { t, v };
};
const out = { sit: {} };

FILES.forEach((file, i) => {
  const key = ORDER[i];
  if (!glbHips[key]) throw new Error('sin cadera de reposo en el GLB de ' + key);
  const b = fs.readFileSync(path.join(FBXDIR, file));
  const obj = new THREE.FBXLoader().parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength), '');
  const bones = {}; obj.traverse(o => { if (o.isBone || o.type === 'Bone') bones[norm(o.name)] = o; });
  const clip = obj.animations[0];
  const R = new THREE.Quaternion().fromArray(glbHips[key]).multiply(bones['mixamorighips'].quaternion.clone().invert());

  /* OJO: FBXLoader PODA claves redundantes → no todas las pistas comparten tiempos. Se guarda el
     array MÁS COMÚN en 't' y solo las excepciones en 'tq' (por hueso). */
  const q = {}, tq = {}, rawT = {};
  let hips = null, hipsT = null;
  const tmp = new THREE.Quaternion();
  for (const tr of clip.tracks) {
    const dot = tr.name.lastIndexOf('.');
    const bn = norm(tr.name.slice(0, dot)), prop = tr.name.slice(dot + 1);
    if (prop === 'quaternion') {
      const d = thin(Array.from(tr.times), Array.from(tr.values), 4);
      rawT[bn] = d.t.map(t => +t.toFixed(4));
      const v = d.v;
      if (bn === 'mixamorighips')                              // <-- la corrección, solo en la raíz
        for (let k = 0; k + 3 < v.length; k += 4) { tmp.set(v[k], v[k+1], v[k+2], v[k+3]).premultiply(R); v[k]=tmp.x; v[k+1]=tmp.y; v[k+2]=tmp.z; v[k+3]=tmp.w; }
      q[bn] = v.map(Q);
    } else if (prop === 'position' && bn === 'mixamorighips') {
      const d = thin(Array.from(tr.times), Array.from(tr.values), 3);
      hips = d.v.map(P);
      hipsT = d.t.map(t => +t.toFixed(4));
    }
  }
  const counts = {};
  for (const bn in rawT) { const s = rawT[bn].join(','); counts[s] = (counts[s] || 0) + 1; }
  const common = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  const times = common.split(',').map(Number);
  let excep = 0;
  for (const bn in rawT) if (rawT[bn].join(',') !== common) { tq[bn] = rawT[bn]; excep++; }
  if (hipsT && hipsT.join(',') !== common) tq['__hips_pos'] = hipsT;

  /* altura de asiento: la Y mínima de la cadera en todo el clip. La usa el HTML para plantar el
     culo en el suelo del corro sin adivinar (cada clip de Mixamo se sienta a su altura). */
  let minY = Infinity;
  if (hips) for (let k = 1; k < hips.length; k += 3) minY = Math.min(minY, hips[k]);

  out.sit[key] = { d: +clip.duration.toFixed(4), t: times, q, tq, hp: hips, sy: +(minY === Infinity ? 0 : minY).toFixed(2) };
  console.log(`  sit/${key.padEnd(10)} ${file.padEnd(26)} ${times.length} frames · ${Object.keys(q).length} huesos · propios:${excep} · culo Y=${out.sit[key].sy}`);
});

const ser = o => '{' + Object.keys(o).map(k => JSON.stringify(k) + ':' + (
  Array.isArray(o[k]) ? '[' + o[k].join(',') + ']' : (typeof o[k] === 'object' && o[k] !== null ? ser(o[k]) : JSON.stringify(o[k]))
)).join(',') + '}';

const js = `/* ►HOGUERA · clip 'sit' de Mixamo, uno por personaje, para el corro de la PANTALLA 1.
   archer=Sitting Rubbing Arm · voxelhero=Sitting Gun Motion · knight=Sitting · link=Sitting(1) ·
   samurai=Sitting Talking · nun=Sitting Talking(1)   (reparto pedido por Toni el 18/08)

   Mismo formato que carry_clips.js: rotaciones locales por hueso con la clave normalizada
   ('mixamorig:LeftArm' -> 'mixamorigleftarm'), 4 decimales. 't' = tiempos comunes, 'tq' = los de las
   pistas que no los comparten (el FBXLoader poda claves), 'q' = cuaterniones, 'hp' = posicion de la
   cadera, 'd' = duracion, 'sy' = Y minima de la cadera (altura de asiento).

   La CADERA viene CORREGIDA: su reposo difiere 90-120 grados entre el FBX de Mixamo y el GLB del
   juego, y sin arreglarlo el personaje sale TUMBADO. Se aplica offline en _gen_sit_clips.js.

   Texto plano a proposito: son pistas numericas, no un modelo (los .js base64 del repo son para
   MODELOS). Regenerar con:  node _gen_sit_clips.js  */
window.SIT_CLIPS = ${ser(out)};
`;
const dest = path.join(REPO, 'sit_clips.js');
fs.writeFileSync(dest, js);
console.log('sit_clips.js →', (fs.statSync(dest).size / 1024).toFixed(0), 'KB');
