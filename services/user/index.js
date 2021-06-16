const userList = require('./userList');
const updateCart = require('./updateCart');
const message = require('./message');
const updateCartAfterNewOrder = require('./updateCartAfterNewOrder');
const uploadUserImg = require('./uploadUserImg');

module.exports = {
  ...userList,
  ...updateCart,
  ...message,
  ...updateCartAfterNewOrder,
  ...uploadUserImg,
};
