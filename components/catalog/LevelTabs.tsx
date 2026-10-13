type Props = {
  levels: { label: string; active: boolean }[];
  /* Невыбранная метка на компьютере бледнее: так в макете списка для аренды */
  dim?: boolean;
};

/*
 * Метки «L1» и «L2» над списком апартаментов. В макетах они нарисованы как
 * переключатель: в списке для собственного проживания выбрана первая, в
 * списке для аренды вторая. Что именно они переключают, пока не определено,
 * поэтому сейчас это просто надписи.
 */
export function LevelTabs({ levels, dim = false }: Props) {
  const inactive = dim ? "text-muted lg:text-[#97a19d]" : "text-muted";

  return (
    <ul className="flex gap-[3.3px] text-[13px] leading-[19.5px] lg:gap-[11px]">
      {levels.map((level) => (
        <li
          key={level.label}
          aria-current={level.active ? "true" : undefined}
          className={level.active ? "text-navy" : inactive}
        >
          {level.label}
        </li>
      ))}
    </ul>
  );
}
