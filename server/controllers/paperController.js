const Record = require("../models/Record");
const User = require("../models/User");
const PointLog = require("../models/PointLog");
const { ruleEngineRewrite } = require("../services/ruleEngine");
const { aiRewrite } = require("../services/aiRewrite");
const { calculateAiScore } = require("../services/aiScore");

function countWords(text) {
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const english = (text.match(/[a-zA-Z]+/g) || []).length;
  return chinese + english;
}

exports.rewrite = async (req, res) => {
  try {
    const { text, method = "hybrid" } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "请输入需要改写的文本" });
    }
    const wordCount = countWords(text);
    let pointsCost = 0;
    if (method === "rule") { pointsCost = Math.ceil(wordCount / 100) * 2; }
    else if (method === "ai") { pointsCost = Math.ceil(wordCount / 100) * 10; }
    else { pointsCost = Math.ceil(wordCount / 100) * 12; }

    if (req.user.points < pointsCost) {
      return res.status(400).json({ message: "积分不足，请充值", required: pointsCost, current: req.user.points });
    }

    let rewrittenText = text;
    if (method === "rule" || method === "hybrid") { rewrittenText = ruleEngineRewrite(rewrittenText); }
    if (method === "ai" || method === "hybrid") {
      try { rewrittenText = await aiRewrite(rewrittenText); }
      catch (aiError) { if (method === "ai") { return res.status(500).json({ message: aiError.message }); } }
    }

    const aiScoreBefore = calculateAiScore(text);
    const aiScoreAfter = calculateAiScore(rewrittenText);
    const user = await User.findById(req.user._id);
    user.points -= pointsCost;
    await user.save();
    const pointLog = new PointLog({ userId: user._id, type: "consume", amount: -pointsCost, balance: user.points, description: "论文改写 - " + wordCount + "字 - " + method });
    await pointLog.save();
    const record = new Record({ userId: user._id, originalText: text, rewrittenText, wordCount, pointsCost, aiScoreBefore, aiScoreAfter, method });
    await record.save();

    res.json({ message: "改写成功", data: { id: record._id, originalText: text, rewrittenText, wordCount, pointsCost, aiScoreBefore, aiScoreAfter, method, remainingPoints: user.points } });
  } catch (error) {
    res.status(500).json({ message: "改写失败: " + error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const records = await Record.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit).select("-originalText -rewrittenText");
    const total = await Record.countDocuments({ userId: req.user._id });
    res.json({ data: records, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ message: "获取历史记录失败" });
  }
};

exports.getHistoryDetail = async (req, res) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, userId: req.user._id });
    if (!record) { return res.status(404).json({ message: "记录不存在" }); }
    res.json({ data: record });
  } catch (error) {
    res.status(500).json({ message: "获取详情失败" });
  }
};

exports.deleteHistory = async (req, res) => {
  try {
    const record = await Record.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!record) { return res.status(404).json({ message: "记录不存在" }); }
    res.json({ message: "删除成功" });
  } catch (error) {
    res.status(500).json({ message: "删除失败" });
  }
};