// frontend/src/hooks/useMonitoring.js
// Hook yang menggabungkan socket + state management untuk data monitoring
// Komponen tinggal panggil hook ini untuk dapat semua data realtime

import { useState, useEffect } from 'react'
import { useSocket } from './useSocket'

export function useMonitoring() {
  const { on, changeScenario } = useSocket()

  // State data device
  const [devices, setDevices] = useState([])

  // State alert
  const [alerts, setAlerts] = useState([])

  // State skenario aktif
  const [scenario, setScenario] = useState('normal')

  // State koneksi
  const [connected, setConnected] = useState(false)

  // State timestamp update terakhir
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    // Listen event bandwidth_update dari backend
    const offBandwidth = on('bandwidth_update', (payload) => {
      setDevices(payload.data)
      setScenario(payload.scenario)
      setLastUpdate(payload.timestamp)
      setConnected(true)
    })

    // Listen event alert_update dari backend
    const offAlert = on('alert_update', (payload) => {
      setAlerts(prev => {
        // Gabungkan alert baru dengan yang lama, hindari duplikat
        const existing = prev.map(a => a.id)
        const newAlerts = payload.alerts.filter(a => !existing.includes(a.id))
        return [...newAlerts, ...prev].slice(0, 20)
      })
    })

    // Listen konfirmasi skenario berubah
    const offScenario = on('scenario_changed', (payload) => {
      setScenario(payload.scenario)
    })

    // Cleanup saat komponen unmount
    return () => {
      offBandwidth()
      offAlert()
      offScenario()
    }
  }, [on])

  return {
    devices,
    alerts,
    scenario,
    connected,
    lastUpdate,
    changeScenario,
  }
}