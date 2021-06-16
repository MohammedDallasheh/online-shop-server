const { modelSwitch } = require('../../utils/modelSwitch');

const addImageToResource = ({ resource, filter, data }) =>
  new Promise(async (resolve, reject) => {
    try {
      const model = modelSwitch(resource);

      const item = await model.findOneAndUpdate(filter, data, {
        new: true,
      });

      if (!item) throw 405;

      resolve(item);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { addImageToResource };
