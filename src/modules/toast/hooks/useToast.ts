"use client";

import { toast as sonnerToast, type ExternalToast, type Action } from "sonner";
import { ToastOptions } from "../types";

type ToastFunction = (options: Omit<ToastOptions, "variant">) => void;

export function useToast() {
  const showToast = (options: ToastOptions) => {
    const {
      title,
      description,
      action,
      cancel,
      duration,
      position,
      variant = "default",
    } = options;
    const toastData: ExternalToast & { title?: React.ReactNode } = {
      description,
      action: action
        ? ({
            label: action.label,
            onClick: (e) => action.onClick?.(),
          } as Action)
        : undefined,
      cancel: cancel
        ? ({
            label: cancel.label,
            onClick: (e) => cancel.onClick?.(),
          } as Action)
        : undefined,
      duration,
      position,
    };

    switch (variant) {
      case "success":
        sonnerToast.success(title as string, toastData);
        break;
      case "error":
        sonnerToast.error(title as string, toastData);
        break;
      case "warning":
        sonnerToast.warning(title as string, toastData);
        break;
      case "info":
        sonnerToast.info(title as string, toastData);
        break;
      case "loading":
        sonnerToast.loading(title as string, toastData);
        break;
      default:
        sonnerToast(title as string, toastData);
    }
  };

  return {
    toast: (options: Omit<ToastOptions, "variant">) =>
      showToast({ ...options }),
    success: (options: Omit<ToastOptions, "variant">) =>
      showToast({ ...options, variant: "success" }),
    error: (options: Omit<ToastOptions, "variant">) =>
      showToast({ ...options, variant: "error" }),
    warning: (options: Omit<ToastOptions, "variant">) =>
      showToast({ ...options, variant: "warning" }),
    info: (options: Omit<ToastOptions, "variant">) =>
      showToast({ ...options, variant: "info" }),
    loading: (options: Omit<ToastOptions, "variant">) =>
      showToast({ ...options, variant: "loading" }),
    dismiss: sonnerToast.dismiss,
  };
}

// Create a utility function for direct usage without hooks
const showToastDirect = (options: ToastOptions) => {
  const {
    title,
    description,
    action,
    cancel,
    duration,
    position,
    variant = "default",
  } = options;
  const toastData: ExternalToast & { title?: React.ReactNode } = {
    description,
    action: action
      ? ({
          label: action.label,
          onClick: (e) => action.onClick?.(),
        } as Action)
      : undefined,
    cancel: cancel
      ? ({
          label: cancel.label,
          onClick: (e) => cancel.onClick?.(),
        } as Action)
      : undefined,
    duration,
    position,
  };

  switch (variant) {
    case "success":
      sonnerToast.success(title as string, toastData);
      break;
    case "error":
      sonnerToast.error(title as string, toastData);
      break;
    case "warning":
      sonnerToast.warning(title as string, toastData);
      break;
    case "info":
      sonnerToast.info(title as string, toastData);
      break;
    case "loading":
      sonnerToast.loading(title as string, toastData);
      break;
    default:
      sonnerToast(title as string, toastData);
  }
};

// Export a utility object for direct usage without hooks
export const toast = {
  default: (options: Omit<ToastOptions, "variant">) =>
    showToastDirect({ ...options }),
  success: (options: Omit<ToastOptions, "variant">) =>
    showToastDirect({ ...options, variant: "success" }),
  error: (options: Omit<ToastOptions, "variant">) =>
    showToastDirect({ ...options, variant: "error" }),
  warning: (options: Omit<ToastOptions, "variant">) =>
    showToastDirect({ ...options, variant: "warning" }),
  info: (options: Omit<ToastOptions, "variant">) =>
    showToastDirect({ ...options, variant: "info" }),
  loading: (options: Omit<ToastOptions, "variant">) =>
    showToastDirect({ ...options, variant: "loading" }),
  dismiss: sonnerToast.dismiss,
};
