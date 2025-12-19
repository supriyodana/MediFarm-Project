const mongoose = require("mongoose");

const bloodTestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  testType: String,
  appointmentDate: Date,
  status: { type: String, default: "booked" }
}, { timestamps: true });

module.exports = mongoose.model("BloodTestBooking", bloodTestSchema);
