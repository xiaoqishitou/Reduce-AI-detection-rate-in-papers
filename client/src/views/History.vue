<template>
  <div class="history">
    <el-card>
      <template #header><span>历史记录</span></template>
      <el-table :data="records" v-loading="loading" stripe>
        <el-table-column prop="createdAt" label="时间" width="180"><template #default="{ row }">{{ formatDate(row.createdAt) }}</template></el-table-column>
        <el-table-column prop="wordCount" label="字数" width="100" />
        <el-table-column prop="method" label="方式" width="100"><template #default="{ row }"><el-tag :type="getMethodType(row.method)">{{ getMethodLabel(row.method) }}</el-tag></template></el-table-column>
        <el-table-column prop="aiScoreBefore" label="原始AI率" width="100"><template #default="{ row }"><span :class="getScoreClass(row.aiScoreBefore)">{{ row.aiScoreBefore }}%</span></template></el-table-column>
        <el-table-column prop="aiScoreAfter" label="改写后AI率" width="100"><template #default="{ row }"><span :class="getScoreClass(row.aiScoreAfter)">{{ row.aiScoreAfter }}%</span></template></el-table-column>
        <el-table-column prop="pointsCost" label="消耗积分" width="100" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }"><el-button size="small" @click="viewDetail(row._id)">查看</el-button><el-button size="small" type="danger" @click="handleDelete(row._id)">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" title="改写详情" width="80%">
      <div v-if="detail" class="detail-content">
        <el-row :gutter="20">
          <el-col :span="12"><h4>原始文本</h4><div class="text-block">{{ detail.originalText }}</div></el-col>
          <el-col :span="12"><h4>改写后文本</h4><div class="text-block">{{ detail.rewrittenText }}</div></el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getHistory, getHistoryDetail, deleteHistory } from "../api/paper";
import { ElMessage, ElMessageBox } from "element-plus";

const records = ref([]);
const loading = ref(false);
const page = ref(1);
const total = ref(0);
const dialogVisible = ref(false);
const detail = ref(null);

onMounted(() => { fetchHistory(); });

async function fetchHistory() {
  loading.value = true;
  try {
    const res = await getHistory({ page: page.value, limit: 10 });
    records.value = res.data;
    total.value = res.pagination.total;
  } catch (e) {}
  finally { loading.value = false; }
}

function handlePageChange(p) { page.value = p; fetchHistory(); }

async function viewDetail(id) {
  try { const res = await getHistoryDetail(id); detail.value = res.data; dialogVisible.value = true; } catch (e) {}
}

async function handleDelete(id) {
  await ElMessageBox.confirm("确定要删除这条记录吗？", "提示", { type: "warning" });
  try { await deleteHistory(id); ElMessage.success("删除成功"); fetchHistory(); } catch (e) {}
}

function formatDate(dateStr) { return new Date(dateStr).toLocaleString("zh-CN"); }
function getMethodType(method) { const map = { rule: "info", ai: "warning", hybrid: "success" }; return map[method] || "info"; }
function getMethodLabel(method) { const map = { rule: "规则", ai: "AI", hybrid: "混合" }; return map[method] || method; }
function getScoreClass(score) { if (score >= 70) return "score-high"; if (score >= 40) return "score-medium"; return "score-low"; }
</script>

<style scoped>
.score-high { color: #f56c6c; font-weight: bold; }
.score-medium { color: #e6a23c; font-weight: bold; }
.score-low { color: #67c23a; font-weight: bold; }
.detail-content h4 { margin-bottom: 10px; }
.text-block { background: #f5f7fa; padding: 16px; border-radius: 8px; max-height: 400px; overflow-y: auto; line-height: 1.8; white-space: pre-wrap; }
</style>