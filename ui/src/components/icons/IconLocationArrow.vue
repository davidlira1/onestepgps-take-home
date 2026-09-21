<script setup lang="ts">
import { LOCATION_ARROW_PATH } from './locationArrowPath'
</script>

<template>
  <svg viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
    <path :d="LOCATION_ARROW_PATH" />
  </svg>
</template>
