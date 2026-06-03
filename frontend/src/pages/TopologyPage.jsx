// frontend/src/pages/TopologyPage.jsx
// Halaman visualisasi topologi jaringan interaktif

import { useState, useMemo } from 'react'
import { useMonitoring } from '../hooks/useMonitoring'
import { TOPOLOGY_NODES, TOPOLOGY_LINKS } from '../services/topologyData'
import TopologyNode from '../components/TopologyNode'
import TopologyLink from '../components/TopologyLink'
import NodeDetail from '../components/NodeDetail'
import ScenarioControl from '../components/ScenarioControl'

function TopologyPage() {
  const { devices, scenario, connected, changeScenario } = useMonitoring()

  // Node yang sedang diklik/dipilih
  const [selectedNode, setSelectedNode] = useState(null)

  // Buat map deviceId → data device untuk akses cepat
  const devicesMap = useMemo(() => {
    const map = {}
    devices.forEach(d => { map[d.id] = d })
    return map
  }, [devices])

  // Statistik ringkasan
  const onlineCount  = devices.filter(d => d.status === 'online').length
  const offlineCount = devices.filter(d => d.status === 'offline').length
  const warningCount = devices.filter(d => d.status === 'warning').length

  function handleNodeClick(node) {
    // Toggle: klik node yang sudah dipilih = deselect
    setSelectedNode(prev => prev?.id === node.id ? null : node)
  }

  return (
    <div className="text-white space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Network Topology</h1>
          <p className="text-gray-400 text-sm mt-1">
            Visualisasi topologi jaringan secara realtime
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
          <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-400">{connected ? 'Live' : 'Offline'}</span>
        </div>
      </div>

      {/* ── Legend & Stats ── */}
      <div className="flex flex-wrap items-center gap-6 bg-gray-800 rounded-xl border border-gray-700 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-400">Online ({onlineCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm text-gray-400">Warning ({warningCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-400">Offline ({offlineCount})</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-8 h-px bg-blue-400" />
          <span className="text-xs text-gray-500">Animasi = data flow aktif</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-px bg-red-400" style={{ borderTop: '2px dashed #ef4444', background: 'none' }} />
          <span className="text-xs text-gray-500">Putus-putus = link down</span>
        </div>
      </div>

      {/* ── Main Content: Diagram + Detail Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Diagram SVG */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-4">
          <svg
            viewBox="0 0 800 500"
            className="w-full"
            style={{ minHeight: '400px' }}
          >
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="800" height="500" fill="url(#grid)" />

            {/* Render semua link/koneksi dulu (di bawah node) */}
            {TOPOLOGY_LINKS.map((link, index) => (
              <TopologyLink
                key={index}
                link={link}
                nodes={TOPOLOGY_NODES}
                devicesMap={devicesMap}
              />
            ))}

            {/* Render semua node di atas link */}
            {TOPOLOGY_NODES.map(node => (
              <TopologyNode
                key={node.id}
                node={node}
                deviceData={node.deviceId ? devicesMap[node.deviceId] : null}
                isSelected={selectedNode?.id === node.id}
                onClick={handleNodeClick}
              />
            ))}
          </svg>

          <p className="text-center text-gray-600 text-xs mt-2">
            Klik node untuk melihat detail perangkat
          </p>
        </div>

        {/* Panel kanan: detail node atau placeholder */}
        <div className="space-y-4">
          {selectedNode ? (
            <NodeDetail
              node={selectedNode}
              deviceData={selectedNode.deviceId ? devicesMap[selectedNode.deviceId] : null}
              onClose={() => setSelectedNode(null)}
            />
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 flex items-center justify-center h-48">
              <p className="text-gray-500 text-sm text-center">
                👆 Klik node pada diagram<br />untuk melihat detail
              </p>
            </div>
          )}

          {/* Info skenario aktif */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <p className="text-gray-400 text-xs mb-1">Skenario aktif:</p>
            <p className="text-yellow-400 font-bold">{scenario}</p>
          </div>
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

export default TopologyPage