import React, { useEffect, useState } from 'react';
import type { NetworkInterface, NetworkSummary } from '../types';

export const NetworkTab: React.FC = () => {
  const [summary, setSummary] = useState<NetworkSummary | null>(null);
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [sumRes, ifRes] = await Promise.all([
          fetch('/api/network/summary'),
          fetch('/api/network/interfaces'),
        ]);
        if (!sumRes.ok || !ifRes.ok) throw new Error('Network API unavailable');
        const sumData: NetworkSummary = await sumRes.json();
        const ifData: NetworkInterface[] = await ifRes.json();
        if (mounted) {
          setSummary(sumData);
          setInterfaces(ifData);
          setError(null);
        }
      } catch (e) {
        setError('Failed to load network data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    const id = setInterval(fetchAll, 15000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  if (loading) {
    return <div className="text-text-secondary">Loading network data...</div>;
  }
  if (error) {
    return <div className="bg-red-500/20 text-red-400 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <section className="bg-base-200 rounded-xl p-6 border border-base-300">
        <h2 className="text-xl font-bold text-text-primary mb-4">Overview</h2>
        {summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-base-300/50 p-4 rounded-lg"><div className="text-sm text-text-secondary">Default Interface</div><div className="text-2xl font-bold">{summary.interface || 'N/A'}</div></div>
            <div className="bg-base-300/50 p-4 rounded-lg"><div className="text-sm text-text-secondary">IP Address</div><div className="text-2xl font-bold">{summary.ip4 || 'N/A'}</div></div>
            <div className="bg-base-300/50 p-4 rounded-lg"><div className="text-sm text-text-secondary">Gateway</div><div className="text-2xl font-bold">{summary.gateway || 'N/A'}</div></div>
            <div className="bg-base-300/50 p-4 rounded-lg"><div className="text-sm text-text-secondary">TX</div><div className="text-2xl font-bold">{summary.speedMbps} Mbps</div></div>
            <div className="bg-base-300/50 p-4 rounded-lg"><div className="text-sm text-text-secondary">RX</div><div className="text-2xl font-bold">{summary.rxMbps} Mbps</div></div>
            <div className="bg-base-300/50 p-4 rounded-lg"><div className="text-sm text-text-secondary">State</div><div className="text-2xl font-bold">{summary.operstate || 'unknown'}</div></div>
          </div>
        ) : (
          <div className="text-text-secondary">No summary available</div>
        )}
      </section>

      <section className="bg-base-200 rounded-xl p-6 border border-base-300">
        <h2 className="text-xl font-bold text-text-primary mb-4">Interfaces</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-text-secondary border-b border-base-300">
                <th className="py-2 pr-4">Interface</th>
                <th className="py-2 pr-4">IP</th>
                <th className="py-2 pr-4">MAC</th>
                <th className="py-2 pr-4">State</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Speed</th>
              </tr>
            </thead>
            <tbody>
              {interfaces.map((i) => (
                <tr key={i.iface} className="border-b border-base-300">
                  <td className="py-2 pr-4 font-semibold text-text-primary">{i.iface}</td>
                  <td className="py-2 pr-4">{i.ip4 || '—'}</td>
                  <td className="py-2 pr-4">{i.mac || '—'}</td>
                  <td className="py-2 pr-4">{i.operstate || 'unknown'}</td>
                  <td className="py-2 pr-4">{i.type || '—'}</td>
                  <td className="py-2 pr-4">{typeof i.speed === 'number' ? `${i.speed} Mb/s` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};