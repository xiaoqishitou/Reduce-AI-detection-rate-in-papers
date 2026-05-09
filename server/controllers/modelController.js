const Model = require("../models/Model");

exports.getModels = async (req, res) => {
  try {
    const models = await Model.find().sort({ isDefault: -1, createdAt: -1 });
    res.json({ data: models });
  } catch (error) {
    res.status(500).json({ message: "获取模型列表失败" });
  }
};

exports.createModel = async (req, res) => {
  try {
    const { name, baseURL, apiKey, modelName, temperature, maxTokens, isDefault } = req.body;
    if (!name || !baseURL || !apiKey || !modelName) {
      return res.status(400).json({ message: "请填写必填字段" });
    }

    if (isDefault) {
      await Model.updateMany({}, { isDefault: false });
    }

    const model = new Model({ name, baseURL, apiKey, modelName, temperature, maxTokens, isDefault });
    await model.save();
    res.status(201).json({ message: "添加成功", data: model });
  } catch (error) {
    res.status(500).json({ message: "添加失败" });
  }
};

exports.updateModel = async (req, res) => {
  try {
    const { name, baseURL, apiKey, modelName, temperature, maxTokens, isDefault, enabled } = req.body;
    const model = await Model.findById(req.params.id);
    if (!model) { return res.status(404).json({ message: "模型不存在" }); }

    if (isDefault) {
      await Model.updateMany({}, { isDefault: false });
    }

    if (name) model.name = name;
    if (baseURL) model.baseURL = baseURL;
    if (apiKey) model.apiKey = apiKey;
    if (modelName) model.modelName = modelName;
    if (temperature !== undefined) model.temperature = temperature;
    if (maxTokens !== undefined) model.maxTokens = maxTokens;
    if (isDefault !== undefined) model.isDefault = isDefault;
    if (enabled !== undefined) model.enabled = enabled;
    await model.save();

    res.json({ message: "更新成功", data: model });
  } catch (error) {
    res.status(500).json({ message: "更新失败" });
  }
};

exports.deleteModel = async (req, res) => {
  try {
    const model = await Model.findByIdAndDelete(req.params.id);
    if (!model) { return res.status(404).json({ message: "模型不存在" }); }
    res.json({ message: "删除成功" });
  } catch (error) {
    res.status(500).json({ message: "删除失败" });
  }
};