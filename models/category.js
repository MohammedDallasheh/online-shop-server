const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CategorySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      trim: true,
      required: 'Name is required',
      // minlength: [2, 'Too short'],
      // maxlength: [32, 'Too long'],
    },
    description: {
      type: String,
    },
    title: {
      type: String,
    },
    img: {
      url: String,
      alt: String,
    },
  },
  { timestamps: true }
);
CategorySchema.plugin(mongoosePaginate);

module.exports = Category = mongoose.model(
  'category',
  CategorySchema
);
