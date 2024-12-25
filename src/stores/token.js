import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTokenStore = defineStore('token', () => {
  const token = ref('')

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const getToken = () => {
    if (!token.value) {
      token.value = localStorage.getItem('token') || ''
    }
    return token.value
  }

  const removeToken = () => {
    token.value = ''
    localStorage.removeItem('token')
  }

  return {
    token,
    setToken,
    getToken,
    removeToken
  }
}, {
  persist: true
})
