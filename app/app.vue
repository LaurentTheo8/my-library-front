<script setup lang="ts">
import { useAuthStore } from "./stores/auth";

const auth = useAuthStore();
auth.initialize();
</script>

<template>
  <div class="font-Montserrat text-dire-wolf">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
