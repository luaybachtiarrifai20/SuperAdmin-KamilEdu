<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from '@/plugins/axios'

const props = defineProps({
  schoolId: {
    type: String,
    required: true
  }
})

const students = ref([])
const loading = ref(true)
const pagination = ref({})
const page = ref(1)

const fetchStudents = async () => {
  loading.value = true
  try {
    const response = await axios.get('/students', {
      params: {
        _school_id: props.schoolId,
        page: page.value,
        limit: 10
      }
    })
    students.value = response.data.data
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('Failed to fetch students', error)
  } finally {
    loading.value = false
  }
}

const nextPage = () => {
  if (pagination.value.has_next_page) {
    page.value++
    fetchStudents()
  }
}

const prevPage = () => {
  if (pagination.value.has_prev_page) {
    page.value--
    fetchStudents()
  }
}

onMounted(() => {
  if (props.schoolId) {
    fetchStudents()
  }
})

watch(() => props.schoolId, (newId) => {
  if (newId) fetchStudents()
})
</script>

<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-md">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Students
      </h3>
       <span v-if="pagination.total_items" class="text-sm text-gray-500">
         Total: {{ pagination.total_items }}
      </span>
    </div>
    
    <div v-if="loading" class="p-4 text-center text-gray-500">
      Loading students...
    </div>
    
    <div v-else>
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="student in students" :key="student.id" class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
               <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                      {{ student.name.charAt(0) }}
                  </div>
                  <div class="ml-4">
                       <p class="text-sm font-medium text-indigo-600 truncate">{{ student.name }}</p>
                       <div class="flex text-sm text-gray-500 gap-3">
                          <p v-if="student.student_number">NIS: {{ student.student_number }}</p>
                          <p v-if="student.nisn">NISN: {{ student.nisn }}</p>
                       </div>
                  </div>
               </div>
            </div>
            <div class="ml-4 flex-shrink-0 flex flex-col items-end">
               <!-- Check active class -->
               <span v-if="student.classes && student.classes.length > 0" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                 {{ student.classes[0].name }}
               </span>
               <span v-else class="text-xs text-gray-400">No Class</span>
            </div>
          </div>
        </li>
        <li v-if="students.length === 0" class="px-4 py-8 text-center text-gray-500">
          No students found for this school.
        </li>
      </ul>

      <!-- Pagination Controls -->
      <div v-if="pagination.total_pages > 1" class="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
         <div class="flex-1 flex justify-between sm:hidden">
            <button @click="prevPage" :disabled="!pagination.has_prev_page" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
               Previous
            </button>
            <button @click="nextPage" :disabled="!pagination.has_next_page" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
               Next
            </button>
         </div>
         <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
               <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ (pagination.current_page - 1) * pagination.per_page + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total_items) }}</span>
                  of
                  <span class="font-medium">{{ pagination.total_items }}</span>
                  results
               </p>
            </div>
            <div>
               <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                   <button @click="prevPage" :disabled="!pagination.has_prev_page" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                     <span>&lt;</span>
                   </button>
                    <button @click="nextPage" :disabled="!pagination.has_next_page" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                     <span>&gt;</span>
                   </button>
               </nav>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>
