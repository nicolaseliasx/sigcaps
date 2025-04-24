import axios, { AxiosInstance } from "axios";

class RestManager {
  private api: AxiosInstance;

  constructor(baseURL: string, getToken: () => string) {
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  public request<T, TData = unknown>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    data?: TData
  ): Promise<T> {
    return this.api({ method, url, data }).then((response) => response.data);
  }
}

export default RestManager;
