<template>
  <nav
    aria-label="Pagination"
    class="catalog-pagination"
    data-testid="pagination"
  >
    <KButton
      appearance="tertiary"
      aria-label="Previous page"
      class="catalog-pagination__button"
      data-testid="pagination-previous"
      :disabled="!hasPreviousPage"
      icon
      @click="emit('previous')"
    >
      <ArrowLeftIcon decorative />
    </KButton>
    <p
      aria-live="polite"
      class="catalog-pagination__summary"
      data-testid="pagination-summary"
    >
      <span class="catalog-pagination__range">{{ rangeStart }} to {{ rangeEnd }}</span>
      of {{ totalItems }} {{ totalItems === 1 ? 'service' : 'services' }}
    </p>
    <KButton
      appearance="tertiary"
      aria-label="Next page"
      class="catalog-pagination__button"
      data-testid="pagination-next"
      :disabled="!hasNextPage"
      icon
      @click="emit('next')"
    >
      <ArrowRightIcon decorative />
    </KButton>
  </nav>
</template>

<script setup lang="ts">
import { KButton } from '@kong/kongponents'
import { ArrowLeftIcon, ArrowRightIcon } from '@kong/icons'

defineProps<{
  rangeStart: number
  rangeEnd: number
  totalItems: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}>()

const emit = defineEmits<{
  (event: 'previous'): void
  (event: 'next'): void
}>()
</script>

<style lang="scss" scoped>
.catalog-pagination {
  align-items: center;
  display: flex;
  gap: $kui-space-80;
  justify-content: center;

  // Reshape Kong's icon button into the mock's round, outlined arrow control
  &__button.k-button {
    border: 1px solid rgb(20 86 203 / 20%);
    border-radius: $kui-border-radius-circle;
    color: $color-link;
    height: 44px;
    width: 44px;

    &:disabled {
      border-color: rgb(0 0 0 / 10%);
      color: $color-text-muted;
    }
  }

  &__summary {
    color: $color-text-secondary;
    font-size: 13px;
    line-height: $kui-line-height-30;
    margin: 0;
    text-align: center;
  }

  &__range {
    color: $color-text-primary;
    font-weight: $kui-font-weight-semibold;
  }
}
</style>
