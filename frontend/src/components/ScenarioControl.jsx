// frontend/src/components/ScenarioControl.jsx
// Tombol kontrol skenario untuk keperluan demo/presentasi

function ScenarioControl({ scenario, onChangeScenario }) {

  const scenarios = [
    {
      id: 'normal',
      label: 'Normal',
      icon: '✅',
      desc: 'Traffic normal',
      color: 'green',
    },
    {
      id: 'high_traffic',
      label: 'High Traffic',
      icon: '⚡',
      desc: 'Lonjakan bandwidth',
      color: 'yellow',
    },
    {
      id: 'router_down',
      label: 'Router Down',
      icon: '🔴',
      desc: 'Core router mati',
      color: 'red',
    },
    {
      id: 'server_down',
      label: 'Server Down',
      icon: '💀',
      desc: 'Web & DB server mati',
      color: 'red',
    },
  ]

  const colorMap = {
    green:  'border-green-700 bg-green-900/30 hover:bg-green-900/50',
    yellow: 'border-yellow-700 bg-yellow-900/30 hover:bg-yellow-900/50',
    red:    'border-red-700 bg-red-900/30 hover:bg-red-900/50',
  }

  const activeMap = {
    green:  'border-green-500 bg-green-900/60 ring-1 ring-green-500',
    yellow: 'border-yellow-500 bg-yellow-900/60 ring-1 ring-yellow-500',
    red:    'border-red-500 bg-red-900/60 ring-1 ring-red-500',
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
      <h3 className="text-white font-semibold mb-4">
        🎭 Scenario Control
        <span className="ml-2 text-xs text-gray-500 font-normal">
          (untuk demo presentasi)
        </span>
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {scenarios.map(s => (
          <button
            key={s.id}
            onClick={() => onChangeScenario(s.id)}
            className={`p-3 rounded-lg border text-left transition-all duration-200
              ${scenario === s.id ? activeMap[s.color] : colorMap[s.color]}`}
          >
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-white text-sm font-medium">{s.label}</div>
            <div className="text-gray-400 text-xs">{s.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ScenarioControl