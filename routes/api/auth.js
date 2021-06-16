const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check } = require('express-validator');

const { auth } = require('../../middleware/auth');
const {
  getUserByToken,
  signIn,
  signUp,
  passportSignIn,
} = require('../../controllers/auth');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, getUserByToken);

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  [
    // check('email', 'Please include a valid email').isEmail(),
    // check('password', 'Password is required').exists(),
  ],
  signIn
);

// @route    POST api/auth/signup
// @desc     Register user
// @access   Public
router.post(
  '/signup',
  [
    // check('name', 'Name is required').not().isEmpty(),
    // check('email', 'Please include a valid email').isEmail(),
    // check(
    //   'password',
    //   'Please enter a password with 6 or more characters'
    // ).isLength({ min: 6 }),
  ],
  signUp
);

//********* Social media login ********** */

router.get(
  '/facebook/privacy-policy',
  passport.authenticate('facebook')
);
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile'],
  })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    // successRedirect: 'http://localhost:3000',
    failureRedirect: '/login',
  }),
  passportSignIn
);
// router.get(
//   '/facebook/callback',
//   passport.authenticate('facebook', {
//     successRedirect: 'http://localhost:3000/',
//     failureRedirect: '/login',
//   }),
//   (req, res) => {
//     const htmlWithEmbeddedJWT = `
//     <html>
//       <script>
//         // Save JWT to localStorage
//         window.localStorage.setItem('lalal', 'mammaa');
//         // Redirect browser to root of application
//         window.location.href = '/auth/success';
//       </script>
//     </html>
//     `;
//     res.send(htmlWithEmbeddedJWT);
//   }
// );

module.exports = router;
