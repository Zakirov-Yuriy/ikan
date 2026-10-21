import { BACKEND_URL } from "@/lib/api";

/*
 * Просмотр страницы для «Статистики» в админке (21.10). Браузер сообщает
 * сюда, сервер сайта передаёт в бэкенд (POST /api/views) вместе с адресом
 * посетителя и браузером: из них бэкенд делает обезличенный код на день,
 * сам адрес не хранится. Ответ всегда пустой, ошибки посетителю не важны.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 204 });
  }

  const visitorIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "";

  try {
    await fetch(`${BACKEND_URL}/api/views`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": request.headers.get("user-agent") ?? "",
        ...(visitorIp ? { "X-Forwarded-For": visitorIp } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    /* бэкенд спит или недоступен: просмотр просто не посчитается */
  }
  return new Response(null, { status: 204 });
}
