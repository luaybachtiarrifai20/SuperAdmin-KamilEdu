<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'

const route = useRoute()
const router = useRouter()
const schoolId = route.params.id

const form = ref({
  name: '',
  email: '',
  password: '',
  phone_number: ''
})

const loading = ref(false)

const showConfirmModal = ref(false)
const existingUser = ref(null)

const submit = async () => {
    loading.value = true
    try {
        // 1. Check if user exists
        const checkRes = await axios.post('/users/check', { email: form.value.email })
        
        if (checkRes.data.exists) {
            existingUser.value = checkRes.data.user
            // Compare details
            const isDifferent = 
                existingUser.value.name !== form.value.name ||
                existingUser.value.phone_number !== form.value.phone_number ||
                form.value.password; // If password is provided, we assume it's "different" or intended update

            if (isDifferent) {
                showConfirmModal.value = true
                loading.value = false
                return
            }
            // If details match exactly, we just link them without "updating" (update_existing=false)
            await createAdmin(false)
        } else {
            // New user
            await createAdmin(false)
        }
    } catch (error) {
        console.error('Failed to check/create admin', error)
        alert('Error: ' + (error.response?.data?.message || error.message))
        loading.value = false
    }
}

const createAdmin = async (updateExisting) => {
    try {
        await axios.post(`/schools/${schoolId}/admins`, {
            ...form.value,
            update_existing: updateExisting
        })
        router.push(`/schools/${schoolId}/admins`)
    } catch (error) {
         console.error('Failed to create admin', error)
         alert('Failed to create admin: ' + (error.response?.data?.message || error.message))
    } finally {
        loading.value = false
        showConfirmModal.value = false
    }
}
</script>

<template>
  <div class="max-w-xl mx-auto">
     <div class="mb-6">
        <button @click="router.back()" class="text-gray-500 hover:text-gray-700">
            &larr; Back to Admins
        </button>
     </div>
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Add School Admin</h2>
    
    <div class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="submit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input v-model="form.name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="form.password" type="password" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Phone</label>
          <input v-model="form.phone_number" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"/>
        </div>

        <div class="flex justify-end pt-4">
          <button type="submit" :disabled="loading" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {{ loading ? 'Processing...' : 'Add Admin' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="bg-white p-5 rounded-lg shadow-xl max-w-md mx-auto">
        <h3 class="text-lg font-bold text-gray-900 mb-4">User Already Exists</h3>
        <p class="text-sm text-gray-600 mb-4">
          A user with email <strong>{{ form.email }}</strong> already exists properly.
          The details you entered are different from the existing record.
        </p>
        <div class="bg-yellow-50 p-3 rounded mb-4 text-xs text-yellow-800">
           <p><strong>Existing Name:</strong> {{ existingUser.name }}</p>
           <p><strong>Existing Phone:</strong> {{ existingUser.phone_number || '-' }}</p>
        </div>
        <p class="text-sm text-gray-600 mb-6">
            Do you want to update the user's details (Name, Password, Phone) with the new values?
        </p>
        <div class="flex justify-end gap-3">
          <button @click="createAdmin(false)" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            No, Keep Existing
          </button>
          <button @click="createAdmin(true)" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Yes, Update User
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
