<script setup lang="ts">
defineProps<{
  book: {
    id: number;
    title: string;
    author: {
      firstName: string;
      lastName: string;
    };
  };
}>();
</script>

<template>
  <div class="book-card">
    <h3 class="title">{{ book.title }}</h3>
    <p class="author">
      ✍️ {{ book.author.firstName }} {{ book.author.lastName }}
    </p>
    <NuxtLink :to="`/public/books/${book.id}`" class="details-btn">
      📖 See details
    </NuxtLink>
  </div>
</template>

<style scoped>
.book-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 1rem;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.book-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.author {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.details-btn {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.details-btn:hover {
  background-color: #0056b3;
}
</style>
