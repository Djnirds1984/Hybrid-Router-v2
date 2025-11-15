
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
