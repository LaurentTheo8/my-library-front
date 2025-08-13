import { defineStore } from "pinia";
import type { Author } from "~/types/Author";

export const useAuthorStore = defineStore("author", {
  state: () => ({
    authors: [] as Author[],
    loading: false,
    error: null as string | null,
    fetched: false,
  }),
  actions: {
    async fetchAuthors() {
      if (this.fetched) return;
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/authors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch authors");

        const data = await res.json();
        this.authors = data.member;
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
  },
});
