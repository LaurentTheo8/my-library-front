<script setup lang="ts">
defineProps<{
  category: {
    id: number;
    name: string;
    description?: string | null;
  };
}>();
</script>

<template>
  <div class="category-card">
    <h3 class="name">{{ category.name }}</h3>
    <p v-if="category.description" class="description">
      {{ category.description }}
    </p>
    <NuxtLink :to="`/public/categories/${category.id}`" class="details-btn">
      📂 See details
    </NuxtLink>
  </div>
</template>

<style scoped>
.category-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 1rem;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}

.category-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.description {
  color: #666;
  font-size: 0.95rem;
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
  width: fit-content;
}

.details-btn:hover {
  background-color: #1e7e34;
}
</style>
