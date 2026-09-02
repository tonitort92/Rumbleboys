# PLAN NIVELES V2 — rediseño del sistema de nivel y builds (02/09/2026)

Redactado con Toni tras jugar la primera versión de la progresión. SUSTITUYE al §1 de
DISENO_PROGRESION.md (el resto — monedas, economía de 3 capas, medallas, showdown — sigue igual).
Estado: **APROBADO por Toni el 02/09/2026** («implementa todo lo hablado») — en implementación
por hitos H1-H6; la sesión 7f implementa, la a9 verifica y publica.

## 1. Qué se tira de lo implementado y por qué

El desbloqueo de ataques en 4 niveles (B1) se sentía mal jugado: el juego es rápido desde el
segundo 1 y llegar "capado" no encaja. Se sustituye por: **botones con desbloqueo fijo temprano +
20 niveles de ELECCIONES que construyen tu build del mundo**.

## 2. Botones (esqueleto, fijo, igual para todos)

- **Siempre disponibles**: agarrar, dash y salto. La movilidad NO se toca nunca (los mundos son
  plataformeo calibrado al alcance real del salto).
- **Desde nivel 1**: ataque básico + Q + E. Nunca empiezas capado.
- **Desbloqueos fijos por nivel** (sin elección, con fogonazo del botón en grande):
  nivel 4 → escudo · nivel 8 → cuarto ataque · nivel 14 → la R (especial).
  (Números iniciales; se calibran en el punto 7.)
- Legibilidad a lo LoL: todos saben qué botones tiene un jugador de nivel 14.

## 3. Los 20 niveles: elecciones sin pausa (decisión de Toni: 20, no 10 — más riqueza)

- Cada subida que no trae botón fijo ofrece **2 cartas** en pantalla ~5 s, **sin parar el juego**:
  teclado **1 / 2**, mando **cruceta izquierda / derecha**. Si no eliges, autoelige la primera.
- La pareja es SIEMPRE **mejora de un ataque tuyo VS boost de stat** (nunca dos stats):
  - Mejoras de ataque: "Q más ancha", "E dispara 2", "escudo refleja", "R carga más rápido"…
  - Boosts de stat: +cadencia, +daño, +corazón, +velocidad (solo dentro del clamp 1,8).
- **Candados de equilibrio**: la misma carta máx **2 veces por mundo**; salto/dash jamás aparecen;
  las ofertas no repiten una carta ya al tope.
- **Automático al subir**: cura de corazones + el fogonazo. NADA más (cero +% ocultos).
- El nivel se sigue **reseteando por mundo**: un build vive un mundo y muere en el boss. 20
  elecciones por mundo = el sabor Megabonk sin su pausa.

## 4. Reparto de fuentes (regla dura anti-choques)

- **Nivel** = todo lo permanente del mundo (build).
- **Objetos del suelo** = SOLO temporal o de un uso (arcoíris, imán, escudo 10 s, arma 15 s,
  bomba…). Si algo existe como carta, no existe como objeto permanente; misma stat solo con
  cronómetro. (La cápsula de velocidad ya se quitó por esto.)
- **Monedas** = tienda de run entre mundos, sin tocar nada de lo anterior.

## 5. HUD a lo LoL

- Fichas de los jugadores ABAJO.
- Atajos/botones a la IZQUIERDA en horizontal (legible), con los bloqueados en gris y su nivel
  de desbloqueo; las cartas de elección aparecen junto a ellos.

## 6. Curva de experiencia (base medida, no inventada)

Un jugador medio acumula ~3.400 pts en un mundo completo (medido: 43,5 pts/minion medio, aforo
5→22 por CAOS, goteo 0,5/s). Los 20 umbrales se reparten sobre esa curva: subidas rápidas al
principio (cada ~10-15 s, para que el arranque ya tenga chicha) y más espaciadas hacia el boss.
Primer mundo de la run: la horda encogida hará todo ~1 nivel más lento — es el tutorial, vale.

## 7. Calibración "ni sobrado ni corto" (petición explícita de Toni)

Criterio de éxito, por este orden:
1. **Estático**: umbrales tales que jugando normal llegues al boss ~nivel 16-18 (la R a mitad de
   mundo); nivel 20 solo si lo bordas. Verificable con la curva medida antes de tocar código.
2. **Humo headless**: simular la matanza de un mundo entero y comprobar 20 subidas, ofertas
   legales (sin duplicados >2, sin movilidad) y que el DPS con build medio mata la horda de CAOS
   alto sin trivializarla.
3. **Playtest de Toni**: 2-3 mundos reales — ¿los bosses caen con build medio? ¿algún build rompe
   el juego? Ajustar números, no diseño.

## 8. Hitos de implementación (para la sesión 7f, en serie, humo por hito)

- H1: LEVEL_XP → 20 umbrales sobre la curva; reset por mundo igual que hoy.
- H2: desbloqueos fijos (4/8/14) sustituyendo las puertas actuales n2/n3/n4; fogonazo reciclado.
- H3: sistema de cartas — pool, reglas de oferta (ataque-vs-stat, tope ×2), input 1/2 + cruceta,
  autoelección a los 5 s, persistencia por mundo, viaje en snapshot online.
- H4: HUD LoL (fichas abajo + atajos horizontales izquierda + cartas).
- H5: purga de solapes con objetos del suelo según la regla del punto 4.
- H6: calibración medida (punto 7.1 y 7.2) + pasada de Toni (7.3).

## Interacciones que NO cambian

Medallas (umbrales de puntos), showdown y corona (la sombra ahora copia tu build), monedas y
tienda, minions que explotan. La calibración de medallas se revisará tras H6 (misma fuente de
puntos, umbrales quizá retocados).
