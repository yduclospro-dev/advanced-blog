import { CardVariant, CardPadding } from './cardTypes';

export const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700',
  auth: 'bg-white dark:bg-slate-800 rounded-2xl shadow-xl',
  article: 'bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg',
  feature: 'bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg hover:bg-white/80 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20',
  modal: 'bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700',
  glass: 'bg-white/60 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl',
};

export const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const baseStyles = 'transition-all duration-200';
