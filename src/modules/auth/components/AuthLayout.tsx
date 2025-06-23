"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyNWQzNjYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat" />

      <div className="relative">
        {/* Header */}
        <header className="p-4 sm:p-6">
          <div className="container-responsive">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gradient-primary">
                    WABA Admin
                  </span>
                </div>
              </Link>

              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="container-responsive py-8 sm:py-12">{children}</div>
      </div>
    </div>
  );
}
