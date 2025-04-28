"use client";
import React from "react";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import GameOverScreen from "./components/GameOverScreen";
import HowToPlayModal from "./components/HowToPlayModal";
import { useHomeState } from "./hooks/useHomeState";
import { playGameStartSound } from "./helpers/audioHelpers"; // Import the new sound function
import {
  setMusicVolume,
  ensureAudioContextResumed,
  startMusic,
} from "./helpers/musicHelper";

export default function Home() {
  const home = useHomeState();

  // Ensure music is started and resumed on any user interaction
  const handleUserInteraction = React.useCallback(() => {
    ensureAudioContextResumed();
    startMusic();
  }, []);

  React.useEffect(() => {
    window.addEventListener("pointerdown", handleUserInteraction, {
      once: true,
    });
    return () =>
      window.removeEventListener("pointerdown", handleUserInteraction);
  }, [handleUserInteraction]);

  React.useEffect(() => {
    if (home.screen === "game" || home.screen === "ai") {
      setMusicVolume(0.3); // Fade in music for gameplay
    } else {
      setMusicVolume(0.1); // Fade out music for menu/other screens (higher minimum)
    }
  }, [home.screen]);

  const startGame = (isAI: boolean) => {
    playGameStartSound(); // Play sound on game start
    home.setScreen(isAI ? "ai" : "game");
    home.setLastWasAI(isAI);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f6f8fa" }}>
      {home.screen === "start" && (
        <StartScreen
          onStart={() => startGame(false)} // Use startGame function
          onAI={() => startGame(true)}
          onHowToPlay={() => home.setShowHow(true)}
        />
      )}
      {home.screen === "game" && (
        <GameScreen
          isAI={false}
          onGameOver={home.handleGameOver}
          onReturnToMenu={() => home.setScreen("start")}
        />
      )}
      {home.screen === "ai" && (
        <GameScreen
          isAI={true}
          onGameOver={home.handleGameOver}
          onReturnToMenu={() => home.setScreen("start")}
        />
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
          onRestart={() => startGame(home.lastWasAI)} // Use startGame for restart
          onAI={() => startGame(true)} // Use startGame for starting AI game
        />
      )}
      {home.showHow && (
        <HowToPlayModal onClose={() => home.setShowHow(false)} />
      )}
    </div>
  );
}
