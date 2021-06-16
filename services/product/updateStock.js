const Product = require('../../models/Product');
const Order = require('../../models/order');

const updateStock = (cart, orderId, buyerId) =>
  new Promise(async (resolve, reject) => {
    try {
      let products = await Product.find({
        _id: { $in: cart.map(({ productId }) => productId) },
      });

      if (products.length != cart.length) throw 405;

      products.forEach((product) => {
        const cartItem = cart.find(
          ({ productId }) => product._id == productId
        );
        product.stock -= cartItem.quantity;
        product.orders.push({ orderId, buyerId });
        if (product.stock < 0)
          throw { code: 409, title: product.title };
      });

      await Promise.all(products.map((product) => product.save()));

      resolve(products);
    } catch (err) {
      await Order.deleteOne({ _id: orderId });
      reject(err);
    }
  });

module.exports = { updateStock };
