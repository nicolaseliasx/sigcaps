import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketManager {
  private client: Client | null = null;
  private serverUrl: string = "";
  private subscriptions = new Map<string, Set<(data: unknown) => void>>();
  private pollingIntervals = new Map<string, number>();

  private getToken() {
    return localStorage.getItem("authToken") || "";
  }

  connect(url: string) {
    if (this.client || this.serverUrl === url) return;

    this.serverUrl = url;
    this.client = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      connectHeaders: { Authorization: `Bearer ${this.getToken()}` },
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

  subscribe<T>(
    topic: string,
    callback: (data: T) => void,
    cacheKey?: string
  ): () => void {
    const wrapper = (data: T) => {
      callback(data);
      if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
    };

    if (cacheKey) {
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          callback(JSON.parse(cachedData));
        } catch (error) {
          console.error("Cache parsing error:", error);
        }
      }
    }

    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
    }
    this.subscriptions.get(topic)?.add(wrapper as (data: unknown) => void);

    if (this.client?.connected) {
      const subscription = this.setupWebSocketSubscription<T>(topic);
      const interval = this.pollingIntervals.get(topic);
      if (interval) {
        clearInterval(interval);
        this.pollingIntervals.delete(topic);
      }

      return () => {
        subscription?.unsubscribe();
        this.subscriptions
          .get(topic)
          ?.delete(wrapper as (data: unknown) => void);
      };
    }

    return () => {
      const interval = this.pollingIntervals.get(topic);
      if (interval) clearInterval(interval);
      this.subscriptions.get(topic)?.delete(wrapper as (data: unknown) => void);
    };
  }
}

export const webSocketManager = new WebSocketManager();
