"use client";

import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <section className="grid min-h-[55dvh] place-items-center">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
          <ShieldAlert className="size-6" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">403</h1>
        <p className="mt-2 font-medium">Khong du quyen truy cap</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Tai khoan cua ban chua duoc cap role hoac permission can thiet cho khu vuc nay.
        </p>
        <Button className="mt-5" variant="outline" onClick={() => window.history.back()}>
          Quay lai
        </Button>
      </div>
    </section>
  );
}
