// backend/src/routes/healthRoutes.js
// Endpoint untuk mengecek apakah server sedang berjalan
// Berguna untuk testing koneksi dari frontend

import { Router } from 'express'

const router = Router()

// GET /api/health
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server berjalan normal ✅',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + ' detik',
  })
})

export default router