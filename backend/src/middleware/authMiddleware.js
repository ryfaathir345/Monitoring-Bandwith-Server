// backend/src/middleware/authMiddleware.js
// Middleware yang memverifikasi JWT token di setiap request
// Dipasang di route yang butuh autentikasi

import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
  // Ambil token dari header Authorization
  // Format header: "Bearer eyJhbGc..."
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak ditemukan. Silakan login terlebih dahulu.',
    })
  }

  try {
    // Verifikasi token dengan secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Simpan data user ke req agar bisa diakses controller
    req.user = decoded
    next()

  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Token tidak valid atau sudah kadaluarsa.',
    })
  }
}