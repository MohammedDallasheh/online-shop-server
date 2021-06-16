const { modelSwitch } = require('../../utils/modelSwitch');

const Image = require('../../models/image');

const deleteImage = ({
  resource,
  resourceId,
  path,
  imgId,
  permissionFilter,
  isPathArray,
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const model = modelSwitch(resource);

      const item = await model.findOneAndUpdate(
        {
          _id: resourceId,
          ...permissionFilter,
        },
        isPathArray
          ? { $pull: { [path]: { _id: imgId } } }
          : { [path]: undefined }
      );
      if (!item) throw 405;

      const { url } = isPathArray
        ? item[path].find(({ _id }) => _id == imgId)
        : item[path];

      const imgDeleteId = url?.split('/')?.pop();

      if (imgDeleteId?.match(/^[0-9a-fA-F]{24}$/))
        await Image.findOneAndDelete({ _id: imgDeleteId });

      resolve(item);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { deleteImage };
