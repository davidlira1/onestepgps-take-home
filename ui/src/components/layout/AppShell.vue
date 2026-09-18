<script setup lang="ts">
import { onMounted } from 'vue'
import { useDevices } from '@/composables/useDevices'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppMapPane from './AppMapPane.vue'
import AppFooter from './AppFooter.vue'

const { devices, loading, error, load } = useDevices()

onMounted(load)
</script>

<template>
  <div class="shell">
    <AppHeader />
    <div class="main">
      <AppSidebar :devices="devices" :loading="loading" :error="error" />
      <AppMapPane :devices="devices" />
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.shell {
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.main {
  display: flex;
  min-height: 0;
}
</style>
