<script setup lang="ts">
import { onMounted } from "vue";
import { useCategoryStore } from "~/stores/category";
import CategoryCard from "~/components/card/Category.vue";

const categoryStore = useCategoryStore();

onMounted(() => {
  categoryStore.fetchCategories();
});
</script>

<template>
  <section class="categories-section">
    <h1 class="title">📂 Categories list</h1>

    <!-- Loading -->
    <div v-if="categoryStore.loading" class="loading">
      <span class="spinner"></span> Loading categories...
    </div>

    <!-- Error -->
    <div v-else-if="categoryStore.error" class="error">
      ⚠️ {{ categoryStore.error }}
    </div>

    <!-- No categories -->
    <div v-else-if="categoryStore.categories.length === 0" class="empty">
      No categories found.
    </div>

    <!-- Categories list -->
    <div v-else class="categories-grid">
      <CategoryCard
        v-for="category in categoryStore.categories"
        :key="category.id"
        :category="category"
      />
    </div>
  </section>
</template>

<style scoped>
.categories-section {
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
  border-top-color: #28a745;
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

.categories-grid {
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
