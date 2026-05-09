<template>
  <el-container class="admin-layout">
    <el-aside width="200px">
      <div class="logo">后台管理</div>
      <el-menu :default-active="activeMenu" router background-color="#304156" text-color="#bfcbd9" active-text-color="#409eff">
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/records">
          <el-icon><Document /></el-icon>
          <span>记录管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/models">
          <el-icon><Setting /></el-icon>
          <span>模型配置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="admin-header">
        <span>后台管理系统</span>
        <el-button @click="goHome" size="small">返回前台</el-button>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DataBoard, User, Document, Setting } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const activeMenu = computed(() => route.path);

function goHome() {
  router.push("/workspace");
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  background: #263445;
}
.el-aside {
  background: #304156;
}
.el-menu {
  border-right: none;
}
.admin-header {
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  padding: 0 20px;
}
</style>