import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'

interface UsePaginationReturn<T> {
  currentPage: Ref<number>
  pageItems: ComputedRef<readonly T[]>
  totalItems: ComputedRef<number>
  totalPages: ComputedRef<number>
  /** 1-based index of the first visible item, `0` when the list is empty */
  rangeStart: ComputedRef<number>
  /** 1-based index of the last visible item */
  rangeEnd: ComputedRef<number>
  hasPreviousPage: ComputedRef<boolean>
  hasNextPage: ComputedRef<boolean>
  goToPreviousPage: () => void
  goToNextPage: () => void
}

/**
 * Client-side pagination over a reactive list.
 * Resets to the first page whenever the source list changes (e.g. new search
 * results) and clamps the current page if the list shrinks.
 */
export default function usePagination<T>(
  items: Readonly<Ref<readonly T[]>>,
  pageSize = 9,
): UsePaginationReturn<T> {
  const currentPage = ref(1)

  const totalItems = computed(() => items.value.length)
  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize)))

  watch(items, () => {
    currentPage.value = 1
  })

  const pageItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize

    return items.value.slice(start, start + pageSize)
  })

  const rangeStart = computed(() => (totalItems.value === 0 ? 0 : (currentPage.value - 1) * pageSize + 1))
  const rangeEnd = computed(() => Math.min(currentPage.value * pageSize, totalItems.value))

  const hasPreviousPage = computed(() => currentPage.value > 1)
  const hasNextPage = computed(() => currentPage.value < totalPages.value)

  const goToPreviousPage = (): void => {
    if (hasPreviousPage.value) {
      currentPage.value -= 1
    }
  }

  const goToNextPage = (): void => {
    if (hasNextPage.value) {
      currentPage.value += 1
    }
  }

  return {
    currentPage,
    pageItems,
    totalItems,
    totalPages,
    rangeStart,
    rangeEnd,
    hasPreviousPage,
    hasNextPage,
    goToPreviousPage,
    goToNextPage,
  }
}
