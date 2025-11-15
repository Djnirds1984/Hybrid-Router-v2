
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  children?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, children }) => {
  return (
    <div className="bg-base-300/50 p-4 rounded-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center text-text-secondary mb-2">
          {icon}
          <span className="ml-2 font-semibold text-sm">{label}</span>
        </div>
        <div className="text-2xl font-bold text-text-primary">{value}</div>
      </div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};
