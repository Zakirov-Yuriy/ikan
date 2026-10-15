import { BACKEND_URL } from "@/lib/api";

/*
 * Приём заявки с форм сайта. Браузер посетителя отправляет её сюда, на
 * свой же сайт, а сервер сайта передаёт в бэкенд (POST /api/requests).
 * Так бэкенд не нужно открывать наружу, и с телефона в домашней сети всё
 * работает: телефон видит только сайт.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json(
      { ok: false, message: "Не удалось прочитать данные формы." },
      { status: 400 },
    );
  }

  /* Адрес посетителя для бэкенда: по нему он ограничивает число заявок в минуту */
  const visitorIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "";

  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}/api/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": request.headers.get("user-agent") ?? "",
        ...(visitorIp ? { "X-Forwarded-For": visitorIp } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { ok: false, message: "Сервер заявок не отвечает." },
      { status: 502 },
    );
  }

  if (response.status === 422) {
    const data = (await response.json()) as {
      message?: string;
      errors?: Record<string, string[]>;
    };
    const messages = Object.values(data.errors ?? {}).flat();
    /* Ошибка в полях это обычный ответ, а не сбой: без красной строки в консоли */
    return Response.json({
      ok: false,
      message: messages.length
        ? messages.join(" ")
        : (data.message ?? "Проверьте поля формы."),
    });
  }
  if (response.status === 429) {
    return Response.json({
      ok: false,
      message: "Слишком много заявок подряд. Подождите минуту.",
    });
  }
  if (!response.ok) {
    return Response.json(
      { ok: false, message: `Сервер заявок ответил ${response.status}.` },
      { status: 502 },
    );
  }
  return Response.json({ ok: true });
}
