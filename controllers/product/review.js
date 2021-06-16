const {
  addReview,
  deleteReview,
} = require('../../services/product/review');

const addReviewController = async (req, res, next) => {
  const user = req.user;
  const { productId } = req.params;
  const { text } = req.body;
  try {
    if (!text) throw 460;
    const product = await addReview({ productId, user, text });

    res.json(product);
  } catch (err) {
    next(err);
  }
};

const deleteReviewController = async (req, res, next) => {
  let { _id: userId, role } = req.user;
  const { productId, commentId } = req.params;
  try {
    if (role === 'admin') userId = undefined;

    const product = await deleteReview({
      productId,
      commentId,
      userId,
    });

    res.json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addReview: addReviewController,
  deleteReview: deleteReviewController,
};
