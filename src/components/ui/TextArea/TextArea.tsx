import React, { forwardRef } from 'react';
import { TextAreaProps } from './textAreaTypes';
import { baseStyles, variantStyles } from './textAreaStyles';

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      value,
      onChange,
      placeholder,
      label,
      id,
      name,
      variant = 'default',
      className = '',
      disabled = false,
      error,
      rows = 1,
      autoResize = false,
    },
    ref
  ) => {
    const combinedClassName = [
      baseStyles,
      variantStyles[variant],
      autoResize ? 'resize-none min-h-32 max-h-96' : 'resize-y',
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
          <textarea
            ref={ref}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
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
        <textarea
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={combinedClassName}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
