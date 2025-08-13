<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthorStore } from "~/stores/author";
import AuthorCard from "~/components/card/Author.vue";

const authorStore = useAuthorStore();

onMounted(() => {
  authorStore.fetchAuthors();
});
</script>

<template>
  <section class="authors-section">
    <h1 class="title">👩‍🏫 Authors list</h1>

    <!-- Loading -->
    <div v-if="authorStore.loading" class="loading">
      <span class="spinner"></span> Loading authors...
    </div>

    <!-- Error -->
    <div v-else-if="authorStore.error" class="error">
      ⚠️ {{ authorStore.error }}
    </div>

    <!-- No authors -->
    <div v-else-if="authorStore.authors.length === 0" class="empty">
      No authors found.
    </div>

    <!-- Authors list -->
    <div v-else class="authors-grid">
      <AuthorCard
        v-for="author in authorStore.authors"
        :key="author.id"
        :author="author"
      />
    </div>
  </section>
</template>

<style scoped>
.authors-section {
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

.authors-grid {
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
