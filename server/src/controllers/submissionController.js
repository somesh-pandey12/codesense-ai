import Problem    from '../models/Problem.js'
import Submission from '../models/Submission.js'
import User       from '../models/User.js'
import { runJavaScript } from '../services/codeRunner.js'

export const submitCode = async (req, res) => {
  try {
    const { problemId, code, language } = req.body

    if (!problemId || !code || !language)
      return res.status(400).json({ message: 'Sab fields chahiye' })

    const problem = await Problem.findById(problemId)
    if (!problem)
      return res.status(404).json({ message: 'Problem nahi mili' })
    if (language !== 'javascript')
      return res.status(400).json({ message: 'Abhi sirf JavaScript support hai' })
    const testResults = runJavaScript(code, problem.testCases)

    const passedTests = testResults.filter(t => t.passed).length
    const totalTests  = testResults.length
    const allPassed   = passedTests === totalTests
    const status      = allPassed ? 'Accepted' : 
                        testResults.some(t => t.error) ? 'Runtime Error' : 'Wrong Answer'
    const avgRuntime  = Math.round(
      testResults.reduce((sum, t) => sum + (t.runtime || 0), 0) / totalTests
    )

    let xpEarned = 0
    if (allPassed) {
      const alreadySolved = req.user.solvedProblems
        .map(id => id.toString())
        .includes(problem._id.toString())

      if (!alreadySolved) {
        xpEarned = problem.xpReward

        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { solvedProblems: problem._id },
          $inc: { xp: xpEarned },
          lastSolvedAt: new Date()
        })

        await Problem.findByIdAndUpdate(problem._id, {
          $inc: { solvedBy: 1 }
        })
      }
    }
    const submission = await Submission.create({
      user: req.user._id,
      problem: problem._id,
      code,
      language,
      status,
      passedTests,
      totalTests,
      runtime: avgRuntime,
      xpEarned,
      errorMessage: testResults.find(t => t.error)?.error || ''
    })

    const safeResults = testResults.map(t => ({
      passed:   t.passed,
      input:    t.hidden ? '🔒 Hidden' : t.input,
      expected: t.hidden ? '🔒 Hidden' : t.expected,
      actual:   t.hidden ? (t.passed ? '✓' : '✗') : t.actual,
      runtime:  t.runtime,
      error:    t.hidden ? undefined : t.error
    }))

    res.json({
      status,
      passedTests,
      totalTests,
      runtime: avgRuntime,
      xpEarned,
      testResults: safeResults,
      submissionId: submission._id
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const getSubmissions = async (req, res) => {
  try {
    const { problemId } = req.params
    const submissions = await Submission.find({
      user: req.user._id,
      problem: problemId
    }).sort({ createdAt: -1 }).limit(10)

    res.json({ submissions })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}