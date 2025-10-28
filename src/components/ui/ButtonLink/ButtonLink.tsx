import React from 'react';
import Link from 'next/link';
import { ButtonLinkProps } from './buttonLinkTypes';
import { baseStyles, variantStyles, sizeStyles } from './buttonLinkStyles';

export default function ButtonLink({
  label,
  href,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  icon,
}: ButtonLinkProps) {
  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Link href={href} className={combinedClassName}>
      {icon && <span>{icon}</span>}
      {label}
    </Link>
  );
}
