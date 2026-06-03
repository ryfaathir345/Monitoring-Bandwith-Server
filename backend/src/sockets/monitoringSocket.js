// backend/src/sockets/monitoringSocket.js
// Mengatur semua komunikasi realtime via Socket.IO
// File ini dipanggil dari index.js dan menerima instance io dari sana

import simulator from '../simulator/bandwidthSimulator.js'

// Menyimpan interval agar bisa dihentikan jika perlu
let broadcastInterval = null

export function initSocket(io) {

  // Jalankan broadcast ke SEMUA client setiap 2 detik
  // Ini berjalan terus meski belum ada client yang connect
  broadcastInterval = setInterval(() => {
    const snapshot = simulator.generateSnapshot()
    const alerts = simulator.getAlerts()

    // Kirim ke semua client yang sedang terhubung
    io.emit('bandwidth_update', {
      data: snapshot,
      timestamp: new Date().toISOString(),
      scenario: simulator.getScenario(),
    })

    // Kirim alert hanya jika ada yang baru (belum di-acknowledge)
    const unacknowledged = alerts.filter(a => !a.acknowledged)
    if (unacknowledged.length > 0) {
      io.emit('alert_update', {
        alerts: unacknowledged.slice(0, 5), // Kirim max 5 alert terbaru
      })
    }

  }, 2000) // Setiap 2000ms = 2 detik

  console.log('📡 Socket.IO broadcast dimulai (interval: 2 detik)')

  // ─── EVENT PER CLIENT ──────────────────────────────────────
  // Blok ini dijalankan setiap ada client baru yang connect
  io.on('connection', (socket) => {
    console.log(`✅ Client terhubung: ${socket.id}`)

    // Kirim data snapshot langsung saat client baru connect
    // Agar client tidak perlu menunggu 2 detik untuk data pertama
    const initialData = simulator.generateSnapshot()
    socket.emit('bandwidth_update', {
      data: initialData,
      timestamp: new Date().toISOString(),
      scenario: simulator.getScenario(),
    })

    // ── Event: Client minta ganti skenario ──
    socket.on('change_scenario', (payload) => {
      try {
        const { scenario } = payload
        simulator.setScenario(scenario)

        // Konfirmasi ke SEMUA client bahwa skenario berubah
        io.emit('scenario_changed', {
          scenario,
          message: `Skenario diganti ke: ${scenario}`,
          timestamp: new Date().toISOString(),
        })

        console.log(`🎭 Skenario diganti oleh ${socket.id}: ${scenario}`)
      } catch (err) {
        // Kirim error hanya ke client yang mengirim request
        socket.emit('error_message', { message: err.message })
      }
    })

    // ── Event: Client request history device tertentu ──
    socket.on('get_history', (payload) => {
      const { deviceId } = payload
      const history = simulator.getHistory(deviceId)
      socket.emit('history_data', { deviceId, history })
    })

    // ── Event: Client acknowledge alert ──
    socket.on('acknowledge_alert', (payload) => {
      const { alertId } = payload
      simulator.acknowledgeAlert(alertId)
    })

    // ── Event: Client disconnect ──
    socket.on('disconnect', () => {
      console.log(`❌ Client terputus: ${socket.id}`)
    })
  })
}