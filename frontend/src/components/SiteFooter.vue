<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer>
    <RouterLink class="brand" :to="{ name: 'home' }">seen<span>flix</span>.</RouterLink>
    <p>De grandes histoires, à portée d’écran.</p>
    <span>Catalogue de démonstration · Affiches TMDB</span>
  </footer>
</template>

<style scoped>
footer {
  border-top: 1px solid #26282e;
  margin: 0 5%;
  padding: 25px 0;
  display: flex;
  align-items: center;
  gap: 24px;
}

.brand {
  font-size: 22px;
}

p,
footer > span {
  font-size: 10px;
  color: #777c85;
}

footer > span {
  margin-left: auto;
}

@media (max-width: 760px) {
  footer {
    flex-wrap: wrap;
    gap: 12px;
  }

  footer > span {
    margin: 0;
    width: 100%;
  }
}
</style>
