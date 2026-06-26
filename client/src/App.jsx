import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Auth from './pages/Auth'
import Solve from './pages/Solve'
import Dashboard from './pages/Dashboard'
import Problems from './pages/Problems'
import AuthCallback from './pages/AuthCallback'
import Leaderboard from './pages/Leaderboard'
import Contests from './pages/Contests'
import ContestArena from './pages/ContestArena'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
  return user ? children : <Navigate to="/auth" />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1f2937', color: '#fff', border: '1px solid #374151' }
        }} />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/problems/:slug" element={<PrivateRoute><Solve /></PrivateRoute>} />
          <Route path="/problems" element={<PrivateRoute><Problems /></PrivateRoute>} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
          <Route path="/contests" element={<PrivateRoute><Contests /></PrivateRoute>} />
          <Route path="/contests/:id" element={<PrivateRoute><ContestArena /></PrivateRoute>} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <h1 className="text-2xl">Dashboard — aane wala hai! 🚀</h1>
              </div>
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App