/*
 * Проверка номера телефона в формах заявки (Анна, 16.10): цифр должно быть
 * столько, сколько бывает в номерах этой страны (по коду после «+»), без кода
 * номер считается российским. Существует ли номер, не проверяется.
 * Правила стран из библиотеки libphonenumber-js (справочник Google), она
 * загружается только при отправке формы. Та же проверка есть в бэкенде.
 */
export const PHONE_ERROR =
  "Проверьте номер телефона: не хватает цифр или есть лишние. Например, +7 999 123-45-67 или +381 64 123 45 67.";

/* Самый длинный номер с кодом страны, пробелами и скобками помещается в 25 знаков */
export const PHONE_MAX_LENGTH = 25;

export async function isPhoneLengthOk(value: string): Promise<boolean> {
  const { isPossiblePhoneNumber } = await import("libphonenumber-js");
  return isPossiblePhoneNumber(value, "RU");
}

/*
 * Перед отправкой: если номер не подходит, браузер показывает подсказку у поля
 * телефона, как у других обязательных полей, и форма не уходит.
 */
export async function checkPhoneField(form: HTMLFormElement): Promise<boolean> {
  const input = form.elements.namedItem("phone");
  if (!(input instanceof HTMLInputElement)) return true;
  if (await isPhoneLengthOk(input.value)) return true;
  input.setCustomValidity(PHONE_ERROR);
  input.reportValidity();
  return false;
}
