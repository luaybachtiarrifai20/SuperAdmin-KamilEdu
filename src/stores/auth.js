import { defineStore } from 'pinia'
import axios from '@/plugins/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),
  actions: {
    async requestOtp(email, password) {
      try {
        const response = await axios.post('/auth/login', { email, password })
        return response.data
      } catch (error) {
        console.error('OTP request failed', error)
        return false
      }
    },
    async verifyOtp(email, otp) {
      try {
        const response = await axios.post('/auth/verify-otp', { email, otp })
        // Check if response has token (valid verification)
        if (response.data.token) {
           this.token = response.data.token
           this.user = response.data.user || { email } 
           localStorage.setItem('token', this.token)
           return true
        }
        return false
      } catch (error) {
         console.error('OTP verification failed', error)
         return false
      }
    },
    async googleLogin(userData) {
      try {
        const response = await axios.post('/auth/google-login', userData)
        if (response.data.token) {
           this.token = response.data.token
           this.user = response.data.user
           localStorage.setItem('token', this.token)
           return true
        }
        return false
      } catch (error) {
        console.error('Google login failed', error)
        return false
      }
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      location.reload()
    }
  }
})
