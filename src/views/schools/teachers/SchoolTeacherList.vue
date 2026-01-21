<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from '@/plugins/axios'

const props = defineProps({
  schoolId: {
    type: String,
    required: true
  }
})

const teachers = ref([])
const loading = ref(true)

const fetchTeachers = async () => {
  loading.value = true
  try {
    const response = await axios.get('/teachers', {
      params: {
        _school_id: props.schoolId
      }
    })
    teachers.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch teachers', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.schoolId) {
    fetchTeachers()
  }
})

watch(() => props.schoolId, (newId) => {
  if (newId) fetchTeachers()
})
</script>

<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-md">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Teachers
      </h3>
    </div>
    
    <div v-if="loading" class="p-4 text-center text-gray-500">
      Loading teachers...
    </div>
    
    <ul v-else role="list" class="divide-y divide-gray-200">
      <li v-for="teacher in teachers" :key="teacher.id" class="px-4 py-4 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
             <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    {{ teacher.name.charAt(0) }}
                </div>
                <div class="ml-4">
                     <p class="text-sm font-medium text-indigo-600 truncate">{{ teacher.name }}</p>
                     <div class="flex text-sm text-gray-500 gap-3">
                        <p v-if="teacher.employee_number">NIP: {{ teacher.employee_number }}</p>
                        <p>{{ teacher.email }}</p>
                     </div>
                </div>
             </div>
          </div>
          <div class="ml-4 flex-shrink-0">
             <span v-if="teacher.homeroomClass" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
               Wali Kelas: {{ teacher.homeroomClass.name }}
             </span>
          </div>
        </div>
      </li>
      <li v-if="teachers.length === 0" class="px-4 py-8 text-center text-gray-500">
        No teachers found data for this school.
      </li>
    </ul>
  </div>
</template>
