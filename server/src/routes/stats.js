import express from 'express'
import User from '../models/User.js'
import Submission from '../models/Submission.js'
import Problem from '../models/Problem.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('solvedProblems', 'title difficulty xpReward slug')

    // Recent submissions
    const recentSubmissions = await Submission.find({ user: req.user._id })
      .populate('problem', 'title slug difficulty')
      .sort({ createdAt: -1 })
      .limit(5)

    // Total problems count
    const totalProblems = await Problem.countDocuments()

    // Difficulty breakdown
    const easyProblems   = await Problem.countDocuments({ difficulty: 'Easy' })
    const mediumProblems = await Problem.countDocuments({ difficulty: 'Medium' })
    const hardProblems   = await Problem.countDocuments({ difficulty: 'Hard' })

    const solvedEasy   = user.solvedProblems.filter(p => p.difficulty === 'Easy').length
    const solvedMedium = user.solvedProblems.filter(p => p.difficulty === 'Medium').length
    const solvedHard   = user.solvedProblems.filter(p => p.difficulty === 'Hard').length

    // User rank
    const usersAhead = await User.countDocuments({ xp: { $gt: user.xp } })
    const rank = usersAhead + 1

    res.json({
      user: {
        name:    user.name,
        avatar:  user.avatar,
        xp:      user.xp,
        streak:  user.streak,
        rank,
        joinedAt: user.createdAt
      },
      problems: {
        total:   totalProblems,
        solved:  user.solvedProblems.length,
        easy:    { total: easyProblems,   solved: solvedEasy   },
        medium:  { total: mediumProblems, solved: solvedMedium },
        hard:    { total: hardProblems,   solved: solvedHard   },
      },
      recentSubmissions,
      solvedProblems: user.solvedProblems
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router