import React from 'react';

export type CardVariant = 
  | 'default'
  | 'auth'
  | 'article'
  | 'feature'
  | 'modal'
  | 'glass';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}
