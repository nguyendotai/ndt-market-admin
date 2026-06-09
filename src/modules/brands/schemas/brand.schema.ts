import { z } from "zod";

export const brandFormSchema = z.object({
  name: z.string().min(2, "Ten thuong hieu phai co it nhat 2 ky tu"),
  slug: z
    .string()
    .min(2, "Slug phai co it nhat 2 ky tu")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chi gom chu thuong, so va dau gach ngang"),
  logo: z
    .string()
    .url("Logo phai la URL hop le")
    .optional()
    .or(z.literal("")),
  description: z.string().max(500, "Mo ta toi da 500 ky tu").optional(),
  isActive: z.boolean().default(true),
});

export type BrandFormInput = z.input<typeof brandFormSchema>;
export type BrandFormValues = z.infer<typeof brandFormSchema>;
