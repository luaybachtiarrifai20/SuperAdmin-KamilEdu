<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from '@/plugins/axios'

const props = defineProps({
  schoolId: {
    type: String,
    required: true
  }
})

const schedules = ref([])
const loading = ref(true)

const fetchSchedules = async () => {
  loading.value = true
  try {
    // Note: TeachingScheduleController expects X-School-ID header
    const response = await axios.get('/teaching-schedules', {
      headers: {
        'X-School-ID': props.schoolId
      },
      params: {
        // We might want to filter by active academic year if possible, but for now fetch all
      }
    })
    schedules.value = response.data
  } catch (error) {
    console.error('Failed to fetch schedules', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.schoolId) {
    fetchSchedules()
  }
})

watch(() => props.schoolId, (newId) => {
  if (newId) fetchSchedules()
})

const formatTime = (time) => {
  if (!time) return '-'
  return time.substring(0, 5)
}

const getDayName = (schedule) => {
  return schedule.lessonHour?.day?.name || '-'
}
</script>

<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-md">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Teaching Schedule
      </h3>
    </div>
    
    <div v-if="loading" class="p-4 text-center text-gray-500">
      Loading schedules...
    </div>
    
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Day / Time
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subject
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Teacher
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="schedule in schedules" :key="schedule.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ getDayName(schedule) }}</div>
              <div class="text-sm text-gray-500">
                {{ formatTime(schedule.lessonHour?.start_time) }} - {{ formatTime(schedule.lessonHour?.end_time) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ schedule.class?.name || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ schedule.subject?.name || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ schedule.teacher?.name || '-' }}</div>
            </td>
          </tr>
          <tr v-if="schedules.length === 0">
             <td colspan="4" class="px-6 py-8 text-center text-gray-500">
               No schedules found.
             </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
