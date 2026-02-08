import React from 'react';
import { cn } from '@/lib/utils';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number | string;
  onValueChange: (value: number) => void;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onValueChange, ...props }, ref) => {
    
    const formatValue = (val: number | string) => {
      if (!val) return '';
      // Ensure we're working with a string for display
      const numVal = typeof val === 'string' ? parseInt(val, 10) : val;
      if (isNaN(numVal)) return '';
      return new Intl.NumberFormat('id-ID').format(numVal);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Remove all non-digit characters
      const rawValue = e.target.value.replace(/\D/g, '');
      const numValue = parseInt(rawValue, 10);
      
      onValueChange(isNaN(numValue) ? 0 : numValue);
    };

    return (
      <input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        value={formatValue(value)}
        onChange={handleChange}
        className={cn(
          "w-full bg-transparent outline-none",
          className
        )}
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
