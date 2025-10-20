import React from 'react';

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  className = ''
}: FormFieldProps) {
  const baseInputClass = "w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200";
  
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        className={baseInputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
