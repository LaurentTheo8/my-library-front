<script setup lang="ts">
import { NuxtLink } from "#components";
</script>

<template>
  <header class="py-4 border-b">
    <nav class="flex container items-center">
      <NuxtLink to="/" class="flex gap-1 items-center">
        <span class="text-3xl font-bold">My-library</span>
      </NuxtLink>
      <ul class="flex gap-6 ml-auto text-xl font-bold capitalize">
        <li>
          <NuxtLink to="/">Home</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
