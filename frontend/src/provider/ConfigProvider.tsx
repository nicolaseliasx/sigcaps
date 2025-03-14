import { useEffect, useMemo, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { ConfigContext } from "./ConfigContext";

import Cookies from "js-cookie";
import useRest from "../hooks/useRest";

export interface Config {
  installationName: string;
  fontSize: number;
  voiceVolume: number;
}

interface AuthResponseDto {
  token: string;
  refreshToken: string;
}

const VITE_BOOTSTRAP = import.meta.env.VITE_BOOTSTRAP_KEY;
const VITE_SERVER_IP = "127.0.0.1";
const BOOTSTRAP_EXECUTED_KEY = "bootstrap_executed";

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [serverUrl, setServerUrl] = useState(
    localStorage.getItem("serverUrl") || ""
  );
  const [token, setToken] = useState(Cookies.get("authToken") || "");
  const [appConfig, setAppConfig] = useState<Config | null>(null);

  const { get } = useRest(serverUrl, () => "");
  const { data: config } = useWebSocket<Config>(
    `${serverUrl}/ws`,
    "/topic/config/load"
  );

  useEffect(() => {
    if (!serverUrl && VITE_SERVER_IP) {
      const initialUrl = `http://${VITE_SERVER_IP}:8081`;
      setServerUrl(initialUrl);
      localStorage.setItem("serverUrl", initialUrl);
    }
  }, [serverUrl]);

  useEffect(() => {
    if (config) {
      setAppConfig(config);
    }
  }, [config]);

  const bootstrapExecutedRef = useRef(
    localStorage.getItem(BOOTSTRAP_EXECUTED_KEY) === "true"
  );

  useEffect(() => {
    const fetchBootstrap = async () => {
      if (bootstrapExecutedRef.current || !serverUrl || !VITE_BOOTSTRAP) return;

      bootstrapExecutedRef.current = true;
      localStorage.setItem(BOOTSTRAP_EXECUTED_KEY, "true");

      try {
        const response = await get<AuthResponseDto>(
          `/auth/bootstrap?bootstrapKey=${VITE_BOOTSTRAP}`
        );

        console.log("Response:", response);

        if (response?.token && response?.refreshToken) {
          Cookies.set("authToken", response.token);
          Cookies.set("refreshToken", response.refreshToken);
          setToken(response.token);

          console.log("Token obtido com sucesso:", response.token);
        }
      } catch (error) {
        console.error("Erro no bootstrap:", error);
      }
    };

    fetchBootstrap();
  }, [get, serverUrl]);

  const contextValue = useMemo(
    () => ({
      config: appConfig,
      setConfig: setAppConfig,
      serverUrl,
      setServerUrl,
      token,
      setToken: (newToken: string) => {
        setToken(newToken);
        Cookies.set("authToken", newToken);
      },
    }),
    [appConfig, serverUrl, token]
  );

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
}
