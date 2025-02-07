import { useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { Config } from "../view/configuracoes/config-model";
import { ConfigContext } from "./ConfigContext";

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [serverUrl, setServerUrl] = useState(
    localStorage.getItem("serverUrl") || ""
  );

  const [token, setToken] = useState(localStorage.getItem("authToken") || "");

  const { data: config } = useWebSocket<Config>(
    `${serverUrl}/ws`,
    "/topic/config/load",
    "appConfig"
  );

  const [appConfig, setAppConfig] = useState<Config | null>(config);

  useEffect(() => {
    if (config) {
      setAppConfig(config);
    }
  }, [config]);

  return (
    <ConfigContext.Provider
      value={{
        config: appConfig,
        setConfig: setAppConfig,
        serverUrl,
        setServerUrl,
        token,
        setToken,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
