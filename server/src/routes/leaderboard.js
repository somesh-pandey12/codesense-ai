import express from 'express'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({})
      .select('name avatar xp solvedProblems streak createdAt')
      .sort({ xp: -1 })
      .limit(50)

    const leaderboard = users.map((user, index) => ({
      rank:           index + 1,
      id:             user._id,
      name:           user.name,
      avatar:         user.avatar,
      xp:             user.xp,
      solved:         user.solvedProblems.length,
      streak:         user.streak,
      joinedAt:       user.createdAt,
      isCurrentUser:  user._id.toString() === req.user._id.toString()
    }))

    res.json({ leaderboard })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router