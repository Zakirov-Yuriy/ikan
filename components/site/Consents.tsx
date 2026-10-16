import { legalDocumentPath } from "@/content/documents";
import { consents } from "@/content/site";

/*
 * Три галочки под формами заявки (Саша, 16.10): условия соглашения и
 * политики, обработка персональных данных, реклама. Первые две обязательны
 * (без них браузер не отправит форму, бэкенд тоже проверяет), третья по
 * желанию. Ссылки на документы открываются в новой вкладке, чтобы не
 * потерять заполненную форму.
 *
 * look: dark в подвале (тёмный фон), light в окне заявки на компьютере,
 * lightMobile в окне заявки на телефоне.
 */
const looks = {
  dark: {
    list: "mt-[9px] grid gap-[10px] text-[11px] leading-[17.05px] text-white/66",
    check: "check",
    link: "consent-link",
    text: "pt-px",
  },
  light: {
    list: "mt-[6.5px] grid gap-[6px] text-[11px] leading-[17.05px] text-[#1e1e1e]",
    check: "check-light size-5 rounded-[5px] border-[#d0d0d0]",
    link: "border-b border-sky/45 pb-[2px] font-medium text-sky transition-colors hover:border-accent hover:text-accent",
    text: "pt-px",
  },
  lightMobile: {
    list: "mt-[11.5px] grid gap-[13px] text-[10px] leading-[15px] text-muted",
    check: "check-light",
    link: "consent-link-light",
    text: "",
  },
};

export function Consents({ look }: { look: keyof typeof looks }) {
  const style = looks[look];
  return (
    <div className={style.list}>
      {consents.map((consent) => (
        <label key={consent.name} className="flex gap-[10px]">
          <input
            type="checkbox"
            name={consent.name}
            required={consent.required}
            className={`shrink-0 ${style.check}`}
          />
          <span className={style.text}>
            {consent.parts.map((part, index) =>
              typeof part === "string" ? (
                <span key={index}>{part}</span>
              ) : (
                <a
                  key={index}
                  href={legalDocumentPath(part.document)}
                  target="_blank"
                  rel="noopener"
                  className={style.link}
                >
                  {part.label}
                </a>
              ),
            )}
          </span>
        </label>
      ))}
    </div>
  );
}
