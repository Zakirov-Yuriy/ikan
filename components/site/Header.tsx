import Image from "next/image";
import Link from "next/link";
import { PhoneIcon } from "@/components/ui/icons";
import { mainNav, site } from "@/content/site";
import { getSettings } from "@/lib/api";
import { AnchorLink } from "./AnchorLink";
import { MobileMenu } from "./MobileMenu";
import { RequestLink } from "./RequestPopup";
import { Socials } from "./Socials";

/*
 * Шапка. Телефоны из админки («Настройки»): на компьютере оба столбиком
 * (16.10), меню телефона звонит на главный. Слева от телефонов те же иконки,
 * что в подвале: MAX, Telegram, ВКонтакте, почта (Анна, 19.11); на телефоне
 * они стоят слева от трёх полосок меню и остаются, когда меню открыто.
 */
export async function Header() {
  const { phone, phones, socials } = await getSettings();

  return (
    <header className="relative z-40 border-b border-[#eceeef] bg-white">
      <div className="flex h-[59px] items-center justify-between pr-[11px] pl-3 lg:h-[71px] lg:px-5">
        <Link href="/" aria-label={`${site.name}, на главную`} className="shrink-0">
          <Image
            src="/images/logo.svg"
            alt={site.name}
            width={77}
            height={16}
            unoptimized
            preload
            className="h-[14.4px] w-auto lg:h-4"
          />
        </Link>

        {/* Меню для компьютера */}
        <nav aria-label="Основное меню" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-[25px] text-[13px] leading-[19.5px] text-ink">
            {mainNav.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  // AnchorLink: «О компании» прокручивает к блоку на главной
                  <AnchorLink href={item.href} className="transition-colors hover:text-accent">
                    {item.label}
                  </AnchorLink>
                ) : (
                  // Пункт без адреса виден, но не нажимается
                  <span className="cursor-default">{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden shrink-0 items-center gap-[15px] lg:flex">
          <Socials urls={socials} className="gap-[10px]" size={22} />
          <div className="flex items-center gap-[7px] text-[13px] leading-5">
            <PhoneIcon className="size-[15px] shrink-0 text-ink" />
            <div className="flex flex-col">
              {phones.map((item) => (
                <a key={item.href} href={item.href} className="whitespace-nowrap transition-colors hover:text-accent">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          {/* Открывает окно заявки */}
          <RequestLink
            href={site.callbackHref}
            className="flex h-[41px] items-center rounded-[10px] bg-navy px-[19px] text-[12px] font-medium text-white transition-colors hover:bg-ink"
          >
            Оставить заявку
          </RequestLink>
        </div>

        {/* Меню для телефона: иконки слева от трёх полосок, список разделов раскрывает MobileMenu */}
        <div className="flex items-center gap-[6px] lg:hidden">
          <Socials urls={socials} className="gap-[8px]" size={20} />
          <MobileMenu nav={mainNav} phone={phone} />
        </div>
      </div>
    </header>
  );
}
