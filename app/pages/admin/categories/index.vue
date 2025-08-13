<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCategoryStore } from "~/stores/category";

const router = useRouter();
const categoryStore = useCategoryStore();
const bookStore = useBookStore();

function createCategory() {
  router.push("/admin/categories/create");
}

function editCategory(id: number) {
  router.push(`/admin/categories/${id}/edit`);
}

async function handleDeleteCategory(id: number) {
  if (!confirm("Are you sure you want to delete this category?")) return;
  const success = await categoryStore.deleteCategory(id);
  if (success) {
    // Reset du store de books pour forcer un re-fetch
    bookStore.fetched = false;

    alert("Category deleted successfully");
  } else {
    alert("Error deleting category");
  }
}

onMounted(() => {
  categoryStore.fetchCategories();
});
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Categories</h1>
      <button
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        @click="createCategory"
      >
        Create Category
      </button>
    </div>

    <div v-if="categoryStore.loading">Loading...</div>
    <div v-if="categoryStore.error" class="text-red-600">
      {{ categoryStore.error }}
    </div>

    <table
      v-if="!categoryStore.loading && categoryStore.categories.length"
      class="w-full border border-gray-300"
    >
      <thead class="bg-gray-100">
        <tr>
          <th class="border px-4 py-2">Name</th>
          <th class="border px-4 py-2">Description</th>
          <th class="border px-4 py-2">Books</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categoryStore.categories" :key="category.id">
          <td class="border px-4 py-2">{{ category.name }}</td>
          <td class="border px-4 py-2">{{ category.description || "-" }}</td>
          <td class="border px-4 py-2">
            {{ category.books?.map((b) => b.title).join(", ") || "-" }}
          </td>
          <td class="border px-4 py-2 space-x-2">
            <button
              class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              @click="editCategory(category.id)"
            >
              Edit
            </button>
            <button
              class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              @click="handleDeleteCategory(category.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!categoryStore.loading && categoryStore.categories.length === 0">
      No categories found.
    </div>
  </div>
</template>
