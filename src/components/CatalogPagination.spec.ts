import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CatalogPagination from './CatalogPagination.vue'

function mountPagination(props: Partial<InstanceType<typeof CatalogPagination>['$props']> = {}) {
  return mount(CatalogPagination, {
    props: {
      rangeStart: 1,
      rangeEnd: 9,
      totalItems: 42,
      hasPreviousPage: false,
      hasNextPage: true,
      ...props,
    },
  })
}

describe('CatalogPagination', () => {
  it('renders the visible range and total', () => {
    const wrapper = mountPagination()

    expect(wrapper.findTestId('pagination-summary').text().replace(/\s+/g, ' ')).toBe('1 to 9 of 42 services')
  })

  it('uses a singular noun when there is exactly one service', () => {
    const wrapper = mountPagination({ rangeStart: 1, rangeEnd: 1, totalItems: 1, hasNextPage: false })

    expect(wrapper.findTestId('pagination-summary').text().replace(/\s+/g, ' ')).toBe('1 to 1 of 1 service')
  })

  it('disables the arrows at the list boundaries', () => {
    const wrapper = mountPagination({ hasPreviousPage: false, hasNextPage: false })

    expect(wrapper.findTestId('pagination-previous').attributes('disabled')).toBeDefined()
    expect(wrapper.findTestId('pagination-next').attributes('disabled')).toBeDefined()
  })

  it('emits navigation events when the arrows are clicked', async () => {
    const wrapper = mountPagination({ hasPreviousPage: true, hasNextPage: true })

    await wrapper.findTestId('pagination-previous').trigger('click')
    await wrapper.findTestId('pagination-next').trigger('click')

    expect(wrapper.emitted('previous')).toHaveLength(1)
    expect(wrapper.emitted('next')).toHaveLength(1)
  })
})
