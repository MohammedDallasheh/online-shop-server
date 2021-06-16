const Order = require('../../models/order');

const ordersStatuses = ({ filter }) =>
  new Promise(async (resolve, reject) => {
    try {
      let data = await Order.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$status.statusType',
            count: { $sum: 1 },
          },
        },
      ]);

      data = data.reduce(
        (prev, { _id, count }) => {
          prev[_id] = count;
          return prev;
        },
        { id: `statuses-${Date.now()}` }
      );

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });

module.exports = { ordersStatuses };
