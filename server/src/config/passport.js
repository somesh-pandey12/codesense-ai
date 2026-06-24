import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value })

        if (user) {
          user.googleId = profile.id
          user.avatar   = profile.photos[0]?.value || ''
          await user.save()
          return done(null, user)
        }

        user = await User.create({
          name:     profile.displayName,
          email:    profile.emails[0].value,
          googleId: profile.id,
          avatar:   profile.photos[0]?.value || '',
          password: `google_${profile.id}_${Date.now()}`
        })

        return done(null, user)
      } catch (err) {
        return done(err, null)
      }
    }
  ))

  console.log('Google OAuth initialized')
} else {
  console.log('Google OAuth skipped — add GOOGLE_CLIENT_ID to .env')
}

export default passport