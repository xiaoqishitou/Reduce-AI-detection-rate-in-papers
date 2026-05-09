const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "未登录，请先登录" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "用户不存在" });
    }
    if (user.banned) {
      return res.status(403).json({ message: "账号已被封禁" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: "认证失败，请重新登录" });
  }
};

module.exports = auth;