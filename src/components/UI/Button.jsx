import React from 'react';
import clsx from 'clsx'; //  (удобно для классов)

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) {
  const base = 'flex items-center justify-center font-semibold rounded transition';

  const variants = {
    primary: 'bg-[#503E9D] rounded-[12px] text-white hover:bg-purple-700',
    secondary: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
    thirdary: 'bg-[#503E9D1A] text-[#503E9D] hover:bg-purple-200',
    icon: 'bg-yellow-400 text-black hover:bg-yellow-500',
    text: 'bg-transparent text-purple-600 hover:underline',
  };

  const sizes = {
    large: 'h-16 px-8 text-lg',       // ~64px
    medium: 'h-12 px-6 text-base',    // ~48px
    small: 'h-12 px-3 text-sm',       // ~40px
    icon: 'w-16 h-16 text-2xl',       // ~64x64
    text: 'px-2 py-1 text-sm',        // for text-only buttons
  };

  return (
    <button
      onClick={onClick}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2 text-xl">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2 text-xl">{icon}</span>
      )}
    </button>
  );
}
