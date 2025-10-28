import React from 'react';

export type ButtonLinkVariant = 
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'outline'
  | 'ghost'
  | 'success';

export type ButtonLinkSize = 'sm' | 'md' | 'lg';

export interface ButtonLinkProps {
  label: string;
  href: string;
  variant?: ButtonLinkVariant;
  size?: ButtonLinkSize;
  fullWidth?: boolean;
  className?: string;
  icon?: React.ReactNode;
}
