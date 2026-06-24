import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        await login(form.email, form.password)
        toast.success('Welcome back!')
      } else {
        await register(form.name, form.email, form.password)
        toast.success('Account ban gaya!')
      }
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kuch gadbad hui')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Code<span className="text-indigo-400">Sense</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            {isLogin ? 'Apne account mein login karein' : 'Naya account banayein'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

          {/* Toggle */}
          <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
            {['Login', 'Register'].map((tab) => (
              <button
                key={tab}
                onClick={() => setIsLogin(tab === 'Login')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${(isLogin ? 'Login' : 'Register') === tab
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3
                    text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500
                    focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3
                  text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500
                  focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3
                  text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500
                  focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50
                text-white font-medium py-3 rounded-xl transition-all duration-200 mt-2"
            >
              {loading ? 'Please wait...' : isLogin ? 'Login karein' : 'Account banayein'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}