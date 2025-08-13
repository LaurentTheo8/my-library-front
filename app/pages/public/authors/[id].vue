<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, watch } from "vue";

const route = useRoute();
const authorStore = useAuthorStore();

onMounted(() => {
  const id = Number(route.params.id);
  if (!isNaN(id)) {
    authorStore.fetchAuthorById(id);
  }
});

watch(
  () => route.params.id,
  (newId) => {
    const id = Number(newId);
    if (!isNaN(id)) {
      authorStore.fetchAuthorById(id);
    }
  }
);
</script>

<template>
  <section class="author-container">
    <div v-if="authorStore.loading" class="loader">
      <span class="spinner"></span> Loading the author...
    </div>

    <div v-else-if="authorStore.error" class="error-card">
      ❌ {{ authorStore.error }}
    </div>

    <div v-else-if="authorStore.currentAuthor" class="author-card">
      <h1 class="name">
        {{ authorStore.currentAuthor.firstName }}
        {{ authorStore.currentAuthor.lastName }}
      </h1>

      <p class="birthdate">
        <strong>Birthdate :</strong>
        {{
          authorStore.currentAuthor.birthDate
            ? new Date(authorStore.currentAuthor.birthDate).toLocaleDateString()
            : "N/A"
        }}
      </p>

      <div v-if="authorStore.currentAuthor.books?.length" class="books">
        <h2>Books</h2>
        <ul>
          <li v-for="book in authorStore.currentAuthor.books" :key="book.id">
            <NuxtLink :to="`/public/books/${book.id}`">{{
              book.title
            }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="empty">👤 Author not found.</div>
  </section>
</template>

<style scoped>
.author-container {
  max-width: 700px;
  margin: auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

.name {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.birthdate {
  margin: 0.5rem 0 1.5rem;
}

.books {
  margin-top: 1rem;
}

.books ul {
  padding-left: 1.2rem;
  list-style-type: disc;
}

.author-card {
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
