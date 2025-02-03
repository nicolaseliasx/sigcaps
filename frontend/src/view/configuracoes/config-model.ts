export interface Config {
  fontSize: number;
  voiceVolume: number;
  serverAddrs: string;
  token?: string;
}

export interface Token {
  token: string;
}
