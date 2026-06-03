// frontend/src/services/authContext.jsx
// Menyimpan state autentikasi yang bisa diakses seluruh komponen

import { createContext, useContext, useState, useEffect } from 'react'
import api from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Saat app pertama dibuka, cek apakah token lama masih valid
  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        // Set token ke header default axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // Verifikasi token ke backend
        const res = await api.get('/auth/me')
        setUser(res.data.user)
      } catch {
        // Token tidak valid — hapus dari storage
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkToken()
  }, [token])

  // Fungsi login
  async function login(username, password) {
    const res = await api.post('/auth/login', { username, password })
    const { token: newToken, user: newUser } = res.data

    // Simpan token ke localStorage dan axios header
    localStorage.setItem('token', newToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

    setToken(newToken)
    setUser(newUser)
    return newUser
  }

  // Fungsi logout
  function logout() {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook agar mudah dipakai di komponen
export function useAuth() {
  return useContext(AuthContext)
}