import React, { useEffect, useState } from 'react';
import type { NetworkInterface, NetworkSummary, WifiNetwork, WifiStatus } from '../types';

export const NetworkTab: React.FC = () => {
  const [summary, setSummary] = useState<NetworkSummary | null>(null);
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wifiStatus, setWifiStatus] = useState<WifiStatus | null>(null);
  const [wifiScan, setWifiScan] = useState<WifiNetwork[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [sumRes, ifRes, wifiRes, scanRes] = await Promise.all([
          fetch('/api/network/summary'),
          fetch('/api/network/interfaces'),
          fetch('/api/wifi/status'),
          fetch('/api/wifi/scan')
        ]);
        if (!sumRes.ok || !ifRes.ok) throw new Error('Network API unavailable');
        const sumData: NetworkSummary = await sumRes.json();
        const ifData: NetworkInterface[] = await ifRes.json();
        const wifiStat: WifiStatus | null = wifiRes.ok ? await wifiRes.json() : null;
        const scan: WifiNetwork[] = scanRes.ok ? await scanRes.json() : [];
        if (mounted) {
          setSummary(sumData);
          setInterfaces(ifData);
          setWifiStatus(wifiStat);
          setWifiScan(scan);
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

      <section className="bg-base-200 rounded-xl p-6 border border-base-300">
        <h2 className="text-xl font-bold text-text-primary mb-4">WiFi</h2>
        {wifiStatus ? (
          <div className="mb-4">
            <div className="text-sm text-text-secondary">Current SSID</div>
            <div className="text-2xl font-bold">{wifiStatus.ssid || 'Not connected'}</div>
            <div className="text-xs text-text-secondary mt-2">Interfaces: {wifiStatus.interfaces.map(i => i.iface).join(', ') || '—'}</div>
          </div>
        ) : (
          <div className="text-text-secondary">WiFi status unavailable</div>
        )}

        <div className="mt-4">
          <div className="text-sm font-semibold text-text-secondary mb-2">Available Networks</div>
          {wifiScan.length === 0 ? (
            <div className="text-text-secondary">No networks found or scan requires nmcli</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {wifiScan.map((n) => (
                <div key={n.ssid} className="bg-base-300/50 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-text-primary">{n.ssid}</div>
                    <div className="text-xs text-text-secondary">Signal: {n.signal ?? '—'}</div>
                  </div>
                  <WifiConnectButton ssid={n.ssid} onDone={() => { /* re-fetch after connect */ }} setConnecting={setConnecting} setError={setConnectError} />
                </div>
              ))}
            </div>
          )}

          {connectError && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mt-3">{connectError}</div>
          )}
        </div>
      </section>
    </div>
  );
};

const WifiConnectButton: React.FC<{ ssid: string; onDone: () => void; setConnecting: (b: boolean) => void; setError: (e: string | null) => void }> = ({ ssid, onDone, setConnecting, setError }) => {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const connect = async () => {
    try {
      setConnecting(true);
      setError(null);
      const res = await fetch('/api/wifi/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ssid, password })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.details || 'Failed to connect');
      }
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to connect');
    } finally {
      setConnecting(false);
    }
  };
  return (
    <div className="flex items-center space-x-2">
      {show && (
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="bg-base-100 border border-base-300 rounded px-2 py-1 text-sm" />
      )}
      <button onClick={() => setShow((s) => !s)} className="text-xs bg-base-300 px-2 py-1 rounded">{show ? 'Hide' : 'Pass'}</button>
      <button onClick={connect} className="text-xs bg-brand-primary text-white px-3 py-1 rounded">Connect</button>
    </div>
  );
};