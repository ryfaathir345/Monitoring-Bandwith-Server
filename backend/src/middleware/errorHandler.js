// backend/src/middleware/errorHandler.js
// Middleware ini menangkap semua error yang terjadi di backend
// dan mengirim response yang rapi ke frontend

function errorHandler(err, req, res, next) {
  // Tampilkan error di terminal saat development
  console.error('❌ Error:', err.message)

  // Kirim response error ke frontend
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
}

export default errorHandler