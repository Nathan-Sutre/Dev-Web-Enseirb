<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="site-shell">
    <NavBar />

    <main>
      <RouterView v-slot="{ Component, route }">
        <component :is="Component" :key="route.name" />
      </RouterView>
    </main>

    <footer>
      <RouterLink class="brand" :to="{ name: 'home' }">seen<span>flix</span>.</RouterLink>
      <p>De grandes histoires, à portée d’écran.</p>
      <span>Catalogue de démonstration · Affiches TMDB</span>
    </footer>
  </div>
</template>
