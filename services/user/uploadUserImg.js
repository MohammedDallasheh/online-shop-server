const User = require('../../models/user');

const uploadUserImg = ({ userId, img }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            imgs: { data: img, alt: 'alt', contentType: 'image/jpg' },
          },
        },
        { new: true }
      );

      if (!user) throw 405;

      resolve(user);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { uploadUserImg };
