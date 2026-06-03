// backend/src/routes/logs.js

import { Router } from 'express'
import { getBandwidthLogs, getAlerts, resolveAlert } from '../services/dbService.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

// GET /api/logs/bandwidth
router.get('/bandwidth', authMiddleware, async (req, res) => {
  try {
    const { device_id, limit } = req.query
    const logs = await getBandwidthLogs(device_id, parseInt(limit) || 100)
    res.json({ success: true, data: logs })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/logs/alerts
router.get('/alerts', authMiddleware, async (req, res) => {
  try {
    const alerts = await getAlerts(50)
    res.json({ success: true, data: alerts })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PUT /api/logs/alerts/:id/resolve
router.put('/alerts/:id/resolve', authMiddleware, async (req, res) => {
  try {
    await resolveAlert(req.params.id)
    res.json({ success: true, message: 'Alert berhasil di-resolve' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router