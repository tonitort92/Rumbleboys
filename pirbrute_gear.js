/* pirbrute_gear.js — ►PIRBRUTE: viste al esqueleto Synty pequeño (SKEL_GLB_B64) de BRUTO PIRATA
   (referencia de Toni 25/08: camiseta y pantalón corto de rayas azul/blanco rotos y remendados, banda de
   parche cruzando el cráneo, ojo amarillo encendido, antebrazos y puños enormes, descalzo; SIN arma —
   pega con los puños).
   ►RIG: usa el MISMO esqueleto pequeño que el grumete y el pistolero, escalado a h:3.4 por su ficha. La
   primera versión iba sobre SKELKNIGHT_GLB_B64 (el rig `large` que ya existía) y estaba MAL: ese modelo
   trae CASCO CON PENACHO metido en el propio hueso Head — su caja mide 77 x 94 x 139 (el penacho se va 79
   unidades hacia atrás), así que la banda del parche salía como un tablón atravesando la cabeza y el
   cráneo pelado de la referencia no aparecía por ningún lado. El SKEL da un cráneo limpio.
   ►CORPULENCIA: el encargo era "como te sea más fácil y mejor rendimiento". El VOLUMEN LO PONE LA ROPA —
   en la referencia la camiseta ES el torso y las mangas cubren todo el brazo — así que engordar es cortar
   la prenda muy por encima de la caja del hueso. Solo antebrazos, puños, pantorrillas y pies llevan bulto
   aparte, y ese va del color del propio rig (ver boneMat) para que no cante como material distinto.

   MEDIDO en el rig SKEL (unidades locales de hueso, bind pose) — de aquí salen todos los factores:
     Head    57.6 x 56.5 x 59.0   c=(-0.2, 25.0, 1.4)   minY -3.3  maxY 53.2  maxZ 30.9
     Spine1  40.8 x  4.4 x 33.3  ← LOSA de 4.4 de alto: NO es el torso, no sirve de talla
     Spine2  34.6 x 23.1 x 34.5   c=(-0.2,  4.1, 0.0)   minY -7.5  maxY 15.6            ← el torso REAL
     Hips    44.6 x 23.0 x 21.7   maxY 6.5
     Arm     10.8 x 22.3 x 12.4 · ForeArm 8.0 x 14.8 x 6.7 · Hand 10.4 x 6.5 x 8.3
     UpLeg   23.5 x 34.3 x 22.3 · Leg 9.0 x 14.1 x 10.6 · Foot 14.6 x 9.2 x 17.6 */
(function(){
  /* ►PIRLUZ: el S12 quema los albedos (exposure 0.78, suma de intensidades ≈3.07) y markMinionRim le suma
     un fresnel rojo encima. La paleta va PRE-OSCURECIDA: el "blanco" de las rayas es un gris azulado —
     un blanco de verdad saldría como un foco. */
  const COL = { blue:0x0d2038, white:0x6b747d, patch:0x1a150e, band:0x110e08, dirt:0x232c36 };
  const mats = {};   // caché PROPIA de este fichero (los materiales son de módulo: compartirlos con otro gear los mezclaría)
  const M = k => mats[k] || (mats[k] = new THREE.MeshStandardMaterial({ color:COL[k], roughness:.95, metalness:0, flatShading:true }));
  /* el OJO: opaco a propósito. El traverse ►WESTERN FIX de _gobBuildInst fuerza transparent=false justo
     después del dress, y un depthWrite:false además dejaría la pieza fuera del contorno de tinta. El brillo
     lo da el emissive, que no depende de las luces del stage. */
  let _eyeMat = null;
  const EYE = () => _eyeMat || (_eyeMat = new THREE.MeshStandardMaterial({ color:0xffd23a, emissive:0xffb000, emissiveIntensity:2.4, roughness:.6, metalness:0, flatShading:true }));
  /* HUESO: en vez de adivinar el tono del rig, se MUESTREA del primer material del propio esqueleto. Si
     ese material va texturado (color blanco + map) el muestreo no vale y se cae a un tono fijo. Se cachea
     por color: todos los brutos comparten rig, así que en la práctica es UN material. */
  const _boneMats = {};
  const BONE_FALLBACK = 0x8f8968;   // ►AJUSTA: tono hueso si el rig va texturado y no se puede muestrear
  function boneTone(root){
    let hex = null;
    root.traverse(o=>{ if(hex!=null || !o.isSkinnedMesh || !o.material) return;
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      if(!m || !m.color || m.map) return;                             // texturado: su .color es blanco y no dice nada
      const c = m.color.getHex();
      if(c === 0xffffff) return;                                      // blanco puro = sin tintar, tampoco dice nada
      hex = c;
    });
    return hex;                                                       // null si no se pudo muestrear → boneMat cae al FALLBACK
  }
  function boneMat(root){
    let hex = null;
    try{ hex = boneTone(root); }catch(e){ hex = null; }
    if(typeof hex !== 'number' || !isFinite(hex)) hex = BONE_FALLBACK;
    return _boneMats[hex] || (_boneMats[hex] = new THREE.MeshStandardMaterial({ color:hex, roughness:.95, metalness:0, flatShading:true }));
  }
  /* el bruto es `large` → shadow:true. OJO: cfg.shadow se aplica en _gobBuildInst ANTES del dress, así que
     estas mallas se quedarían fuera de la sombra si no se marcan aquí (y un large sin sombra en la ropa
     proyectaría solo el esqueleto de dentro). */
  function mesh(geo, mat, parent, x,y,z){
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x,y,z); m.castShadow = true; m.frustumCulled = false;
    parent.add(m); return m;
  }
  /* caja de la geometría que CUELGA de cada hueso, en espacio LOCAL del hueso (bind pose):
     v_local = boneInverse * bindMatrix * v  (la parte fija de la fórmula de skinning) */
  function boneBounds(root){
    const map = {}, v = new THREE.Vector3();
    root.traverse(o=>{ if(!o.isSkinnedMesh || !o.geometry || !o.skeleton) return;
      const pos=o.geometry.attributes.position, si=o.geometry.attributes.skinIndex, sw=o.geometry.attributes.skinWeight, sk=o.skeleton;
      if(!pos || !si || !sw) return;
      const gc=(at,i,k)=> k===0?at.getX(i) : k===1?at.getY(i) : k===2?at.getZ(i) : at.getW(i);   // r128: BufferAttribute no tiene getComponent (r129+)
      for(let i=0;i<pos.count;i++){
        let bi=0, bw=-1;
        for(let k=0;k<4;k++){ const w=gc(sw,i,k); if(w>bw){ bw=w; bi=gc(si,i,k); } }
        const bone=sk.bones[bi]; if(!bone || !sk.boneInverses[bi]) continue;
        v.fromBufferAttribute(pos,i).applyMatrix4(o.bindMatrix).applyMatrix4(sk.boneInverses[bi]);
        (map[bone.name] || (map[bone.name]=new THREE.Box3())).expandByPoint(v);
      }
    });
    return map;
  }
  window.pirBruteDress = function(root){
    if(!root || root._pbDressed) return; root._pbDressed = true;
    root.updateMatrixWorld(true);
    const BB = boneBounds(root);
    const bb = re => { for(const n in BB) if(re.test(n)) return BB[n]; return null; };
    const bone = re => { let f=null; root.traverse(o=>{ if(!f && o.name && re.test(o.name)) f=o; }); return f; };
    const C=new THREE.Vector3(), S=new THREE.Vector3();
    const box = (b)=>{ b.getCenter(C); b.getSize(S); return {c:C.clone(), s:S.clone()}; };
    const BONE = boneMat(root);

    /* — CABEZA (Head): banda del parche en diagonal sobre la cuenca +X y el OJO amarillo en la -X.
         En el espacio del hueso Head, +Z es la cara y -Z la nuca. — */
    const headB = bone(/head$/i), hB = bb(/head$/i);
    if(headB && hB){ const {c,s} = box(hB);
      /* ►AJUSTA eyeY: 0.58 dejaba la banda POR ENCIMA de las cuencas (parecía una diadema). Las cuencas
         del cráneo Synty caen sobre el 0.46 de la altura de su caja. */
      const eyeY = hB.min.y + s.y*0.46, eyeZ = hB.max.z - s.z*0.04;
      /* la CORREA va fina (0.07 y no 0.13): con la banda gruesa tapaba las DOS cuencas y el bruto salía
         con gafas de sol. Lo que tapa el ojo es el PARCHE de abajo, no la correa. */
      const band = mesh(new THREE.BoxGeometry(s.x*0.98, s.y*0.07, s.z*0.98), M('band'), headB, c.x, eyeY + s.y*0.07, c.z);
      band.rotation.z = 0.20;                                          // ►AJUSTA: cae en diagonal, hacia la cuenca +X
      mesh(new THREE.BoxGeometry(s.x*0.28, s.y*0.22, s.z*0.07), M('patch'), headB, c.x + s.x*0.18, eyeY + s.y*0.05, eyeZ);
      const eye = mesh(new THREE.SphereGeometry(1, 7, 5), EYE(), headB, c.x - s.x*0.18, eyeY, eyeZ - s.z*0.03);
      eye.scale.setScalar(s.x*0.11);                                   // ►AJUSTA: el ojo encendido, la firma del bruto
    }

    /* — CAMISETA DE RAYAS (Spine2, el torso REAL): AQUÍ está la corpulencia. Anillos alternos cortados a
         ~0.95 de la caja del torso, o sea un barril de ~66 de ancho contra un cráneo de 57: hombros más
         anchos que la cabeza, como en la referencia. (El grumete corta a 0.60 y sale flaco.) — */
    const sp2 = bone(/spine2$/i) || bone(/spine1$/i) || bone(/spine$/i), tB = bb(/spine2$/i) || bb(/spine1$/i);
    if(sp2 && tB){ const {c,s} = box(tB);
      const rx = s.x*0.96, rz = s.z*0.94;                              // ►AJUSTA: el ANCHO del bruto sale de aquí
      const topY = tB.max.y*0.94, botY = tB.min.y - s.y*0.04, H = topY - botY, N = 5, sh = H/N;
      for(let i=0;i<N;i++){
        const w = 1 - i*0.045;                                         // se afila un poco hacia la cintura
        const st = mesh(new THREE.CylinderGeometry(0.97, 1, 1, 9), M(i%2 ? 'white' : 'blue'), sp2, c.x, topY - sh*(i+0.5), c.z);
        st.scale.set(rx*w, sh*1.04, rz*w);                             // el 1.04 solapa para que no se vean las juntas
      }
      /* bajo ROTO: tres picos colgando de la camiseta, delante y detrás */
      const jag = [0.24, 0.12, 0.20];
      for(let i=0;i<3;i++){
        const px = c.x + (i-1)*rx*0.52;
        mesh(new THREE.BoxGeometry(rx*0.46, H*jag[i],   rz*0.22), M('blue'), sp2, px, botY - H*jag[i]*0.44,   c.z + rz*0.72);
        mesh(new THREE.BoxGeometry(rx*0.46, H*jag[2-i], rz*0.22), M('blue'), sp2, px, botY - H*jag[2-i]*0.44, c.z - rz*0.72);
      }
      /* REMIENDOS sueltos sobre la tela */
      mesh(new THREE.BoxGeometry(rx*0.34, H*0.15, rz*0.10), M('dirt'), sp2, c.x + rx*0.42, topY - H*0.36, c.z + rz*0.90);
      mesh(new THREE.BoxGeometry(rx*0.24, H*0.11, rz*0.10), M('dirt'), sp2, c.x - rx*0.48, topY - H*0.66, c.z - rz*0.90);
    }

    /* — BRAZOS: manga de rayas sobre el húmero (el hueso Arm apunta al codo en +Y) y sobre el arranque del
         antebrazo; el resto del antebrazo y el PUÑO van de hueso, gordos. — */
    for(const re of [/leftarm$/i, /rightarm$/i]){
      const arm = bone(re), aB = bb(re); if(!arm || !aB) continue;
      const {c:ac, s:as} = box(aB);
      const rA = Math.max(as.x, as.z)*1.35, lA = as.y*0.46;            // manga holgada: el hombro ancho sale de aquí
      mesh(new THREE.CylinderGeometry(rA*0.96, rA, lA, 8), M('blue'),  arm, ac.x, aB.min.y + as.y*0.22, ac.z);
      mesh(new THREE.CylinderGeometry(rA*0.90, rA*0.96, lA, 8), M('white'), arm, ac.x, aB.min.y + as.y*0.62, ac.z);
    }
    for(const re of [/leftforearm$/i, /rightforearm$/i]){
      const fa = bone(re), fB = bb(re); if(!fa || !fB) continue;
      const {c:fc, s:fs} = box(fB);
      const rF = Math.max(fs.x, fs.z)*1.15;
      mesh(new THREE.CylinderGeometry(rF*1.02, rF*1.10, fs.y*0.30, 8), M('blue'), fa, fc.x, fB.min.y + fs.y*0.14, fc.z);   // el puño de la manga
      mesh(new THREE.CylinderGeometry(rF*0.92, rF*1.00, fs.y*0.64, 8), BONE,      fa, fc.x, fB.min.y + fs.y*0.62, fc.z);   // antebrazo GORDO de hueso
    }
    for(const re of [/lefthand$/i, /righthand$/i]){
      const hd = bone(re), dB = bb(re); if(!hd || !dB) continue;
      const {c:dc, s:ds} = box(dB);
      const f = mesh(new THREE.SphereGeometry(1, 7, 5), BONE, hd, dc.x, dc.y, dc.z);
      f.scale.setScalar(ds.x*0.68);                                    // ►AJUSTA: el PUÑO, más ancho que la mano real
    }

    /* — PANTALÓN CORTO DE RAYAS (Hips + UpLeg): la talla la manda la PELVIS — */
    const hips = bone(/hips$/i), pB = bb(/hips$/i);
    if(hips && pB){ const {c, s:ps} = box(pB);
      mesh(new THREE.BoxGeometry(ps.x*1.10, ps.y*0.58, ps.z*1.24), M('blue'),  hips, c.x, c.y + ps.y*0.18, c.z);
      mesh(new THREE.BoxGeometry(ps.x*1.08, ps.y*0.30, ps.z*1.22), M('white'), hips, c.x, c.y - ps.y*0.20, c.z);
      for(const re of [/leftupleg$/i, /rightupleg$/i]){
        const up = bone(re), knee = bone(re.source.indexOf('left')===0 ? /leftleg$/i : /rightleg$/i);
        if(!up || !knee) continue;
        const kl = up.worldToLocal(knee.getWorldPosition(new THREE.Vector3()));
        const L = Math.max(1e-3, Math.abs(kl.y)), dir = kl.y>=0 ? 1 : -1;    // fémur: largo y hacia dónde cae la rodilla en el espacio del hueso
        mesh(new THREE.BoxGeometry(ps.x*0.52, L*0.26, ps.z*0.98), M('blue'),  up, 0, dir*L*0.14, 0);
        mesh(new THREE.BoxGeometry(ps.x*0.50, L*0.18, ps.z*0.96), M('white'), up, 0, dir*L*0.33, 0);
        mesh(new THREE.BoxGeometry(ps.x*0.24, L*0.12, ps.z*0.94), M('blue'),  up, -ps.x*0.13, dir*L*0.45, 0);   // bajo ROTO: solo media pernera baja
      }
    }

    /* — PANTORRILLAS Y PIES DESCALZOS: bulto de hueso, sin bota — */
    for(const re of [/leftleg$/i, /rightleg$/i]){
      const lg = bone(re), lB = bb(re); if(!lg || !lB) continue;
      const {c:lc, s:ls} = box(lB);
      const rL = Math.max(ls.x, ls.z)*0.82;
      mesh(new THREE.CylinderGeometry(rL*0.72, rL, ls.y*0.60, 8), BONE, lg, lc.x, lB.min.y + ls.y*0.34, lc.z);
    }
    for(const re of [/leftfoot$/i, /rightfoot$/i]){
      const ft = bone(re), fB = bb(re); if(!ft || !fB) continue;
      const {c,s} = box(fB);
      mesh(new THREE.BoxGeometry(s.x*1.22, s.y*1.10, s.z*1.12), BONE, ft, c.x, c.y, c.z);
    }
  };
})();
