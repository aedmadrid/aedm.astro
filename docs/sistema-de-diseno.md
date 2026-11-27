# Sistema de diseño — ASO / aedm

Contrato de diseño para agentes. Extraído del código, no de una guía ideal.

**Superficies**

| Superficie | Repo | Rol en este documento |
|---|---|---|
| aedm.org.es | `aedm.astro` | **canónica**: define familia, color, forma y copy |
| VerificASO | `aso-portal` | misma marca, token layer más maduro (se hereda) |
| ASO.app | `aso-app` | misma marca en React Native (Expo) |

**Archivos de este paquete**

- `docs/tokens.css` — tokens canónicos web (primitivos + semánticos + escala + forma + movimiento).
- `docs/tokens.ts` — espejo para React Native.
- `docs/sistema-de-diseno.html` — guía visual (`::preview`).

**Orden de precedencia ante conflicto:** aedm.astro (web pública) > `aso-portal/public/styles/global.css` (token layer) > `aso-app/src/styles/globalStyles.ts` > cualquier pantalla suelta.
El token layer del portal es el mejor construido de los tres: **no lo reinventes, extiéndelo**.

---

## 1. Reglas duras

1. **Verde = marca y acción.** Si algo es `--verde`, es clicable o es identidad. Nunca decorativo.
2. **Texto sobre verde siempre `--negro`.** Nunca blanco sobre verde (contraste ilegible).
3. **Esquinas rectas.** `--radius: 0` por defecto. Solo `pill 20` (hashtags), `screen 22` (carrusel), `xs 4` (código), `full` (avatar/pin).
4. **Dos familias y ninguna más.** `MainFont` (Schibsted Grotesk) para todo; `TitleFont` (Stick No Bills) solo display, **siempre en Light (300)**. No introducir una tercera sin aprobación.
5. **Un solo HEX por color.** Prohibido `rgb(54,228,82)` suelto: es `var(--verde)`.
6. **Light-only.** No hay modo oscuro ni tokens de tema. `StatusBar` siempre `dark`.
7. **No tocar copy ni estilos que Lucas escribió a mano** en `aso-portal` (regla del proyecto, no de este documento). La migración de tipos es cambio de familia, **no** de tamaños, textos ni alineaciones.
8. **Español, tuteo, sentence case.** Marca en minúsculas: `(aso)ciación de estudiantes de diseño de madrid`.

---

## 2. Tipografía

### Familias canónicas

| Token | Familia | Archivo (`src/fonts/…`) | Ejes | Uso |
|---|---|---|---|---|
| `MainFont` / `--font-body` | **Schibsted Grotesk** | `Schibsted_Grotesk/SchibstedGrotesk-VariableFont_wght.ttf` | `wght 200–900`, itálica | body, UI, botones, chips, `h3`, `h4`, footer |
| `TitleFont` / `--font-display` | **Stick No Bills** | `Stick_No_Bills/StickNoBills-VariableFont_wght.ttf` | `wght 200–800` en el fichero, **la cara se declara solo `300` (Light)**; sin itálica | `h1`, `h2`, GranBoton, fecha del ticket |
| iconos | **Material Symbols Outlined** | Google Fonts / vendorizada en app | `FILL wght GRAD opsz` | navegación, flechas, estados |

`Mozilla_Headline` está en `src/fonts/` **sin `@font-face` ni uso**: no es parte del sistema.

### Escala — cada superficie conserva la suya

La migración es **de familia, no de tamaño**. No reescales layouts al cambiar la fuente.

| Elemento | aedm (web) | portal | app |
|---|---|---|---|
| `h1` | `60px` → `40px` ≤600px | `--text-2xl` `clamp(2rem, 1.5rem + 2vw, 3rem)` | `30` (`h1` de `StyleSheet`) |
| `h2` | `40px` → `28px` ≤600px | `--text-lg` según contexto | `30` |
| `h3` | `1.6em` (25.6px) + borde `2px` verde | `--text-lg` | `26` |
| `h4` | `1.6em` + `text-indent: 30px` | — | — |
| body | `16px` | `--text-base` `clamp(1rem, .95rem + .25vw, 1.125rem)` | `16` |
| botón | `16px` Main | `--text-base` 500 | `16` |
| GranBoton | `23px` 300 Title | `23px` 300 Title | `20` Title (Light) |
| eyebrow | `10px` 600 `uppercase` `.12em` gris4 | `--text-xs` `.08em` uppercase | `10` `letterSpacing 1.2` |
| ticket (fecha) | `38px` → `31px` Title | — | — |
| banda | `16px` Main | — | `20px` mono → pasa a `16` Main |

Pesos disponibles: `300` light (**único peso del display**), `400` regular (defecto del body), `500` medium (chips, labels de botón portal), `600` semibold (eyebrows, section titles). **No hay 700+ en uso.**

**El display no admite pesos:** la cara de `TitleFont` se declara con `font-weight: 300` y nada más. Cualquier petición de 400/500 cae en Light sin síntesis. Si alguien necesita un título más grueso, no se pide peso: se cambia a `MainFont`.

### Migración de tipos (lo que viene)

| Dónde | Hoy | Pasa a |
|---|---|---|
| `aedm.astro` `src/styles/main.css` | Schibsted + Stick No Bills | canónico: solo sustituir valores por `var()` de `tokens.css` |
| `aso-portal/public/styles/global.css` | `@font-face` **NeueMontreal** + **PKiko** | Schibsted + Stick No Bills, **mismas claves `MainFont`/`TitleFont`** → el resto del CSS no se toca |
| `aso-portal/public/fonts/` | `NeueMontreal-Regular.ttf`, `PKiko-Regular.otf` | borrar; añadir las dos variables |
| `aso-app/src/app/_layout.tsx` | `useFonts` NeueMontreal / PKiko / **PKikoItalic** | Schibsted (Regular/Medium/SemiBold/Italic) + **StickNoBills-Light**; **eliminar `TitleFontItalic`** (Stick No Bills no tiene itálica) |
| `aso-app/assets/fonts/` | PKiko*, NeueMontreal | Schibsted, StickNoBills; conservar `UbuntuMono-Regular.ttf` y `MaterialSymbols_300Light.ttf` |

Notas de ejecución:

- **RN no resuelve bien ejes variables en Android.** Usar instancias estáticas: `SchibstedGrotesk-Regular.ttf` + `-Medium` + `-SemiBold` + `-Italic`, `StickNoBills-Regular.ttf`. Web sí puede usar la variable (idealmente convertida a `woff2` con `fonttools`).
- Stick No Bills es **más condensada** que PKiko: tras el swap, revisar que ningún `h1`/`h2` parta línea rara. **No cambiar tamaños para "arreglarlo"** sin aprobación.
- Stick No Bills no tiene itálica: en la app el énfasis display va con `fonts.mainItalic` (Schibsted cursiva). `fonts.titleItalic` **ya no existe**.
- `UbuntuMono` se queda **solo en la app** (etiquetas de Materioteca, banda). En web el mono es `--font-mono` y solo para código.

### Estado (migración ya ejecutada)

| Repo | Cambios aplicados |
|---|---|
| `aso-portal` | `public/fonts/`: +3 variables, −12 ficheros (NeueMontreal/PKiko). `public/styles/global.css`: 3 `@font-face` con `font-display: swap`; MainFont `200 900`, **TitleFont fijado a `300`**. `.page-title`, GranBoton, login y admin en `font-weight: 300`. Claves `MainFont`/`TitleFont` intactas → cero cambios en componentes. `DMMono` sigue en `public/fonts` sin uso. |
| `aso-app` | `assets/fonts/`: +5 estáticas, −3 ficheros. `src/app/_layout.tsx`: `useFonts` con `MainFont`, `MainFontMedium`, `MainFontSemiBold`, `MainFontItalic`, `TitleFont` (**StickNoBills-Light.ttf**, peso 300). `src/styles/globalStyles.ts`: `fonts` sin `titleItalic`, con las nuevas claves. `AddLinkSheet.tsx`: `headingItalic` → `fonts.mainItalic`. |
| `aedm.astro` | sin cambios de código: es el origen de las fuentes y `docs/tokens.css` ya las declara |

---

## 3. Color

Primitivos — únicos HEX permitidos:

| Token | Hex | Rol | Usos en aedm |
|---|---|---|---|
| `--verde` | `#36E452` | acción, marca, superficies destacadas | 28 |
| `--negro` | `#040406` | texto, acción secundaria, texto sobre verde | 20 |
| `--blanco` | `#FDFDFD` | fondo | 11 |
| `--gris4` | `#777777` | texto secundario, enlaces dentro de `h3`/`h4` | 8 |
| `--gris3` | `#AFAFAF` | separadores, troquel, tab apagado | 5 |
| `--rojo` | `#FE3D46` | **solo error**: banner, monitor caído, aviso | 4 |
| `--gris2` | `#E5E5E5` | bordes de superficie | 3 |
| `--azul` | `#3CADFF` | acento puntual (pin del plano, mesa) | 3 |
| `--gris5` | `#4B4B4B` | texto de detalle | 2 |
| `--gris1` | `#F7F7F7` | fondo sutil de superficie | 1 |
| `--lila` | `#BACEFB` | **sin uso** — no lo uses sin aprobación | 0 |

Semánticos (los componentes usan **estos**): `--color-bg`, `--color-text`, `--color-text-muted`, `--color-text-detail`, `--color-surface`, `--color-border`, `--color-divider`, `--color-primary`, `--color-primary-hover`, `--color-on-primary`, `--color-error`. Definidos en `tokens.css`.

Divergencias a resolver (valor canónico decidido):

| Dato | aedm | portal | app | Canónico |
|---|---|---|---|---|
| hover del verde | `#2BC943` | `#2BC744` | `#00A560` | **`#2BC943`** |
| gris extra | — | — | `gris6 #959595` (tab apagado) | **`--gris3`** |
| banner de cookies | `#2B373B` | `#2B373B` | — | **`--negro`** (sale de paleta hoy) |

Paleta **heredada de Notion** (solo `NotionBlocks.astro`, es mapeo del API, no marca): texto `#E03E3E`/`#D9730D`/`#DFAB01`/`#AD1A72`, fondos `#FDEBEC`/`#FEF3C0`/`#DDEDEA`/`#DDEBF1`/`#EAE4F2`/`#F4E6D4`/`#FBE4F0`. No exportar a otros componentes.

Contraste: negro sobre verde cumple AA a tamaños normales; **blanco sobre verde no**. Rojo solo sobre blanco.

---

## 4. Espaciado, estructura y forma

- **Escala** (múltiplos de 4): `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 64` → `--space-1…16`.
- **Contenido**: `--page-max: 800px` centrado. aedm `main`: `margin: 100px auto 20px`, `padding: 0 20px` (80px/16px ≤600px), `gap: 15px` → **normalizar a 16**.
- **NavBar**: fija, `80px`, degradado blanco `1 → .8 → .6 → 0` para no tapar contenido al hacer scroll.
- **Banda**: fija `top: 80px`, `30px` de alto, verde.
- **Footer**: verde a sangre, `margin-top: 8rem`, logo `90px`, contenido centrado a 800px.
- **Breakpoints**: `600` (tipografía y padding), `700` (nav móvil / carátulas), `768` (columnas). Usa estos tres y ninguno más.
- **Bordes**: superficie `1px --color-border`; sección `2px --color-primary`; separador `1px dashed --color-primary`; troquel `1px dashed --gris3`; campos del portal `1px` inferior negro.
- **Sombra**: el sistema es plano. Solo `--shadow-screen` (carrusel), `--shadow-pop` (modal/popup), `--shadow-pin` (pin de mapa).
- **Capas**: banda `90` · nav `100` · flotante `500` · modal `1000` · toast `1100` · cookies `9999`. (aedm usa `100000` y `10000000`: no copiar.)

---

## 5. Componentes

### `Boton` — acción de ancho completo
`width: 100%` · `padding: 10px` · `font: 400 16px MainFont` · `border: 0` · `radius: 0` · `min-height: 44px` (a11y).

| Variante | Fondo | Texto | Borde | Uso |
|---|---|---|---|---|
| `verde` (default) | `--verde` | `--negro` | — | acción principal ("ASÓciate") |
| `negro` | `--negro` | `--blanco` | — | secundaria fuerte ("Donar") |
| `outline` | transparente | `--verde` | `1px --verde` | redes, "Actividad Finalizada" |

Portal añade `ghost` = fondo transparente + borde `--color-border`: válido, es `outline` con borde neutro.

### `GranBoton` — bloque destacado con icono
`padding: 18px` · `display: flex` · `align-items: center` · texto `TitleFont 300 23px` (app `20`) · icono Material `24` (app `28`, `gap 18`, alto `55`).
Distribución por `orden`: `orden === 1` → `row` + `flex-start`; resto → `row-reverse` + `space-between`. Icono por defecto `arrow_outward`.
Portal añade modo `flotante`: `position: fixed; bottom: 0`, ancho `min(100% - 2·--space-8, --page-max - 2·--space-8)`, `padding-bottom: calc(--space-3 + safe-area-inset-bottom)`.

### `Chip` (filtros) y `Hashtag` (marquesina)
- **Chip**: `padding: 6px 14px` · `14px` · fondo `--verde` · `radius: 0` · hover `opacity .8`.
- **Hashtag**: `padding: 6px 12px` · `500 16px` · `radius: 20px` · hover/foco invierten a fondo `--negro` + texto `--verde`.
Es el **único** componente con `:focus-visible` resuelto en la web pública: úsalo como referencia.

### Título de sección clicable (`HClick`)
`h3` `1.6em` + `border-bottom: 2px --verde` + icono Material a la derecha en `flex` con `space-between`. Hover `opacity .7`; foco `outline 2px --verde; offset 4px`. `scroll-margin-top: 130px`.

En el portal el equivalente es `.section-title` (`--text-lg`, 600, `border-bottom: 1px --color-divider`). **No unificar sin preguntar**: son dos registros distintos (web pública vs. app web).

### Separadores
`MiniLine` = `1px dashed --color-primary` · `hr` = `1px solid --color-primary` · `.divider`.

### Tarjeta de evento (`Caratula`)
Fecha como `h3` clicable que copia `#DDMMAAAA` · `h2` título · descripción · botón (`verde` si activo, `outline` + "Actividad Finalizada" si pasó) · imagen `300px` a la derecha; ≤700px `column-reverse` con imagen al 100%.

### Ticket (mercadillo)
`min(100%, 360px)` · borde `1px --gris2` · eyebrow `10/600/.12em` · fecha `38px Title` · detalle `14px --gris5` (segundo `13px --gris4`) · stub inferior `--verde` con `border-top: 1px dashed --gris3` y dos muescas circulares de `15px` (**:before/**:after** a `-8px`) · `radius: 0`.

### Tarjeta de calendario (portal)
`flex` · `gap: 16` · fondo `--verde` · borde `1px --color-divider` · `padding: 12px 16px` · bloque fecha (día grande + mes) + título + meta `·` estado. Hover: fondo `--gris2` cuando es firmable.

### Campos de formulario (portal)
Borde inferior `1px --negro` (no caja completa) · label eyebrow `12/600/uppercase/.08em` en `--gris4` · input `--text-lg` · `:focus { border-bottom-color: --verde }` · `outline: none`. Badge `10/600/uppercase` fondo `--gris2`.
aedm usa caja completa `1px #ccc` en `reclama.astro`: **excepción legacy**, no extenderla.

### Modal
Overlay `rgba(0,0,0,.5)` · contenido `--color-bg`, `padding: 24`, `radius: 0`, `max-width: 500px`, `max-height: 90vh`, `overflow-y: auto` · cabecera `space-between` · acciones `flex gap 12`.

### Banner de cookies
Fijo abajo, `--negro` (hoy `#2B373B`), texto blanco `14px`, botón `--verde` `padding 8px 18px`, `z-index: 9999`. Sin tracking; portal usa `localStorage`, aedm cookie `cookieConsent`.

### Banda / marquesina
Alto `30px`, fondo `--verde`, texto repetido **6 veces**, `padding-right: 2rem`, `translateX` lineal `20s infinite`, sin foco. Debe respetar `prefers-reduced-motion` (aedm aún no lo hace: deuda).

---

## 6. Estados e interacción

| Estado | Regla canónica |
|---|---|
| hover claro | `opacity: .7` sobre el elemento (títulos, chips, footer) |
| hover de color | `background: --verde-hover` (`#2BC943`), `--transition: 150ms ease` |
| foco teclado | **siempre** `outline: 2px solid --verde; outline-offset: 4px` (nunca `outline: none` sin sustituto) |
| activo/pulsado | icono del menú `rotate(90deg)` `100ms cubic-bezier(.075,.82,.165,1)` |
| disabled | `opacity: .45`, `cursor: not-allowed`, sin hover |
| área táctil | mínimo `44×44` en cualquier superficie táctil |
| cargas | sin skeletons inventados: mantener layout y `opacity` del contenedor |

Hoy solo `HClick` y `.hashtag` cumplen foco visible en la web pública. Al tocar cualquier interactivo, arréglalo.

---

## 7. Voz y copy

- Español de España, tuteo, sin anglicismos innecesarios.
- Marca en minúsculas con paréntesis: `(aso)ciación de estudiantes de diseño de madrid`. El juego `ASO` / `ASÓciate` / `mueblaso` / `pingpongaso` / `demasiadorapido` es identidad: mantenlo.
- Títulos en sentence case, sin punto final. CTA en imperativo y cortos: "ASÓciate", "Donar", "Ver más posts", "Inscríbete".
- Errores: mensaje del servidor tal cual, nunca "Error de red" genérico.
- Nada de emoji en UI.

---

## 8. Checklist de aceptación (verificable)

```bash
# 1. Ninguna familia fuera de MainFont/TitleFont (ni NeueMontreal, ni PKiko)
grep -rn "NeueMontreal\|PKiko\|TitleFontItalic" src public

# 2. Ningún HEX fuera de tokens (solo permitido en tokens.css / globalStyles.ts)
grep -rnE "#[0-9a-fA-F]{3,8}" src --include=*.astro --include=*.css | grep -v tokens

# 3. Ningún rgb(54,...) suelto (debe ser var(--verde))
grep -rn "rgb(54" src public

# 4. Radios solo en la lista permitida (0/4/20/22/50%)
grep -rn "border-radius" src public
```

- [ ] 0 referencias a NeueMontreal / PKiko.
- [ ] `h1`/`h2`/GranBoton/fechas en `TitleFont` **peso 300**; todo lo demás en `MainFont`.
- [ ] 0 HEX fuera de `tokens.css` (web) y `globalStyles.ts` (app).
- [ ] 0 `rgb(54, 228, 82)`, 0 `#2BC744`, 0 `#00A560`, 0 `#2B373B`.
- [ ] Ningún radio nuevo fuera de `0 / 4 / 20 / 22 / 50%`.
- [ ] Todo interactivo tiene `:focus-visible` y ≥44px de área táctil.
- [ ] Texto sobre verde = `--negro` en todo el árbol.
- [ ] Ningún modo oscuro introducido.
- [ ] Copy sin cambios de texto, alineación ni jerarquía respecto al original.

---

## 9. Deuda conocida (no arreglar "de paso")

| # | Dónde | Problema | Arreglo |
|---|---|---|---|
| 1 | `NavBar.astro:58` | `var(--black)` no existe (el token es `--negro`) | `var(--negro)` |
| 2 | `NavBar.astro:86` | falta `;` tras `padding: 0` | añadirlo |
| 3 | `GranBoton.astro`, cookies, `.info-box` | verde como `rgb(54,228,82)` | `var(--verde)` |
| 4 | `Boton.astro` | sin hover ni foco | estados del §6 |
| 5 | `main.css` | sin tokens de espacio/tipografía | consumir `tokens.css` |
| 6 | `main.css` | `h1` centrado y sobreescrito inline en portada | prop/variante |
| 7 | `NavBar.astro` | sin estado de página activa | `aria-current` + subrayado |
| 8 | `Banda.astro` | no respeta `prefers-reduced-motion` | pausar animación |
| 9 | `--lila` | definido sin uso | borrar o asignar rol |
| 10 | `src/fonts/Mozilla_Headline/` | 30 ficheros sin cargar | borrar |
| 11 | app | `gris6`, `verdeOscuro: #00a560` | alias a `--gris3` / `#2BC943` |

Ninguno requiere rediseño: son cambios de token o de una línea.
