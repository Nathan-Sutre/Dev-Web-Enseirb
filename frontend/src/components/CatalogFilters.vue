<script setup>
defineProps({
  genres: { type: Array, required: true },
  searchLabel: { type: String, default: 'Rechercher un titre' },
  showTypeFilter: { type: Boolean, default: true },
})

const search = defineModel('search', { type: String, required: true })
const genre = defineModel('genre', { type: String, required: true })
const type = defineModel('type', { type: String, default: 'all' })

const types = [
  { value: 'all', label: 'Tous les types' },
  { value: 'movie', label: 'Film' },
  { value: 'series', label: 'Série' },
]
</script>

<template>
  <div class="catalog-heading">
    <slot name="heading"></slot>
    <label class="search">
      <span aria-hidden="true">⌕</span>
      <input v-model="search" type="search" :placeholder="`${searchLabel}…`" :aria-label="searchLabel">
    </label>
  </div>
  <div class="catalog-toolbar">
    <div class="filter-groups">
      <div v-if="showTypeFilter" class="filter-options" role="group" aria-label="Type de contenu">
        <button
          v-for="item in types"
          :key="item.value"
          type="button"
          :class="{ selected: type === item.value }"
          :aria-pressed="type === item.value"
          @click="type = item.value"
        >
          {{ item.label }}
        </button>
      </div>
      <div class="filter-options" role="group" aria-label="Genres">
        <button
          v-for="item in genres"
          :key="item"
          type="button"
          :class="{ selected: genre === item }"
          :aria-pressed="genre === item"
          @click="genre = item"
        >
          {{ item }}
        </button>
      </div>
    </div>
    <span v-if="$slots.results" class="results-count"><slot name="results"></slot></span>
  </div>
</template>

<style scoped>
.catalog-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.search {
  display: flex;
  gap: 12px;
  align-items: center;
  background: #1b1d22;
  border: 1px solid #2b2d33;
  border-radius: 8px;
  padding: 10px 14px;
  width: 270px;
}

.search > span {
  font-size: 25px;
  color: #91959d;
  line-height: 1;
}

.search input {
  background: none;
  border: 0;
  min-width: 0;
  width: 100%;
  color: #fff;
  font-size: 12px;
}

.catalog-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 28px 0;
}

.filter-groups {
  display: grid;
  gap: 12px;
}

.filter-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-options button {
  background: transparent;
  border: 1px solid #303238;
  border-radius: 6px;
  padding: 8px 15px;
  color: #a4a7ae;
  font-size: 11px;
}

.filter-options button.selected {
  background: #d8f378;
  color: #171c0b;
  border-color: #d8f378;
  font-weight: 650;
}

.results-count {
  font-size: 11px;
  color: #777c85;
  white-space: nowrap;
}

@media (max-width: 760px) {
  .catalog-heading {
    align-items: start;
    flex-direction: column;
  }

  .search {
    width: 100%;
    margin-top: 4px;
  }

  .catalog-toolbar {
    align-items: start;
  }

  .filter-options {
    gap: 7px;
  }

  .filter-options button {
    padding: 8px 10px;
  }

  .results-count {
    padding-top: 9px;
  }
}
</style>
