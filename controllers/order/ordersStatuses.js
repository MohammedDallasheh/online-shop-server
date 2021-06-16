const mongoose = require('mongoose');
const {
  ordersStatuses,
} = require('../../services/order/ordersStatuses');

const ordersStatusesController = async (req, res, next) => {
  const { _id: userId } = req.user;
  try {
    const filter = {};
    if (req.user.role == 'subscriber')
      filter.buyerId = mongoose.Types.ObjectId(userId);
    if (req.user.role == 'seller')
      filter.sellerId = mongoose.Types.ObjectId(userId);

    const data = await ordersStatuses({ filter });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  ordersStatuses: ordersStatusesController,
};
