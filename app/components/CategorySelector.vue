<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { Category } from "~/types/Category";

const props = defineProps<{
  categories: Category[];
  modelValue: number[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number[]): void;
}>();

function toggleCategory(id: number) {
  const newValue = props.modelValue.includes(id)
    ? props.modelValue.filter((c) => c !== id)
    : [...props.modelValue, id];
  emit("update:modelValue", newValue);
}
</script>

<template>
  <div>
    <label class="block font-semibold mb-1">Categories</label>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 italic mb-2">
      Loading categories...
    </div>

    <!-- Buttons multi-select -->
    <div v-else class="flex flex-wrap gap-2">
      <template v-for="category in categories" :key="category.id">
        <button
          type="button"
          :class="[
            'px-3 py-1 rounded-full transition',
            modelValue.includes(category.id)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
          ]"
          @click="toggleCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </template>
    </div>
  </div>
</template>
