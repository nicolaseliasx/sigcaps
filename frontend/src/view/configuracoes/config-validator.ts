export interface ValidationErrors {
  [key: string]: string;
}

export const urlValidator = (url: string) => {
  return !url.trim()
    ? "URL do servidor é obrigatória."
    : !/^http:\/\/(?:\d{1,3}\.){3}\d{1,3}(:\d{1,5})?$/.test(url)
    ? "URL inválida."
    : "";
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

  // TODO: Valores de tamanho de fonte serão ajustandos em outra issue tambem valor de volume de voice
  if (!data.inputFont) errors.inputFont = "Tamanho da fonte é obrigatório.";
  else if (
    isNaN(Number(data.inputFont)) ||
    Number(data.inputFont) < 1 ||
    Number(data.inputFont) > 100
  )
    errors.inputFont = "Tamanho da fonte deve estar entre 1 e 100.";

  if (!data.inputVoice) errors.inputVoice = "Volume é obrigatório.";
  else if (
    isNaN(Number(data.inputVoice)) ||
    Number(data.inputVoice) < 1 ||
    Number(data.inputVoice) > 100
  )
    errors.inputVoice = "Volume deve estar entre 1 e 100.";

  return errors;
};
