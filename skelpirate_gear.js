/* skelpirate_gear.js — ►PIRMINION: viste al esqueleto Synty pequeño (SKEL_GLB_B64) de GRUMETE PIRATA
   (referencia de Toni 24/08: bandana roja anudada atrás, camiseta rayas rojas/blancas, pantalón marrón
   remendado con cinturón azulado; SIN arma). No hay GLB nuevo: se cuelgan mallas low-poly de los HUESOS
   del rig Mixamo → siguen la animación gratis.
   ►PIRFIT (Toni: "pantalón por dentro del hueso, gorro metido en el cráneo"): la ropa ya NO se talla a
   ojo con distancias entre huesos — se mide la GEOMETRÍA REAL por hueso (cada vértice skinned se asigna
   a su hueso dominante y se acumula su caja en espacio local del hueso, en bind pose) y las prendas se
   cortan sobre esa caja con margen. Cráneo/pelvis/muslos quedan SIEMPRE por dentro de la tela. */
(function(){
  /* ►PIRLUZ: el sol del S12 multiplica ~x3 y quema los albedos — marrón/cinturón van CASI NEGROS a propósito (0x5c4128 se veía crema hueso) */
  const COL = { red:0x9c2820, red2:0xa8352a, white:0xe8dcc4, brown:0x2e2418, belt:0x2a3140, patch:0x4a5568 };
  const mats = {};
  const M = k => mats[k] || (mats[k] = new THREE.MeshStandardMaterial({ color:COL[k], roughness:.95, metalness:0, flatShading:true }));
  function mesh(geo, mat, parent, x,y,z){
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x,y,z); m.castShadow = false; m.frustumCulled = false;
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
  window.skelPirateDress = function(root){
    if(!root || root._pirDressed) return; root._pirDressed = true;
    root.updateMatrixWorld(true);
    const BB = boneBounds(root);
    const bb = re => { for(const n in BB) if(re.test(n)) return BB[n]; return null; };
    const bone = re => { let f=null; root.traverse(o=>{ if(!f && o.name && re.test(o.name)) f=o; }); return f; };
    const C=new THREE.Vector3(), S=new THREE.Vector3();
    const box = (b)=>{ b.getCenter(C); b.getSize(S); return {c:C.clone(), s:S.clone()}; };

    /* — BANDANA (Head): cúpula pegada al cráneo REAL (caja del hueso Head) + nudo y colas atrás — */
    const headB = bone(/head$/i), hB = bb(/head$/i);
    if(headB && hB){ const {c,s} = box(hB);
      const a = s.y*0.46;                                              // semieje vertical de la cúpula
      const dome = mesh(new THREE.SphereGeometry(1, 8, 5, 0, Math.PI*2, 0, Math.PI*0.60), M('red'), headB,
                        c.x, hB.min.y + s.y*0.76, c.z + s.z*0.02);     // el borde cae justo sobre las cuencas
      dome.scale.set(s.x*0.62, a, s.z*0.64);                           // 24% de margen sobre la media caja del cráneo
      const kz = hB.min.z - s.z*0.10, ky = hB.min.y + s.y*0.52;        // nuca
      mesh(new THREE.BoxGeometry(s.x*0.26, s.y*0.20, s.z*0.16), M('red'), headB, c.x, ky, kz);            // nudo
      const t1 = mesh(new THREE.BoxGeometry(s.x*0.12, s.y*0.42, s.z*0.05), M('red2'), headB, c.x+s.x*0.10, ky-s.y*0.24, kz-s.z*0.02);
      t1.rotation.set(0.35, 0, 0.45);                                                                     // cola 1
      const t2 = mesh(new THREE.BoxGeometry(s.x*0.10, s.y*0.34, s.z*0.05), M('red2'), headB, c.x-s.x*0.07, ky-s.y*0.20, kz);
      t2.rotation.set(0.15, 0, -0.55);                                                                    // cola 2
    }

    /* — CAMISETA (Spine1): franjas cilíndricas sobre la CAJA REAL del torso (ribs = Spine1+Spine2) — */
    const sp1 = bone(/spine1$/i) || bone(/spine$/i), s1B = bb(/spine1$/i), s2B = bb(/spine2$/i);
    if(sp1 && s1B){
      const T = s1B.clone(); if(s2B){ /* caja de Spine2 vive en OTRO espacio local; misma orientación y casi mismo origen → unión aproximada vía tamaños */
        T.min.x=Math.min(T.min.x,s2B.min.x); T.max.x=Math.max(T.max.x,s2B.max.x);
        T.min.z=Math.min(T.min.z,s2B.min.z); T.max.z=Math.max(T.max.z,s2B.max.z);
        T.max.y=Math.max(T.max.y,s2B.max.y+ (bone(/spine2$/i)? bone(/spine2$/i).position.y : 0)); }
      const {c,s} = box(T);
      const rx = s.x*0.60, rz = s.z*0.62;                              // 20% de margen sobre las costillas
      const topY = T.max.y*0.98, botY = T.min.y - s.y*0.10, H = topY-botY, N = 6, sh = H/N;
      for(let i=0;i<N;i++){
        const st = mesh(new THREE.CylinderGeometry(0.95, 1, 1, 9), M(i%2 ? 'white' : 'red2'), sp1, c.x, topY - sh*(i+0.5), c.z);
        st.scale.set(rx*(1 - i*0.01), sh*1.03, rz);
      }
      for(const re of [/leftarm$/i, /rightarm$/i]){ const arm=bone(re), aB=bb(re); if(!arm||!aB) continue;
        const {c:ac, s:as} = box(aB);                                  // manga corta sobre el húmero real (hueso Arm apunta codo=+Y)
        const rA = Math.max(as.x, as.z)*0.70, lA = as.y*0.42;
        mesh(new THREE.CylinderGeometry(rA*0.92, rA, lA, 8), M('red2'),  arm, ac.x, aB.min.y + as.y*0.20, ac.z);
        mesh(new THREE.CylinderGeometry(rA*0.86, rA*0.94, lA*0.8, 8), M('white'), arm, ac.x, aB.min.y + as.y*0.50, ac.z);
      }
    }

    /* — PANTALÓN (Hips + UpLeg): cajas REALES de pelvis y muslo con margen → el hueso nunca asoma — */
    const hips = bone(/hips$/i), pB = bb(/hips$/i);
    if(hips && pB){ const {c,s} = box(pB);
      const ps = s.clone();                                            // talla de la pelvis → manda en TODO el pantalón (holgado, como la referencia; el fémur es un palillo y no sirve de talla)
      mesh(new THREE.BoxGeometry(ps.x*1.18, ps.y*1.10, ps.z*1.24), M('brown'), hips, c.x, c.y - ps.y*0.06, c.z);   // pelvis
      mesh(new THREE.BoxGeometry(ps.x*1.24, ps.y*0.34, ps.z*1.30), M('belt'),  hips, c.x, pB.max.y - ps.y*0.10, c.z); // cinturón
      for(const re of [/leftupleg$/i, /rightupleg$/i]){ const up=bone(re), knee=bone(re.source.indexOf('left')===0?/leftleg$/i:/rightleg$/i);
        if(!up||!knee) continue;
        const kl = up.worldToLocal(knee.getWorldPosition(new THREE.Vector3()));
        const L = Math.max(1e-3, Math.abs(kl.y)), dir = kl.y>=0 ? 1 : -1;   // fémur: largo y hacia dónde cae la rodilla en el espacio del hueso
        const p = mesh(new THREE.BoxGeometry(ps.x*0.56, L*0.52, ps.z*1.10), M('brown'), up, 0, dir*L*0.28, 0);   // pernera HOLGADA (ancho de media pelvis)
        if(re.source.indexOf('right')===0)                                                                       // remiendo delantero
          mesh(new THREE.BoxGeometry(ps.x*0.30, L*0.18, ps.z*0.14), M('patch'), up, 0, dir*L*0.34, ps.z*0.56);
      }
    }
  };
})();
