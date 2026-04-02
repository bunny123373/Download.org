'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

const colors: Record<ToastType, string> = {
  success: 'border-[var(--success)]',
  error: 'border-[var(--error)]',
  info: 'border-[var(--accent-primary)]',
};

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`glass-card px-5 py-4 flex items-center gap-3 border-l-4 ${colors[type]}`}>
        <span className="text-xl">{icons[type]}</span>
        <p className="text-sm text-[var(--text-primary)]">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
