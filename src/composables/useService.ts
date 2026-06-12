import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import axios from 'axios'
import type { Service } from '@/types/service'

interface UseServiceReturn {
  service: Ref<Service | null>
  loading: Ref<boolean>
  error: Ref<boolean>
  notFound: ComputedRef<boolean>
  refetch: () => Promise<void>
}

/**
 * Fetches a single service by id for the detail view.
 *
 * The mock API only exposes the collection endpoint, so we narrow it down
 * with the (searchable) id via `/api/services?q={id}` and match exactly —
 * this keeps deep links working without fetching the entire catalog.
 */
export default function useService(serviceId: Readonly<Ref<string>>): UseServiceReturn {
  const service = ref<Service | null>(null)
  const loading = ref(true)
  const error = ref(false)

  let activeController: AbortController | undefined

  const getService = async (): Promise<void> => {
    activeController?.abort()
    const controller = new AbortController()
    activeController = controller

    loading.value = true
    error.value = false
    service.value = null

    try {
      const { data } = await axios.get<Service[]>('/api/services', {
        params: { q: serviceId.value },
        signal: controller.signal,
      })

      service.value = (Array.isArray(data) ? data : []).find(({ id }) => id === serviceId.value) ?? null
    } catch (err) {
      if (axios.isCancel(err)) {
        return
      }
      error.value = true
    } finally {
      if (activeController === controller) {
        loading.value = false
      }
    }
  }

  watch(serviceId, getService, { immediate: true })

  const notFound = computed(() => !loading.value && !error.value && service.value === null)

  return {
    service,
    loading,
    error,
    notFound,
    refetch: getService,
  }
}
