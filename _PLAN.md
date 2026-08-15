# RUMBLEBOYS · PLAN DE ACCIÓN

> El *porqué* de cada cosa vive en `_MASTERMIND.md`; la conversación en
> `_CHARLA_DISEÑO.md`. Esto es el *qué* y el *cuándo*. Orden pensado para:
> validar barato antes de invertir caro, y no abrir dos frentes en el fichero
> grande a la vez (hay otra sesión trabajando).

---

## FASE 0 · Modelo fijado ✅ (15/08/2026)
La convocatoria (16 fijos, muerte termina run, trofeos persisten), dos pantallas,
historia subordinada a la run. Hecho: `_MASTERMIND.md`.

## FASE 1 · La puerta (home) — edición, no rediseño ✅ (16/08, rama f1-home)
- [x] Titular → LA FRASE (versión sin píxeles hasta que exista la muerte-pixelación en F2).
- [x] JUGAR grande + ONLINE secundario pequeño. (La fusión real —buscar gente y
      rellenar con CPU— es trabajo de matchmaking, pendiente para más adelante.)
- [x] Selector de mapa oculto (lógica MAPSEL viva; renace en MUNDOS, F6).
- [x] Fuera: tira de 5 pasos, subtexto de reglas, tagline de géneros (ocultos, no borrados).
- [x] Dificultad/idioma tras engranaje ⚙. (Mando/roster siguen bajo el fold — revisar en F6.)
- [x] Copy: chip 0/10, "9 mundos" y "6 jugadores" fuera con sus bloques. i18n: 4 claves nuevas.

## FASE 2 · Game feel — el verbo que se repite mil veces ✅ (16/08, rama f1-home)
- [x] Hitstop — **ya existía bien afinado** (localHitstop en todo el combo, 60–165 ms
      escalando con stage/castigo/daño). No se tocó: primero jugarlo, luego retocar.
- [x] **Pixelación como muerte**: pixelate() — cubos casi uniformes por la silueta vía
      ►PARTINST. Sustituye a las volutas de fantasma en ko().
- [x] KO estelar: cine (dt×.35 + cámara) sobre el verdugo en KOs lanzados (vel>16).
- [x] Flash por peso: blanco <13 · ámbar 13–26 · rojo ≥26 de daño real, en applyHit.
      Sonido por peso **ya existía** (sfx.hit escala con daño). Whiff pendiente de
      comprobar jugando (sfx.swing suena al atacar; puede bastar).

## FASE 3 · La run como convocatoria
- [ ] Muerte termina la run · trofeos ganados persisten · reintento instantáneo
      (morir → pixelarte → carta → eslabón 1, cero menús).
- [ ] Caos 1 aislado → cintas confluyen (tutorial sin tutorial).
- [ ] **El muro = pared de pixelación** (el mundo deshaciéndose en cubos detrás).
      Demostración scriptada: un minion rezagado se lo come en los primeros 10 s.
- [ ] Legibilidad 3 capas: marcador "TÚ" 20 s + presentación al spawn · jugadores
      saturados con outline y nombre · minions desaturados, uniformes, sin outline.
- [ ] Cero minions los primeros 30 s; entran por goteo.
- [ ] Narrador primera run = las 3 frases del sofá ("Tú eres el bárbaro…").
- [ ] Llegada al jefe por la cinta (desaceleración, la arena entra; portal fuera).
- [ ] Escalada final: últimos eslabones más decisivos (suelo pixelándose, vueltas a
      caos 1 más cortas).
- [ ] Tienda: reloj 15 s, cinta de fondo, presenta verbos además de estadísticas.

## ⛳ HITO · Validar con humanos (después de 1–3)
- [ ] 3–4 personas por link, mirar sin hablar: ¿dónde se pierden? ¿piden otra run?
- [ ] Si no hay "va, otra" → arreglar antes de seguir. El plan se detiene aquí.

## FASE 4 · Historia por goteo (sin cinemáticas)
- [ ] Carta de convocatoria como intro (~10 s, saltable, es UI).
- [ ] Narrador entre stages con arco (heroico → grietas → sin disimulo).
- [ ] 3–4 variantes de carta + pool de líneas para runs repetidas (modelo Hades:
      el giro es para la primera vez; después es ritual).
- [ ] Revelación final in-engine: la cinta se para sola por primera vez.

## FASE 5 · Jefes
- [ ] Rotura de guardia por jefe (puerta de ejecución que el cheto no salta).
- [ ] Telegrafiar con color (tinte 0,5 s antes del imparable). 3 ataques y repetir.
- [ ] Jefe sin pausar la competición: los 4 siguen peleando; trofeo al último golpe.
- [ ] Fase 2 que se ve (cambio de aspecto, no solo números).

## FASE 6 · Pantalla MUNDOS (mapa Super Mario World)
- [ ] La ruta como camino, trofeos plantados encima, práctica offline de lo
      conquistado, marcas personales. Aquí vive lo desalojado de la home.

## FASE 7 · Delivery técnico (solo tras el hito ⛳)
- [ ] Repack a .glb comprimidos + carga por stage. Objetivo: jugable en <8 s
      (el prado primero, el resto en segundo plano durante el eslabón 1).

## FASE 8 · Capa social
- [ ] Clip de los últimos 5 s descargable (la moneda social).
- [ ] Run diaria con semilla · corona al líder · desbloqueos solo cosméticos.

---

**Regla del plan:** ninguna fase nueva se abre con la anterior a medias en el
fichero grande. Las mecánicas por mapa (lianas, arrojables) no entran hasta que
todo lo anterior exista.
