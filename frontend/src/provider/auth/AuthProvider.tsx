import { useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";

import Cookies from "js-cookie";
import useRest from "../../hooks/useRest";

const VITE_BOOTSTRAP = import.meta.env.VITE_BOOTSTRAP_KEY;
const VITE_SERVER_IP = "127.0.0.1";
const BOOTSTRAP_EXECUTED_KEY = "bootstrap_executed";

interface AuthResponseDto {
  token: string;
  refreshToken: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [serverUrl, setServerUrl] = useState(
    localStorage.getItem("serverUrl") || ""
  );
  const [token, setToken] = useState(Cookies.get("authToken") || "");
  const [refreshToken, setRefreshToken] = useState(
    Cookies.get("refreshToken") || ""
  );

  const { get } = useRest(serverUrl, () => token);
  const bootstrapExecutedRef = useRef(
    localStorage.getItem(BOOTSTRAP_EXECUTED_KEY) === "true"
  );

  useEffect(() => {
    if (!serverUrl && VITE_SERVER_IP) {
      const initialUrl = `http://${VITE_SERVER_IP}:8081`;
      setServerUrl(initialUrl);
      localStorage.setItem("serverUrl", initialUrl);
    }
  }, [serverUrl]);

  useEffect(() => {
    const fetchBootstrap = async () => {
      if (bootstrapExecutedRef.current || !serverUrl || !VITE_BOOTSTRAP) return;

      bootstrapExecutedRef.current = true;
      localStorage.setItem(BOOTSTRAP_EXECUTED_KEY, "true");

      try {
        const response = await get<AuthResponseDto>(
          `/auth/bootstrap?bootstrapKey=${VITE_BOOTSTRAP}`
        );

        if (response?.token && response?.refreshToken) {
          Cookies.set("authToken", response.token);
          Cookies.set("refreshToken", response.refreshToken);
          setToken(response.token);
          setRefreshToken(response.refreshToken);
        }
      } catch (error) {
        console.error("Bootstrap error:", error);
      }
    };

    fetchBootstrap();
  }, [get, serverUrl]);

  const contextValue = useMemo(
    () => ({
      serverUrl,
      setServerUrl: (url: string) => {
        setServerUrl(url);
        localStorage.setItem("serverUrl", url);
      },
      token,
      setToken: (newToken: string) => {
        setToken(newToken);
        Cookies.set("authToken", newToken);
      },
      refreshToken,
    }),
    [serverUrl, token, refreshToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
