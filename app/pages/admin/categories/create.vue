<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useCategoryStore } from "~/stores/category";

const router = useRouter();
const categoryStore = useCategoryStore();

const name = ref("");
const description = ref<string | null>(null);

const isFormValid = computed(() => name.value.trim() !== "");

async function createCategory() {
  try {
    await categoryStore.createCategory({
      name: name.value,
      description: description.value,
    });
    router.push("/admin/categories");
  } catch (err) {
    alert("Error creating category: " + err);
  }
}

function cancel() {
  router.push("/admin/categories");
}
</script>

<template>
  <div class="max-w-xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Create New Category</h1>

    <form class="space-y-4" @submit.prevent="createCategory">
      <div>
        <label class="block font-medium mb-1">Name</label>
        <input
          v-model="name"
          type="text"
          class="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label class="block font-medium mb-1">Description</label>
        <textarea
          v-model="description"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <div class="flex gap-2 mt-4">
        <button
          type="submit"
          :disabled="!isFormValid"
          :class="[
            'px-4 py-2 rounded text-white transition',
            isFormValid
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed',
          ]"
        >
          Create
        </button>
        <button
          type="button"
          class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          @click="cancel"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
