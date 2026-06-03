// frontend/src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3002/api',
  timeout: 10000,
})

// Interceptor — otomatis ambil token dari localStorage setiap request
// Ini memastikan token SELALU terkirim tanpa perlu set manual
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export default api