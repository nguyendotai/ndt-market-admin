"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ACCESS_TOKEN_STORAGE_KEY,
  authService,
  isAdminAllowedRole,
} from "@/modules/auth";
import { clearAuth, setCredentials } from "@/store/slices";
import { useAppDispatch } from "@/store/hooks";

type LoginGuardProps = {
  children: React.ReactNode;
};

export function LoginGuard({ children }: LoginGuardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function redirectAuthenticatedUser() {
      const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

      if (!accessToken) {
        setChecking(false);
        return;
      }

      try {
        const currentUser = await authService.me();

        if (!isAdminAllowedRole(currentUser.role)) {
          window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
          dispatch(clearAuth());
          setChecking(false);
          return;
        }

        dispatch(setCredentials({ accessToken, user: currentUser }));
        router.replace(searchParams.get("redirect") || "/admin");
      } catch {
        window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        dispatch(clearAuth());

        if (active) {
          setChecking(false);
        }
      }
    }

    redirectAuthenticatedUser();

    return () => {
      active = false;
    };
  }, [dispatch, router, searchParams]);

  if (checking) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return children;
}

