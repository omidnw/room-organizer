import React from 'react';
import { LucideIcon } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  icon?: LucideIcon;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  name?: string;
  register?: UseFormRegister<any>;
  required?: boolean;
}

function Select({
  id,
  value,
  onChange,
  options,
  icon: Icon,
  label,
  placeholder = 'Select an option',
  className = '',
  error,
  name,
  register,
  required,
}: SelectProps) {
  const selectProps = register && name 
    ? register(name, { required }) 
    : { value, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value) };

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-textPrimary mb-1"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="flex items-center">
          {Icon && (
            <Icon className="absolute left-3 text-textSecondary w-5 h-5" />
          )}
          <select
            id={id}
            {...selectProps}
            className={`
              w-full px-4 py-2 bg-background border border-border rounded-lg 
              text-textPrimary focus:outline-none focus:border-primary 
              transition-colors appearance-none
              ${Icon ? 'pl-10' : ''}
              ${error ? 'border-error' : ''}
              ${className}
            `}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.description 
                  ? `${option.label} - ${option.description}`
                  : option.label
                }
              </option>
            ))}
          </select>
          <div className="absolute right-3 pointer-events-none">
            <svg 
              className="w-4 h-4 text-textSecondary" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-error mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;