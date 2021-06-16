const { permissionCheck } = require('../../utils/permissionCheck');
const { updateStatus } = require('../../services/order/updateStatus');
const { sendMessage } = require('../../services/user/message');

const updateOrderController = async (req, res, next) => {
  const { _id: userId, role } = req.user;
  const { status } = req.body;
  const { id: OrderId } = req.params;
  try {
    if (!userId || !status) throw 404;
    permissionCheck(['admin', 'seller'], role);

    const filter = { _id: OrderId };
    if (role != 'admin') filter.sellerId = userId;

    const order = await updateStatus({ filter, status });

    sendMessage({
      userId: order.sellerId,
      to: [order.buyerId],
      message: {
        subject: `Order status updated- ${order._id}`,
        body: `The status of the order ${order._id}  has been updated to - ${order.status?.statusType}\n Date: ${order.status.createdAt}`,
        messageType: 'afterOrder',
      },
    });

    res.json(order);
  } catch (err) {
    next(err);
  }
};
module.exports = { updateStatus: updateOrderController };
