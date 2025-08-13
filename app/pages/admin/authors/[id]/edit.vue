<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthorStore } from "~/stores/author";

const route = useRoute();
const router = useRouter();
const authorStore = useAuthorStore();

// Stocker un clone pour rollback
let originalAuthor: typeof authorStore.currentAuthor | null = null;

onMounted(async () => {
  const id = Number(route.params.id);
  await authorStore.fetchAuthorById(id);

  if (authorStore.currentAuthor) {
    originalAuthor = JSON.parse(JSON.stringify(authorStore.currentAuthor));
  }
});

async function saveChanges() {
  const current = authorStore.currentAuthor;
  if (!current) return;

  const payload = {
    ...current,
  };

  try {
    const updated = await authorStore.updateAuthor(payload);
    if (updated) {
      // Mettre à jour la liste locale et currentAuthor seulement après succès
      const authorInList = authorStore.authors.find((a) => a.id === updated.id);
      if (authorInList) Object.assign(authorInList, updated);
      authorStore.currentAuthor = updated;

      router.push("/admin/authors");
    }
  } catch (err) {
    // Rollback du currentAuthor
    if (originalAuthor && authorStore.currentAuthor) {
      Object.assign(authorStore.currentAuthor, originalAuthor);
    }
    alert("Error while editing: " + err);
  }
}

function cancelEdit() {
  router.push("/admin/authors");
}

function formatDateForInput(dateString: string | null | undefined) {
  if (!dateString) return "";
  // Si c'est déjà YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  return dateString.split("T")[0];
}

function updateBirthDate(event: Event) {
  if (!authorStore.currentAuthor) return; // <-- check ici
  const target = event.target as HTMLInputElement | null;
  if (!target) return;
  authorStore.currentAuthor.birthDate = target.value || null;
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Edit Author</h1>

    <div v-if="authorStore.loading">Loading…</div>
    <div v-if="authorStore.error" class="text-red-600">
      {{ authorStore.error }}
    </div>

    <form
      v-if="authorStore.currentAuthor"
      class="space-y-4"
      @submit.prevent="saveChanges"
    >
      <!-- First Name -->
      <div>
        <label class="block font-semibold mb-1">First Name</label>
        <input
          v-model="authorStore.currentAuthor.firstName"
          type="text"
          class="border px-3 py-2 w-full"
        />
      </div>

      <!-- Last Name -->
      <div>
        <label class="block font-semibold mb-1">Last Name</label>
        <input
          v-model="authorStore.currentAuthor.lastName"
          type="text"
          class="border px-3 py-2 w-full"
        />
      </div>

      <!-- Birth Date -->
      <div>
        <label class="block font-semibold mb-1">Birth Date</label>
        <input
          :value="formatDateForInput(authorStore.currentAuthor?.birthDate)"
          type="date"
          class="border px-3 py-2 w-full"
          @input="updateBirthDate"
        />
      </div>

      <div class="flex gap-2">
        <button
          type="submit"
          class="px-4 py-2 rounded text-white transition bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Save changes
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded text-white transition bg-gray-500 hover:bg-gray-600"
          @click="cancelEdit"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
