export const dynamic = "force-dynamic";

import SecuredHeader from "@/components/layout/ProtectedLayout/SecuredHeader";
import SecuredMain from "@/components/layout/ProtectedLayout/SecuredMain";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { SecuredHeaderSuspense } from "@/components/layout/ProtectedLayout/SecuredHeaderSuspense";
import { SecuredMainSuspense } from "@/components/layout/ProtectedLayout/SecuredMainSuspense";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

import { memo } from "react";

const ProtectedLayout = memo(function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <ErrorBoundary>
      <SecuredHeader>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SecuredHeaderSuspense />
        </div>
      </SecuredHeader>
      <SecuredMainSuspense>
        <SecuredMain>{children}</SecuredMain>
      </SecuredMainSuspense>
    </ErrorBoundary>
  );
});

export default ProtectedLayout;