export const useZoom = (userSize: number) => {
  const adjustedSize = Math.min(Math.max(userSize, 1), 20);

  const zoomLevel = 1 + ((adjustedSize - 1) * 0.2) / 2.1;

  return Number(zoomLevel.toFixed(2));
};
