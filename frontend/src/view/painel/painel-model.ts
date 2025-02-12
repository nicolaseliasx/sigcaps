export enum RiscoClassificacao {
  NAO_CLASSIFICADO = "NAO_CLASSIFICADO",
  ALTA = "ALTA",
  MEDIA = "MEDIA",
  BAIXA = "BAIXA",
  NAO_AGUDA = "NAO_AGUDA",
}

export const riscoColorRecord: Record<RiscoClassificacao, string> = {
  [RiscoClassificacao.NAO_CLASSIFICADO]: "#F0F0F5",
  [RiscoClassificacao.ALTA]: "#FF0000",
  [RiscoClassificacao.MEDIA]: "#FFFF00",
  [RiscoClassificacao.BAIXA]: "#00FF00",
  [RiscoClassificacao.NAO_AGUDA]: "#0077E1",
};

export const riscoNomeRecord: Record<RiscoClassificacao, string> = {
  [RiscoClassificacao.NAO_CLASSIFICADO]: "Não classificado",
  [RiscoClassificacao.ALTA]: "Alta",
  [RiscoClassificacao.MEDIA]: "Media",
  [RiscoClassificacao.BAIXA]: "Baixa",
  [RiscoClassificacao.NAO_AGUDA]: "Não aguda",
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
