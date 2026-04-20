import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  id, 
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-700 ml-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full px-4 py-2.5 bg-white border rounded-xl text-slate-900 
          placeholder:text-slate-400 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500
          ${error ? 'border-red-500 ring-red-50' : 'border-slate-200'}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-red-500 ml-1 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
