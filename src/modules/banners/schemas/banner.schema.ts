import { z } from "zod";

export const bannerStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const bannerFormSchema = z
  .object({
    title: z.string().min(2, "Tieu de banner phai co it nhat 2 ky tu"),
    imageUrl: z.string().url("Image URL khong hop le"),
    linkUrl: z.string().url("Link URL khong hop le").optional().or(z.literal("")),
    position: z.string().min(1, "Vui long chon vi tri banner"),
    startDate: z.string().min(1, "Vui long chon ngay bat dau"),
    endDate: z.string().min(1, "Vui long chon ngay ket thuc"),
    status: bannerStatusSchema.default("ACTIVE"),
    sortOrder: z.coerce.number().int("Thu tu phai la so nguyen").min(0, "Thu tu khong duoc am"),
  })
  .refine((values) => new Date(values.endDate).getTime() >= new Date(values.startDate).getTime(), {
    message: "Ngay ket thuc phai sau ngay bat dau",
    path: ["endDate"],
  });

export type BannerFormInput = z.input<typeof bannerFormSchema>;
export type BannerFormValues = z.infer<typeof bannerFormSchema>;
