<script setup>
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '../stores/favorites'

const favorites = useFavoritesStore()
</script>

<template>
  <header class="site-header">
    <RouterLink class="brand" :to="{ name: 'home' }" aria-label="SeenFlix, accueil">seen<span>flix</span><span class="brand-dot">.</span></RouterLink>
    <nav aria-label="Navigation principale">
      <RouterLink :to="{ name: 'home' }">Accueil</RouterLink>
      <RouterLink :to="{ name: 'films' }">Films</RouterLink>
      <RouterLink :to="{ name: 'series' }">Séries</RouterLink>
      <RouterLink :to="{ name: 'favorite' }">
        Favoris <span v-if="favorites.ids.length" class="count">{{ favorites.ids.length }}</span>
      </RouterLink>
    </nav>
    <span class="header-caption">Le cinéma, tout simplement.</span>
    <div class="avatar" aria-label="Profil de démonstration">S</div>
  </header>
</template>
