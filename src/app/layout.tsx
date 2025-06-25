import { validateEnvVariables, REQUIRED_ENV_VARS } from "@/lib/utils/env";
import { Metadata } from "next";
import { RootErrorBoundary } from "./RootErrorBoundary";
import { AuthProviderWrapper } from "@/components/AuthProviderWrapper";
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
        <AuthProviderWrapper>
          <RootErrorBoundary>{children}</RootErrorBoundary>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
