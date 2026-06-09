import axios from "axios";
import type { AxiosError } from "axios";

import { env } from "@/configs/env";
import { ACCESS_TOKEN_STORAGE_KEY } from "@/modules/auth/constants";
import type { ApiErrorPayload } from "@/services/api-response";

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
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? 0;
    const fallbackMessage = getFallbackErrorMessage(status);
    const message = error.response?.data?.message ?? fallbackMessage;
    const apiError: ApiErrorPayload = {
      status,
      message,
      data: error.response?.data,
    };

    if (typeof window !== "undefined" && status === 401) {
      window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);

      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(apiError);
  },
);

function getFallbackErrorMessage(status: number) {
  switch (status) {
    case 401:
      return "Phien dang nhap da het han";
    case 403:
      return "Ban khong co quyen thuc hien thao tac nay";
    case 500:
      return "May chu dang gap su co";
    default:
      return "Da co loi xay ra";
  }
}
