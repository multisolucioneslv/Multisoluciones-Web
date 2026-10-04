'use client';

import { useId } from 'react';

const mark = 'M58 74V26L82 56L106 26V74 M120 26L132 74L151 43L170 74L182 26';
const braces = 'M38 15C25 15 25 23 25 34V39C25 47 21 50 15 50C21 50 25 53 25 61V66C25 77 25 85 38 85 M202 15C215 15 215 23 215 34V39C215 47 219 50 225 50C219 50 215 53 215 61V66C215 77 215 85 202 85';

export function BrandLogo() {
  const gradientId = useId();
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 240 100"
      width="80"
      height="45"
      className="h-[27px] w-12 shrink-0 overflow-visible sm:h-[45px] sm:w-20"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="var(--brand-strong)" />
          <stop offset="0.5" stopColor="var(--foreground)" />
          <stop offset="1" stopColor="var(--brand)" />
        </linearGradient>
      </defs>
      <path d={braces} stroke="var(--brand)" strokeWidth="8" />
      <path d={mark} stroke={`url(#${gradientId})`} strokeWidth="12" />
      <path d={mark} className="brand-logo-trace" pathLength="100" stroke="var(--brand-strong)" strokeWidth="4" strokeDasharray="5 95" />
    </svg>
  );
}
