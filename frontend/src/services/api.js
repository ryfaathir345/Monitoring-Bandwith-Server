// frontend/src/services/api.js
// File ini menyimpan base URL backend agar mudah diubah

import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3002/api',
  timeout: 10000,
})

export default api