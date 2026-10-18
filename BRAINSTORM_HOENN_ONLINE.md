# BRAINSTORM — Hoenn Online (Pokémon Esmeralda online con amigos)

> Proyecto aparte de Rumbleboys. Cuando arranque, irá en su propio repo privado y este documento
> pasará a ser su `PLAN.md`. Brainstorm del 18/10/2026.

---

## 1. Concepto

Pokémon Esmeralda jugable **desde el navegador** (PC y móvil), con su historia y sus 386 Pokémon
originales, más:

- **Online en tiempo real**: verte con tus amigos por el mapa.
- **Contenido nuevo**: Pokémon inventados, gimnasios, eventos y **una región basada en la zona donde
  vivimos**.
- **Persistencia y dinámicas** que den ganas de entrar cada día.

**Solo para el grupo de amigos.** Usa la propiedad intelectual de Nintendo/Game Freak: la web es privada
(con contraseña o invitación) y no se publica, no se anuncia y no se distribuye el ROM.

---

## 2. Arquitectura

```
┌─────────────── Navegador (PC o móvil) ───────────────┐
│  Emulador GBA en WebAssembly (basado en mGBA)         │
│     └─ ROM propio: pokeemerald-expansion modificado   │
│  HUD táctil (cruceta, A, B, Start, Select, L/R)       │
│     → solo si se detecta móvil: (pointer: coarse)     │
│  Capa online en JS: lee y escribe la RAM del juego    │
└──────────────────────────┬────────────────────────────┘
                           │ WebSocket
                 Servidor (Node): jugadores, eventos
                 diarios, gimnasios, rankings, guardados
```

- **pret/pokeemerald** es la decompilación completa de Esmeralda a C. **pokeemerald-expansion**
  añade mecánicas modernas y facilita añadir especies. El contenido nuevo se hace en C y en scripts.
- El **emulador corre en la misma página**, así que el JS lee tu posición de la RAM y escribe la de
  tus amigos en un "buzón" que el juego modificado pinta como personajes ("ghost players").
- El **servidor** guarda todo lo compartido o diario y las partidas (juegas en el móvil o el PC con la
  misma partida).
- Descartado: rehacer Esmeralda entero en web (meses o años). Descartado también: Lua sobre mGBA de
  escritorio (no sirve para el móvil).
- Referencia: **PokeMMO** ya hace un MMO sobre ROMs de GBA/NDS. Sirve de inspiración, pero no deja
  meter contenido propio.

---

## 3. Modificar la historia y el contenido

La historia está en scripts legibles, uno por mapa:

```
LittlerootTown_EventScript_Vecino::
	msgbox LittlerootTown_Text_Hola, MSGBOX_NPC
	setflag FLAG_HABLASTE_CON_VECINO
	end
```

| Cambio | Dificultad |
|---|---|
| Diálogos y textos | 🟢 trivial |
| Equipos de entrenadores y líderes | 🟢 editar una tabla |
| Pokémon nuevos encima de los 386 | 🟢🟡 sobre todo sprites (frontal, trasero, icono) |
| Eventos nuevos (NPC, combates, misiones) | 🟡 |
| Rutas o zonas nuevas conectadas a Hoenn | 🟡 Porymap + tiles |
| Reescribir arcos de la historia | 🟠 sin dificultad técnica, pero mucho trabajo |
| Región nueva completa | 🔴 por la cantidad de arte, no por la técnica |

**Nivel 999**: el nivel se guarda en 1 byte (máximo 255), las tablas de experiencia acaban en 100 y el
formato de guardado cambia. Hay que tocar decenas de sitios. Alternativa barata: **nivel 100 +
prestigio/renacer** (vuelves a nivel 1 con estrellas que suben las estadísticas).

---

## 4. Región de nuestra zona (OpenStreetMap)

OpenStreetMap, no Google Maps: las condiciones de Google no permiten extraer sus datos para hacer
mapas derivados, y OpenStreetMap es libre y trae más información útil.

1. Elegir una zona (rectángulo en el mapa).
2. Un script descarga los datos y los convierte en casillas de 16×16:

| Realidad | Juego |
|---|---|
| Calles y caminos | Camino |
| Edificios | Casas, tiendas o bloques |
| Parques y jardines | Hierba alta (salvajes) |
| Ríos, mar, lagos | Agua (Surf, pesca) |
| Bosques | Árboles |
| Vías de tren, autopistas | Bordes y barreras |

3. El script genera los mapas en el formato de pokeemerald, que se abren en Porymap.
4. **Pulido a mano**: puertas, edificios importantes y dónde va el gimnasio, el Centro Pokémon y la tienda.

**A tener en cuenta:**
- **Escala**: comprimir. Quedarse con los sitios con significado (las casas de cada uno, el parque, la
  playa, el bar) y acortar las distancias.
- **Tamaño**: cada mapa de GBA admite unas 80×80 casillas; la región se parte en mapas conectados.
- **Lo automático sale feo**: el script hace el 70 % y el resto es pulido.
- **Privacidad**: si salen las casas reales, otro motivo para que la web sea privada.

**Ideas asociadas:** cada amigo es líder de gimnasio en su barrio, NPC basados en gente conocida,
salvajes según el sitio real (Agua en el río, Bicho en el parque, Fantasma en el cementerio…) y
conquistar lugares reales.

---

## 5. Principio de diseño del online

En un grupo pequeño **casi nunca vais a coincidir conectados**. Lo que engancha es que **se note que
los demás han pasado por ahí**, aunque no estén: fantasmas, gimnasios conquistados, avisos al grupo y
metas compartidas.

**Evitar:**
- Rachas diarias que castigan (mejor premios por volver que castigos por faltar).
- Ventajas que dependan de quién juega más: el que juega poco se desengancha. Mejor topes de nivel por
  temporada o emparejar por equipo.

---

## 6. ⭐ Idea de Toni: Temporadas semanales — "Consejo de Sabios"

- Un edificio en el juego llamado **"Consejo de Sabios"**.
- Cada semana, un **mega torneo con todos los jugadores**.
- Allí se entrega el **premio al mejor entrenador de la semana**.
- Cada jugador elige **luchar manualmente** o **enviar a la IA a pelear por él** (con su equipo).
- Implementación: primero el modo IA (se puede simular y resolver solo), después el manual (requiere
  combate en tiempo real entre jugadores).

---

## 7. Todas las ideas, ordenadas por dificultad × impacto

**D** = dificultad de implementación, **G** = lo guai que queda, ambas de 1 a 5.

### 🥇 Fácil y muy guai (empezar por aquí)
| # | Idea | D | G |
|---|---|---|---|
| 1 | Emerald en el navegador + HUD táctil en móvil *(la base de todo)* | 2 | 5 |
| 2 | NPC con frases y nombres de amigos | 1 | 4 |
| 3 | Bot de avisos al grupo de WhatsApp/Telegram/Discord (capturas, shinies, conexiones, gimnasios) | 1 | 4 |
| 4 | Equipos nuevos de líderes y entrenadores | 1 | 3 |
| 5 | Ver a los amigos caminar en tiempo real | 3 | 5 |
| 6 | Emotes encima del personaje (!, ?, ♥, risa…) | 2 | 4 |
| 7 | Pokédex compartida con metas del grupo (100 entre todos abre una zona, 200 trae un legendario) | 2 | 4 |
| 8 | Eventos diarios ("hoy sale X en la ruta Y", días de tipo) | 2 | 4 |

### 🥈 Esfuerzo medio, mucho impacto
| # | Idea | D | G |
|---|---|---|---|
| 9 | Pokémon nuevos *(la técnica es fácil; el arte cuesta)* | 2 | 5 |
| 10 | Fantasmas de amigos desconectados en su último sitio, que puedes retar (su equipo con IA) | 3 | 5 |
| 11 | Gimnasios conquistables (dejas tu equipo defendiéndolo) | 3 | 5 |
| 12 | Región de nuestra zona con OpenStreetMap | 3 | 5 |
| 13 | ⭐ **Consejo de Sabios**: torneo semanal (modo IA) | 3 | 5 |
| 14 | Ranking semanal + temporadas con premios estéticos | 2 | 3 |
| 15 | Clima real de la ciudad en el juego (si llueve de verdad, más tipo Agua) | 2 | 3 |
| 16 | Check-in GPS en sitios reales (estar en la plaza da un objeto o un Pokémon) | 2 | 4 |
| 17 | Carreras de captura de 10 minutos | 2 | 3 |
| 18 | Chat | 2 | 3 |
| 19 | Regalar objetos | 2 | 3 |
| 20 | Eventos nuevos de historia y misiones | 2 | 3 |
| 21 | Intercambios | 3 | 4 |
| 22 | Legendario errante compartido (solo uno puede capturarlo) | 3 | 4 |
| 23 | Combates dobles con el equipo de un amigo (reutiliza el sistema del combate con Máximo) | 3 | 4 |

### 🥉 Difícil pero brutal
| # | Idea | D | G |
|---|---|---|---|
| 24 | Salvajes visibles que te ven y te atacan (reutiliza la "vista" de los entrenadores) | 4 | 5 |
| 25 | Jefes cooperativos con vida compartida durante la semana | 4 | 4 |
| 26 | ⭐ Consejo de Sabios: modo de combate manual | 5 | 4 |
| 27 | Combate en tiempo real entre amigos | 5 | 4 |

### 💤 Mucho trabajo para lo que aporta (dejar para el final)
| # | Idea | D | G |
|---|---|---|---|
| 28 | Mensajes en el suelo para los demás (tipo Dark Souls) | 3 | 3 |
| 29 | Mercado y encargos entre amigos ("busco un Ralts con Sincronía, pago 5.000") | 3 | 3 |
| 30 | Ropa y colores del personaje | 3 | 3 |
| 31 | Prestigio/renacer (en lugar del nivel 999) | 3 | 3 |
| 32 | Tarjeta de entrenador con medallas, títulos y logros | 3 | 2 |
| 33 | Visitar bases secretas de amigos | 4 | 3 |
| 34 | El pueblo crece con donaciones del grupo | 4 | 3 |
| 35 | Día y noche según la hora real | 3 | 3 |
| 36 | Reescribir arcos enteros de la historia | 4 | 3 |
| 37 | Nivel 999 de verdad | 5 | 2 |
| 38 | Ver combates de amigos en directo | 5 | 2 |

**Otras ideas sueltas:** bayas en tiempo real (Esmeralda ya las tiene), guardería y huevos con tiempo
real, modo Nuzlocke opcional por temporada con ranking propio.

---

## 8. Orden de prototipos (poco a poco)

1. **Proto 1**: #1. Ya puedes jugar en el móvil.
2. **Proto 2**: #5 + #6 + #3. Ya os veis jugar y el grupo se entera de todo.
3. **Proto 3**: #2 + #4 + #9 con 2–3 Pokémon. Ya es "vuestro" Esmeralda.
4. **Proto 4**: #10 + #11 + #13. Aparece el enganche semanal (Consejo de Sabios).
5. **Proto 5**: #12 + #16. Vuestro pueblo dentro del juego.

---

## 9. Coste en tokens y sesiones (aproximado)

| Fase | Equivale a… |
|---|---|
| Emerald en el navegador + HUD móvil | 1 sesión |
| Ver amigos en tiempo real | 1–2 sesiones |
| Pokémon nuevos + evento | 1 sesión por tanda |
| Región OSM (script + primera zona) | 1 sesión + 1 corta por zona |
| Persistencia (gimnasios, eventos, ranking, Consejo) | 3–5 sesiones |
| Lo ambicioso (salvajes agresivos, jefes, nivel alto) | Muchas |

**Lo que más gasta:** el tamaño de pokeemerald (miles de ficheros), los logs de compilación y las
sesiones largas. Se controla con búsquedas acotadas y subagentes, los logs a un fichero mirando solo el
final, una fase por sesión y `/compact` al pasar del 40 %. El repo nuevo tendrá desde el día 1 un
CLAUDE.md con estas normas.

**Lo que no es de tokens:** los sprites de los Pokémon nuevos. Puede haber placeholders, pero para que
queden bonitos los tiene que dibujar alguien.

---

## 10. Pendiente de decidir

- [ ] Nombre del proyecto y del repo (provisional: `hoenn-online`, privado)
- [ ] Primera zona real a convertir
- [ ] Quién dibuja los Pokémon nuevos
- [ ] Nivel 999 de verdad o prestigio
- [ ] Plataforma del bot de avisos (WhatsApp, Telegram o Discord)
