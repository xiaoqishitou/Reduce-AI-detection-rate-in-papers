import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/workspace" },
  { path: "/login", name: "Login", component: () => import("../views/Login.vue"), meta: { guest: true } },
  { path: "/register", name: "Register", component: () => import("../views/Register.vue"), meta: { guest: true } },
  {
    path: "/",
    component: () => import("../views/Layout.vue"),
    meta: { requiresAuth: true },
    children: [
      { path: "workspace", name: "Workspace", component: () => import("../views/Workspace.vue") },
      { path: "history", name: "History", component: () => import("../views/History.vue") },
      { path: "points", name: "Points", component: () => import("../views/Points.vue") },
      { path: "profile", name: "Profile", component: () => import("../views/Profile.vue") }
    ]
  },
  {
    path: "/admin",
    component: () => import("../views/admin/Layout.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: "", redirect: "/admin/dashboard" },
      { path: "dashboard", name: "AdminDashboard", component: () => import("../views/admin/Dashboard.vue") },
      { path: "users", name: "AdminUsers", component: () => import("../views/admin/Users.vue") },
      { path: "records", name: "AdminRecords", component: () => import("../views/admin/Records.vue") },
      { path: "models", name: "AdminModels", component: () => import("../views/admin/Models.vue") }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if (to.meta.guest && token) {
    next("/workspace");
  } else if (to.meta.requiresAdmin) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId;
      fetch("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: "Bearer " + token }
      }).then(r => r.json()).then(data => {
        if (data.user?.role === "admin") {
          next();
        } else {
          next("/workspace");
        }
      }).catch(() => next("/login"));
    } catch (e) {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;