// backend/src/simulator/devices.js
// Daftar perangkat jaringan yang akan disimulasikan
// Setiap device punya karakteristik bandwidth yang berbeda

export const DEVICES = [
  {
    id: 'device-001',
    name: 'Core Router',
    type: 'router',
    ip: '192.168.1.1',
    location: 'Server Room A',
    maxBandwidth: 1000, // Mbps
    normalMin: 500,
    normalMax: 900,
  },
  {
    id: 'device-002',
    name: 'Distribution Switch',
    type: 'switch',
    ip: '192.168.1.2',
    location: 'Server Room A',
    maxBandwidth: 1000,
    normalMin: 200,
    normalMax: 600,
  },
  {
    id: 'device-003',
    name: 'Web Server',
    type: 'server',
    ip: '192.168.1.10',
    location: 'Server Room B',
    maxBandwidth: 500,
    normalMin: 100,
    normalMax: 400,
  },
  {
    id: 'device-004',
    name: 'Database Server',
    type: 'server',
    ip: '192.168.1.11',
    location: 'Server Room B',
    maxBandwidth: 500,
    normalMin: 50,
    normalMax: 200,
  },
  {
    id: 'device-005',
    name: 'Access Point',
    type: 'access_point',
    ip: '192.168.1.20',
    location: 'Office Floor 1',
    maxBandwidth: 300,
    normalMin: 10,
    normalMax: 100,
  },
]

// Batas bandwidth untuk trigger alert (dalam persen dari maxBandwidth)
export const ALERT_THRESHOLD = 80