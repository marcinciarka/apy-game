import { useEffect } from "react";
import { CardData } from "../types";

interface UseAIPlayerProps {
  enabled: boolean;
  cards: CardData[];
  onSelect: (index: number) => void;
  round: number;
}

export function useAIPlayer({
  enabled,
  cards,
  onSelect,
  round,
}: UseAIPlayerProps) {
  useEffect(() => {
    if (!enabled || cards.length === 0) return;
    const maxApy = Math.max(...cards.map((c) => c.apy));
    const idx = cards.findIndex((c) => c.apy === maxApy);
    const delay = 50 + Math.random() * 300;
    const timeout = setTimeout(() => onSelect(idx), delay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [enabled, cards, round]);
}
