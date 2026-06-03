// backend/src/routes/simulatorRoutes.js
// Endpoint REST API untuk mengontrol dan membaca data simulator

import { Router } from 'express'
import simulator from '../simulator/bandwidthSimulator.js'

const router = Router()

// GET /api/simulator/data — ambil data terkini semua device
router.get('/data', (req, res) => {
  const data = simulator.generateSnapshot()
  res.json({ success: true, data })
})

// GET /api/simulator/history/:deviceId — ambil history bandwidth satu device
router.get('/history/:deviceId', (req, res) => {
  const history = simulator.getHistory(req.params.deviceId)
  res.json({ success: true, data: history })
})

// GET /api/simulator/alerts — ambil semua alert
router.get('/alerts', (req, res) => {
  res.json({ success: true, data: simulator.getAlerts() })
})

// POST /api/simulator/scenario — ganti skenario
// Body: { "scenario": "high_traffic" }
router.post('/scenario', (req, res) => {
  const { scenario } = req.body
  try {
    simulator.setScenario(scenario)
    res.json({
      success: true,
      message: `Skenario berhasil diganti ke: ${scenario}`,
      scenario,
    })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// GET /api/simulator/scenario — cek skenario aktif
router.get('/scenario', (req, res) => {
  res.json({ success: true, scenario: simulator.getScenario() })
})

// POST /api/simulator/alerts/:alertId/acknowledge — tandai alert sudah dibaca
router.post('/alerts/:alertId/acknowledge', (req, res) => {
  const result = simulator.acknowledgeAlert(req.params.alertId)
  res.json({ success: result, message: result ? 'Alert acknowledged' : 'Alert tidak ditemukan' })
})

export default router