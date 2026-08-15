# RUMBLEBOYS · MASTERMIND

> **El núcleo. Toda decisión de diseño se contrasta contra este documento.**
> Si una idea nueva contradice algo de aquí, o se descarta la idea o se reescribe
> este documento — pero nunca se ignora en silencio.
> (Charla completa y banco de ideas: `_CHARLA_DISEÑO.md`. Fijado 15/08/2026.)

---

## LA FRASE

> **"Corres por una cinta que nunca para, contra otros tres.
> El que se cae se convierte en píxeles.
> El último en pie se queda el mundo."**

Es el test de toda decisión: si una feature no cabe en esta frase ni la adorna, sobra.
La frase ya contiene la historia (píxeles, mundos), el formato (cinta, consecutivo)
y el objetivo (último en pie). No es un batiburrillo híbrido: es una frase clara
con adornos.

---

## LA REGLA MAESTRA: NO SACRIFICAR — SUBORDINAR

El error sería elegir entre historia / hub / online / single-player. No se elige:
se ordena. **La run manda; todo lo demás la sirve.**

### 1. La historia está SUBORDINADA a la run
La premisa (los mejores guerreros de cada mundo, convocados a un reino que pide
socorro — y es una trampa) **justifica la mecánica exacta**: una convocatoria es un
desfile forzado de mundos consecutivos. Te llamaron, entraste, la trampa te empuja
hacia delante sin dejarte salir. Por eso la cinta nunca para, por eso no eliges
adónde ir, por eso el caos escala.

- **No hay modo historia.** Hay: intro de ~20 s con la premisa, narrador entre
  stages (carpeta `narrator/` ya existe), presentaciones de jefe.
- **La muerte ES la historia: PIXELACIÓN.** Quien cae de la cinta se descompone
  en cubos y se lo traga el reino. Cada KO cuenta la premisa sin una línea de
  diálogo, ~30 veces por partida. Historia sin fricción.

### 2. El hub está SUBORDINADO a la home
El mapa de mundos estilo Super Mario World **no es un modo: es el menú.** En la
home se ve el progreso, los trofeos, los mundos conquistados, y se puede rejugar
suelto cualquier mundo ya ganado (práctica, marcas personales). El hub es el
álbum. **Jugar de verdad = aceptar la convocatoria = run consecutiva en modo
alerta.** No se pierde el tirón; se gana una pantalla de progreso.

### 3. El online está SUBORDINADO a la CPU
"Si nadie se conecta es trepidante igual" no es un compromiso: es una ventaja
enorme. Fall Guys necesita 60 personas o no existe; RUMBLEBOYS está **siempre
lleno**, a cualquier hora. Se diseña CPU-first como ancla; el online, cuando
toque, es capa extra que solo puede mejorar — nunca requisito.

### 4. Los trofeos están SUBORDINADOS al partido
Los trofeos son **el álbum, no el partido**. El objetivo visible y eterno es
posicional: hay otros tres y solo uno queda primero. Se lee en el frame 1, en
cualquier idioma, y no se agota. Los trofeos/mundos/vitrina quedan como capa
meta de colección y desbloqueo. **Nunca responder a "¿qué hay después?" con más
contenido** — esa carrera se pierde siempre; barajar lo que existe, no.

### 5. El ritmo tiene valles A PROPÓSITO — y el patrón ESCALA
Stage → tienda → caos 1 no es un bug: la tensión necesita valles o agota. Lo que
falta no es quitar el respiro, es que el patrón apriete hacia el final (la
decisividad de las pantallas finales de Fall Guys): en los últimos eslabones la
trampa se acelera — el suelo empieza a pixelarse, el último acumula corrupción,
la tienda final ofrece menos y cobra más. Cada vuelta al caos 1 dura menos.

---

## LA RUN ES LA CONVOCATORIA (revisado 15/08 — modelo de Toni, sustituye a la "mano de 5")

**Una sola ruta canónica: los 16 eslabones, orden fijo, siempre.** Mueres → run
terminada → **los trofeos ganados se quedan** (más monedas/cosmético/línea nueva de
narrador: morir siempre da algo). Vuelves y llegas más lejos. A las ~100 runs, el
álbum completo. Es el modelo Hades, y es mejor que barajar por una razón concreta:
**el orden fijo es lo que permite el arco narrativo** (el narrador que se agrieta,
la trampa al final). Barajado, la historia se rompe.

- No es hardcore aunque lo parezca: **la duración de sesión escala con la
  habilidad.** El novato muere en el eslabón 3 (8 min, "va, otra"); el veterano
  llega al 14 y se ha ganado esa sesión larga. Perder pronto es barato.
- **Reintentar es instantáneo**: morir → pixelarte → carta ("¿Otra vez tú?") →
  eslabón 1. Cero menús. Este es EL punto de fricción a vigilar.
- Dos metas que conviven sin pisarse: *sobrevivir* la convocatoria (el partido de
  hoy) y *quedar primero en cada mundo* (el trofeo, el álbum de siempre).
- La "mano de 5 barajada" queda aparcada como posible modo diario futuro, nada más.

## LAS DOS PANTALLAS

- **Home (la actual):** portada + título + **JUGAR va DIRECTO a la run** —
  matchmaking online o CPU si no hay nadie. Un botón entre el jugador y el juego,
  nunca dos. El mapa jamás se interpone en el camino de JUGAR.
- **Mapa de mundos (estilo Super Mario World):** se entra con OTRO botón (MUNDOS /
  ENTRENAR). Es el álbum hecho paisaje: la ruta dibujada como camino, los trofeos
  plantados encima, práctica offline de cualquier mundo conquistado. El mapa como
  peaje es fricción; como sala de trofeos es un premio.

## QUÉ ES EL JUEGO (para adultos)

Supervivencia plataformera en cinta continua + mecánicas de lucha + estructura
roguelike (la convocatoria: gauntlet fijo de 16, tienda entre stages, la muerte
termina la run pero el progreso del álbum persiste). 4 luchadores, CPU o humanos.
Gana el último en pie / el primero del stage.

## QUÉ NO ES

- No es una campaña de consola que se juega una vez: es un gauntlet que se reintenta.
- No es un juego de contenido infinito (es un juego de rejugar la misma ruta cada
  vez más lejos, con builds de tienda distintas).
- No es un juego que necesite servidor, matchmaking ni nadie conectado.
- No es un modo historia con cinemáticas (la historia se cuenta jugando: pixelación,
  narrador, convocatoria, y el giro de la trampa en el final de la ruta).
