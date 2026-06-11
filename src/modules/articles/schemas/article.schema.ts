import { z } from "zod";

export const articleStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const articleFormSchema = z.object({
  title: z.string().min(2, "Tieu de phai co it nhat 2 ky tu"),
  slug: z
    .string()
    .min(2, "Slug phai co it nhat 2 ky tu")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chi gom chu thuong, so va dau gach ngang"),
  thumbnail: z.string().url("Thumbnail URL khong hop le").optional().or(z.literal("")),
  excerpt: z.string().max(500, "Excerpt toi da 500 ky tu").optional(),
  content: z.string().min(10, "Content phai co it nhat 10 ky tu"),
  category: z.string().optional().or(z.literal("")),
  status: articleStatusSchema.default("DRAFT"),
  publishedAt: z.string().optional().or(z.literal("")),
});

export const articleCategorySchema = z.object({
  name: z.string().min(2, "Ten category phai co it nhat 2 ky tu"),
  slug: z
    .string()
    .min(2, "Slug phai co it nhat 2 ky tu")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chi gom chu thuong, so va dau gach ngang"),
});

export type ArticleFormInput = z.input<typeof articleFormSchema>;
export type ArticleFormValues = z.infer<typeof articleFormSchema>;
export type ArticleCategoryInput = z.input<typeof articleCategorySchema>;
export type ArticleCategoryValues = z.infer<typeof articleCategorySchema>;
