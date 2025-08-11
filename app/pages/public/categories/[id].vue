<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import type { Category } from "~/types/Category";

const route = useRoute();
const category = ref<Category | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const auth = useAuthStore();

async function fetchCategory(id: string) {
  loading.value = true;
  error.value = null;

  try {
    const res = await fetch(
      `${useRuntimeConfig().public.apiBase}/api/categories/${id}`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch category (status: ${res.status})`);
    }

    category.value = await res.json();
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = "Unknown error";
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const id = route.params.id as string;
  fetchCategory(id);
});
</script>

<template>
  <section class="category-details-container">
    <div v-if="loading" class="loader">
      <span class="spinner"></span> Loading category...
    </div>

    <div v-else-if="error" class="error-card">❌ {{ error }}</div>

    <div v-else-if="category" class="category-card">
      <h1 class="title">{{ category.name }}</h1>

      <p class="description">
        <strong>Description :</strong>
        <span>{{ category.description || "No description available." }}</span>
      </p>

      <div v-if="category.books?.length" class="books-list">
        <h2>Books in this category</h2>
        <ul>
          <li v-for="book in category.books" :key="book.id">
            <NuxtLink :to="`/public/books/${book.id}`">{{
              book.title
            }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="empty">📂 Category not found.</div>
  </section>
</template>

<style scoped>
.category-details-container {
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

.description {
  margin-bottom: 1.5rem;
}

.books-list {
  margin-top: 1rem;
}

.books-list ul {
  padding-left: 1.2rem;
  list-style-type: disc;
}

.category-card {
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
  border-top: 3px solid #28a745;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
