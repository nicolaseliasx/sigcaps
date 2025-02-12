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

export const formatDatePainel = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formattedDate = new Intl.DateTimeFormat("pt-BR", options).format(date);

  const parts = formattedDate.match(
    /(\w+)-?feira?,? (\d{2}\/\d{2}\/\d{4}),? (\d{2}:\d{2})/
  );

  if (!parts) return formattedDate;

  return `${parts[1]} Feira - ${parts[2]} - ${parts[3]}`;
};
