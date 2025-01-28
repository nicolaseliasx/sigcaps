import React from "react";

interface ColorSquareProps {
  color: string;
  multiplier: number;
}

export const ColorSquare: React.FC<ColorSquareProps> = ({
  color,
  multiplier,
}) => {
  const baseSize = 50;

  return (
    <div
      style={{
        width: `${baseSize * multiplier}px`,
        height: `${baseSize * multiplier}px`,
        backgroundColor: color,
      }}
    ></div>
  );
};
