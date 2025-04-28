"use client";
import React from "react";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import GameOverScreen from "./components/GameOverScreen";
import HowToPlayModal from "./components/HowToPlayModal";
import { useHomeState } from "./hooks/useHomeState";

export default function Home() {
  const home = useHomeState();

  return (
    <div style={{ minHeight: "100vh", background: "#f6f8fa" }}>
      {home.screen === "start" && (
        <StartScreen
          onStart={() => {
            home.setScreen("game");
            home.setLastWasAI(false);
          }}
          onHowToPlay={() => home.setShowHow(true)}
        />
      )}
      {home.screen === "game" && (
        <GameScreen isAI={false} onGameOver={home.handleGameOver} />
      )}
      {home.screen === "ai" && (
        <GameScreen isAI={true} onGameOver={home.handleGameOver} />
      )}
      {home.screen === "over" && (
        <GameOverScreen
          score={home.lastScore}
          streak={home.lastStreak}
          rounds={home.lastRounds}
          isAI={home.lastWasAI}
          lastCards={home.lastCards}
          lastSelected={home.lastSelected}
          avgResponse={home.lastAvgResponse}
          timedOut={home.timedOut}
          onRestart={() => home.setScreen(home.lastWasAI ? "ai" : "game")}
          onAI={() => {
            home.setScreen("ai");
            home.setLastWasAI(true);
          }}
        />
      )}
      {home.showHow && (
        <HowToPlayModal onClose={() => home.setShowHow(false)} />
      )}
    </div>
  );
}
