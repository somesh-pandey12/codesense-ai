import express from 'express'
import User from '../models/User.js'
import Submission from '../models/Submission.js'
import Problem from '../models/Problem.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/:userId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('solvedProblems', 'title slug difficulty xpReward tags')

    if (!user) return res.status(404).json({ message: 'User not found' })

    // Recent submissions
    const recentSubmissions = await Submission.find({ user: user._id })
      .populate('problem', 'title slug difficulty')
      .sort({ createdAt: -1 })
      .limit(10)

    // Total problems
    const totalProblems = await Problem.countDocuments()

    // Rank
    const usersAhead = await User.countDocuments({ xp: { $gt: user.xp } })
    const rank = usersAhead + 1

    // Activity heatmap — last 52 weeks
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const allSubmissions = await Submission.find({
      user: user._id,
      createdAt: { $gte: oneYearAgo }
    }).select('createdAt status')

    // Group by date
    const activityMap = {}
    allSubmissions.forEach(s => {
      const date = new Date(s.createdAt).toISOString().split('T')[0]
      if (!activityMap[date]) activityMap[date] = { total: 0, accepted: 0 }
      activityMap[date].total++
      if (s.status === 'Accepted') activityMap[date].accepted++
    })

    // Difficulty breakdown
    const solvedEasy   = user.solvedProblems.filter(p => p.difficulty === 'Easy').length
    const solvedMedium = user.solvedProblems.filter(p => p.difficulty === 'Medium').length
    const solvedHard   = user.solvedProblems.filter(p => p.difficulty === 'Hard').length

    // Badges calculate karo
    const badges = []
    if (user.solvedProblems.length >= 1)   badges.push({ id: 'first_solve',  name: 'First Solve',   emoji: '🎯', desc: 'Solved your first problem' })
    if (user.solvedProblems.length >= 10)  badges.push({ id: 'ten_solver',   name: 'Problem Slayer', emoji: '⚔️', desc: 'Solved 10 problems' })
    if (user.solvedProblems.length >= 25)  badges.push({ id: 'grinder',      name: 'Grinder',        emoji: '💪', desc: 'Solved 25 problems' })
    if (user.xp >= 100)                    badges.push({ id: 'xp_100',       name: 'XP Hunter',      emoji: '⚡', desc: 'Earned 100 XP' })
    if (user.xp >= 500)                    badges.push({ id: 'xp_500',       name: 'XP Master',      emoji: '🌟', desc: 'Earned 500 XP' })
    if (user.streak >= 7)                  badges.push({ id: 'week_streak',  name: 'Week Warrior',   emoji: '🔥', desc: '7 day streak' })
    if (solvedHard >= 1)                   badges.push({ id: 'hard_solver',  name: 'Hard Mode',      emoji: '💎', desc: 'Solved a Hard problem' })
    if (rank <= 10)                        badges.push({ id: 'top_10',       name: 'Top 10',         emoji: '🏆', desc: 'Top 10 globally' })

    res.json({
      user: {
        id:       user._id,
        name:     user.name,
        avatar:   user.avatar,
        xp:       user.xp,
        streak:   user.streak,
        rank,
        joinedAt: user.createdAt,
        isOwnProfile: user._id.toString() === req.user._id.toString()
      },
      stats: {
        totalSolved:   user.solvedProblems.length,
        totalProblems,
        solvedEasy,
        solvedMedium,
        solvedHard,
        totalSubmissions: allSubmissions.length,
        acceptedSubmissions: allSubmissions.filter(s => s.status === 'Accepted').length,
      },
      badges,
      recentSubmissions,
      activityMap,
      solvedProblems: user.solvedProblems
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router