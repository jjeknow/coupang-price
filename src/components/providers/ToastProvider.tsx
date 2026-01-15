'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Toast, { ToastType } from '@/components/ui/Toast';

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string) => addToast(message, 'success'),
    [addToast]
  );

  const error = useCallback(
    (message: string) => addToast(message, 'error'),
    [addToast]
  );

  const info = useCallback(
    (message: string) => addToast(message, 'info'),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      {/* Toast 컨테이너 */}
      <div className="fixed bottom-20 z-[100] flex flex-col items-center gap-2 pointer-events-none toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full max-w-md px-4">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
