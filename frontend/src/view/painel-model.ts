import { gray, red, yellow, green, blue } from "bold-ui/lib/styles/colors";

export enum RiscoClassificacao {
  NAO_CLASSIFICADO = "NAO_CLASSIFICADO",
  ALTA = "ALTA",
  MEDIA = "MEDIA",
  BAIXA = "BAIXA",
  NAO_AGUDA = "NAO_AGUDA",
}

export const riscoRecord: Record<
  RiscoClassificacao,
  { nome: string; color: string }
> = {
  [RiscoClassificacao.NAO_CLASSIFICADO]: {
    nome: "Não classificado",
    color: gray.c70,
  },
  [RiscoClassificacao.ALTA]: {
    nome: "Alta",
    color: red.c40,
  },
  [RiscoClassificacao.MEDIA]: {
    nome: "Média",
    color: yellow.c70,
  },
  [RiscoClassificacao.BAIXA]: {
    nome: "Baixa",
    color: green.c40,
  },
  [RiscoClassificacao.NAO_AGUDA]: {
    nome: "Não aguda",
    color: blue.c40,
  },
};

export interface ChamadaPaciente {
  nomePaciente: string;
  classificacao: string;
  tipoServico: string[];
  horario: string;
  historico: HistoricoChamados[];
}

interface HistoricoChamados {
  nomePaciente: string;
  classificacao: string;
  tipoServico: string[];
  horario: string;
}
