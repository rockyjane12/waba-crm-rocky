"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Loading } from "@/components/ui/loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Get the current path to redirect back after login
      const currentPath = window.location.pathname;
      router.replace(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading size="lg" message="Loading..." />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}