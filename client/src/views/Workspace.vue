<template>
  <div class="workspace">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="method-card">
          <template #header>
            <span>改写方式</span>
          </template>
          <el-radio-group v-model="method">
            <el-radio-button value="rule">
              <el-icon><setting /></el-icon>
              规则改写 (低积分)
            </el-radio-button>
            <el-radio-button value="ai">
              <el-icon><magic-stick /></el-icon>
              AI改写 (高积分)
            </el-radio-button>
            <el-radio-button value="hybrid">
              <el-icon><connection /></el-icon>
              混合模式 (推荐)
            </el-radio-button>
          </el-radio-group>
          <div class="cost-hint">
            预计消耗: {{ estimatedCost }} 积分 | 当前积分: {{ userStore.user?.points || 0 }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="content-row">
      <el-col :span="12">
        <el-card class="text-card">
          <template #header>
            <div class="card-header">
              <span>原始文本</span>
              <span class="word-count">字数: {{ wordCount }}</span>
            </div>
          </template>
          <el-input
            v-model="originalText"
            type="textarea"
            :rows="16"
            placeholder="请粘贴需要降AI率的论文文本..."
            resize="none"
          />
          <div class="actions">
            <el-upload
              :auto-upload="false"
              :show-file-list="false"
              accept=".txt,.docx"
              :on-change="handleFileChange"
            >
              <el-button>上传文件</el-button>
            </el-upload>
            <el-button type="primary" :loading="loading" @click="handleRewrite">
              开始改写
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="text-card">
          <template #header>
            <div class="card-header">
              <span>改写结果</span>
              <el-button v-if="rewrittenText" @click="handleCopy" size="small">复制</el-button>
            </div>
          </template>
          <el-input
            v-model="rewrittenText"
            type="textarea"
            :rows="16"
            placeholder="改写后的文本将显示在这里..."
            readonly
            resize="none"
          />
          <div v-if="result" class="result-info">
            <el-row :gutter="16">
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-label">原始AI率</div>
                  <div class="stat-value" :class="getScoreClass(result.aiScoreBefore)">
                    {{ result.aiScoreBefore }}%
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-label">改写后AI率</div>
                  <div class="stat-value" :class="getScoreClass(result.aiScoreAfter)">
                    {{ result.aiScoreAfter }}%
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-label">消耗积分</div>
                  <div class="stat-value cost">{{ result.pointsCost }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "../stores/user";
import { rewritePaper } from "../api/paper";
import { ElMessage } from "element-plus";
import { Setting, MagicStick, Connection } from "@element-plus/icons-vue";

const userStore = useUserStore();

const originalText = ref("");
const rewrittenText = ref("");
const method = ref("hybrid");
const loading = ref(false);
const result = ref(null);

const wordCount = computed(() => {
  const text = originalText.value;
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const english = (text.match(/[a-zA-Z]+/g) || []).length;
  return chinese + english;
});

const estimatedCost = computed(() => {
  const wc = wordCount.value;
  if (wc === 0) return 0;
  if (method.value === "rule") return Math.ceil(wc / 100) * 2;
  if (method.value === "ai") return Math.ceil(wc / 100) * 10;
  return Math.ceil(wc / 100) * 12;
});

function getScoreClass(score) {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

async function handleFileChange(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "txt") {
    const reader = new FileReader();
    reader.onload = (e) => {
      originalText.value = e.target.result;
    };
    reader.readAsText(file.raw);
  } else if (ext === "docx") {
    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.raw.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      originalText.value = result.value;
    } catch (e) {
      ElMessage.error("docx文件解析失败");
    }
  }
}

async function handleRewrite() {
  if (!originalText.value.trim()) {
    ElMessage.warning("请输入需要改写的文本");
    return;
  }

  loading.value = true;
  result.value = null;
  rewrittenText.value = "";

  try {
    const res = await rewritePaper({
      text: originalText.value,
      method: method.value
    });
    rewrittenText.value = res.data.rewrittenText;
    result.value = res.data;
    userStore.user.points = res.data.remainingPoints;
    ElMessage.success("改写成功！");
  } catch (e) {
    // handled by interceptor
  } finally {
    loading.value = false;
  }
}

function handleCopy() {
  navigator.clipboard.writeText(rewrittenText.value);
  ElMessage.success("已复制到剪贴板");
}
</script>

<style scoped>
.workspace {
  max-width: 1400px;
  margin: 0 auto;
}
.method-card {
  margin-bottom: 20px;
}
.cost-hint {
  margin-top: 12px;
  color: #999;
  font-size: 14px;
}
.content-row {
  margin-top: 0;
}
.text-card {
  height: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.word-count {
  color: #999;
  font-size: 14px;
}
.actions {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
}
.result-info {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}
.stat-item {
  text-align: center;
}
.stat-label {
  color: #999;
  font-size: 13px;
  margin-bottom: 4px;
}
.stat-value {
  font-size: 24px;
  font-weight: bold;
}
.stat-value.high {
  color: #f56c6c;
}
.stat-value.medium {
  color: #e6a23c;
}
.stat-value.low {
  color: #67c23a;
}
.stat-value.cost {
  color: #409eff;
}
</style>