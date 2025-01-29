export function tittleCase(nome?: string): string {
  if (!nome) {
    return "";
  }
  const lower = nome.toLowerCase();

  const formatted = lower.replace(/\b\w/g, (letra) => letra.toUpperCase());

  return formatted;
}
