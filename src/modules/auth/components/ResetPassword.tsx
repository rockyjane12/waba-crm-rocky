import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ResetPasswordProps {
  onBack: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onBack }) => {
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetPasswordEmail) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        resetPasswordEmail,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      );

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset link sent to your email");
        onBack();
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden wa-animate-fade-in">
      <div className="p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
          <p className="text-gray-600 mt-2">
            Enter your email to receive a password reset link
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="text-gray-700">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={resetPasswordEmail}
                onChange={(e) => setResetPasswordEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border-gray-300 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300"
              onClick={onBack}
            >
              Back to Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
