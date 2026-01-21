<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'

const schools = ref([])
const loading = ref(true)

const fetchSchools = async () => {
  loading.value = true
  try {
    const response = await axios.get('/schools')
    schools.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch schools', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSchools()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Active Schools</h2>
      <button @click="$router.push('/schools/create')" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
        Add School
      </button>
    </div>
    
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div v-if="loading" class="p-4 text-center">Loading...</div>
      <ul v-else role="list" class="divide-y divide-gray-200">
        <li v-for="school in schools" :key="school.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
               <h3 class="text-lg font-medium text-indigo-600 truncate cursor-pointer hover:underline" 
                   @click="$router.push(`/schools/${school.id}`)">
                 {{ school.school_name }}
               </h3>
               <p class="text-sm text-gray-500">{{ school.address }}</p>
               <p class="text-xs text-gray-400">{{ school.jenjang }}</p>
            </div>
            <div class="ml-2 flex flex-col items-end">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="school.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ school.status }}
              </span>
              <div class="mt-2 space-x-2">
                <button @click="$router.push(`/schools/${school.id}/admins`)" class="text-sm text-indigo-600 hover:text-indigo-900">Admins</button>
                <button @click="$router.push(`/schools/${school.id}/edit`)" class="text-sm text-gray-500 hover:text-gray-900">Edit</button>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="!loading && schools.length === 0" class="p-4 text-center text-gray-500">
        No schools found.
      </div>
    </div>
  </div>
</template>
