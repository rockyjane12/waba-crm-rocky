import { validateEnvVariables, REQUIRED_ENV_VARS } from "@/lib/utils/env";
import { AppProvider } from "@/providers/AppProvider";
import { Metadata } from "next";
import { RootErrorBoundary } from "./RootErrorBoundary";
import "@/styles/globals.css";

// Validate required environment variables
validateEnvVariables(REQUIRED_ENV_VARS);

export const metadata: Metadata = {
  title: "WABA Dashboard",
  description: "WhatsApp Business API Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AppProvider>
          <RootErrorBoundary>{children}</RootErrorBoundary>
        </AppProvider>
      </body>
    </html>
  );
}