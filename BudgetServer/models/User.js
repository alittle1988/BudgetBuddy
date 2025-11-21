/* models/User.js */
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
