import Image from "next/image";
import { footer, site, type SiteSocials } from "@/content/site";
import { getSettings } from "@/lib/api";
import { AnchorLink } from "./AnchorLink";
import { CallbackForm } from "./CallbackForm";

/*
 * Подвал. Телефоны и ссылки иконок из админки («Настройки»).
 * formDesktopOnly: форма «Заказать обратный звонок» только на компьютере.
 * Так на странице инвестиций: в её макете для телефона формы в подвале нет
 * (Анна, 15.10). Кнопки заявки там открывают окно заявки (RequestPopup).
 */
export async function Footer({ formDesktopOnly = false }: { formDesktopOnly?: boolean }) {
  const { phones, socials } = await getSettings();

  return (
    <footer className="bg-navy text-navy-text">
      <div className="shell pt-[39px] pb-[28px] max-lg:w-[calc(100%-3.5rem)] lg:pt-[35px] lg:pb-[63px]">
        <div className="grid gap-y-[25px] md:grid-cols-3 md:gap-x-6 md:gap-y-9 lg:grid-cols-[255px_179px_189px_minmax(0,1fr)] lg:gap-x-0">
          <div className="max-md:mb-[5px]">
            <Image
              src="/images/logo-white.svg"
              alt={site.name}
              width={77}
              height={16}
              unoptimized
              className="h-4 w-auto"
            />
            <p className="mt-[14px] text-[12px] leading-[21px]">
              {footer.about.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p className="mt-[21px] text-[12px] leading-[21px]">
              <span className="block text-white">{footer.office.label}</span>
              {footer.office.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            {/* На телефоне и планшете иконки стоят здесь, между адресом и телефоном */}
            <Socials urls={socials} className="mt-[19px] gap-5 lg:hidden" />
            <div className="mt-5 lg:mt-[13px]">
              {phones.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block w-fit font-display text-[17px] leading-[23px] font-medium text-white transition-colors hover:text-sky"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn column={footer.columns[0]} />

          <div className="grid content-start gap-y-[24px] max-md:mt-[31px] lg:block">
            <FooterColumn column={footer.columns[1]} />
            <FooterColumn column={footer.columns[2]} className="lg:mt-[57px]" />
          </div>

          <div className={`max-md:mt-[26px] md:col-span-3 lg:col-span-1 ${formDesktopOnly ? "max-lg:hidden" : ""}`}>
            <CallbackForm form={footer.form} />
          </div>
        </div>

        {/* На компьютере иконки стоят под колонками, над линией */}
        <Socials urls={socials} className="mt-[50px] hidden gap-[14px] lg:flex" />

        <div className="mt-[24px] border-t border-[#313c44] pt-[30px] text-[12px] leading-[21px] max-lg:-mx-1 lg:-mx-[5.5px] lg:mt-[23px] lg:pt-[30px]">
          {footer.legal.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>
            {footer.contacts.label} {footer.contacts.email}
            {/* Номер целиком на одной строке, не разрывается на телефоне */}
            {phones.map((item) => (
              <span key={item.href}>
                {" · "}
                <span className="whitespace-nowrap">{item.label}</span>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}

/*
 * Ряд иконок соцсетей и мессенджеров. Файлы иконок взяты из макета без изменений.
 * Ссылки из админки, открываются в новой вкладке; иконка без ссылки не показывается.
 */
function Socials({ urls, className = "" }: { urls: SiteSocials; className?: string }) {
  const items = footer.socials.filter((item) => urls[item.key]);
  if (items.length === 0) return null;
  return (
    <ul className={`flex ${className}`}>
      {items.map((item) => {
        return (
          <li key={item.label}>
            <a
              href={urls[item.key] ?? undefined}
              aria-label={item.label}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-opacity hover:opacity-80"
            >
              <Image src={item.icon} alt="" width={24} height={24} unoptimized />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function FooterColumn({
  column,
  className = "",
}: {
  column: { title: string; links: { label: string; href: string }[] };
  className?: string;
}) {
  return (
    <nav aria-label={column.title} className={className}>
      <h2 className="font-display text-[10px] leading-[14px] font-bold tracking-[0.14em] text-sky uppercase">
        {column.title}
      </h2>
      <ul className="mt-[22.5px] grid gap-y-[14.5px] text-[13px] leading-[19.5px] text-white/58">
        {column.links.map((link) => (
          <li key={link.label} className="max-w-[190px]">
            {/* AnchorLink: «О компании» прокручивает к блоку на главной */}
            <AnchorLink href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </AnchorLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
