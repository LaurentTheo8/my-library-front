<script setup lang="ts">
definePageMeta({
  middleware: ["role"],
  role: ["ROLE_ADMIN", "ROLE_LIBRAIRIAN"],
});
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Admin - Authors edit</h1>
  </div>
</template>
