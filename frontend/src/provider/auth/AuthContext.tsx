import { createContext } from "react";

export interface AuthContextType {
  serverUrl: string;
  setServerUrl: (url: string) => void;
  token: string;
  setToken: (token: string) => void;
  refreshToken: string;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);
