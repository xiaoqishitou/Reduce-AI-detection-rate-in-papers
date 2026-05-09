const OpenAI = require("openai");
const Model = require("../models/Model");

const SYSTEM_PROMPT = "你是一个专业的论文改写助手。你的任务是将给定的文本改写得更加人性化，降低被AI检测工具识别的概率。改写规则：1.保持原文的核心意思和学术准确性；2.改变句式结构，避免机械化的表达模式；3.使用同义词替换，但要确保语境准确；4.适当增加口语化表达和过渡词；5.调整段落长度和节奏；6.避免过于规律和整齐的句式；7.保留专业术语，但改变其周围的表达方式；8.让文本读起来更像是人类学者写的，而非AI生成的。";

async function getDefaultModel() {
  let model = await Model.findOne({ isDefault: true, enabled: true });
  if (!model) {
    model = await Model.findOne({ enabled: true });
  }
  if (!model) {
    throw new Error("没有可用的AI模型，请在后台管理中添加模型配置");
  }
  return model;
}

async function aiRewrite(text) {
  const modelConfig = await getDefaultModel();

  const openai = new OpenAI({
    apiKey: modelConfig.apiKey,
    baseURL: modelConfig.baseURL
  });

  try {
    const response = await openai.chat.completions.create({
      model: modelConfig.modelName,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: "请对以下学术文本进行人性化改写，降低其AI检测率。直接输出改写后的文本，不要添加任何解释：\n\n" + text }
      ],
      temperature: modelConfig.temperature || 0.85,
      max_tokens: modelConfig.maxTokens || 4096
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    if (error.status === 401) { throw new Error("API Key无效，请在后台检查模型配置"); }
    if (error.status === 429) { throw new Error("API调用频率超限，请稍后再试"); }
    throw new Error("AI改写服务出错: " + error.message);
  }
}

module.exports = { aiRewrite };