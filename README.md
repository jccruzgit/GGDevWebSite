# GGDev Web

Frontend de GGDev construido con React, Vite y TailwindCSS. El sitio presenta una tienda de camisetas personalizadas con catálogo, detalle de producto, personalizador MVP, asesoría y flujo final por WhatsApp.

## Stack

- React
- Vite
- TailwindCSS
- React Router DOM
- Context API
- lucide-react

## Ejecutar en local

1. Instala dependencias:

```bash
npm install
```

2. Inicia el entorno de desarrollo:

```bash
npm run dev
```

3. Genera la versión de producción:

```bash
npm run build
```

## Despliegue automático en GitHub Pages

Este repositorio ya incluye el workflow `.github/workflows/deploy.yml` para publicar automáticamente el sitio en GitHub Pages al hacer `push` a `main`.

La URL esperada de publicación es:

```text
https://jccruzgit.github.io/GGDevWebSite/
```

### Activación en GitHub

1. Entra al repositorio en GitHub.
2. Abre `Settings`.
3. Ve a `Pages`.
4. En `Build and deployment`, selecciona `Source: GitHub Actions`.
5. Guarda la configuración.

Después de eso, cada `git push` a `main` disparará el workflow y publicará la carpeta `dist` generada por Vite.

## Estructura principal

```text
src/
  assets/
  components/
  context/
  data/
  hooks/
  pages/
  routes/
  styles/
  utils/
```

## Flujo del sitio

- El usuario explora el catálogo o sube su diseño.
- Puede revisar detalles, colores, tallas y notas.
- El cierre se hace por WhatsApp o por solicitud de asesoría.
- No se implementan pagos en línea en esta versión.
