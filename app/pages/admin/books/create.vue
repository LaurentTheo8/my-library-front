<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useBookStore } from "~/stores/book";
import { useAuthorStore } from "~/stores/author";
import { useCategoryStore } from "~/stores/category";
import AuthorSelector from "~/components/AuthorSelector.vue";
import CategorySelector from "~/components/CategorySelector.vue";

const router = useRouter();
const bookStore = useBookStore();
const authorStore = useAuthorStore();
const categoryStore = useCategoryStore();

const isSubmitting = ref(false);

// Form bindings
const title = ref("");
const description = ref<string | null>(null);
const publishedAt = ref<string | null>(null);
const selectedAuthorId = ref<number | null>(null);
const selectedCategoryIds = ref<number[]>([]);

onMounted(async () => {
  await Promise.all([
    authorStore.fetchAuthors(),
    categoryStore.fetchCategories(),
  ]);
});

async function createBook() {
  if (!selectedAuthorId.value) {
    alert("Please select an author");
    return;
  }

  const payload = {
    title: title.value,
    description: description.value,
    publishedAt: publishedAt.value,
    author: `/api/authors/${selectedAuthorId.value}`,
    categories: selectedCategoryIds.value.map((id) => `/api/categories/${id}`),
  };

  try {
    isSubmitting.value = true;
    const created = await bookStore.createBook(payload);
    if (created) router.push("/admin/books");
  } catch (err) {
    alert("Error creating book: " + err);
  } finally {
    isSubmitting.value = false;
  }
}

function cancel() {
  router.push("/admin/books");
}

const isFormValid = computed(() => {
  return (
    title.value.trim() !== "" &&
    publishedAt.value?.trim() !== "" &&
    selectedAuthorId.value !== null
  );
});
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Create New Book</h1>

    <form class="space-y-4" @submit.prevent="createBook">
      <!-- Title -->
      <div>
        <label class="block font-medium mb-1">Title</label>
        <input
          v-model="title"
          type="text"
          class="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block font-medium mb-1">Description</label>
        <textarea
          v-model="description"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Published Date -->
      <div>
        <label class="block font-medium mb-1">Published At</label>
        <input
          v-model="publishedAt"
          type="date"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <AuthorSelector
        v-model="selectedAuthorId"
        :authors="authorStore.authors"
        :loading="authorStore.loading"
      />

      <CategorySelector
        v-model="selectedCategoryIds"
        :categories="categoryStore.categories"
        :loading="categoryStore.loading"
      />

      <!-- Buttons -->
      <div class="flex gap-2 mt-4">
        <button
          type="submit"
          :disabled="!isFormValid || isSubmitting"
          :class="[
            'px-4 py-2 rounded text-white transition',
            isFormValid && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed',
          ]"
        >
          <span
            v-if="isSubmitting"
            class="loader-border animate-spin inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent"
          ></span>
          {{ isSubmitting ? "Creating..." : "Create" }}
        </button>
        <button
          type="button"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          @click="cancel"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
