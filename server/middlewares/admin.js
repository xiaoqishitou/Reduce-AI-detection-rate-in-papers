const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "未登录" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "用户不存在" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "无管理员权限" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "认证失败" });
  }
};

module.exports = adminAuth;