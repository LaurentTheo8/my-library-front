<script setup lang="ts">
import { NuxtLink } from "#components";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function handleLogout() {
  auth.logout();
  router.push("/login"); // Redirige vers login après déconnexion
}
</script>

<template>
  <header class="py-4 border-b">
    <nav class="flex container items-center">
      <NuxtLink
        to="/"
        class="flex gap-1 items-center text-3xl font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
      >
        My-library
      </NuxtLink>

      <ul class="flex gap-6 ml-auto text-xl font-bold capitalize items-center">
        <!-- Si utilisateur connecté -->
        <template v-if="auth.isAuthenticated">
          <li>
            <NuxtLink
              to="/"
              class="px-4 py-2 rounded-md text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >Home</NuxtLink
            >
          </li>
          <li>
            <button
              class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-300"
              @click="handleLogout"
            >
              Logout
            </button>
          </li>
        </template>

        <!-- Si utilisateur non connecté -->
        <template v-else>
          <li>
            <NuxtLink
              to="/login"
              class="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >Login</NuxtLink
            >
          </li>
        </template>
      </ul>
    </nav>
  </header>
</template>
