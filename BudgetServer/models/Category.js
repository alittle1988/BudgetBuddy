/* models/Category.js */
const { Schema, model } = require('mongoose');

const categorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    budget: { type: Number, default: 0 },
    month: { type: String, required: true }, // 'YYYY-MM'
  },
  { timestamps: true }
);

module.exports = model('Category', categorySchema);
