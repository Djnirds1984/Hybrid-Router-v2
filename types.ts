
export interface NetworkInfo {
  status: 'Online' | 'Offline';
  ipAddress: string;
  speed: number; // in Mbps
}

export interface BoardInfo {
  id: string;
  name: string;
  arch: 'arm' | 'x64';
  cpuUsage: number; // percentage
  memory: {
    used: number; // in GB
    total: number; // in GB
  };
  temp: number; // in Celsius
  uptime: string;
  network: NetworkInfo;
}

export interface NetworkInterface {
  iface: string;
  ip4?: string;
  mac?: string;
  operstate?: string;
  speed?: number;
  type?: string;
}

export interface NetworkSummary {
  interface: string | null;
  ip4: string | null;
  mac: string | null;
  speedMbps: number;
  rxMbps: number;
  gateway: string | null;
  operstate: string | null;
}
