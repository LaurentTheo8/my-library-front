<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { Author } from "~/types/Author";

// Déstructuration des props pour éviter les warnings
const { authors, modelValue, loading } = defineProps<{
  authors: Author[];
  modelValue: number | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void;
}>();

function updateAuthor(id: number | null) {
  emit("update:modelValue", id);
}
</script>

<template>
  <div class="w-full max-w-md">
    <label class="block font-semibold mb-1">Author</label>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 italic mb-2">
      Loading authors...
    </div>

    <!-- Select -->
    <div v-else class="relative">
      <select
        :value="modelValue"
        class="appearance-none border border-gray-300 px-4 py-2 w-full rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        required
        @change="e => updateAuthor(Number((e.target as HTMLSelectElement).value))"
      >
        <option disabled value="">Select an author</option>
        <option v-for="author in authors" :key="author.id" :value="author.id">
          {{ author.firstName }} {{ author.lastName }}
        </option>
      </select>

      <!-- Flèche custom -->
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
