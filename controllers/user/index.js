const userLists = require('./userLists');
const updateCart = require('./updateCart');
const userImage = require('./userImage');
const message = require('./message');

module.exports = {
  ...userLists,
  ...updateCart,
  ...userImage,
  ...message,
};
