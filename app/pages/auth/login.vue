<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const email = ref("");
const password = ref("");
const auth = useAuthStore();
const router = useRouter();
const errorMessage = ref("");
const loading = ref(false);

const isEmailValid = computed(() => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.value);
});

async function handleLogin() {
  errorMessage.value = "";

  if (!isEmailValid.value) {
    errorMessage.value = "Please enter a valid email address";
    return;
  }

  loading.value = true;
  const success = await auth.login(email.value, password.value);
  loading.value = false;

  if (success) {
    router.push("/"); // Redirection after login
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
        :class="[
          'w-full p-2 mb-2 border rounded',
          email && !isEmailValid ? 'border-red-500' : 'border-gray-300',
        ]"
      />
      <p v-if="email && !isEmailValid" class="text-red-600 text-sm mb-2">
        Please enter a valid email address.
      </p>

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        class="w-full p-2 mb-2 border border-gray-300 rounded"
      />

      <button
        type="submit"
        :disabled="loading || !isEmailValid"
        class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading">Logging in...</span>
        <span v-else>Login</span>
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
