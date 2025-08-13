<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, watch } from "vue";

const route = useRoute();
const bookStore = useBookStore();

onMounted(() => {
  const id = Number(route.params.id);
  if (!isNaN(id)) {
    bookStore.fetchBookById(id);
  }
});

watch(
  () => route.params.id,
  (newId) => {
    const id = Number(newId);
    if (!isNaN(id)) {
      bookStore.fetchBookById(id);
    }
  }
);
</script>

<template>
  <section class="book-container">
    <div v-if="bookStore.loading" class="loader">
      <span class="spinner"></span> Loading the book...
    </div>

    <div v-else-if="bookStore.error" class="error-card">
      ❌ {{ bookStore.error }}
    </div>

    <div v-else-if="bookStore.currentBook" class="book-card">
      <h1 class="title">{{ bookStore.currentBook.title }}</h1>

      <p class="author">
        <strong>Author :</strong>
        {{ bookStore.currentBook.author?.firstName }}
        {{ bookStore.currentBook.author?.lastName }}
      </p>

      <p class="description">
        <strong>Description :</strong>
        <span>{{
          bookStore.currentBook.description || "Aucune description"
        }}</span>
      </p>

      <p class="pub-date">
        <strong>Publication date :</strong>
        {{
          bookStore.currentBook.publishedAt
            ? new Date(bookStore.currentBook.publishedAt).toLocaleDateString()
            : "N/A"
        }}
      </p>

      <div v-if="bookStore.currentBook.categories?.length" class="categories">
        <h2>Categories</h2>
        <ul>
          <li v-for="cat in bookStore.currentBook.categories" :key="cat.id">
            {{ cat.name }}
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="empty">📚 Book not found.</div>
  </section>
</template>

<style scoped>
.book-container {
  max-width: 700px;
  margin: auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.author,
.description,
.pub-date {
  margin: 0.5rem 0;
}

.categories {
  margin-top: 1rem;
}

.categories ul {
  padding-left: 1.2rem;
  list-style-type: disc;
}

.book-card {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.error-card {
  background: #ffe5e5;
  padding: 1rem;
  border: 1px solid #ffb3b3;
  border-radius: 6px;
  color: #b30000;
}

.empty {
  text-align: center;
  color: #777;
}

.loader {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid #ccc;
  border-top: 3px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
