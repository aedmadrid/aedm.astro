# Frontend: Web AEDM

### Tecnologías: astro, npm y GitHub Pages.

Este es el frontend de la web de la (aso)ciación de estudiantes de diseño de madrid. El código está disponible bajo la MPL 2.0.

El sitio se despliega en GitHub Pages como página de proyecto
(`https://aedmadrid.github.io/aedm.astro/`). Todo es estático: la web se
pre-genera en cada build y obtiene los datos de `https://api.aedm.org.es` con
fallback automático a `https://aedm-cora.onrender.com` (helper en
`src/lib/api.ts`, reintentos de Notion en `src/lib/notion.ts`).

Las rutas `/actividades`, `/proyectos` y `/id/<id>` se generan en el build. Los
`pageId` de `/id` se descubren desde las bases de datos y desde sus páginas
hijas de Notion. Como las URLs de imagen de Notion caducan a los 60 minutos, el
workflow `.github/workflows/deploy.yml` recompila automáticamente cada 15
minutos (además de en cada push y de forma manual). Los enlaces internos usan
el helper `link()` de `src/lib/paths.ts` para respetar el `base` de GitHub Pages.

Para servir en el dominio propio: pon `site`/`base` en `astro.config.mjs` a
`https://aedm.org.es` y `/`, y añade `public/CNAME` con `aedm.org.es`.


# IMPORTANTE

Hay tipografías que **NO PUEDES USAR SIN LICENCIA**. Para que sea más simple sustituirlas, se llaman MainFont y TitleFont en /src/styles/main.css, desde ahí puedes cambiar la fuente a la que quieras.
