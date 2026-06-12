import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import axios from 'axios'
import useServices from './useServices'
import { makeServices } from '@/test/fixtures'

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

describe('useServices', () => {
  beforeEach(() => {
    mockedGet.mockReset()
  })

  it('fetches services on initialization', async () => {
    const services = makeServices(3)
    mockedGet.mockResolvedValueOnce({ data: services })

    const result = useServices()

    expect(result.loading.value).toBe(true)

    await flushPromises()

    expect(mockedGet).toHaveBeenCalledWith('/api/services', expect.objectContaining({ params: undefined }))
    expect(result.services.value).toEqual(services)
    expect(result.loading.value).toBe(false)
    expect(result.error.value).toBe(false)
  })

  it('refetches with the query when the search ref changes', async () => {
    mockedGet.mockResolvedValue({ data: makeServices(1) })
    const query = ref('')

    useServices(query)
    await flushPromises()

    query.value = 'dogs'
    await nextTick()
    await flushPromises()

    expect(mockedGet).toHaveBeenCalledTimes(2)
    expect(mockedGet).toHaveBeenLastCalledWith(
      '/api/services',
      expect.objectContaining({ params: { q: 'dogs' } }),
    )
  })

  it('flags an error and clears stale results when the request fails', async () => {
    mockedGet.mockRejectedValueOnce(new Error('network down'))

    const result = useServices()
    await flushPromises()

    expect(result.error.value).toBe(true)
    expect(result.services.value).toEqual([])
    expect(result.loading.value).toBe(false)
  })

  it('recovers after a successful refetch', async () => {
    mockedGet.mockRejectedValueOnce(new Error('network down'))

    const result = useServices()
    await flushPromises()
    expect(result.error.value).toBe(true)

    const services = makeServices(2)
    mockedGet.mockResolvedValueOnce({ data: services })

    await result.refetch()

    expect(result.error.value).toBe(false)
    expect(result.services.value).toEqual(services)
  })

  it('ignores canceled requests so a newer search keeps its state', async () => {
    // First request never settles until we reject it as canceled
    mockedGet.mockRejectedValueOnce(new axios.CanceledError('canceled'))
    const services = makeServices(2)
    mockedGet.mockResolvedValueOnce({ data: services })

    const result = useServices()
    await result.refetch()
    await flushPromises()

    expect(result.error.value).toBe(false)
    expect(result.services.value).toEqual(services)
  })

  it('treats a malformed response body as an empty list', async () => {
    mockedGet.mockResolvedValueOnce({ data: { unexpected: 'shape' } })

    const result = useServices()
    await flushPromises()

    expect(result.services.value).toEqual([])
    expect(result.error.value).toBe(false)
  })
})
