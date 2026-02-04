
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#0F172A" />
        <path d="M12 20C12 15.5817 15.5817 12 20 12V12C24.4183 12 28 15.5817 28 20V20C28 24.4183 24.4183 28 20 28V28C15.5817 28 12 24.4183 12 20V20Z" stroke="#38BDF8" strokeWidth="2" />
        <path d="M20 12L20 8M20 32L20 28M28 20L32 20M8 20L12 20" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        <rect x="18" y="18" width="4" height="4" rx="1" fill="#38BDF8" className="animate-pulse" />
        <circle cx="20" cy="20" r="10" stroke="#38BDF8" strokeOpacity="0.2" strokeWidth="4" />
      </svg>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold tracking-tight text-white led-text-glow">
          Centra<span className="text-sky-400">Lux</span>
        </span>
        <div className="h-3 w-px bg-slate-800 self-center"></div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
          Liang Solution
        </span>
      </div>
    </div>
  );
};

export default Logo;
