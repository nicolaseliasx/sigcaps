import { useMemo } from "react";
import RestManager from "../classes/RestManager";

const useRest = (baseURL: string, getToken: () => string) => {
  const restManager = useMemo(
    () => new RestManager(baseURL, getToken),
    [baseURL, getToken]
  );

  return {
    get: <T>(url: string) => restManager.request<T>("get", url),
    post: <T, TData = unknown>(url: string, data: TData) =>
      restManager.request<T, TData>("post", url, data),
    put: <T, TData = unknown>(url: string, data: TData) =>
      restManager.request<T, TData>("put", url, data),
    delete: <T>(url: string) => restManager.request<T>("delete", url),
  };
};

export default useRest;
