import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';
import { Patient } from '../models/Patient';

// Serialize user ID into session
passport.serializeUser((user: any, done) => {
  console.log('🔐 Serializing user:', user._id || user.id);
  done(null, user._id || user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    console.log('🔓 Deserializing user:', id);
    const user = await User.findById(id).lean();
    if (!user) {
      console.error('❌ User not found during deserialization:', id);
      return done(null, false);
    }
    console.log('✅ User deserialized successfully');
    done(null, user as any);
  } catch (error) {
    console.error('❌ Error deserializing user:', error);
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: "/api/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      console.log('🔍 Google OAuth callback received for:', profile.emails?.[0]?.value);
      
      // Check if user already exists with Google ID
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        console.log('✅ Existing Google user found:', user.email);
        return done(null, user as any);
      }
      
      // Check if user exists with this email
      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await User.findOne({ email });
        
        if (user) {
          console.log('📧 User exists with email, linking Google account');
          // Link Google account to existing user
          user.googleId = profile.id;
          user.isVerified = true;
          await user.save();
          console.log('✅ Google account linked successfully');
          return done(null, user as any);
        }
      }
      
      // Create new user
      console.log('👤 Creating new user from Google profile');
      user = await User.create({
        googleId: profile.id,
        email: email || `${profile.id}@google.com`,
        firstName: profile.name?.givenName || 'User',
        lastName: profile.name?.familyName || '',
        role: 'PATIENT',
        isVerified: true,
        isActive: true
      });
      
      console.log('✅ New user created:', user.email);
      
      // Create patient profile
      await Patient.create({
        userId: user._id,
        dateOfBirth: new Date()
      });
      
      console.log('✅ Patient profile created');
      
      return done(null, user as any);
    } catch (error) {
      console.error('❌ Google OAuth error:', error);
      return done(error as Error, undefined);
    }
  }
));

console.log('✅ Passport Google OAuth strategy configured');
