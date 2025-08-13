import { defineStore } from "pinia";
import type { Book } from "~/types/Book";

interface BookBasePayload {
  title: string;
  description?: string | null;
  publishedAt?: string | null;
  author: string | null; // IRI
  categories: string[]; // IRIs
}

type BookCreatePayload = BookBasePayload;

interface BookUpdatePayload extends BookBasePayload {
  id: number;
}

export const useBookStore = defineStore("book", {
  state: () => ({
    books: [] as Book[],
    currentBook: null as Book | null,
    loading: false,
    error: null as string | null,
    fetched: false,

    // Pagination
    totalItems: 0,
    currentPage: 1,
    lastPage: 1,
  }),
  actions: {
    async fetchBooks(page = 1) {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const base = useRuntimeConfig().public.apiBase;
        const res = await fetch(`${base}/api/books?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch books");

        const data = await res.json();

        // Ici on prend direct "member"
        this.books = Array.isArray(data.member) ? data.member : [];

        // Pagination
        this.totalItems =
          typeof data.totalItems === "number" ? data.totalItems : 0;

        const view = data.view;
        let last = 1;
        if (view?.last) {
          const lastParam = new URL(view.last, base).searchParams.get("page");
          last = lastParam ? Number(lastParam) || 1 : 1;
        } else if (this.totalItems && this.books.length) {
          last = Math.ceil(this.totalItems / this.books.length);
        }

        this.currentPage = page;
        this.lastPage = last;
      } catch (e) {
        this.error = e instanceof Error ? e.message : "Unknown error";
        this.books = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchAllBooks() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/books/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch all books");

        const data = await res.json();
        this.books = data.member;
        this.currentPage = 1;
        this.lastPage = 1;
      } catch (e) {
        this.error = e instanceof Error ? e.message : "Unknown error";
      } finally {
        this.loading = false;
      }
    },

    async fetchBookById(id: number): Promise<Book | null> {
      const existing = this.books.find((b) => b.id === id);
      if (existing) {
        this.currentBook = { ...existing };
        return this.currentBook;
      }

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/books/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch book");

        this.currentBook = (await res.json()) as Book;
        return this.currentBook;
      } catch (e) {
        this.error = e instanceof Error ? e.message : "Unknown error";
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateBook(payload: BookUpdatePayload): Promise<Book | null> {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/books/${payload.id}`,
          {
            method: "PUT", // "PATCH"
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Update failed");

        const updated = (await res.json()) as Book;

        const index = this.books.findIndex((b) => b.id === updated.id);
        if (index !== -1) {
          this.books[index] = updated;
        }

        this.currentBook = updated;
        return updated;
      } catch (e) {
        this.error = e instanceof Error ? e.message : "Unknown error";
        return null;
      } finally {
        this.loading = false;
      }
    },

    async deleteBook(id: number) {
      console.log("deleteBook");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/books/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Delete failed");

        this.books = this.books.filter((b) => b.id !== id);
        return true;
      } catch (e) {
        if (e instanceof Error) {
          this.error = e.message;
        } else {
          this.error = "Unknown error";
        }
        return false;
      }
    },

    async createBook(payload: BookCreatePayload): Promise<Book | null> {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/books`,
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

        const created = (await res.json()) as Book;

        // Ajouter à la liste locale
        this.books.push(created);
        this.currentBook = created;

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
