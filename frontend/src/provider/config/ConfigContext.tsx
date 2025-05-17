import { createContext } from "react";

export interface Config {
  installationName: string;
  fontSize: number;
  voiceVolume: number;
}

export interface ConfigContextModel {
  config: Config | null;
  setConfig: (config: Config) => void;
}

export const ConfigContext = createContext<ConfigContextModel>(
  {} as ConfigContextModel
);
