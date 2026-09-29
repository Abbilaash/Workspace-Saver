import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:pointer-events-none rounded-lg cursor-pointer";
    
    const variants = {
      primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 border border-indigo-500/30 active:scale-[0.98]",
      secondary: "bg-slate-800/80 hover:bg-slate-700/90 text-slate-100 border border-slate-700/60 hover:border-slate-600 backdrop-blur-md active:scale-[0.98]",
      outline: "bg-transparent hover:bg-slate-800/50 text-slate-200 border border-slate-700/80 hover:border-indigo-500/50 active:scale-[0.98]",
      ghost: "bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white"
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-6 py-3 gap-2.5 rounded-xl font-semibold"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
