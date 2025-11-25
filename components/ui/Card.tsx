import React from 'react';

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-4 ${className}`}>
      {children}
    </div>
  );
};