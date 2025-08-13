<script setup lang="ts">
import { useAuthStore } from "~/stores/auth"; // Example auth store
import type { UserRole } from "~/types/User";
const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white shadow-md py-16">
      <div class="container mx-auto px-6 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to <span class="text-blue-600">MyLibrary</span>
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Easily manage your books, authors, and categories with an intuitive
          interface and powerful tools. Our app helps you organize, search, and
          maintain your collection.
        </p>
        <div class="mt-8">
          <NuxtLink
            to="/public/books"
            class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Explore the Library
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
          Key Features
        </h2>
        <div class="grid gap-8 md:grid-cols-3">
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <div class="text-blue-600 text-5xl mb-4">📚</div>
            <h3 class="text-xl font-semibold mb-2">Book Management</h3>
            <p class="text-gray-600">
              Add, edit, and delete your books easily, and link them to authors
              and categories.
            </p>
          </div>
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <div class="text-blue-600 text-5xl mb-4">✍️</div>
            <h3 class="text-xl font-semibold mb-2">Organized Authors</h3>
            <p class="text-gray-600">
              Keep track of your authors, their works, and important dates.
            </p>
          </div>
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <div class="text-blue-600 text-5xl mb-4">🏷️</div>
            <h3 class="text-xl font-semibold mb-2">Custom Categories</h3>
            <p class="text-gray-600">
              Create categories to classify your books and make navigation
              smoother.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-blue-600 py-12 mt-8">
      <div class="container mx-auto px-6 text-center text-white">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">
          Ready to get started?
        </h2>
        <!-- Show CTA only if logged in and has role ADMIN or LIBRARIAN -->
        <NuxtLink
          v-if="authStore.isAuthenticated && (['ROLE_ADMIN', 'ROLE_LIBRAIRIAN'] as UserRole[]).some(r => authStore.user?.roles.includes(r))"
          to="/admin/books/create"
          class="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          Add Your First Book
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
