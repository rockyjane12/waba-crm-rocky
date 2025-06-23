export { ToastAction } from "./components/Toast";
export * from "./types";
export * from "./hooks/useToast";

import { toast as toastUtility } from "./hooks/useToast";

export function toast(options: import("./types").ToastOptions) {
  toastUtility.default(options);
}
