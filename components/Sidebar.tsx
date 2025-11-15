import React from 'react';

interface SidebarProps {
  active: string;
  onChange: (tab: string) => void;
}

const Item: React.FC<{ id: string; label: string; icon?: React.ReactNode; active: boolean; onClick: () => void }> = ({ id, label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${active ? 'bg-brand-primary/20 text-brand-primary' : 'bg-base-200 hover:bg-base-300 text-text-primary'}`}
  >
    <span className="flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      <span className="font-semibold">{label}</span>
    </span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ active, onChange }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'network', label: 'Network' },
  ];

  return (
    <aside className="w-64 bg-base-100 border-r border-base-300 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Hybrid Router</h1>
        <p className="text-xs text-text-secondary">System administration</p>
      </div>
      <nav>
        {items.map((i) => (
          <Item key={i.id} id={i.id} label={i.label} active={active === i.id} onClick={() => onChange(i.id)} />
        ))}
      </nav>
    </aside>
  );
};