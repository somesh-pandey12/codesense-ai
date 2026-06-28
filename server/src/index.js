import dotenv from 'dotenv'
dotenv.config()
console.log('GROQ_API_KEY loaded:', process.env.GROQ_API_KEY ? 'YES ✓' : 'NO ✗')

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import passport from './config/passport.js'
import authRoutes from './routes/auth.js'
import problemRoutes from './routes/problems.js'
import submissionRoutes from './routes/submissions.js'
import reviewRoutes from './routes/review.js'
import leaderboardRoutes from './routes/leaderboard.js'
import statsRoutes from './routes/stats.js'
import contestRoutes from './routes/contests.js'
import profileRoutes from './routes/profile.js'


const app = express()

console.log('GOOGLE_CLIENT_ID loaded:',     process.env.GOOGLE_CLIENT_ID     ? 'YES ✓' : 'NO ✗')
console.log('GOOGLE_CLIENT_SECRET loaded:', process.env.GOOGLE_CLIENT_SECRET ? 'YES ✓' : 'NO ✗')

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(passport.initialize())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeSense API running' })
})
app.use('/api/auth',        authRoutes)
app.use('/api/problems',    problemRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/contests', contestRoutes)
app.use('/api/profile', profileRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch(err => console.error('DB Error:', err))