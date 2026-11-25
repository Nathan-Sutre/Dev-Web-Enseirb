import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import App from '../../App.vue'
import { createAppRouter } from '../index'

enableAutoUnmount(afterEach)

const movie = {
  id: 1, title: 'Interstellar', release_date: '2014-11-05',
  genre_ids: [878], vote_average: 8.7, poster_path: '/poster.jpg',
  overview: 'Une expédition spatiale.',
}
const series = [
  { id: 1, name: 'Breaking Bad', first_air_date: '2008-01-20', genre_ids: [18] },
  { id: 2, name: 'Stranger Things', first_air_date: '2016-07-15', genre_ids: [10765] },
]

beforeEach(() => {
  sessionStorage.clear()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  vi.stubGlobal('fetch', vi.fn(async (url) => {
    const path = new URL(url).pathname
    const data = {
      '/films': [movie],
      '/series': series,
      '/catalog': { movies: [movie], series },
      '/catalog/random': movie,
      '/films/1': movie,
      '/series/1': series[0],
      '/series/2': series[1],
    }[path]
    return {
      ok: data !== undefined,
      status: data === undefined ? 404 : 200,
      json: async () => data,
    }
  }))
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

async function openPage(path) {
  const pinia = createPinia()
  const router = createAppRouter(pinia, createMemoryHistory())
  await router.push(path)
  const wrapper = mount(App, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return { router, wrapper }
}

async function follow(link) {
  await link.trigger('click')
  await flushPromises()
}

describe('navigation SeenFlix', () => {
  it('signale une erreur du backend au lieu de montrer un catalogue vide', async () => {
    fetch.mockResolvedValue({ ok: false, status: 502 })
    const { wrapper } = await openPage('/films')
    expect(wrapper.get('[role="alert"]').text()).toContain('502')
    expect(wrapper.find('.empty-state').exists()).toBe(false)
  })

  it('distingue une erreur réseau sur une fiche d’un titre introuvable', async () => {
    fetch.mockRejectedValue(new Error('Connexion au backend impossible'))
    const { wrapper } = await openPage('/films/1')
    expect(wrapper.get('[role="alert"]').text()).toContain('Connexion au backend impossible')
    expect(wrapper.find('.empty-state').exists()).toBe(false)
  })

  it('ne laisse pas une ancienne réponse écraser le catalogue après navigation', async () => {
    let resolveMovies
    fetch.mockImplementation((url) => new Promise((resolve) => {
      if (new URL(url).pathname === '/films') resolveMovies = resolve
      else resolve({ ok: true, json: async () => series })
    }))
    const { router, wrapper } = await openPage('/films')
    expect(wrapper.get('[role="status"]').text()).toContain('Chargement')
    await router.push('/series')
    await flushPromises()
    resolveMovies({ ok: true, json: async () => [movie] })
    await flushPromises()
    expect(wrapper.findAll('.movie-card h3 a').map((link) => link.text())).toEqual([
      'Breaking Bad', 'Stranger Things',
    ])
  })

  it('combine les filtres du catalogue Découvrir et ouvre la bonne fiche de série', async () => {
    const { router, wrapper } = await openPage('/home')
    expect(wrapper.get('.movie-card h3 a[href="/films/1"]').text()).toBe('Interstellar')
    expect(wrapper.get('.movie-card h3 a[href="/series/1"]').text()).toBe('Breaking Bad')

    const buttons = wrapper.findAll('.catalog-toolbar button')
    await buttons.find((button) => button.text() === 'Série').trigger('click')
    await buttons.find((button) => button.text() === 'Science-fiction').trigger('click')
    expect(wrapper.findAll('.movie-card h3 a').map((link) => link.text())).toEqual(['Stranger Things'])

    const search = wrapper.get('.catalog input[type="search"]')
    await search.setValue('Interstellar')
    expect(wrapper.find('.movie-card').exists()).toBe(false)
    await wrapper.get('.empty-state button').trigger('click')
    expect(search.element.value).toBe('')
    expect(wrapper.find('.movie-card h3 a[href="/films/1"]').exists()).toBe(true)

    await follow(wrapper.get('.movie-card h3 a[href="/series/1"]'))
    expect(router.currentRoute.value.path).toBe('/series/1')
  })

  it('ouvre le formulaire de connexion en gardant une seule barre de navigation', async () => {
    const { router, wrapper } = await openPage('/home')
    expect(wrapper.get('.auth-buttons button[disabled]').text()).toBe("S'inscrire")
    expect(wrapper.find('.account-toggle').exists()).toBe(false)

    await follow(wrapper.get('.auth-buttons a[href="/connexion"]'))
    await vi.waitFor(() => expect(router.currentRoute.value.path).toBe('/connexion'))
    await flushPromises()

    await follow(wrapper.get('main button'))
    expect(router.currentRoute.value.path).toBe('/profile')
    expect(wrapper.get('main').text()).toContain('Compte de démonstration')
    expect(wrapper.find('.auth-buttons a[href="/connexion"]').exists()).toBe(false)

    await wrapper.get('.account-toggle').trigger('click')
    expect(wrapper.get('.account-toggle').attributes('aria-expanded')).toBe('true')
    await wrapper.get('.account-toggle').trigger('keydown', { key: 'Escape' })
    expect(wrapper.get('.account-links').isVisible()).toBe(false)

    await wrapper.get('.account-toggle').trigger('click')
    await follow(wrapper.get('.account-links a[href="/mes-avis"]'))
    expect(router.currentRoute.value.path).toBe('/mes-avis')
    expect(wrapper.get('main h1').text()).toBe('Mes avis')
    expect(wrapper.get('.account-links').isVisible()).toBe(false)

    await wrapper.get('.account-toggle').trigger('click')
    await follow(wrapper.get('.account-links a[href="/profile"]'))
    expect(router.currentRoute.value.path).toBe('/profile')

    await wrapper.get('.account-toggle').trigger('click')
    await follow(wrapper.get('.account-links button'))
    expect(router.currentRoute.value.path).toBe('/home')
    expect(wrapper.find('.auth-buttons a[href="/connexion"]').exists()).toBe(true)
    expect(wrapper.find('.account-toggle').exists()).toBe(false)

    const reopened = await openPage('/profile')
    expect(reopened.router.currentRoute.value.path).toBe('/connexion')
  })

  it('redirige les visiteurs vers la connexion et conserve la session après rechargement', async () => {
    const { router, wrapper } = await openPage('/mes-avis')
    expect(router.currentRoute.value.path).toBe('/connexion')

    await follow(wrapper.get('main button'))
    expect(router.currentRoute.value.path).toBe('/mes-avis')

    const reopened = await openPage('/profile')
    expect(reopened.router.currentRoute.value.path).toBe('/profile')
    expect(reopened.wrapper.get('main').text()).toContain('Compte de démonstration')
  })

  it('redirige la racine vers l’accueil et ouvre la fiche du film en vedette', async () => {
    const { router, wrapper } = await openPage('/')
    expect(router.currentRoute.value.path).toBe('/home')
    expect(wrapper.get('nav a[aria-current="page"]').text()).toBe('Découvrir')

    await follow(wrapper.get('.hero a[href="/films/1"]'))
    expect(router.currentRoute.value.path).toBe('/films/1')
    expect(wrapper.get('main h1').text()).toBe('Interstellar')
    expect(wrapper.get('nav a[href="/films"]').classes()).toContain('router-link-active')
  })

  it('conserve les favoris en changeant de page et ouvre la fiche canonique depuis la liste', async () => {
    const { router, wrapper } = await openPage('/films')
    expect(wrapper.get('main h1').text()).toBe('Films.')
    await wrapper.get('button[aria-label="Ajouter Interstellar à ma liste"]').trigger('click')

    await follow(wrapper.get('nav a[href="/favorite"]'))
    expect(router.currentRoute.value.path).toBe('/favorite')
    expect(wrapper.findAll('.movie-card')).toHaveLength(1)
    await follow(wrapper.get('.movie-card h3 a'))
    expect(router.currentRoute.value.path).toBe('/films/1')
    expect(wrapper.get('main h1').text()).toBe('Interstellar')

    await wrapper.get('main button[aria-pressed="true"]').trigger('click')
    await follow(wrapper.get('nav a[href="/favorite"]'))
    expect(wrapper.find('.movie-card').exists()).toBe(false)
    expect(wrapper.get('main a[href="/films"]').text()).toBe('Voir tous les films')
  })

  it('filtre les films et les séries favoris qui partagent un identifiant', async () => {
    const { router, wrapper } = await openPage('/home')
    await wrapper.get('button[aria-label="Ajouter Interstellar à ma liste"]').trigger('click')
    await follow(wrapper.get('.movie-card h3 a[href="/series/1"]'))
    await wrapper.get('main button[aria-pressed="false"]').trigger('click')
    await follow(wrapper.get('nav a[href="/favorite"]'))
    expect(router.currentRoute.value.path).toBe('/favorite')
    expect(wrapper.findAll('.movie-card h3 a').map((link) => link.text())).toEqual(['Interstellar', 'Breaking Bad'])

    const types = wrapper.findAll('[aria-label="Type de contenu"] button')
    await types.find((button) => button.text() === 'Série').trigger('click')
    expect(wrapper.findAll('.movie-card h3 a').map((link) => link.text())).toEqual(['Breaking Bad'])
    await wrapper.get('button[aria-label="Retirer Breaking Bad de ma liste"]').trigger('click')
    expect(wrapper.find('.movie-card').exists()).toBe(false)
    await types.find((button) => button.text() === 'Film').trigger('click')
    expect(wrapper.findAll('.movie-card h3 a').map((link) => link.text())).toEqual(['Interstellar'])
  })

  it('affiche une fiche de série en accès direct et signale un identifiant inconnu', async () => {
    const { router, wrapper } = await openPage('/series/1')
    expect(wrapper.get('main h1').text()).toBe('Breaking Bad')

    await follow(wrapper.get('nav a[href="/series"]'))
    expect(router.currentRoute.value.path).toBe('/series')
    await follow(wrapper.get('.movie-card h3 a[href="/series/2"]'))
    expect(router.currentRoute.value.path).toBe('/series/2')
    expect(wrapper.get('main h1').text()).toBe('Stranger Things')

    await router.push('/series/inconnue')
    await flushPromises()
    expect(wrapper.get('main h1').text()).toBe('Série introuvable')
  })
})
