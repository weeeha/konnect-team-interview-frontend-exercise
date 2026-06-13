import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'
import ServiceCatalog from './ServiceCatalog.vue'
import { makeService, makeServices } from '@/test/fixtures'

vi.mock('axios', async (importActual) => {
  const actual = (await importActual()) as { default: typeof axios }

  return {
    default: {
      ...actual.default,
      get: vi.fn(),
    },
  }
})

const mockedGet = vi.mocked(axios.get)

function mountCatalog() {
  return mount(ServiceCatalog, {
    global: {
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

describe('ServiceCatalog', () => {
  beforeEach(() => {
    mockedGet.mockReset()
    mockedGet.mockResolvedValue({ data: makeServices(12) })
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('shows the search input', async () => {
    const wrapper = mountCatalog()
    await flushPromises()

    expect(wrapper.findTestId('search-input').isVisible()).toBe(true)
  })

  it('shows a loading skeleton while the request is in flight', async () => {
    let resolveRequest: (value: { data: unknown }) => void = () => undefined
    mockedGet.mockImplementationOnce(() => new Promise((resolve) => {
      resolveRequest = resolve
    }))

    const wrapper = mountCatalog()

    expect(wrapper.findTestId('loading-state').exists()).toBe(true)

    resolveRequest({ data: makeServices(2) })
    await flushPromises()

    expect(wrapper.findTestId('loading-state').exists()).toBe(false)
    expect(wrapper.findAll('[data-testid="service-card"]')).toHaveLength(2)
  })

  it('renders the first page of services with a pagination summary', async () => {
    const wrapper = mountCatalog()
    await flushPromises()

    expect(wrapper.findAll('[data-testid="service-card"]')).toHaveLength(9)
    expect(wrapper.findTestId('pagination-summary').text()).toContain('1 to 9 of 12 services')
    expect(wrapper.findTestId('pagination-previous').attributes('disabled')).toBeDefined()
  })

  it('paginates to the next and previous page', async () => {
    const wrapper = mountCatalog()
    await flushPromises()

    await wrapper.findTestId('pagination-next').trigger('click')

    expect(wrapper.findAll('[data-testid="service-card"]')).toHaveLength(3)
    expect(wrapper.findTestId('pagination-summary').text()).toContain('10 to 12 of 12 services')
    expect(wrapper.findTestId('pagination-next').attributes('disabled')).toBeDefined()

    await wrapper.findTestId('pagination-previous').trigger('click')

    expect(wrapper.findTestId('pagination-summary').text()).toContain('1 to 9 of 12 services')
  })

  it('searches the API with the debounced query', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mountCatalog()
      await vi.advanceTimersByTimeAsync(0)

      expect(mockedGet).toHaveBeenCalledTimes(1)

      // Rapid keystrokes only produce a single request for the final value
      await wrapper.findTestId('search-input').setValue('do')
      await vi.advanceTimersByTimeAsync(100)
      await wrapper.findTestId('search-input').setValue('dogs')
      await vi.advanceTimersByTimeAsync(250)

      expect(mockedGet).toHaveBeenCalledTimes(2)
      expect(mockedGet).toHaveBeenLastCalledWith(
        '/api/services',
        expect.objectContaining({ params: { q: 'dogs' } }),
      )
    } finally {
      vi.useRealTimers()
    }
  })

  it('properly handles no services returned from the API', async () => {
    mockedGet.mockResolvedValue({ data: [] })

    const wrapper = mountCatalog()
    await flushPromises()

    expect(wrapper.findTestId('no-results').isVisible()).toBe(true)
    expect(wrapper.findTestId('pagination').exists()).toBe(false)
  })

  it('offers to clear the search when a query has no matches', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mountCatalog()
      await vi.advanceTimersByTimeAsync(0)

      mockedGet.mockResolvedValue({ data: [] })
      await wrapper.findTestId('search-input').setValue('nothing-matches')
      await vi.advanceTimersByTimeAsync(250)

      expect(wrapper.findTestId('no-results').text()).toContain('nothing-matches')

      mockedGet.mockResolvedValue({ data: [makeService()] })
      await wrapper.findTestId('clear-search-button').trigger('click')
      await vi.advanceTimersByTimeAsync(250)

      expect(wrapper.findAll('[data-testid="service-card"]')).toHaveLength(1)
    } finally {
      vi.useRealTimers()
    }
  })

  it('shows an error state with a working retry action', async () => {
    mockedGet.mockReset()
    mockedGet.mockRejectedValueOnce(new Error('network down'))

    const wrapper = mountCatalog()
    await flushPromises()

    expect(wrapper.findTestId('error-state').isVisible()).toBe(true)

    mockedGet.mockResolvedValueOnce({ data: makeServices(2) })
    await wrapper.findTestId('retry-button').trigger('click')
    await flushPromises()

    expect(wrapper.findTestId('error-state').exists()).toBe(false)
    expect(wrapper.findAll('[data-testid="service-card"]')).toHaveLength(2)
  })

  it('opens and closes the create service package dialog', async () => {
    const wrapper = mountCatalog()
    await flushPromises()

    // KModal renders inline and only while visible
    expect(wrapper.findTestId('modal').exists()).toBe(false)

    await wrapper.findTestId('create-service-package').trigger('click')
    expect(wrapper.findTestId('modal').exists()).toBe(true)

    await wrapper.findTestId('modal-close-icon').trigger('click')
    await flushPromises()

    expect(wrapper.findTestId('modal').exists()).toBe(false)
  })
})
