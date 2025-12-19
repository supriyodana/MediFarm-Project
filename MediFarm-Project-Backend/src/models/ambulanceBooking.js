const mongoose = require("mongoose");

const ambulanceBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pickupLocation: String,
  destination: String,
  bookingType: { type: String, enum: ["instant", "prebook"] },
  bookingTime: Date,
  status: { type: String, default: "requested" }
}, { timestamps: true });

module.exports = mongoose.model("AmbulanceBooking", ambulanceBookingSchema);
