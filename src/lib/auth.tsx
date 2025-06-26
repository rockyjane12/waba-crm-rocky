import { useAuth } from "@/modules/auth/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login page but save the current location they were trying to access
      router.push(`/login?from=${encodeURIComponent(pathname || '/')}`);
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    // Optionally, you can show a loading spinner or null while redirecting
    return null;
  }

  return <>{children}</>;
};

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Allow access to public routes regardless of authentication status
  return <>{children}</>;
};

// Re-export the ProtectedRoute component
export { ProtectedRoute } from '@/components/auth/ProtectedRoute';
