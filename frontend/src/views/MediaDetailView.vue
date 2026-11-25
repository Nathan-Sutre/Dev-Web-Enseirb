<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { movies, series } from '../data/catalog'
import { useFavoritesStore } from '../stores/favorites'

const props = defineProps({
  id: { type: String, required: true },
  isSeries: Boolean,
})

const favorites = useFavoritesStore()
const item = computed(() => (props.isSeries ? series : movies).find((entry) => String(entry.id) === props.id))
</script>

<template>
  <section class="catalog detail-page" aria-labelledby="detail-title">
    <RouterLink class="secondary-button" :to="{ name: isSeries ? 'series' : 'films' }">
      {{ isSeries ? '← Toutes les séries' : '← Tous les films' }}
    </RouterLink>

    <div v-if="item" class="media-detail">
      <img :src="`https://image.tmdb.org/t/p/w500/${item.poster}`" :alt="`Affiche de ${item.title}`">
      <div class="detail-content">
        <p class="eyebrow">{{ isSeries ? 'LA SÉRIE' : 'LE FILM' }}</p>
        <h1 id="detail-title">{{ item.title }}</h1>
        <p class="movie-meta">{{ item.year }} · {{ item.genre }} · {{ item.duration }} · ★ {{ item.score }}</p>
        <p class="detail-description">{{ item.description }}</p>
        <button class="primary-button" :aria-pressed="favorites.has(item.id, item.type)" @click="favorites.toggle(item.id, item.type)">
          {{ favorites.has(item.id, item.type) ? '✓ Dans ma liste' : '+ Ajouter à ma liste' }}
        </button>
        <small>Catalogue de démonstration : aucune lecture vidéo disponible.</small>
      </div>
    </div>
    <div v-else class="empty-state">
      <h1 id="detail-title">{{ isSeries ? 'Série introuvable' : 'Film introuvable' }}</h1>
      <p>Cette fiche n’existe pas dans le catalogue.</p>
    </div>
  </section>
</template>

<style scoped>
.detail-page > a {
  display: inline-block;
}

.media-detail {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  max-width: 860px;
  margin: 24px auto 0;
  overflow: hidden;
  border: 1px solid #393c43;
  border-radius: 14px;
  background: #1b1d22;
}

.media-detail > img {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
}

.detail-content {
  align-self: center;
  padding: clamp(24px, 4vw, 42px);
}

.detail-description {
  margin: 22px 0;
  color: #b5b8be;
  font-size: 14px;
  line-height: 1.8;
}

.detail-content small {
  display: block;
  margin-top: 20px;
  color: #92969f;
  font-size: 11px;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .media-detail {
    grid-template-columns: 1fr;
  }

  .media-detail > img {
    width: min(100%, 220px);
    margin: 24px auto 0;
    border-radius: 9px;
  }
}
</style>
