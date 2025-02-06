// TODO: Refatorar ese cache para um hook useCache melhor
export const getCache = <T>(key: string): T | undefined => {
  const cachedData = localStorage.getItem(key);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  return undefined;
};

export const setCache = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const clearCache = (key: string): void => {
  localStorage.removeItem(key);
};
