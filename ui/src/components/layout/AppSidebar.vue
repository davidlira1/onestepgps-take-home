<template>
  <aside class="sidebar">
    <div class="sidebar-inner">Sidebar</div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  overflow-y: auto;
  background: var(--surface);
  border-right: 1px solid var(--border);
}

.sidebar-inner {
  padding: 16px 20px;
}
</style>
