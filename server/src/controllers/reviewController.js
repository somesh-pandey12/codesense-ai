import Problem from '../models/Problem.js'
import { reviewCode } from '../services/aiReview.js'

export const getAIReview = async (req, res) => {
  try {
    const { problemId, code, language } = req.body

    if (!problemId || !code || !language)
      return res.status(400).json({ message: 'problemId, code, language required' })

    if (!process.env.GROQ_API_KEY)
      return res.status(503).json({ message: 'AI review not configured — add GROQ_API_KEY to .env' })

    const problem = await Problem.findById(problemId)
    if (!problem)
      return res.status(404).json({ message: 'Problem not found' })

    const review = await reviewCode({
      code,
      language,
      problemTitle:       problem.title,
      problemDescription: problem.description
    })

    res.json({ review })
  } catch (err) {
    console.error('Review controller error:', err)
    res.status(500).json({ message: err.message })
  }
}