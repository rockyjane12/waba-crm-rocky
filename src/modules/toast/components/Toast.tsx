"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { useTheme } from "@/components/theme-provider";
import React from "react";
import { Button } from "@/components/ui/button";
import { ToastAction as ToastActionType } from "../types";

export interface ToastProps {
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
  duration?: number;
  gap?: number;
  visibleToasts?: number;
  closeButton?: boolean;
  toastOptions?: {
    classNames?: {
      toast?: string;
      title?: string;
      description?: string;
      actionButton?: string;
      cancelButton?: string;
      closeButton?: string;
      success?: string;
      error?: string;
      warning?: string;
      info?: string;
      loading?: string;
    };
    style?: React.CSSProperties;
  };
}

export function Toast({
  position = "bottom-right",
  duration = 3000,
  gap = 8,
  visibleToasts = 3,
  closeButton = true,
  toastOptions,
}: ToastProps = {}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const baseToastClasses =
    "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg";

  return (
    <Toaster
      theme={theme as "light" | "dark"}
      className="toaster group"
      position={position}
      duration={duration}
      gap={gap}
      visibleToasts={visibleToasts}
      closeButton={closeButton}
      toastOptions={{
        classNames: {
          toast: baseToastClasses,
          title: "group-[.toast]:text-foreground group-[.toast]:font-semibold",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:text-foreground/50 group-[.toast]:hover:text-foreground",
          success: `${baseToastClasses} border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100`,
          error: `${baseToastClasses} border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100`,
          warning: `${baseToastClasses} border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-100`,
          info: `${baseToastClasses} border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100`,
          loading: `${baseToastClasses} border-gray-500 bg-gray-50 dark:bg-gray-900/20 text-gray-900 dark:text-gray-100`,
          ...toastOptions?.classNames,
        },
        style: {
          ...toastOptions?.style,
        },
      }}
    />
  );
}

interface ToastActionProps {
  action: ToastActionType;
}

export function ToastAction({ action }: ToastActionProps) {
  return (
    <Button size="sm" className="mt-2" onClick={action.onClick}>
      {action.label}
    </Button>
  );
}
