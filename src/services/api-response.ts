export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
};

export type BackendResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type ApiErrorPayload = {
  status: number;
  message: string;
  data?: unknown;
};

export function normalizeBackendResponse<T>(payload: unknown): BackendResponse<T> {
  if (isBackendResponse<T>(payload)) {
    return {
      success: Boolean(payload.success),
      message: payload.message ?? "",
      data: payload.data,
      meta: payload.meta,
    };
  }

  return {
    success: true,
    message: "",
    data: payload as T,
  };
}

function isBackendResponse<T>(payload: unknown): payload is Partial<BackendResponse<T>> & { data: T } {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  return "data" in payload || "success" in payload || "message" in payload || "meta" in payload;
}

