const { modelSwitch } = require('../../utils/modelSwitch');

const loadItem = ({ resource, filter, select }) =>
  new Promise(async (resolve, reject) => {
    try {
      const model = modelSwitch(resource);
      const item = await model.findOne(filter, select, {
        lean: true,
      });

      if (!item) throw { code: 405 };
      item.id = item._id;

      resolve(item);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { loadItem };
