import { RiscoClassificacao } from "./painel-model";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
      return RiscoClassificacao.NAO_CLASSIFICADO;
  }
}

export function formatDatePainel(date: Date): string {
  return format(date, "EEEE',' dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}
