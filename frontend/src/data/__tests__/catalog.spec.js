import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getCatalog, getMedia, getMovies, getRandomMedia, getRandomMovies, getRandomSeries,
} from '../catalog'

afterEach(() => vi.unstubAllGlobals())

function respond(data) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  }))
}

describe('API du catalogue', () => {
  it('adapte une page TMDB au format des cartes', async () => {
    respond({
      page: 1,
      results: [{
        id: 42, title: 'Orbite', release_date: '2024-06-01', genre_ids: [878],
        poster_path: '/orbite.jpg', vote_average: 8.25, overview: 'Une aventure.',
      }],
    })
    expect(await getMovies()).toEqual([expect.objectContaining({
      id: 42, type: 'movie', title: 'Orbite', year: '2024',
      genre: 'Science-fiction', poster: 'orbite.jpg', score: '8.3',
    })])
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/films$/))
  })

  it('préserve le type lorsque le film et la série partagent un identifiant', async () => {
    respond({
      movies: [{ id: 1, title: 'Film' }],
      series: { results: [{ id: 1, name: 'Série' }] },
    })
    expect((await getCatalog()).map(({ id, type, title }) => ({ id, type, title }))).toEqual([
      { id: 1, type: 'movie', title: 'Film' },
      { id: 1, type: 'series', title: 'Série' },
    ])
  })

  it('charge la fiche depuis son endpoint et non depuis une liste populaire', async () => {
    respond({ id: 42, name: 'Série', number_of_seasons: 3, genres: [{ name: 'Drame' }] })
    expect(await getMedia(42, true)).toMatchObject({
      id: 42, type: 'series', duration: '3 saison(s)', genre: 'Drame',
    })
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/series\/42$/))
  })

  it('identifie une série sélectionnée au hasard par TMDB', async () => {
    respond({ id: 7, name: 'Série au hasard' })
    expect(await getRandomMedia()).toMatchObject({ type: 'series', title: 'Série au hasard' })
  })

  it('appelle les endpoints de sélection aléatoire par type', async () => {
    respond([{ id: 7, title: 'Film', name: 'Série' }])
    expect((await getRandomMovies())[0].type).toBe('movie')
    expect(fetch).toHaveBeenLastCalledWith(expect.stringMatching(/\/films\/random\/10$/))
    expect((await getRandomSeries())[0].type).toBe('series')
    expect(fetch).toHaveBeenLastCalledWith(expect.stringMatching(/\/series\/random\/10$/))
  })

  it('refuse une liste mal formée au lieu de la remplacer silencieusement', async () => {
    respond({ message: 'Réponse inattendue' })
    await expect(getMovies()).rejects.toThrow('liste de titres invalide')
  })
})
