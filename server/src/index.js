import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import authRoutes from './routes/auth.js'
import problemRoutes from './routes/problems.js'
import submissionRoutes from './routes/submissions.js'
import passport from './config/passport.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/problems', problemRoutes)
app.use('/api/submissions', submissionRoutes)
app.use(passport.initialize())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeSense API running' })
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch(err => console.error(err))