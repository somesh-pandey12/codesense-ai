import Contest from '../models/Contest.js'
import Problem from '../models/Problem.js'

// Saare contests
export const getContests = async (req, res) => {
  try {
    const now = new Date()

    // Status auto-update karo
    await Contest.updateMany(
      { startTime: { $lte: now }, endTime: { $gt: now }, status: 'upcoming' },
      { status: 'live' }
    )
    await Contest.updateMany(
      { endTime: { $lte: now }, status: { $ne: 'ended' } },
      { status: 'ended' }
    )

    const contests = await Contest.find()
      .select('-participants.solvedProblems')
      .sort({ startTime: -1 })

    const enriched = contests.map(c => ({
      ...c.toObject(),
      participantCount: c.participants.length,
      isRegistered: c.participants.some(
        p => p.user.toString() === req.user._id.toString()
      )
    }))

    res.json({ contests: enriched })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Single contest
export const getContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('problems.problem', 'title slug difficulty xpReward tags')

    if (!contest) return res.status(404).json({ message: 'Contest not found' })

    const isRegistered = contest.participants.some(
      p => p.user.toString() === req.user._id.toString()
    )

    // Agar ended nahi toh problems hide karo
    const now = new Date()
    const safeContest = contest.toObject()
    if (contest.status === 'upcoming' && !isRegistered) {
      safeContest.problems = []
    }

    res.json({ contest: safeContest, isRegistered })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Register karo
export const registerContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
    if (!contest) return res.status(404).json({ message: 'Contest not found' })

    if (contest.status === 'ended')
      return res.status(400).json({ message: 'Contest already ended' })

    const alreadyRegistered = contest.participants.some(
      p => p.user.toString() === req.user._id.toString()
    )
    if (alreadyRegistered)
      return res.status(400).json({ message: 'Already registered' })

    contest.participants.push({ user: req.user._id })
    await contest.save()

    res.json({ message: 'Registered successfully!' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Contest submission
export const contestSubmit = async (req, res) => {
  try {
    const { problemId, status, points } = req.body
    const contest = await Contest.findById(req.params.id)

    if (!contest) return res.status(404).json({ message: 'Contest not found' })
    if (contest.status !== 'live')
      return res.status(400).json({ message: 'Contest is not live' })

    const participant = contest.participants.find(
      p => p.user.toString() === req.user._id.toString()
    )
    if (!participant)
      return res.status(400).json({ message: 'Register first' })

    // Check if already solved
    const alreadySolved = participant.solvedProblems.find(
      s => s.problem.toString() === problemId && s.points > 0
    )

    if (status === 'Accepted' && !alreadySolved) {
      // Score add karo
      participant.score += points || 100
      participant.solvedProblems.push({
        problem: problemId,
        solvedAt: new Date(),
        points: points || 100,
        attempts: 1
      })
    } else if (!alreadySolved) {
      // Attempt count badhao
      const existing = participant.solvedProblems.find(
        s => s.problem.toString() === problemId
      )
      if (existing) {
        existing.attempts += 1
      } else {
        participant.solvedProblems.push({
          problem: problemId,
          points: 0,
          attempts: 1
        })
      }
    }

    // Rankings update karo
    contest.participants.sort((a, b) => b.score - a.score)
    contest.participants.forEach((p, i) => { p.rank = i + 1 })

    await contest.save()
    res.json({ message: 'Submission recorded', score: participant.score })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Leaderboard
export const getContestLeaderboard = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('participants.user', 'name avatar')
      .populate('participants.solvedProblems.problem', 'title')

    if (!contest) return res.status(404).json({ message: 'Contest not found' })

    const leaderboard = contest.participants
      .sort((a, b) => b.score - a.score)
      .slice(0, 100)
      .map((p, i) => ({
        rank: i + 1,
        user: p.user,
        score: p.score,
        solved: p.solvedProblems.filter(s => s.points > 0).length,
        isCurrentUser: p.user._id.toString() === req.user._id.toString()
      }))

    res.json({ leaderboard })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Seed sunday contests
export const seedContests = async (req, res) => {
  try {
    const problems = await Problem.find().limit(6)

    const now = new Date()
    const nextSunday = new Date(now)
    nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7 || 7)
    nextSunday.setHours(10, 0, 0, 0)

    const endSunday = new Date(nextSunday)
    endSunday.setHours(12, 0, 0, 0)

    await Contest.deleteMany({})

    await Contest.insertMany([
      {
        title: 'CodeSense Weekly #1',
        description: 'First weekly contest! Solve DSA problems and climb the leaderboard. Problems range from Easy to Hard.',
        startTime: nextSunday,
        endTime: endSunday,
        duration: 120,
        status: 'upcoming',
        problems: problems.slice(0, 4).map((p, i) => ({
          problem: p._id,
          points: [100, 100, 200, 300][i],
          order: i + 1
        }))
      },
      {
        title: 'Arrays & Strings Blitz',
        description: 'A fast-paced contest focused on Array and String manipulation problems.',
        startTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        endTime: new Date(Date.now() + 1000 * 60 * 60),   // 1 hour from now
        duration: 120,
        status: 'live',
        problems: problems.slice(0, 3).map((p, i) => ({
          problem: p._id,
          points: [100, 200, 300][i],
          order: i + 1
        }))
      },
      {
        title: 'Beginner Friendly Cup',
        description: 'A contest for beginners with Easy and Medium problems only.',
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
        endTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
        duration: 120,
        status: 'ended',
        problems: problems.slice(0, 3).map((p, i) => ({
          problem: p._id,
          points: [100, 100, 200][i],
          order: i + 1
        }))
      }
    ])

    res.json({ message: '3 contests created!' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}