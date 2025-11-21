/* models/Transaction.js */
const { Schema, model } = require('mongoose');

const transactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, default: 'Transaction' },
    amount: { type: Number, default: 0 },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    month: { type: String, required: true }, // 'YYYY-MM'
  },
  { timestamps: true }
);

module.exports = model('Transaction', transactionSchema);
