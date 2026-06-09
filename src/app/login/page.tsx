import { Suspense } from "react";

import { LoginGuard } from "@/modules/auth/components/LoginGuard";
import { LoginPage as LoginPageModule } from "@/modules/auth/pages/LoginPage";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginGuard>
        <LoginPageModule />
      </LoginGuard>
    </Suspense>
  );
}
