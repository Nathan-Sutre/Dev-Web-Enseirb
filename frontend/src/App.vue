<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <div class="site-shell">
    <NavBar />

    <main>
      <RouterView v-slot="{ Component, route }">
        <component :is="Component" :key="route.name" />
      </RouterView>
    </main>

    <SiteFooter />
  </div>
</template>
