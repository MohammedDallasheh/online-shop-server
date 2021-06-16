require('dotenv').config();
const { validationResult } = require('express-validator');

const { signIn } = require('../../services/auth');

const signInController = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) throw { code: 400, error: errors.array() };

    let token = await signIn({ email, password });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = { signIn: signInController };
