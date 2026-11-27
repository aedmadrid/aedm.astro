/**
 * ASO — tokens canónicos para superficies TS/React Native (aso-app).
 * Espejo de docs/tokens.css. Ver docs/sistema-de-diseno.md.
 *
 * Regla: ningún componente escribe un HEX, un fontSize ni un padding a mano.
 * Todo sale de aquí. Si falta algo, se añade al token y luego se usa.
 */

/** Familias. En `app/_layout.tsx` se cargan con estos MISMOS nombres. */
export const fonts = {
  /** Schibsted Grotesk (variable). Body, UI, botones, chips. */
  main: "MainFont",
  /** Stick No Bills (variable). Solo display: h1/h2, GranBoton, fechas. */
  title: "TitleFont",
  /** Mono auxiliar de la app (etiquetas, hashtags, banda). No existe en web. */
  mono: "UbuntuMono",
  /** Material Symbols Outlined (vendorizada en assets/fonts). */
  symbols: "MaterialSymbols_300Light",
} as const;

/**
 * Carga en `app/_layout.tsx`. Instancias estáticas: los ejes variables no se
 * resuelven de forma fiable en Android. Stick No Bills NO tiene itálica: el
 * énfasis display usa la itálica de Schibsted (`mainItalic`).
 */
export const fontFiles = {
  MainFont: "@/assets/fonts/SchibstedGrotesk-Regular.ttf",
  MainFontMedium: "@/assets/fonts/SchibstedGrotesk-Medium.ttf",
  MainFontSemiBold: "@/assets/fonts/SchibstedGrotesk-SemiBold.ttf",
  MainFontItalic: "@/assets/fonts/SchibstedGrotesk-Italic.ttf",
  TitleFont: "@/assets/fonts/StickNoBills-Light.ttf",
  UbuntuMono: "@/assets/fonts/UbuntuMono-Regular.ttf",
  MaterialSymbols_300Light: "@/assets/fonts/MaterialSymbols_300Light.ttf",
} as const;

/** Primitivos. Los únicos HEX permitidos en la app. */
export const colors = {
  verde: "#36e452",
  azul: "#3cadff",
  lila: "#bacefb",
  rojo: "#fe3d46",
  negro: "#040406",
  blanco: "#fdfdfd",
  gris1: "#f7f7f7",
  gris2: "#e5e5e5",
  gris3: "#afafaf",
  gris4: "#777777",
  gris5: "#4b4b4b",
} as const;

/** Derivados: solo estados. Antes `verdeOscuro: "#00a560"` (era otro verde). */
export const stateColors = {
  verdeHover: "#2bc943",
  overlay: "rgba(0, 0, 0, 0.5)",
} as const;

/** Semántico: los componentes usan esto, no los primitivos. */
export const theme = {
  bg: colors.blanco,
  text: colors.negro,
  textMuted: colors.gris4,
  textDetail: colors.gris5,
  surface: colors.gris1,
  border: colors.gris2,
  borderStrong: colors.negro,
  divider: colors.gris2,
  primary: colors.verde,
  primaryHover: stateColors.verdeHover,
  onPrimary: colors.negro,
  error: colors.rojo,
  /** Sustituye a `gris6` (#959595) del tab bar apagado. */
  tabInactive: colors.gris3,
} as const;

/**
 * Escala tipográfica. La app CONSERVA sus tamaños actuales (migración solo de
 * familia); `display` y `title` son los valores web de referencia.
 */
export const type = {
  eyebrow: 10, // uppercase, letterSpacing 1.2, textMuted
  xs: 12,
  sm: 13,
  body: 16,
  lg: 18,
  xl: 20,
  h3: 26, // ≈ 1.6em
  h2: 30,
  h1: 30, // app; web pública usa 40 (móvil) / 60 (desktop)
  display: 40,
  band: 16, // la banda pasa de mono 20 a main 16
} as const;

export const weights = {
  /** Único peso del display (TitleFont). */
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
} as const;

/** Múltiplos de 4. `space.4` = 16. */
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  16: 64,
} as const;

/** Esquinas rectas por defecto. */
export const radius = {
  none: 0,
  xs: 4, // bloques de código
  pill: 20, // hashtags
  screen: 22, // carrusel
  full: 999,
} as const;

/** Estructura y medidas de componentes (dp). */
export const size = {
  pageMax: 800,
  nav: 80,
  band: 30, // aedm: 30 · app usaba 28
  boton: { padding: 10, fontSize: 16, minHeight: 44 },
  granBoton: { height: 55, paddingHorizontal: 18, gap: 18, fontSize: 20 },
  icon: 24,
  granBotonIcon: 28,
  touchMin: 44, // área táctil mínima, siempre
} as const;

export const motion = {
  fast: 150,
  normal: 200,
  menu: 800,
} as const;
