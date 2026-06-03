// frontend/src/components/AlertPanel.jsx

function AlertPanel({ alerts }) {

  function severityStyle(severity) {
    if (severity === 'critical') return 'border-red-700/50 bg-red-900/20'
    return 'border-yellow-700/50 bg-yellow-900/20'
  }

  function severityBadge(severity) {
    if (severity === 'critical') return 'bg-red-900 text-red-300 border border-red-700'
    return 'bg-yellow-900 text-yellow-300 border border-yellow-700'
  }

  function severityIcon(severity) {
    return severity === 'critical' ? '🔴' : '🟡'
  }

  function formatTime(ts) {
    try { return new Date(ts).toLocaleTimeString('id-ID') }
    catch { return '-' }
  }

  const activeAlerts = alerts ? alerts.filter(a => !a.acknowledged) : []
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 h-full">
        <h3 className="text-white font-semibold mb-4">🚨 Alert System</h3>
        <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm gap-2">
          <span className="text-3xl">✅</span>
          <span>Tidak ada alert aktif</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          🚨 Alert System
          {criticalCount > 0 && (
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
          )}
        </h3>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="text-xs bg-red-900 text-red-300 border border-red-700 px-2 py-0.5 rounded-full animate-pulse">
              {criticalCount} critical
            </span>
          )}
          <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
            {activeAlerts.length} aktif
          </span>
        </div>
      </div>

      {/* List Alert */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
        {alerts.slice(0, 10).map((alert, idx) => (
          <div
            key={alert.id || idx}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-all
              ${severityStyle(alert.severity)}
              ${alert.severity === 'critical' ? 'shadow-sm shadow-red-900' : ''}`}
          >
            <span className="mt-0.5 text-sm">{severityIcon(alert.severity)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${severityBadge(alert.severity)}`}>
                  {alert.severity?.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(alert.timestamp)}
                </span>
                {alert.deviceName && (
                  <span className="text-xs text-gray-500 font-mono truncate">
                    {alert.deviceName}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-300 leading-snug">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {alerts.length > 10 && (
        <p className="text-xs text-gray-600 text-center mt-3">
          +{alerts.length - 10} alert lainnya
        </p>
      )}
    </div>
  )
}

export default AlertPanel