"use client";

import { SignupForm } from "@/modules/auth/components/SignupForm";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { withPageErrorBoundary } from "@/components/hoc/withPageErrorBoundary";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "@/components/ui/loading";

function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading size="lg" message="Loading..." />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}

export default withPageErrorBoundary(SignupPage, {
  title: "Signup Error",
  showHomeLink: true,
});