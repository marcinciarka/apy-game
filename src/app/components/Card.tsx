import { FC, useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import styles from "./Card.module.css";
import clsx from "clsx";

export interface CardProps {
  apy: number;
  trendData: { x: number; y: number }[];
  selected?: boolean;
  onClick?: () => void;
  highlight?: boolean;
  apyColorOverride?: string;
}

const Card: FC<CardProps> = ({
  apy,
  trendData,
  selected,
  onClick,
  highlight,
  apyColorOverride,
}) => {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    return () => setVisible(false);
  }, []);

  let apyColor = apyColorOverride || "#1a2233";
  let apyFontSize = 20;
  if (apy >= 10) {
    apyFontSize = 24; // bigger for high yield
  } else if (apy <= 3 && !apyColorOverride) {
    apyColor = "#d7263d"; // red for very low yield
  } else if (apy <= 5 && !apyColorOverride) {
    // interpolate between red and dark for low yields
    apyColor = "rgb(120,40,40)";
  }

  return (
    <div
      className={clsx(
        styles.card,
        selected && styles.selected,
        highlight && styles.highlight,
        hovered && styles.hovered,
        !visible && styles.invisible
      )}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (onClick) {
            onClick();
          }
        }
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) =>
        (e.currentTarget.style.transform = selected
          ? "scale(1.09)"
          : highlight
          ? "scale(1.05)"
          : hovered
          ? "scale(1.04)"
          : "scale(1)")
      }
      onMouseLeave={(e) => {
        setHovered(false);
        e.currentTarget.style.transform = selected
          ? "scale(1.09)"
          : highlight
          ? "scale(1.05)"
          : "scale(1)";
      }}
      onMouseEnter={() => setHovered(true)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div style={{ width: "100%", height: 36 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <Line
              type="monotone"
              dataKey="y"
              stroke={apyColor}
              dot={false}
              strokeWidth={2}
              animationDuration={100}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div
        className={styles.apyValue}
        style={{ fontSize: apyFontSize, color: apyColor }}
      >
        {apy.toFixed(2)}%
      </div>
    </div>
  );
};

export default Card;
