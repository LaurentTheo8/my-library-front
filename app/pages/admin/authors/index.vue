<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthorStore } from "~/stores/author";

const router = useRouter();
const authorStore = useAuthorStore();
const bookStore = useBookStore();

function createAuthor() {
  router.push("/admin/authors/create");
}

function editAuthor(id: number) {
  router.push(`/admin/authors/${id}/edit`);
}

async function handleDeleteAuthor(id: number) {
  if (!confirm("Are you sure you want to delete this author?")) return;
  const success = await authorStore.deleteAuthor(id);
  if (success) {
    bookStore.fetched = false;
    alert("Category deleted successfully");
  } else {
    alert("Error deleting author");
  }
}

onMounted(() => {
  authorStore.fetchAuthors();
});
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Authors</h1>
      <button
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        @click="createAuthor"
      >
        Create Author
      </button>
    </div>

    <div v-if="authorStore.loading">Loading...</div>
    <div v-if="authorStore.error" class="text-red-600">
      {{ authorStore.error }}
    </div>

    <table
      v-if="!authorStore.loading && authorStore.authors.length"
      class="w-full border border-gray-300"
    >
      <thead class="bg-gray-100">
        <tr>
          <th class="border px-4 py-2">First Name</th>
          <th class="border px-4 py-2">Last Name</th>
          <th class="border px-4 py-2">Birth Date</th>
          <th class="border px-4 py-2">Books</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="author in authorStore.authors" :key="author.id">
          <td class="border px-4 py-2">{{ author.firstName }}</td>
          <td class="border px-4 py-2">{{ author.lastName }}</td>
          <td class="border px-4 py-2">{{ author.birthDate || "-" }}</td>
          <td class="border px-4 py-2">
            {{ author.books?.map((b) => b.title).join(", ") || "-" }}
          </td>
          <td class="border px-4 py-2 space-x-2">
            <button
              class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              @click="editAuthor(author.id)"
            >
              Edit
            </button>
            <button
              class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              @click="handleDeleteAuthor(author.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!authorStore.loading && authorStore.authors.length === 0">
      No authors found.
    </div>
  </div>
</template>
