"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckCircleIcon } from "@/components/ui/icons";
import { requestStatus } from "@/content/site";
import { Modal, useDesktop } from "./Modal";

/*
 * Подтверждение «Заявка отправлена» (Анна, 16.10: после «Отправить» было
 * непонятно, ушла ли заявка). Содержимое общее: в окне заявки оно встаёт на
 * место формы, после формы в подвале открывается отдельным небольшим окном.
 */
export function RequestSentContent({
  titleId,
  onDone,
}: {
  titleId: string;
  onDone: () => void;
}) {
  /*
   * В окне заявки форма с кнопкой «Отправить» пропадает, вместе с ней ушёл бы
   * фокус, и Escape перестал бы закрывать окно. Поэтому фокус на «Хорошо».
   */
  const done = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    done.current?.focus();
  }, []);

  return (
    <div role="status" className="flex flex-col items-center text-center">
      <span className="grid size-14 place-items-center rounded-full bg-[#edf7fc] text-accent">
        <CheckCircleIcon className="size-7" />
      </span>
      <h2
        id={titleId}
        className="mt-5 font-display text-[26px] leading-[28.6px] font-medium tracking-[-0.04em] text-ink"
      >
        {requestStatus.sentTitle}
      </h2>
      <p className="mt-3 max-w-[320px] text-[13px] leading-[21px] text-muted">
        {requestStatus.sentText}
      </p>
      <button
        ref={done}
        type="button"
        onClick={onDone}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-[10px] bg-navy text-[16px] leading-6 font-medium text-white transition-colors hover:bg-ink"
      >
        {requestStatus.sentButton}
      </button>
    </div>
  );
}

/* Состояние отдельного окна: открыть после отправки, закрыть с анимацией */
export function useRequestSent() {
  const [state, setState] = useState<"closed" | "open" | "closing">("closed");
  return {
    show: () => setState("open"),
    dialog:
      state === "closed" ? null : (
        <RequestSentDialog
          state={state}
          onClose={() => setState("closing")}
          onClosed={() => setState("closed")}
        />
      ),
  };
}

function RequestSentDialog({
  state,
  onClose,
  onClosed,
}: {
  state: "open" | "closing";
  onClose: () => void;
  onClosed: () => void;
}) {
  const titleId = useId();
  const desktop = useDesktop();
  /* На компьютере небольшое окно по центру, на телефоне выезжает снизу, как окно заявки */
  const look = desktop
    ? {
        wrap: "items-center p-4",
        panel:
          "modal-panel max-h-full max-w-[400px] rounded-[20px] px-10 pt-[44px] pb-8",
        close: "top-[18px] right-[18px] size-[38px]",
      }
    : {
        wrap: "items-end",
        panel:
          "sheet-panel max-h-[calc(100dvh-16px)] rounded-t-[20px] px-5 pt-10 pb-[calc(16px+env(safe-area-inset-bottom))] sm:max-w-[480px]",
        close: "top-3 right-3 size-11",
      };

  return (
    <Modal
      state={state}
      labelledBy={titleId}
      onClose={onClose}
      onClosed={onClosed}
      look={look}
    >
      <RequestSentContent titleId={titleId} onDone={onClose} />
    </Modal>
  );
}
