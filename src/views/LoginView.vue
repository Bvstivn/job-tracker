<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div
      class="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center"
    >
      <h1 class="text-3xl font-bold text-white mb-2">Job Tracker</h1>
      <p class="text-gray-400 mb-8">
        Gestionando postulaciones como un verdadero pro
      </p>
      <div
        v-if="errorMessage"
        class="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm"
      >
        {{ errorMessage }}
      </div>
      <button
      @click="handleLogin"
      :disabled="isLoading"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300 flex items-center justify-center gap-2"
      >
      <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 0.507 5.387 0 12s5.36 12 12 12c3.627 0 6.373-1.2 8.52-3.413 2.187-2.187 2.973-5.36 2.973-7.947 0-.547-.053-1.08-.16-1.6h-9.853z"/></svg>
        {{ isLoading ? 'Cargando...' : 'Iniciar sesión con Google' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
//Stores
import { useAuthStore } from "../stores/auth";
//Router
import { useRouter } from "vue-router";
//Vue
import { ref } from "vue";

const router = useRouter();
const auth = useAuthStore();

const isLoading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    await auth.loginWithGoogle();
    router.push("/dashboard");
  } catch (error) {
    errorMessage.value = "Error al iniciar sesión.";
  } finally {
    isLoading.value = false;
  }
};
</script>
