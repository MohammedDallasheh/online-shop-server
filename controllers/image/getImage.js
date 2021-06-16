const { getImage } = require('../../services/image');

const getImageController = async (req, res, next) => {
  try {
    const { _id, role } = req.user || {};
    const { imageId } = req.params;

    const image = await getImage({ imageId, userId: _id, role });
    if (!image) throw 405;

    res.set('Content-Type', image?.contentType).send(image.data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getImage: getImageController };
