const User = require('../../models/user');

const getUser = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id)
        .select('-password -lastViewed')
        .populate({
          path: 'cart.product',
          select:
            '_id title price rate offer stock category imgs description user',
          populate: {
            path: 'category',
            select: '_id name',
          },
        })
        .populate({
          path: 'wishlist',
          select:
            '_id title price rate offer stock category imgs description user',
        })
        .populate({
          path: 'messages.to',
          select: 'name email avatar',
        })
        .populate({
          path: 'messages.from',
          select: 'name email avatar',
        });

      if (!user) throw { code: 400 };

      if (!user.avatar?.url) {
        user.avatar = {
          url: `https://ui-avatars.com/api/?name=${
            user?.name?.first
          }+${user?.name?.last}size=${25}x${25}`,
          alt: `${user?.name?.first} ${user?.name?.last} Avatar`,
        };
        user.save();
      }

      resolve(user);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { getUser };
