const Image = require('../../models/image');

const getImage = ({ imageId, userId, role }) =>
  new Promise(async (resolve, reject) => {
    try {
      let filter = {
        $or: [
          { _id: imageId, permission: 'public' },
          { _id: imageId, usersId: userId },
        ],
      };

      if (role === 'admin') filter = { _id: imageId };

      const image = await Image.findOne(filter);

      if (!image) throw 405;

      resolve(image);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { getImage };
