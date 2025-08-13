import { defineStore } from "pinia";
import type { Author } from "~/types/Author";

interface AuthorBasePayload {
  firstName: string;
  lastName: string;
  birthDate?: string | null;
}

type AuthorCreatePayload = AuthorBasePayload;

interface AuthorUpdatePayload extends AuthorBasePayload {
  id: number;
}

export const useAuthorStore = defineStore("author", {
  state: () => ({
    authors: [] as Author[],
    currentAuthor: null as Author | null,
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
        this.error = e instanceof Error ? e.message : "Unknown error";
      } finally {
        this.loading = false;
      }
    },

    async fetchAuthorById(id: number): Promise<Author | null> {
      const existing = this.authors.find((a) => a.id === id);
      if (existing) {
        this.currentAuthor = { ...existing };
        return this.currentAuthor;
      }

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/authors/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch author");

        this.currentAuthor = (await res.json()) as Author;
        return this.currentAuthor;
      } catch (e) {
        this.error = e instanceof Error ? e.message : "Unknown error";
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateAuthor(payload: AuthorUpdatePayload): Promise<Author | null> {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/authors/${payload.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Update failed");

        const updated = (await res.json()) as Author;

        const index = this.authors.findIndex((a) => a.id === updated.id);
        if (index !== -1) {
          this.authors[index] = updated;
        }

        this.currentAuthor = updated;
        return updated;
      } catch (e) {
        this.error = e instanceof Error ? e.message : "Unknown error";
        return null;
      } finally {
        this.loading = false;
      }
    },

    async deleteAuthor(id: number) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/authors/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Delete failed");

        this.authors = this.authors.filter((a) => a.id !== id);
        return true;
      } catch (e) {
        this.error = e instanceof Error ? e.message : "Unknown error";
        return false;
      }
    },

    async createAuthor(payload: AuthorCreatePayload): Promise<Author | null> {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/authors`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Creation failed");

        const created = (await res.json()) as Author;

        this.authors.push(created);
        this.currentAuthor = created;

        return created;
      } catch (e) {
        this.error = e instanceof Error ? e.message : "Unknown error";
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
