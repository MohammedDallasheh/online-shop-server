const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();

passport.serializeUser(function (user, done) {
  console.log('serializeUser');
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  console.log('deserializeUser');
  done(null, user);
});
console.log(process.env.FACEBOOK_APP_ID);
console.log(process.env.FACEBOOK_APP_SECRET);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
      profileFields: [
        'id',
        'displayName',
        'name',
        'emails',
        'picture.type(large)',
      ],
    },
    function (accessToken, refreshToken, profile, done) {
      console.log('FacebookStrategy', profile);
      return done(null, profile);
    }
  )
);
