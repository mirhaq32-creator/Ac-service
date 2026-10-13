import { Suspense } from "react";

import { getAdminConfigStatus, getMissingVarNames } from "@/lib/admin/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const status = getAdminConfigStatus();
  const { missingForCms } = getMissingVarNames(status);

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Suspense fallback={null}>
        <LoginForm status={status} missingForCms={missingForCms} />
      </Suspense>
    </div>
  );
}
