import Image from "next/image";
import { footer, type SiteSocials } from "@/content/site";

/*
 * Ряд иконок: MAX, Telegram, ВКонтакте и почта. Стоит в подвале и, с 19.11,
 * в шапке слева от телефонов (Анна). Файлы иконок мессенджеров взяты из
 * макета без изменений, иконка почты нарисована в том же стиле.
 * Ссылки из админки («Настройки»); иконка без ссылки не показывается.
 * Мессенджеры открываются в новой вкладке, почта (mailto:) открывает
 * почтовую программу, новая вкладка ей не нужна.
 */
export function Socials({
  urls,
  className = "",
  size = 24,
}: {
  urls: SiteSocials;
  className?: string;
  size?: number;
}) {
  const items = footer.socials.filter((item) => urls[item.key]);
  if (items.length === 0) return null;
  return (
    <ul className={`flex ${className}`}>
      {items.map((item) => {
        const href = urls[item.key] ?? undefined;
        const mail = href?.startsWith("mailto:");
        return (
          <li key={item.label}>
            <a
              href={href}
              aria-label={item.label}
              {...(mail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="block transition-opacity hover:opacity-80"
            >
              <Image
                src={item.icon}
                alt=""
                width={size}
                height={size}
                unoptimized
                style={size !== 24 ? { width: size, height: size } : undefined}
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
