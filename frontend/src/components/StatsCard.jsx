// frontend/src/components/StatsCard.jsx

import { useEffect, useRef } from 'react'

function StatsCard({ title, value, subtitle, color = 'blue', icon }) {
  const prevRef = useRef(value)

  const colorMap = {
    blue:   'bg-blue-900/40 border-blue-700/50 text-blue-400',
    green:  'bg-green-900/40 border-green-700/50 text-green-400',
    red:    'bg-red-900/40 border-red-700/50 text-red-400',
    yellow: 'bg-yellow-900/40 border-yellow-700/50 text-yellow-400',
    purple: 'bg-purple-900/40 border-purple-700/50 text-purple-400',
  }

  // Deteksi perubahan nilai untuk efek flash
  const changed = prevRef.current !== value
  useEffect(() => { prevRef.current = value }, [value])

  return (
    <div className={`rounded-xl border p-5 transition-all duration-300 ${colorMap[color]} ${changed ? 'scale-105' : 'scale-100'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="text-3xl font-bold text-white mb-1 tabular-nums">
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-gray-500">{subtitle}</div>
      )}
    </div>
  )
}

export default StatsCard