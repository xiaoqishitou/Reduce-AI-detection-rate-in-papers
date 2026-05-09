const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  baseURL: { type: String, required: true },
  apiKey: { type: String, required: true },
  modelName: { type: String, required: true },
  temperature: { type: Number, default: 0.85, min: 0, max: 2 },
  maxTokens: { type: Number, default: 4096 },
  isDefault: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Model", modelSchema);