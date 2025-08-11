<script setup lang="ts">
defineProps<{
  author: {
    id: number;
    firstName: string;
    lastName: string;
    birthDate?: string | null;
    books?: { id: number; title: string }[];
  };
}>();
</script>

<template>
  <div class="author-card">
    <h3 class="name">{{ author.firstName }} {{ author.lastName }}</h3>
    <p v-if="author.birthDate" class="birthdate">
      🎂 Born on: {{ new Date(author.birthDate).toLocaleDateString() }}
    </p>
    <NuxtLink :to="`/public/authors/${author.id}`" class="details-btn">
      👤 See details
    </NuxtLink>
  </div>
</template>

<style scoped>
.author-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 1rem;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.author-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.birthdate {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.details-btn {
  display: inline-block;
  background-color: #28a745;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.details-btn:hover {
  background-color: #1e7e34;
}
</style>
