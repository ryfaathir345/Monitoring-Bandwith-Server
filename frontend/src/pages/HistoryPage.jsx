// frontend/src/pages/HistoryPage.jsx
// Halaman riwayat data bandwidth dan alert dari database MySQL

import { useState, useEffect } from 'react'
import api from '../services/api'

function HistoryPage() {
  const [bandwidthLogs, setBandwidthLogs] = useState([])
  const [alertLogs, setAlertLogs] = useState([])
  const [activeTab, setActiveTab] = useState('bandwidth')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true)
      try {
        const [bwRes, alertRes] = await Promise.all([
          api.get('/logs/bandwidth?limit=50'),
          api.get('/logs/alerts'),
        ])
        setBandwidthLogs(bwRes.data.data || [])
        setAlertLogs(alertRes.data.data || [])
      } catch (err) {
        console.error('Gagal fetch logs:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  function statusBadge(status) {
    if (status === 'online') return 'bg-green-900/60 text-green-300 border border-green-700'
    if (status === 'warning') return 'bg-yellow-900/60 text-yellow-300 border border-yellow-700'
    return 'bg-red-900/60 text-red-300 border border-red-700'
  }

  function severityBadge(severity) {
    if (severity === 'critical') return 'bg-red-900/60 text-red-300 border border-red-700'
    if (severity === 'warning') return 'bg-yellow-900/60 text-yellow-300 border border-yellow-700'
    return 'bg-gray-700 text-gray-300 border border-gray-600'
  }

  function formatDate(ts) {
    try { return new Date(ts).toLocaleString('id-ID') }
    catch { return '-' }
  }

  return (
    <div className="text-white space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Historical Logs</h1>
        <p className="text-gray-400 text-sm mt-1">
          Riwayat data monitoring yang tersimpan di database
        </p>
      </div>

      {/* Tab */}
      <div className="flex gap-2 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('bandwidth')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px
            ${activeTab === 'bandwidth'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          📊 Bandwidth Logs
          <span className="ml-2 text-xs bg-gray-700 px-1.5 py-0.5 rounded-full">
            {bandwidthLogs.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px
            ${activeTab === 'alerts'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          🚨 Alert Logs
          <span className="ml-2 text-xs bg-gray-700 px-1.5 py-0.5 rounded-full">
            {alertLogs.length}
          </span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-48 text-gray-500">
          <span className="animate-spin mr-2">⚙️</span> Memuat data...
        </div>
      )}

      {/* Tabel Bandwidth Logs */}
      {!loading && activeTab === 'bandwidth' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700 bg-gray-800/80">
                  <th className="text-left px-4 py-3">Device</th>
                  <th className="text-right px-4 py-3">BW In</th>
                  <th className="text-right px-4 py-3">BW Out</th>
                  <th className="text-right px-4 py-3">Latency</th>
                  <th className="text-right px-4 py-3">Pkt Loss</th>
                  <th className="text-center px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {bandwidthLogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      Belum ada data
                    </td>
                  </tr>
                ) : bandwidthLogs.map((log) => (
                  <tr key={log.id} className="text-gray-300 hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{log.device_name}</td>
                    <td className="px-4 py-3 text-right text-green-400">{log.bandwidth_in} Mbps</td>
                    <td className="px-4 py-3 text-right text-blue-400">{log.bandwidth_out} Mbps</td>
                    <td className="px-4 py-3 text-right">{parseFloat(log.latency).toFixed(1)} ms</td>
                    <td className="px-4 py-3 text-right">{parseFloat(log.packet_loss).toFixed(2)}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">
                      {formatDate(log.recorded_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tabel Alert Logs */}
      {!loading && activeTab === 'alerts' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700 bg-gray-800/80">
                  <th className="text-left px-4 py-3">Device</th>
                  <th className="text-left px-4 py-3">Pesan</th>
                  <th className="text-center px-4 py-3">Severity</th>
                  <th className="text-center px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {alertLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      Belum ada alert
                    </td>
                  </tr>
                ) : alertLogs.map((alert) => (
                  <tr key={alert.id} className="text-gray-300 hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{alert.device_name}</td>
                    <td className="px-4 py-3 text-gray-300">{alert.message}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${severityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${alert.is_resolved ? 'bg-green-900/60 text-green-300 border border-green-700' : 'bg-gray-700 text-gray-400'}`}>
                        {alert.is_resolved ? 'resolved' : 'open'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">
                      {formatDate(alert.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}

export default HistoryPage