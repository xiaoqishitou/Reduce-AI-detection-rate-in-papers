<template>
  <div class="points-page">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="balance-card">
          <div class="balance">
            <div class="label">当前积分</div>
            <div class="value">{{ userStore.user?.points || 0 }}</div>
          </div>
          <el-button type="primary" @click="showRecharge = true" style="width:100%;margin-top:16px">充值积分</el-button>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header><span>积分变动记录</span></template>
          <el-table :data="logs" v-loading="loading" stripe>
            <el-table-column prop="createdAt" label="时间" width="180">
              <template #default="{ row }">{{ new Date(row.createdAt).toLocaleString("zh-CN") }}</template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }"><el-tag :type="getTypeType(row.type)">{{ getTypeLabel(row.type) }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="amount" label="变动" width="100">
              <template #default="{ row }">
                <span :class="row.amount > 0 ? 'positive' : 'negative'">{{ row.amount > 0 ? '+' : '' }}{{ row.amount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="balance" label="余额" width="100" />
            <el-table-column prop="description" label="说明" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog v-model="showRecharge" title="充值积分" width="400px">
      <el-form>
        <el-form-item label="充值数量"><el-input-number v-model="rechargeAmount" :min="1" :max="10000" :step="100" style="width:100%" /></el-form-item>
        <div class="recharge-options"><el-button v-for="n in [100, 500, 1000, 5000]" :key="n" @click="rechargeAmount = n">{{ n }}积分</el-button></div>
      </el-form>
      <template #footer>
        <el-button @click="showRecharge = false">取消</el-button>
        <el-button type="primary" :loading="recharging" @click="handleRecharge">确认充值</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../stores/user";
import { getPointLogs, recharge } from "../api/points";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const logs = ref([]);
const loading = ref(false);
const page = ref(1);
const total = ref(0);
const showRecharge = ref(false);
const rechargeAmount = ref(100);
const recharging = ref(false);

onMounted(() => { fetchLogs(); });

async function fetchLogs() {
  loading.value = true;
  try {
    const res = await getPointLogs({ page: page.value, limit: 20 });
    logs.value = res.data;
    total.value = res.pagination.total;
  } catch (e) {}
  finally { loading.value = false; }
}

function handlePageChange(p) { page.value = p; fetchLogs(); }

async function handleRecharge() {
  recharging.value = true;
  try {
    const res = await recharge({ amount: rechargeAmount.value });
    userStore.user.points = res.points;
    ElMessage.success("充值成功！");
    showRecharge.value = false;
    fetchLogs();
  } catch (e) {}
  finally { recharging.value = false; }
}

function getTypeType(type) { const map = { gift: "success", recharge: "primary", consume: "danger" }; return map[type] || "info"; }
function getTypeLabel(type) { const map = { gift: "赠送", recharge: "充值", consume: "消费" }; return map[type] || type; }
</script>

<style scoped>
.balance-card { text-align: center; }
.balance .label { color: #999; font-size: 14px; }
.balance .value { font-size: 48px; font-weight: bold; color: #409eff; margin: 16px 0; }
.positive { color: #67c23a; font-weight: bold; }
.negative { color: #f56c6c; font-weight: bold; }
.recharge-options { display: flex; gap: 8px; margin-top: 8px; }
</style>