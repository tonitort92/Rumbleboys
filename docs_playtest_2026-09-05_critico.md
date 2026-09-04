# INFORME DE PLAYTEST CIEGO — perfil crítico

Condiciones: navegador real, ventana de **500×450 px** (el arnés anunciaba 960×640; el juego no se adaptó a lo que había). Sesión de ~27 min, 81 pasos de cola, 29 capturas en `pt_critic/q/`. Dos partidas completas en GIRA · SOLO · 3 CPUs · BÁRBARO.

## Qué es este juego

Party-brawler 3D por oleadas tipo "Fall Guys se cruza con Smash": cuatro luchadores en un prado flotante lleno de goblins compiten por PUNTOS (dañar, rematar, recoger, sobrevivir) mientras la arena avanza por una cinta y la dificultad ("CAOS") escala. El último en pie se queda el mundo, se enfrenta al jefe y gana el trofeo; una carrera de 16 mundos con tienda de mejoras entre medias.

## Cronología

| Min | Qué hice | Qué pasó | Captura |
|---|---|---|---|
| 0 | Miro la portada | Título, claim "VENCE LAS OLEADAS DE LOS 16 MUNDOS. QUEDA EL PRIMERO Y DESBLOQUEA LOS TROFEOS", 3 pastillas (puntos/trofeos/colabora o trolea), "pulsa cualquier botón". Comunica género y regla de victoria en 1 pantalla. Bien. | `01_ver.png` |
| 1 | Clic para entrar | Home muy densa: carril lateral de 7 iconos, personaje, 10 fichas de golpes con nombres de MANDO (X, B, Y, L3, RB, LT, DPAD) aunque juego con teclado, logros, ficha de mundo, ruta 1-16 y un tutorial de 8 pasos encima. En 500×450 el botón JUGAR queda en y=626, **fuera de pantalla**, y la ruta de mundos en x=-30 (fuera por la izquierda). | `02_enter.png` |
| 2-5 | Tutorial 1/8 → 8/8 | Textos claros ("Gana el que MÁS PUNTOS suma… tumbar rivales es lo que más da"). Pero mientras el tutorial está abierto la home sigue viva: un clic en JUGAR abrió el modal "¿Qué jugamos?" y el tutorial quedó **flotando encima de otro modal** (dos capas apiladas). | `14_shot.png` |
| 5-7 | JUGAR → GIRA → SOLO → 3 CPUs → personaje → TECLADO+RATÓN → EMPEZAR | **6 decisiones** antes de jugar. El selector de personaje explica pros/contras (bien), pero las flechas de cambiar luchador están en x=-54 y x=524 (fuera de la ventana) y el esquema de teclado es un dibujo de 4 px de letra, ilegible. EMPEZAR también fuera de pantalla: tuve que hacer scroll por código. Descubro aquí que "Agarrar (LT)" se llama "CLIC DCHO · EMPUJÓN" en el esquema de teclado. | `34_cpu3.png`, `36_kb.png` |
| 7 | Pantalla de carga | "MUNDO 1: PRADO DE LOS CHALADOS · QUEDA EL PRIMERO Y VENCE AL BOSS PARA EL TROFEO" + tip de puntos. Buena. ~8 s. | `38_empezar.png` |
| 8 | Primer frame jugable | Estoy en el prado, flecha verde señalando "hacia dónde va la cinta", goblin al lado, "¡TE HAN VISTO!". Mi personaje mide ~40 px. Antes de tocar una tecla el marcador ya va Caballero 109 – yo 9. | `40_wait.png` |
| 8-9 | D + J×4, luego carta de nivel (1) y correr a la izquierda + salto + J | Chispas rojas al pegar, monedas, "CAOS 2… CAOS 3". Sube mi % (18% → 311%) sin que entienda qué es ese porcentaje ni de dónde viene el daño. Las cartas de nivel ("PISOTÓN SÍSMICO / +EMPUJE", 10 s) aparecen encima del combate. Marcador: yo 70 – Samurái 1296. | `42_pega.png`, `44_carta.png`, `45_corre.png` |
| 10 | D + J×2 + E (pisotón) + Q (hacha) | **"¡FUERA!" a los ~120 s de juego**: MODO ESPECTADOR con "TERMINAR PARTIDA". No vi quién me sacó ni de qué. El popup "+150" morado del CPU tapa media pantalla. | `47_pisoton.png`, `48_hacha.png` |
| 10-11 | Espero 15 s como espectador | El Samurái CPU pasa de 2722 a 4747 puntos; cámara pegada al suelo entre hojas, popups "+1", "+20", monedas gigantes, velo morado. Ilegible. Ningún jefe aparece. | `50_espera.png` |
| 12 | TERMINAR PARTIDA (el 1er intento por DOM falló; 2º por coordenadas) | Resultados: **4º de 4 · 85 pts · nota D- · Daño 0 · Muertes 4 · 120 s** vs CPU1 10248 pts S+. Y arriba, en dorado: "¡NUEVO RÉCORD! · 85 puntos". | `55_terminar.png`, `57_scrollup.png` |
| 13 | REVANCHA | Recarga limpia, cartel del mundo "PRADO DE LOS CHALADOS" bien presentado. Un "¡GAME!" y un "ANCLA" residuales en el texto del HUD. | `58_revancha.png` |
| 14-15 | Clic izq ×3, clic dcho (agarre), T (escudo) mantenido | Ahora sí veo impactos (chispas) y "¡SANGRADO!". El clic derecho no produjo nada visible sobre el Samurái a 1 m; con T mantenido no aparece ningún escudo en el personaje ni cambia el icono del HUD. Mi % sube a 202% en 20 s. "¡AIDO!" recortado en pantalla. | `60_clicks.png`, `62_agarre.png`, `63_escudo.png` |
| 16-18 | Tres tandas de combate (clics + Q + E + F + R, moviéndome) | Subo a 204 pts y nivel 3; "¡TE HAN SACADO!" (una vida). Cartas de nivel "Q VELOZ / +VELOCIDAD" tapadas por "+40", "+35", "¡CAOS NIVEL 4!", "¡COMBO x2!" a la vez. No veo a mi personaje bajo las cartas. | `66_pelea.png`, `68_pelea2.png` |
| 19 | Otra tanda | **Segunda eliminación a los ~120 s**: espectador otra vez. CPU Caballero nivel 12→17, 3536 pts. | `70_pelea3.png` |
| 20 | Espero 25 s | Ningún jefe. La ronda no termina mientras queden CPUs. Termino. Resultados: 4º · 215 pts · D- · Daño 15 · Muertes 4. | — |
| 22 | OBJETOS Y MEJORAS | Ficha larga y bien escrita (cápsulas, armas, súper doradas, estrella, tienda con precios, mejoras de clase) con iconos 3D grandes. Buena referencia… que no pude cruzar con nada porque en partida no me llegó ningún objeto reconocible. | `78_objetos.png` |

## Bloqueantes

1. **El jugador humano es eliminado en ~2 minutos en las dos partidas, sin ver por qué, y la ronda continúa 4+ minutos con CPUs jugando solas.** Reproducción: GIRA → SOLO → 3 CPUs → Bárbaro → jugar normal (moverse, pegar). Resultado en ambas: "Muertes 4", 4º de 4, nota D-, 120 s de tiempo frente a 228-241 s de los CPUs. Nunca llegué al jefe del mundo 1. Si un probador atento no sobrevive dos veces seguidas, el 90 % del contenido (jefe, mundo 2, tienda) es inalcanzable para quien pruebe la alfa. (`47_pisoton.png`, `55_terminar.png`)
2. **Los CPUs multiplican por 10-100 la puntuación del humano** (10248 vs 85; 5633 vs 215) y llegan a nivel 17 mientras yo estoy en el 3. No es dificultad: es que la carrera por puntos está decidida a los 30 s (Caballero 109 – yo 9 antes de mi primera tecla, `41_txt.out`). El pitch "queda el primero" no se puede cumplir.
3. **La interfaz no cabe en la ventana**: JUGAR (y=626), EMPEZAR (y=517), flechas de personaje (x=-54/524) y la ruta de mundos (x=-30) quedan fuera de un viewport de 500×450. Sin trucos de scroll, un jugador no puede ni empezar la partida. Reproducción: abrir en una ventana pequeña o en un portátil con zoom del sistema. (`02_enter.png`, `34_cpu3.png`)
4. **Modales apilables**: con el tutorial abierto se puede pulsar JUGAR y quedan dos capas de diálogo (`14_shot.png`). Menor, pero rompe el onboarding justo en el primer minuto.

## Diseño: lo que funciona

1. **Propuesta clara en portada y carga**: "queda el primero, vence al boss, gana el trofeo" se repite en portada, tutorial 8/8, pantalla de carga y banner de objetivo. Sé qué se premia antes de jugar (`01_ver.png`, `38_empezar.png`).
2. **Dirección de arte coherente y simpática**: low-poly con contorno, prado flotante, personajes con silueta distinta (bárbaro rojo, samurái morado), cartel del mundo con tipografía de juguete. La pantalla de resultados con el ganador en 3D gira bien (`57_scrollup.png`, `58_revancha.png`).
3. **Selector de personaje con "Bueno / Flojo"** en una línea cada uno: te dice de verdad en qué eres distinto (`34_cpu3.png`).
4. **Ficha de OBJETOS Y MEJORAS** completa, con números concretos (+12 % daño, 30 usos de arco, 3600 pts la vida extra) e iconos 3D grandes: es la mejor pieza de UX del juego (`78_objetos.png`).
5. **Los golpes tienen feedback inmediato** cuando conectan (chispas rojas, "¡SANGRADO!", "+20") y las cartas de nivel con temporizador son una idea de roguelite ligera que encaja con un party game (`60_clicks.png`, `44_carta.png`).

## Diseño: lo que falla

1. **No sé por qué muero.** En 4 minutos jugados acumulé 8 muertes y solo una vez vi un aviso ("¡TE HAN SACADO!"). El % de daño (18 % → 311 %) no se explica en ningún sitio, no hay barra de vida visible en el personaje, no hay flash/cámara al recibir el golpe letal, ni un "eliminado por X". Evidencia: `47_pisoton.png` ("¡FUERA!" sin más), resultados con Muertes 4 en las dos partidas. Sin esa información no puedo aprender ni mejorar: la curva no existe.
2. **La puntuación es ilegible y está desequilibrada.** El HUD escupe "+20 +20 +40 +1🪙 +150" en catarata (16 popups en el texto de cada lectura) y en la partida ganan 10248 pts frente a mis 85 haciendo lo mismo que yo. La tabla final desmenuza la EXP (minions ×20, bajas ×150…), pero eso llega tarde: en directo no sé si el "+150" es una baja mía o del CPU, y el "¡NUEVO RÉCORD! · 85 puntos" en dorado tras quedar último con D- es una contradicción de tono (`57_scrollup.png`).
3. **Ruido visual sobre un personaje de 40 px.** La cámara está tan lejos que mi luchador ocupa el 9 % de la altura de pantalla, y encima se apilan: "¡CAOS NIVEL 6!" a pantalla completa, "+35", "+20", "¡COMBO x2!", dos cartas de nivel, la flecha verde y la barra de nivel. En `68_pelea2.png` no se ve dónde estoy. En espectador es peor (`50_espera.png`: velo morado, monedas gigantes, "+1" de 80 px).
4. **Habilidades sin retorno perceptible.** T (escudo) mantenido 600 ms: nada visible en el personaje ni en el icono (`63_escudo.png`). Clic derecho (agarre/empujón) junto a un rival: nada (`62_agarre.png`). Q (hacha) y E (pisotón) sí hacen algo, pero con la cámara a esa distancia no distingo un pisotón de un martillazo. Además el mismo botón se llama "Agarrar" en el HUD y "EMPUJÓN" en el esquema de teclado; y la home me enseña los golpes con botones de MANDO (X, B, Y, L3, RB, LT, DPAD) cuando el juego ha detectado teclado.
5. **Onboarding largo y frágil.** 6 decisiones (JUGAR, GIRA, SOLO, nº CPUs, personaje, dispositivo) y un tutorial de 8 pasos antes del primer golpe; el tutorial coexiste con la home activa (modales apilados, `14_shot.png`); el esquema de teclas es ilegible (`36_kb.png`); y la primera pantalla jugable te suelta al lado de un goblin con "¡TE HAN VISTO!" antes de que sepas dónde estás (`40_wait.png`). Un party game de viernes necesita 2 clics hasta jugar y un primer mundo donde sobrevivas 5 minutos aunque no toques nada.

Extra menor: textos recortados ("¡AIDO!" en `62_agarre.png`), residuos "¡GAME!" y "ANCLA" en el HUD al empezar la revancha (`59_txt.out`), el botón TERMINAR PARTIDA no responde al primer clic por DOM (2 intentos).

## Notas de 0 a 10

| Apartado | Nota | Por qué |
|---|---|---|
| Arte | 7 | Estilo coherente, colorido y legible en quieto; sufre por la cámara lejana y los popups |
| Onboarding | 4 | Buen texto, mala ejecución: 6 decisiones, tutorial de 8 pasos, UI fuera de pantalla, mando en vez de teclado |
| Feel del combate | 4 | Los golpes conectan con chispas y hay peso al ser lanzado, pero no percibo hitstop, ni escudo, ni agarre, ni por qué muero |
| Legibilidad de la puntuación | 2 | Catarata de +20 sin dueño; 85 vs 10248; "nuevo récord" al quedar último |
| Diseño competitivo (sabotaje/rivalidad) | 3 | "Colabora o trolea" y "¡ROBO!" prometen; en la práctica los CPUs juegan su partida y a mí me sacan sin que lo vea |
| Objetos | 5 | La ficha es excelente; en 4 minutos de partida no reconocí ninguno en mi personaje ni supe qué cogí ("+CADENCIA x1", "+SALTO x1" solo como texto) |
| Jefe | — (0 evaluable) | No llegué en dos partidas; el mundo 1 no me dejó verlo |
| Meta (tienda/progresión) | 5 | Ruta de 16 mundos, logros, tienda con precios claros: existe y se entiende, pero está a 4 minutos de supervivencia que hoy no se consiguen |
| **GLOBAL HOY** | **4** | |
| **POTENCIAL** | **7,5** | El marco (oleadas + puntos + jefe + cartas + tienda) es sólido y el arte acompaña; falta legibilidad y equilibrio, no ideas |

## Veredicto en una frase

Hoy no lo publicaría ni como alfa cerrada: un probador que muere 8 veces en 4 minutos sin saber por qué, pierde 85 a 10248 y no llega al jefe del mundo 1 abandonará antes de ver lo bueno que hay detrás; arregla que el humano sobreviva y entienda el marcador y este mismo juego pasa a ser recomendable.
