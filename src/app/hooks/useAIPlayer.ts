import { useEffect, useRef } from "react";
import { CardData } from "../types";
import { addBeatListener, removeBeatListener } from "../helpers/musicHelper";

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
  const hasActedRef = useRef(false);
  const beatCounter = useRef(0);
  const lastRound = useRef(round);

  useEffect(() => {
    if (!enabled) return;
    function onBeat() {
      // Reset on new round
      if (lastRound.current !== round) {
        beatCounter.current = 0;
        hasActedRef.current = false;
        lastRound.current = round;
      }
      beatCounter.current++;
      // Act every 4th beat, but trigger on the 3rd beat to compensate for scheduler lookahead
      if (
        !hasActedRef.current &&
        cards.length > 0 &&
        beatCounter.current % 4 === 3
      ) {
        const maxApy = Math.max(...cards.map((c) => c.apy));
        const idx = cards.findIndex((c) => c.apy === maxApy);
        setTimeout(() => {
          onSelect(idx);
        }, 70); // Delay to allow for beat timing
        hasActedRef.current = true;
      }
    }
    addBeatListener(onBeat);
    return () => removeBeatListener(onBeat);
    // eslint-disable-next-line
  }, [enabled, onSelect]);
}
