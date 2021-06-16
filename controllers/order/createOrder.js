const { createItem } = require('../../services/data/createItem');
const { updateStock } = require('../../services/product/updateStock');
const {
  updateCartAfterNewOrder,
} = require('../../services/user/updateCartAfterNewOrder');

const checkPayment = (payment) => true;

const createOrderController = async (req, res, next) => {
  const { payment, products, sellerId, address } = req.body;
  const { _id: buyerId, role } = req.user;

  try {
    if (!payment || !products || !sellerId) throw 404;
    if (!checkPayment(payment)) throw 408;

    if (role !== 'subscriber') throw { code: 413, role };

    const orderToCreate = {
      sellerId,
      buyerId,
      products,
      payment: {
        paymentType: payment.paymentMethod,
        amount: payment.totalAmount,
      },
      address,
    };

    const { item, header } = await createItem({
      resource: 'order',
      itemToCreate: orderToCreate,
    });

    await updateStock(products, item._id, buyerId);

    const cart = await updateCartAfterNewOrder(
      buyerId,
      products?.map(({ productId }) => productId)
    );

    // res.set(...header).json(item);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder: createOrderController };
