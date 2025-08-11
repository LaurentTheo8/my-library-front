<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const auth = useAuthStore();
const router = useRouter();
const error = ref("");
const loading = ref(false);

const isEmailValid = computed(() => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.value);
});

async function handleRegister() {
  error.value = "";
  if (!isEmailValid.value) {
    error.value = "Please enter a valid email address";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  loading.value = true;
  try {
    const res = await fetch(
      `${useRuntimeConfig().public.apiBase}/api/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value, password: password.value }),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      error.value = data.message || "Registration failed";
      loading.value = false;
      return;
    }

    const success = await auth.login(email.value, password.value);
    loading.value = false;
    if (success) {
      router.push("/");
    } else {
      error.value = "Login failed after registration";
    }
  } catch (e) {
    error.value = "Unexpected error during registration";
    loading.value = false;
    console.error(e);
  }
}
</script>

<template>
  <form class="max-w-md mx-auto p-4 space-y-4" @submit.prevent="handleRegister">
    <h1 class="text-2xl font-bold mb-4">Create an account</h1>

    <div>
      <label for="email" class="block font-semibold mb-1">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        :class="[
          'w-full border rounded px-3 py-2',
          email && !isEmailValid ? 'border-red-500' : 'border-gray-300',
        ]"
      />
      <p v-if="email && !isEmailValid" class="text-red-600 text-sm mt-1">
        Please enter a valid email address.
      </p>
    </div>

    <div>
      <label for="password" class="block font-semibold mb-1">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        class="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>

    <div>
      <label for="confirmPassword" class="block font-semibold mb-1"
        >Confirm Password</label
      >
      <input
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        required
        class="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>

    <div v-if="error" class="text-red-600 font-semibold">{{ error }}</div>

    <button
      type="submit"
      :disabled="loading || !isEmailValid"
      class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="loading">Registering...</span>
      <span v-else>Register</span>
    </button>
  </form>
</template>
