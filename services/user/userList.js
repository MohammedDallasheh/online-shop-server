const User = require("../../models/user");

const addProductIdToList = ({ userId, productId, listName }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);

      if (!user) throw 405;

      const checkIfExist = user[listName].some((id) => productId == id);

      if (checkIfExist) return resolve(user);

      user[listName].unshift(productId);

      if (user[listName].length > 20) user[listName].pop();

      await user.save();
      resolve(user);
    } catch (err) {
      reject(err);
    }
  });

const getProductList = ({ userId, listName }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId).populate(
        listName,
        "_id price offer rate stock title  tags imgs description"
      );

      if (!user) throw 405;

      resolve(user[listName]);
    } catch (err) {
      reject(err);
    }
  });
const deleteProductList = ({ userId, listName }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);

      if (!user) throw 405;

      user[listName] = [];
      await user.save();

      resolve(user[listName]);
    } catch (err) {
      reject(err);
    }
  });
const deleteFromProductList = ({ userId, productId, listName }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);

      if (!user) throw 405;

      user[listName] = user[listName].filter((id) => id != productId);
      await user.save();

      resolve(user[listName]);
    } catch (err) {
      reject(err);
    }
  });

module.exports = {
  addProductIdToList,
  getProductList,
  deleteProductList,
  deleteFromProductList,
};
