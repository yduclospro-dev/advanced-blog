import React from 'react';
import { CardProps } from './cardTypes';
import { baseStyles, variantStyles, paddingStyles } from './cardStyles';

export default function Card({
  children,
  variant = 'default',
  padding = 'lg',
  className = '',
  hover = false,
  onClick,
}: CardProps) {
  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    paddingStyles[padding],
    hover ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : '',
    onClick ? 'cursor-pointer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div onClick={onClick} className={combinedClassName}>
      {children}
    </div>
  );
}
