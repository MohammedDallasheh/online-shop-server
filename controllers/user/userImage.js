const {
  uploadImage,
  addImageToResource,
} = require('../../services/image');

const uploadUserImgController = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { buffer, mimetype, originalname } = req?.file || {};
    if (!buffer) throw 405;

    const { url, alt } = await uploadImage({
      userId: _id,
      name: originalname,
      alt: originalname,
      data: buffer,
      contentType: mimetype,
    });

    const { imgs } = await addImageToResource({
      resource: 'user',
      filter: { _id },
      path: 'imgs',
      img: { url, alt },
    });

    res.send(imgs);
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadUserImg: uploadUserImgController };
