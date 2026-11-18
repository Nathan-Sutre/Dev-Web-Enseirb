import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref([])

  function favoriteKey(id, type) {
    return type === 'series' ? `series:${id}` : id
  }

  function has(id, type = 'movie') {
    return ids.value.includes(favoriteKey(id, type))
  }

  function toggle(id, type = 'movie') {
    const key = favoriteKey(id, type)
    ids.value = has(id, type) ? ids.value.filter((favorite) => favorite !== key) : [...ids.value, key]
  }

  return { ids, has, toggle }
})
