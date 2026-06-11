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
  (error: AxiosError<unknown>) => {
    const status = error.response?.status ?? 0;
    const fallbackMessage = getFallbackErrorMessage(status);
    const message = getApiErrorMessage(error.response?.data, fallbackMessage);
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

function getApiErrorMessage(payload: unknown, fallbackMessage: string) {
  if (!payload || typeof payload !== "object") {
    return fallbackMessage;
  }

  const record = payload as Record<string, unknown>;
  const details = [
    record.errors,
    record.error,
    record.details,
    record.data,
  ]
    .map(formatErrorDetail)
    .filter(Boolean);
  const message = formatErrorDetail(record.message);

  return [message, ...details].filter(Boolean).join(": ") || fallbackMessage;
}

function formatErrorDetail(value: unknown): string {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(formatErrorDetail).filter(Boolean).join(", ");
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const field = formatErrorDetail(record.field ?? record.path ?? record.property);
    const message = formatErrorDetail(record.message ?? record.msg ?? record.reason);

    if (field && message) {
      return `${field} ${message}`;
    }

    if (message) {
      return message;
    }

    return Object.entries(record)
      .map(([key, entryValue]) => {
        const formattedValue = formatErrorDetail(entryValue);
        return formattedValue ? `${key}: ${formattedValue}` : "";
      })
      .filter(Boolean)
      .join(", ");
  }

  return String(value);
}

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
