import { createContext } from "react";
import { Config } from "../view/configuracoes/config-model";

interface ConfigContextType {
  config: Config | null;
  setConfig: (config: Config) => void;
  serverUrl: string;
  setServerUrl: (url: string) => void;
  token: string;
  setToken: (token: string) => void;
}

export const ConfigContext = createContext<ConfigContextType | undefined>(
  undefined
);
