const getImage = require('./getImage');
const uploadImage = require('./uploadImage');
const deleteImage = require('./deleteImage');
const addImageToResource = require('./addImageToResource');

module.exports = {
  ...getImage,
  ...uploadImage,
  ...deleteImage,
  ...addImageToResource,
};
