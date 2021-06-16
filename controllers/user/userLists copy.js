const {
  addProductIdToList,
  getProductList,
  deleteProductList,
  deleteFromProductList,
} = require('../../services/user/userList');

const addToListController = (list) => async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { productId } = req.params;

    const user = await addProductIdToList({
      userId,
      productId,
      list,
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const getListController = (list) => async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const userList = await getProductList({ userId, list });

    res.json(userList);
  } catch (err) {
    next(err);
  }
};
const deleteListController = (list) => async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const userList = await deleteProductList({ userId, list });

    res.json(userList);
  } catch (err) {
    next(err);
  }
};

const deleteFromListController = (list) => async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { productId } = req.params;

    const userList = await deleteFromProductList({
      userId,
      productId,
      list,
    });

    res.json(userList);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  // addToLastViewed: addToListController('lastViewed'),
  // getLastViewed: getListController('lastViewed'),
  // deleteLastViewed: deleteListController('lastViewed'),
  // deleteFromLastViewed: deleteFromListController('lastViewed'),
  addToLastViewed: addToListController('wishlist'),
  getLastViewed: getListController('wishlist'),
  deleteLastViewed: deleteListController('wishlist'),
  deleteFromLastViewed: deleteFromListController('wishlist'),
  addToWishlist: addToListController('wishlist'),
  getWishlist: getListController('wishlist'),
  deleteWishlist: deleteListController('wishlist'),
  deleteFromWishlist: deleteFromListController('wishlist'),
};
