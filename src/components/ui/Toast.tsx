'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: {
    bg: 'bg-[#e6f9ed]',
    border: 'border-[#0ca678]',
    text: 'text-[#0ca678]',
    icon: 'text-[#0ca678]',
  },
  error: {
    bg: 'bg-[#fee]',
    border: 'border-[#e03131]',
    text: 'text-[#c92a2a]',
    icon: 'text-[#c92a2a]',
  },
  info: {
    bg: 'bg-[#e8f3ff]',
    border: 'border-[#3182f6]',
    text: 'text-[#1d4ed8]',
    icon: 'text-[#1d4ed8]',
  },
};

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const Icon = icons[type];
  const colorStyle = colors[type];

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    // 마운트 시 애니메이션
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // 자동 닫기
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  return (
    <div
      className={`transition-all duration-300 ${
        isVisible && !isLeaving
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0'
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${colorStyle.bg} ${colorStyle.border}`}
      >
        <Icon size={20} className={colorStyle.icon} />
        <p className={`flex-1 text-[14px] font-medium ${colorStyle.text}`}>
          {message}
        </p>
        <button
          onClick={handleClose}
          className={`w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors ${colorStyle.text}`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
