import { ref, watch, type Ref } from 'vue'
import axios from 'axios'
import type { Service } from '@/types/service'

interface UseServicesReturn {
  services: Ref<Service[]>
  loading: Ref<boolean>
  error: Ref<boolean>
  refetch: () => Promise<void>
}

/**
 * Fetches the list of services from the API.
 *
 * When a reactive `searchQuery` is provided, the list is refetched whenever
 * the query changes (search is performed server-side via `/api/services?q=`).
 * In-flight requests are aborted when superseded so a slow earlier response
 * can never overwrite the results of a newer one.
 */
export default function useServices(searchQuery?: Readonly<Ref<string>>): UseServicesReturn {
  const services = ref<Service[]>([])
  const loading = ref(true)
  const error = ref(false)

  let activeController: AbortController | undefined

  const getServices = async (): Promise<void> => {
    activeController?.abort()
    const controller = new AbortController()
    activeController = controller

    loading.value = true
    error.value = false

    try {
      const query = searchQuery?.value.trim()
      const { data } = await axios.get<Service[]>('/api/services', {
        params: query ? { q: query } : undefined,
        signal: controller.signal,
      })

      // Guard against a malformed (e.g. proxied error page) response body
      services.value = Array.isArray(data) ? data : []
    } catch (err) {
      // A canceled request means a newer one is in flight; keep its state
      if (axios.isCancel(err)) {
        return
      }
      services.value = []
      error.value = true
    } finally {
      if (activeController === controller) {
        loading.value = false
      }
    }
  }

  if (searchQuery) {
    watch(searchQuery, getServices, { immediate: true })
  } else {
    getServices()
  }

  return {
    services,
    loading,
    error,
    refetch: getServices,
  }
}
