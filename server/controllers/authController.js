const User = require("../models/User");
const PointLog = require("../models/PointLog");
const { generateToken } = require("../utils/token");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "请填写所有必填字段" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "密码长度不能少于6位" });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "用户名或邮箱已被注册" });
    }
    const user = new User({ username, email, password });
    await user.save();
    const pointLog = new PointLog({ userId: user._id, type: "gift", amount: 100, balance: 100, description: "新用户注册赠送" });
    await pointLog.save();
    const token = generateToken(user._id);
    res.status(201).json({ message: "注册成功", token, user: { id: user._id, username: user.username, email: user.email, points: user.points, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "注册失败: " + error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "请输入邮箱和密码" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "邮箱或密码错误" });
    }
    if (user.banned) {
      return res.status(403).json({ message: "账号已被封禁" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "邮箱或密码错误" });
    }
    const token = generateToken(user._id);
    res.json({ message: "登录成功", token, user: { id: user._id, username: user.username, email: user.email, points: user.points, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "登录失败: " + error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    res.json({ user: { id: req.user._id, username: req.user.username, email: req.user.email, points: req.user.points, role: req.user.role, createdAt: req.user.createdAt } });
  } catch (error) {
    res.status(500).json({ message: "获取信息失败" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "请输入旧密码和新密码" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "新密码长度不能少于6位" });
    }
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "旧密码错误" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "密码修改成功" });
  } catch (error) {
    res.status(500).json({ message: "修改密码失败" });
  }
};