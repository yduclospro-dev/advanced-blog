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
  onClick,
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

  if (onClick) {
    return (
      <button 
        type="button"
        className={combinedClassName} 
        onClick={onClick}
      >
        {icon && <span>{icon}</span>}
        {label}
      </button>
    );
  }

  if (!href) {
    return null;
  }

  return (
    <Link href={href} className={combinedClassName}>
      {icon && <span>{icon}</span>}
      {label}
    </Link>
  );
}
