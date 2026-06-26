import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Code2, LogOut, User, Zap } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Code2 size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">
              Code<span className="text-indigo-400">Sense</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Problems', path: '/problems' },
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'Leaderboard', path: '/leaderboard' },
              { label: 'Contests', path: '/contests' },
            ].map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white
                  hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            {/* XP Badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-indigo-950 
              border border-indigo-800 rounded-full px-3 py-1.5">
              <Zap size={13} className="text-indigo-400" />
              <span className="text-indigo-300 text-xs font-medium">{user?.xp || 0} XP</span>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-full 
              px-3 py-1.5 border border-gray-700">
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                <User size={12} className="text-white" />
              </div>
              <span className="text-white text-sm font-medium hidden sm:block">
                {user?.name?.split(' ')[0]}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 
                rounded-lg transition-all duration-200"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}