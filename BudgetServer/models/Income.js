/* models/Income.js */
const { Schema, model } = require('mongoose');

const incomeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, default: 'Income' },
    amount: { type: Number, default: 0 },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    month: { type: String, required: true }, // 'YYYY-MM'
  },
  { timestamps: true }
);

module.exports = model('Income', incomeSchema);
