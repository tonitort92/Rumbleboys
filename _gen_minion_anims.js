/* ►MINIONS29 · genera los *_anims.js de las 9 pieles nuevas de horda (29/08/2026): 4 FBX Mixamo
   (idle / walk / attack / jump) en base64 por piel, el MISMO formato que goblinshaman_anims.js y
   pirate_captain_anims.js: los monta _gobFbxLoad. idle va PRIMERO (dona la malla y de sus materiales
   sale el tinte) y jump AL FINAL (►RBJUMP). Sin dependencias: Node a pelo.
   Uso:  node _gen_minion_anims.js [carpeta raiz con los FBX]   (por defecto Desktop\new minions) */
const fs = require('fs'), path = require('path');
const ROOT = process.argv[2] || 'C:/Users/tonit/Desktop/new minions';
const OUT = __dirname;
const T = [
  { out:'knightheavy_anims.js',     key:'KNHEAVY_FBX_B64',  dir:'World 2/heavyknight',    mesh:'SM_Chr_Knights_Light_01',          rol:"caballero PESADO (large, espada) del mundo 2",
    clips:{ idle:'Idle(3).fbx', walk:'Walking(3).fbx', attack:'Sword And Shield Slash.fbx', jump:'Jumping(5).fbx' } },
  { out:'knightlight_anims.js',     key:'KNLIGHT_FBX_B64',  dir:'World 2/lightknight',    mesh:'SM_Chr_Dungeon_KnightFemale_01',   rol:"caballera LIGERA (small mediano, melee espada) del mundo 2",
    clips:{ idle:'Idle(1).fbx', walk:'Crouched Walking.fbx', attack:'Standing Melee Attack Backhand.fbx', jump:'Jumping(1).fbx' } },
  { out:'knightarcher_anims.js',    key:'KNARCHER_FBX_B64', dir:'World 2/shooterkinght',  mesh:'SM_Chr_Knights_Soldier_01',        rol:"soldado ARQUERO (shooter, arco + flecha real) del mundo 2",
    clips:{ idle:'Idle(2).fbx', walk:'Strut Walking.fbx', attack:'Standing Aim Recoil.fbx', jump:'Jumping(3).fbx' } },
  { out:'witch_anims.js',           key:'WITCH_FBX_B64',    dir:'World 2/witchminion',    mesh:'SM_Chr_Fantasy_Witch_01',          rol:"BRUJA (shooter, baston del mago + orbe lila) del mundo 2",
    clips:{ idle:'Idle(4).fbx', walk:'Strut Walking(1).fbx', attack:'Standing 1H Magic Attack 01.fbx', jump:'Jumping(6).fbx' } },
  { out:'geisha_anims.js',          key:'GEISHA_FBX_B64',   dir:'world 3/geisha',         mesh:'SM_Chr_Samurai_Geisha_01',         rol:"GEISHA (shooter, shuriken de acero como la Q del samurai) del mundo 3",
    clips:{ idle:'Idle(5).fbx', walk:'Walking(4).fbx', attack:'Standing 1H Magic Attack 01(1).fbx', jump:'Jumping(7).fbx' } },
  { out:'pirate_firstmate_anims.js',key:'PIRMATE_FBX_B64',  dir:'world 10/piratewarrior', mesh:'SM_Chr_Pirates_Firstmate_01',      rol:"CONTRAMAESTRE pirata (small mediano, melee a punos) del mundo 12",
    clips:{ idle:'Idle(7).fbx', walk:'Walking(6).fbx', attack:'Zombie Attack(2).fbx', jump:'Jumping(9).fbx' } },
  { out:'pirate_english_anims.js',  key:'PIRENG_FBX_B64',   dir:'world 10/captain',       mesh:'SM_Chr_Pirates_EnglishCaptain_01', rol:"CAPITAN INGLES (small mediano, melee espada) del mundo 12",
    clips:{ idle:'Idle(6).fbx', walk:'Walking(5).fbx', attack:'Standing Melee Attack Horizontal.fbx', jump:'Jumping(8).fbx' } },
  { out:'ice_rogue_anims.js',       key:'ICEROGUE_FBX_B64', dir:'world 12/rogue',         mesh:'SM_Chr_Fantasy_RougeMale_01',      rol:"PICARO del hielo (small mediano, melee espada) del mundo 7",
    clips:{ idle:'Idle(8).fbx', walk:'Walking(7).fbx', attack:'Standing Melee Attack Downward(3).fbx', jump:'Jumping(10).fbx' } },
  { out:'ice_deckhand_anims.js',    key:'ICEDECK_FBX_B64',  dir:'world 12/deckhand',      mesh:'SM_Chr_Pirates_Deckhand_01',       rol:"GRUMETE del hielo (small mediano, melee hacha) del mundo 7",
    clips:{ idle:'Idle(9).fbx', walk:'Crouched Walking.fbx', attack:'Standing Melee Attack Downward(4).fbx', jump:'Jumping(11).fbx' } },
];
for(const t of T){
  const parts = [];
  let tot = 0;
  for(const k of ['idle','walk','attack','jump']){          // ORDEN: idle primero, jump al final
    const p = path.join(ROOT, t.dir, t.clips[k]);
    const buf = fs.readFileSync(p); tot += buf.length;
    if(buf.slice(0,18).toString('ascii') !== 'Kaydara FBX Binary') throw new Error('no es FBX binario: ' + p);
    parts.push('  ' + k + ': "' + buf.toString('base64') + '"');
  }
  const hdr = '/* ►MINIONS29 · ' + t.rol + ' — 4 FBX Mixamo embebidos en base64;\n' +
    '   los monta _gobFbxLoad (como el chaman del S2 y los piratas del S12). Donante de malla = idle.\n' +
    '   Clips: idle / walk (' + t.clips.walk.replace('.fbx','') + ') / attack (' + t.clips.attack.replace('.fbx','') + ') / jump.\n' +
    '   ORDEN: idle PRIMERO (dona la malla y de sus materiales sale el tinte) y jump AL FINAL (►RBJUMP).\n' +
    '   Synty POLYGON Mini (' + t.mesh + ') riggeado en Mixamo, atlas dentro del FBX.\n' +
    '   Generado por _gen_minion_anims.js desde "' + t.dir + '". */\n';
  const js = hdr + 'window.' + t.key + ' = {\n' + parts.join(',\n') + '\n};\n';
  fs.writeFileSync(path.join(OUT, t.out), js);
  console.log(t.out.padEnd(28), (tot/1048576).toFixed(2) + ' MB fbx ->', (js.length/1048576).toFixed(2) + ' MB js');
}
