import type { NextConfig } from "next";

/*
 * Сайт на телефоне во время разработки.
 * Телефон открывает сайт по адресу компьютера в домашней сети, например
 * 192.168.1.5:3000. Сервер разработки Next.js по умолчанию принимает
 * служебные запросы только с localhost, а с другого адреса отказывает: без
 * них страница на телефоне не оживает, и ни одна кнопка не работает.
 * Здесь разрешены все адреса домашних и офисных сетей: 10.x.x.x,
 * 172.16.x.x до 172.31.x.x и 192.168.x.x. На собранный сайт это не влияет,
 * настройка действует только в режиме разработки.
 */
const homeNetworks = [
  "10.*.*.*",
  "192.168.*.*",
  ...Array.from({ length: 16 }, (_, i) => `172.${16 + i}.*.*`),
];

const nextConfig: NextConfig = {
  allowedDevOrigins: homeNetworks,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
