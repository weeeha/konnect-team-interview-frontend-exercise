<template>
  <nav
    aria-label="Pagination"
    class="catalog-pagination"
    data-testid="pagination"
  >
    <button
      aria-label="Previous page"
      class="catalog-pagination__button"
      data-testid="pagination-previous"
      :disabled="!hasPreviousPage"
      type="button"
      @click="emit('previous')"
    >
      <IconArrow direction="left" />
    </button>
    <p
      aria-live="polite"
      class="catalog-pagination__summary"
      data-testid="pagination-summary"
    >
      <span class="catalog-pagination__range">{{ rangeStart }} to {{ rangeEnd }}</span>
      of {{ totalItems }} {{ totalItems === 1 ? 'service' : 'services' }}
    </p>
    <button
      aria-label="Next page"
      class="catalog-pagination__button"
      data-testid="pagination-next"
      :disabled="!hasNextPage"
      type="button"
      @click="emit('next')"
    >
      <IconArrow direction="right" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import IconArrow from '@/components/icons/IconArrow.vue'

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
  gap: 2.4rem;
  justify-content: center;

  &__button {
    align-items: center;
    background-color: transparent;
    border: 1px solid rgb(20 86 203 / 20%);
    border-radius: 50%;
    color: $color-link;
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
    height: 4.4rem;
    justify-content: center;
    transition: background-color 0.2s ease, border-color 0.2s ease;
    width: 4.4rem;

    &:hover:not(:disabled) {
      background-color: rgb(20 86 203 / 6%);
      border-color: rgb(20 86 203 / 40%);
    }

    &:focus-visible {
      outline: 2px solid rgb(20 86 203 / 40%);
      outline-offset: 2px;
    }

    &:disabled {
      border-color: rgb(0 0 0 / 10%);
      color: $color-text-muted;
      cursor: default;
    }
  }

  &__summary {
    color: $color-text-secondary;
    font-size: 1.3rem;
    line-height: 2rem;
    margin: 0;
    text-align: center;
  }

  &__range {
    color: $color-text-primary;
    font-weight: 600;
  }
}
</style>
