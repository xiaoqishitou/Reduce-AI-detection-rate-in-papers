const mongoose = require("mongoose");

const pointLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["recharge", "consume", "gift"], required: true },
  amount: { type: Number, required: true },
  balance: { type: Number, required: true },
  description: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("PointLog", pointLogSchema);