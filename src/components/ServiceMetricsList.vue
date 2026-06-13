<template>
  <ul
    v-if="metrics"
    class="service-metrics"
    data-testid="service-metrics"
  >
    <li class="service-metrics__item">
      <strong>{{ formatLatency(metrics.latency) }}</strong> latency
    </li>
    <li class="service-metrics__item">
      <strong>{{ formatPercent(metrics.uptime) }}</strong> uptime
    </li>
    <li class="service-metrics__item">
      <strong>{{ formatCompactNumber(metrics.requests) }}</strong> requests
      <span class="service-metrics__separator">&middot;</span>
      <strong>{{ formatPercent(metrics.errors) }}</strong> errors
    </li>
  </ul>
  <ul
    v-else
    class="service-metrics"
    data-testid="service-metrics"
  >
    <li class="service-metrics__item service-metrics__item--muted">
      Not configured with runtime yet
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { ServiceMetrics } from '@/types/service'
import { formatCompactNumber, formatLatency, formatPercent } from '@/utils/format'

defineProps<{
  metrics?: ServiceMetrics
}>()
</script>

<style lang="scss" scoped>
.service-metrics {
  color: $color-text-secondary;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  gap: $kui-space-30;
  line-height: 17px;
  list-style: none;
  margin: 0;
  padding: 0;

  strong {
    color: $color-text-primary;
    font-weight: $kui-font-weight-semibold;
  }

  &__item {
    align-items: baseline;
    display: flex;
    gap: 0.5ch;

    &::before {
      align-self: center;
      background-color: $color-metric-bullet;
      border-radius: $kui-border-radius-circle;
      content: '';
      flex-shrink: 0;
      height: 6px;
      margin-right: $kui-space-30;
      width: 6px;
    }

    &--muted {
      color: $color-text-primary;
      font-weight: $kui-font-weight-semibold;

      &::before {
        background-color: $color-status-unpublished;
      }
    }
  }

  &__separator {
    color: $color-text-secondary;
  }
}
</style>
