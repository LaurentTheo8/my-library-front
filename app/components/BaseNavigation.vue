<script setup lang="ts">
import { NuxtLink } from "#components";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";
import type { UserRole } from "~/types/User";

const auth = useAuthStore();
const router = useRouter();

function handleLogout() {
  auth.logout();
  router.push("/auth/login");
}

const publicLinks = [
  { name: "Home", to: "/" },
  { name: "Books", to: "/public/books" },
  { name: "Authors", to: "/public/authors" },
  { name: "Categories", to: "/public/categories" },
];

const adminLinks: { name: string; to: string; roles: UserRole[] }[] = [
  {
    name: "Admin Books",
    to: "/admin/books",
    roles: ["ROLE_ADMIN", "ROLE_LIBRAIRIAN"],
  },
  {
    name: "Admin Authors",
    to: "/admin/authors",
    roles: ["ROLE_ADMIN", "ROLE_LIBRAIRIAN"],
  },
  { name: "Admin Categories", to: "/admin/categories", roles: ["ROLE_ADMIN"] },
];

const showAdminDropdown = ref(false);

const isAdmin = computed(() =>
  auth.user?.roles.some((role) =>
    ["ROLE_ADMIN", "ROLE_LIBRAIRIAN"].includes(role)
  )
);

const accessibleAdminLinks = computed(() => {
  if (!auth.isAuthenticated || !auth.user) return [];
  return adminLinks.filter((link) =>
    link.roles.some((role) => auth.user!.roles.includes(role))
  );
});

const accessibleLinks = computed(() => {
  if (!auth.isAuthenticated) {
    return publicLinks.filter((link) => link.name === "Home");
  }
  return publicLinks;
});
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
        <!-- Liens publics -->
        <li v-for="link in accessibleLinks" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="px-4 py-2 rounded-md text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {{ link.name }}
          </NuxtLink>
        </li>

        <!-- Menu Admin avec dropdown -->
        <li v-if="isAdmin" class="relative">
          <button
            class="px-4 py-2 rounded-md text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            @click="showAdminDropdown = !showAdminDropdown"
          >
            Admin ▼
          </button>

          <ul
            v-show="showAdminDropdown"
            class="absolute right-0 mt-1 w-40 bg-white border rounded shadow-md z-10"
          >
            <li
              v-for="link in accessibleAdminLinks"
              :key="link.to"
              class="px-4 py-2 hover:bg-indigo-100"
            >
              <NuxtLink :to="link.to" @click="showAdminDropdown = false">
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </li>

        <!-- Bouton logout si connecté -->
        <li v-if="auth.isAuthenticated">
          <button
            class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-300"
            @click="handleLogout"
          >
            Logout
          </button>
        </li>

        <!-- Sinon lien login -->
        <template v-else>
          <li>
            <NuxtLink
              to="/auth/login"
              class="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >Login</NuxtLink
            >
          </li>
        </template>
      </ul>
    </nav>
  </header>
</template>
