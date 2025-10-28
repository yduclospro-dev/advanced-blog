import React from 'react';
import { ButtonProps } from './buttonTypes';
import { baseStyles, variantStyles, sizeStyles } from './buttonStyles';

export default function Button({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  icon,
  onClick,
  type = 'button',
}: ButtonProps) {
  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}
