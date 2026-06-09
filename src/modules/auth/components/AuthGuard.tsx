"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  ACCESS_TOKEN_STORAGE_KEY,
  authService,
  isAdminAllowedRole,
} from "@/modules/auth";
import { clearAuth, setCredentials } from "@/store/slices";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function verifySession() {
      const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

      if (!accessToken) {
        dispatch(clearAuth());
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (isAuthenticated && isAdminAllowedRole(user?.role)) {
        setChecking(false);
        return;
      }

      try {
        const currentUser = await authService.me();

        if (!isAdminAllowedRole(currentUser.role)) {
          window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
          dispatch(clearAuth());
          toast.error("Tai khoan khong co quyen truy cap dashboard");
          router.replace("/login");
          return;
        }

        if (active) {
          dispatch(setCredentials({ accessToken, user: currentUser }));
          setChecking(false);
        }
      } catch {
        window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        dispatch(clearAuth());
        toast.error("Phien dang nhap da het han");
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }

    verifySession();

    return () => {
      active = false;
    };
  }, [dispatch, isAuthenticated, pathname, router, user?.role]);

  if (checking) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-background">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Loader2 className="size-6 animate-spin" />
          </div>
          <p className="font-medium">Dang kiem tra phien dang nhap</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Vui long cho trong giay lat.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

