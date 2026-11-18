<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'

const auth = useAuthStore()
const favorites = useFavoritesStore()
const route = useRoute()
const router = useRouter()
const menuOpen = ref(false)
const accountButton = ref(null)

watch(() => route.fullPath, closeMenu)

function closeMenu() {
  menuOpen.value = false
}

function onAccountFocusOut(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) closeMenu()
}

function onEscape(event) {
  if (!menuOpen.value) return
  event.stopPropagation()
  closeMenu()
  accountButton.value.focus()
}

function logout() {
  closeMenu()
  auth.logout()
  return router.replace({ name: 'home' })
}
</script>

<template>
  <header class="site-header">
    <RouterLink class="brand" :to="{ name: 'home' }" aria-label="SeenFlix, accueil">seen<span>flix</span><span class="brand-dot">.</span></RouterLink>
    <nav aria-label="Navigation principale">
      <RouterLink :to="{ name: 'home' }">Accueil</RouterLink>
      <RouterLink :to="{ name: 'films' }">Films</RouterLink>
      <RouterLink :to="{ name: 'series' }">Séries</RouterLink>
      <RouterLink :to="{ name: 'favorite' }">
        Favoris <span v-if="favorites.ids.length" class="count">{{ favorites.ids.length }}</span>
      </RouterLink>
    </nav>
    <span class="header-caption">Le cinéma, tout simplement.</span>
    <div class="auth-buttons">
      <template v-if="!auth.isLoggedIn">
        <button class="auth-button signup-button" type="button" disabled title="Inscription bientôt disponible">S'inscrire</button>
        <RouterLink class="auth-button login-button" :to="{ name: 'connexion' }">Connexion</RouterLink>
      </template>
      <div v-else class="account" @focusout="onAccountFocusOut" @keydown.esc="onEscape">
        <button
          ref="accountButton"
          class="account-toggle account-bubble"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="account-links"
          aria-label="Menu compte"
          @click="menuOpen = !menuOpen"
        >👤</button>
        <div v-show="menuOpen" id="account-links" class="account-links">
          <RouterLink :to="{ name: 'profile' }" @click="closeMenu">Profil</RouterLink>
          <RouterLink :to="{ name: 'reviews' }" @click="closeMenu">Mes avis</RouterLink>
          <button type="button" @click="logout">Déconnexion</button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.auth-button {
  padding: 10px 16px;
  background: none;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.signup-button {
  cursor: not-allowed;
  opacity: 0.5;
  color: #96999f;
  border: 2px solid #d8f378;
}

.login-button {
  background: #d8f378;
  color: #171c0b;
  border: 2px solid #d8f378;
}

.login-button:hover:not(:disabled) {
  background: #c8e76a;
  border-color: #c8e76a;
}

.account-button {
  padding: 10px 16px;
  border-radius: 7px;
  background: #ffffff14;
  border: 2px solid #ffffff26;
  color: #fff;
  white-space: nowrap;
}

.account-button:hover {
  background: #ffffff26;
  border-color: #ffffff40;
}

.account-bubble {
  padding: 10px;
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  background: #d8f378;
  color: #171c0b;
  border: none;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.account-bubble:hover {
  background: #c8e76a;
  transform: scale(1.1);
}

.account-bubble:focus {
  outline: 2px solid #d8f378;
  outline-offset: 2px;
}

.account {
  position: relative;
}

.account-links {
  position: absolute;
  z-index: 2;
  top: calc(100% + 8px);
  right: 0;
  min-width: 150px;
  padding: 6px;
  border: 1px solid #393c43;
  border-radius: 9px;
  background: #1b1d22;
}

.account-links a,
.account-links button {
  display: block;
  width: 100%;
  padding: 9px 10px;
  border-radius: 5px;
  background: none;
  text-align: left;
  font-size: 13px;
  color: #fff;
  border: none;
  cursor: pointer;
}

.account-links a:hover,
.account-links button:hover,
.account-links a.router-link-exact-active {
  background: #ffffff14;
}

@media (max-width: 480px) {
  .auth-button {
    padding: 8px 12px;
    font-size: 13px;
  }

  .account-button {
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>
