require('dotenv').config();
const { validationResult } = require('express-validator');

const { signIn } = require('../../services/auth');
const { stringify } = require('querystring');
const passportSignInController = async (req, res, next) => {
  const { name, emails, photos } = req?.user || {};
  const email = emails?.[0]?.value;
  console.log(req?.user);
  try {
    if (!email)
      return res.redirect(
        `http://localhost:3000/SignInProvider?error=Email Not Valid`
      );
    let token = await signIn({ email, socialLogin: true });

    res.redirect(
      `http://localhost:3000/SignInProvider?token=${token}`
    );
  } catch (err) {
    try {
      if (err.code !== 400) throw err;
      const { givenName, familyName } = name || {};
      const avatar = photos?.[0]?.value;

      res.redirect(
        `http://localhost:3000/sign/up?fName=${givenName}&lName=${familyName}&email=${email}&avatar=${avatar}}`
      );
      // res.redirect(
      //   `http://localhost:3000/signup?fName=${givenName}&lName=${familyName}&email=${email}&avatar=${avatar}}`
      // );
    } catch (err2) {
      next(err2);
    }
  }
};

module.exports = { passportSignIn: passportSignInController };
