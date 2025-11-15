
import React from 'react';

export const NetworkIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75v-.008z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.875 12.188a9.5 9.5 0 0114.25 0M2.75 8.334a13.5 13.5 0 0118.5 0" />
  </svg>
);
