const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const DisplaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    items: [
      {
        // ref: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel',
        // },
      },
    ],
    onModel: {
      type: String,
      required: true,
      enum: ['product', 'user', 'category'],
    },
  },
  { timestamps: true }
);
DisplaySchema.plugin(mongoosePaginate);

module.exports = Display = mongoose.model('display', DisplaySchema);
