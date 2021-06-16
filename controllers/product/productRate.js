const { updateRate } = require('../../services/product/productRate');

const addRateController = async (req, res, next) => {
  const { _id: userId, role } = req.user;
  const { productId, rate } = req.params;
  try {
    if (!(rate <= 5 && rate >= 0))
      throw { code: 410, parameter: 'Rate' };

    const product = await updateRate({
      userId,
      productId,
      rate,
      isAdmin: role === 'admin',
    });

    res.json(product);
  } catch (err) {
    next(err);
  }
};
const deleteRateController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { productId } = req.params;

  try {
    const product = await updateRate({
      userId,
      productId,
    });

    res.json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addRate: addRateController,
  deleteRate: deleteRateController,
};
