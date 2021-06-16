const {
  getRelatedProduct,
} = require('../../services/product/getRelatedProduct');

const getRelatedProductController = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await getRelatedProduct(id);

    res.json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = { getRelatedProduct: getRelatedProductController };
