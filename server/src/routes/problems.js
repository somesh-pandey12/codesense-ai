import express from 'express'
import Problem from '../models/Problem.js'
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