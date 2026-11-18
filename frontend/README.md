# frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Navigation SeenFlix

La barre de navigation est définie dans [NavBar.vue](./src/components/NavBar.vue)
et reste visible sur toutes les pages grâce à [App.vue](./src/App.vue).

| URL | Page |
| --- | --- |
| `/` ou `/home` | Accueil (`/` redirige vers `/home`) |
| `/films` | Catalogue des films |
| `/films/:id` | Fiche d’un film, par exemple `/films/1` |
| `/series` | Catalogue des séries |
| `/series/:id` | Fiche d’une série, par exemple `/series/1` |
| `/favorite` | Films favoris ; chaque film ouvre sa fiche `/films/:id` |
| `/profile` | Profil du compte de démonstration, après connexion |
| `/mes-avis` | Page des avis du profil, sans publication pour le moment |
| `/connexion` | Connexion en un clic au compte de démonstration |

La connexion de démonstration n’utilise ni API, ni identifiant, ni mot de passe.
L’état est conservé dans `sessionStorage` pour l’onglet et effacé à la déconnexion.
Le bouton « S’inscrire » est désactivé. Les redirections des pages de compte
sont côté client uniquement et ne remplacent pas une authentification serveur.

Ce sont des routes Vue Router, pas des endpoints d’API. Le catalogue est une
démonstration et les favoris restent en mémoire pendant la navigation, jusqu’au
rechargement de la page. En production, configurez l’hébergement pour servir
`index.html` sur ces URL afin qu’elles fonctionnent aussi en accès direct.

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```
