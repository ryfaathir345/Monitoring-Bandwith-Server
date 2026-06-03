// frontend/src/components/ProtectedRoute.jsx
// Komponen wrapper yang mengecek apakah user sudah login
// Jika belum login → redirect ke halaman login

import { Navigate } from 'react-router-dom'
import { useAuth } from '../services/authContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Tampilkan loading sementara token sedang diverifikasi
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4 animate-spin">⚙️</div>
          <p className="text-gray-400">Memverifikasi sesi...</p>
        </div>
      </div>
    )
  }

  // Jika tidak ada user → redirect ke login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute