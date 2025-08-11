import { defineStore } from "pinia";
import type { Book } from "~/types/Book";

export const useBookStore = defineStore("book", {
  state: () => ({
    books: [] as Book[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchBooks() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/books`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch books");

        const data = await res.json();
        this.books = data.member;
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
