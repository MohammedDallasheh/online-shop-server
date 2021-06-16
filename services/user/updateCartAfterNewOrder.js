const User = require('../../models/user');

const updateCartAfterNewOrder = (userId, products) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.deleteFromCartBySeller(
        userId,
        products
      );
      resolve(user.cart);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { updateCartAfterNewOrder };
