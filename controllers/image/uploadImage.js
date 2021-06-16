const { createItem, updateItem } = require('../../services/data');

const {
  permissionFilter,
  itemToUpdateGenerator,
} = require('./imageUtils');

const uploadImageController = async (req, res, next) => {
  try {
    const { _id, role } = req.user;
    const { resource, resourceId, path } = req.params;

    const { buffer, mimetype = 'image/jpg', originalname } =
      req?.file || {};

    if (!buffer) throw 405;

    const imageToCreate = {
      userId: _id,
      name: originalname,
      alt: originalname,
      data: buffer,
      permission: 'public',
      contentType: mimetype,
    };

    const { item: image } = await createItem({
      resource: 'image',
      itemToCreate: imageToCreate,
    });
    let itemToUpdate = itemToUpdateGenerator(resource, path, {
      url: `/api/image/${image?._id}`,
      alt: image?.alt,
    });

    const item = await updateItem({
      resource,
      filter: {
        _id: resourceId,
        ...permissionFilter(resource, _id, role),
      },
      itemToUpdate,
    });

    res.send(item[path]);
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImage: uploadImageController };
