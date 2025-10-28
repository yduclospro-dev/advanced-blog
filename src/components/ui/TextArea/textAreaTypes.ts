import React from 'react';

export type TextAreaVariant = 'default' | 'auth';

export interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  name?: string;
  variant?: TextAreaVariant;
  className?: string;
  disabled?: boolean;
  error?: string;
  rows?: number;
  autoResize?: boolean;
}
