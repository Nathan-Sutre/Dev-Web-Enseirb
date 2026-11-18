<script setup>
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<template>
  <section class="catalog" aria-labelledby="profile-title">
    <h1 id="profile-title">Profil</h1>
    <p>Nom : {{ auth.user?.name }}</p>
    <p>Ce profil est fictif et n’est pas lié à un compte sur le serveur.</p>
  </section>
</template>
