"use client";

import React from "react";
import { AppProvider } from "@/providers/AppProvider";

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
