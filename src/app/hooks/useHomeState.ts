import { useState } from "react";
import { CardData } from "../types";

export function useHomeState() {
  const [screen, setScreen] = useState<"start" | "game" | "ai" | "over">(
    "start"
  );
  const [lastScore, setLastScore] = useState(0);
  const [lastStreak, setLastStreak] = useState(0);
  const [lastRounds, setLastRounds] = useState(0);
  const [lastWasAI, setLastWasAI] = useState(false);
  const [showHow, setShowHow] = useState(false);
  const [lastCards, setLastCards] = useState<CardData[] | undefined>(undefined);
  const [lastSelected, setLastSelected] = useState<number | null>(null);
  const [lastAvgResponse, setLastAvgResponse] = useState<number | undefined>(
    undefined
  );
  const [timedOut, setTimedOut] = useState(false);

  const handleGameOver = ({
    score,
    streak,
    rounds,
    lastCards,
    lastSelected,
    avgResponse,
    timedOut,
  }: {
    score: number;
    streak: number;
    rounds: number;
    lastCards?: CardData[];
    lastSelected?: number | null;
    avgResponse?: number;
    timedOut?: boolean;
  }) => {
    setLastScore(score);
    setLastStreak(streak);
    setLastRounds(rounds);
    setLastCards(lastCards);
    setLastSelected(lastSelected ?? null);
    setLastAvgResponse(avgResponse);
    setTimedOut(!!timedOut);
    setScreen("over");
  };

  return {
    screen,
    setScreen,
    lastScore,
    setLastScore,
    lastStreak,
    setLastStreak,
    lastRounds,
    setLastRounds,
    lastWasAI,
    setLastWasAI,
    showHow,
    setShowHow,
    lastCards,
    setLastCards,
    lastSelected,
    setLastSelected,
    lastAvgResponse,
    setLastAvgResponse,
    timedOut,
    setTimedOut,
    handleGameOver,
  };
}
