require('dotenv').config();
const { validationResult } = require('express-validator');

const { errorHandler } = require('../../utils/errorHandler');
const { signUp } = require('../../services/auth');

const signUpController = async (req, res, next) => {
  const errors = validationResult(req);
  let prameters = ['fName', 'lName', 'password', 'address', 'email'];

  try {
    if (!errors.isEmpty()) throw { code: 400, error: errors.array() };

    //convert prameters to Object
    prameters = prameters.reduce((all, curr) => {
      if (!req.body[curr]) throw { code: 404 };
      all[curr] = req.body[curr];
      return all;
    }, {});

    let token = await signUp(prameters);
    res.json({ token });
  } catch (err) {
    next(err);

    // errorHandler(res, err);
  }
};

module.exports = { signUp: signUpController };
