import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import App from '../../App.vue'
import { createAppRouter } from '../index'

enableAutoUnmount(afterEach)
beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

async function openPage(path) {
  const router = createAppRouter(createMemoryHistory())
  await router.push(path)
  const wrapper = mount(App, { global: { plugins: [createPinia(), router] } })
  return { router, wrapper }
}

async function follow(link) {
  await link.trigger('click')
  await flushPromises()
}

describe('navigation SeenFlix', () => {
  it('ouvre le profil de démonstration depuis la barre de navigation', async () => {
    const { router, wrapper } = await openPage('/home')

    await follow(wrapper.get('nav a[href="/profile"]'))
    expect(router.currentRoute.value.path).toBe('/profile')
    expect(wrapper.get('main h1').text()).toBe('Profil')
  })

  it('redirige la racine vers l’accueil et ouvre la fiche du film en vedette', async () => {
    const { router, wrapper } = await openPage('/')
    expect(router.currentRoute.value.path).toBe('/home')
    expect(wrapper.get('nav a[aria-current="page"]').text()).toBe('Accueil')

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
