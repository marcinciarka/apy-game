import React from "react";
import Card from "./Card";
import { CardData } from "../types";
import styles from "./CardList.module.css";

interface CardListProps {
  cards: CardData[];
  selected: number | null;
  isAI: boolean;
  onSelect: (idx: number) => void;
}

const CardList: React.FC<CardListProps> = ({
  cards,
  selected,
  isAI,
  onSelect,
}) => (
  <div className={styles.cardList}>
    {cards.map((card, i) => (
      <Card
        key={`${i}_${card.apy}`}
        apy={card.apy}
        trendData={card.trendData}
        selected={selected === i}
        onClick={() => !isAI && onSelect(i)}
        highlight={
          selected !== null &&
          i ===
            cards.findIndex(
              (c) => c.apy === Math.max(...cards.map((c) => c.apy))
            )
        }
        apyColorOverride={(() => {
          if (card.apy >= 10) return "#1db954";
          if (card.apy <= 3) return "#d7263d";
          if (card.apy <= 5) return "rgb(120,40,40)";
          return "#1a2233";
        })()}
      />
    ))}
  </div>
);

export default CardList;
