/* pirgunner_gear.js — ►PIRGUNNER: viste al esqueleto Synty pequeño (SKEL_GLB_B64) de PISTOLERO PIRATA
   (referencia de Toni 25/08: tricornio, parche, chaleco azul abierto, cinturón, faldón y botas; las DOS
   pistolas de chispa NO van aquí — las cuelga _gobArmModel con weapon:'flintlock').

   ►SIMPLE v2 (Toni: "están hechos fatal"). La v1 tenía 35 mallas de ropa contra las ~19 del grumete y se
   leía como CAJAS PEGADAS a un esqueleto: tres tablones haciendo de picos del sombrero, rectángulos
   sueltos de faldón con hueco entre ellos, un cinturón que atravesaba el cuerpo de lado a lado. Más
   piezas lo empeoraron. Esta versión vuelve a la disciplina del grumete — POCAS piezas, GRANDES, que
   ENVUELVEN — con una herramienta que allí no se usó: el CILINDRO PARCIAL (thetaStart/thetaLength). Un
   chaleco abierto es un anillo con un hueco delante, no dos tablas; un faldón es un anillo colgando, no
   ocho rectángulos. 11 mallas en total.

   MEDIDO en el rig SKEL (unidades locales de hueso, bind pose) — de aquí salen todos los factores:
     Head    57.6 x 56.5 x 59.0   c=(-0.2, 25.0, 1.4)   minY -3.3  maxY 53.2
     Spine1  40.8 x  4.4 x 33.3  ← LOSA de 4.4 de alto: NO es el torso, no sirve de talla
     Spine2  34.6 x 23.1 x 34.5   c=(-0.2,  4.1, 0.0)   minY -7.5  maxY 15.6   ← el torso REAL
     Hips    44.6 x 23.0 x 21.7   maxY 6.5
     Foot    14.6 x  9.2 x 17.6   c=(-0.4,  1.2,-3.2)
   Por eso las prendas del torso se cuelgan de Spine2 y se tallan con SU caja. */
(function(){
  /* ►PIRLUZ: el S12 es el mundo más iluminado del juego (exposure 0.78, suma de intensidades ≈3.07) y
     markMinionRim le suma un fresnel ROJO. Los tonos oscuros suben MUCHO: lo escrito aquí sale bastante
     más claro en pantalla, por eso todo va casi negro. */
  const COL = { hat:0x140e09, hat2:0x0b0805, blue:0x0f2036, blue2:0x0a1626,
                belt:0x18120b, boot:0x0a0c10, patch:0x06070a };
  const mats = {}, matsD = {};   // cachés PROPIAS de este fichero (los materiales son de módulo)
  const M  = k => mats[k]  || (mats[k]  = new THREE.MeshStandardMaterial({ color:COL[k], roughness:.95, metalness:0, flatShading:true }));
  /* variante a DOS CARAS para los cilindros abiertos (un anillo sin tapas se vería hueco por dentro) */
  const MD = k => matsD[k] || (matsD[k] = new THREE.MeshStandardMaterial({ color:COL[k], roughness:.95, metalness:0, flatShading:true, side:THREE.DoubleSide }));
  /* el pistolero es shadow:false como el grumete → la ropa tampoco proyecta sombra */
  function mesh(geo, mat, parent, x,y,z){
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x,y,z); m.castShadow = false; m.frustumCulled = false;   // frustumCulled: cuelgan de huesos, su caja local no dice dónde acaban en pantalla
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
  const TAU = Math.PI*2;
  window.pirGunnerDress = function(root){
    if(!root || root._pgDressed) return; root._pgDressed = true;
    root.updateMatrixWorld(true);
    const BB = boneBounds(root);
    const bb = re => { for(const n in BB) if(re.test(n)) return BB[n]; return null; };
    const bone = re => { let f=null; root.traverse(o=>{ if(!f && o.name && re.test(o.name)) f=o; }); return f; };
    const C=new THREE.Vector3(), S=new THREE.Vector3();
    const box = (b)=>{ b.getCenter(C); b.getSize(S); return {c:C.clone(), s:S.clone()}; };

    /* — TRICORNIO (Head): copa + ala + cinta. TRES mallas. La v1 le añadía tres "picos" sueltos que de
         espaldas parecían tablones clavados; el ala triangular ya da la silueta ella sola. En el espacio
         del hueso Head, +Z es la CARA. El ala va GRUESA: markMinionRim vuelve rosa pálido cualquier placa
         fina vista de canto (fresnel ≈1 en toda su superficie). — */
    const headB = bone(/head$/i), hB = bb(/head$/i);
    if(headB && hB){ const {c,s} = box(hB);
      const brimY = hB.min.y + s.y*0.80, R = s.x*0.86;                 // justo por encima de las cuencas
      const brim = mesh(new THREE.CylinderGeometry(1, 1.12, 1, 3), M('hat'), headB, c.x, brimY, c.z);
      brim.scale.set(R, s.y*0.15, R); brim.rotation.y = Math.PI;       // ►AJUSTA: un pico atrás y dos delante
      const crown = mesh(new THREE.CylinderGeometry(0.74, 1, 1, 8), M('hat'), headB, c.x, brimY + s.y*0.17, c.z);
      crown.scale.set(s.x*0.60, s.y*0.34, s.z*0.62);                   // copa alta: es lo que distingue el tricornio de una pamela
      const band = mesh(new THREE.CylinderGeometry(1.02, 1.02, 1, 8), M('hat2'), headB, c.x, brimY + s.y*0.075, c.z);
      band.scale.set(s.x*0.61, s.y*0.06, s.z*0.63);

      /* — PARCHE: pastilla en la cuenca +X y correa cruzando el cráneo. DOS mallas. — */
      const eyeY = hB.min.y + s.y*0.56, eyeZ = hB.max.z - s.z*0.05;
      const pat = mesh(new THREE.BoxGeometry(s.x*0.24, s.y*0.19, s.z*0.05), M('patch'), headB, c.x + s.x*0.17, eyeY, eyeZ);
      pat.rotation.z = -0.10;
      const str = mesh(new THREE.BoxGeometry(s.x*1.00, s.y*0.045, s.z*0.03), M('patch'), headB, c.x, eyeY + s.y*0.055, eyeZ - s.z*0.07);
      str.rotation.z = 0.14;
    }

    /* — CHALECO (Spine2, el torso REAL): DOS anillos abiertos por delante. El hueco de thetaLength deja
         ver el esternón, que es lo que pide la referencia, y al ser un anillo ENVUELVE el cuerpo en vez
         de flotar a los lados como hacían las tres tablas de la v1. El de abajo abre más (vuela). — */
    const sp2 = bone(/spine2$/i) || bone(/spine1$/i) || bone(/spine$/i), tB = bb(/spine2$/i) || bb(/spine1$/i);
    if(sp2 && tB){ const {c,s} = box(tB);
      const rx = s.x*0.66, rz = s.z*0.66;                              // ceñido al torso: la tela toca el hueso
      const topY = tB.max.y*1.22, botY = tB.min.y - s.y*0.10, H = topY - botY;   // sube por encima de Spine2 para tapar los hombros
      const GAP = 0.62;                                                // ►AJUSTA: medio hueco delantero en radianes (theta=0 es +Z = la cara)
      const ring = (y, h, k, mat, flare) => {
        const g = new THREE.CylinderGeometry(1, flare, 1, 9, 1, true, GAP, TAU - GAP*2);
        const m = mesh(g, mat, sp2, c.x, y, c.z); m.scale.set(rx*k, h, rz*k); return m;
      };
      ring(topY - H*0.30, H*0.62, 1.00, MD('blue'),  1.04);            // cuerpo del chaleco
      ring(topY - H*0.78, H*0.40, 1.06, MD('blue2'), 1.22);            // bajo, más abierto y volado
    }

    /* — CINTURÓN + FALDÓN (Hips): DOS anillos. La talla la manda la PELVIS. El faldón es un anillo
         colgando, no ocho rectángulos sueltos como en la v1. — */
    const hips = bone(/hips$/i), pB = bb(/hips$/i);
    if(hips && pB){ const {c, s:ps} = box(pB);
      const beltY = pB.max.y - ps.y*0.22, rx = ps.x*0.56, rz = ps.z*0.62;
      const belt = mesh(new THREE.CylinderGeometry(1, 1, 1, 9), M('belt'), hips, c.x, beltY, c.z);
      belt.scale.set(rx*1.06, ps.y*0.26, rz*1.10);
      const skirt = mesh(new THREE.CylinderGeometry(1, 1.34, 1, 9, 1, true), MD('blue'), hips, c.x, beltY - ps.y*0.42, c.z);
      skirt.scale.set(rx*1.02, ps.y*0.58, rz*1.06);                    // cae abriéndose (1.34) → lee como tela, no como tubo
    }

    /* — BOTAS (Foot): UNA caja por pie. — */
    for(const re of [/leftfoot$/i, /rightfoot$/i]){
      const ft = bone(re), fB = bb(re); if(!ft || !fB) continue;
      const {c,s} = box(fB);
      mesh(new THREE.BoxGeometry(s.x*1.28, s.y*1.30, s.z*1.12), M('boot'), ft, c.x, c.y + s.y*0.10, c.z);
    }
  };
})();
