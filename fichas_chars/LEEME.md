# Fichas de personaje — referencia para ilustración 2D

24 PNG con **fondo transparente**, 900×1200, uno por (clase × ángulo). Generados con
`_fichas_chars.js` desde el juego real: modelo GLB de la clase, su **pose idle**, su **arma de
clase** y su **recolor de marca** — lo mismo que ve el jugador en el carrusel.

- `<clase>_frente.png` · `_tres4.png` (3/4, el mejor para ilustrar) · `_perfil.png` · `_espalda.png`
- `_TODOS_frente.png` — lámina con las 6 clases de frente (orden: samurái, bárbaro, caballero /
  arquera, mago, sacerdotisa)

## Las 6 clases

| Fichero | Personaje | Color de marca | Rol | Arma |
|---|---|---|---|---|
| `samurai_*` | Samurái | `#9B2BFF` púrpura | Espadachín ágil | katana |
| `voxelhero_*` | Bárbaro | `#FF3B30` rojo | Bruto cuerpo a cuerpo | martillo/hacha |
| `knight_*` | Caballero | `#FFFFFF` blanco acero (penacho rojo) | Tanque acorazado | escudo + espada |
| `archer_*` | Arquera | `#FFD84F` amarillo | Tiradora veloz | arco |
| `link_*` | Mago | `#3AD06A` verde | Mago de área | báculo |
| `nun_*` | Sacerdotisa | `#2563EB` azul | Soporte sagrado | báculo/plumas |

El color de marca **tiñe todo el personaje** (es su identidad en pantalla: en partida se distingue
la clase por el color a distancia). La piel se conserva sin teñir.

## El "rollo" visual del juego

- **Low-poly chibi**: cuerpo achaparrado, cabeza enorme (≈1/3 del alto), facetas planas visibles,
  sin textura de detalle — el color va por facetas.
- **Contorno**: línea oscura de silueta **solo en los personajes jugables** (el escenario no lleva).
  Es lo que los despega del fondo.
- **Grado de color**: contraste ×1.28, saturación ×1.24, y los personajes +10% de saturación extra
  sobre el resto. Colores saturados y contrastados, negros no puros.
- Ojos y boca: rasgos mínimos, rectángulos oscuros; expresión leída de una ojeada.

## Prompt base sugerido para Gemini

> Ilustración 2D del personaje de la imagen de referencia. Estilo: vectorial plano con **contorno
> negro grueso y uniforme** en la silueta y en las divisiones internas principales; colores planos
> **saturados y de alto contraste**, con como mucho dos tonos por color (base + sombra), sin
> degradados ni texturas. Respeta las **proporciones chibi** (cabeza grande, cuerpo compacto), la
> silueta y el color de marca del personaje. Fondo transparente/liso.

Añade por personaje el color de la tabla ("dominante púrpura #9B2BFF") — es lo que mantiene el cast
reconocible entre sí.

## Regenerarlas

```
node _serve.js                                  # sirve la carpeta en :8181
# Edge headless con --remote-debugging-port=9444 abriendo rumble_arena_cinta_v4.html
node _fichas_chars.js fichas_chars
```

El encuadre **se mide sobre la silueta renderizada**, no con `Box3`: sobre mallas con skin el bbox
da el bind pose y números imposibles (la sacerdotisa medía 0.01 de alto). Ver la cabecera del script.
