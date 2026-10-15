"use client";

import { createContext, useContext, type ReactNode } from "react";
import { site, type SiteSettings } from "@/content/site";

/*
 * Общие настройки из админки (телефон) для частей сайта, которые работают в
 * браузере: полоса внизу на телефоне, закреплённые кнопки, тексты форм.
 * Значение задаёт app/layout.tsx, получив его из бэкенда один раз на запрос.
 */
const SiteSettingsContext = createContext<SiteSettings>({ phone: site.phone });

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteSettings;
  children: ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}
