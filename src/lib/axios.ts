import axios from "axios";

import { env } from "@/configs/env";
import { ACCESS_TOKEN_STORAGE_KEY } from "@/modules/auth/constants";

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }

    return Promise.reject(error);
  },
);
