<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import CatalogFilters from './CatalogFilters.vue'
import { getCatalog, getMovies, getSeries } from '../data/catalog'
import { useFavoritesStore } from '../stores/favorites'

const props = defineProps({
  title: { type: String, required: true },
  isSeries: Boolean,
  favoritesOnly: Boolean,
  featured: Boolean,
  mixed: Boolean,
})

const favorites = useFavoritesStore()
const search = ref('')
const genre = ref('Tous')
const type = ref('all')
const media = ref([])
const loading = ref(true)
const error = ref('')

watch(() => [props.mixed, props.isSeries], async (_, __, onCleanup) => {
  let active = true
  onCleanup(() => { active = false })
  loading.value = true
  error.value = ''
  media.value = []
  try {
    const items = await (props.mixed ? getCatalog() : props.isSeries ? getSeries() : getMovies())
    if (active) media.value = items
  } catch (cause) {
    if (active) error.value = cause.message
  } finally {
    if (active) loading.value = false
  }
}, { immediate: true })
const genres = computed(() => ['Tous', ...new Set(media.value.map((item) => item.genre))])
const searchLabel = computed(() => {
  if (props.mixed) return 'Rechercher un titre'
  return props.isSeries ? 'Rechercher une série' : 'Rechercher un film'
})
const resultLabel = computed(() => {
  if (props.mixed) return 'titre'
  return props.isSeries ? 'série' : 'film'
})
const filteredMedia = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('fr')
  return media.value.filter((item) =>
    item.title.toLocaleLowerCase('fr').includes(query) &&
    (!props.mixed || type.value === 'all' || item.type === type.value) &&
    (genre.value === 'Tous' || item.genre === genre.value) &&
    (!props.favoritesOnly || favorites.has(item.id, item.type)),
  )
})

function detailLocation(item) {
  return {
    name: item.type === 'series' ? 'serie-detail' : 'film-detail',
    params: { id: item.id },
  }
}

function resetFilters() {
  search.value = ''
  genre.value = 'Tous'
  type.value = 'all'
}
</script>

<template>
  <section class="catalog" aria-labelledby="catalog-title">
    <CatalogFilters
      v-model:search="search"
      v-model:genre="genre"
      v-model:type="type"
      :genres="genres"
      :search-label="searchLabel"
      :show-type-filter="mixed"
    >
      <template #heading>
        <div>
          <p v-if="featured" class="eyebrow">VOTRE PROCHAINE SÉANCE</p>
          <component :is="featured ? 'h2' : 'h1'" id="catalog-title" class="catalog-title">{{ title }}<span>.</span></component>
        </div>
      </template>
      <template #results>
        {{ filteredMedia.length }} {{ resultLabel }}{{ filteredMedia.length > 1 ? 's' : '' }}
      </template>
    </CatalogFilters>
    <p v-if="loading" role="status">Chargement du catalogue…</p>
    <p v-else-if="error" role="alert">{{ error }}</p>
    <div v-else-if="filteredMedia.length" class="movie-grid">
      <article v-for="item in filteredMedia" :key="`${item.type}-${item.id}`" class="movie-card">
        <div class="poster-wrap">
          <RouterLink class="poster-button" :to="detailLocation(item)" :aria-label="`Voir la fiche de ${item.title}`">
            <img v-if="item.poster" :src="`https://image.tmdb.org/t/p/w500/${item.poster}`" :alt="`Affiche de ${item.title}`" loading="lazy">
            <span v-else>Affiche indisponible</span>
            <span class="poster-overlay"><span>Découvrir ↗</span></span>
          </RouterLink>
          <span class="rating"><span aria-hidden="true">★</span> {{ item.score }}</span>
          <button
            class="favorite-button"
            :class="{ saved: favorites.has(item.id, item.type) }"
            :aria-label="favorites.has(item.id, item.type) ? `Retirer ${item.title} de ma liste` : `Ajouter ${item.title} à ma liste`"
            :aria-pressed="favorites.has(item.id, item.type)"
            @click="favorites.toggle(item.id, item.type)"
          >{{ favorites.has(item.id, item.type) ? '✓' : '+' }}</button>
        </div>
        <h3><RouterLink :to="detailLocation(item)">{{ item.title }}</RouterLink></h3>
        <p class="movie-meta">{{ item.year }}<span>•</span>{{ item.genre }}</p>
      </article>
    </div>
    <div v-else class="empty-state">
      <template v-if="favoritesOnly && !favorites.ids.length">
        <h3>Votre prochaine séance commence ici.</h3>
        <p>Ajoutez des films et des séries à votre liste avec le bouton + sur les affiches.</p>
        <RouterLink class="secondary-button" :to="{ name: 'films' }">Voir tous les films</RouterLink>
      </template>
      <template v-else>
        <h3>{{ mixed ? 'Aucun titre trouvé.' : isSeries ? 'Aucune série trouvée.' : 'Aucun film trouvé.' }}</h3>
        <p>Essayez un autre titre ou un autre genre.</p>
        <button class="secondary-button" @click="resetFilters">Réinitialiser les filtres</button>
      </template>
    </div>
  </section>
</template>

<style scoped>
.catalog-title {
  margin: 0;
  font-size: 30px;
  font-weight: 600;
  letter-spacing: -1px;
}

.catalog-title > span {
  color: #d8f378;
}

.poster-button:focus-visible {
  outline-offset: -5px;
}
</style>
