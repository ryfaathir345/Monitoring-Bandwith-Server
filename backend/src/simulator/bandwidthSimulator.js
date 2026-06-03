// backend/src/simulator/bandwidthSimulator.js
// Inti dari simulator - menghasilkan data monitoring setiap interval waktu
// Mendukung berbagai skenario untuk keperluan demo/presentasi

import { DEVICES, ALERT_THRESHOLD } from './devices.js'
import { randomBetween, randomFloat, getBandwidthStatus, now } from './helpers.js'

class BandwidthSimulator {
  constructor() {
    // Mode skenario saat ini
    this.scenario = 'normal'

    // Menyimpan data terkini setiap device
    this.currentData = {}

    // Menyimpan history bandwidth (max 50 data point per device)
    this.history = {}

    // Menyimpan daftar alert aktif
    this.alerts = []

    // ID counter untuk alert
    this.alertCounter = 0

    // Inisialisasi data awal
    this._initDevices()

    console.log('🎮 Bandwidth Simulator initialized')
  }

  // ─── INISIALISASI ──────────────────────────────────────────
  _initDevices() {
    DEVICES.forEach(device => {
      this.currentData[device.id] = {
        ...device,
        status: 'online',
        bandwidthIn: 0,
        bandwidthOut: 0,
        latency: 0,
        packetLoss: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        timestamp: now(),
      }
      this.history[device.id] = []
    })
  }

  // ─── GENERATE DATA ─────────────────────────────────────────
  // Fungsi utama - dipanggil setiap interval untuk menghasilkan data baru
  generateSnapshot() {
    const snapshot = []
    const newAlerts = []

    DEVICES.forEach(device => {
      const data = this._generateDeviceData(device)
      this.currentData[device.id] = data

      // Simpan ke history, batasi 50 data point
      this.history[device.id].push({
        bandwidthIn: data.bandwidthIn,
        bandwidthOut: data.bandwidthOut,
        timestamp: data.timestamp,
      })
      if (this.history[device.id].length > 50) {
        this.history[device.id].shift()
      }

      // Cek apakah perlu generate alert
      const alert = this._checkAlert(data)
      if (alert) newAlerts.push(alert)

      snapshot.push(data)
    })

    // Tambahkan alert baru ke daftar (max 20 alert)
    if (newAlerts.length > 0) {
      this.alerts = [...newAlerts, ...this.alerts].slice(0, 20)
    }

    return snapshot
  }

  // ─── GENERATE DATA PER DEVICE ──────────────────────────────
  _generateDeviceData(device) {
    const base = this.currentData[device.id]

    // Tentukan nilai berdasarkan skenario aktif
    let bandwidthIn, bandwidthOut, status, latency, packetLoss

    switch (this.scenario) {

      case 'high_traffic':
        // Semua device mengalami lonjakan traffic tinggi
        bandwidthIn = randomBetween(
          Math.floor(device.maxBandwidth * 0.75),
          device.maxBandwidth
        )
        bandwidthOut = randomBetween(
          Math.floor(device.maxBandwidth * 0.70),
          Math.floor(device.maxBandwidth * 0.95)
        )
        latency = randomFloat(50, 200)
        packetLoss = randomFloat(0.5, 5)
        status = 'online'
        break

      case 'router_down':
        // Core Router (device-001) mati, device lain terpengaruh
        if (device.id === 'device-001') {
          bandwidthIn = 0
          bandwidthOut = 0
          latency = 0
          packetLoss = 100
          status = 'offline'
        } else {
          // Device lain bandwidth turun drastis karena router mati
          bandwidthIn = randomBetween(0, Math.floor(device.normalMin * 0.3))
          bandwidthOut = randomBetween(0, Math.floor(device.normalMin * 0.3))
          latency = randomFloat(200, 999)
          packetLoss = randomFloat(20, 80)
          status = 'warning'
        }
        break

      case 'server_down':
        // Web Server dan DB Server mati
        if (device.id === 'device-003' || device.id === 'device-004') {
          bandwidthIn = 0
          bandwidthOut = 0
          latency = 0
          packetLoss = 100
          status = 'offline'
        } else {
          bandwidthIn = randomBetween(device.normalMin, device.normalMax)
          bandwidthOut = randomBetween(
            Math.floor(device.normalMin * 0.8),
            Math.floor(device.normalMax * 0.8)
          )
          latency = randomFloat(5, 30)
          packetLoss = randomFloat(0, 0.5)
          status = 'online'
        }
        break

      case 'normal':
      default:
        // Traffic normal dengan sedikit variasi
        bandwidthIn = randomBetween(device.normalMin, device.normalMax)
        bandwidthOut = randomBetween(
          Math.floor(device.normalMin * 0.8),
          Math.floor(device.normalMax * 0.8)
        )
        latency = randomFloat(1, 20)
        packetLoss = randomFloat(0, 0.3)
        status = 'online'
        break
    }

    // Hitung persentase penggunaan
    const usagePercent = Math.round((bandwidthIn / device.maxBandwidth) * 100)

    return {
      ...device,
      status,
      bandwidthIn,
      bandwidthOut,
      usagePercent,
      bandwidthStatus: getBandwidthStatus(bandwidthIn, device.maxBandwidth),
      latency,
      packetLoss,
      cpuUsage: status === 'offline' ? 0 : randomBetween(10, 85),
      memoryUsage: status === 'offline' ? 0 : randomBetween(20, 90),
      timestamp: now(),
    }
  }

  // ─── CEK ALERT ─────────────────────────────────────────────
  _checkAlert(deviceData) {
    const usagePercent = deviceData.usagePercent

    // Alert jika device offline
    if (deviceData.status === 'offline') {
      return this._createAlert('critical', deviceData, `${deviceData.name} is OFFLINE`)
    }

    // Alert jika bandwidth melebihi threshold
    if (usagePercent >= ALERT_THRESHOLD) {
      return this._createAlert(
        usagePercent >= 90 ? 'critical' : 'warning',
        deviceData,
        `${deviceData.name} bandwidth usage: ${usagePercent}%`
      )
    }

    // Alert jika packet loss tinggi
    if (deviceData.packetLoss > 5) {
      return this._createAlert('warning', deviceData,
        `${deviceData.name} high packet loss: ${deviceData.packetLoss}%`
      )
    }

    return null
  }

  _createAlert(severity, deviceData, message) {
    this.alertCounter++
    return {
      id: `alert-${this.alertCounter}`,
      severity,    // 'critical' | 'warning'
      deviceId: deviceData.id,
      deviceName: deviceData.name,
      message,
      timestamp: now(),
      acknowledged: false,
    }
  }

  // ─── KONTROL SKENARIO ──────────────────────────────────────
  setScenario(scenario) {
    const validScenarios = ['normal', 'high_traffic', 'router_down', 'server_down']
    if (!validScenarios.includes(scenario)) {
      throw new Error(`Skenario tidak valid: ${scenario}`)
    }
    this.scenario = scenario
    console.log(`🎭 Skenario diganti ke: ${scenario}`)
  }

  // ─── GETTER DATA ───────────────────────────────────────────
  getCurrentData() {
    return Object.values(this.currentData)
  }

  getHistory(deviceId) {
    if (deviceId) return this.history[deviceId] || []
    return this.history
  }

  getAlerts() {
    return this.alerts
  }

  getScenario() {
    return this.scenario
  }

  // Acknowledge (tandai sudah dibaca) sebuah alert
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
      return true
    }
    return false
  }
}

// Export sebagai singleton — satu instance dipakai seluruh aplikasi
const simulator = new BandwidthSimulator()
export default simulator