import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketManager {
  private client: Client | null = null;
  private subscriptions = new Map<string, Set<(data: unknown) => void>>();

  private static instance: WebSocketManager;

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  connect(url: string, token: string) {
    if (this.client) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      connectHeaders: { Authorization: `Bearer ${token}` },
    });

    this.client.onConnect = () => {
      this.subscriptions.forEach((_, topic) => {
        this.setupWebSocketSubscription(topic);
      });
    };

    this.client.activate();
  }

  private setupWebSocketSubscription<T>(topic: string) {
    return this.client?.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body) as T;
        this.notifySubscribers(topic, data);
      } catch (error) {
        console.error("WebSocket parsing error:", error);
      }
    });
  }

  private notifySubscribers<T>(topic: string, data: T) {
    this.subscriptions.get(topic)?.forEach((callback) => {
      (callback as (data: T) => void)(data);
    });
  }

  subscribe<T>(topic: string, callback: (data: T) => void): () => void {
    const wrapper = (data: T) => {
      callback(data);

      localStorage.setItem(topic, JSON.stringify(data));
    };

    const cachedData = localStorage.getItem(topic);
    if (cachedData) {
      try {
        callback(JSON.parse(cachedData));
      } catch (error) {
        console.error("Cache parsing error:", error);
      }
    }

    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
    }
    this.subscriptions.get(topic)?.add(wrapper as (data: unknown) => void);

    if (this.client?.connected) {
      const subscription = this.setupWebSocketSubscription<T>(topic);

      return () => {
        subscription?.unsubscribe();
        this.subscriptions
          .get(topic)
          ?.delete(wrapper as (data: unknown) => void);
      };
    }

    return () => {
      this.subscriptions.get(topic)?.delete(wrapper as (data: unknown) => void);
    };
  }
}

export const webSocketManager = WebSocketManager.getInstance();
