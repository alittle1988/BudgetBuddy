/* models/Income.js */
const { Schema, model } = require('mongoose');

const incomeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, default: 'Income' },
    amount: { type: Number, default: 0 },
    category: {
      type: String,
      enum: ['Tips', 'Checks', 'Other'],
      default: 'Other',
    },
    hoursWorked: { type: Number, default: null },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    month: { type: String, required: true }, // 'YYYY-MM'
  },
  { timestamps: true }
);

module.exports = model('Income', incomeSchema);
