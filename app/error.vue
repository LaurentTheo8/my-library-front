<script setup>
definePageMeta({
  layout: "error",
});

const error = useError();
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100"
  >
    <h1 class="text-6xl font-bold mb-4">Error {{ error.statusCode }}</h1>
    <p class="mb-6">{{ error.message }}</p>
    <NuxtLink to="/" class="text-blue-600 hover:underline"
      >Go back home</NuxtLink
    >
  </div>
</template>
