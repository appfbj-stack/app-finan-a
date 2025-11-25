import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-4 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600",
    secondary: "bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600",
    danger: "bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};