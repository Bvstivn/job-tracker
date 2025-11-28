<template>
  <div class="min-h-screen bg-gray-900 text-white p-4 md:p-8">
    <div class="flex justify-between items-center mb-8 max-w-4xl mx-auto">
      <div>
        <h1 class="text-2xl font-bold text-blue-400">Job Tracker</h1>
        <p class="text-gray-400 text-sm">
          Hola, {{ authStore.user?.displayName }}
        </p>
      </div>
      <button
        @click="authStore.logout"
        class="text-sm bg-red-500/10 text-red-400 px-3 py-1 rounded border border-red-500/50 hover:bg-red-500/20 transition"
      >
        Salir
      </button>
    </div>

    <div
      class="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700"
    >
      <h2 class="text-ld font-semibold mb-4">Nueva Postulación</h2>
      <form
        @submit.prevent="handleSubmit"
        class="flex flex-col md:flex-row gap-4"
      >
        <input
          v-model="company"
          placeholder="Empresa (ej: Google)"
          type="text"
          class="bg-gray-700 text-white p-2 rounded border border-gray-600 w-full"
          required
        />

        <input
          v-model="position"
          type="text"
          placeholder="Cargo (Ej: Frontend Dev)"
          class="bg-gray-700 text-white p-2 rounded- border border-gray-600 w-full"
          required
        />

        <input
          v-model="link"
          type="text"
          placeholder="Link (Ej: https://google.com)"
          class="bg-gray-700 text-white p-2 rounded- border border-gray-600 w-full"
          required
        />

        <button
          type="submit"
          :disabled="jobStore.loading"
          class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold transition disabled:opacity-50"
        >
          {{ jobStore.loading ? "Guardando..." : "Agregar" }}
        </button>
      </form>
    </div>

    <div>
      <h3>Mis Procesos: {{ jobStore.jobs.length }}</h3>

      <div
        v-if="jobStore.loading && jobStore.jobs.length === 0"
        class="text-center py-10 text-gray-500"
      >
        Cargando tus postulaciones...
      </div>

      <div
        v-else-if="jobStore.jobs.length === 0"
        class="text-center py-10 bg-gray-800/50 rounded-lg border border-dashed border-gray-700 text-gray-400"
      >
        Aún no has guardado postulaciones. ¡Agrega la primera arriba!
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 lg: grid-cols-3">
        <div
          v-for="job in jobStore.jobs"
          :key="job.id"
          class="p-4 rounded-lg border transition shadow-lg flex flex-col justify-between"
          :class="{
            'bg-gray-800 border-gray-700 hover:border-blue-500/50':
              job.status === 'pendiente',
            'bg-yellow-900/20 border-yellow-500/50':
              job.status === 'entrevista',
            'bg-green-900/20 border-green-500/50': job.status === 'oferta',
            'bg-red-900/20 border-red-500/50 opacity-75':
              job.status === 'rechazado',
          }"
        >
          <div>
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-bold text-lg text-white">{{ job.company }}</h4>
              <select
                @change="
                  jobStore.updateStatus(
                    job.id!,
                    ($event.target as HTMLSelectElement).value as any
                  )
                "
                :value="job.status"
                class="text-xs px-2 py-1 rounded-full bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="pendiente">Pendiente</option>
                <option value="entrevista">Entrevista</option>
                <option value="oferta">Oferta</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
            <p class="text-blue-300 mb-4">{{ job.position }}</p>
          </div>

          <div
            class="flex justify-between items-center mt-4 border-t border-gray-700 pt-3"
          >
            <span class="text-xs text-gray-500">
              {{ new Date(job.date).toLocaleDateString() }}
            </span>
            <button
              class="text-red-400 hover:text-red-300 text-sm"
              @click="jobStore.deleteJob(job.id!)"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//Vue
import { ref, onMounted } from "vue";
//Stores
import { useJobStore } from "../stores/jobs";
import { useAuthStore } from "../stores/auth";

//Stores
const jobStore = useJobStore();
const authStore = useAuthStore();

const company = ref("");
const position = ref("");
const link = ref("");

onMounted(() => {
  jobStore.fetchJobs();
});

//Methods
const handleSubmit = async () => {
  if (!company.value || !position.value) return;
  const a = await jobStore.addJob({
    company: company.value,
    position: position.value,
    link: link.value,
    status: "pendiente",
  });
  console.log("Data", {
    company: company.value,
    position: position.value,
    link: link.value,
    status: "Pendiente",
  });
  console.log(a);

  company.value = "";
  position.value = "";
  link.value = "";
};
</script>
