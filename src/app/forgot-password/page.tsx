"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Container } from "@/components/ui/container";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSubmitted(true);
        toast.success("Password reset link sent to your email");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Container maxWidth="sm">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
            <CardDescription>
              {!submitted 
                ? "Enter your email to receive a password reset link" 
                : "Check your email for the reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-green-50 text-green-800 p-4 rounded-md">
                  <p>We've sent a password reset link to:</p>
                  <p className="font-medium mt-2">{email}</p>
                </div>
                <p className="text-sm text-gray-500">
                  Please check your email inbox and spam folder. The link will expire in 1 hour.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="ghost" asChild>
              <Link href="/login" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to login
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
}