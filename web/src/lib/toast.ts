import { toast, type ToastOptions } from "react-toastify";

const DEFAULT_OPTIONS: ToastOptions = {
  autoClose: 4500,
};

export function notifyError(message: string): void {
  toast.error(message, DEFAULT_OPTIONS);
}

/** Show a success toast. */
export function notifySuccess(message: string): void {
  toast.success(message, DEFAULT_OPTIONS);
}

export function notifyInfo(message: string): void {
  toast.info(message, DEFAULT_OPTIONS);
}
