# Frontend: Web AEDM

### Tecnologías: astro, npm y Netlify.

Este es el frontend de la web de la (aso)ciación de estudiantes de diseño de madrid. El código está disponible bajo la MPL 2.0.

El sitio se despliega en Netlify. La mayor parte son páginas estáticas. Las
rutas `/id/[id]`, `/actividades` y `/proyectos` se renderizan bajo demanda en
una función SSR (`@astrojs/netlify`) y obtienen los datos de
`https://api.aedm.org.es` con fallback automático a
`https://aedm-cora.onrender.com` si la principal falla, así que los datos
cambian sin recompilar. El helper común vive en `src/lib/api.ts` y la secuencia
de reintentos de las páginas de Notion en `src/lib/notion.ts`.


# IMPORTANTE

Hay tipografías que **NO PUEDES USAR SIN LICENCIA**. Para que sea más simple sustituirlas, se llaman MainFont y TitleFont en /src/styles/main.css, desde ahí puedes cambiar la fuente a la que quieras.
