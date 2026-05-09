// 规则引擎 v2 - 针对AI检测优化
// 目标：降低AI率，保持自然学术风格

// ============================================================
// 同义词库 - 扩展版
// ============================================================
const synonyms = {
  "研究": ["探究", "分析", "考察", "梳理", "探讨"],
  "发现": ["注意到", "观察到", "意识到", "看到", "得出结论"],
  "认为": ["觉得", "看来", "以为", "主张", "判断"],
  "表明": ["显示", "说明", "指出", "体现", "反映出"],
  "提出": ["给出", "提供", "提及", "提到", "抛出"],
  "使用": ["采用", "运用", "利用", "应用", "用"],
  "进行": ["开展", "实施", "做", "搞", "推进"],
  "通过": ["借助", "凭借", "依靠", "靠", "用"],
  "因此": ["所以", "由此", "这样一来", "这么一来"],
  "然而": ["但是", "不过", "可是", "只是", "话又说回来"],
  "此外": ["另外", "除此之外", "同时", "还有一点"],
  "总之": ["总的来说", "概括来说", "归结起来", "说白了"],
  "重要": ["关键", "核心", "主要", "要紧", "要命"],
  "显著": ["明显", "突出", "相当", "颇为", "挺明显的"],
  "大量": ["众多", "许多", "不少", "很多", "一大堆"],
  "有效": ["管用", "好使", "奏效", "有用", "靠谱"],
  "影响": ["作用", "效果", "波及", "带动", "牵扯"],
  "提高": ["提升", "增强", "改善", "涨", "往上提"],
  "降低": ["减少", "削减", "下调", "降下来", "压低"],
  "发展": ["进步", "演变", "推进", "往前走", "变化"],
  "目前": ["现在", "当前", "眼下", "如今", "这会儿"],
  "基本": ["大体", "大致", "基本上", "差不多", "大概"],
  "完全": ["彻底", "全部", "压根", "压根儿"],
  "非常": ["特别", "十分", "相当", "挺", "蛮"],
  "可能": ["或许", "也许", "大概", "估计", "说不定"],
  "已经": ["已然", "早已", "早就", "都"],
  "可以": ["能够", "得以", "能", "行"],
  "需要": ["须", "必须", "有必要", "得"],
  "问题": ["难题", "课题", "麻烦", "事儿", "痛点"],
  "方法": ["途径", "方式", "手段", "招", "路子"],
  "结果": ["成果", "效果", "结论", "结局"],
  "原因": ["缘由", "缘故", "起因", "为啥"],
  "特点": ["特征", "特性", "特色", "风格"],
  "目的": ["目标", "宗旨", "意图"],
  "条件": ["前提", "基础", "因素", "门槛"],
  "过程": ["进程", "流程", "经过", "经历"],
  "方面": ["层面", "角度", "方向", "这块"],
  "部分": ["局部", "一些", "某些", "有些"],
  "整体": ["总体", "全局", "全面", "大盘"],
  "不同": ["各异", "有别", "不一样", "差别挺大"],
  "相同": ["一致", "同样", "类似", "差不多"],
  "增加": ["增添", "增多", "增长", "变多", "涨"],
  "减少": ["降低", "缩减", "削减", "变少"],
  "支持": ["支撑", "拥护", "赞成", "挺"],
  "反对": ["抵制", "否定", "排斥", "不买账"],
  "包括": ["涵盖", "包含", "囊括", "有", "涉及"],
  "根据": ["依据", "按照", "参照", "看", "照着"],
  "关于": ["对于", "有关", "至于", "说到"],
  "虽然": ["尽管", "固然", "虽说", "别看"],
  "但是": ["然而", "可是", "不过", "只是"],
  "而且": ["并且", "况且", "何况", "还", "再说"],
  "或者": ["或是", "还是", "要么", "要不"],
  "如果": ["假如", "倘若", "要是", "万一"],
  "那么": ["那", "则", "便", "就"],
  "因为": ["由于", "源于", "怪不得"],
  "所以": ["因此", "故而", "于是", "这么一来"],
  "随着": ["伴随", "跟着", "越...越"],
  "逐渐": ["渐渐", "慢慢", "逐步", "越来越"],
  "不断": ["持续", "连续", "一直", "老是"],
  "实现": ["达成", "完成", "做到", "搞定"],
  "促进": ["推动", "带动", "帮着往前推"],
  "导致": ["引起", "引发", "造成", "弄得"],
  "存在": ["有", "具有", "具备"],
  "利用": ["借助", "运用", "使用", "用"],
  "建立": ["构建", "创建", "设立", "搭"],
  "完善": ["健全", "优化", "改进", "打磨"],
  "加强": ["强化", "增强", "巩固", "盯紧"],
  "推动": ["促进", "推进", "驱动", "往前带"],
  "采取": ["采用", "运用", "使用", "用"],
  "反映": ["体现", "表现", "展现", "看得出"],
  "说明": ["阐述", "解释", "讲清楚"],
  "指出": ["提到", "提及", "谈到", "点出"],
  "强调": ["着重", "突出", "反复说"],
  "建议": ["提议", "推荐", "倡导"],
  "提供": ["供给", "给予", "给", "送上"]
};

// AI高分连接词 - 删除或替换
const AI_CONNECTORS_TO_REMOVE = [
  "值得注意的是", "不难发现", "显而易见", "由此可知",
  "毋庸置疑", "由此可见", "总而言之", "概而论之",
  "不可否认", "众所周知", "值得一提", "需要指出",
  "需要强调", "综上所述", "具体来说", "换言之",
  "也就是说", "事实上", "实际上", "毫无疑问",
  "与此同时", "正因如此", "有鉴于此", "在此基础上",
  "进一步来说", "从本质上", "从宏观角度", "在一定程度上",
  "从某种意义上", "就目前而言", "从根本上说"
];

// 自然过渡词
const NATURAL_TRANSITIONS = [
  "话说回来", "说起来", "对了", "另外", "再说了",
  "不过呢", "其实吧", "怎么说呢", "简单来说",
  "换个角度看", "往深了想", "仔细想想"
];

// 人称代词注入模板
const PERSONAL_INJECTIONS = [
  "我觉得", "我认为", "在我看来", "以我的经验",
  "从我们的角度来看", "我注意到", "我观察到",
  "说实话", "坦白讲", "我的看法是"
];

// 口语化表达替换
const COLLOQUIAL_REPLACEMENTS = {
  "进行分析": ["看了看", "分析了一下"],
  "进行研究": ["研究了一下", "琢磨了一番"],
  "值得注意的是": ["有意思的是"],
  "显著提升": ["涨了不少", "提升挺明显"],
  "有效方法": ["挺好使的办法", "管用的招"],
  "一定程度上": ["多少", "或多或少"],
  "具有重要意义": ["挺关键的", "意义不小"],
  "取得显著成效": ["效果还不错", "收效明显"],
  "提供了新的思路": ["给了些新启发", "打开了新思路"],
  "推动了发展": ["往前推了一把"]
};

// AI句式模板替换
const AI_PATTERN_REPLACEMENTS = [
  { pattern: /随着(.+?)的不断发展/g, replace: "这几年$1一直在变化" },
  { pattern: /在(.+?)方面(?![\u4e00-\u9fa5])/g, replace: "说到$1" },
  { pattern: /不仅(.+?)而且/g, replace: "不光$1还" },
  { pattern: /从(.+?)角度来看/g, replace: "要是看$1的话" },
  { pattern: /在(.+?)的背景下/g, replace: "$1这种情况下" },
  { pattern: /基于(.+?)的考虑/g, replace: "考虑到$1" },
  { pattern: /就(.+?)而言/g, replace: "说到$1" },
  { pattern: /在(.+?)的过程中/g, replace: "$1的时候" },
  { pattern: /通过(.+?)的方式/g, replace: "用$1的办法" }
];

// ============================================================
// 核心函数
// ============================================================

function replaceSynonyms(text) {
  let result = text;
  const entries = Object.entries(synonyms).sort((a, b) => b[0].length - a[0].length);
  for (const [word, replacements] of entries) {
    if (result.includes(word)) {
      const replacement = replacements[Math.floor(Math.random() * replacements.length)];
      const regex = new RegExp(word, "g");
      result = result.replace(regex, () => replacement);
    }
  }
  return result;
}

function removeAIConnectors(text) {
  let result = text;
  for (const connector of AI_CONNECTORS_TO_REMOVE) {
    if (result.includes(connector)) {
      if (Math.random() > 0.5) {
        result = result.replace(new RegExp(connector, "g"), "");
      } else {
        const replacement = NATURAL_TRANSITIONS[Math.floor(Math.random() * NATURAL_TRANSITIONS.length)];
        result = result.replace(new RegExp(connector, "g"), replacement);
      }
    }
  }
  return result;
}

function replaceColloquial(text) {
  let result = text;
  for (const [formal, colloquials] of Object.entries(COLLOQUIAL_REPLACEMENTS)) {
    if (result.includes(formal)) {
      const replacement = colloquials[Math.floor(Math.random() * colloquials.length)];
      result = result.replace(new RegExp(formal, "g"), replacement);
    }
  }
  return result;
}

function breakAIPatterns(text) {
  let result = text;
  for (const { pattern, replace } of AI_PATTERN_REPLACEMENTS) {
    result = result.replace(pattern, replace);
  }
  return result;
}

function injectPersonalPronouns(text) {
  const parts = text.split(/([。！？]+)/);
  const sentences = [];
  for (let i = 0; i < parts.length; i += 2) {
    sentences.push(parts[i] + (parts[i + 1] || ""));
  }
  if (sentences.length < 3) return text;

  const injectCount = Math.min(2, Math.floor(sentences.length / 3));
  const indices = [];
  while (indices.length < injectCount) {
    const idx = Math.floor(Math.random() * (sentences.length - 2)) + 1;
    if (!indices.includes(idx)) indices.push(idx);
  }

  for (const idx of indices) {
    const injection = PERSONAL_INJECTIONS[Math.floor(Math.random() * PERSONAL_INJECTIONS.length)];
    sentences[idx] = injection + "，" + sentences[idx].trimStart();
  }

  return sentences.join("");
}

function adjustSentenceStructure(text) {
  const parts = text.split(/([。！？；]+)/);
  const result = [];

  for (let i = 0; i < parts.length; i++) {
    let sentence = parts[i];
    if (!sentence.trim() || /^[。！？；]+$/.test(sentence)) {
      result.push(sentence);
      continue;
    }

    // 长句拆短
    if (sentence.length > 30 && Math.random() > 0.4) {
      const breakPoints = [];
      for (let j = 5; j < sentence.length - 5; j++) {
        if ("，、；".includes(sentence[j])) {
          breakPoints.push(j);
        }
      }
      if (breakPoints.length > 0) {
        const bp = breakPoints[Math.floor(Math.random() * breakPoints.length)];
        const part1 = sentence.slice(0, bp);
        const part2 = sentence.slice(bp + 1);
        if (Math.random() > 0.5) {
          sentence = part1 + "。" + part2;
        } else {
          sentence = part2 + "，" + part1;
        }
      }
    }

    // 短句添加细节
    if (sentence.length < 15 && sentence.length > 5 && Math.random() > 0.6) {
      const details = ["具体来说", "往细了看", "仔细想想", "说白了"];
      const detail = details[Math.floor(Math.random() * details.length)];
      sentence = detail + "，" + sentence;
    }

    // 句式前后调换
    if (Math.random() > 0.6 && sentence.length > 15) {
      const mid = Math.floor(sentence.length / 2);
      const breakPoints = [];
      for (let j = mid - 5; j < mid + 5; j++) {
        if (j > 0 && j < sentence.length && "，、；".includes(sentence[j])) {
          breakPoints.push(j);
        }
      }
      if (breakPoints.length > 0) {
        const bp = breakPoints[Math.floor(Math.random() * breakPoints.length)];
        sentence = sentence.slice(bp + 1) + "，" + sentence.slice(0, bp);
      }
    }

    result.push(sentence);
  }

  return result.join("");
}

function diversifySentenceStarts(text) {
  const parts = text.split(/([。！？]+)/);
  const sentences = [];
  for (let i = 0; i < parts.length; i += 2) {
    sentences.push(parts[i] + (parts[i + 1] || ""));
  }
  if (sentences.length < 3) return text;

  const starts = sentences.map(s => s.substring(0, 3));
  const counts = {};
  starts.forEach(s => { counts[s] = (counts[s] || 0) + 1; });

  const startAlternatives = [
    "说起", "谈到", "关于", "至于", "你看",
    "我觉得", "说实话", "换个角度", "仔细想想"
  ];

  for (let i = 1; i < sentences.length; i++) {
    const start = sentences[i].substring(0, 3);
    if (counts[start] > 1 && Math.random() > 0.5) {
      const alt = startAlternatives[Math.floor(Math.random() * startAlternatives.length)];
      sentences[i] = alt + "，" + sentences[i].trimStart();
      counts[start]--;
    }
  }

  return sentences.join("");
}

function insertRhythmWords(text) {
  const parts = text.split(/([。！？]+)/);
  const sentences = [];
  for (let i = 0; i < parts.length; i += 2) {
    sentences.push(parts[i] + (parts[i + 1] || ""));
  }
  if (sentences.length < 4) return text;

  const rhythmWords = ["嗯", "对", "其实", "怎么说呢", "你看"];

  const insertIdx = Math.floor(Math.random() * (sentences.length - 2)) + 1;
  const word = rhythmWords[Math.floor(Math.random() * rhythmWords.length)];
  sentences[insertIdx] = word + "，" + sentences[insertIdx].trimStart();

  return sentences.join("");
}

// ============================================================
// 主函数
// ============================================================
function ruleEngineRewrite(text) {
  let result = text;

  result = breakAIPatterns(result);
  result = removeAIConnectors(result);
  result = replaceColloquial(result);
  result = replaceSynonyms(result);
  result = adjustSentenceStructure(result);
  result = diversifySentenceStarts(result);
  result = injectPersonalPronouns(result);
  result = insertRhythmWords(result);

  // 清理
  result = result.replace(/\s+/g, " ").trim();
  result = result.replace(/，+/g, "，");
  result = result.replace(/。+/g, "。");

  return result;
}

module.exports = {
  ruleEngineRewrite,
  replaceSynonyms,
  removeAIConnectors,
  replaceColloquial,
  breakAIPatterns,
  adjustSentenceStructure,
  diversifySentenceStarts,
  injectPersonalPronouns,
  insertRhythmWords
};