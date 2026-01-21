<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import SchoolTeacherList from './teachers/SchoolTeacherList.vue'
import SchoolStudentList from './students/SchoolStudentList.vue'
import SchoolScheduleList from './schedules/SchoolScheduleList.vue'

const route = useRoute()
const router = useRouter()
const schoolId = route.params.id

const school = ref({})
const admins = ref([])
const loadingSchool = ref(true)
const loadingAdmins = ref(false)
const activeTab = ref('overview')

// Fetch School Details
const fetchSchool = async () => {
  loadingSchool.value = true
  try {
    const response = await axios.get(`/schools/${schoolId}`)
    school.value = response.data
  } catch (error) {
    console.error('Failed to fetch school', error)
  } finally {
    loadingSchool.value = false
  }
}

// Fetch Admins
const fetchAdmins = async () => {
  loadingAdmins.value = true
  try {
    const response = await axios.get(`/schools/${schoolId}/admins`)
    admins.value = response.data
  } catch (error) {
    console.error('Failed to fetch admins', error)
  } finally {
    loadingAdmins.value = false
  }
}

onMounted(() => {
  fetchSchool()
  fetchAdmins() 
})

const tabs = [
  { id: 'overview', name: 'Overview' },
  { id: 'admins', name: 'School Users' },
  { id: 'teachers', name: 'Teachers' },
  { id: 'students', name: 'Students' },
  { id: 'schedule', name: 'Schedule' },
]

</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-4 mb-4">
         <button @click="router.back()" class="text-gray-500 hover:text-gray-700 font-medium">
           &larr; Back
         </button>
      </div>

      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ school.school_name || 'Loading...' }}</h1>
          <p class="mt-1 text-gray-500">{{ school.address }}</p>
        </div>
        <div class="flex gap-3">
           <button @click="router.push(`/schools/${schoolId}/edit`)" class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium">
             Edit School
           </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <a 
          v-for="tab in tabs" 
          :key="tab.id"
          href="#"
          @click.prevent="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
          ]"
        >
          {{ tab.name }}
        </a>
      </nav>
    </div>

    <!-- Tab Content -->
    <div v-if="loadingSchool" class="text-center py-10">
       <p class="text-gray-500">Loading school details...</p>
    </div>

    <div v-else>
      
      <!-- OVERVIEW TAB -->
      <div v-if="activeTab === 'overview'" class="bg-white shadow rounded-lg p-6">
         <h3 class="text-lg font-medium text-gray-900 mb-4">School Information</h3>
         <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">School Name</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ school.school_name }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Level (Jenjang)</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ school.jenjang }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1 text-sm">
                 <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="school.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ school.status }}
                 </span>
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Address</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ school.address }}</dd>
            </div>
             <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Province</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ school.province }}</dd>
            </div>
              <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">City/Regency</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ school.regency }}</dd>
            </div>
         </dl>
      </div>

      <!-- ADMINS TAB -->
      <div v-if="activeTab === 'admins'">
          <div class="flex justify-between items-center mb-4">
             <h3 class="text-lg font-medium text-gray-900">School Users</h3>
             <button @click="router.push(`/schools/${schoolId}/admins/create`)" class="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700">
               Add User
             </button>
          </div>
          
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <div v-if="loadingAdmins" class="p-4 text-center text-gray-500">Loading users...</div>
            <ul v-else role="list" class="divide-y divide-gray-200">
              <li v-for="admin in admins" :key="admin.id" class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-indigo-600 truncate">{{ admin.name }}</p>
                    <p class="text-sm text-gray-500">{{ admin.email }}</p>
                    <p class="text-xs text-gray-400 mt-1">
                      Roles: {{ admin.roles_list ? admin.roles_list.join(', ') : (admin.role || '-') }}
                    </p>
                  </div>
                </div>
              </li>
              <li v-if="admins.length === 0" class="px-4 py-8 text-center text-gray-500">
                  No users found.
              </li>
            </ul>
          </div>
      </div>

      <!-- TEACHERS TAB -->
      <div v-if="activeTab === 'teachers'">
          <SchoolTeacherList :schoolId="schoolId" />
      </div>

       <!-- STUDENTS TAB -->
      <div v-if="activeTab === 'students'">
          <SchoolStudentList :schoolId="schoolId" />
      </div>

       <!-- SCHEDULE TAB -->
      <div v-if="activeTab === 'schedule'">
          <SchoolScheduleList :schoolId="schoolId" />
      </div>

    </div>
  </div>
</template>
