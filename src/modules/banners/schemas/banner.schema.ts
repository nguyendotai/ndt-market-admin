import { z } from "zod";

export const bannerStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const bannerFormSchema = z
  .object({
    title: z.string().trim().min(2, "Tieu de banner phai co it nhat 2 ky tu"),
    imageUrl: z.string().trim().url("Image URL phai la URL day du, vi du https://res.cloudinary.com/..."),
    linkUrl: z.string().trim().url("Link URL phai la URL day du, vi du https://example.com"),
    position: z.string().trim().min(1, "Vui long chon vi tri banner"),
    startDate: z.string().min(1, "Vui long chon ngay bat dau"),
    endDate: z.string().min(1, "Vui long chon ngay ket thuc"),
    status: bannerStatusSchema.default("ACTIVE"),
    sortOrder: z.coerce.number().int("Thu tu phai la so nguyen").min(1, "Thu tu phai lon hon hoac bang 1"),
  })
  .refine((values) => new Date(values.endDate).getTime() >= new Date(values.startDate).getTime(), {
    message: "Ngay ket thuc phai sau ngay bat dau",
    path: ["endDate"],
  });

export type BannerFormInput = z.input<typeof bannerFormSchema>;
export type BannerFormValues = z.infer<typeof bannerFormSchema>;
