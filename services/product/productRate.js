const Product = require('../../models/Product');
const Order = require('../../models/order');

const updateRate = ({ userId, productId, rate, isAdmin }) =>
  new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: productId,
        'orders.buyerId': userId,
      });

      if (!product) throw 405;

      const newRate = updateProductRate(product.orders, userId, rate);

      product.rate = newRate;

      await product.save();

      resolve(product);
    } catch (err) {
      reject(err);
    }
  });

const updateProductRate = (orders, userId, rate) => {
  let totalRate = 0;
  let count = 0;

  orders.forEach((order) => {
    if (order.buyerId.toString() === userId.toString())
      order.rate = rate;
    if (order.rate >= 0) {
      totalRate += order.rate;
      count++;
    }
  });
  const newRate = totalRate / (count || 1);
  return newRate;
};

module.exports = { updateRate };
