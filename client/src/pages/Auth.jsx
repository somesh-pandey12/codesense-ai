import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Code2 } from 'lucide-react'
import toast from 'react-hot-toast'

const GOOGLE_ENABLED = import.meta.env.VITE_GOOGLE_ENABLED === 'true'

export default function Auth() {
  const [isLogin, setIsLogin]   = useState(true)
  const [form, setForm]         = useState({ name: '', email: '', password: '' })
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login, register }     = useAuth()
  const navigate                = useNavigate()
  const [params]                = useSearchParams()

  if (params.get('error')) toast.error('Google sign-in failed. Please try again.')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Please fill all fields')
    if (!isLogin && !form.name)        return toast.error('Please enter your name')
    if (form.password.length < 6)      return toast.error('Password must be at least 6 characters')

    setLoading(true)
    try {
      if (isLogin) {
        await login(form.email, form.password)
        toast.success('Welcome back!')
      } else {
        await register(form.name, form.email, form.password)
        toast.success('Account created!')
      }
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = () => {
    if (!GOOGLE_ENABLED) {
      toast.error('Google login coming soon — use email for now')
      return
    }
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 border-r border-gray-800 flex-col items-center justify-center p-12">
        <div className="max-w-sm text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Code2 size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Master DSA with AI
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Practice data structures and algorithms with real-time AI feedback,
            personalized roadmaps, and mock interviews.
          </p>

          <div className="mt-10 space-y-4 text-left">
            {[
              { emoji: '🧠', title: 'AI Code Review',     sub: 'Get instant feedback on your solutions'  },
              { emoji: '📈', title: 'Adaptive Roadmap',   sub: 'Learn at your own pace, track progress'  },
              { emoji: '⚔️', title: 'Mock Interviews',    sub: 'Simulate real FAANG interview sessions'  },
              { emoji: '🏆', title: 'Global Leaderboard', sub: 'Compete with developers worldwide'       },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3 bg-gray-800 rounded-xl p-4 border border-gray-700">
                <span className="text-xl">{f.emoji}</span>
                <div>
                  <p className="text-white font-medium text-sm">{f.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Code2 size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Code<span className="text-indigo-400">Sense</span> AI
            </h1>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl font-bold text-white">
              Code<span className="text-indigo-400">Sense</span> AI
            </h1>
            <p className="text-gray-400 mt-1">
              {isLogin ? 'Sign in to continue learning' : 'Create your free account'}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6">
            {['Sign In', 'Sign Up'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setIsLogin(i === 0)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${(isLogin ? 0 : 1) === i
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            className={`w-full flex items-center justify-center gap-3 font-medium py-3
              rounded-xl transition-all duration-200 mb-4 border text-sm
              ${GOOGLE_ENABLED
                ? 'bg-white hover:bg-gray-100 text-gray-900 border-gray-200'
                : 'bg-gray-900 text-gray-500 border-gray-800 cursor-not-allowed'
              }`}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill={GOOGLE_ENABLED ? '#4285F4' : '#6b7280'} d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill={GOOGLE_ENABLED ? '#34A853' : '#6b7280'} d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill={GOOGLE_ENABLED ? '#FBBC05' : '#6b7280'} d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
              <path fill={GOOGLE_ENABLED ? '#EA4335' : '#6b7280'} d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            {GOOGLE_ENABLED ? 'Continue with Google' : 'Google login coming soon'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-500">or continue with email</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3
                    text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500
                    focus:ring-1 focus:ring-indigo-500 transition text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3
                  text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500
                  focus:ring-1 focus:ring-indigo-500 transition text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-gray-400">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3
                    text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500
                    focus:ring-1 focus:ring-indigo-500 transition text-sm pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500
                    hover:text-gray-300 text-xs px-1 transition-colors"
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-600 mt-1.5">Minimum 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50
                disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl
                transition-all duration-200 text-sm mt-2"
            >
              {loading
                ? 'Please wait...'
                : isLogin ? 'Sign In' : 'Create Account'
              }
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            By continuing, you agree to our{' '}
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">
              Terms
            </span>
            {' '}and{' '}
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </span>
          </p>

        </div>
      </div>
    </div>
  )
}