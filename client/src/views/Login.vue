<template>
  <div class="login-container">
    <div class="login-card">
      <h2>论文降AI率助手</h2>
      <p class="subtitle">登录您的账号</p>
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin" style="width:100%">登录</el-button>
        </el-form-item>
      </el-form>
      <p class="link">还没有账号？<router-link to="/register">立即注册</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { login } from "../api/auth";
import { ElMessage } from "element-plus";

const router = useRouter();
const userStore = useUserStore();
const formRef = ref(null);
const loading = ref(false);

const form = ref({
  email: "",
  password: ""
});

const rules = {
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
};

async function handleLogin() {
  await formRef.value.validate();
  loading.value = true;
  try {
    const res = await login(form.value);
    userStore.setToken(res.token);
    userStore.setUser(res.user);
    ElMessage.success("登录成功");
    router.push("/workspace");
  } catch (e) {
    // handled by interceptor
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.login-card h2 {
  text-align: center;
  margin-bottom: 8px;
  color: #333;
}
.subtitle {
  text-align: center;
  color: #999;
  margin-bottom: 30px;
}
.link {
  text-align: center;
  color: #666;
}
.link a {
  color: #667eea;
  text-decoration: none;
}
</style>