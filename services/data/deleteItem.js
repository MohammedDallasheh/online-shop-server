const { modelSwitch } = require('../../utils/modelSwitch');

const deleteItem = ({ resource, filter }) =>
  new Promise(async (resolve, reject) => {
    try {
      const model = modelSwitch(resource);

      const item = await model.findOneAndDelete(filter);

      if (!item) throw { code: 405 };

      item.id = item._id;

      resolve(item);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { deleteItem };
