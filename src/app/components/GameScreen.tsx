"use client";

import React from "react";
import { CardData } from "../types";
import { useGameLogic } from "../hooks/useGameLogic";
import ScoreBar from "./ScoreBar";
import TimerBar from "./TimerBar";
import CardList from "./CardList";
import StreakAnimation from "./StreakAnimation";
import StreakBar from "./StreakBar";
import AvgResponse from "./AvgResponse";
import AIStatus from "./AIStatus";
import styles from "./GameScreen.module.css";

interface GameScreenProps {
  isAI: boolean;
  onGameOver: (params: {
    score: number;
    streak: number;
    rounds: number;
    lastCards?: CardData[];
    lastSelected?: number | null;
    avgResponse?: number;
    timedOut?: boolean;
  }) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ isAI, onGameOver }) => {
  const game = useGameLogic({ isAI, onGameOver });

  return (
    <div className={styles.container}>
      <ScoreBar
        score={game.score}
        streak={game.streak}
        streakAnim={game.streakAnim}
      />
      <StreakBar
        streak={game.streak}
        round={game.round}
        streakAnim={game.streakAnim}
      />
      <AvgResponse
        isAI={game.isAI}
        validResponses={game.validResponses}
        avgResponse={game.avgResponse}
      />
      <CardList
        cards={game.cards}
        selected={game.selected}
        isAI={game.isAI}
        onSelect={game.handleSelect}
      />
      <TimerBar timeLeft={game.timeLeft} timer={game.timer} />
      {game.isAI && <AIStatus />}
      {game.streakAnim && game.streak >= 2 && (
        <StreakAnimation {...game.streakAnimProps} />
      )}
    </div>
  );
};

export default GameScreen;
