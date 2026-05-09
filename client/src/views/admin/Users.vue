<template>
  <div>
    <el-card>
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>用户管理</span>
          <el-input v-model="keyword" placeholder="搜索用户名/邮箱" style="width:250px" @keyup.enter="fetchUsers" clearable @clear="fetchUsers">
            <template #append><el-button @click="fetchUsers">搜索</el-button></template>
          </el-input>
        </div>
      </template>
      <el-table :data="users" v-loading="loading" stripe>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="points" label="积分" width="100" />
        <el-table-column prop="role" label="角色" width="80">
          <template #default="{ row }"><el-tag :type="row.role === 'admin' ? 'danger' : 'info'">{{ row.role }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="banned" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="row.banned ? 'danger' : 'success'">{{ row.banned ? '已封禁' : '正常' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180">
          <template #default="{ row }">{{ new Date(row.createdAt).toLocaleString("zh-CN") }}</template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button size="small" @click="editUser(row)">编辑</el-button>
            <el-button size="small" :type="row.banned ? 'success' : 'warning'" @click="handleBan(row)">{{ row.banned ? '解封' : '封禁' }}</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="total > 0" :current-page="page" :page-size="20" :total="total" layout="total, prev, pager, next" @current-change="handlePageChange" style="margin-top:16px;justify-content:center" />
    </el-card>

    <el-dialog v-model="dialogVisible" title="编辑用户" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="用户名"><el-input v-model="editForm.username" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="editForm.email" /></el-form-item>
        <el-form-item label="积分"><el-input-number v-model="editForm.points" :min="0" /></el-form-item>
        <el-form-item label="角色"><el-select v-model="editForm.role"><el-option label="user" value="user" /><el-option label="admin" value="admin" /></el-select></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getUsers, updateUser, deleteUser, toggleBan } from "../../api/admin";
import { ElMessage, ElMessageBox } from "element-plus";

const users = ref([]);
const loading = ref(false);
const page = ref(1);
const total = ref(0);
const keyword = ref("");
const dialogVisible = ref(false);
const editForm = ref({});
const editId = ref(null);

onMounted(() => { fetchUsers(); });

async function fetchUsers() {
  loading.value = true;
  try {
    const res = await getUsers({ page: page.value, limit: 20, keyword: keyword.value });
    users.value = res.data;
    total.value = res.pagination.total;
  } catch (e) {}
  finally { loading.value = false; }
}

function handlePageChange(p) { page.value = p; fetchUsers(); }

function editUser(user) {
  editId.value = user._id;
  editForm.value = { username: user.username, email: user.email, points: user.points, role: user.role };
  dialogVisible.value = true;
}

async function saveUser() {
  try {
    await updateUser(editId.value, editForm.value);
    ElMessage.success("更新成功");
    dialogVisible.value = false;
    fetchUsers();
  } catch (e) {}
}

async function handleBan(user) {
  await ElMessageBox.confirm("确定要" + (user.banned ? "解封" : "封禁") + "该用户吗？", "提示", { type: "warning" });
  try {
    await toggleBan(user._id);
    ElMessage.success("操作成功");
    fetchUsers();
  } catch (e) {}
}

async function handleDelete(user) {
  await ElMessageBox.confirm("确定要删除该用户及其所有数据吗？", "提示", { type: "warning" });
  try {
    await deleteUser(user._id);
    ElMessage.success("删除成功");
    fetchUsers();
  } catch (e) {}
}
</script>