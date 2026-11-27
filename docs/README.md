# Sistema de diseño ASO / aedm

Paquete de diseño para agentes. Cuatro ficheros y nada más:

| Fichero | Para qué |
|---|---|
| `sistema-de-diseno.md` | **Contrato**: reglas, escala, componentes, estados, checklist de aceptación |
| `tokens.css` | Tokens web (primitivos + semánticos + `@font-face` de las familias canónicas) |
| `tokens.ts` | Espejo para React Native / TypeScript |
| `sistema-de-diseno.html` | Guía visual (abrir con `::preview` o en el navegador) |

## Superficies

| Repo | Estado | Qué hace falta |
|---|---|---|
| `aedm.astro` | **canónico** | consumir `tokens.css` y sustituir valores sueltos por `var()` |
| `aso-portal` | hereda color/formas | migrar tipos: NeueMontreal → Schibsted Grotesk, PKiko → Stick No Bills |
| `aso-app` | hereda color/formas | ídem en `useFonts` + `globalStyles.ts`; cae `TitleFontItalic` |

## Uso rápido

```html
<link rel="stylesheet" href="/styles/tokens.css" />
```

```ts
import { colors, theme, fonts, type, space, radius, size } from "@/styles/tokens";
```

Regla única: **si un valor no está en `tokens.css` / `tokens.ts`, no existe**. Se añade al token y luego se usa — nunca al revés.
