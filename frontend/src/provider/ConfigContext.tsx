import { createContext } from "react";

import { Config } from "./ConfigProvider";

export interface ConfigContextModel {
  config: Config | null;
  setConfig: (config: Config) => void;
  serverUrl: string;
  setServerUrl: (url: string) => void;
  token: string;
  setToken: (token: string) => void;
}

export const ConfigContext = createContext<ConfigContextModel | undefined>(
  undefined
);
