// frontend/src/layouts/MainLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../services/authContext'

function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">

        {/* Logo */}
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <span className="text-white font-bold text-lg">NetMonitor</span>
          </div>
          <p className="text-gray-500 text-xs mt-1 ml-11">Network Dashboard</p>
        </div>

        {/* Navigasi */}
        <nav className="p-4 space-y-1 flex-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
              ${isActive
                ? 'bg-blue-600 text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'}`
            }
          >
            <span>📊</span> Dashboard
          </NavLink>

          <NavLink
            to="/topology"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
              ${isActive
                ? 'bg-blue-600 text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'}`
            }
          >
            <span>🌐</span> Topology
          </NavLink>
        </nav>

        {/* Info User + Logout */}
        <div className="p-4 border-t border-gray-700">
          {user && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user.name || user.username}
                </p>
                <p className="text-gray-500 text-xs">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-gray-400 hover:text-red-400
              hover:bg-gray-700 rounded-lg text-sm transition-colors"
          >
            🚪 Logout
          </button>
        </div>

      </aside>

      {/* ── Konten Utama ── */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>

    </div>
  )
}

export default MainLayout