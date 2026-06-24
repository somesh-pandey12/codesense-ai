import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function AuthCallback() {
  const [params]   = useSearchParams()
  const navigate   = useNavigate()
  const { setUserFromToken } = useAuth()

  useEffect(() => {
    const token = params.get('token')
    const error = params.get('error')

    if (error || !token) {
      navigate('/auth?error=true')
      return
    }

    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    axios.get('/auth/me')
      .then(res => {
        setUserFromToken(res.data.user)
        navigate('/dashboard')
      })
      .catch(() => navigate('/auth'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent
          rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Signing you in...</p>
      </div>
    </div>
  )
}