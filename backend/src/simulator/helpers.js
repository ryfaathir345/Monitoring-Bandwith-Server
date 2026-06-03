// backend/src/simulator/helpers.js
// Kumpulan fungsi pembantu untuk simulator

// Menghasilkan angka random antara min dan max
export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Menghasilkan angka desimal random (untuk latency, packet loss)
export function randomFloat(min, max, decimals = 2) {
  const val = Math.random() * (max - min) + min
  return parseFloat(val.toFixed(decimals))
}

// Menentukan status berdasarkan persentase penggunaan bandwidth
export function getBandwidthStatus(usage, max) {
  const percent = (usage / max) * 100
  if (percent >= 90) return 'critical'
  if (percent >= 80) return 'warning'
  if (percent >= 50) return 'moderate'
  return 'normal'
}

// Format angka bandwidth jadi string yang mudah dibaca
export function formatBandwidth(mbps) {
  if (mbps >= 1000) return `${(mbps / 1000).toFixed(2)} Gbps`
  return `${mbps} Mbps`
}

// Menghasilkan timestamp sekarang dalam format ISO
export function now() {
  return new Date().toISOString()
}