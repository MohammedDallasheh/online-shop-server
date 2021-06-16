const bcrypt = require('bcryptjs');
const normalize = require('normalize-url');
const gravatar = require('gravatar');
const moment = require('moment');

const User = require('../../models/user');
const { jwtSign } = require('../jwt');

const signUp = ({ fName, lName, password, address, email }) =>
  new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({ email });
      if (user) throw { code: 403 };

      const avatar = normalize(
        gravatar.url(email, { s: '200', r: 'pg', d: 'mm' }),
        { forceHttps: true }
      );

      user = new User({
        password,
        address,
        email,
        name: { first: fName, last: lName },
        avatar,
        isLock: false,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      const { _id, name, role } = user;
      const payload = { user: { _id, name, role } };
      const token = await jwtSign(payload);

      resolve(token);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { signUp };
