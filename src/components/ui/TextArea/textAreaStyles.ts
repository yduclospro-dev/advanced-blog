import { TextAreaVariant } from './textAreaTypes';

export const variantStyles: Record<TextAreaVariant, string> = {
  default: 'border border-gray-300 dark:border-slate-600 rounded-md p-4 text-gray-900 dark:text-white bg-white dark:bg-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
  auth: 'border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition placeholder:text-gray-400 dark:placeholder:text-slate-500'
};

export const baseStyles = 'w-full text-justify';
