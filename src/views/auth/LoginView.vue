<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { GoogleLogin } from 'vue3-google-login'
import axios from 'axios' // Need decode? No, vue3-google-login gives credential.

const email = ref('luaygitaris@gmail.com')
const password = ref('password')
const otp = ref('')
const step = ref('credentials') // credentials, otp

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  // Returns data object or false
  const response = await authStore.requestOtp(email.value, password.value)
  
  if (response) {
    if (response.dev_otp) {
        otp.value = response.dev_otp
    }
    step.value = 'otp'
  } else {
    error.value = 'Invalid credentials or failed to send OTP'
  }
  loading.value = false
}

const handleVerify = async () => {
    loading.value = true
    error.value = ''
    const success = await authStore.verifyOtp(email.value, otp.value)
    if (success) {
        router.push({ name: 'dashboard' })
    } else {
        error.value = 'Invalid OTP code'
    }
    loading.value = false
}

const callback = async (response) => {
    // response.credential is the JWT ID token
    // We can decode to get info or just send it to backend if backend verifies.
    // Our backend expects: email, google_id, name, avatar.
    // decodeCredential helper from vue3-google-login can be used.
    
    // For simplicity, let's decode the JWT manually or assume we send the token to backend
    // But our backend at GoogleLoginAction expects specific fields. 
    // Usually backend should take 'id_token' and verify it with Google.
    // BUT the current implementation in AuthController expects 'google_id', 'email', 'name', 'avatar'.
    // So we MUST decode the token on frontend to extract this info.
    
    const userData = decodeJwt(response.credential)
    if (!userData) {
        error.value = "Failed to decode Google Credential"
        return
    }

    loading.value = true
    const success = await authStore.googleLogin({
        email: userData.email,
        google_id: userData.sub,
        name: userData.name,
        avatar: userData.picture,
        // school_id? role? backend handles defaults or logic.
    })
    
    if (success) {
        router.push({ name: 'dashboard' })
    } else {
        error.value = "Google Login Failed"
    }
    loading.value = false
}

const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        return JSON.parse(jsonPayload)
    } catch (e) {
        console.error("JWT Decode error", e)
        return null
    }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Super Admin Login</h2>
      
      <!-- Step 1: Credentials -->
      <form v-if="step === 'credentials'" @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>

        <div>
           <label class="block text-sm font-medium text-gray-700">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
        
        <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
        </div>
        
        <div class="flex justify-center">
             <GoogleLogin :callback="callback" />
        </div>

      </form>

      <!-- Step 2: OTP -->
      <form v-else @submit.prevent="handleVerify" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Enter OTP Code</label>
          <p class="text-xs text-gray-500 mb-2">Code sent to {{ email }}</p>
          <input 
            v-model="otp" 
            type="text" 
            required 
            placeholder="123456"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-center tracking-widest text-lg"
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {{ loading ? 'Verifying...' : 'Verify OTP' }}
        </button>
        
        <button 
            type="button"
            @click="step = 'credentials'"
            class="w-full text-center text-sm text-indigo-600 hover:text-indigo-500 mt-2"
        >
            Back to Login
        </button>
      </form>
    </div>
  </div>
</template>
