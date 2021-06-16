const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const { jwtSign } = require('../jwt');

const signIn = ({ email, password, socialLogin = true }) =>
  new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({ email });
      if (!user) throw { code: 400 };

      const { isActive, isLock, _id, name, role, avatar } = user;

      if (!isActive) throw { code: 401 };

      if (isLock && new Date(isLock) - Date.now() < 0) {
        user.isLock = false;
        await user.save();
      }
      if (user.isLock) throw { code: 402, date: isLock };

      if (!socialLogin) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw { code: 400 };
      }

      const payload = { user: { _id, name, role, avatar } };
      const token = await jwtSign(payload);
      resolve(token);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { signIn };
