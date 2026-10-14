"use client";

import { useEffect, useState } from "react";
import type { ShareResult } from "@/lib/share";

/* Тексты сообщения над кнопкой «Поделиться» */
const texts: Record<ShareResult, string> = {
  shared: "",
  cancelled: "",
  copied: "Ссылка скопирована",
  failed: "Не удалось скопировать ссылку",
};

/*
 * Сообщение над кнопкой «Поделиться»: появляется на две с половиной секунды
 * после копирования адреса. Читается программами чтения с экрана как
 * сообщение о состоянии.
 */
export function useShareNotice() {
  const [result, setResult] = useState<ShareResult | null>(null);

  useEffect(() => {
    if (!result) return;
    const timer = window.setTimeout(() => setResult(null), 2500);
    return () => window.clearTimeout(timer);
  }, [result]);

  return { notice: result ? texts[result] : "", show: setResult };
}

export function ShareNotice({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none ${className}`}
    >
      {text && (
        <span className="share-notice inline-block rounded-[10px] bg-navy px-[14px] py-[9px] text-[12px] leading-[16px] font-medium whitespace-nowrap text-white shadow-[0_6px_20px_rgba(8,34,52,0.27)]">
          {text}
        </span>
      )}
    </div>
  );
}
