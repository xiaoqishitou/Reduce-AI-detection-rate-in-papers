<template>
  <div class="register-container">
    <div class="register-card">
      <h2>论文降AI率助手</h2>
      <p class="subtitle">创建新账号</p>
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="2-20个字符" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="至少6位" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="再次输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleRegister" style="width:100%">注册</el-button>
        </el-form-item>
      </el-form>
      <p class="link">已有账号？<router-link to="/login">去登录</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { register } from "../api/auth";
import { ElMessage } from "element-plus";

const router = useRouter();
const userStore = useUserStore();
const formRef = ref(null);
const loading = ref(false);

const form = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: ""
});

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.value.password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 20, message: "用户名长度为2-20个字符", trigger: "blur" }
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入有效的邮箱地址", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    { validator: validateConfirmPassword, trigger: "blur" }
  ]
};

async function handleRegister() {
  await formRef.value.validate();
  loading.value = true;
  try {
    const res = await register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password
    });
    userStore.setToken(res.token);
    userStore.setUser(res.user);
    ElMessage.success("注册成功！赠送100积分");
    router.push("/workspace");
  } catch (e) {
    // handled by interceptor
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.register-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.register-card h2 {
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