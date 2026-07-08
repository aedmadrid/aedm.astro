# Frontend: Web AEDM

### Tecnologías: astro, npm y Netlify.

Este es el frontend de la web de la (aso)ciación de estudiantes de diseño de madrid. El código está disponible bajo la MPL 2.0.

El sitio se despliega en Netlify. La mayor parte son páginas estáticas. La ruta
`/id/[id]` se renderiza bajo demanda en una función SSR (`@astrojs/netlify`)
y obtiene la página de `https://api.aedm.org.es` con fallback automático a
`https://api.failback.aedm.org.es` si la principal falla. La secuencia de
reintentos vive en `src/lib/notion.ts`.


# IMPORTANTE

Hay tipografías que **NO PUEDES USAR SIN LICENCIA**. Para que sea más simple sustituirlas, se llaman MainFont y TitleFont en /src/styles/main.css, desde ahí puedes cambiar la fuente a la que quieras.
