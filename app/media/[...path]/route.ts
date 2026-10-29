import { BACKEND_URL } from "@/lib/api";

/*
 * Фото с бэкенда под адресом сайта. Бэкенд хранит фото в public/media и
 * присылает адреса {APP_URL}/media/..., сайт оставляет от них только путь
 * (lib/api.ts, mediaSrc). Запрос /media/... к сайту попадает сюда: файл
 * забирается у бэкенда по BACKEND_URL (внутренний адрес на сервере) и
 * отдаётся посетителю. Так же сюда ходит next/image, когда сжимает картинку.
 * Поэтому бэкенд на хостинге может быть закрыт снаружи, а APP_URL в нём не
 * влияет на фото. Сделано обработчиком, а не правилом rewrites в
 * next.config.ts: обработчик часть приложения и работает в любой сборке.
 */

export const dynamic = "force-dynamic";

/* Заголовки файла, которые передаются посетителю как есть */
const passHeaders = ["content-type", "content-length", "last-modified", "etag"];

export async function GET(
  request: Request,
  context: RouteContext<"/media/[...path]">,
) {
  const { path } = await context.params;
  const target = `${BACKEND_URL}/media/${path.map(encodeURIComponent).join("/")}`;

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      cache: "no-store",
      headers: conditional(request),
    });
  } catch {
    return new Response(`Бэкенд не отвечает по адресу ${BACKEND_URL}`, {
      status: 502,
    });
  }

  if (upstream.status === 304) {
    return new Response(null, { status: 304, headers: fileHeaders(upstream) });
  }
  if (!upstream.ok || !upstream.body) {
    return new Response("Файл не найден", {
      status: upstream.status === 404 ? 404 : 502,
    });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: fileHeaders(upstream),
  });
}

/* Если браузер уже видел файл, бэкенд может ответить 304 вместо файла */
function conditional(request: Request): HeadersInit {
  const headers: Record<string, string> = {};
  const since = request.headers.get("if-modified-since");
  const etag = request.headers.get("if-none-match");
  if (since) headers["if-modified-since"] = since;
  if (etag) headers["if-none-match"] = etag;
  return headers;
}

function fileHeaders(upstream: Response): Headers {
  const headers = new Headers();
  for (const name of passHeaders) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  /* Фото меняются редко; сутки в кэше браузера, неделю можно показывать старое, пока обновляется */
  headers.set(
    "cache-control",
    "public, max-age=86400, stale-while-revalidate=604800",
  );
  return headers;
}
