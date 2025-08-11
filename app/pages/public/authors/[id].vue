<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import type { Author } from "~/types/Author";
import { useAuthStore } from "~/stores/auth";

const route = useRoute();
const author = ref<Author | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const auth = useAuthStore();

async function fetchAuthor(id: string) {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch(
      `${useRuntimeConfig().public.apiBase}/api/authors/${id}`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch author (status: ${res.status})`);
    }
    author.value = await res.json();
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = "Erreur inconnue";
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const id = route.params.id as string;
  fetchAuthor(id);
});
</script>

<template>
  <section class="author-container">
    <div v-if="loading" class="loader">
      <span class="spinner"></span> Loading the author...
    </div>

    <div v-else-if="error" class="error-card">❌ {{ error }}</div>

    <div v-else-if="author" class="author-card">
      <h1 class="name">{{ author.firstName }} {{ author.lastName }}</h1>

      <p class="birthdate">
        <strong>Birthdate :</strong>
        {{
          author.birthDate
            ? new Date(author.birthDate).toLocaleDateString()
            : "N/A"
        }}
      </p>

      <div v-if="author.books?.length" class="books">
        <h2>Books</h2>
        <ul>
          <li v-for="book in author.books" :key="book.id">
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
