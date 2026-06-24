import express from 'express'
import jwt from 'jsonwebtoken'
import passport from '../config/passport.js'
import { register, login, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

const googleEnabled =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET

// Email / Password
router.post('/register', register)
router.post('/login',    login)
router.get('/me',        protect, getMe)

// Google OAuth — only register if credentials exist
if (googleEnabled) {
  router.get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false
    })
  )

  router.get('/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${process.env.CLIENT_URL}/auth?error=google_failed`
    }),
    (req, res) => {
      const token = signToken(req.user._id)
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`)
    }
  )
} else {
  // Placeholder routes jab credentials nahi hain
  router.get('/google', (req, res) => {
    res.status(503).json({
      message: 'Google OAuth not configured. Add GOOGLE_CLIENT_ID to .env'
    })
  })

  router.get('/google/callback', (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/auth?error=google_not_configured`)
  })
}

export default router