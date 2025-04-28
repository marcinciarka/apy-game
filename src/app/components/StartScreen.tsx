"use client";

import React from "react";
import styles from "./StartScreen.module.css";

interface StartScreenProps {
  onStart: () => void;
  onHowToPlay: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onHowToPlay }) => (
  <div className={styles.container}>
    <h1 className={styles.title}>APY Game</h1>
    <div className={styles.description}>
      Click the card with the highest APY before time runs out!
      <br />
      Can you beat the AI?
    </div>
    <button className={styles.button} onClick={onStart}>
      Start Game
    </button>
    <button className={styles.buttonHowTo} onClick={onHowToPlay}>
      How to Play
    </button>
  </div>
);

export default StartScreen;
