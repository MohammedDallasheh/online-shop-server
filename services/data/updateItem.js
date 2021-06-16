const { modelSwitch } = require('../../utils/modelSwitch');

const updateItem = ({ resource, filter, itemToUpdate }) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log({ resource, filter, itemToUpdate });

      const model = modelSwitch(resource);
      const item = await model.findOneAndUpdate(
        filter,
        itemToUpdate,
        {
          new: true,
          omitUndefined: false,
          lean: true,
        }
      );

      if (!item) throw 405;
      item.id = item._id;
      resolve(item);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { updateItem };
