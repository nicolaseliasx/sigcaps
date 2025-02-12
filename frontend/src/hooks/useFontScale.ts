const fontScale = Array.from({ length: 10 }, (_, index) => {
  const base = 2.1;
  const step = 0.2;
  return Number((base + index * step).toFixed(2));
});

export const useFontScale = (userSize: number) => {
  const adjustedSize = Math.min(Math.max(userSize, 1), 10);
  const baseSize = fontScale[adjustedSize - 1];

  return {
    base: baseSize,
    xxsmall: baseSize * 0.5,
    xsmall: baseSize * 0.6,
    small: baseSize * 0.8,
    medium: baseSize * 1.6,
    large: baseSize * 2.2,
    xlarge: baseSize * 3.4,
  };
};
