import { useEffect, useMemo, useState, useContext } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { Config, ConfigContext } from "./ConfigContext";
import { AuthContext } from "../auth/AuthContext";

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const { serverUrl } = useContext(AuthContext);
  const [appConfig, setAppConfig] = useState<Config | null>(null);

  const { data: config } = useWebSocket<Config>(
    `${serverUrl}/ws`,
    "/topic/config/load"
  );

  useEffect(() => {
    if (config) {
      setAppConfig(config);
    }
  }, [config]);

  const contextValue = useMemo(
    () => ({
      config: appConfig,
      setConfig: setAppConfig,
    }),
    [appConfig]
  );

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
}
