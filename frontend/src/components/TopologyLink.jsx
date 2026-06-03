// frontend/src/components/TopologyLink.jsx
// Garis koneksi antara dua node dalam diagram topologi

function TopologyLink({ link, nodes, devicesMap }) {

  // Cari koordinat node asal dan tujuan
  const fromNode = nodes.find(n => n.id === link.from)
  const toNode   = nodes.find(n => n.id === link.to)

  if (!fromNode || !toNode) return null

  // Cek apakah salah satu ujung link adalah device yang offline
  const fromDevice = devicesMap[fromNode.deviceId]
  const toDevice   = devicesMap[toNode.deviceId]

  const isDown = (
    fromDevice?.status === 'offline' ||
    toDevice?.status === 'offline'
  )

  const isWarning = (
    fromDevice?.status === 'warning' ||
    toDevice?.status === 'warning' ||
    fromDevice?.usagePercent >= 80 ||
    toDevice?.usagePercent >= 80
  )

  // Tentukan warna garis
  const strokeColor = isDown ? '#ef4444' : isWarning ? '#f59e0b' : '#334155'
  const strokeDash  = isDown ? '6 4' : 'none'

  return (
    <g>
      {/* Garis utama */}
      <line
        x1={fromNode.x}
        y1={fromNode.y}
        x2={toNode.x}
        y2={toNode.y}
        stroke={strokeColor}
        strokeWidth={isDown ? 1.5 : 2}
        strokeDasharray={strokeDash}
        opacity={isDown ? 0.5 : 0.7}
      />

      {/* Animasi data flow — hanya tampil jika link aktif */}
      {!isDown && (
        <circle r="3" fill="#60a5fa" opacity="0.8">
          <animateMotion
            dur={`${2 + Math.random() * 2}s`}
            repeatCount="indefinite"
            path={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
          />
        </circle>
      )}
    </g>
  )
}

export default TopologyLink