// frontend/src/components/NodeDetail.jsx
// Panel detail yang muncul saat user klik sebuah node
// Menampilkan informasi lengkap device tersebut

function NodeDetail({ node, deviceData, onClose }) {
  if (!node) return null

  function statusBadge(status) {
    if (status === 'online')  return 'bg-green-900 text-green-300 border-green-700'
    if (status === 'warning') return 'bg-yellow-900 text-yellow-300 border-yellow-700'
    return 'bg-red-900 text-red-300 border-red-700'
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">{node.label}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors text-lg"
        >
          ✕
        </button>
      </div>

      {/* Jika tidak ada data device (misal node Internet) */}
      {!deviceData ? (
        <p className="text-gray-500 text-sm">
          Tidak ada data monitoring untuk node ini.
        </p>
      ) : (
        <div className="space-y-3">

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Status</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(deviceData.status)}`}>
              {deviceData.status.toUpperCase()}
            </span>
          </div>

          {/* IP */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">IP Address</span>
            <span className="text-white text-sm font-mono">{deviceData.ip}</span>
          </div>

          {/* Bandwidth */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Bandwidth In</span>
            <span className="text-green-400 text-sm font-medium">
              {deviceData.bandwidthIn} Mbps
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Bandwidth Out</span>
            <span className="text-blue-400 text-sm font-medium">
              {deviceData.bandwidthOut} Mbps
            </span>
          </div>

          {/* Usage Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Usage</span>
              <span className="text-white">{deviceData.usagePercent}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  deviceData.usagePercent >= 90 ? 'bg-red-500' :
                  deviceData.usagePercent >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(deviceData.usagePercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Latency & Packet Loss */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Latency</span>
            <span className={`text-sm ${deviceData.latency > 100 ? 'text-red-400' : 'text-gray-300'}`}>
              {deviceData.latency} ms
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Packet Loss</span>
            <span className={`text-sm ${deviceData.packetLoss > 5 ? 'text-red-400' : 'text-gray-300'}`}>
              {deviceData.packetLoss}%
            </span>
          </div>

          {/* CPU & Memory */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">CPU Usage</span>
            <span className="text-gray-300 text-sm">{deviceData.cpuUsage}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Memory Usage</span>
            <span className="text-gray-300 text-sm">{deviceData.memoryUsage}%</span>
          </div>

        </div>
      )}
    </div>
  )
}

export default NodeDetail