"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Container } from "@/components/ui/container";
import { Loading } from "@/components/ui/loading";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleHashParams = async () => {
      try {
        setVerifying(true);
        
        // Get the hash from the URL
        const hash = window.location.hash.substring(1);
        if (!hash) {
          setError("Invalid or missing reset token");
          setVerifying(false);
          return;
        }

        // Parse the hash parameters
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        if (!accessToken || !refreshToken) {
          setError("Invalid reset link: missing tokens");
          setVerifying(false);
          return;
        }

        if (type !== "recovery") {
          setError("Invalid reset link type");
          setVerifying(false);
          return;
        }

        // Set the session with the tokens from the URL
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          setVerifying(false);
          return;
        }

        // Verify the session is valid
        const { data: { session }, error: verifyError } = await supabase.auth.getSession();
        
        if (verifyError || !session) {
          setError("Invalid or expired reset link");
          setVerifying(false);
          return;
        }

        setVerifying(false);
      } catch (err: any) {
        console.error("Error processing reset token:", err);
        setError(err.message || "Failed to process reset token");
        setVerifying(false);
      }
    };

    handleHashParams();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully");
        
        // Clear the hash from the URL
        window.history.replaceState(null, "", window.location.pathname);
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading size="lg" text="Verifying reset link..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Container maxWidth="sm">
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-700">Reset Link Invalid</CardTitle>
              <CardDescription>
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="mt-4">
                <Link href="/login">Return to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Container maxWidth="sm">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
            <CardDescription>
              Enter a new password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Updating..." : "Reset Password"}
              </Button>
              
              <div className="text-center mt-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login" className="flex items-center gap-2 text-sm text-gray-500">
                    <ArrowLeft className="h-4 w-4" /> Back to login
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}