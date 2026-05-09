<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6"><el-card><div class="stat-card"><div class="stat-value">{{ stats.userCount }}</div><div class="stat-label">用户总数</div></div></el-card></el-col>
      <el-col :span="6"><el-card><div class="stat-card"><div class="stat-value">{{ stats.recordCount }}</div><div class="stat-label">改写次数</div></div></el-card></el-col>
      <el-col :span="6"><el-card><div class="stat-card"><div class="stat-value">{{ stats.totalWordsProcessed }}</div><div class="stat-label">处理字数</div></div></el-card></el-col>
      <el-col :span="6"><el-card><div class="stat-card"><div class="stat-value">{{ stats.todayRecords }}</div><div class="stat-label">今日改写</div></div></el-card></el-col>
    </el-row>
    <el-card style="margin-top:20px">
      <template #header><span>积分消耗统计</span></template>
      <div class="stat-card"><div class="stat-value" style="color:#f56c6c">{{ stats.totalPointsConsumed }}</div><div class="stat-label">总消耗积分</div></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getStats } from "../../api/admin";

const stats = ref({ userCount: 0, recordCount: 0, totalPointsConsumed: 0, totalWordsProcessed: 0, todayRecords: 0 });

onMounted(async () => {
  try {
    const res = await getStats();
    stats.value = res;
  } catch (e) {}
});
</script>

<style scoped>
.stat-card { text-align: center; padding: 10px 0; }
.stat-value { font-size: 32px; font-weight: bold; color: #409eff; }
.stat-label { color: #999; margin-top: 8px; }
</style>