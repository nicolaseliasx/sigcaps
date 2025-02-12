export interface Config {
  nomeInstalacao: string;
  fontSize: number;
  voiceVolume: number;
  serverAddrs: string;
}

export interface ChangeCredentials {
  currentUser: string;
  currentPassword: string;
  newUser: string;
  newPassword: string;
}
