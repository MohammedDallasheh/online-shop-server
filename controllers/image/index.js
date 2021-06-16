const deleteImage = require('./deleteImage');
const getImage = require('./getImage');
const uploadImage = require('./uploadImage');

module.exports = {
  ...deleteImage,
  ...getImage,
  ...uploadImage,
};
