// frontend/src/pages/DashboardPage.jsx
// Halaman dashboard utama — menggabungkan semua komponen monitoring

import { useMonitoring } from '../hooks/useMonitoring'
import StatsCard from '../components/StatsCard'
import BandwidthChart from '../components/BandwidthChart'
import DeviceTable from '../components/DeviceTable'
import AlertPanel from '../components/AlertPanel'
import ScenarioControl from '../components/ScenarioControl'

function DashboardPage() {
  const {
    devices,
    alerts,
    scenario,
    connected,
    lastUpdate,
    changeScenario,
  } = useMonitoring()

  // Hitung statistik dari data devices
  const totalDevices = devices.length
  const onlineDevices = devices.filter(d => d.status === 'online').length
  const offlineDevices = devices.filter(d => d.status === 'offline').length
  const warningDevices = devices.filter(d => d.status === 'warning').length
  const activeAlerts = alerts.filter(a => !a.acknowledged).length

  // Hitung rata-rata bandwidth IN semua device yang online
  const onlineList = devices.filter(d => d.status === 'online')
  const avgBandwidth = onlineList.length > 0
    ? Math.round(onlineList.reduce((sum, d) => sum + d.bandwidthIn, 0) / onlineList.length)
    : 0

  return (
    <div className="text-white space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Network Monitoring Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Monitoring bandwidth jaringan secara realtime
          </p>
        </div>

        {/* Status koneksi */}
        <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
          <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-400">
            {connected ? 'Live' : 'Offline'}
          </span>
          {lastUpdate && (
            <span className="text-xs text-gray-600 ml-1">
              {new Date(lastUpdate).toLocaleTimeString('id-ID')}
            </span>
          )}
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total Device"
          value={totalDevices}
          icon="📡"
          color="blue"
        />
        <StatsCard
          title="Online"
          value={onlineDevices}
          icon="✅"
          color="green"
          subtitle="device aktif"
        />
        <StatsCard
          title="Offline"
          value={offlineDevices}
          icon="❌"
          color="red"
          subtitle="device mati"
        />
        <StatsCard
          title="Warning"
          value={warningDevices}
          icon="⚠️"
          color="yellow"
          subtitle="perlu perhatian"
        />
        <StatsCard
          title="Active Alerts"
          value={activeAlerts}
          icon="🚨"
          color="red"
          subtitle="belum ditangani"
        />
        <StatsCard
          title="Avg Bandwidth"
          value={avgBandwidth}
          icon="📊"
          color="purple"
          subtitle="Mbps (in)"
        />
      </div>

      {/* ── Chart Bandwidth ── */}
      <BandwidthChart devices={devices} />

      {/* ── Device Table + Alert Panel (side by side) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeviceTable devices={devices} />
        </div>
        <div>
          <AlertPanel alerts={alerts} />
        </div>
      </div>

      {/* ── Scenario Control ── */}
      <ScenarioControl
        scenario={scenario}
        onChangeScenario={changeScenario}
      />

    </div>
  )
}

export default DashboardPage