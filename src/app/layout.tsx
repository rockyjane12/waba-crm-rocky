import { validateEnvVariables, REQUIRED_ENV_VARS } from "@/lib/utils/env";
import { AppProvider } from "@/providers/AppProvider";
import { Metadata } from "next";
import { RootErrorBoundary } from "./RootErrorBoundary";
import "@/styles/globals.css";
import { Inter } from 'next/font/google';

// Validate required environment variables
validateEnvVariables(REQUIRED_ENV_VARS);

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "WABA Dashboard",
  description: "WhatsApp Business API Dashboard",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: {
      rel: 'icon',
      url: '/favicon.ico',
    },
  },
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