const Order = require('../../models/order');

const updateOrderStatus = ({ filter, status }) =>
  new Promise(async (resolve, reject) => {
    try {
      const order = await Order.updateStatus(filter, status);

      // if (!order) throw 405;

      // await order.updateStatus(status);

      resolve(order);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { updateStatus: updateOrderStatus };
