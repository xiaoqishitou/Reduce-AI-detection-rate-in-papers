const User = require("../models/User");
const PointLog = require("../models/PointLog");

exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("points");
    res.json({ points: user.points });
  } catch (error) {
    res.status(500).json({ message: "获取积分失败" });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const logs = await PointLog.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await PointLog.countDocuments({ userId: req.user._id });
    res.json({ data: logs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ message: "获取积分记录失败" });
  }
};

exports.recharge = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0 || amount > 10000) {
      return res.status(400).json({ message: "充值金额无效（1-10000）" });
    }
    const user = await User.findById(req.user._id);
    user.points += amount;
    await user.save();
    const pointLog = new PointLog({ userId: user._id, type: "recharge", amount: amount, balance: user.points, description: "积分充值" });
    await pointLog.save();
    res.json({ message: "充值成功", points: user.points, rechargeAmount: amount });
  } catch (error) {
    res.status(500).json({ message: "充值失败" });
  }
};