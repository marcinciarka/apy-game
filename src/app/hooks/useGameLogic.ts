import { useState, useEffect, useRef, useCallback } from "react";
import { CardData } from "../types";
import { generateCards } from "../helpers/gameHelpers";
import { useAIPlayer } from "./useAIPlayer";

interface UseGameLogicProps {
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

// Helper for random label
function getRandomLabel() {
  const labels = [
    "NICE!",
    "PERFECT!",
    "GREAT!",
    "AWESOME!",
    "EXCELLENT!",
    "IMPRESSIVE!",
    "SUPERB!",
    "FANTASTIC!",
    "BRILLIANT!",
    "AMAZING!",
    "WOW!",
    "STELLAR!",
    "ON FIRE!",
    "UNSTOPPABLE!",
    "LEGENDARY!",
  ];
  return labels[Math.floor(Math.random() * labels.length)];
}

function getRandomPastelColor() {
  // HSL with high lightness and medium saturation for pastel
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 60%, 70%)`;
}

export function useGameLogic({
  isAI,
  onGameOver,
}: Omit<UseGameLogicProps, "handleSelect">) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [timer, setTimer] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [scoreAnim, setScoreAnim] = useState(false);
  const [streakAnim, setStreakAnim] = useState(false);
  const [streakAnimProps, setStreakAnimProps] = useState({
    angle: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    label: "PERFECT!",
    color: "#ffb300",
  });
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevStreakRef = useRef(streak);

  const validResponses = responseTimes.length > 1 ? responseTimes.slice(1) : [];
  const avgResponse =
    validResponses.length > 0
      ? validResponses.reduce((a, b) => a + b, 0) / validResponses.length
      : 0;

  const nextRound = useCallback((decreaseTime = true) => {
    setSelected(null); // Clear selection immediately
    setTimeout(() => {
      setCards(generateCards());
      setRound((r) => r + 1);
      setTimer((t) => {
        const newTime = decreaseTime ? Math.max(1.2, t - 0.1) : t;
        setTimeLeft(newTime);
        return newTime;
      });
      setRoundStartTime(Date.now());
    }, 0);
  }, []);

  useEffect(() => {
    nextRound(false);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setGameOver(false);
    setResponseTimes([]);
  }, [nextRound]);

  // Handle card selection
  const handleSelect = useCallback(
    (idx: number) => {
      if (selected !== null || gameOver) return;
      setSelected(idx);
      const now = Date.now();
      if (idx !== -1) {
        setResponseTimes((times) => [...times, (now - roundStartTime) / 1000]);
      }
      const maxApy = Math.max(...cards.map((c) => c.apy));
      const correctIdx = cards.findIndex((c) => c.apy === maxApy);
      let points = 0;
      let perfect = false;
      if (idx === correctIdx) {
        points = Math.floor(100 * (timeLeft / timer) + 10);
        perfect = true;
      } else {
        points = -30;
        perfect = false;
      }
      setScore((s) =>
        Math.max(0, s + points + (perfect && streak >= 2 ? 5 : 0))
      );
      setStreak((s) => (perfect ? s + 1 : 0));
      setBestStreak((s) => (perfect ? Math.max(s, streak + 1) : s));
      setTimeout(
        () => {
          if (idx === correctIdx) {
            nextRound();
          } else {
            setGameOver(true);
            onGameOver({
              score,
              streak: bestStreak,
              rounds: round,
              lastCards: cards,
              lastSelected: idx === -1 ? null : idx,
              avgResponse,
              timedOut: idx === -1,
            });
          }
        },
        perfect ? 500 : 400
      );
    },
    [
      selected,
      gameOver,
      roundStartTime,
      cards,
      timeLeft,
      timer,
      streak,
      bestStreak,
      round,
      score,
      nextRound,
      onGameOver,
      avgResponse,
    ]
  );

  // Timer logic
  useEffect(() => {
    if (gameOver) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    let last = Date.now();
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        const now = Date.now();
        const dt = (now - last) / 1000;
        last = now;
        if (t - dt <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          handleSelect(-1); // time out
          return 0;
        }
        return t - dt;
      });
    }, 30);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [round, gameOver, handleSelect]);

  // Animate score
  useEffect(() => {
    if (score > 0) {
      setScoreAnim(true);
      setTimeout(() => setScoreAnim(false), 350);
    }
  }, [score]);

  // Animate streak (now called 'perfect', based on answer time < 1s)
  useEffect(() => {
    if (
      responseTimes.length > 1 &&
      responseTimes[responseTimes.length - 1] < 1
    ) {
      setStreakAnim(false);
      setTimeout(() => {
        setStreakAnimProps({
          angle: Math.random() * 60 - 30,
          offsetX: Math.random() * 60 - 30,
          offsetY: Math.random() * 30 - 15,
          scale: 0.9 + Math.random() * 0.4,
          label: getRandomLabel(),
          color: getRandomPastelColor(),
        });
        setStreakAnim(true);
      }, 10);
      setTimeout(() => setStreakAnim(false), 360);
    }
    prevStreakRef.current = streak;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseTimes]);

  // AI integration
  useAIPlayer({
    enabled: isAI && !gameOver,
    cards,
    onSelect: (idx) => handleSelect(idx),
    round,
  });

  // End game if time runs out
  useEffect(() => {
    if (timeLeft <= 0 && !gameOver && selected === null) {
      setGameOver(true);
      onGameOver({
        score,
        streak: bestStreak,
        rounds: round,
        lastCards: cards,
        lastSelected: null,
        avgResponse,
        timedOut: true,
      });
    }
  }, [
    timeLeft,
    gameOver,
    selected,
    score,
    bestStreak,
    round,
    onGameOver,
    cards,
    avgResponse,
  ]);

  return {
    cards,
    setCards,
    selected,
    setSelected,
    score,
    setScore,
    streak,
    setStreak,
    bestStreak,
    setBestStreak,
    round,
    setRound,
    timeLeft,
    setTimeLeft,
    timer,
    setTimer,
    gameOver,
    setGameOver,
    scoreAnim,
    setScoreAnim,
    streakAnim,
    setStreakAnim,
    streakAnimProps,
    responseTimes,
    setResponseTimes,
    roundStartTime,
    setRoundStartTime,
    intervalRef,
    avgResponse,
    validResponses,
    nextRound,
    onGameOver,
    isAI,
    handleSelect,
  };
}
