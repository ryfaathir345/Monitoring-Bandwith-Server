// backend/src/services/dbService.js

import pool from '../database/connection.js'

// ======= USER FUNCTIONS =======

export async function findUserByUsername(username) {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
  )
  return rows[0] || null
}

export async function createUser(username, hashedPassword, role = 'viewer') {
  const [result] = await pool.execute(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, hashedPassword, role]
  )
  return result.insertId
}

// ======= BANDWIDTH LOG FUNCTIONS =======

export async function saveBandwidthLog(data) {
  const { device_id, device_name, bandwidth_in, bandwidth_out, latency, packet_loss, status } = data
  const [result] = await pool.execute(
    `INSERT INTO bandwidth_logs 
     (device_id, device_name, bandwidth_in, bandwidth_out, latency, packet_loss, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [device_id, device_name, bandwidth_in, bandwidth_out, latency, packet_loss, status]
  )
  return result.insertId
}

export async function getBandwidthLogs(device_id = null, limit = 100) {
  let query = 'SELECT * FROM bandwidth_logs'
  let params = []

  if (device_id) {
    query += ' WHERE device_id = ?'
    params.push(device_id)
  }

  query += ' ORDER BY recorded_at DESC LIMIT ?'
  params.push(limit)

  const [rows] = await pool.execute(query, params)
  return rows
}

// ======= ALERT FUNCTIONS =======

export async function saveAlert(data) {
  const { device_id, device_name, alert_type, message, severity } = data
  const [result] = await pool.execute(
    `INSERT INTO alerts (device_id, device_name, alert_type, message, severity) 
     VALUES (?, ?, ?, ?, ?)`,
    [device_id, device_name, alert_type, message, severity]
  )
  return result.insertId
}

export async function getAlerts(limit = 50) {
  const [rows] = await pool.execute(
    'SELECT * FROM alerts ORDER BY created_at DESC LIMIT ?',
    [limit]
  )
  return rows
}

export async function resolveAlert(alertId) {
  await pool.execute(
    'UPDATE alerts SET is_resolved = TRUE WHERE id = ?',
    [alertId]
  )
}