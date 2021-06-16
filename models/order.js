const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const StatusSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  update: { type: Date },
  statusType: {
    type: String,
    default: 'Not Processed',
    enum: [
      'Not Processed',
      'Processing',
      'Cancelled',
      'Completed',
      'Shippeng',
      'Arrive',
    ],
  },
});

const OrderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    address: String,
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    payment: {
      paymentType: {
        type: String,
        enum: ['Cash', 'Credit Card', 'BTC', 'Debit Card', 'PayPal'],
      },
      amount: Number,
    },
    status: {
      type: StatusSchema,
      required: true,
      default: {
        createdAt: Date.now(),
        statusType: 'Not Processed',
      },
    },
    statusHistory: [StatusSchema],
  },
  { timestamps: true, selectPopulatedPaths: false }
);

OrderSchema.method.updateStatus = function (newStatus) {
  this.statusHistory.push(this.status);
  this.status = newStatus;
  return this.save();
};

OrderSchema.statics.updateStatus = async function (
  filter,
  newStatus
) {
  let order = await this.findOne(filter);
  if (!order) throw 405;
  order.statusHistory.push(order.status);
  order.status = newStatus;

  await order.save();
  order = order.toObject();
  order.id = order._id;
  return order;
};

// const autoPopulate = function (next) {
//   this.populate(
//     'products.productId',
//     '_id price offer stock rate title description imgs category'
//   );
//   next();
// };

// OrderSchema.pre('findOne', autoPopulate).pre('find', autoPopulate);

OrderSchema.plugin(mongoosePaginate);

module.exports = Order = mongoose.model('order', OrderSchema);
