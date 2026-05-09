<template>
  <el-container class="layout-container">
    <el-header class="header">
      <div class="logo">论文降AI率助手</div>
      <div class="nav">
        <el-menu :default-active="activeMenu" mode="horizontal" router :ellipsis="false">
          <el-menu-item index="/workspace">工作台</el-menu-item>
          <el-menu-item index="/history">历史记录</el-menu-item>
          <el-menu-item index="/points">积分中心</el-menu-item>
          <el-menu-item index="/profile">个人中心</el-menu-item>
          <el-menu-item v-if="userStore.isAdmin" index="/admin/dashboard">后台管理</el-menu-item>
        </el-menu>
      </div>
      <div class="user-info">
        <span class="points">积分: {{ userStore.user?.points || 0 }}</span>
        <el-dropdown @command="handleCommand">
          <span class="username">
            {{ userStore.user?.username || "用户" }}
            <el-icon><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item v-if="userStore.isAdmin" command="admin">后台管理</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-main class="main">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { ArrowDown } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const activeMenu = computed(() => route.path);

onMounted(() => {
  if (userStore.isLoggedIn() && !userStore.user) {
    userStore.fetchUser();
  }
});

function handleCommand(cmd) {
  if (cmd === "profile") {
    router.push("/profile");
  } else if (cmd === "admin") {
    router.push("/admin/dashboard");
  } else if (cmd === "logout") {
    userStore.logout();
    router.push("/login");
  }
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}
.header {
  background: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 100;
}
.logo {
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
  margin-right: 40px;
  white-space: nowrap;
}
.nav {
  flex: 1;
}
.nav .el-menu {
  border-bottom: none;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.points {
  color: #f56c6c;
  font-weight: bold;
}
.username {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
.main {
  padding: 20px;
  background: #f5f7fa;
}
</style>