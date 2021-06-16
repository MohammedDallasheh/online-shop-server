// const User = require('../../models/user');
const { modelSwitch } = require('../../utils/modelSwitch');

const createItem = ({ resource, itemToCreate }) =>
  new Promise(async (resolve, reject) => {
    try {
      const model = modelSwitch(resource);

      console.log({ itemToCreate });
      let newItem = new model(itemToCreate);

      await newItem.save();

      newItem = newItem.toObject();
      newItem.id = newItem._id;

      // await User.deleteFromCartBySeller(
      //   newItem.buyerId,
      //   itemToCreate.products?.map(({ productId }) => productId)
      // );
      resolve({
        item: newItem,
        header: ['Location', `/${resource}/${newItem._id}`],
      });
    } catch (err) {
      reject(err);
    }
  });

module.exports = { createItem };
