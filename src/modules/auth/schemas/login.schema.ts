import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Vui long nhap email").email("Email khong hop le"),
  password: z.string().min(6, "Mat khau phai co it nhat 6 ky tu"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

