import { Inter } from "next/font/google";
import { validateEnvVariables, REQUIRED_ENV_VARS } from "@/lib/utils/env";
import { AppProvider } from "@/providers/AppProvider";
import { Metadata } from "next";
import { RootErrorBoundary } from "./RootErrorBoundary";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

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
      <body className={inter.className}>
        <AppProvider>
          <RootErrorBoundary>{children}</RootErrorBoundary>
        </AppProvider>
      </body>
    </html>
  );
}
