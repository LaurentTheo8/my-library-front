<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBookStore } from "~/stores/book";
import { useAuthorStore } from "~/stores/author";
import { useCategoryStore } from "~/stores/category";

const route = useRoute();
const router = useRouter();

const bookStore = useBookStore();
const authorStore = useAuthorStore();
const categoryStore = useCategoryStore();

// IDs pour le binding des selects
const selectedAuthorId = ref<number | null>(null);
const selectedCategoryIds = ref<number[]>([]);

// Stocker un clone pour rollback
let originalBook: typeof bookStore.currentBook | null = null;

onMounted(async () => {
  await Promise.all([
    authorStore.fetchAuthors(),
    categoryStore.fetchCategories(),
    bookStore.fetchBookById(Number(route.params.id)),
  ]);

  // Initialiser les selects à partir du book existant
  if (bookStore.currentBook) {
    console.log("init original book");
    originalBook = JSON.parse(JSON.stringify(bookStore.currentBook));
    selectedAuthorId.value = bookStore.currentBook.author?.id || null;
    selectedCategoryIds.value =
      bookStore.currentBook.categories?.map((c) => c.id) || [];
  }
});

async function saveChanges() {
  const current = bookStore.currentBook;
  if (!current) return;

  // Préparer le payload avec IRIs pour API Platform
  const payload = {
    ...current,
    author: selectedAuthorId.value
      ? `/api/authors/${selectedAuthorId.value}`
      : null,
    categories: selectedCategoryIds.value.map((id) => `/api/categories/${id}`),
  };

  try {
    const updated = await bookStore.updateBook(payload);
    if (updated) {
      // Mettre à jour la liste locale et currentBook seulement après succès
      const bookInList = bookStore.books.find((b) => b.id === updated.id);
      if (bookInList) Object.assign(bookInList, updated);
      bookStore.currentBook = updated;

      router.push("/admin/books");
    }
  } catch (err) {
    // Rollback du currentBook
    if (originalBook && bookStore.currentBook) {
      Object.assign(bookStore.currentBook, originalBook);
    }
    alert("Error while editing: " + err);
  }
}

function cancelEdit() {
  router.push("/admin/books");
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Edit Book</h1>

    <div v-if="bookStore.loading">Loading…</div>
    <div v-if="bookStore.error" class="text-red-600">{{ bookStore.error }}</div>

    <form
      v-if="bookStore.currentBook"
      class="space-y-4"
      @submit.prevent="saveChanges"
    >
      <div>
        <label class="block font-semibold mb-1">Title</label>
        <input
          v-model="bookStore.currentBook.title"
          type="text"
          class="border px-3 py-2 w-full"
        />
      </div>

      <div>
        <label class="block font-semibold mb-1">Description</label>
        <textarea
          v-model="bookStore.currentBook.description"
          class="border px-3 py-2 w-full"
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

      <div class="flex gap-2">
        <button
          type="submit"
          class="px-4 py-2 rounded text-white transition bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Save changes
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded text-white transition bg-gray-500 hover:bg-gray-600"
          @click="cancelEdit"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
