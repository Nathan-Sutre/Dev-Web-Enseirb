const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

const genres = {
  12: 'Aventure', 14: 'Fantastique', 16: 'Animation', 18: 'Drame',
  27: 'Horreur', 28: 'Action', 35: 'Comédie', 36: 'Histoire',
  37: 'Western', 53: 'Thriller', 80: 'Crime', 99: 'Documentaire',
  878: 'Science-fiction', 9648: 'Mystère', 10402: 'Musique',
  10749: 'Romance', 10751: 'Familial', 10752: 'Guerre', 10770: 'Téléfilm',
  10759: 'Action et aventure', 10762: 'Enfants', 10763: 'Actualités',
  10764: 'Télé-réalité', 10765: 'Science-fiction', 10766: 'Feuilleton',
  10767: 'Talk-show', 10768: 'Guerre et politique',
}

async function request(path) {
  const response = await fetch(`${apiUrl}${path}`)
  if (!response.ok) {
    const error = new Error(`Impossible de charger les données (HTTP ${response.status}).`)
    error.status = response.status
    throw error
  }
  return response.json()
}

function normalizeMedia(item, type) {
  const date = type === 'series' ? item.first_air_date : item.release_date
  const genre = item.genres?.[0]?.name || genres[item.genre_ids?.[0]] || 'Genre non renseigné'
  return {
    id: item.id,
    type,
    title: type === 'series' ? item.name : item.title,
    year: date?.slice(0, 4) || 'Année non renseignée',
    genre,
    duration: type === 'series'
      ? (item.number_of_seasons ? `${item.number_of_seasons} saison(s)` : '')
      : (item.runtime ? `${Math.floor(item.runtime / 60)} h ${String(item.runtime % 60).padStart(2, '0')}` : ''),
    score: typeof item.vote_average === 'number' ? item.vote_average.toFixed(1) : '—',
    poster: item.poster_path?.replace(/^\//, '') || null,
    backdrop: item.backdrop_path?.replace(/^\//, '') || null,
    description: item.overview || 'Aucun résumé disponible.',
  }
}

function normalizeList(data, type) {
  const items = Array.isArray(data) ? data : data?.results
  if (!Array.isArray(items)) {
    throw new Error('Le backend a renvoyé une liste de titres invalide.')
  }
  return items.map((item) => normalizeMedia(item, type))
}

export async function getMovies() {
  return normalizeList(await request('/films'), 'movie')
}

export async function getSeries() {
  return normalizeList(await request('/series'), 'series')
}

export async function getCatalog() {
  const data = await request('/catalog')
  return [...normalizeList(data.movies, 'movie'), ...normalizeList(data.series, 'series')]
}

export async function getMedia(id, isSeries = false) {
  const type = isSeries ? 'series' : 'movie'
  const path = isSeries ? '/series' : '/films'
  return normalizeMedia(await request(`${path}/${encodeURIComponent(id)}`), type)
}

export async function getRandomMedia() {
  const item = await request('/catalog/random')
  return normalizeMedia(item, item.media_type === 'tv' || item.name ? 'series' : 'movie')
}

export async function getRandomMovies() {
  return normalizeList(await request('/films/random/10'), 'movie')
}

export async function getRandomSeries() {
  return normalizeList(await request('/series/random/10'), 'series')
}
