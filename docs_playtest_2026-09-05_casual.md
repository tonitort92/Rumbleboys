# INFORME PLAYTEST CIEGO — perfil CASUAL (Fall Guys / Mario Party / Smash de viernes)

Sesión de ~27 min, 65 pasos de cola. Ventana del navegador de 936×548 px de área útil. Capturas en `pt_casual/q/*.png`.

## Qué creo que es este juego

Un party game 3D de "islas flotantes" donde corres, saltas y te pegas con muñecos tipo voxel (bárbaro, arquera, mago…) mientras salen goblins, y gana el que más puntos suma en 16 mundos con un jefe al final de cada uno. Me recuerda a Fall Guys mezclado con Smash por el porcentaje de daño y por salir volando al agua.

## Cronología

- **min 0** → Portada (`01_ver.png`). "Vence las oleadas de los 16 mundos. Queda el primero y desbloquea los trofeos" + 4 chips (Gana por puntos / Trofeos / Colabora o trolea / Online). Se entiende en 5 segundos qué va a ser. Bien.
- **min 1** → Clic en la portada → pantalla principal (`02_click_start.png`) con un tour de 8 pasos. Lo hice entero (`05_tour_sig.png`, `12_ver.png`): personaje, golpes, ruta, ficha del mundo, gira/arena, carril, y el último dice "Gana el que MÁS PUNTOS suma… tumbar rivales es lo que más da". Sí entendí cómo se gana antes de jugar.
- **min 4** → Cierro el tour y busco el botón de JUGAR. **No está en pantalla** (`19_ver.png`): la pantalla principal queda cortada por abajo (se ven las fichas de golpes a medias) y no hace scroll. Probé Enter (nada), la estrella "1" de la ruta (nada), Ctrl+- para hacer zoom (nada), Tab (el foco no se mueve). **4 intentos y 3 minutos sin poder jugar la partida de verdad.**
- **min 7** → Como no encuentro JUGAR, pulso "ENTRENAR ESTE MUNDO" (el único botón grande visible). Sale "Elige tu personaje" (`26_entrenar.png`), también cortado por abajo pero con scroll. Pestaña TECLADO+RATÓN clara (`28_teclado.png`). Miro 3 personajes y elijo ARQUERA (`30_nextchar.png`). Pantalla de carga con consejo de la tienda (`31_empezar.png`). **Clics hasta estar jugando: ~14 (8 del tour + 6), o ~5 si te saltas el tour.**
- **min 9** → Estoy en el prado (`33_ingame.png`). Muñeca dorada sobre hierba, flecha verde arriba, fichas de golpes abajo y marcador "1 · ARQUERA · 7 · 24% · ⏫2 · 🪙0 · ♥♥♥♥". Ando con WASD, salto con Espacio, disparo con clic: responde al instante, salto doble agradable.
- **min 10** → Corro hacia la flecha y me caigo al agua: "¡TE HAN SACADO!" a pantalla completa (`36_play2.png`) aunque nadie me tocó. Reaparezco a los 2 s (`38_respawn.png`). Los puntos siguen subiendo (+20, +20…) sin que yo sepa muy bien por qué.
- **min 11** → El % pasa a 101% en rojo (`39_play3.png`): entonces entiendo que es daño tipo Smash. Pulso H (Cura) y baja a 0%. Aparece un goblin saltando (`41_play4.png`), le doy: "¡PUNTERÍA! +20". Cojo 3 plátanos 🍌 que salen a la derecha del HUD… y desaparecen sin que sepa cómo usarlos.
- **min 13** → F "Ráfaga 360" → "¡RÁFAGA DE FLECHAS! +40" (`43_fight.png`). Clic derecho para agarrar al goblin naranja de al lado (`47_left.png`): no noté que agarrara nada. T escudo y R lluvia sin efecto visible para mí.
- **min 16** → Sigo la flecha verde y acabo otra vez en el borde del agua o en el aire (`51_run.png`, `53_run2.png`); en la segunda captura no encuentro a mi personaje.
- **min 19** → ESC: menú de ENTRENAMIENTO (`55_esc.png`): "Practica sin que te eliminen", minions (sin / 1 / oleada pequeña / grande) y personaje. Claro y bonito. Aquí caigo en que llevo 10 min en modo práctica con 1 minion, sin rivales ni jefe.
- **min 22** → "Menú principal" → vuelvo al home (`64_home.png`), JUGAR sigue fuera de pantalla. Fin: **no llegué al jefe ni al mundo 2 porque no pude empezar la partida real.** 333 puntos, solo en el marcador.

## Lo que me atascó

1. **El botón JUGAR no se ve** en una ventana de 548 px de alto: está en y≈651 y la página no tiene scroll ni se adapta. 4 intentos (Enter, estrella del mundo 1, zoom del navegador, Tab) y acabé en el modo práctica por descarte. Es el bloqueante número uno: un casual cierra la pestaña aquí. (`19_ver.png`, `21_enter.png`, `22_star1.png`)
2. **Modo práctica sin rivales ni jefe** y nada me avisó en pantalla de que "esto no es la partida": la letra pequeña "ENTRENAMIENTO · ESC para opciones" pasa desapercibida. Me tiré 10 min pensando que jugaba de verdad y preguntándome por qué solo había un nombre en el marcador.
3. **"¡TE HAN SACADO!" cuando me caigo solo al agua** (`36_play2.png`): el texto dice que alguien me sacó y no había nadie. Me confunde sobre las reglas (¿me quitó puntos? ¿me quitó una vida? no lo sé).
4. **La flecha verde** de arriba me llevó dos veces a un borde de agua o a saltar al vacío (`36_play2.png`, `51_run.png`). No sé si señala "camino" o "dirección general".
5. **Los plátanos**: los cogí (🍌3 en el HUD, `41_play4.png`) y desaparecieron. Ninguna tecla de la pantalla dice "usar objeto".
6. **Agarrar (clic derecho)**: 3 intentos junto a goblins y no vi ni animación ni texto.
7. **Perder de vista a mi personaje** (`53_run2.png`): con el efecto de la lluvia de flechas y la cámara lejana no supe dónde estaba.
8. Menor: en el home el nombre del personaje queda tapado por el panel de LOGROS (`19_ver.png`) y el tour mueve el botón SIGUIENTE de sitio en cada paso.

## Lo que me gustó

- El arte: colorido, voxel limpio, el prado con islas y agua es bonito y se lee bien (`33_ingame.png`, `38_respawn.png`).
- La portada explica el juego en una frase y el último paso del tour dice claramente cómo se gana (más puntos, tumbar rivales).
- Los controles responden bien: correr, salto doble, disparar y la ráfaga se sienten inmediatos; los "+20 ¡PUNTERÍA!" y "+40 ¡RÁFAGA!" dan gustito.
- La pantalla de elegir personaje: bueno/flojo de cada uno y el mapa de teclas al lado, sin manual.
- El menú de ENTRENAMIENTO es sencillo y permite cambiar personaje y cantidad de enemigos sin salir.

## Lo que cambiaría (por importancia)

1. **JUGAR siempre visible**: botón grande fijo en pantalla o layout que escale al alto de la ventana; y que Enter/Espacio en el home lance la partida.
2. **Que el modo práctica lo diga a gritos**: cartel "ENTRENAMIENTO — sin rivales ni trofeos" grande al entrar y un botón "IR A LA PARTIDA REAL" en el ESC.
3. **Feedback de muerte honesto**: si me caigo, "¡AL AGUA!"; si me pegan, "¡TE HAN SACADO!"; y decir qué pierdo (puntos, vida, tiempo).
4. **Objetos**: mostrar la tecla de usar al lado del icono y qué hace (plátano = ¿tirar al suelo?).
5. **Marcador entendible**: explicar el % (daño), el ⏫ (¿saltos?) y de dónde salen los +20 que caen solos; y resaltar más a mi personaje (flecha o aro más gordo) cuando la cámara se aleja.

## Notas de 0 a 10

- Arte: **7**
- Claridad del objetivo: **6** (la portada y el tour lo explican; en la partida se pierde)
- Diversión: **5** (en práctica solo, con un goblin, se queda corto; el combate promete)
- Ganas de volver: **4** (quiero probar la partida real, pero hoy no pude)
- Sensación de los controles (feel): **7**
- **GLOBAL HOY: 4,5**
- **POTENCIAL: 7,5**

## ¿Lo jugarías un viernes con colegas?

**Condicionado**: sí si arreglan que se pueda empezar la partida real a la primera y se entiende qué pasa cuando mueres; tal como lo he jugado hoy, con colegas nos habríamos quedado mirando el home buscando el botón de JUGAR.
