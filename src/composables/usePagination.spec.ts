import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import usePagination from './usePagination'

function makeItems(count: number): string[] {
  return Array.from({ length: count }, (_, index) => `item-${index + 1}`)
}

describe('usePagination', () => {
  it('returns the first page of items by default', () => {
    const items = ref(makeItems(20))
    const { pageItems, rangeStart, rangeEnd, totalItems, totalPages } = usePagination(items, 9)

    expect(pageItems.value).toHaveLength(9)
    expect(pageItems.value[0]).toBe('item-1')
    expect(rangeStart.value).toBe(1)
    expect(rangeEnd.value).toBe(9)
    expect(totalItems.value).toBe(20)
    expect(totalPages.value).toBe(3)
  })

  it('navigates between pages and clamps at the bounds', () => {
    const items = ref(makeItems(10))
    const pagination = usePagination(items, 9)

    expect(pagination.hasPreviousPage.value).toBe(false)
    pagination.goToPreviousPage()
    expect(pagination.currentPage.value).toBe(1)

    pagination.goToNextPage()
    expect(pagination.currentPage.value).toBe(2)
    expect(pagination.pageItems.value).toEqual(['item-10'])
    expect(pagination.rangeStart.value).toBe(10)
    expect(pagination.rangeEnd.value).toBe(10)
    expect(pagination.hasNextPage.value).toBe(false)

    pagination.goToNextPage()
    expect(pagination.currentPage.value).toBe(2)
  })

  it('resets to the first page when the source list changes', async () => {
    const items = ref(makeItems(20))
    const pagination = usePagination(items, 9)

    pagination.goToNextPage()
    expect(pagination.currentPage.value).toBe(2)

    items.value = makeItems(5)
    await nextTick()

    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.pageItems.value).toHaveLength(5)
  })

  it('reports an empty range for an empty list', () => {
    const items = ref<string[]>([])
    const { rangeStart, rangeEnd, totalItems, hasNextPage, hasPreviousPage } = usePagination(items, 9)

    expect(rangeStart.value).toBe(0)
    expect(rangeEnd.value).toBe(0)
    expect(totalItems.value).toBe(0)
    expect(hasNextPage.value).toBe(false)
    expect(hasPreviousPage.value).toBe(false)
  })
})
