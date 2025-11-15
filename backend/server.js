const express = require('express');
const cors = require('cors');
const si = require('systeminformation');

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
    const [defIf, defStats, netGateway] = await Promise.all([
      si.networkInterfaces('default'),
      si.networkStats('default'),
      si.networkGatewayDefault().catch(() => null),
    ]);

    const summary = {
      interface: defIf?.iface || null,
      ip4: defIf?.ip4 || null,
      mac: defIf?.mac || null,
      speedMbps: typeof defStats?.tx_sec === 'number' ? Math.round((defStats.tx_sec / 1024 / 1024) * 8 * 100) / 100 : 0,
      rxMbps: typeof defStats?.rx_sec === 'number' ? Math.round((defStats.rx_sec / 1024 / 1024) * 8 * 100) / 100 : 0,
      gateway: netGateway || null,
      operstate: defIf?.operstate || null,
    };
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve network summary', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Hybrid Router backend server running on http://localhost:${PORT}`);
});
