const {
  addProductIdToList,
  getProductList,
  deleteProductList,
  deleteFromProductList,
} = require('../../services/user/userList');

const checkListName = (req) => {
  const validListNames = ['lastViewed', 'wishlist'];
  const { listName } = req.params;
  if (validListNames.includes(listName)) return true;

  throw { code: 1, customMessage: 'Not valid list name' };
  // return new Error({ code: 1, customMessage: 'Not valid list name' });
};

const addToListController = async (req, res, next) => {
  try {
    checkListName(req);
    const { _id: userId } = req.user;
    const { productId, listName } = req.params;

    const user = await addProductIdToList({
      userId,
      productId,
      listName,
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const getListController = async (req, res, next) => {
  try {
    checkListName(req);

    const { _id: userId } = req.user;
    const { listName } = req.params;

    const userList = await getProductList({ userId, listName });

    res.json(userList);
  } catch (err) {
    next(err);
  }
};
const deleteListController = async (req, res, next) => {
  try {
    checkListName(req);
    const { _id: userId } = req.user;
    const { listName } = req.params;

    const userList = await deleteProductList({ userId, listName });

    res.json(userList);
  } catch (err) {
    next(err);
  }
};

const deleteFromListController = async (req, res, next) => {
  try {
    checkListName(req);

    const { _id: userId } = req.user;
    const { productId, listName } = req.params;

    const userList = await deleteFromProductList({
      userId,
      productId,
      listName,
    });

    res.json(userList);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addTOUserList: addToListController,
  getUserList: getListController,
  deleteUserList: deleteListController,
  deleteFromUserList: deleteFromListController,
};
