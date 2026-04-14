Coloca aqui las imagenes reales del catalogo.

Estructura esperada:

- `public/mockups/<categoria>/<slug-del-producto>/`

Convencion recomendada por producto:

- `main.png`
- `front.png`
- `alt-1.png`
- `alt-2.png`

Categorias actuales:

- `anime`
- `devs`
- `gaming`
- `motogp`
- `streetwear`
- `tech-humor`

Productos actuales:

- `devs/legacy-code`
- `devs/machine-learning`
- `devs/senor-developer`
- `devs/github`
- `gaming/vaporwave-8-bit`
- `gaming/manco-fortnite`
- `tech-humor/mainframe-soul`
- `tech-humor/async-await-ghost`
- `anime/glitch-geist-01`
- `motogp/tokyo-midnight-run`
- `streetwear/cyber-ronin-v04`

Para activar imagenes reales en la app:

1. Coloca los archivos en la carpeta del producto.
2. Edita `src/assets/mockups/index.js`.
3. En el slug correspondiente, agrega los nombres de archivo en orden.

Ejemplo:

```js
"legacy-code": ["main.png", "front.png", "alt-1.png"]
```

Si un producto no tiene archivos registrados, la app sigue usando el mockup SVG actual.

Para `gaming/manco-fortnite`, la imagen principal esperada es:

- `public/mockups/gaming/manco-fortnite/main.png`
