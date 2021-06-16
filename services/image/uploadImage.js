const Image = require('../../models/image');

const uploadImage = ({
  userId,
  name,
  description,
  alt,
  data,
  permission = 'public',
  contentType = 'image/jpg',
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const image = new Image({
        name,
        description,
        alt,
        data,
        permission,
        contentType,
        userId,
      });

      if (permission === 'private') image.usersId = [userId];

      await image.save();

      resolve({ url: `/api/image/${image._id}`, alt });
    } catch (err) {
      reject(err);
    }
  });

module.exports = { uploadImage };
