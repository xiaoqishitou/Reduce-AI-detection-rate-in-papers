// AI文本检测 - 多维度评分算法 v2

// 扩展连接词列表
const CONNECTORS = [
  "因此", "然而", "此外", "总之", "首先", "其次", "最后", "另外", "同时", "不过",
  "而且", "但是", "所以", "因为", "如果", "虽然", "即使", "无论", "只要", "不仅",
  "相反", "况且", "何况", "于是", "因而", "故而", "从而", "进而", "乃至", "甚至",
  "否则", "不然", "要不然", "总而言之", "综上所述", "具体来说", "换言之", "也就是说",
  "事实上", "实际上", "显然", "毫无疑问", "不可否认", "众所周知", "不难发现",
  "值得一提", "值得注意", "需要指出", "由此可知", "据此", "依此", "基于此",
  "与此同时", "正因如此", "有鉴于此", "在此基础上", "进一步来说"
];

// 人称代词（低AI特征）
const PERSONAL_PRONOUNS = ["我", "我们", "咱们", "本人", "笔者", "自己", "你", "你们"];

// 口语化表达（低AI特征）
const COLLOQUIAL = [
  "其实", "说白了", "反正", "总之", "你看", "想想", "说到底", "归根结底",
  "差不多", "大概", "怎么说呢", "说实话", "老实说", "坦白讲",
  "简单来说", "通俗地说", "打个比方", "就好比", "说实在的",
  "你知道吗", "话说回来", "别提了", "算了吧", "行了行了"
];

// 复杂学术词（高AI特征）
const ACADEMIC_WORDS = [
  "鉴于", "综上", "由此可知", "不难发现", "显而易见", "毋庸置疑", "由此可见",
  "总而言之", "概而论之", "从本质上", "从宏观角度", "在一定程度上", "不可否认",
  "需要强调", "需要指出", "从某种意义上", "就目前而言", "从根本上说",
  "从某种角度", "就其本质", "从深层次", "客观而言", "总体而言"
];

// AI常用句式模板
const AI_PATTERNS = [
  /随着.*的不断发展/,
  /在.*方面/,
  /不仅.*而且/,
  /一方面.*另一方面/,
  /从.*角度来看/,
  /在.*的背景下/,
  /基于.*的考虑/,
  /就.*而言/,
  /在.*的过程中/,
  /通过.*的方式/
];

// 计算变异系数
function coefficientOfVariation(arr) {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
  if (mean === 0) return 0;
  const variance = arr.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / arr.length;
  return Math.sqrt(variance) / mean;
}

// 计算TTR
function calculateTTR(text) {
  const words = text.match(/[\u4e00-\u9fa5a-zA-Z]+/g) || [];
  if (words.length === 0) return 1;
  const unique = new Set(words);
  return unique.size / words.length;
}

// 维度1: 句子长度均匀度 (15分)
function sentenceLengthScore(sentences) {
  if (sentences.length < 3) return 0;
  const lengths = sentences.map(s => s.length);
  const cv = coefficientOfVariation(lengths);
  if (cv < 0.25) return 15;
  if (cv < 0.4) return 12;
  if (cv < 0.6) return 8;
  if (cv < 0.8) return 4;
  return 0;
}

// 维度2: 连接词密度 (15分)
function connectorScore(text, sentenceCount) {
  if (sentenceCount === 0) return 0;
  let count = 0;
  for (const c of CONNECTORS) {
    const matches = text.match(new RegExp(c, "g"));
    if (matches) count += matches.length;
  }
  const ratio = count / sentenceCount;
  if (ratio > 0.6) return 15;
  if (ratio > 0.4) return 12;
  if (ratio > 0.2) return 8;
  if (ratio > 0.1) return 4;
  return 0;
}

// 维度3: 词汇丰富度 (12分)
function vocabularyScore(text) {
  const ttr = calculateTTR(text);
  if (ttr < 0.35) return 12;
  if (ttr < 0.45) return 9;
  if (ttr < 0.55) return 6;
  if (ttr < 0.65) return 3;
  return 0;
}

// 维度4: 句式开头重复度 (12分)
function sentenceStartScore(sentences) {
  if (sentences.length < 3) return 0;
  const starts = sentences.map(s => s.substring(0, 3));
  const counts = {};
  starts.forEach(s => { counts[s] = (counts[s] || 0) + 1; });
  const maxRepeat = Math.max(...Object.values(counts));
  const repeatRatio = maxRepeat / sentences.length;
  if (repeatRatio > 0.25) return 12;
  if (repeatRatio > 0.15) return 8;
  if (repeatRatio > 0.1) return 4;
  return 0;
}

// 维度5: 段落长度均匀度 (8分)
function paragraphScore(text) {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  if (paragraphs.length < 2) return 4;
  const lengths = paragraphs.map(p => p.length);
  const cv = coefficientOfVariation(lengths);
  if (cv < 0.3) return 8;
  if (cv < 0.5) return 5;
  if (cv < 0.8) return 2;
  return 0;
}

// 维度6: 人称代词使用 (10分)
function personalPronounScore(text) {
  const totalChars = text.length;
  if (totalChars === 0) return 0;
  let count = 0;
  for (const p of PERSONAL_PRONOUNS) {
    const matches = text.match(new RegExp(p, "g"));
    if (matches) count += matches.length;
  }
  const ratio = count / totalChars;
  if (ratio > 0.015) return 0;
  if (ratio > 0.008) return 3;
  if (ratio > 0.003) return 6;
  return 10;
}

// 维度7: 口语化表达 (8分)
function colloquialScore(text) {
  let count = 0;
  for (const c of COLLOQUIAL) {
    if (text.includes(c)) count++;
  }
  if (count >= 3) return 0;
  if (count >= 1) return 4;
  return 8;
}

// 维度8: 复杂学术词密度 (10分)
function academicWordScore(text) {
  let count = 0;
  for (const w of ACADEMIC_WORDS) {
    if (text.includes(w)) count++;
  }
  if (count >= 5) return 10;
  if (count >= 3) return 8;
  if (count >= 2) return 5;
  if (count >= 1) return 2;
  return 0;
}

// 维度9: AI句式模板 (10分)
function aiPatternScore(text) {
  let matchCount = 0;
  for (const pattern of AI_PATTERNS) {
    if (pattern.test(text)) matchCount++;
  }
  if (matchCount >= 4) return 10;
  if (matchCount >= 3) return 7;
  if (matchCount >= 2) return 4;
  if (matchCount >= 1) return 2;
  return 0;
}

// 维度10: 标点使用模式 (5分)
function punctuationScore(text) {
  const hasExclamation = text.includes("！");
  const hasQuestion = text.includes("？");
  const hasEllipsis = text.includes("…") || text.includes("...");
  const hasTilde = text.includes("~");
  const informalCount = [hasExclamation, hasQuestion, hasEllipsis, hasTilde].filter(Boolean).length;
  if (informalCount >= 2) return 0;
  if (informalCount >= 1) return 2;
  return 5;
}

// 文本长度修正系数
function lengthFactor(text) {
  const len = text.length;
  if (len < 50) return 0.4;
  if (len < 100) return 0.6;
  if (len < 200) return 0.8;
  if (len < 300) return 0.9;
  return 1.0;
}

// 主函数
function calculateAiScore(text) {
  if (!text || text.trim().length === 0) return 0;

  const sentences = text.split(/[。！？；\n]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;

  let rawScore = 0;
  rawScore += sentenceLengthScore(sentences);
  rawScore += connectorScore(text, sentences.length);
  rawScore += vocabularyScore(text);
  rawScore += sentenceStartScore(sentences);
  rawScore += paragraphScore(text);
  rawScore += personalPronounScore(text);
  rawScore += colloquialScore(text);
  rawScore += academicWordScore(text);
  rawScore += aiPatternScore(text);
  rawScore += punctuationScore(text);

  const factor = lengthFactor(text);
  const finalScore = Math.round(rawScore * factor);

  return Math.max(0, Math.min(100, finalScore));
}

module.exports = { calculateAiScore };