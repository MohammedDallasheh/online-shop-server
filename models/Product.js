const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ProductSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: 'user',
      autopopulate: { select: 'name' },
    },
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    offer: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
    },
    description: {
      type: String,
    },
    imgs: [
      {
        url: String,
        alt: String,
      },
    ],
    category: {
      type: ObjectId,
      // type: Number,
      ref: 'category',
    },
    subs: [
      {
        type: ObjectId,
        // type: Number,
        ref: 'sub',
      },
    ],
    tags: [
      {
        name: {
          type: String,
          // enum: ["Sales", "Specials", "Hot", "Trends", "New"],
        },
        createAt: { type: Date, default: Date.now() },
        // untilDate: { type: Date, default: Date.now() },
      },
    ],
    relatedProduct: [
      {
        type: ObjectId,
        ref: 'product',
      },
    ],
    orders: [
      {
        orderId: { type: ObjectId, ref: 'order' },
        buyerId: { type: ObjectId, ref: 'user' },
        rate: {
          type: Number,
          enum: [0, 1, 2, 3, 4, 5],
        },
        createdAt: { type: Date, default: Date.now() },
      },
    ],
    reviews: [
      {
        user: { type: ObjectId, ref: 'user' },
        createdAt: { type: Date, default: Date.now() },
        text: String,
      },
    ],
  },
  { selectPopulatedPaths: false }
);

const autoPopulate = function (next) {
  this.populate('reviews.user', 'name avatar');
  next();
};

ProductSchema.pre('findOne', autoPopulate).pre('find', autoPopulate);

ProductSchema.plugin(mongoosePaginate);
module.exports = Product = mongoose.model('product', ProductSchema);
