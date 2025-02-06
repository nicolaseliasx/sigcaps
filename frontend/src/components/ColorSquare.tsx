import React from "react";

interface ColorSquareProps {
  color: string;
  size: number;
}

export const ColorSquare: React.FC<ColorSquareProps> = ({ color, size }) => {
  const baseSize = 50;

  return (
    <div
      style={{
        width: `${baseSize * size}rem`,
        height: `${baseSize * size}rem`,
        backgroundColor: color,
      }}
    ></div>
  );
};
