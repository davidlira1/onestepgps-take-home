<script setup lang="ts">
import IconGear from '@/components/icons/IconGear.vue'
import IconLocationArrow from '@/components/icons/IconLocationArrow.vue'

defineEmits<{
  preferences: []
}>()
</script>

<template>
  <header class="header">
    <div class="brand">
      <span class="logo" aria-hidden="true">
        <IconLocationArrow class="logo-icon" />
      </span>
      <p class="title">
        <span class="app">OneStep GPS</span>
        <span class="sep" aria-hidden="true">|</span>
        <span class="section">Devices</span>
      </p>
    </div>

    <button type="button" class="prefs" @click="$emit('preferences')">
      <IconGear class="prefs-icon" />
      Preferences
    </button>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
}

.logo-icon {
  width: 18px;
  height: 18px;
}

.title {
  margin: 0;
  font-size: 15px;
}

.app {
  font-weight: 600;
}

.sep {
  margin: 0 8px;
  color: var(--border);
}

.section {
  color: var(--muted);
  font-weight: 400;
}

.prefs {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.prefs-icon {
  width: 16px;
  height: 16px;
}

.prefs:hover {
  background: var(--hover);
}
</style>
