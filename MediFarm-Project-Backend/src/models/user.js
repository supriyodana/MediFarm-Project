const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const addressSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  phone: String,
  isDefault: {
    type: Boolean,
    default: false
  }
}, { _id: false });


const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role:
  {
    type: String,
    enum: ["user"],
    default: "user"
  },
  addresses: {type: addressSchema, default: undefined},
}, { timestamps: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);
