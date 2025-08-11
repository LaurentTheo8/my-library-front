import { defineStore } from "pinia";
import type { Category } from "~/types/Category";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [] as Category[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        this.categories = data.member;
      } catch (e: unknown) {
        if (e instanceof Error) {
          this.error = e.message;
        } else {
          this.error = "Unknown error";
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
