import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import axios from 'axios'
import useService from './useService'
import { makeService } from '@/test/fixtures'

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

describe('useService', () => {
  beforeEach(() => {
    mockedGet.mockReset()
  })

  it('fetches the service matching the id', async () => {
    const service = makeService({ id: 'abc-123' })
    // The search endpoint can return partial matches; only the exact id counts
    mockedGet.mockResolvedValueOnce({ data: [service, makeService({ id: 'abc-1234' })] })

    const result = useService(ref('abc-123'))
    await flushPromises()

    expect(mockedGet).toHaveBeenCalledWith(
      '/api/services',
      expect.objectContaining({ params: { q: 'abc-123' } }),
    )
    expect(result.service.value).toEqual(service)
    expect(result.notFound.value).toBe(false)
  })

  it('reports not-found when no service matches the id', async () => {
    mockedGet.mockResolvedValueOnce({ data: [] })

    const result = useService(ref('missing-id'))
    await flushPromises()

    expect(result.service.value).toBeNull()
    expect(result.notFound.value).toBe(true)
    expect(result.error.value).toBe(false)
  })

  it('flags an error when the request fails', async () => {
    mockedGet.mockRejectedValueOnce(new Error('network down'))

    const result = useService(ref('abc-123'))
    await flushPromises()

    expect(result.error.value).toBe(true)
    expect(result.notFound.value).toBe(false)
  })
})
