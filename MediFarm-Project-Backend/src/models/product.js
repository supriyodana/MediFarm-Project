const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  med_id: { type: String, unique: true },
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  image: String
}, { timestamps: true });

productSchema.pre("save", function () {
  if (this.med_id && String(this.med_id).trim() !== "") return;
  this.med_id = `MED${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`;
});

module.exports = mongoose.model("Product", productSchema);
