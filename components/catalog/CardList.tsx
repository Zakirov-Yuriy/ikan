import {
  ApartmentCard,
  type ApartmentCardData,
} from "@/components/catalog/ApartmentCard";

type Props = {
  cards: ApartmentCardData[];
  /* Подписи колонок маленькой таблицы в карточке на компьютере */
  columns: string[];
  /* Фотография первой карточки видна сразу при открытии страницы и грузится без задержки */
  eagerFirst?: boolean;
};

/* Столбик карточек апартаментов */
export function CardList({ cards, columns, eagerFirst = false }: Props) {
  return (
    <div className="grid gap-[15px] lg:gap-[24px]">
      {cards.map((card, index) => (
        <ApartmentCard
          key={card.name}
          card={card}
          columns={columns}
          eager={eagerFirst && index === 0}
        />
      ))}
    </div>
  );
}
