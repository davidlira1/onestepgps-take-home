<script setup lang="ts">
import { computed } from 'vue'
import type { Device } from '@/types/device'
import { formatRelativeTime } from '@/utils/formatRelativeTime'

const props = defineProps<{
  device: Device
}>()

const coords = computed(() => {
  const { latitude, longitude } = props.device
  if (latitude == null || longitude == null) {
    return null
  }
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
})
</script>

<template>
  <li class="item">
    <div class="heading">
      <p class="name">{{ device.name }}</p>
      <p class="connectivity" :class="{ online: device.online }">
        <span class="dot" aria-hidden="true"></span>
        {{ device.online ? 'Online' : 'Offline' }}
      </p>
    </div>
    <p class="status">
      <span class="drive">{{ device.drive_status }}</span>
      <template v-if="device.drive_status === 'driving'">
        · {{ Math.round(device.speed_kmh) }} km/h
      </template>
    </p>
    <p v-if="coords" class="coords">{{ coords }}</p>
    <p class="updated">Updated {{ formatRelativeTime(device.last_seen_at) }}</p>
  </li>
</template>

<style scoped>
.item {
  --online: #16a34a;
  padding: 14px 20px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.item + .item {
  border-top: none;
}

.heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.name {
  margin: 0;
  font-weight: 600;
}

.connectivity {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  color: var(--muted);
  font-size: 13px;
}

.connectivity.online {
  color: var(--online);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.drive {
  text-transform: capitalize;
}

.status,
.coords,
.updated {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 13px;
}
</style>
