import { z } from "zod";

export const storeStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const storeFormSchema = z.object({
  name: z.string().min(2, "Ten cua hang phai co it nhat 2 ky tu"),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  province: z.string().min(1, "Vui long nhap tinh/thanh"),
  district: z.string().min(1, "Vui long nhap quan/huyen"),
  ward: z.string().min(1, "Vui long nhap phuong/xa"),
  address: z.string().min(3, "Vui long nhap dia chi chi tiet"),
  latitude: z.coerce
    .number()
    .min(-90, "Latitude phai tu -90 den 90")
    .max(90, "Latitude phai tu -90 den 90")
    .optional()
    .or(z.literal("")),
  longitude: z.coerce
    .number()
    .min(-180, "Longitude phai tu -180 den 180")
    .max(180, "Longitude phai tu -180 den 180")
    .optional()
    .or(z.literal("")),
  openingHours: z.string().max(200, "Gio mo cua toi da 200 ky tu").optional().or(z.literal("")),
  status: storeStatusSchema.default("ACTIVE"),
});

export type StoreFormInput = z.input<typeof storeFormSchema>;
export type StoreFormValues = z.infer<typeof storeFormSchema>;
