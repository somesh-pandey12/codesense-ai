import express from 'express'
import Problem from '../models/Problem.js'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const { difficulty, tag, search } = req.query
    let query = {}

    if (difficulty) query.difficulty = difficulty
    if (tag) query.tags = { $in: [tag] }
    if (search) query.title = { $regex: search, $options: 'i' }

    const problems = await Problem.find(query)
      .select('-testCases -starterCode')
      .sort({ createdAt: 1 })
    const solvedIds = req.user.solvedProblems.map(id => id.toString())

    const enriched = problems.map(p => ({
      ...p.toObject(),
      isSolved: solvedIds.includes(p._id.toString())
    }))

    res.json({ problems: enriched })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Problem stats — kitne % ne solve kiya
router.get('/:slug/stats', protect, async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug })
    if (!problem) return res.status(404).json({ message: 'Problem not found' })

    const totalUsers = await User.countDocuments()
    const acceptanceRate = problem.acceptanceRate || 0
    const solvedBy = problem.solvedBy || 0

    // Submissions data for chart
    const Submission = (await import('../models/Submission.js')).default
    const submissions = await Submission.find({ problem: problem._id })
      .select('status createdAt language')
      .sort({ createdAt: -1 })
      .limit(100)

    // Last 7 days activity
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        date: date.toDateString()
      }
    })

    const activityData = last7Days.map(({ day, date }) => ({
      day,
      submissions: submissions.filter(s =>
        new Date(s.createdAt).toDateString() === date
      ).length,
      accepted: submissions.filter(s =>
        new Date(s.createdAt).toDateString() === date && s.status === 'Accepted'
      ).length
    }))

    // Language distribution
    const langCount = {}
    submissions.forEach(s => {
      langCount[s.language] = (langCount[s.language] || 0) + 1
    })
    const languageData = Object.entries(langCount).map(([name, value]) => ({ name, value }))

    res.json({
      totalUsers,
      solvedBy,
      acceptanceRate,
      totalSubmissions: submissions.length,
      activityData,
      languageData
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Single problem
router.get('/:slug', protect, async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug })
    if (!problem) return res.status(404).json({ message: 'Problem nahi mili' })
    res.json({ problem })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router