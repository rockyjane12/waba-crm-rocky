import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EmailLoginProps {
  onForgotPassword: () => void;
}

const EmailLogin: React.FC<EmailLoginProps> = ({ onForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 border-gray-300 focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-gray-700">
            Password
          </Label>
          <Link 
            href="/forgot-password" 
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 border-gray-300 focus:border-primary"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 group"
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </form>
  );
};

export default EmailLogin;