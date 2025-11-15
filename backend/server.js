const express = require('express');
const cors = require('cors');
const si = require('systeminformation');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Helper function to format uptime from seconds to a readable string
function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

app.get('/api/boards', async (req, res) => {
  try {
    // Fetch all data in parallel for efficiency
    const [osInfo, cpu, mem, cpuTemperature, time, networkInterfaces, networkStats] = await Promise.all([
      si.osInfo(),
      si.currentLoad(),
      si.mem(),
      si.cpuTemperature(),
      si.time(),
      si.networkInterfaces('default'),
      si.networkStats('default'),
    ]);

    // Construct the single board info object based on the fetched data
    const boardInfo = {
      id: osInfo.hostname.toLowerCase() || 'unknown-host',
      name: `${osInfo.distro} (${osInfo.hostname})`,
      arch: osInfo.arch.includes('arm') ? 'arm' : 'x64',
      cpuUsage: cpu.currentLoad,
      memory: {
        used: mem.used / (1024 ** 3), // Convert bytes to GB
        total: mem.total / (1024 ** 3), // Convert bytes to GB
      },
      temp: cpuTemperature.main ?? 0, // Default to 0 if temp is not available
      uptime: formatUptime(time.uptime),
      network: {
        status: networkInterfaces && networkInterfaces.ip4 ? 'Online' : 'Offline',
        ipAddress: networkInterfaces.ip4 || 'N/A',
        // Convert Bytes/sec to Mbps
        speed: Math.round((networkStats.tx_sec / 1024 / 1024) * 8 * 100) / 100,
      },
    };

    // The frontend expects an array of boards.
    // Since this service runs on a single host, we return an array with one element.
    res.json([boardInfo]);

  } catch (error) {
    console.error('Failed to get system information:', error);
    res.status(500).json({ error: 'Failed to retrieve system information', details: error.message });
  }
});

// Network endpoints for router-style UI
app.get('/api/network/interfaces', async (req, res) => {
  try {
    const interfaces = await si.networkInterfaces();
    res.json(interfaces);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve network interfaces', details: error.message });
  }
});

app.get('/api/network/stats', async (req, res) => {
  try {
    const stats = await si.networkStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve network stats', details: error.message });
  }
});

app.get('/api/network/summary', async (req, res) => {
  try {
    const [interfaces, statsAll, netGateway] = await Promise.all([
      si.networkInterfaces(),
      si.networkStats(),
      si.networkGatewayDefault().catch(() => null),
    ]);
    const active = interfaces.find((i) => (i.operstate === 'up' || i.operstate === 'unknown') && i.ip4);
    const defStats = Array.isArray(statsAll) ? statsAll.find((s) => active && s.iface === active.iface) : statsAll;
    const summary = {
      interface: active?.iface || null,
      ip4: active?.ip4 || null,
      mac: active?.mac || null,
      speedMbps: defStats && typeof defStats.tx_sec === 'number' ? Math.round((defStats.tx_sec / 1024 / 1024) * 8 * 100) / 100 : 0,
      rxMbps: defStats && typeof defStats.rx_sec === 'number' ? Math.round((defStats.rx_sec / 1024 / 1024) * 8 * 100) / 100 : 0,
      gateway: netGateway || null,
      operstate: active?.operstate || null,
    };
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve network summary', details: error.message });
  }
});

// WiFi endpoints (nmcli preferred; falls back to iwgetid for SSID)
function run(cmd, args = []) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    p.stdout.on('data', (d) => (out += d.toString()));
    p.stderr.on('data', (d) => (err += d.toString()));
    p.on('error', reject);
    p.on('close', (code) => {
      if (code === 0) resolve(out.trim());
      else reject(new Error(err.trim() || `Command ${cmd} exited ${code}`));
    });
  });
}

app.get('/api/wifi/status', async (req, res) => {
  try {
    const ifaces = await si.networkInterfaces();
    const wifi = ifaces.filter((i) => (i.type === 'wireless') || /^wl|^wlan/.test(i.iface));
    let ssid = null;
    try { ssid = await run('iwgetid', ['-r']); } catch {}
    res.json({ interfaces: wifi.map((i) => ({ iface: i.iface, ip4: i.ip4, mac: i.mac, operstate: i.operstate })), ssid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get WiFi status', details: error.message });
  }
});

app.get('/api/wifi/scan', async (req, res) => {
  try {
    const out = await run('nmcli', ['-t', '-f', 'SSID,SIGNAL', 'dev', 'wifi', 'list']);
    const networks = out.split('\n')
      .map((line) => {
        const [ssid, signal] = line.split(':');
        return { ssid, signal: signal ? Number(signal) : null };
      })
      .filter((n) => n.ssid && n.ssid.length > 0);
    res.json(networks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to scan WiFi', details: error.message });
  }
});

app.post('/api/wifi/connect', async (req, res) => {
  try {
    const { ssid, password, iface } = req.body || {};
    if (!ssid || !password) return res.status(400).json({ error: 'ssid and password are required' });
    let ifname = iface;
    if (!ifname) {
      const ifaces = await si.networkInterfaces();
      const wifi = ifaces.find((i) => (i.type === 'wireless') || /^wl|^wlan/.test(i.iface));
      ifname = wifi?.iface;
    }
    const args = ['dev', 'wifi', 'connect', ssid];
    if (password) { args.push('password', password); }
    if (ifname) { args.push('ifname', ifname); }
    await run('nmcli', args);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect WiFi', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Hybrid Router backend server running on http://localhost:${PORT}`);
});
