const { updateCart } = require('../../services/user/updateCart');

const updateCartController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const cart = req.body;

  try {
    const user = await updateCart({ userId, cart });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { updateCart: updateCartController };
