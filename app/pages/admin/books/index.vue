<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBookStore } from "~/stores/book";

const router = useRouter();
const bookStore = useBookStore();

function createBook() {
  router.push("/admin/books/create");
}

function editBook(id: number) {
  router.push(`/admin/books/${id}/edit`);
}

async function handleDeleteBook(id: number) {
  if (!confirm("Are you sure you want to delete this book?")) return;
  const success = await bookStore.deleteBook(id);
  if (!success) {
    alert("Error deleting book");
  }
}

onMounted(() => {
  bookStore.fetchBooks();
});
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Books</h1>
      <button
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        @click="createBook"
      >
        Create Book
      </button>
    </div>

    <div v-if="bookStore.loading">Loading...</div>
    <div v-if="bookStore.error" class="text-red-600">{{ bookStore.error }}</div>

    <table
      v-if="!bookStore.loading && bookStore.books.length"
      class="w-full border border-gray-300"
    >
      <thead class="bg-gray-100">
        <tr>
          <th class="border px-4 py-2">Title</th>
          <th class="border px-4 py-2">Author</th>
          <th class="border px-4 py-2">Categories</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in bookStore.books" :key="book.id">
          <td class="border px-4 py-2">{{ book.title }}</td>
          <td class="border px-4 py-2">
            {{ book.author.firstName }} {{ book.author.lastName }}
          </td>
          <td class="border px-4 py-2">
            {{ book.categories.map((c) => c.name).join(", ") }}
          </td>
          <td class="border px-4 py-2 space-x-2">
            <button
              class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              @click="editBook(book.id)"
            >
              Edit
            </button>
            <button
              class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              @click="handleDeleteBook(book.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!bookStore.loading && bookStore.books.length === 0">
      No books found.
    </div>
  </div>
</template>
