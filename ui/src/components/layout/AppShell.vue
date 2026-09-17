<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppMapPane from './AppMapPane.vue'
import AppFooter from './AppFooter.vue'
</script>

<template>
  <div class="shell">
    <AppHeader />
    <div class="main">
      <AppSidebar />
      <AppMapPane />
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
