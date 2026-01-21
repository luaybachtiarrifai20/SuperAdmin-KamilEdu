<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'

const route = useRoute()
const router = useRouter()
const schoolId = route.params.id
const school = ref({})
const admins = ref([])
const loading = ref(true)

const fetchSchool = async () => {
  try {
    const response = await axios.get(`/schools/${schoolId}`)
    school.value = response.data
  } catch (error) {
    console.error('Failed to fetch school', error)
  }
}

const fetchAdmins = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/schools/${schoolId}/admins`)
    admins.value = response.data
  } catch (error) {
    console.error('Failed to fetch admins', error)
  } finally {
    loading.value = false
  }
}

const showEditModal = ref(false)
const editingAdmin = ref(null)
const editForm = ref({ name: '', phone_number: '', password: '' })
const editLoading = ref(false)

const editAdmin = (admin) => {
  editingAdmin.value = admin
  editForm.value = {
    name: admin.name,
    phone_number: admin.phone_number || '',
    password: ''
  }
  showEditModal.value = true
}

const updateAdmin = async () => {
  editLoading.value = true
  try {
    const payload = { ...editForm.value }
    // Remove password if empty
    if (!payload.password) {
      delete payload.password
    }
    await axios.put(`/schools/${schoolId}/admins/${editingAdmin.value.id}`, payload)
    showEditModal.value = false
    fetchAdmins() // Refresh list
  } catch (error) {
    console.error('Failed to update admin', error)
    alert('Failed to update admin: ' + (error.response?.data?.message || error.message))
  } finally {
    editLoading.value = false
  }
}

const deleteAdmin = async (admin) => {
  if (!confirm(`Are you sure you want to remove ${admin.name} as admin from this school?`)) {
    return
  }
  
  try {
    await axios.delete(`/schools/${schoolId}/admins/${admin.id}`)
    fetchAdmins() // Refresh list
  } catch (error) {
    console.error('Failed to delete admin', error)
    alert('Failed to delete admin: ' + (error.response?.data?.message || error.message))
  }
}

const pageTitle = computed(() => {
  return school.value.school_name 
    ? `${school.value.school_name} Admins` 
    : 'School Admins'
})

onMounted(() => {
  fetchSchool()
  fetchAdmins()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
       <div class="flex items-center gap-4">
          <button @click="router.back()" class="text-gray-500 hover:text-gray-700">
            &larr; Back
          </button>
          <h2 class="text-2xl font-bold text-gray-800">
            {{ pageTitle }}
          </h2>
       </div>
      <button @click="router.push(`/schools/${schoolId}/admins/create`)" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
        Add Admin
      </button>
    </div>
    
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div v-if="loading" class="p-4 text-center">Loading...</div>
      <ul v-else role="list" class="divide-y divide-gray-200">
        <li v-for="admin in admins" :key="admin.id" class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-indigo-600 truncate">{{ admin.name }}</p>
              <p class="text-sm text-gray-500">{{ admin.email }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button @click="editAdmin(admin)" 
                      class="text-indigo-600 hover:text-indigo-900 text-sm font-medium px-3 py-1 rounded hover:bg-indigo-50">
                Edit
              </button>
              <button @click="deleteAdmin(admin)" 
                      class="text-red-600 hover:text-red-900 text-sm font-medium px-3 py-1 rounded hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        </li>
        <li v-if="admins.length === 0" class="px-4 py-8 text-center text-gray-500">
          No admins found for this school.
        </li>
      </ul>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Edit Admin</h3>
        <form @submit.prevent="updateAdmin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input v-model="editForm.name" type="text" required 
                   class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"/>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input v-model="editForm.phone_number" type="text" 
                   class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"/>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Password (leave empty to keep current)</label>
            <input v-model="editForm.password" type="password" 
                   class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"/>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showEditModal = false" 
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" :disabled="editLoading"
                    class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
              {{ editLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
