<template>
  <span
    class="service-status-badge"
    :class="`service-status-badge--${status}`"
    data-testid="service-status"
  >
    <CheckCircleIcon
      v-if="status === ServiceStatus.Published"
      color="var(--status-icon-color)"
      decorative
      :size="16"
    />
    <DisabledIcon
      v-else-if="status === ServiceStatus.Unpublished"
      color="var(--status-icon-color)"
      decorative
      :size="16"
    />
    <ClockIcon
      v-else
      color="var(--status-icon-color)"
      decorative
      :size="16"
    />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircleIcon, ClockIcon, DisabledIcon } from '@kong/icons'
import { ServiceStatus } from '@/types/service'

const props = defineProps<{
  status: ServiceStatus
}>()

const STATUS_LABELS: Record<ServiceStatus, string> = {
  [ServiceStatus.Published]: 'Published to portal',
  [ServiceStatus.Unpublished]: 'Unpublished',
  [ServiceStatus.InProgress]: 'In progress',
}

const label = computed(() => STATUS_LABELS[props.status])
</script>

<style lang="scss" scoped>
.service-status-badge {
  align-items: center;
  color: $color-text-secondary;
  display: inline-flex;
  font-size: 13px;
  gap: $kui-space-30;
  line-height: $kui-line-height-30;

  // Kong icons read their colour from the `color` prop; feed it a per-status
  // CSS variable so the icon is tinted while the label stays neutral.
  &--published {
    --status-icon-color: #{$color-status-published};
  }

  &--unpublished {
    --status-icon-color: #{$color-status-unpublished};
  }

  &--in_progress {
    --status-icon-color: #{$color-status-in-progress};
  }
}
</style>
