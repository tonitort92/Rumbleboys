# CHARLA DE DISEÑO — Toni & Claude

> **El núcleo fijado vive en `_MASTERMIND.md`** — toda decisión se contrasta contra él.
> Este fichero es el cuaderno de conversación que lo alimenta.

> **Esto NO es una spec y no se implementa desde aquí.** Es el cuaderno de la conversación:
> lo que pensamos del juego a nivel humano, para poder retomarlo días después sin
> empezar de cero. Ninguna sesión debe leer esto como instrucciones de trabajo.
> Cuando algo de aquí se decide de verdad, se convierte en tarea aparte.

---

## Estado (14/08/2026)

Lo que Toni siente jugándolo, con +300 partidas:

- **Es trepidante.** En caos 4 ya estás repartiendo y corriendo, y con CPU cuesta.
- Los stages y los minijuegos **le gustan**. Los ataques "no están mal".
- Se lo pasa entero **sin problema** cuando se lo toma en serio (no es que no se pueda:
  es que la run es larga y normalmente no va a por ello).

Lo que le chirría:

- Confusión al empezar. Él lo defiende: los formatos nuevos no se entienden mirándolos
  (Fortnite, LoL). Contraargumento: Fall Guys **sí** se entendía mirándolo, y RUMBLEBOYS
  se distribuye como Fall Guys (un link, sin nadie al lado explicándolo).
- Caos visual en la salida — probablemente el mismo problema: se empieza ya a caos alto.
- Los **portales** para jefes y cambios de stage frenan en seco. Pero tampoco quiere al
  jefe en mitad de la cinta.
- Mecánicas de jefe raras, o muy fáciles si vas cheto del run. Aún no hay roturas de
  guardia especiales por jefe.
- Los ataques no le parecen suficiente **gustosos ni claros**.
- Le faltarían mecánicas por mapa (lianas, arrojables), pero sabe que solo tienen sentido
  si hay tempos claros para atacar.
- Duda de fondo: **¿simplificar mecánicas?** A él le funcionan y las usa bien, pero hay
  mucho que aprender — ataques, especial, agarres, tienda, jefes, objetos recogibles.

---

## Primera lectura (Claude, leyendo el código — sin haber jugado)

**Lo que está muy bien**

- **La cinta es una idea de arcade de las buenas.** Quitarle al jugador la responsabilidad de
  avanzar y dejarle solo pelear y sobrevivir es una decisión limpia, y es lo que hace que 16
  eslabones seguidos no se sientan como una caminata.
- **La RUTA unificada es lo mejor que se ha hecho últimamente**, aunque el commit parezca
  fontanería. Cambiar de **verbo** cada 3 pantallas es lo que evita que la novena pelea sepa
  igual que la tercera. Los minijuegos no son relleno: son el respiro que hace que el combate
  vuelva a saber a algo.
- **Está afinado a mano, jugándolo.** Medio fichero son comentarios que empiezan por "queja de
  Toni" o "idea de Toni". Es un juego diseñado por alguien que lo juega de verdad, no en un
  documento. Se nota en el puñetazo brutal cargado, la ruptura de guardia del jefe, un perfil
  de IA por clase. Eso es profundidad real y no se puede fingir.

**Lo que preocupa, por orden**

1. **La entrada.** ~95 MB de base64 parseándose en el hilo principal antes de que nadie vea
   nada. Este es *el* problema. Un juego así se juega porque alguien te pasa un link — y ese
   alguien te da 8 segundos. Todo lo demás importa cero si el jugador no llega. Ya está en el
   plan (reempaquetar a `.glb` con carga por stage) y va por delante de cualquier mundo nuevo.
2. **Diez mundos hechos a mano, no diez instancias de un sistema.** Cada stage tiene su luz, su
   arena, su jefe, sus peligros, su decorado. Como jugador es un lujo; como autor es una
   trampa: cada arreglo son diez arreglos. Los últimos commits lo dicen a gritos —
   estructuras que viajaban entre stages, `S6_BELT_MUL` contaminando el resto de la ruta. No
   está mal escrito: es que el juego ya es más grande de lo que un fichero sostiene sin
   morder. El 6 y el 9 dormidos son la misma señal.
3. **Si el combate aguanta diez jefes.** Es la pregunta que no se responde leyendo, y es la
   única que decide si el juego es bueno. Si la respuesta es "aguanta seis", no se arregla con
   un mundo 11 — se arregla dándole al jugador una decisión nueva a mitad de run.

*(Nota: en esa primera lectura se dijo que "si el autor no se lo pasa, nadie se lo pasa".
Corregido después por Toni: sí se lo pasa entero cuando se lo toma en serio. El problema no
es que no se pueda acabar, es que la run es larga — y eso es un problema de delivery, que es
justo el hilo que sigue abajo.)*

---

## Los 6 puntos, en orden de lo que movería primero

1. **Hitstop e impacto.** Congelar 60–100 ms al conectar (más en el brutal), flinch y flash
   legibles en quien recibe, arco de empuje distinto según peso del golpe, un sonido por
   peso y no uno genérico. Es el verbo que el jugador repite mil veces por run.

2. **Ventanas de ataque.** El ritmo de un brawler es amenaza → ventana → recompensa. Si en
   caos 4 no hay ventana nunca, el jugador no pega: machaca. Y machacando ningún golpe es
   gustoso, por bien animado que esté. **(1) y (2) son la misma queja.** Un golpe se siente
   bien por el silencio que lo rodea, no por la animación.

3. **Caos 1 aislado + encuentro.** Idea de Toni y es buena. ~40 s donde cada jugador
   aprende cinta, salto y un golpe sin nadie encima. Luego las cintas **confluyen**
   visualmente en una y el encuentro es un momento dramático, no "por fin empieza el
   juego". Tutorial sin tutorial, y de paso mata el caos visual de la salida.

4. **Rotura de guardia por jefe.** Subir vida es la solución barata y sienta a esponja de
   balas. Lo que arregla el "muy fácil si vas cheto" es una **puerta de ejecución** que no
   se salta con estadísticas: si no la haces, no pasas. Convierte un chequeo de daño en uno
   de habilidad y hace que el jefe se sienta diseñado.

5. **Llegar al jefe, no teletransportarse.** El problema del portal no es la pausa, es el
   **corte**. Parar la cinta ante un jefe está bien y lo hace todo el género. Lo que sienta
   mal es la discontinuidad. Propuesta: la cinta desacelera 3–4 s, la arena del jefe entra
   deslizándose **por la propia cinta**, cambia la música, se abre la cámara, y cuando
   paras ya estás dentro. Mismo código de transición, cero portal, en vez de un frenazo
   una llegada.

6. **Mecánicas por mapa — las últimas.** Lianas, arrojables. Lo dijo Toni mismo: solo
   tienen sentido con tempos claros. Añadir verbos ahora suma confusión al problema (3).

---

## Hilo abierto: delivery estilo Fall Guys + el objetivo del juego

Toni: *"El objetivo del juego no está muy definido. Lo tenemos como obtener trofeos y
quedar el primero en cada stage, pero una vez ya eres el primero y tienes los trofeos solo
puedo ofrecer contenido extra. Un juego muy bueno que no termina de encontrar su sentido."*

Pendiente de desarrollar en la siguiente charla. Notas iniciales:

- **Objetivo de colección vs objetivo posicional.** Los trofeos son invisibles para quien
  entra nuevo. "Voy primero o voy último" se lee en el frame 1 sin que nadie lo explique.
  El juego YA tiene lo segundo (4 luchadores, primero por stage) pero lo tiene enterrado
  bajo el marco de campaña.
- **Estructura campaña vs run.** 16 eslabones es una campaña de consola entregada por un
  link de web. Ahí está el desajuste. La RUTA unificada es justo el sustrato para una run
  **corta y aleatoria** (4–6 eslabones de un pool de 16), con los 10 mundos/trofeos
  quedándose como capa meta de desbloqueo y colección.
- **Sobre simplificar mecánicas:** probablemente no quitar, sino **escalonar**. Smash tiene
  20 verbos y nadie lo llama complejo porque aprendes 3 y el resto vienen solos. El
  problema no es cuántas hay, es que están todas disponibles en el segundo cero. La tienda
  podría ser quien las va presentando de una en una en vez de solo repartir estadísticas.

Frase que resume el diagnóstico: **los trofeos son el álbum, no el partido.** Ahora mismo
están puestos de partido. El objetivo bueno ya está dentro del juego (hay otros tres y solo
uno queda primero); solo está enterrado bajo el marco de campaña.

Y la trampa a evitar: contestar a "¿qué hay después?" con más contenido. Esa carrera se
pierde siempre — un dev solo contra el apetito de un jugador. 5 mundos nuevos son 6 meses y
se consumen en dos tardes; barajar 16 eslabones son 2 días y no se agota.

---

## Banco de ideas (14/08/2026)

★ = lo que yo movería antes. Nada de esto está decidido.

### Estructura de run
1. Mano de **5 eslabones** del pool de 16, acabando siempre en jefe. ~10–12 min.
2. Enseñar la mano **antes** de empezar (el roadmap que ya existe, pero al principio):
   anticipación y decisión — sé que viene hielo, compro fuego.
3. ★ **Run diaria con semilla.** Todos juegan hoy la misma mano. Competición social sin
   multijugador y sin servidor. Un número que compartir.
4. ★ **Corona visible al que va primero.** Convierte al líder en objetivo y el juego se
   auto-equilibra socialmente, sin tocar números.
5. **Eslabón bifurcado**: eliges entre dos caminos, uno cómodo y uno arriesgado con mejor
   premio. Decisión de jugador sin fabricar contenido.

### Primeros 60 segundos
6. Los botones se **encienden de uno en uno**. Los primeros 20 s solo pega; el resto no
   responden aún y aparecen con un flash de icono.
7. El link cae **directo en una run**, sin menú. El menú, después.
8. Los tres rivales del primer tramo, **deliberadamente torpes**. Que el jugador gane los
   tres primeros intercambios: ganar enseña más rápido que perder.
9. El primer recogible, siempre en la trayectoria e **imposible de fallar**. Enseña "esto se
   recoge" sin una palabra.

### Game feel
10. ★ **El KO estelar.** El golpe que tira a alguien de la cinta merece cámara lenta corta y
    zoom. Es el mejor momento del juego y ahora pasa igual que un jab.
11. **Color por peso de golpe** en el flash de quien recibe: blanco ligero, naranja pesado,
    rojo brutal. Vocabulario aprendido sin leer nada.
12. **Fallar tiene que sonar a aire.** Si conectar y fallar suenan parecido, nada es gustoso.
13. **Test de silueta**: pausa en el frame de anticipación — ¿sabes qué ataque viene? Si dos
    se parecen, uno sobra o hay que exagerarlo.

### Jefes
14. ★★ **El jefe no pausa la competición.** Los cuatro siguen peleando entre ellos mientras
    le pegan, y el trofeo se lo lleva quien da el último golpe. Ahora el jefe apaga el
    objetivo posicional durante toda la pelea; esto lo enciende al máximo.
15. **Telegrafiar con color**, no con animación: el jefe se tiñe 0,5 s antes del ataque
    imparable. Universal, se entiende sin jugar.
16. **Tres ataques por jefe y que los repita.** Lo que hace "raro" a un jefe casi siempre es
    tener demasiadas cosas que no se leen.
17. **Fase 2 que se ve**: cambia de aspecto, no solo de números.

### Tienda y transiciones
18. ★ **Tienda con reloj de 15 s** y la cinta corriendo de fondo. Es el mismo frenazo que el
    portal pero en menú. No salir nunca del mundo.
19. La tienda **presenta verbos**, no solo estadísticas: aquí llega el agarre, el especial.
20. **Nunca fundido a negro.** Que corte la cámara, no la imagen.

### Meta y retención
21. ★★ **Clip de los últimos 5 segundos** de la run, descargable. Esa es la moneda social:
    la gente comparte el clip, no el juego. Barato en web y es lo que hizo Fall Guys.
22. **Marcas personales por eslabón** (tu mejor sandboard). Motivo para repetir algo que ya
    ganaste.
23. **Desbloqueos solo cosméticos.** Así nada de lo que consigues te termina el juego.

### Delivery
24. **Jugable en menos de 8 segundos.** El prado pesa poco; el resto se descarga mientras se
    juega el eslabón 1.
25. Una frase en la portada. *"Cuatro entran. Uno gana."*

---

## Auditoría visual de la home (15/08/2026, captura headless real)

**Diagnóstico en una frase: es una página de "léeme" y tiene que ser una página de
"púlsame".** Once decisiones antes de tocar un botón: idioma, dificultad CPU, cómo
jugar, objetos, trofeos, marcas, selector de mapa, JUGAR SOLO, MULTIJUGADOR, 5 pasos
numerados, roster + esquema de mando. Test: un niño de 7 años debe saber qué pulsar
en 3 segundos.

Por gravedad:
1. **El titular vende el álbum como partido** ("PUNTÚA MÁS QUE NADIE… LLÉVATE EL
   TROFEO") — el error exacto del mastermind. Ahí va LA FRASE. "Puntúa" encuadra
   score-attack, que no es el juego.
2. **Dos botones de jugar** (SOLO/MULTI) es una pregunta que el diseño ya respondió:
   JUGAR busca gente y si no hay, CPU. Un botón.
3. **Selector de mapa entre el titular y JUGAR** = el peaje prohibido. A MUNDOS.
4. **La tira de 5 pasos es la confesión**: si la portada necesita manual, no
   funciona. Y dice "oleadas" — ni menciona la cinta. Fuera con la frase buena.
5. **Números contradictorios en pantalla**: chip "TROFEOS 0/10" vs texto "9 mundos,
   9 trofeos" vs tagline "HASTA 6 JUGADORES" (la charla entera es a 4). Copy viejo.
6. **Subtexto de letra pequeña** ("…y solo si el jefe cae") — reglas condicionales
   en portada. Fuera.
7. **Tagline de ficha de Steam** ("BRAWLER DE OLEADAS · ROGUELIKE"). Si hay línea
   bajo el logo, que sea la premisa: "Los mejores guerreros de cada mundo,
   convocados."
8. Dificultad/idioma → engranaje. Mando/roster → MUNDOS, o controles en contexto en
   los primeros segundos de la primera run.

**Lo bueno:** el logo es fuerte y ya tiene tono Fall Guys; el arte de fondo con
confeti funciona; los chips TROFEOS/MARCAS son la puerta del álbum ya construida; la
tira de 5 pasos demuestra que el bucle está claro — está en la pantalla equivocada.

**La home resultante:** logo → una frase → JUGAR enorme → pequeño: MUNDOS + chips de
vitrina → engranaje. Nada más. Lo demás no se borra: se muda. Es edición, no
rediseño.

---

## Legibilidad del primer minuto (16/08/2026)

Lo que reporta la gente nueva: "¿quién soy?", "¿quiénes son los malos?", "¿qué tengo
que hacer?", "estresante visualmente", no ven el muro. **El patrón: todo se entiende
cuando ven jugar a Toni con 15 s de su voz encima.** → El juego no tiene un problema
de diseño: le falta meter dentro lo que Toni hace en el sofá. Dos herramientas:
la escena (mostrar) y el narrador (decir). Nunca menús ni pantallas de texto.

- **"¿Quién soy?"** → arranque aislado (ya en plan) + marcador "TÚ" sobre la cabeza
  20 s + medio segundo de presentación al spawn (zoom + rótulo con nombre).
- **"¿Quiénes son los malos?"** → no hay malos y es una feature ("contra tus
  compañeros o colaborar"). Lo que falta es **jerarquía visual de 3 capas**:
  yo > rivales > masa. Regla: **la saturación es de los jugadores.** Luchadores
  saturados + outline + nombre (parecen personas); minions desaturados al tono del
  stage, uniformes, sin outline (parecen terreno que se mueve). No quitar minions:
  bajarles el volumen visual.
- **Estrés visual** → es ilegibilidad, no intensidad. Prueba: "les gusta cuando se
  pone duro". Nadie se queja de la locura, sino de la locura que no saben leer.
  Cero minions los primeros 30 s; entran por goteo.
- **★★ EL MURO ES LA TRAMPA: pared de PIXELACIÓN.** No rayas: el mundo
  deshaciéndose en cubos detrás de ti — suelo, decorado, todo. Responde "¿qué tengo
  que hacer?" sin palabras y une premisa (reino → píxeles), muerte (pixelarte) y
  empuje en una sola imagen. La trampa deja de ser lore: es lo que te persigue.
- **Demostración scriptada** en los primeros 10 s: un minion rezagado es alcanzado
  por el muro y se deshace en cubos delante de ti. Mostrar > decir.
- **El narrador = Toni en el sofá.** Sus 3 frases, literales, solo en la primera
  run: "Tú eres el bárbaro." / "Ellos también fueron convocados. Rivales… o
  aliados, tú verás." / "No dejes que el muro te alcance."

---

## Próxima pregunta abierta

Cuántos eslabones tiene la mano ideal. De ahí sale todo lo demás: cuánto dura una run,
cuánto poder puedes acumular antes del final, y si el jefe de cierre es siempre el mismo o
también sale del bombo.
