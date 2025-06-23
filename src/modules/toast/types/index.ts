import { ReactNode } from "react";
import { ExternalToast, Action } from "sonner";

export interface ToastAction {
  label: string;
  onClick?: () => void;
}

export interface ToastCancel {
  label: string;
  onClick?: () => void;
}

export interface ToastOptions extends Omit<ExternalToast, "action" | "cancel"> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastAction;
  cancel?: ToastCancel;
  variant?: "default" | "success" | "error" | "warning" | "info" | "loading";
}

export interface ToastProps extends ToastOptions {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ToastState {
  toasts: ToastProps[];
}

export interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  success: (options: Omit<ToastOptions, "variant">) => void;
  error: (options: Omit<ToastOptions, "variant">) => void;
  warning: (options: Omit<ToastOptions, "variant">) => void;
  info: (options: Omit<ToastOptions, "variant">) => void;
  loading: (options: Omit<ToastOptions, "variant">) => void;
  dismiss: (toastId?: string) => void;
}
