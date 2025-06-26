"use client";

import React from "react";
import { AppSidebar } from "@/components/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { withPageErrorBoundary } from "@/components/hoc/withPageErrorBoundary";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/common/useIsMobile";
import { cn } from "@/lib/utils";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <main className={cn(
              "flex-1 overflow-y-auto",
              isMobile ? "px-2 py-4" : "px-4 py-6 md:px-6 lg:px-8"
            )}>
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

export default withPageErrorBoundary(DashboardLayout);