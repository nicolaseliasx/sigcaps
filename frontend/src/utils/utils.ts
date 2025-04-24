const unionNameTittleCaseExceptions = new Set([
  "e",
  "de",
  "da",
  "do",
  "dos",
  "das",
  "em",
  "com",
  "para",
  "a",
  "o",
]);

export function titleCase(nome?: string): string {
  if (!nome) {
    return "";
  }

  const lower = nome.toLowerCase();

  const formatted = lower
    .split(" ")
    .map((word, index) =>
      unionNameTittleCaseExceptions.has(word) && index !== 0
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

  return formatted;
}
