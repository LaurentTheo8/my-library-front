<script setup lang="ts">
const router = useRouter();

function goBack() {
  router.back();
}
</script>
<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100"
  >
    <h1 class="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
    <p class="text-lg mb-6 text-gray-700 text-center max-w-md">
      You do not have permission to access this page.
    </p>
    <button
      @click="goBack"
      class="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
    >
      Go Back
    </button>
  </div>
</template>
