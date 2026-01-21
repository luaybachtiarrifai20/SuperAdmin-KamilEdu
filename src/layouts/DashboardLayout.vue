<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-800 text-white min-h-screen hidden md:block">
      <div class="p-4 text-xl font-bold border-b border-slate-700">
        Super Admin
      </div>
      <nav class="mt-4 px-2 space-y-2">
        <router-link to="/" class="block px-4 py-2 rounded hover:bg-slate-700" active-class="bg-slate-700">
          Dashboard
        </router-link>
        <router-link to="/schools" class="block px-4 py-2 rounded hover:bg-slate-700" active-class="bg-slate-700">
          Schools
        </router-link>
        <!-- Add more links here -->
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 class="text-xl font-semibold text-gray-800">Dashboard</h1>
          <button @click="logout" class="text-sm text-red-600 hover:text-red-800">
            Logout
          </button>
        </div>
      </header>
      <main class="flex-1 p-6">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>
