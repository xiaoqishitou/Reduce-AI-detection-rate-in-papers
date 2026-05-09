<template>
  <div class="profile">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card><template #header><span>账号信息</span></template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户名">{{ userStore.user?.username }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userStore.user?.email }}</el-descriptions-item>
            <el-descriptions-item label="积分">{{ userStore.user?.points }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ userStore.user?.createdAt ? new Date(userStore.user.createdAt).toLocaleString("zh-CN") : "" }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card><template #header><span>修改密码</span></template>
          <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
            <el-form-item label="旧密码" prop="oldPassword"><el-input v-model="form.oldPassword" type="password" show-password /></el-form-item>
            <el-form-item label="新密码" prop="newPassword"><el-input v-model="form.newPassword" type="password" show-password /></el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword"><el-input v-model="form.confirmPassword" type="password" show-password /></el-form-item>
            <el-form-item><el-button type="primary" :loading="loading" @click="handleChangePassword">修改密码</el-button></el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/user";
import { changePassword } from "../api/auth";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const formRef = ref(null);
const loading = ref(false);
const form = ref({ oldPassword: "", newPassword: "", confirmPassword: "" });

const validateConfirm = (rule, value, callback) => {
  if (value !== form.value.newPassword) { callback(new Error("两次输入的密码不一致")); } else { callback(); }
};

const rules = {
  oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }, { min: 6, message: "密码长度不能少于6位", trigger: "blur" }],
  confirmPassword: [{ required: true, message: "请确认新密码", trigger: "blur" }, { validator: validateConfirm, trigger: "blur" }]
};

async function handleChangePassword() {
  await formRef.value.validate();
  loading.value = true;
  try {
    await changePassword({ oldPassword: form.value.oldPassword, newPassword: form.value.newPassword });
    ElMessage.success("密码修改成功");
    form.value = { oldPassword: "", newPassword: "", confirmPassword: "" };
  } catch (e) {}
  finally { loading.value = false; }
}
</script>