import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MediaCatalog from '../components/MediaCatalog.vue'
import MediaDetailView from '../views/MediaDetailView.vue'
import ProfileView from '../views/ProfileView.vue'

export function createAppRouter(history = createWebHistory(import.meta.env.BASE_URL)) {
  return createRouter({
    history,
    scrollBehavior(to, from, savedPosition) {
      return savedPosition ?? { top: 0 }
    },
    routes: [
      { path: '/', redirect: { name: 'home' } },
      { path: '/home', name: 'home', component: HomeView },
      {
        path: '/films',
        children: [
          { path: '', name: 'films', component: MediaCatalog, props: { title: 'Films' } },
          { path: ':id', name: 'film-detail', component: MediaDetailView, props: true },
        ],
      },
      {
        path: '/series',
        children: [
          { path: '', name: 'series', component: MediaCatalog, props: { title: 'Séries', isSeries: true } },
          { path: ':id', name: 'serie-detail', component: MediaDetailView, props: (route) => ({ id: route.params.id, isSeries: true }) },
        ],
      },
      {
        path: '/favorite',
        name: 'favorite',
        component: MediaCatalog,
        props: { title: 'Ma liste', favoritesOnly: true, mixed: true },
      },
      { path: '/profile', name: 'profile', component: ProfileView },
      {
        path: '/connexion',
        name: 'connexion',
        component: () => import('../views/AuthView.vue'),
      },
    ],
  })
}

export default createAppRouter()
