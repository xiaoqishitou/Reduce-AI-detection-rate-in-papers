import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getProfile } from "../api/auth";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("token") || "");

  const isAdmin = computed(() => user.value?.role === "admin");

  function setToken(t) {
    token.value = t;
    localStorage.setItem("token", t);
  }

  function setUser(u) {
    user.value = u;
  }

  function logout() {
    token.value = "";
    user.value = null;
    localStorage.removeItem("token");
  }

  async function fetchUser() {
    try {
      const res = await getProfile();
      user.value = res.user;
    } catch (e) {
      logout();
    }
  }

  function isLoggedIn() {
    return !!token.value;
  }

  return { user, token, isAdmin, setToken, setUser, logout, fetchUser, isLoggedIn };
});