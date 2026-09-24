import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface RollingButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'black' | 'white' | 'outline' | 'ghost' | 'cyan' | 'dark' | 'blue';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  type?: 'button' | 'submit';
}

export const RollingButton: React.FC<RollingButtonProps> = ({
  text,
  onClick,
  variant = 'black',
  className = '',
  size = 'md',
  showArrow = true,
  type = 'button',
}) => {
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-xs sm:text-sm gap-2',
    lg: 'px-7 py-3.5 text-sm sm:text-base gap-2.5',
  };

  const variantClasses = {
    black:
      'bg-[#141414] text-white hover:bg-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.12)]',
    white:
      'bg-white text-[#141414] hover:bg-neutral-100 button-ambient-glow',
    cyan:
      'bg-[#38bdf8] text-black hover:bg-[#7dd3fc] font-bold shadow-[0_0_25px_rgba(56,189,248,0.4)]',
    blue:
      'bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#0ea5e9] text-white hover:brightness-110 shadow-[0_4px_18px_rgba(29,78,216,0.4)] border border-white/20',
    dark:
      'bg-white/10 text-white hover:bg-white/15 border border-white/15 hover:border-[#38bdf8]/40 shadow-sm',
    outline:
      'bg-transparent text-white border border-white/20 hover:border-[#38bdf8] hover:bg-white/5',
    ghost:
      'bg-transparent text-white/80 hover:text-white hover:bg-white/5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-full font-medium inline-flex items-center justify-center cursor-pointer transition-all duration-300 select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {/* Rolling Text Container */}
      <div className="relative overflow-hidden h-[1.2em] flex flex-col justify-start">
        <span className="inline-block transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
          {text}
        </span>
        <span className="absolute top-0 left-0 inline-block transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0 text-current">
          {text}
        </span>
      </div>

      {/* Arrow Icon with Glide Animation */}
      {showArrow && (
        <ArrowUpRight className="w-3.5 h-3.5 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
      )}
    </button>
  );
};
