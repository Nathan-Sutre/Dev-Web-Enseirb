<script setup>
import { computed, ref } from 'vue'

const movies = [
  { id: 1, title: 'Interstellar', year: 2014, genre: 'Science-fiction', duration: '2 h 49', score: '8.7', poster: 'gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', description: 'Alors que la Terre devient inhabitable, une équipe d’explorateurs traverse un trou de ver à la recherche d’un nouvel avenir pour l’humanité.' },
  { id: 2, title: 'Dune : Deuxième Partie', year: 2024, genre: 'Science-fiction', duration: '2 h 46', score: '8.5', poster: '1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', description: 'Paul Atréides s’unit à Chani et aux Fremen pour mener la révolte sur Arrakis et affronter son destin.' },
  { id: 3, title: 'The Batman', year: 2022, genre: 'Action', duration: '2 h 56', score: '7.8', poster: '74xTEgt7R36Fpooo50r9T25onhq.jpg', description: 'Dans les rues de Gotham, Batman suit les indices d’un mystérieux tueur qui s’attaque aux élites de la ville.' },
  { id: 4, title: 'La La Land', year: 2016, genre: 'Romance', duration: '2 h 08', score: '8.0', poster: 'uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', description: 'À Los Angeles, une actrice et un pianiste de jazz partagent leurs rêves, leurs ambitions et une histoire d’amour.' },
  { id: 5, title: 'Inception', year: 2010, genre: 'Science-fiction', duration: '2 h 28', score: '8.8', poster: 'oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', description: 'Un spécialiste de l’extraction des rêves accepte une dernière mission : implanter une idée dans l’esprit d’un homme.' },
  { id: 6, title: 'The Grand Budapest Hotel', year: 2014, genre: 'Comédie', duration: '1 h 40', score: '8.1', poster: 'eWdyYQreja6JGCzqHWXpWHDrrPo.jpg', description: 'Un concierge légendaire et son jeune protégé se retrouvent au cœur d’une aventure autour d’un tableau et d’un héritage.' },
  { id: 7, title: 'Oppenheimer', year: 2023, genre: 'Drame', duration: '3 h 00', score: '8.3', poster: 'ptpr0kGAckfQkJeJIt8st5dglvd.jpg', description: 'Le parcours du physicien Robert Oppenheimer, au cœur du projet Manhattan et de ses conséquences.' },
  { id: 8, title: 'Spider-Man : Across the Spider-Verse', year: 2023, genre: 'Animation', duration: '2 h 20', score: '8.6', poster: '8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', description: 'Miles Morales traverse le multivers et rencontre une équipe de Spider-héros chargée de protéger son existence.' },
]
const genres = ['Tous', 'Science-fiction', 'Action', 'Drame', 'Comédie', 'Animation', 'Romance']
const search = ref('')
const genre = ref('Tous')
const onlyFavorites = ref(false)
const favorites = ref([])
const selectedMovie = ref(null)
const filteredMovies = computed(() => movies.filter(movie =>
  movie.title.toLocaleLowerCase('fr').includes(search.value.trim().toLocaleLowerCase('fr')) &&
  (genre.value === 'Tous' || movie.genre === genre.value) &&
  (!onlyFavorites.value || favorites.value.includes(movie.id)),
))
function toggleFavorite(id) {
  favorites.value = favorites.value.includes(id)
    ? favorites.value.filter(favorite => favorite !== id)
    : [...favorites.value, id]
}
function showCatalog(favoritesOnly = false) {
  onlyFavorites.value = favoritesOnly
  genre.value = 'Tous'
  search.value = ''
}
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="#" @click.prevent="showCatalog()" aria-label="SeenFlix, accueil">seen<span>flix</span><span class="brand-dot">.</span></a>
      <nav aria-label="Navigation principale">
        <button :class="{ active: !onlyFavorites }" @click="showCatalog()">Découvrir</button>
        <button :class="{ active: onlyFavorites }" @click="showCatalog(true)">Ma liste <span v-if="favorites.length" class="count">{{ favorites.length }}</span></button>
      </nav>
      <span class="header-caption">Le cinéma, tout simplement.</span>
      <div class="avatar" aria-label="Profil de démonstration">S</div>
    </header>

    <main>
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-content">
          <p class="eyebrow"><span></span> LA SÉLECTION SEENFLIX</p>
          <h1 id="hero-title">Au-delà des étoiles.<br>Au cœur du cinéma.</h1>
          <p class="hero-description">Des histoires qui vous transportent. Des films qui restent.<br>Découvrez votre prochaine grande émotion.</p>
          <div class="hero-movie"><strong>INTERSTELLAR</strong><span>2014</span><span>2 h 49</span><span class="quality">HD</span></div>
          <div class="hero-actions">
            <button class="primary-button" @click="selectedMovie = movies[0]"><span aria-hidden="true">▶</span> Découvrir le film</button>
            <button class="secondary-button" @click="toggleFavorite(1)">{{ favorites.includes(1) ? '✓ Dans ma liste' : '+ Ma liste' }}</button>
          </div>
        </div>
        <div class="hero-label"><span>À L’AFFICHE</span><strong>Interstellar</strong><small>Un film de Christopher Nolan</small></div>
      </section>

      <section class="catalog" aria-labelledby="catalog-title">
        <div class="catalog-heading">
          <div><p class="eyebrow">VOTRE PROCHAINE SÉANCE</p><h2 id="catalog-title">{{ onlyFavorites ? 'Ma liste de films' : 'À découvrir' }}<span>.</span></h2></div>
          <label class="search"><span aria-hidden="true">⌕</span><input v-model="search" type="search" placeholder="Rechercher un film…" aria-label="Rechercher un film"></label>
        </div>
        <div class="catalog-toolbar">
          <div class="genre-filters" aria-label="Genres"><button v-for="item in genres" :key="item" :class="{ selected: genre === item }" :aria-pressed="genre === item" @click="genre = item">{{ item }}</button></div>
          <span class="results-count">{{ filteredMovies.length }} film{{ filteredMovies.length > 1 ? 's' : '' }}</span>
        </div>
        <div v-if="filteredMovies.length" class="movie-grid">
          <article v-for="movie in filteredMovies" :key="movie.id" class="movie-card">
            <div class="poster-wrap">
              <button class="poster-button" @click="selectedMovie = movie" :aria-label="`Voir la fiche de ${movie.title}`">
                <img :src="`https://image.tmdb.org/t/p/w500/${movie.poster}`" :alt="`Affiche de ${movie.title}`" loading="lazy">
                <span class="poster-overlay"><span>Découvrir ↗</span></span>
              </button>
              <span class="rating"><span aria-hidden="true">★</span> {{ movie.score }}</span>
              <button class="favorite-button" :class="{ saved: favorites.includes(movie.id) }" :aria-label="`${favorites.includes(movie.id) ? 'Retirer' : 'Ajouter'} ${movie.title} ${favorites.includes(movie.id) ? 'de' : 'à'} ma liste`" :aria-pressed="favorites.includes(movie.id)" @click="toggleFavorite(movie.id)">{{ favorites.includes(movie.id) ? '✓' : '+' }}</button>
            </div>
            <h3><button @click="selectedMovie = movie">{{ movie.title }}</button></h3>
            <p class="movie-meta">{{ movie.year }}<span>•</span>{{ movie.genre }}</p>
          </article>
        </div>
        <div v-else class="empty-state"><h3>{{ onlyFavorites ? 'Votre prochaine séance commence ici.' : 'Aucun film trouvé.' }}</h3><p>{{ onlyFavorites ? 'Ajoutez des films à votre liste avec le bouton + sur les affiches.' : 'Essayez un autre titre ou un autre genre.' }}</p><button class="secondary-button" @click="showCatalog()">Voir tous les films</button></div>
      </section>
    </main>
    <footer><a class="brand" href="#">seen<span>flix</span>.</a><p>De grandes histoires, à portée d’écran.</p><span>Catalogue de démonstration · Affiches TMDB</span></footer>

    <div v-if="selectedMovie" class="modal-backdrop" @click.self="selectedMovie = null" @keydown.esc="selectedMovie = null">
      <section class="movie-modal" role="dialog" aria-modal="true" aria-labelledby="movie-title" tabindex="-1">
        <button class="close-button" aria-label="Fermer la fiche" autofocus @click="selectedMovie = null">×</button>
        <img :src="`https://image.tmdb.org/t/p/w500/${selectedMovie.poster}`" :alt="`Affiche de ${selectedMovie.title}`">
        <div class="modal-content"><p class="eyebrow">LE FILM</p><h2 id="movie-title">{{ selectedMovie.title }}</h2><p class="movie-meta">{{ selectedMovie.year }} · {{ selectedMovie.genre }} · {{ selectedMovie.duration }}</p><p class="modal-description">{{ selectedMovie.description }}</p><button class="primary-button" @click="toggleFavorite(selectedMovie.id)">{{ favorites.includes(selectedMovie.id) ? '✓ Dans ma liste' : '+ Ajouter à ma liste' }}</button><small>Catalogue de démonstration : aucune lecture vidéo disponible.</small></div>
      </section>
    </div>
  </div>
</template>
