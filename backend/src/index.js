// backend/src/index.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

import logger from './middleware/logger.js'
import errorHandler from './middleware/errorHandler.js'
import healthRoutes from './routes/healthRoutes.js'
import simulatorRoutes from './routes/simulatorRoutes.js'
import { initSocket } from './sockets/monitoringSocket.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// ─── MIDDLEWARE ────────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(logger)

// ─── ROUTES ────────────────────────────────────────────────
app.use('/api/health', healthRoutes)
app.use('/api/simulator', simulatorRoutes)
app.use('/api/auth', authRoutes)

app.use('*splat', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan`,
  })
})

app.use(errorHandler)

// ─── SOCKET.IO ─────────────────────────────────────────────
// Socket.IO membutuhkan http server (bukan express langsung)
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

// Jalankan socket handler
initSocket(io)

// ─── JALANKAN SERVER ────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`🚀 Backend berjalan di http://localhost:${PORT}`)
  console.log(`📡 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔌 Socket.IO aktif`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
})

export default httpServer