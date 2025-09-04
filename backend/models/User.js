const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  otp: {type: String},
  otpExpiry: {type : Date},
});
userSchema.pre("save", function (next) {
  if (this.otp && this.otp.expiresAt && this.otp.expiresAt < new Date()) {
    this.otp = undefined;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
