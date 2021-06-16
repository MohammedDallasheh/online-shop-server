const express = require('express');
const router = express.Router();

const { auth } = require('../../middleware/auth');

const {
  getOrder,
  getOrders,
  getOrderSeller,
  getOrdersSeller,
  getOrderAdmin,
  getOrdersAdmin,
  // createOrder,
  createOrderSeller,
  updateOrder,
  updateOrderAdmin,
  deleteOrder,
} = require('../../controllers/items');

const {
  ordersStatuses,
} = require('../../controllers/order/ordersStatuses');
const {
  createOrder,
} = require('../../controllers/order/createOrder');
const {
  updateStatus,
} = require('../../controllers/order/updateOrderStatus');

//Get Orders
router.get('/', auth, (req, res, next) => {
  const { role } = req.user;
  if (role == 'admin') return getOrdersAdmin(req, res, next);
  if (role == 'seller') return getOrdersSeller(req, res, next);
  return getOrders(req, res, next);
});

//Get order by id
router.get('/:id', auth, (req, res, next) => {
  const { role } = req.user;
  if (role == 'admin') return getOrderAdmin(req, res, next);
  if (role == 'seller') return getOrderSeller(req, res, next);
  return getOrder(req, res, next);
});

//Create new order
router.post('/', auth, createOrder);
// //Create new order
// router.post('/', auth, (req, res, next) => {
//   const { role } = req.user;
//   if (role == 'admin' || role == 'seller')
//     return createOrderSeller(req, res, next);
//   return createOrder(req, res, next);
// });

// //Update new order
// router.put('/:id', auth, (req, res, next) => {
//   const { role } = req.user;
//   if (role == 'admin') return updateOrderAdmin(req, res, next);
//   return updateOrder(req, res, next);
// });
//Update new order
router.put('/:id', auth, updateStatus);

//Delete  order
router.delete('/:id', auth, deleteOrder);
router.get('/info/statuses', auth, ordersStatuses);

module.exports = router;
