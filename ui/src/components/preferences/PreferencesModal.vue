<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  theme: string
  saving: boolean
  saveError: string | null
}>()

const emit = defineEmits<{
  close: []
  save: [theme: string]
}>()

const draftTheme = ref(props.theme)

function selectTheme(theme: string) {
  draftTheme.value = theme
}

function save() {
  emit('save', draftTheme.value)
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="dialog" role="dialog" aria-labelledby="prefs-title" aria-modal="true">
      <header class="header">
        <h2 id="prefs-title" class="title">Preferences</h2>
        <button type="button" class="close" aria-label="Close" @click="emit('close')">×</button>
      </header>

      <section class="section">
        <p class="section-label">Appearance</p>

        <p class="field-label">Theme</p>
        <div class="themes">
          <button
            type="button"
            class="theme-card"
            :class="{ selected: draftTheme === 'light' }"
            :disabled="theme === 'light'"
            @click="selectTheme('light')"
          >
            <span class="theme-icon" aria-hidden="true">☀</span>
            Light
          </button>
          <button
            type="button"
            class="theme-card"
            :class="{ selected: draftTheme === 'dark' }"
            :disabled="theme === 'dark'"
            @click="selectTheme('dark')"
          >
            <span class="theme-icon" aria-hidden="true">☾</span>
            Dark
          </button>
        </div>
      </section>

      <p v-if="saveError" class="error">{{ saveError }}</p>

      <footer class="actions">
        <button type="button" class="btn" @click="emit('close')">Cancel</button>
        <button type="button" class="btn primary" :disabled="saving" @click="save">
          {{ saving ? 'Saving…' : 'Save' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: grid;
  place-items: center;
  background: rgb(0 0 0 / 40%);
}

.dialog {
  width: min(420px, calc(100vw - 32px));
  padding: 20px 20px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 12px 32px rgb(0 0 0 / 18%);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.close:hover {
  background: var(--hover);
}

.section {
  margin-bottom: 20px;
}

.section-label {
  margin: 0 0 14px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.field-label {
  margin: 0 0 8px;
  font-size: 14px;
}

.themes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.theme-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.theme-card:hover:not(:disabled) {
  background: var(--hover);
}

.theme-card:disabled {
  opacity: 0.55;
  cursor: default;
}

.theme-card.selected {
  border-color: var(--text);
  background: var(--hover);
}

.theme-icon {
  font-size: 16px;
}

.error {
  margin: 0 0 16px;
  color: #b91c1c;
  font-size: 13px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  padding: 7px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.btn:hover:not(:disabled) {
  background: var(--hover);
}

.btn.primary {
  border-color: #2563eb;
  background: #2563eb;
  color: #fff;
}

.btn.primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn:disabled {
  opacity: 0.65;
  cursor: default;
}
</style>
