"use client";

import { useEffect } from 'react';
import { ToastProps } from './toastTypes';
import { toastStyles, typeStyles, iconMap } from './toastStyles';

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`${toastStyles.container} ${typeStyles[type]}`}>
      <span className={toastStyles.icon}>
        {iconMap[type]}
      </span>
      <p className={toastStyles.message}>
        {message}
      </p>
      <button
        onClick={onClose}
        className={toastStyles.closeButton}
        aria-label="Fermer"
      >
        ✕
      </button>
    </div>
  );
}
