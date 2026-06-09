import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(2, "Ten danh muc phai co it nhat 2 ky tu"),
  parentId: z.string().optional().nullable(),
  slug: z
    .string()
    .min(2, "Slug phai co it nhat 2 ky tu")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chi gom chu thuong, so va dau gach ngang"),
  image: z
    .string()
    .url("Image phai la URL hop le")
    .optional()
    .or(z.literal("")),
  sortOrder: z.coerce.number().int("Thu tu phai la so nguyen").min(0, "Thu tu khong duoc am"),
  isActive: z.boolean().default(true),
});

export type CategoryFormInput = z.input<typeof categoryFormSchema>;
export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
