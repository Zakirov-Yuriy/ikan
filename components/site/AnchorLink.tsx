"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

type Props = ComponentProps<typeof Link> & { href: string };

/*
 * Ссылка на блок страницы, например «/#about» («О компании» ведёт к блоку
 * посередине главной). С другой страницы это обычный переход: Next открывает
 * главную и сам прокручивает к блоку. Если блок есть на текущей странице,
 * страница просто прокручивается к нему, даже когда адрес уже «/#about»
 * (обычная ссылка в этом случае ничего бы не сделала).
 */
export function AnchorLink({ href, onClick, ...rest }: Props) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const hash = href.split("#")[1];
    const target = hash ? document.getElementById(hash) : null;
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", `#${hash}`);
  }

  return <Link href={href} onClick={handleClick} {...rest} />;
}
