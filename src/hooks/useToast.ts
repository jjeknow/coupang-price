'use client';

import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  }, []);

  const hideToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string) => showToast(message, 'success'),
    [showToast]
  );

  const error = useCallback(
    (message: string) => showToast(message, 'error'),
    [showToast]
  );

  const info = useCallback(
    (message: string) => showToast(message, 'info'),
    [showToast]
  );

  return {
    toasts,
    showToast,
    hideToast,
    success,
    error,
    info,
  };
}
