// backend/src/sockets/monitoringSocket.js

import simulator from '../simulator/bandwidthSimulator.js'
import { saveBandwidthLog, saveAlert } from '../services/dbService.js'

let broadcastInterval = null
let saveCounter = 0

export function initSocket(io) {

  broadcastInterval = setInterval(async () => {
    const snapshot = simulator.generateSnapshot()
    const alerts = simulator.getAlerts()

    io.emit('bandwidth_update', {
      data: snapshot,
      timestamp: new Date().toISOString(),
      scenario: simulator.getScenario(),
    })

    const unacknowledged = alerts.filter(a => !a.acknowledged)
    if (unacknowledged.length > 0) {
      io.emit('alert_update', {
        alerts: unacknowledged.slice(0, 5),
      })
    }

    // Simpan ke DB setiap 5 interval (10 detik)
    saveCounter++
    if (saveCounter % 5 === 0) {
      console.log('💾 Menyimpan data ke database...')

      for (const device of snapshot) {
        try {
          await saveBandwidthLog({
            device_id: device.id,
            device_name: device.name,
            bandwidth_in: device.bandwidthIn,
            bandwidth_out: device.bandwidthOut,
            latency: device.latency,
            packet_loss: device.packetLoss,
            status: device.status,
          })
        } catch (err) {
          console.error('⚠ Gagal simpan log:', err.message)
        }
      }

      for (const alert of unacknowledged.slice(0, 3)) {
        try {
          await saveAlert({
            device_id: alert.deviceId,
            device_name: alert.deviceName,
            alert_type: alert.severity,
            message: alert.message,
            severity: alert.severity,
          })
        } catch (err) {
          console.error('⚠ Gagal simpan alert:', err.message)
        }
      }

      console.log(`✅ Data tersimpan! (${snapshot.length} devices)`)
    }

  }, 2000)

  console.log('📡 Socket.IO broadcast dimulai (interval: 2 detik)')

  io.on('connection', (socket) => {
    console.log(`✅ Client terhubung: ${socket.id}`)

    const initialData = simulator.generateSnapshot()
    socket.emit('bandwidth_update', {
      data: initialData,
      timestamp: new Date().toISOString(),
      scenario: simulator.getScenario(),
    })

    socket.on('change_scenario', (payload) => {
      try {
        const { scenario } = payload
        simulator.setScenario(scenario)
        io.emit('scenario_changed', {
          scenario,
          message: `Skenario diganti ke: ${scenario}`,
          timestamp: new Date().toISOString(),
        })
        console.log(`🎭 Skenario diganti oleh ${socket.id}: ${scenario}`)
      } catch (err) {
        socket.emit('error_message', { message: err.message })
      }
    })

    socket.on('get_history', (payload) => {
      const { deviceId } = payload
      const history = simulator.getHistory(deviceId)
      socket.emit('history_data', { deviceId, history })
    })

    socket.on('acknowledge_alert', (payload) => {
      const { alertId } = payload
      simulator.acknowledgeAlert(alertId)
    })

    socket.on('disconnect', () => {
      console.log(`❌ Client terputus: ${socket.id}`)
    })
  })
}