<template>
  <KBadge
    class="service-versions-pill"
    data-testid="service-versions"
  >
    {{ count }} {{ count === 1 ? 'version' : 'versions' }}
  </KBadge>
</template>

<script setup lang="ts">
import { KBadge } from '@kong/kongponents'

defineProps<{
  count: number
}>()
</script>

<style lang="scss" scoped>
// KBadge renders Kong's blue "info" badge by default; recolour it to the mock's
// soft-blue pill by overriding the design tokens the component reads, and round
// it fully into a pill.
.service-versions-pill {
  --kui-color-background-info-weakest: #{$color-pill-background};
  --kui-color-text-info: #{$color-pill-text};

  font-weight: $kui-font-weight-semibold;

  :deep(.badge-content) {
    border-radius: $kui-border-radius-round;
    padding: $kui-space-20 $kui-space-60;
  }
}
</style>
