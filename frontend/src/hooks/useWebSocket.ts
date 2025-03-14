import { useEffect, useState } from "react";
import { webSocketManager } from "../classes/WebSocketManager";
import Cookies from "js-cookie";

export function useWebSocket<T>(serverUrl: string, topic: string) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!serverUrl || !topic) return;

    webSocketManager.connect(serverUrl, Cookies.get("authToken") || "");
    const unsubscribe = webSocketManager.subscribe<T>(topic, setData);

    return () => {
      unsubscribe();
      setData(null);
    };
  }, [topic, serverUrl]);

  return { data };
}
