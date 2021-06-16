const {
  getRandomFromArray,
  getRandomSubArrayUniq,
  getRandomSubArray,
  getRandomDate,
  getTwoDates,
  getNumber,
  newFaker,
} = require('./newFaker');
const { modelSwitch } = require('../../utils/modelSwitch');

const fakePic = require('./fakePics.json');
const { models } = require('mongoose');

const generateOrders = async (IDs) => {
  let [buyerId, sellerId] = [0, 0];

  const status = [
    'Not Processed',
    'Processing',
    'Cancelled',
    'Completed',
    'Shippeng',
    'Arrive',
  ];
  const statusGenerator = () => ({
    statusType: getRandomFromArray(status),
    createdAt: getRandomDate(),
  });
  try {
    const { userIDs, orderIDs } = IDs;
    const Model = modelSwitch('order');

    return await Promise.all(
      orderIDs.map(async (_id) => {
        const [createdAt, updatedAt] = getTwoDates();
        buyerId = getRandomFromArray(userIDs.subscriber);
        sellerId = getRandomFromArray(userIDs.seller);

        return await new Model({
          _id,
          buyerId,
          sellerId,
          address: newFaker.address(),
          products: [],
          status: statusGenerator(),
          statusHistory: Array.from({ length: getNumber(0, 4) }, () =>
            statusGenerator()
          ),
          createdAt,
          updatedAt,
        }).save();
      })
    );
  } catch (err) {
    return err;
  }
};

const updateOrders = async () => {
  let [totalPrice, randomQnt] = [0, 0];

  const payment = [
    'Cash',
    'Credit Card',
    'BTC',
    'Debit Card',
    'PayPal',
  ];

  try {
    let orders = await modelSwitch('order').find({});
    let products = await modelSwitch('product').find({});

    orders = orders.map(async (order) => {
      totalPrice = 0;

      getRandomSubArrayUniq(products, getNumber(1, 7)).map(
        async (product) => {
          randomQnt = getNumber(
            0,
            product.stock > 10 ? 10 : product.stock
          );

          product.stock -= randomQnt;
          product.sold += randomQnt;

          if (product.stock < 20 && newFaker.boolean())
            product.stock += 40;

          let rate = newFaker.boolean() ? getNumber(0, 4) : undefined;

          if (Math.random() < 0.2) rate = 5;

          if (rate && newFaker.boolean()) {
            product.reviews.push({
              user: order.buyerId,
              text: newFaker.sentence(),
              createdAt: getRandomDate(order.createdAt),
            });
          }
          product.orders.push({
            orderId: order._id,
            buyerId: order.buyerId,
            rate,
            createdAt: order.createdAt,
          });
          totalPrice += randomQnt * (product.offer || product.price);

          order.products.push({
            productId: product._id,
            quantity: randomQnt,
          });
        }
      );

      order.payment = {
        paymentType: getRandomFromArray(payment),
        amount: totalPrice,
      };

      return await order.save();
    });

    return await Promise.all([
      Promise.all(products.map(async (p) => await p.save())),
      Promise.all(orders),
    ]);
  } catch (err) {
    return err;
  }
};

module.exports = { generateOrders, updateOrders };
