import React from 'react';
import { InputProps } from './inputTypes';
import { baseStyles, variantStyles } from './inputStyles';

export default function Input({
  value,
  onChange,
  type = 'text',
  placeholder,
  label,
  id,
  name,
  variant = 'default',
  className = '',
  disabled = false,
  error,
}: InputProps) {
  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    error ? 'border-red-500 focus:ring-red-500' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (label) {
    return (
      <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          {label}
        </label>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={combinedClassName}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }

  return (
    <>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={combinedClassName}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </>
  );
}
