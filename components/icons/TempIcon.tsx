
import React from 'react';

export const TempIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 15.172V3.828a4 4 0 018 0v11.344a4 4 0 01-8 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 15.172a4 4 0 01-8 0V3.828a4 4 0 018 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
  </svg>
);
