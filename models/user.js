const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const enums = {
  role: ['admin', 'seller', 'subscriber'],
  messageType: ['general', 'report', 'afterOrder', 'beforeOrder'],
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        required: true,
      },
      last: {
        type: String,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'subscriber',
      enum: enums.role,
    },
    cart: [
      {
        product: { type: ObjectId, ref: 'product' },
        sellerId: { type: ObjectId, ref: 'user' },
        quantity: { type: Number, default: 1 },
      },
    ],
    wishlist: [{ type: ObjectId, ref: 'product' }],
    lastViewed: [{ type: ObjectId, ref: 'product' }],
    avatar: {
      url: String,
      alt: String,
    },
    // avatar: {
    //   type: String,
    // },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    imgs: [
      {
        url: String,
        alt: String,
      },
    ],
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isLock: {},
    messages: [
      {
        from: { type: ObjectId, ref: 'user' },
        to: [{ type: ObjectId, ref: 'user' }],
        subject: String,
        body: String,
        messageType: {
          type: String,
          default: 'general',
          enum: enums.messageType,
        },
        unread: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    registered: {
      type: Date,
      default: Date.now,
    },
  },
  { selectPopulatedPaths: false }
);

async function deleteFromCartBySeller(userID, products) {
  const user = await this.findById(userID);
  user.cart = user.cart.filter(
    ({ product }) => !products.includes(product + '')
  );
  await user.save();

  return this.populate(user, { path: 'cart.product' });
}

UserSchema.statics.deleteFromCartBySeller = deleteFromCartBySeller;

UserSchema.plugin(mongoosePaginate);
module.exports = User = mongoose.model('user', UserSchema);
