<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { movies, series } from '../data/catalog'
import { useFavoritesStore } from '../stores/favorites'

const props = defineProps({
  title: { type: String, required: true },
  isSeries: Boolean,
  favoritesOnly: Boolean,
  featured: Boolean,
})

const favorites = useFavoritesStore()
const search = ref('')
const genre = ref('Tous')
const media = computed(() => (props.isSeries ? series : movies))
const genres = computed(() => ['Tous', ...new Set(media.value.map((item) => item.genre))])
const detailRoute = computed(() => (props.isSeries ? 'serie-detail' : 'film-detail'))
const searchLabel = computed(() => (props.isSeries ? 'Rechercher une série' : 'Rechercher un film'))
const filteredMedia = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('fr')
  return media.value.filter((item) =>
    item.title.toLocaleLowerCase('fr').includes(query) &&
    (genre.value === 'Tous' || item.genre === genre.value) &&
    (!props.favoritesOnly || favorites.has(item.id)),
  )
})

function resetFilters() {
  search.value = ''
  genre.value = 'Tous'
}
</script>

<template>
  <section class="catalog" aria-labelledby="catalog-title">
    <div class="catalog-heading">
      <div>
        <p v-if="featured" class="eyebrow">VOTRE PROCHAINE SÉANCE</p>
        <component :is="featured ? 'h2' : 'h1'" id="catalog-title" class="catalog-title">{{ title }}<span>.</span></component>
      </div>
      <label class="search">
        <span aria-hidden="true">⌕</span>
        <input v-model="search" type="search" :placeholder="`${searchLabel}…`" :aria-label="searchLabel">
      </label>
    </div>
    <div class="catalog-toolbar">
      <div class="genre-filters" aria-label="Genres">
        <button v-for="item in genres" :key="item" :class="{ selected: genre === item }" :aria-pressed="genre === item" @click="genre = item">{{ item }}</button>
      </div>
      <span class="results-count">{{ filteredMedia.length }} {{ isSeries ? 'série' : 'film' }}{{ filteredMedia.length > 1 ? 's' : '' }}</span>
    </div>
    <div v-if="filteredMedia.length" class="movie-grid">
      <article v-for="item in filteredMedia" :key="item.id" class="movie-card">
        <div class="poster-wrap">
          <RouterLink class="poster-button" :to="{ name: detailRoute, params: { id: item.id } }" :aria-label="`Voir la fiche de ${item.title}`">
            <img :src="`https://image.tmdb.org/t/p/w500/${item.poster}`" :alt="`Affiche de ${item.title}`" loading="lazy">
            <span class="poster-overlay"><span>Découvrir ↗</span></span>
          </RouterLink>
          <span class="rating"><span aria-hidden="true">★</span> {{ item.score }}</span>
          <button
            v-if="!isSeries"
            class="favorite-button"
            :class="{ saved: favorites.has(item.id) }"
            :aria-label="favorites.has(item.id) ? `Retirer ${item.title} de ma liste` : `Ajouter ${item.title} à ma liste`"
            :aria-pressed="favorites.has(item.id)"
            @click="favorites.toggle(item.id)"
          >{{ favorites.has(item.id) ? '✓' : '+' }}</button>
        </div>
        <h3><RouterLink :to="{ name: detailRoute, params: { id: item.id } }">{{ item.title }}</RouterLink></h3>
        <p class="movie-meta">{{ item.year }}<span>•</span>{{ item.genre }}</p>
      </article>
    </div>
    <div v-else class="empty-state">
      <template v-if="favoritesOnly && !favorites.ids.length">
        <h3>Votre prochaine séance commence ici.</h3>
        <p>Ajoutez des films à votre liste avec le bouton + sur les affiches.</p>
        <RouterLink class="secondary-button" :to="{ name: 'films' }">Voir tous les films</RouterLink>
      </template>
      <template v-else>
        <h3>{{ isSeries ? 'Aucune série trouvée.' : 'Aucun film trouvé.' }}</h3>
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
