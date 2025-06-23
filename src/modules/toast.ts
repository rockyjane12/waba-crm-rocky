import { toast } from "sonner";

// Re-export toast from sonner
export { toast };

// Custom hook for toast
export function useToast() {
  return {
    toast,
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
    custom: toast,
  };
}