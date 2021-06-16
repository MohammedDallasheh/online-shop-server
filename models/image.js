const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const imageSchema = new Schema(
  {
    name: String,
    description: String,
    alt: String,
    data: Buffer,
    permission: { type: String, enum: ['private', 'public'] },
    userId: { type: ObjectId, ref: 'user' },
    usersId: [{ type: ObjectId, ref: 'user' }],
    contentType: String,
  },
  { timestamps: true }
);

module.exports = Image = mongoose.model('image', imageSchema);
