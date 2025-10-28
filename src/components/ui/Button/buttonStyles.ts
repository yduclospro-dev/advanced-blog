import { ButtonVariant, ButtonSize } from './buttonTypes';

export const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 shadow-xl shadow-sky-500/30',
  secondary: 'bg-white/60 backdrop-blur-md border border-gray-200 text-gray-900 hover:bg-white/80',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl',
  outline: 'border-2 border-gray-400 text-gray-600 hover:bg-gray-100',
  ghost: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50',
  success: 'bg-green-600 text-white hover:bg-green-700 shadow-lg',
};

export const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const baseStyles = 'rounded-lg font-semibold transition-all duration-200 cursor-pointer hover:scale-105 inline-flex items-center justify-center gap-2';
