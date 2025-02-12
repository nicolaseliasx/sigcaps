export interface ValidationErrors {
  [key: string]: string;
}

export const urlValidator = (url: string) => {
  const trimmedUrl = url.trim();

  const urlPattern =
    /^http:\/\/((localhost|(\d{1,3}\.){3}\d{1,3})):8081([-a-zA-Z0-9@:%_+.~#?&//=]*)$/i;

  if (!trimmedUrl) {
    return "URL do servidor é obrigatória.";
  }

  if (!urlPattern.test(trimmedUrl)) {
    return "URL inválida. Formato correto: http://[IP ou localhost]:8081";
  }

  if (trimmedUrl.includes(".")) {
    const ipParts = trimmedUrl.split(":")[0].split("/")[2].split(".");
    const invalidIP = ipParts.some((part) => {
      const num = parseInt(part, 10);
      return num < 0 || num > 255;
    });

    if (invalidIP) {
      return "Números do IP devem estar entre 0 e 255";
    }
  }

  return "";
};

export const validateConfig = (data: {
  nomeInstalacao: string;
  inputUrl: string;
  inputFont: number | string;
  inputVoice: number | string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.nomeInstalacao.trim())
    errors.nomeInstalacao = "Nome da instalação é obrigatório.";

  if (data.nomeInstalacao.trim().length > 80)
    errors.nomeInstalacao =
      "Nome da instalação deve ter no máximo 80 caracteres.";

  if (data.nomeInstalacao.trim().length < 2)
    errors.nomeInstalacao =
      "Nome da instalação deve ter no mínimo 2 caracteres.";

  const urlError = urlValidator(data.inputUrl);
  if (urlError) {
    errors.inputUrl = urlError;
  }

  if (!data.inputFont) errors.inputFont = "Tamanho da fonte é obrigatório.";
  else if (
    isNaN(Number(data.inputFont)) ||
    Number(data.inputFont) < 1 ||
    Number(data.inputFont) > 10
  )
    errors.inputFont = "Tamanho da fonte deve estar entre 1 e 10.";

  if (!data.inputVoice) errors.inputVoice = "Volume é obrigatório.";
  else if (
    isNaN(Number(data.inputVoice)) ||
    Number(data.inputVoice) < 1 ||
    Number(data.inputVoice) > 100
  )
    errors.inputVoice = "Volume deve estar entre 1 e 100.";

  return errors;
};
