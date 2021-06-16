const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const subSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Name is required',
      // minlength: [2, 'Too short'],
      // maxlength: [32, 'Too long'],
    },
    // parent: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'category',
    //   required: true,
    // },
    description: {
      type: String,
    },
    title: {
      type: String,
    },
    imgs: [
      {
        url: String,
        alt: String,
      },
    ],
  },
  { timestamps: true }
);
subSchema.plugin(mongoosePaginate);

module.exports = Sub = mongoose.model('Sub', subSchema);
