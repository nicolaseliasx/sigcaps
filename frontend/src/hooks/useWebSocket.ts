import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getCache, setCache } from "./useCache";

/**
 * Hook genérico para conexão WebSocket
 * @param url Endereço do WebSocket
 * @param topic Tópico para subscribe
 * @param cacheKey Chave para armazenamento em cache
 * @returns Objeto com dados recebidos do WebSocket
 */
export function useWebSocket<T>(url: string, topic: string, cacheKey: string) {
  const [data, setData] = useState<T | null>(getCache<T>(cacheKey) || null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!url || !topic || !cacheKey) return;
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer tokennnn`, // TODO: Alterar para um token dinâmico
      },
    });

    stompClient.onConnect = () => {
      setIsConnected(true);
      stompClient.subscribe(topic, (message) => {
        try {
          console.log("Received message", message);

          const receivedData: T = JSON.parse(message.body);

          setData(receivedData);
          setCache(cacheKey, receivedData);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      });
    };

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      setIsConnected(false);
      stompClient.deactivate();
    };
  }, [url, topic, cacheKey]);

  const sendMessage = (destination: string, body: object) => {
    // problema aqui nao ta conectado
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.warn("WebSocket is not connected, cannot send message.");
    }
  };

  return { data, sendMessage, isConnected };
}
