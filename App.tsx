
import React, { useState, useEffect, useCallback } from 'react';
import type { BoardInfo } from './types';
import { BoardCard } from './components/BoardCard';
import { Sidebar } from './components/Sidebar';
import { NetworkTab } from './components/NetworkTab';

// Mock data generation is removed. The app will now fetch from a real API endpoint.

const App: React.FC = () => {
  const [boards, setBoards] = useState<BoardInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // The API endpoint to fetch data from.
  // This should point to your backend service.
  // For development, you might use a proxy to avoid CORS issues.
  const API_ENDPOINT = '/api/boards';

  const fetchBoardInfo = useCallback(async () => {
    setIsLoading(true);
    // Don't clear previous error immediately, so the user sees it until a successful fetch
    
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }
      const data: BoardInfo[] = await response.json();
      setBoards(data);
      setLastUpdated(new Date());
      setError(null); // Clear error on success
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to fetch board information. Please ensure the backend service is running and accessible at ${API_ENDPOINT}. Error: ${err.message}`);
      } else {
        setError('An unknown error occurred while fetching data.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoardInfo();
    const interval = setInterval(fetchBoardInfo, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchBoardInfo]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'network'>('network');

  return (
    <div className="min-h-screen bg-base-100 text-text-primary font-sans flex">
      <Sidebar active={activeTab} onChange={(t) => setActiveTab(t as any)} />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-text-secondary">
            {lastUpdated && !isLoading && !error && (
              <span className="text-sm">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
          </div>
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

        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg text-center my-4">
            <p className="font-bold">Connection Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {activeTab === 'network' ? (
          <NetworkTab />
        ) : (
          isLoading && boards.length === 0 ? (
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
          ) : !isLoading && boards.length === 0 && !error ? (
            <div className="bg-base-200 text-text-secondary p-8 rounded-lg text-center my-4">
              <h3 className="text-xl font-semibold mb-2">No Boards Found</h3>
              <p>The backend is running but returned no board data. Please check your backend configuration.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {boards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          )
        )}

        <footer className="text-center py-4 text-xs text-text-secondary border-t border-base-300 mt-8">
          Hybrid Router Dashboard © {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
};

export default App;
