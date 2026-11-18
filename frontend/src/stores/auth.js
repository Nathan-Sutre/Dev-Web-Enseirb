import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const sessionKey = 'seenflix:demo-session'
const demoUser = { name: 'Compte de démonstration' }

export const useAuthStore = defineStore('auth', () => {
  const user = ref(sessionStorage.getItem(sessionKey) === '1' ? demoUser : null)
  const isLoggedIn = computed(() => user.value !== null)

  function login() {
    sessionStorage.setItem(sessionKey, '1')
    user.value = demoUser
  }

  function logout() {
    sessionStorage.removeItem(sessionKey)
    user.value = null
  }

  return { user, isLoggedIn, login, logout }
})
