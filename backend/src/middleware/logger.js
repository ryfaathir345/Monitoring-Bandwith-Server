// backend/src/middleware/logger.js
// Middleware ini mencetak log setiap request yang masuk
// Berguna untuk debugging dan monitoring

function logger(req, res, next) {
  const now = new Date().toLocaleTimeString('id-ID')
  console.log(`[${now}] ${req.method} ${req.url}`)

  // next() wajib dipanggil agar request dilanjutkan ke handler berikutnya
  next()
}

export default logger