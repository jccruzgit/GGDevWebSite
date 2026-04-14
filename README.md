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

### Secrets para GitHub Pages

Si quieres que el sitio publicado lea el catalogo remoto de Supabase, agrega estos secrets en GitHub:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

No agregues `SUPABASE_SERVICE_ROLE_KEY` en GitHub Pages. Esa llave es solo para scripts o tareas administrativas del lado servidor.

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

## Admin basico

El proyecto ahora incluye una base para admin en `#/admin/login` y `#/admin`.

Para activarlo necesitas:

1. Crear un proyecto en Supabase.
2. Copiar `.env.example` a `.env` y completar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. Ejecutar el SQL de `supabase/schema.sql`.
4. Crear tu usuario en Supabase Auth y luego insertar su fila en `public.profiles` con rol `owner` o `admin`.

Con eso podras iniciar sesion, subir la imagen principal del producto y publicar nuevos disenos en el catalogo.

### Migrar catalogo local a Supabase

Si quieres pasar los disenos locales de `src/data/products.js` y las imagenes de `public/mockups` al catalogo remoto:

1. Completa `SUPABASE_SERVICE_ROLE_KEY` en `.env`.
2. Ejecuta `npm run migrate:catalog`.

El script hace upsert por `slug`, conserva descripcion corta y completa, y sube al bucket publico configurado las imagenes locales encontradas para cada producto.

## Flujo del sitio

- El usuario explora el catálogo o sube su diseño.
- Puede revisar detalles, colores, tallas y notas.
- El cierre se hace por WhatsApp o por solicitud de asesoría.
- No se implementan pagos en línea en esta versión.
