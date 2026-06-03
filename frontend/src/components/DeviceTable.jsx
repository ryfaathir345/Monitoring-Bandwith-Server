// frontend/src/components/DeviceTable.jsx
// Tabel yang menampilkan status semua device secara detail

function DeviceTable({ devices }) {

  // Fungsi untuk menentukan warna badge status
  function statusBadge(status) {
    if (status === 'online')
      return 'bg-green-900/60 text-green-300 border border-green-700'
    if (status === 'warning')
      return 'bg-yellow-900/60 text-yellow-300 border border-yellow-700'
    return 'bg-red-900/60 text-red-300 border border-red-700'
  }

  // Fungsi untuk warna usage bar
  function usageColor(percent) {
    if (percent >= 90) return 'bg-red-500'
    if (percent >= 80) return 'bg-yellow-500'
    if (percent >= 50) return 'bg-blue-500'
    return 'bg-green-500'
  }

  // Icon tipe device
  function deviceIcon(type) {
    const icons = {
      router: '🔀',
      switch: '🔁',
      server: '🖥️',
      access_point: '📶',
    }
    return icons[type] || '📡'
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
      <h3 className="text-white font-semibold mb-4">
        📡 Device Status
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left pb-3 pr-4">Device</th>
              <th className="text-left pb-3 pr-4">IP</th>
              <th className="text-right pb-3 pr-4">BW In</th>
              <th className="text-right pb-3 pr-4">BW Out</th>
              <th className="text-right pb-3 pr-4">Latency</th>
              <th className="text-right pb-3 pr-4">Pkt Loss</th>
              <th className="text-left pb-3 pr-4">Usage</th>
              <th className="text-center pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {devices.map(device => (
              <tr key={device.id} className="text-gray-300 hover:bg-gray-700/30 transition-colors">

                {/* Nama & Tipe */}
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span>{deviceIcon(device.type)}</span>
                    <div>
                      <div className="font-medium text-white">{device.name}</div>
                      <div className="text-xs text-gray-500">{device.location}</div>
                    </div>
                  </div>
                </td>

                {/* IP */}
                <td className="py-3 pr-4 font-mono text-xs text-gray-400">
                  {device.ip}
                </td>

                {/* Bandwidth In */}
                <td className="py-3 pr-4 text-right">
                  <span className="text-green-400 font-medium">
                    {device.bandwidthIn}
                  </span>
                  <span className="text-gray-500 text-xs"> Mbps</span>
                </td>

                {/* Bandwidth Out */}
                <td className="py-3 pr-4 text-right">
                  <span className="text-blue-400 font-medium">
                    {device.bandwidthOut}
                  </span>
                  <span className="text-gray-500 text-xs"> Mbps</span>
                </td>

                {/* Latency */}
                <td className="py-3 pr-4 text-right">
                  <span className={device.latency > 100 ? 'text-red-400' : 'text-gray-300'}>
                    {device.latency}
                  </span>
                  <span className="text-gray-500 text-xs"> ms</span>
                </td>

                {/* Packet Loss */}
                <td className="py-3 pr-4 text-right">
                  <span className={device.packetLoss > 5 ? 'text-red-400' : 'text-gray-300'}>
                    {device.packetLoss}
                  </span>
                  <span className="text-gray-500 text-xs">%</span>
                </td>

                {/* Usage Bar */}
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${usageColor(device.usagePercent)}`}
                        style={{ width: `${Math.min(device.usagePercent, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8">
                      {device.usagePercent}%
                    </span>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(device.status)}`}>
                    {device.status}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DeviceTable