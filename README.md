# RUMBLEBOYS

Brawler 3D de plataformas hecho con Three.js. El juego vive casi entero en
`rumble_arena_cinta_v4.html` (JS inline), acompañado de los modelos, animaciones,
música, voces y SFX que carga en runtime.

## Ejecutar

Necesita servirse por HTTP (no abrir el `.html` con `file://`, por CORS de los assets).

```bash
node _serve.js
```

Luego abre la URL que indique la consola (por defecto sirve `rumble_arena_cinta_v4.html`).
En Windows también está `JUGAR.bat` como atajo.

## Estructura

- `rumble_arena_cinta_v4.html` — juego principal (arenas, jefes, tienda, IA, cinemáticas).
- `*_model.js` / `*_models.js` — geometría de personajes, armas, props y stages (base64).
- `*_anims.js` — clips de animación de jefes y personajes (Mixamo/FBX en base64).
- `music/`, `voices/`, `narrator/`, `sfx/` — audio por stage.
- `char_video/`, `crowd/` — vídeo de portada y público.
- `*.backup-*.html` — copias de seguridad de hitos (no editar).
