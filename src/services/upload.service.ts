import { apiClient } from "@/lib/axios";
import { createCrudService } from "@/services/crud-service";
import { normalizeBackendResponse } from "@/services/api-response";

export type UploadServiceItem = {
  id: string;
  url: string;
  filename: string;
  mimeType?: string;
  size?: number;
};

const service = createCrudService<UploadServiceItem, FormData, FormData>("/uploads");

export const uploadService = {
  listUploads: service.list,
  getUploadById: service.getById,
  async createUpload(payload: FormData) {
    const response = await apiClient.post("/uploads", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return normalizeBackendResponse<UploadServiceItem>(response.data);
  },
  async updateUpload(id: string | number, payload: FormData) {
    const response = await apiClient.put(`/uploads/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return normalizeBackendResponse<UploadServiceItem>(response.data);
  },
  deleteUpload: service.remove,
};

