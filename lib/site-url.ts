/*
 * Полный адрес сайта: SITE_URL из настроек хостинга, без него боевой адрес.
 * Нужен там, где адрес должен быть полным: карта сайта, robots.txt.
 */
export const SITE_URL = (process.env.SITE_URL ?? "https://ik-ikan.ru").replace(
  /\/+$/,
  "",
);
