<template>
  <span
    class="service-status-badge"
    :class="`service-status-badge--${status}`"
    data-testid="service-status"
  >
    <IconCheck v-if="status === ServiceStatus.Published" />
    <IconClose v-else-if="status === ServiceStatus.Unpublished" />
    <IconProgress v-else />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconClose from '@/components/icons/IconClose.vue'
import IconProgress from '@/components/icons/IconProgress.vue'
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
  font-size: 1.3rem;
  gap: 0.7rem;
  line-height: 2rem;

  svg {
    flex-shrink: 0;
  }

  &--published svg {
    color: $color-status-published;
  }

  &--unpublished svg {
    color: $color-status-unpublished;
  }

  &--in_progress svg {
    color: $color-status-in-progress;
  }
}
</style>
