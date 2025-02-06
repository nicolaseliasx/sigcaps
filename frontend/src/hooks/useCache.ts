<<<<<<< HEAD
export function getCache<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error getting cache:", error);
    return null;
=======
export const getCache = <T>(key: string): T | undefined => {
  const cachedData = localStorage.getItem(key);
  if (cachedData) {
    return JSON.parse(cachedData);
>>>>>>> bff3aacf4c48cebcae0db6edee6d441224785e95
  }
}

export function setCache<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting cache:", error);
  }
}
