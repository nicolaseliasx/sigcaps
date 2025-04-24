import React from "react";

interface ColorSquareProps {
  color: string;
  size: number;
}

export const ColorSquare: React.FC<ColorSquareProps> = ({ color, size }) => {
  return (
    <div
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
        backgroundColor: color,
        borderRadius: "0.5rem",
      }}
    />
  );
};
