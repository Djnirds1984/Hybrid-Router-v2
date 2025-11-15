
import React from 'react';
import type { BoardInfo } from '../types';
import { CpuIcon } from './icons/CpuIcon';
import { MemoryIcon } from './icons/MemoryIcon';
import { TempIcon } from './icons/TempIcon';
import { NetworkIcon } from './icons/NetworkIcon';
import { StatCard } from './StatCard';

interface BoardCardProps {
  board: BoardInfo;
}

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full bg-base-300 rounded-full h-2.5">
    <div
      className="bg-brand-primary h-2.5 rounded-full"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

export const BoardCard: React.FC<BoardCardProps> = ({ board }) => {
  const memoryUsage = (board.memory.used / board.memory.total) * 100;
  const isOnline = board.network.status === 'Online';
  const tempColor = board.temp > 70 ? 'text-red-500' : board.temp > 50 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="bg-base-200 rounded-xl shadow-lg p-6 border border-base-300 hover:border-brand-primary transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{board.name}</h2>
          <span className={`text-sm font-semibold uppercase px-2 py-1 rounded-full ${board.arch === 'arm' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {board.arch}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
            {board.network.status}
          </span>
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse-fast' : 'bg-red-500'}`}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard icon={<CpuIcon className="w-5 h-5" />} label="CPU Usage" value={`${board.cpuUsage.toFixed(1)}%`}>
          <ProgressBar value={board.cpuUsage} />
        </StatCard>
        
        <StatCard icon={<MemoryIcon className="w-5 h-5" />} label="Memory" value={`${board.memory.used.toFixed(1)} / ${board.memory.total} GB`}>
          <ProgressBar value={memoryUsage} />
        </StatCard>

        <StatCard icon={<TempIcon className="w-5 h-5" />} label="Temperature" value={`${board.temp.toFixed(1)}°C`}>
           <div className={`text-sm font-semibold ${tempColor}`}>
            {board.temp > 70 ? 'High' : board.temp > 50 ? 'Warm' : 'Normal'}
          </div>
        </StatCard>

        <StatCard icon={<NetworkIcon className="w-5 h-5" />} label="Network" value={`${board.network.speed} Mbps`}>
          <div className="text-xs text-text-secondary truncate">{board.network.ipAddress}</div>
        </StatCard>
      </div>
      <div className="mt-4 pt-4 border-t border-base-300 text-right text-xs text-text-secondary">
        Uptime: {board.uptime}
      </div>
    </div>
  );
};
