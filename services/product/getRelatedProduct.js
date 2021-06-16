const Product = require('../../models/Product');
const getRelatedProduct = (id) =>
  new Promise(async (resolve, reject) => {
    const select =
      '_id price offer stock rate title description imgs category';
    try {
      let { relatedProduct } = await Product.findById(
        id,
        'relatedProduct'
      ).populate('relatedProduct', select);

      // if (!relatedProduct?.length) {
      //   relatedProduct = await Product.find({}, select).limit(5);
      // }

      resolve(relatedProduct);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { getRelatedProduct };
