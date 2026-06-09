import { apiClient } from "@/lib/axios";
import { normalizeBackendResponse } from "@/services/api-response";

export type UploadFolder =
  | "product"
  | "category"
  | "brand"
  | "banner"
  | "article"
  | "avatar"
  | "review";

export type UploadImageResponse = {
  imageUrl: string;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const uploadService = {
  async uploadImage(file: File, folder: UploadFolder) {
    validateImageFile(file);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    const response = await apiClient.post("/uploads/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return normalizeBackendResponse<UploadImageResponse>(response.data);
  },
};

function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Chi ho tro anh jpg, jpeg, png hoac webp");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Dung luong anh toi da la 5MB");
  }
}
