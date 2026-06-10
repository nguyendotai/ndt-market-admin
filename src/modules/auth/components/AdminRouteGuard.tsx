"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { AccessDenied } from "@/components/common/access-denied";
import { adminMenu } from "@/configs/menu";
import { canAccess, type AccessRule } from "@/modules/auth/access-control";
import { useAppSelector } from "@/store/hooks";

type AdminRouteGuardProps = {
  children: React.ReactNode;
};

const extraRouteRules: Array<{ href: string; rule: AccessRule }> = [
  { href: "/admin/article-categories", rule: { requiredPermissions: ["article.view"] } },
];

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const rule = useMemo(() => getRuleForPathname(pathname), [pathname]);

  if (!canAccess(user, rule)) {
    return <AccessDenied />;
  }

  return children;
}

function getRuleForPathname(pathname: string): AccessRule | undefined {
  const routes = [
    ...extraRouteRules,
    ...adminMenu.map((item) => ({
      href: item.href,
      rule: {
        requiredPermissions: item.requiredPermissions,
        requiredRoles: item.requiredRoles,
      },
    })),
  ].sort((a, b) => b.href.length - a.href.length);

  return routes.find((route) => pathname === route.href || pathname.startsWith(`${route.href}/`))?.rule;
}
