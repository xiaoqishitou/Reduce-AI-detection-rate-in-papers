const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  originalText: { type: String, required: true },
  rewrittenText: { type: String, required: true },
  wordCount: { type: Number, required: true },
  pointsCost: { type: Number, required: true },
  aiScoreBefore: { type: Number, default: 0 },
  aiScoreAfter: { type: Number, default: 0 },
  method: { type: String, enum: ["rule", "ai", "hybrid"], default: "hybrid" }
}, { timestamps: true });

module.exports = mongoose.model("Record", recordSchema);