// backend/src/controllers/authController.js
// Logika login dan verifikasi token
// Untuk saat ini user disimpan hardcoded (tanpa database)
// Tahap 10 akan menggantinya dengan MySQL

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// User hardcoded sementara — akan dipindah ke database di Tahap 10
const USERS = [
  {
    id: 1,
    username: 'admin',
    // Password: admin123 (sudah di-hash dengan bcrypt)
    password: '$2b$10$cn3rKo26dGeTGXv9aY9jpO5UwIf79amUSoTlGs0.pnmYualEs.eQ.',
    role: 'admin',
    name: 'Administrator',
  },
  {
    id: 2,
    username: 'operator',
    // Password: operator123
    password: '$2b$10$8pcl8GIQCfV1kQQROwM5IOtycTSIPLk6NKG52dRq0ktjMvE39AmTe',
    role: 'operator',
    name: 'Network Operator',
  },
]

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { username, password } = req.body

    // Validasi input tidak kosong
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password wajib diisi',
      })
    }

    // Cari user berdasarkan username
    const user = USERS.find(u => u.username === username)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah',
      })
    }

    // Verifikasi password dengan bcrypt
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah',
      })
    }

    // Buat JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    )

    // Kirim response sukses
    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    })

    console.log(`🔐 Login berhasil: ${username}`)

  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/auth/me — cek token dan return data user
export function getMe(req, res) {
  // req.user diisi oleh middleware authMiddleware
  res.json({
    success: true,
    user: req.user,
  })
}