import { ShoppingBasket } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-muted/30 px-4">
      <section className="w-full max-w-sm rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShoppingBasket className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Dang nhap Admin</h1>
            <p className="text-sm text-muted-foreground">NDT Market Dashboard</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="grid gap-2 text-sm font-medium">
            Email
            <input
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/30"
              placeholder="admin@ndtmarket.vn"
              type="email"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Mat khau
            <input
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/30"
              placeholder="Nhap mat khau"
              type="password"
            />
          </label>
          <Button className="w-full">Dang nhap</Button>
        </div>
      </section>
    </main>
  );
}

