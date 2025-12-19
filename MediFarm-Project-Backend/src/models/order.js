const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [{
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
    quantity: Number
  }],
  totalAmount: Number,
  status: { type: String, default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
