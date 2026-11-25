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

Ce sont des routes Vue Router, pas des endpoints d’API. Le catalogue utilise
le backend et les favoris restent en mémoire pendant la navigation, jusqu’au
rechargement de la page. En production, configurez l’hébergement pour servir
`index.html` sur ces URL afin qu’elles fonctionnent aussi en accès direct.

### API du catalogue

Lancez le backend séparément sur `http://localhost:3000`. Pour changer cette
adresse, créez un fichier `.env.local` dans ce dossier puis relancez Vite :

```env
VITE_API_URL=http://localhost:3000
```

Cette variable est publique : ne placez jamais de clé TMDB dans le frontend.
Le backend doit autoriser l’origine du frontend via CORS.

Le module [catalog.js](./src/data/catalog.js) appelle `GET /films`, `/series`,
`/catalog`, `/films/:id`, `/series/:id`, `/catalog/random`,
`/films/random/10` et `/series/random/10`. Les deux derniers appels sont disponibles
pour de futurs composants. Les listes attendent un tableau TMDB ou un objet
contenant `results` ; `/catalog` attend `{ movies, series }` et les routes de détail
et de sélection aléatoire renvoient un objet TMDB. Les erreurs sont affichées dans
l’interface, sans données de démonstration de remplacement.

Les filtres portent uniquement sur les résultats chargés, pas sur tout TMDB.
Le backend doit encore être disponible pour afficher ces pages.

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```


On veut dans "A decouvrir", ne pas avoir de filtres. Par contre dans series et films, on veut avoir une grande barre de recherche avec une icone de filtres. SI on clique dessus, on a des filtres avancés (année, genre, films/series, notes etc...)