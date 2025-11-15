
import React, { useState, useEffect, useCallback } from 'react';
import type { BoardInfo } from './types';
import { BoardCard } from './components/BoardCard';

// Mock data generation
const generateMockData = (): BoardInfo[] => [
  {
    id: 'rpi3-01',
    name: 'Raspberry Pi 3',
    arch: 'arm',
    cpuUsage: Math.random() * 80 + 10,
    memory: {
      used: Math.random() * 0.8 + 0.1,
      total: 1,
    },
    temp: Math.random() * 30 + 40,
    uptime: `${Math.floor(Math.random() * 30)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
    network: {
      status: 'Online',
      ipAddress: '192.168.1.101',
      speed: Math.floor(Math.random() * 50 + 940),
    },
  },
  {
    id: 'x64-server-01',
    name: 'Ubuntu Server',
    arch: 'x64',
    cpuUsage: Math.random() * 50 + 5,
    memory: {
      used: Math.random() * 12 + 2,
      total: 16,
    },
    temp: Math.random() * 20 + 35,
    uptime: `${Math.floor(Math.random() * 120)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
    network: {
      status: 'Online',
      ipAddress: '192.168.1.102',
      speed: Math.floor(Math.random() * 50 + 945),
    },
  },
  {
    id: 'edge-device-01',
    name: 'Edge Compute Node',
    arch: 'x64',
    cpuUsage: Math.random() * 90 + 10,
    memory: {
      used: Math.random() * 28 + 4,
      total: 32,
    },
    temp: Math.random() * 35 + 45,
    uptime: `${Math.floor(Math.random() * 90)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
    network: {
      status: 'Online',
      ipAddress: '192.168.1.105',
      speed: Math.floor(Math.random() * 40 + 950),
    },
  },
    {
    id: 'rpi4-media',
    name: 'Raspberry Pi 4',
    arch: 'arm',
    cpuUsage: Math.random() * 60 + 20,
    memory: {
      used: Math.random() * 3.5 + 0.5,
      total: 4,
    },
    temp: Math.random() * 25 + 42,
    uptime: `${Math.floor(Math.random() * 50)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
    network: {
      status: 'Offline',
      ipAddress: '192.168.1.110',
      speed: 0,
    },
  },
];


const App: React.FC = () => {
  const [boards, setBoards] = useState<BoardInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchBoardInfo = useCallback(() => {
    setIsLoading(true);
    setError(null);
    // Simulate API call
    setTimeout(() => {
      try {
        setBoards(generateMockData());
        setLastUpdated(new Date());
      } catch (err) {
        setError('Failed to fetch board information.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    fetchBoardInfo();
    const interval = setInterval(fetchBoardInfo, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchBoardInfo]);

  return (
    <div className="min-h-screen bg-base-100 text-text-primary font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text-primary">Hybrid Router Dashboard</h1>
            <p className="text-text-secondary mt-1">
              Live status of all connected host boards.
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
             {lastUpdated && !isLoading && (
              <p className="text-sm text-text-secondary mr-4">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            <button
              onClick={fetchBoardInfo}
              disabled={isLoading}
              className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-sky-600 transition duration-300 disabled:bg-base-300 disabled:cursor-not-allowed flex items-center"
            >
              <svg className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
              </svg>
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </header>
        
        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {isLoading && boards.length === 0 ? (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-base-200 rounded-xl p-6 border border-base-300 animate-pulse">
                    <div className="h-8 bg-base-300 rounded w-3/4 mb-4"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-base-300 rounded-lg"></div>
                        <div className="h-24 bg-base-300 rounded-lg"></div>
                        <div className="h-24 bg-base-300 rounded-lg"></div>
                        <div className="h-24 bg-base-300 rounded-lg"></div>
                    </div>
                </div>
             ))}
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        )}

      </main>
      <footer className="text-center py-4 text-xs text-text-secondary border-t border-base-300 mt-8">
        Hybrid Router Dashboard © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
