import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ChamadaPaciente } from "../view/painel/painel-model";
import { getCache, setCache } from "./useCache";

export function useWebSocket(url: string, topic: string, cacheKey: string) {
  const [chamadaPaciente, setChamadaPaciente] =
    useState<ChamadaPaciente | null>(
      getCache<ChamadaPaciente>(cacheKey) || null
    );

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer tokennnn`, // TODO: Alterar para um token dinâmico
      },
    });

    stompClient.onConnect = () => {
      stompClient.subscribe(topic, (message) => {
        console.log("Received message", message);
        const receivedMessage: ChamadaPaciente = JSON.parse(message.body);
        setChamadaPaciente(receivedMessage);
        setCache(cacheKey, receivedMessage);
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [url, topic, cacheKey]);

  return { chamadaPaciente };
}
