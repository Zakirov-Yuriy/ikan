import localFont from "next/font/local";

/*
 * Шрифты лежат в проекте (app/fonts) и отдаются с нашего же сайта:
 * сборка и работа сайта не зависят от серверов Google.
 *
 * Каждый шрифт разбит на два файла, латиница и кириллица. Браузер сам
 * скачивает только тот, символы которого есть на странице (unicode-range).
 * Оба файла вариативные: в одном файле все начертания сразу.
 *
 * Значения записаны прямо в вызовах, без общих переменных: так требует
 * next/font, он читает настройки шрифта до запуска кода.
 */

// Заголовки: Manrope
export const manropeLatin = localFont({
  src: "./fonts/manrope-latin.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--font-manrope-latin",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

export const manropeCyrillic = localFont({
  src: "./fonts/manrope-cyrillic.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--font-manrope-cyrillic",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
    },
  ],
});

// Основной текст, меню, кнопки: Onest
export const onestLatin = localFont({
  src: "./fonts/onest-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-onest-latin",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

export const onestCyrillic = localFont({
  src: "./fonts/onest-cyrillic.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-onest-cyrillic",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
    },
  ],
});

export const fontVariables = [
  manropeLatin.variable,
  manropeCyrillic.variable,
  onestLatin.variable,
  onestCyrillic.variable,
].join(" ");
