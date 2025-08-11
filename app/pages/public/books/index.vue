<script setup lang="ts">
import { onMounted } from "vue";
import { useBookStore } from "~/stores/book";
import BookCard from "~/components/BookCard.vue";

const bookStore = useBookStore();

onMounted(() => {
  bookStore.fetchBooks();
});
</script>

<template>
  <section class="books-section">
    <h1 class="title">📚 Books list</h1>

    <!-- Loading -->
    <div v-if="bookStore.loading" class="loading">
      <span class="spinner"></span> Loading books...
    </div>

    <!-- Error -->
    <div v-else-if="bookStore.error" class="error">
      ⚠️ {{ bookStore.error }}
    </div>

    <!-- No books -->
    <div v-else-if="bookStore.books.length === 0" class="empty">
      No books found.
    </div>

    <!-- Books list -->
    <div v-else class="books-grid">
      <BookCard v-for="book in bookStore.books" :key="book.id" :book="book" />
    </div>
  </section>
</template>

<style scoped>
.books-section {
  padding: 1.5rem;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #ccc;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.error {
  color: #d9534f;
  background: #fbe9e9;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.empty {
  color: #888;
  font-style: italic;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
