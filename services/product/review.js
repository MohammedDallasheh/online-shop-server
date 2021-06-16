const Product = require('../../models/Product');

const addReview = ({ productId, user, text }) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ _id: productId });

      product.reviews.unshift({
        user: user._id,
        text,
      });

      await product.save();

      product.reviews[0].user = {
        name: user.name,
        avatar: user.avatar,
        _id: user._id,
      };

      resolve(product);
    } catch (err) {
      reject(err);
    }
  });
const deleteReview = ({ productId, commentId, userId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const filter = {
        _id: productId,
        'reviews._id': commentId,
      };
      const pullObj = { $pull: { reviews: { _id: commentId } } };

      if (userId) {
        filter['reviews.user'] = userId;
        pullObj['$pull'].reviews.user = userId;
      }

      const product = await Product.findOneAndUpdate(
        filter,
        pullObj,
        { new: true }
      ).populate('reviews.user', 'name avatar');

      if (!product) throw 405; //not found

      resolve(product);

      /******************************************* */

      // const product = await Product.findOne(filter);
      // if (!product) throw 405; //not found

      // const reviews = product.reviews.filter((review) => {
      //   if (
      //     userId &&
      //     review._id == commentId &&
      //     review.user._id != userId
      //   )
      //     throw 407; //permission denied

      //   return review._id != commentId;
      // });

      // if (!product) throw 405; //not found

      // product.reviews = reviews;

      // await product.save();

      // resolve(product);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { addReview, deleteReview };
