// frontend/src/services/topologyData.js
// Mendefinisikan posisi node dan koneksi antar perangkat
// dalam koordinat SVG (viewBox 800x500)

export const TOPOLOGY_NODES = [
  {
    id: 'internet',
    label: 'Internet',
    type: 'cloud',
    x: 400,
    y: 50,
    deviceId: null, // tidak ada device simulator untuk internet
  },
  {
    id: 'device-001',
    label: 'Core Router',
    sublabel: '192.168.1.1',
    type: 'router',
    x: 400,
    y: 160,
    deviceId: 'device-001',
  },
  {
    id: 'device-002',
    label: 'Dist. Switch',
    sublabel: '192.168.1.2',
    type: 'switch',
    x: 400,
    y: 280,
    deviceId: 'device-002',
  },
  {
    id: 'device-003',
    label: 'Web Server',
    sublabel: '192.168.1.10',
    type: 'server',
    x: 160,
    y: 400,
    deviceId: 'device-003',
  },
  {
    id: 'device-004',
    label: 'DB Server',
    sublabel: '192.168.1.11',
    type: 'server',
    x: 400,
    y: 400,
    deviceId: 'device-004',
  },
  {
    id: 'device-005',
    label: 'Access Point',
    sublabel: '192.168.1.20',
    type: 'access_point',
    x: 640,
    y: 400,
    deviceId: 'device-005',
  },
]

// Koneksi antar node — dari node id ke node id
export const TOPOLOGY_LINKS = [
  { from: 'internet',   to: 'device-001' },
  { from: 'device-001', to: 'device-002' },
  { from: 'device-002', to: 'device-003' },
  { from: 'device-002', to: 'device-004' },
  { from: 'device-002', to: 'device-005' },
]