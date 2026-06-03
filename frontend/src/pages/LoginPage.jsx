// frontend/src/pages/LoginPage.jsx
// Halaman login dengan form username dan password

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../services/authContext'

function LoginPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(form.username, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo & Judul */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">N</span>
          </div>
          <h1 className="text-white text-2xl font-bold">NetMonitor</h1>
          <p className="text-gray-400 text-sm mt-1">
            Network Monitoring Dashboard
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <h2 className="text-white text-xl font-semibold mb-6">
            Masuk ke Dashboard
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg mb-5">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="admin"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3
                  text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
                  focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3
                  text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
                  focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800
                disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg
                transition-colors duration-200"
            >
              {loading ? '⏳ Memverifikasi...' : '🔐 Masuk'}
            </button>

          </form>

          {/* Info akun demo */}
          <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <p className="text-gray-400 text-xs font-medium mb-2">
              Akun Demo:
            </p>
            <div className="space-y-1 text-xs font-mono">
              <p className="text-gray-300">
                👤 admin / <span className="text-blue-400">admin123</span>
              </p>
              <p className="text-gray-300">
                👤 operator / <span className="text-blue-400">operator123</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default LoginPage