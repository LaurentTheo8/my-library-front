import { defineStore } from "pinia";
import type { Category } from "~/types/Category";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [] as Category[],
    currentCategory: null as Category | null,
    loading: false,
    error: null as string | null,
    fetched: false,
  }),
  actions: {
    async fetchCategories() {
      if (this.fetched) return;
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
        this.fetched = true;
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

    async fetchCategoryById(id: number): Promise<Category | null> {
      const existing = this.categories.find((c) => c.id === id);
      if (existing) {
        this.currentCategory = { ...existing };
        return this.currentCategory;
      }

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/categories/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch categories");

        this.currentCategory = (await res.json()) as Category;
        return this.currentCategory;
      } catch (e) {
        this.error = e instanceof Error ? e.message : "Unknown error";
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createCategory(payload: {
      name: string;
      description?: string | null;
    }) {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/categories`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData["hydra:description"] || "Failed to create category"
          );
        }

        const created: Category = await res.json();
        this.categories.push(created);
        return created;
      } catch (e: unknown) {
        if (e instanceof Error) this.error = e.message;
        else this.error = "Unknown error";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async updateCategory(payload: {
      id: number;
      name: string;
      description?: string | null;
    }): Promise<Category | null> {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/categories/${payload.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: payload.name,
              description: payload.description ?? null,
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to update category");

        const updated: Category = await res.json();

        const index = this.categories.findIndex((c) => c.id === updated.id);
        if (index !== -1) this.categories[index] = updated;

        return updated;
      } catch (e: unknown) {
        this.error = e instanceof Error ? e.message : "Unknown error";
        return null;
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(id: number): Promise<boolean> {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/categories/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to delete category");

        // Supprime la catégorie localement si la requête réussit
        this.categories = this.categories.filter((c) => c.id !== id);
        return true;
      } catch (e: unknown) {
        if (e instanceof Error) {
          this.error = e.message;
        } else {
          this.error = "Unknown error";
        }
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
