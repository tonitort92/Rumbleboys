# DISEÑO: progresión, nivel y economía (cerrado con Toni el 01/09/2026)

Decisiones de diseño tomadas en conversación. Esto NO está implementado: es la referencia para
cuando se implemente (después de cerrar el 4b de la alfa). El punto 4 (victoria/showdown/coronas)
está aprobado en concepto pero SIN cerrar los detalles — no se anota aquí todavía.

## 1. Nivel dentro del mundo

- La exp SON los puntos: matar minions da puntos, los puntos suben el nivel.
- **El nivel se resetea al cambiar de mundo** (no por oleada). Cada mundo es un arco completo:
  oleadas para subir nivel → llegas al boss con el kit entero → boss → reset al siguiente mundo.
  Con 16 mundos, un nivel persistente de run estaría al máximo en el mundo 3; por mundo cada
  mundo tiene progresión propia y todos empiezan iguales.
- Umbrales pocos y con premio tangible, referencia inicial:
  - Nivel 2 → segundo ataque
  - Nivel 3 → pasiva de mejora (velocidad, cadencia, corazón extra...)
  - Nivel 4 → el ataque gordo / especial
- Al subir también caen **pasivas de mejora** (velocidad, cadencia, etc.), aparte de lo que
  pilles de objetos por el suelo.
- El level-up debe ser un fogonazo: flash, sonido, icono del ataque nuevo en grande. El momento
  es la gracia del sistema.
- Nada de "+3% de daño": cada nivel da algo que se SIENTE.

## 2. Minions: explotan y sueltan monedas

- Matar un minion da: **exp inmediata** (puntos) + **monedas físicas** que saltan de la explosión.
- Valor de las monedas según el minion muerto.
- Las monedas **se desvanecen** si no las coges y **te las pueden robar otros jugadores** —
  sabotaje visible (matarte el minion gordo o birlarte las monedas encaja con el pitch).

## 3. Economía de tres capas

- **Puntos** = exp del nivel + records. Motor durante el mundo. Ya no compran nada.
- **Monedas** = compras DENTRO de la run: la tienda entre stages (la actual) vende
  **permanentes de run** que se pierden al acabar la run.
- **Tienda de la home** = pequeñas mejoras permanentes al personaje: ataques nuevos a elegir,
  arma nueva y super R. Decisión de Toni: da un poco de ventaja por llevar más tiempo jugando,
  pero solo un poco — vigilar que se quede en "un poco".
- **Loadout**: los ataques son un set fijo; con lo comprado en la home, antes de empezar la run
  eliges qué ataques llevas. Los desbloqueos por nivel dentro del mundo van sobre ese loadout.

## Pendiente

- **Punto 4 (victoria)**: showdown tras el boss + coronas por mundo, aprobado en concepto,
  detalles en debate. Se anotará aquí cuando se cierre.
- **Punto 5 (bosses)**: se quedan los actuales tal cual; se trabajarán en el futuro.
- **Reauditar TODOS los objetos** y crear nuevos en base a estas decisiones (los objetos ahora
  conviven con pasivas de nivel y monedas: revisar solapes y huecos).
