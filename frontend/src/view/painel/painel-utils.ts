import { RiscoClassificacao } from "./painel-model";

export function idToRiscoClassificacao(
  classificacao: string
): RiscoClassificacao {
  switch (classificacao) {
    case "0":
      return RiscoClassificacao.NAO_CLASSIFICADO;
    case "1":
      return RiscoClassificacao.ALTA;
    case "2":
      return RiscoClassificacao.MEDIA;
    case "3":
      return RiscoClassificacao.BAIXA;
    case "4":
      return RiscoClassificacao.NAO_AGUDA;
    default:
      throw new Error("Classificação inválida");
  }
}
