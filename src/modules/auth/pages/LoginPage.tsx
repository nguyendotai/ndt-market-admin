"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShoppingBasket } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  authService,
  getAccessTokenFromLoginResponse,
  getUserFromLoginResponse,
  isAdminAllowedRole,
  loginSchema,
  type LoginFormValues,
} from "@/modules/auth";
import { setCredentials } from "@/store/slices";
import { useAppDispatch } from "@/store/hooks";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setSubmitting(true);

    try {
      const loginResponse = await authService.login(values);
      const accessToken = getAccessTokenFromLoginResponse(loginResponse);

      if (!accessToken) {
        throw new Error("Missing access token");
      }

      window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);

      const user = getUserFromLoginResponse(loginResponse) ?? (await authService.me());

      if (!isAdminAllowedRole(user.role)) {
        window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        toast.error("Tai khoan khong co quyen truy cap dashboard");
        return;
      }

      dispatch(setCredentials({ accessToken, user }));
      toast.success("Dang nhap thanh cong");
      router.replace(searchParams.get("redirect") || "/admin");
    } catch {
      window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      toast.error("Dang nhap that bai. Vui long kiem tra email va mat khau.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-muted/40 px-4">
      <section className="w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20">
            <ShoppingBasket className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Dang nhap Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              NDT Market Dashboard
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="grid gap-2 text-sm font-medium">
            Email
            <input
              autoComplete="email"
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/30"
              placeholder="admin@ndtmarket.vn"
              type="email"
              {...register("email")}
            />
            {errors.email ? (
              <span className="text-xs font-medium text-destructive">
                {errors.email.message}
              </span>
            ) : null}
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Mat khau
            <input
              autoComplete="current-password"
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/30"
              placeholder="Nhap mat khau"
              type="password"
              {...register("password")}
            />
            {errors.password ? (
              <span className="text-xs font-medium text-destructive">
                {errors.password.message}
              </span>
            ) : null}
          </label>

          <Button className="h-10 w-full" disabled={submitting} type="submit">
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            Dang nhap
          </Button>
        </form>
      </section>
    </main>
  );
}

