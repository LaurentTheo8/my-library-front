<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthorStore } from "~/stores/author";

const router = useRouter();
const authorStore = useAuthorStore();

const isSubmitting = ref(false);

// Form bindings
const firstName = ref("");
const lastName = ref("");
const birthDate = ref<string | null>(null);

async function createAuthor() {
  const payload = {
    firstName: firstName.value,
    lastName: lastName.value,
    birthDate: birthDate.value,
  };

  try {
    isSubmitting.value = true;
    const created = await authorStore.createAuthor(payload);
    if (created) router.push("/admin/authors");
  } catch (err) {
    alert("Error creating author: " + err);
  } finally {
    isSubmitting.value = false;
  }
}

function cancel() {
  router.push("/admin/authors");
}

const isFormValid = computed(() => {
  return firstName.value.trim() !== "" && lastName.value.trim() !== "";
});
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Create New Author</h1>

    <form class="space-y-4" @submit.prevent="createAuthor">
      <!-- First Name -->
      <div>
        <label class="block font-medium mb-1">First Name</label>
        <input
          v-model="firstName"
          type="text"
          class="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <!-- Last Name -->
      <div>
        <label class="block font-medium mb-1">Last Name</label>
        <input
          v-model="lastName"
          type="text"
          class="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <!-- Birth Date -->
      <div>
        <label class="block font-medium mb-1">Birth Date</label>
        <input
          v-model="birthDate"
          type="date"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 mt-4">
        <button
          type="submit"
          :disabled="!isFormValid || isSubmitting"
          :class="[
            'px-4 py-2 rounded text-white transition',
            isFormValid && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed',
          ]"
        >
          <span
            v-if="isSubmitting"
            class="loader-border animate-spin inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent"
          />
          {{ isSubmitting ? "Creating..." : "Create" }}
        </button>
        <button
          type="button"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          @click="cancel"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
