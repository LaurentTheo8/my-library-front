import { defineStore } from "pinia";
import type { User } from "~/types/User";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as null | User,
    token: "" as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.roles.includes("ROLE_ADMIN") ?? false,
  },
  actions: {
    async login(email: string, password: string) {
      try {
        const data = await $fetch<{ token: string }>("/auth", {
          method: "POST",
          baseURL: useRuntimeConfig().public.apiBase,
          body: { email, password },
        });

        this.token = data.token;
        localStorage.setItem("token", this.token);

        await this.fetchUser();

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    async fetchUser() {
      if (!this.token) return;

      try {
        const data = await $fetch<User>("/me", {
          baseURL: useRuntimeConfig().public.apiBase,
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        this.user = data;
      } catch (err) {
        console.error(err);
        this.logout();
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
    },
    initialize() {
      if (import.meta.client) {
        const token = localStorage.getItem("token");
        if (token) {
          this.token = token;
          this.fetchUser();
        }
      }
    },
  },
});
