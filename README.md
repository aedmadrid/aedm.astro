# Frontend: Web AEDM

### Tecnologías: astro, npm y GitHub Pages.

Este es el frontend de la web de la (aso)ciación de estudiantes de diseño de madrid. El código está disponible bajo la MPL 2.0.

El sitio se despliega en GitHub Pages con dominio propio
(`https://aedm.org.es/`, gracias a `public/CNAME`). Todo es estático: la web se
pre-genera en cada build y obtiene los datos de `https://api.aedm.org.es` con
fallback automático a `https://aedm-cora.onrender.com` (helper en
`src/lib/api.ts`, reintentos de Notion en `src/lib/notion.ts`).

Las rutas `/actividades`, `/proyectos` y `/id/<id>` se generan en el build. Los
`pageId` de `/id` se descubren desde las seis bases de datos del API
(`ACTIVIDADES_DB`, `PROYECTOS_DB`, `WEB_DB`, `ESCUELA_DB`, `AEDM_DB`,
`INICIO_DB`) y, de forma recursiva y sin límite de profundidad, desde sus
subpáginas de Notion (`child_page`, `link_to_page`, menciones y enlaces en
`rich_text`). Cada página se genera con y sin guiones (los enlaces internos de
Notion usan el formato sin guiones). Como las URLs de imagen de Notion caducan
a los 60 minutos, el workflow `.github/workflows/deploy.yml` recompila
automáticamente cada 15 minutos (además de en cada push y de forma manual). Los
enlaces internos usan el helper `link()` de `src/lib/paths.ts` para respetar el
`base` de Astro.

Para cambiar de dominio: ajusta `site`/`base` en `astro.config.mjs` y
`public/CNAME` (que debe coincidir con el dominio configurado en las
preferencias de GitHub Pages).

## Imágenes

`npm run optimize:images` genera una versión `.webp` de cada imagen grande
(>100 KB) de `public/`, `src/images` y `src/assets`, la redimensiona a un máximo
de 2000 px y recomprime el original como fallback (solo si mejora un 5%). Los
**APNG** (PNG animados, p. ej. `img/pingponghola.png`) se dejan intactos porque
sharp no conserva la animación. Flags: `--dry-run` (solo lista) y
`--keep-original` (no toca los originales).

El componente `src/components/Pic.astro` renderiza `<picture>` (webp primero,
original después) y los fondos CSS que lo necesitan usan `image-set()`.


# IMPORTANTE

Hay tipografías que **NO PUEDES USAR SIN LICENCIA**. Para que sea más simple sustituirlas, se llaman MainFont y TitleFont en /src/styles/main.css, desde ahí puedes cambiar la fuente a la que quieras.
