<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const email = ref("");
const password = ref("");
const auth = useAuthStore();
const router = useRouter();
const errorMessage = ref("");

async function handleLogin() {
  errorMessage.value = "";
  const success = await auth.login(email.value, password.value);
  if (success) {
    router.push("/"); //Redirection after login
  } else {
    errorMessage.value = "Login failed. Please check your credentials.";
  }
}
</script>

<template>
  <div>
    <form class="max-w-sm mx-auto p-4" @submit.prevent="handleLogin">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        class="w-full p-2 mb-2 border rounded"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        class="w-full p-2 mb-2 border rounded"
      />
      <button
        type="submit"
        class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
      <p v-if="errorMessage" class="mt-2 text-red-600">{{ errorMessage }}</p>
    </form>

    <div class="max-w-sm mx-auto px-4 mt-4 text-center">
      <p class="text-gray-700">
        Don't have an account?
        <button
          class="text-blue-600 hover:underline font-semibold ml-1"
          type="button"
          @click="router.push('/auth/register')"
        >
          Register here
        </button>
      </p>
    </div>
  </div>
</template>
