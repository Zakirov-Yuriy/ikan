import Link from "next/link";

export type Crumb = { label: string; href: string };

type Props = {
  crumbs: Crumb[];
  /* Последний пункт, то есть текущая страница, выделен полужирным, как в макете апартамента */
  strongLast?: boolean;
  /* Цвет текста: серый на светлом фоне или светлый на тёмном */
  tone?: "muted" | "light";
  className?: string;
};

const tones = {
  muted: { text: "text-muted", link: "hover:text-accent" },
  light: { text: "text-[#d8d8d8]", link: "hover:text-white" },
};

/* Путь по сайту над заголовком: «Главная / Раздел / Страница» */
export function Breadcrumbs({
  crumbs,
  strongLast = false,
  tone = "muted",
  className = "",
}: Props) {
  return (
    <nav
      aria-label="Путь по сайту"
      className={`text-[10px] leading-[15px] ${tones[tone].text} ${className}`}
    >
      {crumbs.map((crumb, index) => (
        <span key={crumb.label}>
          {index > 0 && " / "}
          {crumb.href ? (
            <Link
              href={crumb.href}
              className={`transition-colors ${tones[tone].link}`}
            >
              {crumb.label}
            </Link>
          ) : (
            <span
              aria-current="page"
              className={strongLast ? "font-semibold" : undefined}
            >
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
