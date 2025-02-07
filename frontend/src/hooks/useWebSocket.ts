import { useEffect, useState } from "react";
import { webSocketManager } from "./WebSocketManager";

export function useWebSocket<T>(
  serverUrl: string,
  topic: string,
  cacheKey?: string
) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!serverUrl || !topic) return;

    webSocketManager.connect(serverUrl);
    const unsubscribe = webSocketManager.subscribe<T>(topic, setData, cacheKey);

    return () => {
      unsubscribe();
      setData(null);
    };
  }, [topic, cacheKey, serverUrl]);

  return { data };
}
