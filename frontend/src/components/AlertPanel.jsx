// frontend/src/components/AlertPanel.jsx
// Panel yang menampilkan daftar alert aktif

function AlertPanel({ alerts }) {

  function severityStyle(severity) {
    if (severity === 'critical')
      return 'border-red-700/50 bg-red-900/20'
    return 'border-yellow-700/50 bg-yellow-900/20'
  }

  function severityBadge(severity) {
    if (severity === 'critical')
      return 'bg-red-900 text-red-300 border border-red-700'
    return 'bg-yellow-900 text-yellow-300 border border-yellow-700'
  }

  function severityIcon(severity) {
    return severity === 'critical' ? '🔴' : '🟡'
  }

  // Tampilkan pesan jika tidak ada alert
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
        <h3 className="text-white font-semibold mb-4">🚨 Alert System</h3>
        <div className="flex items-center justify-center h-20 text-gray-500 text-sm">
          ✅ Tidak ada alert aktif
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">🚨 Alert System</h3>
        <span className="text-xs bg-red-900 text-red-300 border border-red-700 px-2 py-0.5 rounded-full">
          {alerts.filter(a => !a.acknowledged).length} aktif
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {alerts.slice(0, 10).map(alert => (
          <div
            key={alert.id}
            className={`flex items-start gap-3 p-3 rounded-lg border ${severityStyle(alert.severity)}`}
          >
            <span className="mt-0.5">{severityIcon(alert.severity)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${severityBadge(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(alert.timestamp).toLocaleTimeString('id-ID')}
                </span>
              </div>
              <p className="text-sm text-gray-300">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertPanel