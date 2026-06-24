import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { Zap, Flame, Code2, ArrowRight } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, <span className="text-indigo-400">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-gray-400 mt-1">Aaj bhi code karo, skills badhao.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: <Zap size={20} className="text-indigo-400" />,  label: 'Total XP',     value: user?.xp || 0,     bg: 'bg-indigo-950 border-indigo-900' },
            { icon: <Flame size={20} className="text-orange-400" />, label: 'Day Streak',   value: user?.streak || 0, bg: 'bg-orange-950 border-orange-900' },
            { icon: <Code2 size={20} className="text-emerald-400" />,label: 'Problems Solved', value: user?.solvedProblems?.length || 0, bg: 'bg-emerald-950 border-emerald-900' },
          ].map(({ icon, label, value, bg }) => (
            <div key={label} className={`${bg} border rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-3">{icon}<span className="text-gray-400 text-sm">{label}</span></div>
              <p className="text-4xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link to="/problems"
          className="flex items-center justify-between bg-indigo-600 hover:bg-indigo-500
            transition-all rounded-2xl p-6 group">
          <div>
            <p className="text-white font-bold text-lg">Problems solve karo</p>
            <p className="text-indigo-200 text-sm mt-0.5">DSA practice karo, XP kamao</p>
          </div>
          <ArrowRight size={24} className="text-white group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}