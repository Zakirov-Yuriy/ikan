import type { ApartmentCardData } from "@/components/catalog/ApartmentCard";
import { CardList } from "@/components/catalog/CardList";
import { LevelTabs } from "@/components/catalog/LevelTabs";

type Props = {
  levels: { label: string; active: boolean }[];
  /* Невыбранная метка на компьютере бледнее, как в макете списка для аренды */
  dimLevels?: boolean;
  columns: string[];
  cards: ApartmentCardData[];
  /* Отступ сверху, если в макете страницы он не такой, как в списке «для себя» */
  className?: string;
};

/* Метки «L1» и «L2» и под ними все карточки: списки «для себя» и «для аренды» */
export function LevelList({
  levels,
  dimLevels = false,
  columns,
  cards,
  className = "pt-[28px] lg:pt-[40.4px]",
}: Props) {
  return (
    <div className={className}>
      <LevelTabs levels={levels} dim={dimLevels} />
      <div className="mt-[20px] lg:mt-[28px]">
        <CardList cards={cards} columns={columns} eagerFirst />
      </div>
    </div>
  );
}
