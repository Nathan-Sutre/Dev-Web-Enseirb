<script setup>
import { RouterLink } from 'vue-router'
import MediaCatalog from '../components/MediaCatalog.vue'
import { movies } from '../data/catalog'
import { useFavoritesStore } from '../stores/favorites'

const featured = movies[0]
const favorites = useFavoritesStore()
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-content">
      <p class="eyebrow"><span></span> LA SÉLECTION SEENFLIX</p>
      <h1 id="hero-title">Au-delà des étoiles.<br>Au cœur du cinéma.</h1>
      <p class="hero-description">Des histoires qui vous transportent. Des films qui restent.<br>Découvrez votre prochaine grande émotion.</p>
      <div class="hero-movie">
        <strong>{{ featured.title.toUpperCase() }}</strong><span>{{ featured.year }}</span>
        <span>{{ featured.duration }}</span><span class="quality">HD</span>
      </div>
      <div class="hero-actions">
        <RouterLink class="primary-button" :to="{ name: 'film-detail', params: { id: featured.id } }">
          <span aria-hidden="true">▶</span> Découvrir le film
        </RouterLink>
        <button class="secondary-button" :aria-pressed="favorites.has(featured.id)" @click="favorites.toggle(featured.id)">
          {{ favorites.has(featured.id) ? '✓ Dans ma liste' : '+ Ma liste' }}
        </button>
      </div>
    </div>
    <div class="hero-label"><span>À L’AFFICHE</span><strong>{{ featured.title }}</strong><small>Un film de Christopher Nolan</small></div>
  </section>

  <MediaCatalog featured title="À découvrir" />
</template>
