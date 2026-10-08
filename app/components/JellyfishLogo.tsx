'use client';

import React from 'react';

export function JellyfishLogo({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]"
      >
        {/* Jellyfish Bell/Head */}
        <path
          d="M20 50 C20 22 32 12 50 12 C68 12 80 22 80 50 C80 56 75 58 70 55 C65 52 60 55 55 58 C50 61 45 55 40 55 C35 55 30 60 25 58 C22 56 20 54 20 50 Z"
          fill="url(#jellyGradient)"
        />
        
        {/* Cute Eyes & Smile */}
        <circle cx="38" cy="36" r="4.5" fill="#0b1329" />
        <circle cx="39.5" cy="34.5" r="1.5" fill="#ffffff" />
        <circle cx="62" cy="36" r="4.5" fill="#0b1329" />
        <circle cx="63.5" cy="34.5" r="1.5" fill="#ffffff" />
        {/* Cheeks */}
        <circle cx="32" cy="42" r="3" fill="#38bdf8" fillOpacity="0.6" />
        <circle cx="68" cy="42" r="3" fill="#38bdf8" fillOpacity="0.6" />
        {/* Smile */}
        <path
          d="M44 42 Q50 48 56 42"
          stroke="#0b1329"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tentacles */}
        <path
          d="M28 58 Q24 70 30 84 Q34 92 38 88"
          stroke="#38bdf8"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M38 58 Q34 72 42 86 Q46 94 44 98"
          stroke="#0284c7"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M50 60 Q52 74 48 88 Q46 96 52 98"
          stroke="#38bdf8"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M62 58 Q66 72 58 86 Q54 94 56 98"
          stroke="#0284c7"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M72 58 Q76 70 70 84 Q66 92 62 88"
          stroke="#38bdf8"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Defs */}
        <defs>
          <linearGradient id="jellyGradient" x1="20" y1="12" x2="80" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#67e8f9" />
            <stop offset="0.5" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#0284c7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
