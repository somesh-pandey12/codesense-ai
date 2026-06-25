import dotenv from 'dotenv'
dotenv.config()

import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value
          const avatar = profile.photos[0]?.value || ''

          let user = await User.findOneAndUpdate(
            { email },
            { googleId: profile.id, avatar },
            { new: true }
          )

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              googleId: profile.id,
              avatar,
              password: `google_${profile.id}`
            })
          }

          return done(null, user)
        } catch (err) {
          return done(err, null)
        }
      }
    )
  )
  console.log('Google OAuth initialized ✓')
} else {
  console.log('Google OAuth skipped — add GOOGLE_CLIENT_ID to .env')
}

export default passport