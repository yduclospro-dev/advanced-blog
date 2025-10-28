import React from 'react';

export type InputVariant = 'default' | 'auth';
export type InputType = 'text' | 'email' | 'password' | 'date' | 'number';

export interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: InputType;
  placeholder?: string;
  label?: string;
  id?: string;
  name?: string;
  variant?: InputVariant;
  className?: string;
  disabled?: boolean;
  error?: string;
}
