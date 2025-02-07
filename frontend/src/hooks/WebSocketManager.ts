import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getCache, setCache } from "./useCache";

type SubscriptionCallback<T> = (data: T) => void;

class WebSocketManager {
  private static instance: WebSocketManager;
  private client: Client | null = null;
  private subscriptions: Map<string, SubscriptionCallback<unknown>[]> =
    new Map();
  private connectionCount: number = 0;
  private serverUrl: string = "";
  private isConnected: boolean = false;
  private connectionListeners: Set<(connected: boolean) => void> = new Set();

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private getToken() {
    return localStorage.getItem("authToken") || "";
  }

  private notifyConnectionStatus() {
    this.connectionListeners.forEach((listener) => listener(this.isConnected));
  }

  registerConnectionListener(listener: (connected: boolean) => void) {
    listener(this.isConnected);
    this.connectionListeners.add(listener);
    return () => this.connectionListeners.delete(listener);
  }

  connect(url: string) {
    if (this.client && this.serverUrl === url) return;

    this.serverUrl = url;
    this.client = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });

    this.client.onConnect = () => {
      this.isConnected = true;
      this.notifyConnectionStatus();
      this.subscriptions.forEach((_, topic) => {
        this.subscribeToTopic(topic);
      });
    };

    this.client.onDisconnect = () => {
      this.isConnected = false;
      this.notifyConnectionStatus();
    };

    this.client.activate();
  }

  private subscribeToTopic<T>(topic: string) {
    this.client?.subscribe(topic, (message) => {
      const callbacks = this.subscriptions.get(topic) || [];
      callbacks.forEach((callback) => {
        try {
          const data: T = this.safeParse(message.body);
          callback(data);
        } catch (error) {
          console.error("Error handling message:", error);
        }
      });
    });
  }

  private safeParse<T>(body: string): T {
    try {
      return JSON.parse(body) as T;
    } catch {
      return body as unknown as T;
    }
  }

  addSubscription<T>(
    topic: string,
    callback: SubscriptionCallback<T>,
    cacheKey: string
  ) {
    this.connectionCount++;

    const cachedData = getCache<T>(cacheKey);
    if (cachedData) {
      callback(cachedData);
    }

    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, []);
      if (this.client?.connected) {
        this.subscribeToTopic<T>(topic);
      }
    }

    const wrappedCallback = (data: T) => {
      callback(data);
      setCache(cacheKey, data);
    };

    this.subscriptions
      .get(topic)
      ?.push(wrappedCallback as SubscriptionCallback<unknown>);

    return () =>
      this.removeSubscription(
        topic,
        wrappedCallback as SubscriptionCallback<unknown>
      );
  }

  private removeSubscription(
    topic: string,
    callback: SubscriptionCallback<unknown>
  ) {
    this.connectionCount--;
    const callbacks = this.subscriptions.get(topic) || [];
    const filtered = callbacks.filter((cb) => cb !== callback);
    this.subscriptions.set(topic, filtered);

    if (this.connectionCount === 0) {
      this.disconnect();
    }
  }

  sendMessage(destination: string, body: object) {
    if (this.client?.connected) {
      this.client.publish({ destination, body: JSON.stringify(body) });
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.subscriptions.clear();
      this.connectionCount = 0;
      this.isConnected = false;
      this.notifyConnectionStatus();
    }
  }
}

export const webSocketManager = WebSocketManager.getInstance();
