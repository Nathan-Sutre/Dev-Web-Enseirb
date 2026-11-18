<script setup>
import { ref } from 'vue'

const inscription = ref(false)
const email = ref('')
const password = ref('')
const message = ref('')

function changerMode() {
  inscription.value = !inscription.value
  password.value = ''
  message.value = ''
}

function envoyer() {
  // Le formulaire sera relié à l’API d’authentification plus tard.
  message.value = 'Mode démonstration : l’authentification n’est pas encore disponible.'
  password.value = ''
}
</script>

<template>
  <div class="auth-layout">
    <section class="auth-intro">
      <p class="eyebrow">VOTRE PROCHAINE SÉANCE COMMENCE ICI</p>
      <h1>De grandes histoires.<br>Un espace à vous<span>.</span></h1>
      <p>Retrouvez vos films préférés et gardez vos prochaines découvertes à portée de main.</p>
      <span class="auth-signature">LE CINÉMA, TOUT SIMPLEMENT.</span>
    </section>

    <section class="auth-panel" aria-labelledby="auth-title">
      <p class="eyebrow">BIENVENUE SUR SEENFLIX</p>
      <h2 id="auth-title">{{ inscription ? 'Créer un compte' : 'Heureux de vous revoir' }}<span>.</span></h2>
      <p class="auth-subtitle">{{ inscription ? 'Vos prochaines découvertes vous attendent.' : 'Connectez-vous pour retrouver votre liste.' }}</p>

      <form @submit.prevent="envoyer">
        <label for="email">Adresse e-mail</label>
        <input id="email" v-model="email" type="email" name="email" autocomplete="email" placeholder="vous@exemple.fr" required>

        <label for="password">Mot de passe</label>
        <input id="password" v-model="password" type="password" name="password" :autocomplete="inscription ? 'new-password' : 'current-password'" :minlength="inscription ? 8 : undefined" :aria-describedby="inscription ? 'password-help' : undefined" placeholder="Votre mot de passe" required>
        <small v-if="inscription" id="password-help">8 caractères minimum.</small>

        <button class="primary-button" type="submit">{{ inscription ? 'Créer mon compte' : 'Se connecter' }} <span aria-hidden="true">→</span></button>
        <p v-if="message" class="auth-message" role="status">{{ message }}</p>
      </form>

      <p class="auth-switch">
        {{ inscription ? 'Déjà un compte ?' : 'Pas encore de compte ?' }}
        <button type="button" @click="changerMode">{{ inscription ? 'Se connecter' : 'S’inscrire' }}</button>
      </p>
    </section>
  </div>
</template>

<style scoped>
.auth-subtitle, .auth-switch {
  color: #a3a6ae;
  font-size: 13px;
}

.auth-switch button {
  color: #d8f378;
}

.auth-layout {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  min-height: calc(100svh - 120px);
  margin: 0 2% 30px;
  border: 1px solid #292c32;
  border-radius: 14px;
  overflow: hidden;
}

.auth-intro {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  padding: 60px 10%;
  background: linear-gradient(0deg, #101114ed, #10111488),
    url('https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg') center / cover;
}

.auth-intro .eyebrow, .auth-intro h1 span {
  color: #d8f378;
}

.auth-intro h1 {
  font-size: clamp(32px, 3.5vw, 50px);
}

.auth-intro > p:not(.eyebrow) {
  max-width: 340px;
  color: #b5b8be;
  font-size: 14px;
  line-height: 1.9;
}

.auth-signature {
  margin-top: 60px;
  font-size: 10px;
  letter-spacing: 2px;
  color: #a3a6ae;
}

.auth-panel {
  width: 100%;
  max-width: 450px;
  margin: auto;
  padding: 48px 30px;
}

.auth-panel h2 {
  font-size: 29px;
}

.auth-subtitle {
  margin: 14px 0 32px;
  line-height: 1.6;
}

form {
  display: flex;
  flex-direction: column;
}

form label {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 600;
}

form input {
  width: 100%;
  min-width: 0;
  margin-bottom: 22px;
  padding: 14px;
  border: 1px solid #303238;
  border-radius: 7px;
  background: #1b1d22;
  color: #fff;
  font-size: 13px;
}

form small {
  margin: -12px 0 22px;
  font-size: 11px;
  color: #a3a6ae;
}

form .primary-button {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  margin-top: 4px;
}

.auth-message {
  color: #d8f378;
  font-size: 12px;
  line-height: 1.6;
}

.auth-switch {
  margin-top: 28px;
  text-align: center;
}

.auth-switch button {
  padding: 4px;
  background: none;
  font-weight: 600;
}

@media (max-width: 760px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }

  .auth-intro {
    padding: 35px 7%;
  }

  .auth-signature {
    display: none;
  }

  .auth-panel {
    padding: 35px 24px;
  }
}
</style>
