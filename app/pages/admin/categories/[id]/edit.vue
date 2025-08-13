<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCategoryStore } from "~/stores/category";

const router = useRouter();
const route = useRoute();
const categoryStore = useCategoryStore();

const categoryId = Number(route.params.id);
const name = ref("");
const description = ref("");
const loading = ref(false);
const error = ref<string | null>(null);

// Cloner la catégorie pour rollback si nécessaire
let originalCategory: (typeof categoryStore.categories)[0] | null = null;

onMounted(async () => {
  loading.value = true;
  await categoryStore.fetchCategories();

  const category = categoryStore.categories.find((c) => c.id === categoryId);
  if (!category) {
    error.value = "Category not found";
    loading.value = false;
    return;
  }

  originalCategory = JSON.parse(JSON.stringify(category));
  name.value = category.name;
  description.value = category.description || "";
  loading.value = false;
});

async function updateCategory() {
  loading.value = true;
  error.value = null;

  try {
    const updated = await categoryStore.updateCategory({
      id: categoryId,
      name: name.value,
      description: description.value || null,
    });

    if (updated) {
      // Mettre à jour la catégorie dans la liste locale
      const index = categoryStore.categories.findIndex(
        (c) => c.id === updated.id
      );
      if (index !== -1) categoryStore.categories[index] = updated;

      router.push("/admin/categories");
    } else {
      throw new Error(categoryStore.error || "Failed to update category");
    }
  } catch (e: unknown) {
    if (originalCategory) {
      const index = categoryStore.categories.findIndex(
        (c) => c.id === categoryId
      );
      if (index !== -1) categoryStore.categories[index] = originalCategory;
    }
    error.value = e instanceof Error ? e.message : "Unknown error";
  } finally {
    loading.value = false;
  }
}

function cancelEdit() {
  router.push("/admin/categories");
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Edit Category</h1>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>

    <form v-if="!loading" class="space-y-4" @submit.prevent="updateCategory">
      <div>
        <label class="block mb-1 font-semibold">Name</label>
        <input
          v-model="name"
          type="text"
          class="border px-3 py-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label class="block mb-1 font-semibold">Description</label>
        <textarea
          v-model="description"
          class="border px-3 py-2 w-full rounded"
          rows="4"
        />
      </div>

      <div class="flex gap-2">
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Category
        </button>
        <button
          type="button"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          @click="cancelEdit"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
