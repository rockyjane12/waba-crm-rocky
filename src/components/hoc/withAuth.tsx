"use client";

import { useRouter } from "next/router";
import { ComponentType, useEffect } from "react";
import { useAuth } from "@/modules/auth";
import { Loading } from "@/components/ui/loading";

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options = { redirectUrl: "/login" },
) {
  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
      if (!loading && !user) {
        router.replace(options.redirectUrl);
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

    return <Component {...props} />;
  };
}
