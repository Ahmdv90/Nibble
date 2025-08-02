import React from 'react';
import clsx from 'clsx';

export default function InputField({
  label,
  placeholder,
  value,
  onChange,
  icon,
  type = 'text',
  size = 'medium', 
  readOnly = false,
  className = '',
  inputClass = '',
  ...props
}) {
  const baseWrapper = 'flex flex-col gap-1';
  const baseInput =
    'w-full border border-gray-300 rounded px-4 outline-none focus:ring-2 focus:ring-purple-400 transition';
  const sizes = {
    large: 'h-16 text-lg',
    small: 'h-12 text-sm',
    promo: 'h-16 text-xl text-orange-600 font-bold text-center tracking-widest',
    address: 'h-14 text-base',
  };

  const withIcon = icon ? 'pl-10' : '';

  return (
    <div className={clsx(baseWrapper, className)}>
      {label && (
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={clsx(
            baseInput,
            sizes[size],
            withIcon,
            inputClass,
            readOnly && 'bg-gray-100 cursor-not-allowed'
          )}
          {...props}
        />
      </div>
    </div>
  );
}
