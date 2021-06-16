const { deleteImage } = require('../../services/image');

const { permissionFilter, isPathArray } = require('./imageUtils');

const deleteImageController = async (req, res, next) => {
  try {
    const { _id, role } = req.user;
    const { resource, resourceId, path, imgId } = req.params;

    const deletedImg = await deleteImage({
      resource,
      resourceId,
      path,
      imgId,
      permissionFilter: permissionFilter(resource, _id, role),
      isPathArray: isPathArray(resource, path),
    });

    res.json(deletedImg);
  } catch (err) {
    next(err);
  }
};

module.exports = { deleteImage: deleteImageController };
