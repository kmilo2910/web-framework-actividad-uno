import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export function configureGoogleOAuth(authService) {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try { done(null, await authService.findUserById(id)); } catch (error) { done(error); }
  });

  const configured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  if (!configured) return false;

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback'
  }, async (_accessToken, _refreshToken, profile, done) => {
    try { done(null, await authService.findOrCreateGoogleUser(profile)); } catch (error) { done(error); }
  }));
  return true;
}
