<template>
  <div>
    <el-card>
      <template #header><span>记录管理</span></template>
      <el-table :data="records" v-loading="loading" stripe>
        <el-table-column prop="userId.username" label="用户" width="120" />
        <el-table-column prop="userId.email" label="邮箱" width="200" />
        <el-table-column prop="wordCount" label="字数" width="80" />
        <el-table-column prop="method" label="方式" width="80">
          <template #default="{ row }"><el-tag>{{ row.method }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="aiScoreBefore" label="原AI率" width="80">
          <template #default="{ row }">{{ row.aiScoreBefore }}%</template>
        </el-table-column>
        <el-table-column prop="aiScoreAfter" label="新AI率" width="80">
          <template #default="{ row }">{{ row.aiScoreAfter }}%</template>
        </el-table-column>
        <el-table-column prop="pointsCost" label="积分" width="80" />
        <el-table-column prop="createdAt" label="时间" width="180">
          <template #default="{ row }">{{ new Date(row.createdAt).toLocaleString("zh-CN") }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }"><el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button></template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="total > 0" :current-page="page" :page-size="20" :total="total" layout="total, prev, pager, next" @current-change="handlePageChange" style="margin-top:16px;justify-content:center" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getRecords, deleteRecord } from "../../api/admin";
import { ElMessage, ElMessageBox } from "element-plus";

const records = ref([]);
const loading = ref(false);
const page = ref(1);
const total = ref(0);

onMounted(() => { fetchRecords(); });

async function fetchRecords() {
  loading.value = true;
  try {
    const res = await getRecords({ page: page.value, limit: 20 });
    records.value = res.data;
    total.value = res.pagination.total;
  } catch (e) {}
  finally { loading.value = false; }
}

function handlePageChange(p) { page.value = p; fetchRecords(); }

async function handleDelete(record) {
  await ElMessageBox.confirm("确定要删除这条记录吗？", "提示", { type: "warning" });
  try {
    await deleteRecord(record._id);
    ElMessage.success("删除成功");
    fetchRecords();
  } catch (e) {}
}
</script>