import { useEffect, useState } from "react";
import { webSocketManager } from "./WebSocketManager";
import { getCache } from "./useCache";

export function useWebSocket<T>(
  url?: string,
  topic?: string,
  cacheKey?: string
) {
  const [data, setData] = useState<T | null>(
    cacheKey ? getCache<T>(cacheKey) : null
  );
  const [isConnected, setIsConnected] = useState(false);
  const token = localStorage.getItem("authToken") || null;

  useEffect(() => {
    if (!url || !topic || !cacheKey || !token) return;

    const updateConnectionStatus = (connected: boolean) => {
      setIsConnected(connected);
    };

    const cleanupListener = webSocketManager.registerConnectionListener(
      updateConnectionStatus
    );

    webSocketManager.connect(url);

    const updateData = (newData: T) => {
      setData(newData);
    };

    const cleanupSubscription = webSocketManager.addSubscription<T>(
      topic,
      updateData,
      cacheKey
    );

    return () => {
      cleanupSubscription();
      cleanupListener();
    };
  }, [url, topic, cacheKey, token]);

  const sendMessage = (destination: string, body: object) => {
    webSocketManager.sendMessage(destination, body);
  };

  return { data, sendMessage, isConnected };
}
