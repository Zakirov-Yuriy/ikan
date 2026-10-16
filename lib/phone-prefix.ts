import type { ClipboardEvent, FocusEvent } from "react";

/*
 * Поле телефона в формах заявки (Анна, 16.10): при первом нажатии в пустое
 * поле само появляется «+7 », курсор встаёт после него. Код страны можно
 * стереть и написать другой, например +381. Если человек ушёл из поля, так
 * ничего и не набрав, «+7» убирается: снова видна подсказка, и пустое поле
 * не пройдёт как заполненное.
 */
export const PHONE_PREFIX = "+7 ";

export const phonePrefix = {
  onFocus(event: FocusEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    if (input.value !== "") return;
    input.value = PHONE_PREFIX;
    /* На телефоне курсор ставится после появления клавиатуры, поэтому в следующем кадре */
    requestAnimationFrame(() => {
      if (document.activeElement === input) {
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });
  },
  /*
   * Вставка номера целиком: если в поле только «+7 », а вставляют номер со
   * своим кодом (+7..., +381...) или российский с 8 или 7 в начале, вставленный
   * номер заменяет «+7 », чтобы не получилось «+7 +7 ...».
   */
  onPaste(event: ClipboardEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    if (input.value !== PHONE_PREFIX) return;
    const text = event.clipboardData.getData("text").trim();
    const digits = text.replace(/\D/g, "");
    const full =
      text.startsWith("+") || (/^[78]/.test(digits) && digits.length === 11);
    if (!full) return;
    event.preventDefault();
    input.value = text;
  },
  onBlur(event: FocusEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    if (input.value.trim() === PHONE_PREFIX.trim()) input.value = "";
  },
};

/* Только «+7» без цифр номера считается пустым полем (например, если нажали Enter, не уходя из поля) */
export function isOnlyPrefix(value: string): boolean {
  return value.trim() === PHONE_PREFIX.trim();
}
