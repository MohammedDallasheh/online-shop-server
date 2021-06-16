const User = require('../../models/user');

const updateCart = ({ userId, cart }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) throw 406;
      user.cart = cart;

      await user.save();
      resolve(user);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { updateCart };
