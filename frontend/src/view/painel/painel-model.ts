export const painelColorRecord: Record<number, string> = {
  1: "#00FF00",
  2: "#FFFF00",
  3: "#FF0000",
};

export interface ChamadaPaciente {
  nomePaciente: string;
  classificacao: number;
  sala: number;
  horario: string;
}
