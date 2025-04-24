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
    color: "#F0F0F5",
  },
  [RiscoClassificacao.ALTA]: {
    nome: "Alta",
    color: "#FF0000",
  },
  [RiscoClassificacao.MEDIA]: {
    nome: "Média",
    color: "#FFFF00",
  },
  [RiscoClassificacao.BAIXA]: {
    nome: "Baixa",
    color: "#00FF00",
  },
  [RiscoClassificacao.NAO_AGUDA]: {
    nome: "Não aguda",
    color: "#0077E1",
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
