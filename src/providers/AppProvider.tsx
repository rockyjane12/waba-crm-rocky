"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/modules/auth/context/AuthContext";
import { Toast } from "@/modules/toast/components/Toast";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider defaultTheme="system" storageKey="whatsapp-theme">
        <AuthProvider>
          <TooltipProvider delayDuration={300}>
            {children}
            <Toast />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}