"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { MessageCircle } from "lucide-react";
import EmailLogin from "@/modules/auth/components/EmailLogin";
import { useAuth, AuthProvider } from "@/modules/auth/context/AuthContext";
import { Loading } from "@/components/ui/loading";
import { withPageErrorBoundary } from "@/components/hoc/withPageErrorBoundary";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      // Get the redirectTo parameter from the URL
      const redirectTo = searchParams?.get("redirectTo");
      // Redirect to the requested page or dashboard if not specified
      router.replace(redirectTo || "/dashboard");
    }
  }, [user, loading, router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Container maxWidth="sm">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
            <CardTitle className="text-2xl font-bold text-center">
                    WABA Admin
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmailLogin onForgotPassword={() => router.push("/reset-password")} />
            <div className="mt-6 text-center text-sm text-gray-500">
              <p className="mb-2">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
              <p>
                Need help?{" "}
                <a
                  href="mailto:support@example.com"
                  className="text-primary hover:underline"
                >
                  Contact support
                </a>
              </p>
                </div>
              </CardContent>
            </Card>
      </Container>
    </div>
  );
}

export default withPageErrorBoundary(() => (
  <AuthProvider>
    <LoginPage />
  </AuthProvider>
));
