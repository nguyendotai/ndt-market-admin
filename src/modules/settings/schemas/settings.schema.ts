import { z } from "zod";

export const profileSettingsSchema = z.object({
  fullName: z.string().min(2, "Ho ten phai co it nhat 2 ky tu"),
  avatar: z.string().url("Avatar URL khong hop le").optional().or(z.literal("")),
  email: z.string().email("Email khong hop le"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Mat khau hien tai phai co it nhat 6 ky tu"),
    newPassword: z.string().min(8, "Mat khau moi phai co it nhat 8 ky tu"),
    confirmPassword: z.string().min(8, "Xac nhan mat khau phai co it nhat 8 ky tu"),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Confirm password khong khop",
    path: ["confirmPassword"],
  });

export const storeSettingsSchema = z.object({
  storeName: z.string().min(2, "Ten cua hang phai co it nhat 2 ky tu"),
  phone: z.string().min(8, "So dien thoai khong hop le"),
  email: z.string().email("Email cua hang khong hop le"),
  address: z.string().min(5, "Dia chi phai co it nhat 5 ky tu"),
  defaultShippingFee: z.coerce.number().min(0, "Phi ship khong duoc am"),
  freeShippingThreshold: z.coerce.number().min(0, "Nguong mien phi ship khong duoc am"),
});

export const systemSettingsSchema = z.object({
  themeDefault: z.enum(["system", "light", "dark"]),
  maintenanceMode: z.boolean(),
});

export type ProfileSettingsInput = z.input<typeof profileSettingsSchema>;
export type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;
export type ChangePasswordInput = z.input<typeof changePasswordSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
export type StoreSettingsInput = z.input<typeof storeSettingsSchema>;
export type StoreSettingsValues = z.infer<typeof storeSettingsSchema>;
export type SystemSettingsInput = z.input<typeof systemSettingsSchema>;
export type SystemSettingsValues = z.infer<typeof systemSettingsSchema>;
