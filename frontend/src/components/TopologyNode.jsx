// frontend/src/components/TopologyNode.jsx
// Satu node/perangkat dalam diagram topologi
// Digambar sebagai elemen SVG

function TopologyNode({ node, deviceData, isSelected, onClick }) {

  // Tentukan warna berdasarkan status device
  function getStatusColor() {
    if (!deviceData) return '#6b7280'       // abu — tidak ada data
    if (deviceData.status === 'offline') return '#ef4444'   // merah
    if (deviceData.status === 'warning') return '#f59e0b'   // kuning
    if (deviceData.usagePercent >= 80)   return '#f59e0b'   // kuning — usage tinggi
    return '#22c55e'                                          // hijau — normal
  }

  // Icon teks untuk setiap tipe device (karena SVG tidak support emoji dengan baik)
  function getIcon() {
    const icons = {
      cloud:        '☁',
      router:       '⬡',
      switch:       '⬢',
      server:       '▣',
      access_point: '◉',
    }
    return icons[node.type] || '●'
  }

  const statusColor = getStatusColor()
  const isOffline = deviceData?.status === 'offline'

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={() => onClick(node)}
      style={{ cursor: 'pointer' }}
    >
      {/* Lingkaran luar — glow effect saat selected */}
      {isSelected && (
        <circle r="38" fill="none" stroke="#3b82f6" strokeWidth="2"
          strokeDasharray="4 2" opacity="0.8">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Lingkaran status (ring luar) */}
      <circle
        r="32"
        fill="none"
        stroke={statusColor}
        strokeWidth="2"
        opacity={isOffline ? 0.4 : 0.6}
      />

      {/* Lingkaran utama node */}
      <circle
        r="26"
        fill={isOffline ? '#1f2937' : '#1e293b'}
        stroke={statusColor}
        strokeWidth="2.5"
        opacity={isOffline ? 0.5 : 1}
      />

      {/* Pulse animation untuk node online */}
      {!isOffline && deviceData && (
        <circle r="26" fill="none" stroke={statusColor} strokeWidth="1" opacity="0.3">
          <animate
            attributeName="r"
            from="26"
            to="36"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.3"
            to="0"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Icon device */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="18"
        fill={isOffline ? '#6b7280' : '#e2e8f0'}
        y="1"
      >
        {getIcon()}
      </text>

      {/* Label nama device */}
      <text
        textAnchor="middle"
        y="46"
        fontSize="12"
        fontWeight="600"
        fill={isOffline ? '#6b7280' : '#f1f5f9'}
        fontFamily="monospace"
      >
        {node.label}
      </text>

      {/* Sub-label IP address */}
      {node.sublabel && (
        <text
          textAnchor="middle"
          y="60"
          fontSize="10"
          fill="#64748b"
          fontFamily="monospace"
        >
          {node.sublabel}
        </text>
      )}

      {/* Badge usage percent */}
      {deviceData && deviceData.status !== 'offline' && (
        <g transform="translate(18, -20)">
          <rect
            x="-14" y="-8" width="28" height="16"
            rx="8"
            fill={deviceData.usagePercent >= 80 ? '#7f1d1d' : '#14532d'}
            stroke={deviceData.usagePercent >= 80 ? '#ef4444' : '#22c55e'}
            strokeWidth="1"
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="9"
            fontWeight="bold"
            fill={deviceData.usagePercent >= 80 ? '#fca5a5' : '#86efac'}
          >
            {deviceData.usagePercent}%
          </text>
        </g>
      )}

      {/* Badge offline */}
      {isOffline && (
        <g transform="translate(18, -20)">
          <rect
            x="-16" y="-8" width="32" height="16"
            rx="8"
            fill="#450a0a"
            stroke="#ef4444"
            strokeWidth="1"
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="9"
            fontWeight="bold"
            fill="#fca5a5"
          >
            DOWN
          </text>
        </g>
      )}
    </g>
  )
}

export default TopologyNode