require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Model = require("../models/Model");

async function init() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      const admin = new User({
        username: "admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        points: 99999
      });
      await admin.save();
      console.log("Admin created: admin@example.com / admin123");
    } else {
      console.log("Admin already exists");
    }

    const existingModel = await Model.findOne({ isDefault: true });
    if (!existingModel) {
      const model = new Model({
        name: "小米MiMo",
        baseURL: "https://token-plan-cn.xiaomimimo.com/v1",
        apiKey: "your-api-key-here",
        modelName: "mimo-v2.5-pro",
        temperature: 0.85,
        maxTokens: 4096,
        isDefault: true,
        enabled: true
      });
      await model.save();
      console.log("Default MiMo model created");
    } else {
      console.log("Default model already exists");
    }

    console.log("Init complete!");
    process.exit(0);
  } catch (error) {
    console.error("Init failed:", error.message);
    process.exit(1);
  }
}

init();