import { ToastType } from './toastTypes';

export const toastStyles = {
  container: 'fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md animate-slide-in',
  
  closeButton: 'ml-auto text-white hover:opacity-80 transition-opacity',
  
  icon: 'text-xl',
  
  message: 'text-white font-medium flex-1',
};

export const typeStyles: Record<ToastType, string> = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  warning: 'bg-yellow-600',
  info: 'bg-blue-600',
};

export const iconMap: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};
