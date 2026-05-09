require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const paperRoutes = require("./routes/paper");
const pointsRoutes = require("./routes/points");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/paper", paperRoutes);
app.use("/api/points", pointsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "服务器内部错误" });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
});