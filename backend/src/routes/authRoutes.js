// backend/src/routes/authRoutes.js
// Endpoint autentikasi

import { Router } from 'express'
import { login, getMe } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

// POST /api/auth/login — tidak perlu token
router.post('/login', login)

// GET /api/auth/me — butuh token yang valid
router.get('/me', authMiddleware, getMe)

export default router