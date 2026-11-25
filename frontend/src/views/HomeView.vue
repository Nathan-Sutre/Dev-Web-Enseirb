<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import MediaCatalog from '../components/MediaCatalog.vue'
import { getRandomMedia } from '../data/catalog'
import { useFavoritesStore } from '../stores/favorites'

const featured = ref(null)
const loading = ref(true)
const error = ref('')
const favorites = useFavoritesStore()

onMounted(async () => {
  try {
    featured.value = await getRandomMedia()
  } catch (cause) {
    error.value = cause.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section
    class="hero"
    aria-labelledby="hero-title"
    :style="{ '--hero-image': featured?.backdrop ? `url(https://image.tmdb.org/t/p/original/${featured.backdrop})` : 'none' }"
  >
    <div class="hero-content">
      <p class="eyebrow"><span></span> LA SÉLECTION SEENFLIX</p>
      <h1 id="hero-title">Au-delà des étoiles.<br>Au cœur du cinéma.</h1>
      <p class="hero-description">Des histoires qui vous transportent. Des films qui restent.<br>Découvrez votre prochaine grande émotion.</p>
      <p v-if="loading" role="status">Chargement de la sélection…</p>
      <p v-else-if="error" role="alert">{{ error }}</p>
      <div v-if="featured" class="hero-movie">
        <strong>{{ featured.title.toUpperCase() }}</strong><span>{{ featured.year }}</span>
        <span v-if="featured.duration">{{ featured.duration }}</span>
      </div>
      <div v-if="featured" class="hero-actions">
        <RouterLink class="primary-button" :to="{ name: featured.type === 'series' ? 'serie-detail' : 'film-detail', params: { id: featured.id } }">
          <span aria-hidden="true">▶</span> Découvrir {{ featured.type === 'series' ? 'la série' : 'le film' }}
        </RouterLink>
        <button class="secondary-button" :aria-pressed="favorites.has(featured.id, featured.type)" @click="favorites.toggle(featured.id, featured.type)">
          {{ favorites.has(featured.id, featured.type) ? '✓ Dans ma liste' : '+ Ma liste' }}
        </button>
      </div>
    </div>
    <div v-if="featured" class="hero-label"><span>À L’AFFICHE</span><strong>{{ featured.title }}</strong></div>
  </section>

  <MediaCatalog featured mixed title="À découvrir" />
</template>
