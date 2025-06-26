"use client";

import { useAuth } from "@/modules/auth/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};