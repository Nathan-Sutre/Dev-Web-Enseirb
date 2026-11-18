import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref([])

  function has(id) {
    return ids.value.includes(id)
  }

  function toggle(id) {
    ids.value = has(id) ? ids.value.filter((favorite) => favorite !== id) : [...ids.value, id]
  }

  return { ids, has, toggle }
})
