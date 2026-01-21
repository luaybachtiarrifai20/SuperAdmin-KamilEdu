<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'

const router = useRouter()
const route = useRoute()
const isEdit = route.params.id !== undefined

const form = ref({
  school_name: '',
  jenjang: 'SMK',
  address: '',
  status: 'active',
  email: '',
  phone_number: ''
})

const loading = ref(false)

const fetchSchool = async () => {
  if (!isEdit) return
  try {
    const response = await axios.get(`/schools/${route.params.id}`)
    const data = response.data
    form.value = {
      school_name: data.school_name,
      jenjang: data.jenjang,
      address: data.address,
      status: data.status,
      email: data.email,
      phone_number: data.phone_number
    }
  } catch (error) {
    console.error('Failed to fetch school', error)
  }
}

const submit = async () => {
  loading.value = true
  try {
    if (isEdit) {
      await axios.put(`/schools/${route.params.id}`, form.value)
    } else {
      await axios.post('/schools', form.value)
    }
    router.push('/schools')
  } catch (error) {
    console.error('Failed to save school', error)
    alert('Failed to save school: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSchool()
})
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">{{ isEdit ? 'Edit School' : 'Create New School' }}</h2>
    
    <div class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="submit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">School Name</label>
          <input v-model="form.school_name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"/>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Jenjang</label>
              <select v-model="form.jenjang" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
                <option value="SMA">SMA</option>
                <option value="SMK">SMK</option>
              </select>
            </div>
             <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select v-model="form.status" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Address</label>
          <textarea v-model="form.address" rows="3" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
        </div>

         <div class="grid grid-cols-2 gap-4">
             <div>
              <label class="block text-sm font-medium text-gray-700">Email (Optional)</label>
              <input v-model="form.email" type="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
             <div>
              <label class="block text-sm font-medium text-gray-700">Phone (Optional)</label>
              <input v-model="form.phone_number" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
         </div>

        <div class="flex justify-end gap-3 pt-4">
           <button type="button" @click="router.back()" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancel
          </button>
          <button type="submit" :disabled="loading" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {{ loading ? 'Saving...' : 'Save School' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
