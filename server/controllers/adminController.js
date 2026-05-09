const User = require("../models/User");
const Record = require("../models/Record");
const PointLog = require("../models/PointLog");

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const keyword = req.query.keyword || "";
    const skip = (page - 1) * limit;

    const query = keyword
      ? { $or: [{ username: { $regex: keyword, $options: "i" } }, { email: { $regex: keyword, $options: "i" } }] }
      : {};

    const users = await User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await User.countDocuments(query);

    res.json({ data: users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ message: "获取用户列表失败" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, email, points, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) { return res.status(404).json({ message: "用户不存在" }); }

    if (username) user.username = username;
    if (email) user.email = email;
    if (points !== undefined) user.points = points;
    if (role) user.role = role;
    await user.save();

    res.json({ message: "更新成功", data: { id: user._id, username: user.username, email: user.email, points: user.points, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "更新失败" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) { return res.status(404).json({ message: "用户不存在" }); }
    await Record.deleteMany({ userId: req.params.id });
    await PointLog.deleteMany({ userId: req.params.id });
    res.json({ message: "删除成功" });
  } catch (error) {
    res.status(500).json({ message: "删除失败" });
  }
};

exports.toggleBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) { return res.status(404).json({ message: "用户不存在" }); }
    user.banned = !user.banned;
    await user.save();
    res.json({ message: user.banned ? "已封禁" : "已解封", banned: user.banned });
  } catch (error) {
    res.status(500).json({ message: "操作失败" });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const recordCount = await Record.countDocuments();
    const totalPoints = await Record.aggregate([{ $group: { _id: null, total: { $sum: "$pointsCost" } } }]);
    const totalWords = await Record.aggregate([{ $group: { _id: null, total: { $sum: "$wordCount" } } }]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRecords = await Record.countDocuments({ createdAt: { $gte: today } });

    res.json({
      userCount,
      recordCount,
      totalPointsConsumed: totalPoints[0]?.total || 0,
      totalWordsProcessed: totalWords[0]?.total || 0,
      todayRecords
    });
  } catch (error) {
    res.status(500).json({ message: "获取统计失败" });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const records = await Record.find().populate("userId", "username email").sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Record.countDocuments();

    res.json({ data: records, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ message: "获取记录失败" });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) { return res.status(404).json({ message: "记录不存在" }); }
    res.json({ message: "删除成功" });
  } catch (error) {
    res.status(500).json({ message: "删除失败" });
  }
};